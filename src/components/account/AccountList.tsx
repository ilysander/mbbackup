import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TextStyle,
} from 'react-native';
import API from '../../api';
import {
  AccountsCAItem,
  AccountsCCItem,
  AccountsCTSItem,
  CreditLinesItem,
  DepositsItem,
  LoansItem,
  PreferencesUserDataModifyPreResponse,
  WidgetsProductsResponse,
} from '../../api/backend/response/Execute';
import { ResponseBody } from '../../api/util/Request';
import Colors from '../../resources/constants/Colors';
import Validate from '../../resources/functions/Validate';
import Sanitizer from '../../resources/functions/Sanitizer';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';
import { Log } from '../../resources/log';
import { Amount } from '../../resources/money';
import ModalInfoNoEmail from '../email/ModalInfoNoEmail';
import ButtonLink from '../ui/ButtonLink';
import Loading from '../ui/Loading';
import Panel from '../ui/Panel';
import Separator from '../ui/Separator';
import NewAccountFlashMessage from '../ui/NewAccountFlashMessage';
import AccountItem from './AccountItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
const TAG = '[AccountList]';

const styles = StyleSheet.create({
  textLinkView: {
    top: -7,
  } as ViewStyle,
  separator: {
    marginHorizontal: 20,
  } as ViewStyle,
  colorFlashMessage: {
    color: Colors.accent,
  } as TextStyle,
  containerMargin: {
    marginBottom: 0,
  } as ViewStyle,
  viewNewAccount: {
    alignItems: 'center',
    marginBottom: 40,
  } as ViewStyle,
  linkTextTitle: {
    textAlign: 'center',
    ...Font({ weight: 'Regular', style: 'Italic' }),
    color: Colors.grey5,
  } as TextStyle,
});

export interface AccountListProps {
  navigation: NativeStackNavigationProp<any, any, undefined>
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  onLoansLoaded?: (loans: LoansItem[]) => void;
  user: PreferencesUserDataModifyPreResponse;
  isLoadingProfile: boolean;
}

export interface AccountListState {
  isLoading: boolean;
  accountsCTS: AccountsCTSItem[];
  accountsCC: AccountsCCItem[];
  accountsCA: AccountsCAItem[];
  creditLines: CreditLinesItem[];
  deposits: DepositsItem[];
  otherLoans: LoansItem[];
  showModalEmail: boolean;
}

export default class AccountList extends React.Component<
  AccountListProps,
  AccountListState
> {
  state: AccountListState = {
    isLoading: false,
    accountsCTS: [],
    accountsCC: [],
    accountsCA: [],
    creditLines: [],
    deposits: [],
    otherLoans: [],
    showModalEmail: false,
  };

  componentDidMount() {
    this.load();
  }

  safeReturnValue(value: any) {
    if (!value) {
      return {
        ok: true,
      };
    }
    return value;
  }

  sumSolesCA(value: any) {
    const sumTotal = value.products.reduce((total: any, product: any) => {
      if (product.currency === '1') {
        if (product.hasOwnProperty('availableBalance')) {
          return total + product.availableBalance;
        } else {
          return total;
        }
      } else {
        return total;
      }
    }, 0);

    return sumTotal === 0
      ? '(not available)'
      : Math.round(sumTotal * 100) / 100;
  }

  sumDolaresCA(value: any) {
    const sumTotal = value.products.reduce((total: any, product: any) => {
      if (product.currency === '2') {
        if (product.hasOwnProperty('availableBalance')) {
          return total + product.availableBalance;
        } else {
          return total;
        }
      } else {
        return total;
      }
    }, 0);

    return sumTotal === 0
      ? '(not available)'
      : Math.round(sumTotal * 100) / 100;
  }

  sumTotalCTS(value: any) {
    const sumTotal = value.products.reduce((total: any, product: any) => {
      if (product.hasOwnProperty('balance')) {
        return total + product.balance;
      } else {
        return total;
      }
    }, 0);

    return sumTotal === 0
      ? '(not available)'
      : Math.round(sumTotal * 100) / 100;
  }

  sumTotalDPF(value: any) {
    const sumTotal = value.products.reduce((total: any, product: any) => {
      if (product.hasOwnProperty('capital')) {
        return total + product.capital;
      } else {
        return total;
      }
    }, 0);

    return sumTotal === 0
      ? '(not available)'
      : Math.round(sumTotal * 100) / 100;
  }

  getLoanPosition(loans: { products: any[] }, position: number): any {
    const products = loans?.products;
    const loan = products[position - 1];
    if (typeof loan === 'undefined') {
      return '(not available)';
    }
    return loan;
  }

  setStateByResponse = (body: ResponseBody<WidgetsProductsResponse>) => {
    const { onLoansLoaded } = this.props;
    const data = this.safeReturnValue(body.data);
    const productMap = this.safeReturnValue(data.productMap);

    const loans = this.safeReturnValue(productMap.loans).products || [];
    const accountsCTS =
      this.safeReturnValue(productMap.accountsCTS).products || [];
    const accountsCC =
      this.safeReturnValue(productMap.accountsCC).products || [];
    const accountsCA =
      this.safeReturnValue(productMap.accountsCA).products || [];
    const creditLines =
      this.safeReturnValue(productMap.creditLines).products || [];
    const deposits = this.safeReturnValue(productMap.deposits).products || [];

    typeof onLoansLoaded === 'function' && onLoansLoaded(loans);

    return this.setState({
      accountsCTS,
      accountsCC,
      accountsCA,
      creditLines,
      deposits,
    });
  };
  load = async () => {
    const { isLoading } = this.state;

    if (isLoading) {
      Log.info(TAG, 'load', 'now already isLoading');
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.widgetsProductMobile();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const body = this.safeReturnValue(response.body);
      if (body.code === API.ResponseCode.OK) {
        this.setStateByResponse(body);
      } else {
        // Emitter.emit<AlertEvent>('onAlert', {
        //   tag: TAG,
        //   method: 'load',
        //   e: ErrorRequest.Default,
        // });
      }
    } catch (e) {
      Log.exception(TAG, 'load', e);
      // Emitter.emit<AlertEvent>('onAlert', {
      //   tag: TAG,
      //   method: 'load',
      //   e,
      // });
    }
    this.setState({ isLoading: false });
  };

  goCreateAccount = () => {
    const { user } = this.props;
    if (!user._mail) {
      this.setState({ showModalEmail: true });
      return;
    }
    this.props.navigation.navigate('NewAccount');
  };

  hasResultsAccounts = () => {
    const { accountsCTS, accountsCC, accountsCA, deposits } = this.state;
    return !!(
      accountsCTS.length ||
      accountsCC.length ||
      accountsCA.length ||
      deposits.length
    );
  };
  closeEmailModal = () => {
    this.setState({ showModalEmail: false });
  };

  render() {
    const {
      accountsCTS,
      accountsCC,
      accountsCA,
      deposits,
      isLoading,
      showModalEmail,
    } = this.state;
    const {
      navigation,
      accessibilityLabel,
      style,
      user,
      isLoadingProfile,
    } = this.props;
    const hasResultsAccounts = this.hasResultsAccounts();
    const totalItems =
      accountsCTS.length +
      accountsCC.length +
      accountsCA.length +
      deposits.length;
    const isAllowedNewAccount = Validate.isAllowedNewAccount();

    const hasResults = hasResultsAccounts;
    let i = 0;
    return (
      <View
        style={style}
        accessibilityLabel={accessibilityLabel || 'accountlist'}
      >
        {showModalEmail && (
          <ModalInfoNoEmail
            accessibilityLabel={'newaccount_flashmessage_modalinfo_noemail'}
            navigation={navigation}
            onClose={this.closeEmailModal}
            user={user}
          />
        )}
        {isLoading && !hasResults && (
          <Loading margin={'large'} size={'large'} color={Colors.primary} />
        )}
        {!hasResultsAccounts && !isLoading && (
          <Panel
            accessibilityLabel={'accountlist_my_savings'}
            title={L.accountlist_my_savings}
            contentStyle={styles.containerMargin}
            titleStyle={{ color: Colors.grey3 }}
            childrenView={
              <NewAccountFlashMessage
                user={user}
                navigation={navigation}
                title={L.queriesscreen_flashmessage_title}
                message={
                  <Text>
                    {isAllowedNewAccount
                      ? L.queriesscreen_flashmessage_message_newaccount
                      : L.queriesscreen_flashmessage_message}
                  </Text>
                }
                styleColor={styles.colorFlashMessage}
                typeColor={'accent'}
              />
            }
          />
        )}
        {hasResultsAccounts && (
          <>
            <Panel
              accessibilityLabel={'accountlist_my_savings'}
              title={L.accountlist_my_savings}
            >
              {accountsCA.map(item => {
                i++;
                return (
                  <View key={item.idProduct}>
                    <AccountItem
                      accessibilityLabel={'accountlist_accountca'}
                      item={item}
                      type={'accountCA'}
                      navigation={navigation}
                      name={Sanitizer.cleanProductLabel(item.shortLabel, item)}
                      balance={Amount.format(
                        item.availableBalance,
                        item.currency
                      )}
                      balanceDescription={L.accountlist_balance_description_ca}
                      hasDetail
                    />
                    {i !== totalItems && <Separator style={styles.separator} />}
                  </View>
                );
              })}
              {accountsCC.map(item => {
                i++;
                return (
                  <View key={item.idProduct}>
                    <AccountItem
                      accessibilityLabel={'accountlist_accountcc'}
                      item={item}
                      type={'accountCC'}
                      navigation={navigation}
                      name={Sanitizer.cleanProductLabel(item.shortLabel, item)}
                      balance={Amount.format(
                        item.availableBalance,
                        item.currency
                      )}
                      balanceDescription={L.accountlist_balance_description_cc}
                      hasDetail
                    />

                    {i !== totalItems && <Separator style={styles.separator} />}
                  </View>
                );
              })}
              {deposits.map(item => {
                i++;
                return (
                  <View key={item.idProduct}>
                    <AccountItem
                      accessibilityLabel={'accountlist_deposit'}
                      item={item}
                      type={'deposit'}
                      navigation={navigation}
                      name={Sanitizer.cleanProductLabel(item.shortLabel, item)}
                      balance={Amount.format(item.capital, item.currency)}
                      balanceDescription={L.accountlist_balance_description_dpf}
                      hasDetail
                    />
                    {i !== totalItems && <Separator style={styles.separator} />}
                  </View>
                );
              })}
              {accountsCTS.map(item => {
                i++;
                return (
                  <View key={item.idProduct}>
                    <AccountItem
                      accessibilityLabel={'accountlist_accountcts'}
                      item={item}
                      type={'accountCTS'}
                      navigation={navigation}
                      name={Sanitizer.cleanProductLabel(item.shortLabel, item)}
                      balance={Amount.format(item.balance, item.currency)}
                      balanceDescription={L.accountlist_balance_description_cts}
                      hasDetail
                    />
                    {i !== totalItems && <Separator style={styles.separator} />}
                  </View>
                );
              })}
            </Panel>

            {isAllowedNewAccount && !isLoadingProfile && (
              <View style={styles.viewNewAccount}>
                <Text style={styles.linkTextTitle}>
                  {L.queriesscreen_flashmessage_textLink}
                </Text>
                <ButtonLink
                  accessibilityLabel={'newaccount_textlink_flashmessage'}
                  style={styles.textLinkView}
                  onPress={this.goCreateAccount}
                  title={L.newaccountscreen_txtLink}
                  imageSource={require('../../assets/images/arrow-icon.png')}
                  imagePosition={'right'}
                />
              </View>
            )}
          </>
        )}
      </View>
    );
  }
}

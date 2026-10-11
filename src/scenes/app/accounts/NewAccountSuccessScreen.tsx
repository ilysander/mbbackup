import * as React from 'react';
import {
  withFocused,
  FocusedProps,
} from '../../../components/screen/ScreenContainer';
import {
  View,
  StyleSheet,
  ViewStyle,
  Image,
  ImageStyle,
  BackHandler,
  TextStyle,
} from 'react-native';
import {
  Container,
  FormSteps,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
  NetworkStatusAlert,
  Header,
  LoadingOverlay,
  Happy,
  Button,
  CardView,
  DetailItem,
} from '../../../components/ui';
import Size from '../../../resources/dimensions/Size';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../components/transactions/ShareReceipt';
import { L } from '../../../resources/language';
import API from '../../../api';
import Log from '../../../resources/log/Log';
import { CoreReadTransactionInstantCashResponse } from '../../../api/backend/response/Execute';
import { Font } from '../../../resources/functions';
import NewAccountInfoSuccess from '../../../components/ui/NewAccountInfoSuccess';
import { Emitter } from '../../../resources/listeners';
import { AccountSendResponse } from '../../../api/backend/response/NewAccount';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
const moment = require('moment');

const styles = StyleSheet.create({
  buttons: {
    marginTop: 20,
    marginBottom: 32,
  } as ViewStyle,
  footer: {
    alignSelf: 'center',
    marginTop: 20,
  } as ViewStyle,
  header: {
    marginVertical: 10,
    marginHorizontal: 30,
  } as ViewStyle,
  titleHappy: {
    ...Font({ weight: 'Bold', style: 'Italic' }),
    marginBottom: 3,
  } as TextStyle,
  infoEmail: {
    marginTop: 20,
    alignItems: 'center',
  } as TextStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  marginDetail: {
    marginBottom: 10,
  } as ViewStyle,
  happy: {
    height: 150,
    paddingTop: 0,
    marginTop: 0,
    paddingBottom: 20,
  } as ViewStyle,
  contentHappy: {
    paddingBottom: 20,
  } as ViewStyle,
  cardView: {
    alignItems: 'center',
  } as ViewStyle,
  flags: {
    width: '80%',
    height: 32,
  } as ImageStyle,
  content: {
    paddingTop: 0,
  } as ViewStyle,
  detailContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  } as ViewStyle,
  marginButton: {
    marginBottom: 20,
  } as ViewStyle,
  channels: {
    marginTop: 20,
  } as ViewStyle,
  callMessage: {
    marginTop: 20,
  } as ViewStyle,
});
export interface Params {
  idTransaction: string;
  accountResume: AccountSendResponse;
  email: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
  // email: string;
}

export interface State {
  isLoading: boolean;
  isLoadingLoan: boolean;
  transaction?: CoreReadTransactionInstantCashResponse;
}
const TAG = '[NewAccountSuccessScreen]';
class NewAccountSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.newaccountsuccessscreen_title,
  //   headerLeft: <View />,
  //   gesturesEnabled: false,
  // };

  state: State = {
    isLoading: false,
    isLoadingLoan: false,
  };

  shareView!: ShareReceipt | null;

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      return false;
    }
    this.goToConsultas();
    return true;
  };

  goToConsultas = () => {
    const { navigation } = this.props;
    navigation.navigate('Queries');
    Emitter.emit('onTourManagerStart', true);
  };

  updateMail = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };
  share = () => {
    this.shareView &&
      this.shareView.shareConstance(L.newaccountsuccessscreen_share_title);
  };
  goToLoan = async () => {
    const { navigation } = this.props;
    const { transaction } = this.state;
    if (!transaction) {
      return;
    }

    this.setState({ isLoadingLoan: true });
    try {
      const response = await API.Execute.loansRead(transaction.data.loan, '');
      navigation.navigate('Loan', { item: response.body.data.loan });
    } catch (e) {
      Log.warn(TAG, 'goToLoan', e);
    }
    this.setState({ isLoadingLoan: false });
  };

  generateDataReceipt = () => {
    const { route } = this.props;

    // const accountResume = navigation.getParam('accountResume');
    const accountResume = route.params && route.params.accountResume;

    const format = accountResume.Account.openingdate.includes('-')
      ? 'YYYY-MM-DD HH:mm:ss'
      : 'DD/MM/YYYY HH:mm:ss';

    const dateOpenin = moment(
      accountResume.Account.openingdate +
      ' ' +
      accountResume.Account.openingtime,
      format
    )
      .format('DD MMM YYYY h:mm:ss a')
      .replace('am', 'a.m.')
      .replace('pm', 'p.m.');

    const content: ShareReceiptItem[] = [
      {
        title: L.newaccountsuccessscreen_typeaccount,
        details: [accountResume.product.description],
      },
      {
        title: L.newaccountsuccessscreen_titular,
        details: [accountResume.Client._name],
      },
      {
        title: L.newaccountsuccessscreen_number,
        details: [
          accountResume.Operation ? accountResume.Operation.number : '',
        ],
      },
      {
        title: L.newaccountsuccessscreen_date,
        details: [dateOpenin],
      },
    ];
    return content;
  };

  render() {
    const { isFocused, route } = this.props;
    const { isLoading } = this.state;
    // const email = navigation.getParam('email');
    const email = route.params && route.params.accountResume;
    const content = this.generateDataReceipt();
    return (
      <Container>
        <FormSteps total={3} current={3} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical style={styles.content}>
              <Happy
                accessibilityLabel={'newaccountsuccessscreen_happy'}
                title={L.newaccountsuccessscreen_happy_title}
                subtitle={L.newaccountsuccessscreen_happy_subtitle}
                style={styles.happy}
                titleStyle={styles.titleHappy}
                contentStyle={styles.contentHappy}
              />
              <NetworkStatusAlert style={styles.networkStatus} />
              <CardView style={styles.cardView}>
                <LoadingOverlay isLoading={isLoading} duration={200} />
                <Image
                  resizeMode={'stretch'}
                  style={styles.flags}
                  source={require('../../../assets/images/flags-large.png')}
                />
                <Header
                  center
                  title={L.newaccountsuccessscreen_header_title}
                  accessibilityLabel={'newaccountsuccessscreen_header'}
                  style={styles.header}
                />
                <View style={styles.detailContainer}>
                  {content.map((item, index) => {
                    if (!item) {
                      return null;
                    }
                    return (
                      <DetailItem
                        key={index.toString()}
                        label={item.title}
                        accessibilityLabel={
                          'newaccountsuccessscreen_item_' + index
                        }
                        text={item.details[0]}
                        style={styles.marginDetail}
                      />
                    );
                  })}
                </View>
              </CardView>
              <NewAccountInfoSuccess />

              <DetailItem
                label={L.newaccountscreensuccess_text_email}
                accessibilityLabel={'newaccountsuccessscreen_email'}
                text={email}
                style={styles.infoEmail}
              />

              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={'newaccountsuccessscreen_button_share'}
                  light
                  onPress={this.share}
                  title={L.newaccountsuccessscreen_button_share_title}
                  style={styles.marginButton}
                  medium
                />
                <Button
                  accessibilityLabel={
                    'newaccountsuccessscreen_button_end_title'
                  }
                  onPress={this.goToConsultas}
                  title={L.newaccountsuccessscreen_button_end_title}
                  style={styles.marginButton}
                  medium
                />
              </View>
            </Content>
            <ShareReceipt
              ref={ref => {
                this.shareView = ref;
              }}
              title={L.newaccountsuccessscreen_share_title}
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type NewAccountSuccessScreenType = NewAccountSuccessScreen;
export default withFocused<NewAccountSuccessScreen, Props>(
  NewAccountSuccessScreen
);

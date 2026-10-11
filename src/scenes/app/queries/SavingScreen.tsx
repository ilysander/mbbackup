import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  View,
  ScrollView,
} from 'react-native';
import API from '../../../api';
import { AccountsCAItem } from '../../../api/backend/response/Execute';
import { AlertEvent } from '../../../components/alert/AlertManager';
import EmptyMovementItem from '../../../components/savings/EmptyMovementItem';
import MovementItem from '../../../components/savings/MovementItem';
import ResumeAccount from '../../../components/savings/ResumeAccount';
import { FocusedProps, withFocused } from '../../../components/screen/ScreenContainer';
import { KeyboardAvoidingView } from '../../../components/ui';
// import {
//   FocusedProps,
//   withFocused,
// } from '../../../components/screen/ScreenContainer';
// import {
//   CardView,
//   Container,
//   Content,
//   KeyboardAvoidingView,
//   Loading,
//   NetworkStatusAlert,
//   SafeAreaView,
// } from '../../../components/ui';

import CardView from '../../../components/ui/CardView';
import Container from '../../../components/ui/Container';
import Content from '../../../components/ui/Content';
import Loading from '../../../components/ui/Loading';
import NetworkStatusAlert from '../../../components/ui/NetworkStatusAlert';
import SafeAreaView from '../../../components/ui/SafeAreaView';

import Colors from '../../../resources/constants/Colors';
import { Size } from '../../../resources/dimensions';
import Font from '../../../resources/functions/Font';
import Sanitizer from '../../../resources/functions/Sanitizer';
import Validate from '../../../resources/functions/Validate';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';

const styles = StyleSheet.create({
  networkStatus: { marginBottom: 10 } as ViewStyle,
  panelStyle: {
    marginBottom: 50,
  } as ViewStyle,
  resumeAccount: {
    marginBottom: 0,
  } as ViewStyle,
  movementsTitle: {
    marginTop: 10,
    marginBottom: 5,
    ...Font({ weight: 'Bold' }),
    fontSize: 22,
    color: Colors.primary,
  } as TextStyle,
  emptyMovements: {
    marginHorizontal: 20,
    marginVertical: 68,
    ...Font({ weight: 'Medium' }),
    fontSize: 13,
    color: Colors.grey4,
    textAlign: 'center',
  } as TextStyle,
  emptyView: {
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowColor: Colors.grey4,
    shadowOffset: { height: 4, width: 0 },
    borderRadius: 8,
    overflow: 'visible',
    borderStyle: 'dashed',
    borderColor: Colors.grey4,
    borderWidth: 1,
  },
});

const TAG = '[SavingScreen]';

// export interface Props extends NativeStackScreenProps<any> {
//   // navigation: NativeStackNavigationProp<any, any>;
// }
type RouteParamsList = {
  item: any
}
// type TestsScreenProps = NativeStackScreenProps<RouteParams, any>;
export interface Props extends NativeStackScreenProps<RouteParamsList, any> {
  // navigation?: NativeStackNavigationProp<any, any, undefined>;
}

export interface State {
  isLoading: boolean;
  statements: any[];
  account?: AccountsCAItem;
  emptyData: boolean;
}

class SavingScreen extends React.Component<Props & FocusedProps, State> {

  state: State = {
    isLoading: false,
    statements: [],
    account: undefined,
    emptyData: false,
  };

  componentDidMount() {
    const { route } = this.props;

    const item = route.params && route.params.item;
    // // const item = this.props.navigation.getParam('item', {});
    this.setState({ account: item });

    setTimeout(() => {
      this.load();
    }, 200);
  }

  load = async () => {
    const { isLoading, account } = this.state;
    if (isLoading) {
      Log.info(TAG, 'load', 'now already isLoading');
      return;
    }
    if (!account) {
      console.log('====> no hay cuenta cargada')
      return;
    }
    this.setState({ isLoading: true });
    await this.loadMovementsAccount(account.idProduct, account.currency);
    await this.loadResumeAccount(account.idProduct);
    this.setState({ isLoading: false });
  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  loadResumeAccount = async (idAccount: string) => {
    try {
      const response = await API.Execute.accountsRead(idAccount);
      const account = response.body.data.account;

      if (account) {
        this.setState({
          account,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'loadResumeAccount', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadResumeAccount',
        e,
      });
    }
  };

  loadMovementsAccount = async (idAccount: string, currency: string) => {
    console.log('loadMovementsAccount...cargando')
    try {
      const response = await API.Execute.accountsListStatements(
        idAccount,
        currency
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      if (response.body.data.statements) {
        this.setState({
          statements: Sanitizer.uniqueArray(
            response.body.data.statements,
            response
          ),
        });
        this.setState({
          emptyData: true,
        });
      } else {
        this.setState({
          emptyData: true,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'loadMovementsAccount', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadMovementsAccount',
        e,
      });
    }
  };

  render() {
    // const { isFocused } = this.props;
    const { navigation, isFocused } = this.props;
    const { account, isLoading, statements, emptyData } = this.state;

    // this.props.route.params

    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <ScrollView>
            <SafeAreaView>
              {!!account && (
                <ResumeAccount
                  accessibilityLabel={'savingscreen_resume'}
                  account={account}
                  style={styles.resumeAccount}
                />
              )}
              <Content style={styles.panelStyle}>
                <NetworkStatusAlert style={styles.networkStatus} />
                <Text style={styles.movementsTitle}>
                  {L.savingscreen_movements_title_personal}
                </Text>
                <CardView accessibilityLabel={'savingscreen_panel_movements'}>
                  {isLoading && statements.length < 1 && (
                    <Loading margin={'large'} />
                  )}
                  {statements.length == 0 && !!account && (
                    <>
                      {!isLoading ? <EmptyMovementItem /> : undefined}
                    </>
                  )}

                  {statements.length > 0 && !!account && (
                    <>
                      {statements.map((item, index) => {
                        // console.log(row)
                        // const { item } = row;
                        return (
                          <MovementItem
                            key={index.toString()}
                            accessibilityLabel={'savingscreen_movementitem'}
                            navigation={navigation}
                            size={statements.length}
                            position={
                              index === 0
                                ? 'first'
                                : index === statements.length - 1
                                  ? 'last'
                                  : 'middle'
                            }
                            item={item}
                            account={account}
                          />
                        )
                      })}
                    </>
                  )}
                </CardView>
                {emptyData && !isLoading && statements.length < 1 && (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyMovements}>
                      {L.emptymovements_general}
                    </Text>
                  </View>
                )}
              </Content>
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type SavingScreenType = SavingScreen;
export default withFocused<SavingScreen, Props>(SavingScreen);

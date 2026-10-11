import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  View,
} from 'react-native';
import API from '../../../api';
import { AccountsCTSItem } from '../../../api/backend/response/Execute';
import { AlertEvent } from '../../../components/alert/AlertManager';
import ResumeAccount from '../../../components/cts/ResumeAccount';
import EmptyMovementItem from '../../../components/savings/EmptyMovementItem';
import MovementItem from '../../../components/savings/MovementItem';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  CardView,
  Container,
  Content,
  KeyboardAvoidingView,
  Loading,
  NetworkStatusAlert,
  SafeAreaView,
} from '../../../components/ui';
import { Colors } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { Font, Sanitizer, Validate } from '../../../resources/functions';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';

const styles = StyleSheet.create({
  networkStatus: { marginBottom: 10 } as ViewStyle,
  panelStyle: { marginBottom: 50 } as ViewStyle,
  resumeAccount: {
    marginBottom: 10,
  } as ViewStyle,
  movementsTitle: {
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

const TAG = '[CTSScreen]';

export interface Props extends NativeStackScreenProps<any, any> {

}

export interface State {
  isLoading: boolean;
  statements: any[];
  account?: AccountsCTSItem;
  emptyData: boolean;
}

class CTSScreen extends React.Component<Props & FocusedProps, State> {
  state: State = {
    emptyData: false,
    isLoading: false,
    statements: [],
    account: undefined,
  };

  componentDidMount() {
    const { route } = this.props;
    const item = route.params && route.params.item;
    this.setState({ account: item });
  }

  load = async () => {
    const { isLoading, account } = this.state;
    if (isLoading) {
      Log.info(TAG, 'load', 'now already isLoading');
      return;
    }
    if (!account) {
      return;
    }
    this.setState({ isLoading: true });
    await this.loadMovementsAccount(account.idProduct, account.currency);
    this.setState({ isLoading: false });
  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  loadMovementsAccount = async (idAccount: string, currency: string) => {
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
    const { isFocused, navigation } = this.props;
    const { account, isLoading, statements, emptyData } = this.state;
    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            {!!account && (
              <ResumeAccount
                accessibilityLabel={'savingscreen_resume'}
                account={account}
                style={styles.resumeAccount}
              />
            )}
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Text style={styles.movementsTitle}>
                {L.savingscreen_movements_title_personal}
              </Text>
              <View style={styles.panelStyle}>
                <CardView accessibilityLabel={'ctsscreen_panel_movements'}>
                  <>
                    {isLoading && statements.length < 1 && (
                      <Loading margin={'large'} />
                    )}
                    {statements.length > 0 && !!account && (
                      <FlatList
                        ListEmptyComponent={
                          !isLoading ? <EmptyMovementItem /> : undefined
                        }
                        data={statements}
                        renderItem={({ item, index }) => {
                          return (
                            <MovementItem
                              accessibilityLabel={'ctsscreen_movementitem'}
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
                          );
                        }}
                        keyExtractor={item => item.id.toString()}
                        initialNumToRender={5}
                      />
                    )}
                  </>
                </CardView>
                {!isLoading && emptyData && statements.length < 1 && (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyMovements}>
                      {L.emptymovements_DPF}
                    </Text>
                  </View>
                )}
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type CTSScreenType = CTSScreen;
export default withFocused<CTSScreen, Props>(CTSScreen);

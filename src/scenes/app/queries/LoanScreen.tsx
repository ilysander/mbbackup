import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import API from '../../../api';
import { LoansItem } from '../../../api/backend/response/Execute';
import { AlertEvent } from '../../../components/alert/AlertManager';
import ResumeAccount from '../../../components/loans/ResumeAccount';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  Content,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
} from '../../../components/ui';
import { Size } from '../../../resources/dimensions';
import { Validate } from '../../../resources/functions';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';

const styles = StyleSheet.create({
  networkStatus: {
    marginBottom: 10,
    marginTop: 10,
  } as ViewStyle,
});

const TAG = '[LoanScreen]';

export interface Params {
  item: LoansItem;
  isBetweenOfficeHours: boolean;
}
export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, Params>;
}

export interface State {
  isLoading: boolean;
  account?: LoansItem;
  accountOriginal?: LoansItem;
  dataRows: any[];
  isBetweenOfficeHours: boolean;
}

class LoanScreen extends React.Component<Props & FocusedProps, State> {

  state: State = {
    isLoading: false,
    dataRows: [],
    isBetweenOfficeHours: true
  };

  componentDidMount() {
    const { route } = this.props;
    const account = route.params && route.params.item;
    const isBetweenOfficeHours = route.params && route.params.isBetweenOfficeHours;
    this.setState({ account, isBetweenOfficeHours });
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

    await this.loadFeesAccount(account.idProduct, account.currency);

    this.setState({ isLoading: false });
  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  loadFeesAccount = async (idAccount: string, currency: string) => {
    try {
      const response = await API.Execute.loansListStatements(
        idAccount,
        currency
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadFeesAccount', response);
      }
      this.setState({
        dataRows: response.body.data.statements,
      });
    } catch (e) {
      Log.exception(TAG, 'loadFeesAccount', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadFeesAccount',
        e,
      });
    }
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { isFocused, navigation } = this.props;
    const { account, isBetweenOfficeHours } = this.state;
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
            <Content vertical={false}>
              <NetworkStatusAlert style={styles.networkStatus} />
            </Content>
            {!!account && (
              <ResumeAccount
                accessibilityLabel={'loanscreen_resume'}
                account={account}
                navigation={navigation}
                isBetweenOfficeHours={isBetweenOfficeHours}
              />
            )}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoanScreenType = LoanScreen;
export default withFocused<LoanScreen, Props>(LoanScreen);

const moment = require('moment');
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  LoansItem,
  AccountItemSavingsAll,
} from '../../../../api/backend/response/Execute';
import LoanResumeItem from '../../../../components/payments/LoanResumeItem';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Container,
  Content,
  FlatList,
  KeyboardAvoidingView,
  Panel,
  SafeAreaView,
} from '../../../../components/ui';
import { Size } from '../../../../resources/dimensions';
import { L } from '../../../../resources/language';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  accounts: AccountItemSavingsAll[];
  loans: LoansItem[];
}

class PaymentsOwnLoansListScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsscreen_title,
  // };
  state: State = {
    accounts: [],
    loans: [],
  };

  componentDidMount() {
    this.load();
  }

  load = () => {
    const { route } = this.props;
    const accounts = route.params ? route.params.accounts ? route.params.accounts : [] : [];
    const loans = route.params && route.params.loans;
    // const accounts = navigation.getParam('accounts', []);
    // const loans = navigation.getParam('loans');
    loans.sort(
      (a: LoansItem, b: LoansItem) =>
        moment(a.nextFeeDueDate) - moment(b.nextFeeDueDate) ||
        b.nextFeeAmount - a.nextFeeAmount
    );
    this.setState({ accounts, loans });
  };

  goToLoan = (loan: LoansItem) => {
    const { accounts } = this.state;
    return this.props.navigation.navigate('PaymentsOwnLoansChoose', {
      accounts,
      loan,
    });
  };

  render() {
    const { loans } = this.state;
    const { isFocused } = this.props;
    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content>
              <Panel
                accessibilityLabel={'paymentsownloanslistscreen_panel'}
                title={L.paymentsscreen_panel_my_loans}
              >
                <FlatList
                  data={loans}
                  renderItem={({ item, index }) => (
                    <LoanResumeItem
                      accessibilityLabel={
                        'paymentsownloanslistscreen_loanresumeitem'
                      }
                      isLast={index === loans.length - 1}
                      loan={item}
                      onPress={() => this.goToLoan(item)}
                    />
                  )}
                  keyExtractor={item => item.idProduct.toString()}
                />
              </Panel>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsOwnLoansListScreenType = PaymentsOwnLoansListScreen;
export default withFocused<PaymentsOwnLoansListScreen, Props>(
  PaymentsOwnLoansListScreen
);

import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  Content,
  KeyboardAvoidingView,
  LoadingOverlay,
  NetworkStatusAlert,
  SafeAreaView,
  Header,
} from '../../../components/ui';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import { Validate } from '../../../resources/functions';
import Log from '../../../resources/log/Log';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import API from '../../../api';
import { LoansItem } from '../../../api/backend/response/Execute';
import LoanResumePostponement from '../../../components/loans/LoanResumePostponement';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  loanResumePostponement: {
    marginBottom: 20,
  } as ViewStyle,
  header: {
    marginTop: 10,
    marginBottom: 20,
  } as ViewStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  loans: LoansItem[];
}

const TAG = '[LoansPostponementChooseScreen]';
class LoansPostponementChooseScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    isLoading: false,
    loans: [],
  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  load = async () => {
    const { isLoading } = this.state;

    if (isLoading) {
      Log.info(TAG, 'load', 'now already isLoading');
      return;
    }
    this.setState({ isLoading: true });

    try {
      const response = await API.Execute.widgetsProducts();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }

      const { loans: loansMap } = response.body.data.productMap;
      const loans = loansMap.products;
      const loansPostponement = Validate.validateRulesLoansPostponement(loans);

      this.setState({ loans: loansPostponement });
    } catch (e) {
      Log.info(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  render() {
    const { isFocused, navigation } = this.props;
    const { isLoading, loans } = this.state;
    const hasLoans = !!loans?.length;

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
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              {hasLoans && (
                <>
                  <Header
                    style={styles.header}
                    accessibilityLabel={'loanspostponementchoosecreen_header'}
                    title={L.loanspostponementchoosescreen_header_title}
                    center
                  />
                  <View>
                    {loans.map((loan, index) => {
                      return (
                        <LoanResumePostponement
                          accessibilityLabel={
                            'loanspostponementchoosecreen_loanresumepostponement'
                          }
                          style={styles.loanResumePostponement}
                          navigation={navigation}
                          key={index}
                          loan={loan}
                        />
                      );
                    })}
                  </View>
                </>
              )}
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
        <LoadingOverlay isLoading={isLoading} />
      </Container>
    );
  }
}

export type LoansPostponementChooseScreenType = LoansPostponementChooseScreen;
export default withFocused<LoansPostponementChooseScreen, Props>(
  LoansPostponementChooseScreen
);

import * as React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import {
  Header,
  Button,
  Container,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
} from '../../../components/ui';
import { L } from '../../../resources/language';
import { Font, Sanitizer } from '../../../resources/functions';
import { Colors } from '../../../resources/constants';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import { Size } from '../../../resources/dimensions';
import { Amount } from '../../../resources/money';
import { LoansItem } from '../../../api/backend/response/Execute';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    paddingTop: 0,
    marginTop: 0,
  } as ViewStyle,
  title: {
    textAlign: 'center',
    ...Font({ weight: 'Bold', style: 'Italic' }),
    fontSize: 32,
    lineHeight: 35,
  } as TextStyle,
  message: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 14,
  } as TextStyle,
  finish: {
    marginBottom: 40,
    borderColor: Colors.primary,
  } as ViewStyle,
  titleButtonFinish: {
    fontSize: 16,
  } as TextStyle,
  info: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
});

export interface NavigationParams {
  loan: LoansItem;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class LoansPostponementMessageNotAllowedScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  goToBack = () => {
    const { navigation } = this.props;
    navigation.navigate('LoansHome');
  };

  render() {
    const { isFocused, route } = this.props;
    const loan = route.params && route.params.loan;

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
              <View style={styles.info}>
                <Header
                  center
                  accessibilityLabel={'loanspostponementnotallowscreen_header'}
                  title={L.loanspostponementnotallowscreen_total_title}
                  titleStyle={styles.title}
                  style={styles.header}
                />
                <Text style={styles.message}>
                  {L.loanspostponementnotallowscreen_message_part1}
                  <Text>
                    ‘{Sanitizer.cleanProductLabel(loan.shortLabel, loan)}’
                  </Text>
                  {L.loanspostponementnotallowscreen_message_part2}
                  <Text>{Amount.format(loan.loanAmount, loan.currency)}</Text>
                  {L.loanspostponementnotallowscreen_message_part3}
                </Text>
              </View>

              <Button
                accessibilityLabel={
                  'loanspostponementmessagenotallowscreen_button_finish'
                }
                title={L.loanspostponementnotallowscreen_message_button_finish}
                onPress={this.goToBack}
                style={styles.finish}
                textStyle={styles.titleButtonFinish}
                allowOnPress
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoansPostponementMessageNotAllowedScreenType = LoansPostponementMessageNotAllowedScreen;
export default withFocused<LoansPostponementMessageNotAllowedScreen, Props>(
  LoansPostponementMessageNotAllowedScreen
);

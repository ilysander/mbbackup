import * as React from 'react';
import {
  Image,
  Text,
  StyleSheet,
  ImageStyle,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  Header,
  Button,
  Container,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
} from '../../../components/ui';
import { L } from '../../../resources/language';
import { Font } from '../../../resources/functions';
import { Colors } from '../../../resources/constants';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import { Size } from '../../../resources/dimensions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  } as ImageStyle,
  image: {
    alignSelf: 'center',
    width: 300,
    height: 200,
  } as ImageStyle,
  header: {
    marginBottom: 20,
    paddingTop: 0,
    marginTop: 0,
  } as ViewStyle,
  text: {
    textAlign: 'center',
  } as TextStyle,
  message: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: -4,
  } as TextStyle,
  messageHighLight: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primaryLight,
    fontSize: 14,
    textAlign: 'center',
  } as TextStyle,
  gap: {
    paddingTop: 16,
    ...Font({ weight: 'Bold', style: 'Italic' }),
  } as TextStyle,
  start: {
    marginVertical: 30,
    padding: 14,
    borderWidth: 0,
  } as ViewStyle,
  titleButtonStart: {
    fontSize: 16,
  } as TextStyle,
  container: { backgroundColor: Colors.white },
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class LoansPostponementMessageScreen extends React.Component<
  Props & FocusedProps,
  State
> {


  goToLoans = () => {
    const { navigation } = this.props;
    navigation.navigate('LoansPostponementChoose');
  };

  render() {
    const { isFocused } = this.props;

    return (
      <Container style={styles.container}>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical center>
              <Image
                source={require('../../../assets/images/bg-linear-triangles.png')}
                style={styles.backgroundImage}
                resizeMode={'cover'}
              />
              <Image
                source={require('../../../assets/images/adn-woman-pointing-large.png')}
                resizeMode={'contain'}
                style={styles.image}
              />
              <Header
                center
                accessibilityLabel={'loanspostponementmessagescreen_header'}
                title={L.loanspostponementmessagescreen_total_title}
                titleStyle={styles.text}
                style={styles.header}
              />
              <Text style={styles.text}>
                <Text style={styles.message} allowFontScaling={false}>
                  {L.loanspostponementmessagescreen_message_part1}
                </Text>
                <Text style={styles.messageHighLight} allowFontScaling={false}>
                  {L.loanspostponementmessagescreen_message_part2}
                </Text>
              </Text>

              <Text style={[styles.message, styles.gap]}>
                {L.loanspostponementmessagescreen_message_part3}
              </Text>
              <Button
                accessibilityLabel={
                  'loanspostponementmessagescreen_button_start'
                }
                title={L.loanspostponementmessagescreen_message_button_start}
                onPress={this.goToLoans}
                style={styles.start}
                textStyle={styles.titleButtonStart}
                allowOnPress
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoansPostponementMessageScreenType = LoansPostponementMessageScreen;
export default withFocused<LoansPostponementMessageScreen, Props>(
  LoansPostponementMessageScreen
);

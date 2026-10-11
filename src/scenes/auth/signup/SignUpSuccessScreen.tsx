import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  Image,
  Text,
  ImageStyle,
} from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  Header,
  KeyboardAvoidingView,
  SafeAreaView,
  FormSteps,
} from '../../../components/ui';
import { A, AnalyticsEvent } from '../../../resources/analytics';
import { Colors } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import Config from '../../../Config';
import Font from '../../../resources/functions/Font';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 30,
    marginBottom: 10,
  } as ViewStyle,
  image: {
    width: 129,
    height: 146,
    alignSelf: 'center',
    marginBottom: 20,
    marginLeft: 20,
  } as ImageStyle,
  headerTitle: {
    ...Font({ weight: 'Bold', style: 'Italic' }),
    color: Colors.primary,
    fontSize: 32,
    lineHeight: 38,
  } as TextStyle,
  containerSubtitle: {
    marginTop: 20,
    marginHorizontal: 40,
  } as ViewStyle,
  headerSubtitle: {
    fontSize: 18,
  } as TextStyle,
  textDescription: {
    ...Font(),
    textAlign: 'center',
    fontSize: 13,
    color: Colors.grey6,
  } as TextStyle,
  textButton: {
    fontSize: 16,
  } as TextStyle,
  content: {
    marginBottom: 100,
  } as ViewStyle,
});

export interface Params {
  cardNumber: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class SignUpSuccessScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.signupsuccessscreen_title,
  //   headerLeft: <View />,
  //   gesturesEnabled: false,
  // };

  isReallyMounted!: boolean;
  timeout!: NodeJS.Timeout;

  componentDidMount() {
    AnalyticsEvent?.track(
      A.signup_success,
      {
        method: 'app',
      },
      A.fb_signup_success,
      {
        fb_registration_method: 'app',
      }
    );

    this.isReallyMounted = true;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    this.timeout = setTimeout(() => {
      AnalyticsEvent?.track('msgSignUpResetSucces', L.signupsuccessscreen_subtitle)
      this.isReallyMounted && this.goToAuthAuto();
    }, Config.settings.timeoutSignUpSuccess);
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
    this.isReallyMounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      return false;
    }
    this.goToAuthAuto();
    return true;
  };
  goToAuthAuto = () => {
    const { navigation } = this.props;
    navigation.navigate('SignIn');
  };
  goToAuth = () => {
    this.goToAuthAuto();
  };

  render() {
    const { isFocused } = this.props;
    return (
      <Container>
        <FormSteps total={4} current={4} />

        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content center style={styles.content}>
              <Image
                resizeMode={'stretch'}
                style={styles.image}
                source={require('../../../assets/images/congratulations-color-icon.png')}
              />
              <Header
                center
                accessibilityLabel={'signupsuccessscreen_header_title'}
                title={L.signupsuccessscreen_congratulations}
                titleStyle={styles.headerTitle}
              />
              <Header
                center
                accessibilityLabel={'signupsuccessscreen_header_subtitle'}
                title={L.signupsuccessscreen_subtitle}
                titleStyle={styles.headerSubtitle}
                accent
              />
              <View style={styles.containerSubtitle}>
                <Text style={styles.textDescription}>
                  {L.signupsuccessscreen_description}
                </Text>
              </View>
              <Button
                accessibilityLabel={'signupsuccessscreen_signup_button'}
                title={L.signupsuccessscreen_signup_button}
                onPress={this.goToAuth}
                style={styles.buttons}
                textStyle={styles.textButton}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type SignUpSuccessScreenType = SignUpSuccessScreen;
export default withFocused<SignUpSuccessScreen, Props>(SignUpSuccessScreen);

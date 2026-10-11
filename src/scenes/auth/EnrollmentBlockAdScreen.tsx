import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  ViewStyle,
  Text,
  Image,
  ImageStyle,
  TextStyle,
} from 'react-native';
import InfoContact from '../../components/info/InfoContact';
import {
  FocusedProps,
  withFocused,
} from '../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
} from '../../components/ui';
import { Size } from '../../resources/dimensions';
import { Log } from '../../resources/log';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  icon: {
    width: 85,
    height: 85,
    alignSelf: 'center',
    resizeMode: 'contain',
  } as ImageStyle,
  buttons: {
    flexDirection: 'row',
    marginVertical: 20,
    alignSelf: 'center',
  } as ViewStyle,
  button: {
    minHeight: 40,
    width: 130,
    marginHorizontal: 10,
  } as ViewStyle,
  textButton: {
    fontSize: 16,
  } as TextStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  text: {
    ...Font({ weight: 'Regular' }),
    fontSize: 14,
    marginRight: 10,
    color: Colors.grey6,
    textAlign: 'center',
  } as TextStyle,
  textHighlighted: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.grey6,
    textAlign: 'center',
  } as TextStyle,
  textContainer: {
    marginHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  header: {
    marginVertical: 10,
  } as ViewStyle,
  titleHeader: {
    fontSize: 22,
    color: Colors.primary,
  } as TextStyle,
  contentView: {
    paddingHorizontal: 0,
  } as ViewStyle,
});

const TAG = '[EnrollmentBlockAdScreen]';
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class EnrollmentBlockAdScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions = ({
  //   navigation,
  // }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
  //   title: L.enrollmentblockadscreen_title,
  //   gesturesEnabled: false,
  //   headerLeft: (
  //     <BackIcon
  //       onPress={() => {
  //         navigation.navigate('SignIn');
  //       }}
  //     />
  //   ),
  // });

  goToSignIn = async () => {
    this.props.navigation.navigate('SignIn');
  };

  goToValidation = () => {

    const { route } = this.props;

    const document = route.params && route.params.document;
    const cardNumber = route.params && route.params.cardNumber;
    const password = route.params && route.params.password;
    const captcha = route.params && route.params.captcha;
    const payload = route.params && route.params.payload;
    const idTransaction = route.params && route.params.idTransaction;
    const remember = route.params && route.params.remember;


    this.props.navigation.navigate('IdentityCheckLogin', {
      shouldGoBack: false,
      document,
      password,
      cardNumber,
      captcha,
      payload,
      idTransaction,
      remember,
    });
  };

  componentDidMount() {
    Log.debug(TAG, 'componentDidMount');
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    Log.debug(TAG, 'componentWillUnmount');
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      return false;
    }
    this.goToSignIn();
    return true;
  };

  render() {
    const { isFocused, navigation } = this.props;

    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content center style={styles.contentView}>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Image
                accessibilityLabel={'enrollmentblockadscreen_header_icon'}
                style={styles.icon}
                source={require('../../assets/images/curlyAdAdn.png')}
              />
              <Header
                center
                accessibilityLabel={'enrollmentblockadscreen_header_data'}
                style={styles.header}
                titleStyle={styles.titleHeader}
                title={L.enrollmentblockadscreen_header_text}
              />
              <View style={[styles.textContainer]}>
                <Text style={styles.text}>
                  {L.enrollmentblockadscreen_body_text_part1}
                  <Text style={styles.textHighlighted}>
                    {L.enrollmentblockadscreen_body_text_part2}
                  </Text>
                </Text>
                <Text style={styles.text}>
                  {L.enrollmentblockadscreen_body_text_part3}
                </Text>
              </View>

              <View style={styles.buttons}>
                <Button
                  light
                  accessibilityLabel={'enrollmentblockadscreen_button_signin'}
                  style={styles.button}
                  title={L.enrollmentblockadscreen_button_return}
                  textStyle={styles.textButton}
                  onPress={this.goToSignIn}
                />
                <Button
                  accessibilityLabel={'enrollmentblockadscreen_button_validate'}
                  style={styles.button}
                  title={L.enrollmentblockadscreen_button_continue}
                  textStyle={styles.textButton}
                  onPress={this.goToValidation}
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'enrollmentblockadscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type EnrollmentBlockAdScreenType = EnrollmentBlockAdScreen;
export default withFocused<EnrollmentBlockAdScreen, Props>(
  EnrollmentBlockAdScreen
);

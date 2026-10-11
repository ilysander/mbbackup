import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  ViewStyle,
  Text,
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
    width: 80,
    height: 80,
    alignSelf: 'center',
    resizeMode: 'contain',
  } as ImageStyle,
  buttons: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 40,
    alignSelf: 'center',
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  textBullet: {
    ...Font({ weight: 'Regular' }),
    fontSize: 14,
    marginRight: 10,
    color: Colors.grey6,
    textAlign: 'center',
  } as TextStyle,
  textBody: {
    marginTop: 10,
  } as TextStyle,
  textSteps: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.grey6,
    textAlign: 'center',
  } as TextStyle,
  textContainer: {
    marginHorizontal: 40,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  bottomSpacing: {
    marginBottom: 20,
  } as ViewStyle,
  header: {
    marginTop: 10,
    marginBottom: 10,
  } as ViewStyle,
  titleHeader: {
    fontSize: 22,
    color: Colors.primary,
  } as TextStyle,
  buttonReturn: {
    marginTop: 20,
    marginBottom: 40,
    marginHorizontal: 60,
    minHeight: 40,
  } as ViewStyle,
  textBtnReturn: {
    fontSize: 16,
  } as TextStyle,
  contentView: {
    paddingHorizontal: 0,
  } as ViewStyle,
});

const TAG = '[EnrollmentBlackListScreen]';

export interface Params { }
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class EnrollmentBlackListScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.enrollmentblacklistscreen_title,
  //   headerLeft: <View />,
  //   gesturesEnabled: false,
  // };

  goToSignin = async () => {
    this.props.navigation.navigate('SignIn');
  };

  goToValidation = () => {
    this.props.navigation.navigate('App');
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
    this.goToSignin();
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
              <Header
                center
                accessibilityLabel={'enrollmentblacklistscreen_header_data'}
                style={styles.header}
                titleStyle={styles.titleHeader}
                title={L.enrollmentblacklistscreen_header_text}
              />
              <View style={[styles.textContainer]}>
                <Text style={styles.textBullet}>
                  {L.enrollmentblacklistscreen_body_text}
                </Text>
              </View>
              <Button
                accessibilityLabel={'enrollmentblacklistscreen_button_close'}
                style={styles.buttonReturn}
                title={L.enrollmentblacklistscreen_finishbutton_text}
                textStyle={styles.textBtnReturn}
                onPress={this.goToSignin}
              />
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'enrollmentblacklistscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type EnrollmentBlackListScreenType = EnrollmentBlackListScreen;
export default withFocused<EnrollmentBlackListScreen, Props>(
  EnrollmentBlackListScreen
);

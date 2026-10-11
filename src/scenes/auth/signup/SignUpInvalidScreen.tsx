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
import InfoContact from '../../../components/info/InfoContact';
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
  NetworkStatusAlert,
  SafeAreaView,
} from '../../../components/ui';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import { Log } from '../../../resources/log';
import { Colors } from '../../../resources/constants';
import { Font } from '../../../resources/functions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  icon: {
    width: 46,
    height: 46,
    alignSelf: 'center',
    tintColor: Colors.danger,
  } as ImageStyle,
  buttons: {
    marginTop: 30,
    marginBottom: 40,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  textBullet: {
    ...Font({ weight: 'Bold' }),
    fontSize: 18,
    marginRight: 10,
    color: Colors.grey6,
  } as TextStyle,
  textSteps: {
    ...Font({ weight: 'SemiBold' }),
    flex: 1,
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,
  textContainer: {
    flexDirection: 'row',
    marginHorizontal: 40,
  } as ViewStyle,
  bottomSpacing: {
    marginBottom: 20,
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
});

const TAG = '[SignUpInvalidScreen]';

export interface Params { }
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class SignUpInvalidScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions = ({
  //   navigation,
  // }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
  //   title: L.signupstack_title,
  //   gesturesEnabled: false,
  //   headerLeft: (
  //     <BackIcon
  //       onPress={() => {
  //         navigation.navigate('SignIn');
  //       }}
  //     />
  //   ),
  // });

  goToLogin = async () => {
    this.props.navigation.navigate('SignIn');
  };

  goToLocation = () => {
    this.props.navigation.navigate('Location', {
      shouldGoBack: false,
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
    this.goToLogin();
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
            <Content center>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Image
                accessibilityLabel={'signupinvalidscreen_header_icon'}
                style={styles.icon}
                source={require('../../../assets/images/error-icon.png')}
              />
              <Header
                center
                accessibilityLabel={'signupinvalidscreen_header_data'}
                style={styles.header}
                title={L.signupinvalidscreen_header_data}
              />
              <View style={[styles.textContainer, styles.bottomSpacing]}>
                <Text style={styles.textBullet}>
                  {L.signupinvalidscreen_text_description_part1_bullet}
                </Text>
                <Text style={styles.textSteps}>
                  {L.signupinvalidscreen_text_description_part1}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.textBullet}>
                  {L.signupinvalidscreen_text_description_part2_bullet}
                </Text>
                <Text style={styles.textSteps}>
                  {L.signupinvalidscreen_text_description_part2}
                </Text>
              </View>

              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={'signupinvalidscreen_button_map'}
                  style={styles.bottomSpacing}
                  title={L.signupinvalidscreen_button_map}
                  onPress={this.goToLocation}
                />
                <Button
                  light
                  accessibilityLabel={'signupinvalidscreen_button_login'}
                  title={L.signupinvalidscreen_button_login}
                  onPress={this.goToLogin}
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'signupinvalidscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type SignUpInvalidScreenType = SignUpInvalidScreen;
export default withFocused<SignUpInvalidScreen, Props>(SignUpInvalidScreen);

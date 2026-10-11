import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  ViewStyle,
  Image,
  ImageStyle,
  TextStyle,
  Text,
} from 'react-native';
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
  ItemEnrollError,
} from '../../components/ui';
import { Size } from '../../resources/dimensions';
import { Log } from '../../resources/log';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  headerIcon: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    resizeMode: 'contain',
  } as ImageStyle,
  icon: {
    width: 50,
    height: 50,
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
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
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  bottomSpacing: {
    marginBottom: 20,
  } as ViewStyle,
  header: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  titleHeader: {
    fontSize: 22,
    color: Colors.primary,
  } as TextStyle,
  buttonReturn: {
    marginTop: 30,
    marginBottom: 40,
    marginHorizontal: 40,
    minHeight: 40,
  } as ViewStyle,
  textBtnRetorn: {
    fontSize: 16,
  } as TextStyle,
  headerTitle: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 22,
  } as TextStyle,
  messageText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'left',
    textAlignVertical: 'center',
    marginLeft: 10,
    flex: 1,
  } as TextStyle,
  subtitleText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  } as TextStyle,
  bodyContainer: {
    paddingHorizontal: 20,
  } as ViewStyle,
  itemEnroll: {
    marginHorizontal: 50,
    flexDirection: 'row',
    marginTop: 10,
  } as ViewStyle,
});

const TAG = '[EnrollmentErrorScreen]';

export interface Params { }
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class EnrollmentErrorScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions = ({
  //   navigation,
  // }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
  //   title: L.enrollmenterror_title,
  //   headerLeft: (
  //     <BackIcon
  //       onPress={() => {
  //         navigation.goBack();
  //       }}
  //     />
  //   ),
  // });

  goToLogin = async () => {
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
    this.goToLogin();
    return true;
  };

  render() {
    const { isFocused } = this.props;

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
            <Content center style={styles.bodyContainer}>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Image
                accessibilityLabel={'enrollmenterrorscreen_header_icon'}
                style={styles.headerIcon}
                source={require('../../assets/images/adn-man-adv.png')}
              />
              <Header
                accessibilityLabel={'enrollmenterrorscreen_header'}
                title={L.enrollmenterrorscreen_title}
                titleStyle={styles.headerTitle}
                style={styles.header}
              />
              <Text style={[styles.subtitleText]}>
                {L.enrollmenterrorscreen_title_subtitle}
              </Text>
              <ItemEnrollError
                description={L.enrollmenterrorscreen_title_recomendation_1}
                descriptionStyle={styles.messageText}
                imageStyle={styles.icon}
                itemEnrollErrorStyle={styles.itemEnroll}
                imageSource={require('../../assets/images/icon-circle-celular.png')}
              />
              <ItemEnrollError
                description={L.enrollmenterrorscreen_title_recomendation_2}
                descriptionStyle={styles.messageText}
                imageStyle={styles.icon}
                itemEnrollErrorStyle={styles.itemEnroll}
                imageSource={require('../../assets/images/icon-circle-num.png')}
              />
              <ItemEnrollError
                description={L.enrollmenterrorscreen_title_recomendation_3}
                descriptionStyle={styles.messageText}
                imageStyle={styles.icon}
                itemEnrollErrorStyle={styles.itemEnroll}
                imageSource={require('../../assets/images/icon-circle-auricular.png')}
              />
              <ItemEnrollError
                description={L.enrollmenterrorscreen_title_recomendation_4}
                descriptionStyle={styles.messageText}
                imageStyle={styles.icon}
                itemEnrollErrorStyle={styles.itemEnroll}
                imageSource={require('../../assets/images/icon-circle-agencia.png')}
              />
              <Button
                accessibilityLabel={'enrollmenterrorscreen_button_end'}
                style={styles.buttonReturn}
                title={L.enrollmenterrorscreen_finishbutton_text}
                textStyle={styles.textBtnRetorn}
                onPress={this.goToLogin}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type EnrollmentErrorScreenType = EnrollmentErrorScreen;
export default withFocused<EnrollmentErrorScreen, Props>(EnrollmentErrorScreen);

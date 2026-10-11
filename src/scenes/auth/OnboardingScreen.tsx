import * as React from 'react';
import {
  ImageStyle,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  View,
  Image,
  Platform,
  ViewStyle,
} from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../components/screen/ScreenContainer';
import { Version } from '../../components/ui/index';
import {
  CopilotProps,
  withCopilot,
} from '../../components/tour/CopilotContainer';
import CopilotStep from '../../components/tour/CopilotStep';
import WalkthroughableView from '../../components/tour/WalkthroughableView';
import {
  ButtonExternal,
  ButtonLink,
  Container,
  Content,
  MaintenanceView,
  ModalRegisterMode,
} from '../../components/ui';
import Config from '../../Config';
import {
  Colors,
  MaintenanceStatus,
  TypeInitialStart,
} from '../../resources/constants';
import { Size } from '../../resources/dimensions';
import { Font, Linking } from '../../resources/functions';
import { L } from '../../resources/language';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import Features from '../../resources/remote/Features';
import perf from '@react-native-firebase/perf';
import { InitialAppScreen } from '../../resources/initialAppScreen';
import { A, AnalyticsEvent } from '../../resources/analytics';
import MobileServiceManager from '../../components/mobile-service/MobileServiceManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const statusBarHeight = Platform.OS === 'ios' ? Size.getStatusBarHeight() : 0;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grey4,
    justifyContent: 'flex-start',
  } as ViewStyle,
  containerButtonSecondary: {
    marginBottom: 15,
    borderRadius: 20,
  } as ViewStyle,
  versionLabel: {
    color: Colors.white,
    fontSize: 12,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  version: {
    position: 'absolute',
    top: statusBarHeight + 10,
    right: 10,
    zIndex: 10,
    color: Colors.white,
  } as ViewStyle,
  buttonSignUp: {
    marginLeft: -20,
    marginRight: -20,
    padding: 0,
    alignItems: 'center',
    marginTop: 8,
    width: 240,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 15,
    borderRadius: 24,
    backgroundColor: Colors.accentDark,
  } as ViewStyle,
  buttonGotoLogin: {
    marginLeft: -20,
    marginRight: -20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignContent: 'center',
    width: Size.getWidth() * 0.5,
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderColor: Colors.primary,
  } as ViewStyle,
  titleSignUp: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  titleSignIn: {
    marginTop: Size.getWidth() * 0.025,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,

  titleButtonSignUp: {
    fontSize: 16,
    color: Colors.white,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  titleButtonGotoLogin: {
    fontSize: 16,
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primary,
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom:
      Platform.OS == 'android'
        ? Size.getHeight() * 0.025
        : Size.getHeight() * 0.025,
    paddingHorizontal: 40,
    backgroundColor: Colors.grey1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  } as ViewStyle,
  footerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  } as ViewStyle,
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  } as ViewStyle,
  icon: {
    tintColor: Colors.grey5,
    width: 12,
    height: 16,
  } as ImageStyle,
  iconExtraButtonSignUp: {
    marginRight: 8,
    tintColor: Colors.white,
  } as ImageStyle,
  iconButtonSignUp: {
    height: 14,
    width: 7,
    marginLeft: 6,
    tintColor: Colors.white,
  } as ImageStyle,
  iconButtonRegister: {
    height: 14,
    width: 7,
    marginLeft: 6,
    tintColor: Colors.primary,
  } as ImageStyle,
  iconButton: {
    tintColor: Colors.grey5,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  content: {
    paddingHorizontal: 40,
    paddingTop: 10,
  } as ViewStyle,
  logo: {
    zIndex: 1,
    marginTop:
      Size.getHeight() < 700
        ? Size.getHeight() * 0.04
        : Size.getHeight() * 0.05,
    height: Size.getWidth() * 0.27,
    width: Size.getWidth() * 0.3,
  } as ImageStyle,
  onboardingContainer: {
    height: Size.getHeight() * 0.57,
    width: Size.getWidth(),
    justifyContent: 'flex-start',
  } as ViewStyle,
  onboardingImageStyle: {
    height:
      Size.getHeight() < 700
        ? Size.getHeight() * 0.58
        : Size.getHeight() * 0.67,
    width: Size.getWidth(),
    justifyContent: 'flex-end',
    alignItems: 'center',
    resizeMode: 'cover',
  } as ImageStyle,
  onboardingElementsContainer: {
    zIndex: 1,
    position: 'absolute',
    width: Size.getWidth(),
    height: Size.getHeight(),
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  } as ViewStyle,
  logoContainer: {
    height:
      Size.getHeight() < 700
        ? Size.getHeight() * 0.58
        : Size.getHeight() * 0.67,
    width: Size.getWidth(),
    alignItems: 'center',
  } as ViewStyle,
  elementsPanel: {
    backgroundColor: Colors.white,
    height:
      Size.getHeight() < 700
        ? Size.getHeight() * 0.45
        : Size.getHeight() * 0.36,
    width: Size.getWidth(),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
const TAG = '[Onboarding]';
export interface Props extends NativeStackScreenProps<any, any> {
}
export interface State {
  activeModalRegisterMode: boolean;
}
class OnboardingCopilot extends React.Component<
  Props & FocusedProps & CopilotProps,
  State
> {
  willBlurListener!: any;
  didFocusListener!: any;
  private trace!: any;
  private modalRegister!: ModalRegisterMode | null;
  state: State = {
    activeModalRegisterMode: false,
  };

  async UNSAFE_componentWillMount() {
    if (InitialAppScreen.InitialAppScreen == TypeInitialStart.SignIn) {
      this.props.navigation.navigate('SignIn');
    }
  }
  async componentDidMount() {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.willBlurListener = this.props.navigation.addListener(
        'blur',
        this.willBlur
      );
      this.didFocusListener = this.props.navigation.addListener(
        'focus',
        this.didFocus
      );
    }
  }

  componentWillUnmount(): void {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.willBlurListener && this.willBlurListener();
      this.didFocusListener && this.didFocusListener();
    }
  }

  didFocus = async () => {
    this.trace = perf().newTrace('Onboarding');
    await this.trace.start();
  };

  willBlur = async () => {
    this.trace && (await this.trace.stop());
  };

  goToSignUp = () => {
    if (Features.isAllowedTo('SignUpWeb')) {
      this.props.navigation.navigate('SignUpWeb');
    } else {
      if (
        !Config.features.LoginWithDniBiometric ||
        Config.features.LoginWithDniConventional
      ) {
        this.props.navigation.navigate('SignUpCredentials');
      } else {
        this.modalRegister?.showPanel();
      }
    }
  };

  tryToSubmit = () => {
    this.props.navigation.navigate('SignIn');
  };

  goToContactScreenWithError = (e: any) => {
    Log.warn(TAG, 'goToContact', e);
    this.props.navigation.navigate('Contact');
  };

  goToContactScreenOrOpenPhone = async (supported: boolean, url: string) => {
    if (supported) {
      try {
        await Linking.openURL(url);
      } catch (e) {
        Log.debug(TAG, 'goToContactScreenOrOpenPhone', e);
      }
    } else {
      this.props.navigation.navigate('Contact');
    }
  };

  goToLocation = () => {
    this.props.navigation.navigate('Location');
  };

  goToContact = async () => {
    const url = `tel:${Config.settings.contactPhone}`;
    try {
      const supported = await Linking.canOpenURL(url);
      await this.goToContactScreenOrOpenPhone(supported, url);
    } catch (e) {
      this.goToContactScreenWithError(e);
    }
  };

  toggleDebug = () => {
    Emitter.emit('onToggleDebug', true);
  };

  onRegisterWithDni = async () => {
    this.closeModalRegisterMode();
    const a_seed = A.seed_dni_ob;
    AnalyticsEvent.track(a_seed);
    this.props.navigation.navigate('SignUpFacephi', { a_seed });
  };
  onRegisterWithCard = async () => {
    this.closeModalRegisterMode();
    this.props.navigation.navigate('SignUpCredentials');
  };

  closeModalRegisterMode = async () => {
    this.modalRegister?.dismissPanel();
  };

  render() {
    const { isFocused } = this.props;

    if (Config.settings.maintenanceStatus === MaintenanceStatus.Total) {
      return <MaintenanceView />;
    }
    return (
      <Container style={styles.container}>
        {isFocused && <StatusBar hidden={true} />}
        <Version
          label={`${L.headermain_version_label} `}
          style={styles.version}
          labelStyle={styles.versionLabel}
        />
        <View style={styles.onboardingContainer}>
          <Image
            accessibilityLabel={'background-onboarding'}
            style={styles.onboardingImageStyle}
            source={require('../../assets/images/bgonboarding.jpg')}
          />
        </View>
        <View style={styles.onboardingElementsContainer}>
          <View style={styles.logoContainer}>
            <Image
              accessibilityLabel={'header-onboarding-logo'}
              style={styles.logo}
              fadeDuration={200}
              resizeMode={'contain'}
              source={require('../../assets/images/logo.png')}
            />
          </View>

          <View style={styles.elementsPanel}>
            <Content center style={styles.content}>
              {(Features.isAllowedTo('SignUp') ||
                Features.isAllowedTo('SignUpWeb')) && (
                  <CopilotStep order={1} name={'firstTime'}>
                    <WalkthroughableView style={styles.containerButtonSecondary}>
                      <Text style={styles.titleSignUp}>
                        {L.onboardingscreen_gotoregisterscreen_title}
                      </Text>
                      <ButtonLink
                        accessibilityLabel={'signinscreen_buttonsecondary_signup_onb'}
                        style={styles.buttonSignUp}
                        titleStyle={styles.titleButtonSignUp}
                        onPress={this.goToSignUp}
                        title={L.signinscreen_buttonsecondary_signup}
                        imageSource={require('../../assets/images/arrow-icon.png')}
                        imagePosition={'right'}
                        imageStyle={styles.iconButtonSignUp}
                        imageExtraSource={require('../../assets/images/mobile-dark-icon.png')}
                        imageExtraStyle={styles.iconExtraButtonSignUp}
                      />
                    </WalkthroughableView>
                  </CopilotStep>
                )}

              {Features.isAllowedTo('SignIn') && (
                <CopilotStep order={1} name={'firstTime'}>
                  <WalkthroughableView style={styles.containerButtonSecondary}>
                    <Text style={styles.titleSignIn}>
                      {L.onboardingscreen_gotologinscreen_title}
                    </Text>
                    <ButtonLink
                      accent={'accentDark'}
                      accessibilityLabel={'onboardingscreen_gotologinscreen'}
                      style={styles.buttonGotoLogin}
                      titleStyle={styles.titleButtonGotoLogin}
                      onPress={this.tryToSubmit}
                      title={L.onboardingscreen_gotologinscreen}
                      imageSource={require('../../assets/images/arrow-icon.png')}
                      imagePosition={'right'}
                      imageStyle={styles.iconButtonRegister}
                    />
                  </WalkthroughableView>
                </CopilotStep>
              )}
            </Content>
            <Content vertical={false} style={styles.footer}>
              <View style={styles.footerLeft}>
                {Features.isAllowedTo('Location') && (
                  <ButtonExternal
                    accessibilityLabel={'signinscreen_buttonexternal_map'}
                    onPress={this.goToLocation}
                    title={L.signinscreen_buttonexternal_map}
                    imageSource={require('../../assets/images/map-icon.png')}
                    imageExtraSource={require('../../assets/images/arrow-icon.png')}
                    imageStyle={styles.icon}
                    imageExtraStyle={styles.iconButton}
                  />
                )}
              </View>
              <View style={styles.footerRight}>
                {Features.isAllowedTo('Contact') && (
                  <ButtonExternal
                    accessibilityLabel={'signinscreen_buttonexternal_contact'}
                    onPress={this.goToContact}
                    title={L.signinscreen_buttonexternal_contact}
                    imageSource={require('../../assets/images/contact-icon.png')}
                    imageExtraSource={require('../../assets/images/arrow-icon.png')}
                    imageExtraStyle={styles.iconButton}
                    onLongPress={this.toggleDebug}
                  />
                )}
              </View>
            </Content>
          </View>
        </View>
        <ModalRegisterMode
          accessibilityLabel={
            'onboardingscreen_modalregistermode_chooseregistermode'
          }
          accessibilityLabelDni={'onboardingscreen_register_by_dni_start'}
          accessibilityLabelCard={'onboardingscreen_register_by_card_start'}
          ref={ref => {
            this.modalRegister = ref;
          }}
          onClose={this.closeModalRegisterMode}
          onRegisterWithDni={this.onRegisterWithDni}
          onRegisterWithCard={this.onRegisterWithCard}
          textButton={L.signinscreen_modalregistermode_chooseregistermodetext}
        />
      </Container>
    );
  }
}

const OnboardingScreen = withCopilot({ animated: true, overlay: 'view' })(
  withFocused(OnboardingCopilot)
);

export default OnboardingScreen;

import * as React from 'react';
import {
  Platform,
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import TypeInitialStart from '../../resources/constants/TypeInitialStart';
import Size from '../../resources/dimensions/Size';
import Version from '../ui/Version';
import DemoFlag from '../ui/DemoFlag';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language/index';
import Validate from '../../resources/functions/Validate';
import BackIcon from './BackIcon';
import ShowHeader from '../../resources/initialAppScreen/InitAppScreen';
import StepButtonStart from '../../components/tour/StepButtonStart';
import { StackActions } from '@react-navigation/native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

const paddingTop = Platform.OS === 'ios' ? Size.getStatusBarHeight() : 0;
const height = Size.getActionBarHeight() + paddingTop;
const statusBarHeight = Platform.OS === 'ios' ? Size.getStatusBarHeight() : 0;
const styles = StyleSheet.create({
  globalContainer: {
    backgroundColor: Colors.grey1,
    opacity: 1,
    height: height + 50,
    overflow: 'visible',
  } as ViewStyle,
  container: {
    paddingTop,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
  } as ViewStyle,
  leftContainer: {
    width: 60,
  } as ViewStyle,
  rightContainer: {
    width: 60,
  } as ViewStyle,
  logo: {
    height: 45,
    width: 90,
  } as ImageStyle,
  imageShadow: {
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'android' ? height + 27 : height + 30,
    zIndex: -200,
  } as ImageStyle,
  image: {
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'android' ? height + 16 : height + 15,
  } as ImageStyle,
  versionLabel: {
    color: Colors.grey4,
    fontSize: 12,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  version: {
    position: 'absolute',
    top: statusBarHeight + 10,
    right: 10,
  } as ViewStyle,
  demoFlag: {
    marginBottom: 4,
    overflow: 'visible',
  } as ViewStyle,
  tour: {
    position: 'absolute',
    zIndex: -100,
    top: Platform.OS === 'android' ? height + 5 : height,
  } as ViewStyle,
});
const resetAction = StackActions.push('Onboarding', {
  index: 0,
  key: null,
  // actions: [
  //   NavigationActions.navigate({
  //     routeName: 'Onboarding',
  //   }),
  // ],
});
export interface HeaderMainProps extends NativeStackHeaderProps {
  showBackround: boolean;
  showVersion: boolean;
  showTour: boolean;
  style: any
}

export interface HeaderMainState { }

export default class HeaderMain extends React.Component<
  HeaderMainProps,
  HeaderMainState
> {
  static defaultProps = {
    showBackround: true,
    showVersion: false,
  };

  state: HeaderMainState = {};

  render() {
    const { showBackround, showVersion, showTour, options, style } = this.props;
    // const { options } = this.props.scene.descriptor;
    // const isEmpty =
    //   !options.headerLeft && !options.headerRight && !options.title;
    // if (isEmpty) {
    //   return null;
    // }

    // const options = { headerStyle: {} }

    const { headerLeft } = options;

    return (
      <View
        accessibilityLabel={'headermain_container'}
        style={[styles.globalContainer, style]}
      >
        {showBackround && (
          <View>
            {showTour && <StepButtonStart style={styles.tour} />}
            <Image
              accessibilityLabel={'headermain_cover'}
              style={styles.imageShadow}
              resizeMode={'stretch'}
              fadeDuration={400}
              source={require('../../assets/images/header-background-gradient-shadow.png')}
            />
            <Image
              accessibilityLabel={'headermain_cover'}
              style={styles.image}
              resizeMode={'stretch'}
              source={require('../../assets/images/header-background-gradient.png')}
            />
          </View>
        )}
        <View
          accessibilityLabel={'headermain'}
          style={[styles.container, options.headerStyle]}
        >
          <View style={styles.leftContainer}>
            <>
              {ShowHeader.InitialAppScreen == TypeInitialStart.Onboarding && (
                <BackIcon
                  onPress={() => {
                    this.props.navigation.dispatch(resetAction);
                  }}
                />
              )}
              {!!options.headerLeft && (
                <>{options.headerLeft({ canGoBack: true })}</>
              )}
              {/* {options.headerLeft({})} */}
            </>
          </View>
          <View style={styles.centerContainer}>
            {Validate.isDemo() && (
              <DemoFlag
                style={styles.demoFlag}
                accessibilityLabel={'headermain_demoflag'}
              />
            )}
            <Image
              accessibilityLabel={'headermain_logo'}
              style={styles.logo}
              fadeDuration={200}
              resizeMode={'contain'}
              source={require('../../assets/images/logo-colorful.png')}
            />
          </View>

          {showVersion && (
            <Version
              label={`${L.headermain_version_label} `}
              style={styles.version}
              labelStyle={styles.versionLabel}
            />
          )}

          <View style={styles.rightContainer}>
            {!!options.headerRight && (
              <>
                {options.headerRight({ canGoBack: true })}
              </>
            )}
          </View>
        </View>
      </View>
    );
  }
}

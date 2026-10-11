import * as React from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ViewStyle,
  ViewProps,
  TextStyle,
  StyleProp,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Size from '../../resources/dimensions/Size';
import DemoFlag from '../ui/DemoFlag';
import Validate from '../../resources/functions/Validate';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

const paddingTop = Platform.OS === 'ios' ? Size.getStatusBarHeight() : 0;
const height = Size.getActionBarHeight() + paddingTop;
const styles = StyleSheet.create({
  globalContainer: {
    overflow: 'visible',
    backgroundColor: Colors.transparent,
  } as ViewStyle,
  container: {
    height,
    paddingTop,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  shadow: {
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowColor: Colors.black,
    shadowOffset: { height: 2, width: 0 },
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
  } as ViewStyle,
  title: {
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'center',
    color: Colors.grey6,
    fontSize: 18,
    lineHeight: 20,
    marginTop: 4,
  } as TextStyle,
  centerContainer: {
    flex: 1,
  } as ViewStyle,
  leftContainer: {
    width: 60,
  } as ViewStyle,
  rightContainer: {
    width: 60,
  } as ViewStyle,
  demoFlag: {
    marginTop: -8,
    marginBottom: 4,
    overflow: 'visible',
  } as ViewStyle,
});

export interface HeaderProps extends NativeStackHeaderProps {
  styleGlobalContainer?: StyleProp<ViewStyle>;
  // scene?: any;
  styleTitle?: StyleProp<TextStyle>;
}
export interface HeaderState { }

export default class Header extends React.Component<HeaderProps, HeaderState> {
  state: HeaderState = {};

  render() {
    const { styleGlobalContainer, options, styleTitle } = this.props;
    // const { options } = scene.descriptor;
    const isEmpty =
      !options.headerLeft && !options.headerRight && !options.title;
    if (isEmpty) {
      return null;
    }

    return (
      <View
        accessibilityLabel={'header_container'}
        style={[styles.globalContainer, styleGlobalContainer]}
      >
        <View
          accessibilityLabel={'header'}
          style={[styles.container, options.headerStyle, styles.shadow]}
        >
          <View style={styles.leftContainer}>
            {!!options.headerLeft && (
              <>{options.headerLeft({ canGoBack: true })}</>
            )}
          </View>
          <View style={styles.centerContainer}>
            {Validate.isDemo() && (
              <DemoFlag
                style={styles.demoFlag}
                accessibilityLabel={'header_demoflag'}
              />
            )}
            <Text
              allowFontScaling={false}
              accessibilityLabel={'header_title'}
              style={[styles.title, styleTitle]}
            >
              {options.title}
            </Text>
          </View>
          {!!options.headerRight && (
            <View style={styles.rightContainer}>
              {options.headerRight({ canGoBack: true })}
            </View>
          )}
        </View>
      </View>
    );
  }
}

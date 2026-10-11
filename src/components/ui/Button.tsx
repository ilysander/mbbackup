import * as React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Loading from './Loading';
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 25,
    margin: 0,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  } as ViewStyle,
  containerDisabled: {
    backgroundColor: Colors.grey3,
    borderColor: Colors.grey3,
  } as ViewStyle,
  loading: {
    marginRight: 4,
  } as ViewStyle,
  icon: {
    fontSize: 14,
    color: Colors.white,
    marginRight: 4,
  } as ImageStyle,
  title: {
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'center',
    color: Colors.white,
    fontSize: 16,
  } as TextStyle,
  containerLoading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  } as ViewStyle,
  containerLoadingSmall: {
    left: 4,
  } as ViewStyle,
  containerLoadingCenter: {
    position: 'relative',
    left: 0,
  } as ViewStyle,
  light: {
    backgroundColor: Colors.white,
  } as ViewStyle,
  primaryLight: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  } as ViewStyle,
  primary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  } as ViewStyle,
  secondary: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  } as ViewStyle,
  accent: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  } as ViewStyle,
  accentDark: {
    backgroundColor: Colors.accentDark,
    borderColor: Colors.accentDark,
  } as ViewStyle,
  danger: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  } as ViewStyle,
  neutral: {
    backgroundColor: Colors.grey5,
    borderColor: Colors.grey5,
  } as ViewStyle,
  disabled: {
    backgroundColor: Colors.grey3,
    borderColor: Colors.grey3,
  } as ViewStyle,
  small: {
    minHeight: 30,
    paddingHorizontal: 12,
  } as ViewStyle,
  medium: {
    minHeight: 40,
    paddingHorizontal: 12,
  } as ViewStyle,
  big: {
    minHeight: 50,
  } as ViewStyle,
  titleSmall: {
    // ...Font({ weight: 'SemiBold' }),
    // textAlign: 'center',
    // color: Colors.white,
    fontSize: 14,
  } as TextStyle,
  center: {
    minHeight: 30,
    justifyContent: 'center',
  } as ViewStyle,
});

export interface ButtonProps extends TouchableProps {
  loading?: boolean;
  disabled?: boolean;
  allowOnPress?: boolean;
  /**
   * cuando `title` es undefined el loading se centra en el boton
   */
  title?: string;
  textStyle?: StyleProp<TextStyle>;
  imageSource?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  light?: boolean;
  small?: boolean;
  medium?: boolean;
  big?: boolean;
  typeColor?:
  | 'primaryLight'
  | 'primary'
  | 'secondary'
  | 'accentDark'
  | 'accent'
  | 'danger'
  | 'neutral';
}

export interface ButtonState { }

export default class Button extends React.Component<ButtonProps, ButtonState> {
  static defaultProps = {
    typeColor: 'primary',
  };
  onPress = (event: GestureResponderEvent) => {
    const { onPress, loading, disabled, allowOnPress } = this.props;
    if ((disabled && !allowOnPress) || loading) {
      return;
    }
    if (typeof onPress === 'function') {
      onPress(event);
    }
  };

  render() {
    const {
      style,
      disabled,
      title,
      textStyle,
      imageSource,
      imageStyle,
      loading,
      onPress,
      light,
      typeColor,
      small,
      accessibilityLabel,
      medium,
      big,
      ...props
    } = this.props;
    const stylesButton = [];
    let color;

    switch (typeColor) {
      case 'primaryLight':
        stylesButton.push(styles.primaryLight);
        color = Colors.primaryLight;
        break;
      case 'primary':
        stylesButton.push(styles.primary);
        color = Colors.primary;
        break;
      case 'secondary':
        stylesButton.push(styles.secondary);
        color = Colors.secondary;
        break;
      case 'accentDark':
        stylesButton.push(styles.accentDark);
        color = Colors.accentDark;
        break;
      case 'accent':
        stylesButton.push(styles.accent);
        color = Colors.accent;
        break;
      case 'danger':
        stylesButton.push(styles.danger);
        color = Colors.danger;
        break;
      case 'neutral':
        stylesButton.push(styles.neutral);
        color = Colors.neutral;
        break;
      default:
        break;
    }

    if (disabled) {
      stylesButton.push(styles.disabled);
      color = Colors.grey3;
    }
    if (small) {
      stylesButton.push(styles.small);
    }
    if (medium) {
      stylesButton.push(styles.medium);
    }
    if (big) {
      stylesButton.push(styles.big);
    }

    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'button'}
        activeOpacity={disabled ? 1 : 0.2}
        style={[
          styles.container,
          stylesButton,
          disabled && styles.containerDisabled,
          light && styles.light,
          style,
          !title && styles.center,
        ]}
        {...props}
        onPress={onPress ? this.onPress : undefined}
        analyticsParams={title ? title : undefined}
      >
        {imageSource && !loading && (
          <Image
            accessibilityLabel={'button_image'}
            style={[styles.icon, imageStyle]}
            source={imageSource}
          />
        )}
        {loading && (
          <View
            style={[
              styles.containerLoading,
              small && styles.containerLoadingSmall,
              !title && styles.containerLoadingCenter,
            ]}
          >
            <Loading
              style={styles.loading}
              size={'small'}
              color={light ? color : Colors.white}
            />
          </View>
        )}
        {!!title && !loading && (
          <Text
            accessibilityLabel={'button_text'}
            style={[
              styles.title,
              small && styles.titleSmall,
              light && { color },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </Touchable>
    );
  }
}

import * as React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: Colors.white,
    borderColor: Colors.grey2,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  } as ViewStyle,
  smallerContainer: {
    paddingHorizontal: 7,
    borderRadius: 9,
    height: 18,
  } as ViewStyle,
  valueText: {
    ...Font(),
    fontSize: 12,
  } as TextStyle,
  titleText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  smallTitleText: {
    fontSize: 13,
  } as TextStyle,
  primaryLight: {
    borderColor: Colors.primaryLight,
  } as ViewStyle,
  primary: {
    borderColor: Colors.primary,
  } as ViewStyle,
  secondary: {
    borderColor: Colors.secondary,
  } as ViewStyle,
  accent: {
    borderColor: Colors.accent,
  } as ViewStyle,
  accentDark: {
    borderColor: Colors.accentDark,
  } as ViewStyle,
  danger: {
    borderColor: Colors.danger,
  } as ViewStyle,
  default: {
    borderColor: Colors.grey2,
  } as ViewStyle,
  disabled: {
    borderColor: Colors.grey6,
  } as ViewStyle,
  image: {
    width: 14,
    height: 14,
    marginRight: 10,
    marginLeft: -2,
    tintColor: Colors.primaryLight,
  } as ImageStyle,
});

export interface TagProps extends ViewProps {
  title: string;
  value?: string;
  imageSource?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel: string;
  selected?: boolean;
  small?: boolean;
  typeColor?:
    | 'default'
    | 'primaryLight'
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'accentDark'
    | 'accent'
    | 'danger';
}

export interface TagState {}

export default class Tag extends React.Component<TagProps, TagState> {
  static defaultProps = {
    typeColor: 'default',
  };

  render() {
    const {
      title,
      value,
      small,
      imageSource,
      imageStyle,
      selected,
      textStyle,
      typeColor,
      style,
      accessibilityLabel,
      ...props
    } = this.props;
    const stylesTag = [];

    switch (typeColor) {
      case 'primaryLight':
        stylesTag.push(styles.primaryLight);
        break;
      case 'disabled':
        stylesTag.push(styles.disabled);
        break;
      case 'primary':
        stylesTag.push(styles.primary);
        break;
      case 'secondary':
        stylesTag.push(styles.secondary);
        break;
      case 'accentDark':
        stylesTag.push(styles.accentDark);
        break;
      case 'accent':
        stylesTag.push(styles.accent);
        break;
      case 'danger':
        stylesTag.push(styles.danger);
        break;
      default:
        stylesTag.push(styles.default);
        break;
    }

    return (
      <View
        accessibilityLabel={accessibilityLabel || 'tag_container'}
        style={[
          styles.container,
          small && styles.smallerContainer,
          selected && stylesTag,
          style,
        ]}
        {...props}
      >
        {imageSource && (
          <Image source={imageSource} style={[styles.image, imageStyle]} />
        )}
        <Text
          accessibilityLabel={'tag_title'}
          style={[styles.titleText, small && styles.smallTitleText, textStyle]}
        >
          {title}
        </Text>
        {!!value && (
          <Text accessibilityLabel={'tag_value'} style={styles.valueText}>
            {' '}
            {value}
          </Text>
        )}
      </View>
    );
  }
}

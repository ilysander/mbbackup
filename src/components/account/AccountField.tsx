import * as React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { Loading, ButtonLink } from '../ui';
import { L } from '../../resources/language';
import { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  } as ViewStyle,
  subtitle: {
    alignItems: 'flex-start',
  } as ViewStyle,
  subtitleText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  nameText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  placeholderText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey3,
    fontSize: 13,
    top: -5,
  } as TextStyle,
  nameContainer: {
    flex: 1,
  } as ViewStyle,
  info: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  icon: {
    marginRight: 2,
    alignSelf: 'flex-start',
    width: 28,
    height: 28,
    tintColor: Colors.secondary,
  } as ImageStyle,
  iconDisabled: {
    tintColor: Colors.grey6,
    alignSelf: 'flex-start',
  } as ImageStyle,
  placeholderSubtitleText: {
    ...Font({ weight: 'Medium', style: 'Italic' }),
    color: Colors.grey4,
    fontSize: 14,
  } as TextStyle,
  buttonLink: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
  } as TextStyle,
});

export interface AccountFieldProps extends TouchableProps {
  isDisabled?: boolean;
  placeholder?: string;
  subtitle?: string;
  value?: string;
  imageSource?: ImageSourcePropType;
  isLoading?: boolean;
  styleView?: StyleProp<ViewStyle>;
  styleSubtitle?: StyleProp<ViewStyle>;
  hasValue?: boolean;
}

export interface AccountFieldState {}

export default class AccountField extends React.Component<
  AccountFieldProps,
  AccountFieldState
> {
  onPress = (event: GestureResponderEvent) => {
    const { isDisabled, onPress } = this.props;
    if (isDisabled) {
      return;
    }
    typeof onPress === 'function' && onPress(event);
  };
  nameContainer = () => {
    const { placeholder, subtitle, value } = this.props;
    return (
      <View style={styles.nameContainer}>
        {!value && placeholder && (
          <Text
            accessibilityLabel={'accountfield_text_placeholder'}
            style={styles.placeholderText}
          >
            {placeholder}
          </Text>
        )}
        {!!value && (
          <Text
            accessibilityLabel={'accountfield_text_name'}
            style={styles.nameText}
          >
            {value}
          </Text>
        )}
        {!!subtitle && (
          <View style={styles.subtitle}>
            <Text
              accessibilityLabel={'accountfield_text_subtitle'}
              style={styles.subtitleText}
            >
              {subtitle}
            </Text>
          </View>
        )}
        {!subtitle && placeholder && (
          <Text
            accessibilityLabel={'accountfield_text_placeholder'}
            style={styles.placeholderSubtitleText}
          >
            {placeholder}
          </Text>
        )}
      </View>
    );
  };

  render() {
    const {
      imageSource,
      onPress,
      isDisabled,
      isLoading,
      value,
      hasValue,
      ...props
    } = this.props;
    return (
      <View activeOpacity={isDisabled ? 1 : 0.2} {...props}>
        <View
          accessibilityLabel={'accountfield_container'}
          style={styles.container}
        >
          <View style={styles.info}>
            {imageSource && (
              <Image
                resizeMode={'contain'}
                style={[styles.icon, isDisabled && styles.iconDisabled]}
                accessibilityLabel={'accountfield_image_icon'}
                source={imageSource}
              />
            )}
            {!isLoading && this.nameContainer()}
            {isLoading && <Loading size={'small'} color={Colors.primary} />}
          </View>
          {!isLoading && !isDisabled && typeof onPress === 'function' && (
            <ButtonLink
              accent={'primary'}
              accessibilityLabel={'accountfield_touchable_edit'}
              onPress={!isLoading ? this.onPress : undefined}
              titleStyle={styles.buttonLink}
              title={
                hasValue
                  ? L.accountfield_touchable_edit
                  : L.accountfield_touchable_add
              }
            />
          )}
        </View>
      </View>
    );
  }
}

import * as React from 'react';
import {
  Image,
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
import TextError from './TextError';
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  } as ViewStyle,
  icon: {
    width: 26,
    height: 26,
    borderRadius: 13,
  } as ImageStyle,
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: 290,
  } as TextStyle,
  placeholderText: {
    ...Font(),
    fontSize: 13,
    marginLeft: 10,
    color: Colors.grey5,
  } as TextStyle,
  accent: {
    color: Colors.accentDark,
  } as TextStyle,
  placeholderChecked: {
    ...Font(),
  } as TextStyle,
  uncheckedIcon: {
    borderColor: Colors.grey3,
    borderWidth: 0.5,
  } as ViewStyle,
  errorCheck: {
    borderColor: Colors.danger,
    borderWidth: 1,
  } as ViewStyle,
  chekedIcon: {
    tintColor: Colors.primaryLight,
  } as ImageStyle,
  textErrorContainer: {
    marginTop: 8,
  } as TextStyle,
});

export interface CheckBoxProps extends TouchableProps {
  accent?: boolean;
  placeholder?: string | React.ReactNode;
  placeholderStyle?: StyleProp<TextStyle>;
  rightContainer?: React.ReactNode[] | React.ReactNode;
  placeholderMessage2?: React.ReactNode[] | React.ReactNode;
  iconStyle?: StyleProp<ImageStyle>;
  iconUncheckedStyle?: StyleProp<ImageStyle>;
  defaultValue?: boolean;
  isPEPDeclaration?: boolean;
  onChangeValue?: (checked: boolean) => void;
  errorMessage?: string;
}

export interface CheckBoxState {
  checked: boolean;
}

export default class CheckBox extends React.Component<
  CheckBoxProps,
  CheckBoxState
> {
  static defaultProps = {
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
    errorMessage: '',
  };

  state: CheckBoxState = {
    checked: false,
  };

  componentDidMount() {
    const { defaultValue } = this.props;
    typeof defaultValue !== 'undefined' &&
      this.setState({ checked: defaultValue });
  }

  getValue = () => {
    return this.state.checked;
  };
  setValue = (checked: boolean) => {
    this.setState({ checked });
    const { onChangeValue } = this.props;
    if (typeof onChangeValue === 'function') {
      onChangeValue(checked);
    }
  };

  toggle = () => {
    const { onChangeValue, isPEPDeclaration } = this.props;
    if (isPEPDeclaration) {
      const newValue = !this.state.checked;
      this.setState({ checked: false });
      if (typeof onChangeValue === 'function') {
        onChangeValue(newValue);
      }
    } else {
      const newValue = !this.state.checked;
      this.setState({ checked: newValue });
      if (typeof onChangeValue === 'function') {
        onChangeValue(newValue);
      }
    }
  };

  render() {
    const { checked } = this.state;
    const {
      style,
      accessibilityLabel,
      accent,
      placeholder,
      placeholderStyle,
      rightContainer,
      placeholderMessage2,
      iconUncheckedStyle,
      iconStyle,
      errorMessage,
      hitSlop,
      analyticsParams,
      ...props
    } = this.props;
    const isValid = !errorMessage;

    return (
      <>
        <View style={styles.container}>
          <View
            style={[styles.container, style]}
            accessibilityLabel={
              accessibilityLabel
                ? accessibilityLabel + '_container'
                : 'checkbox'
            }
          >
            <Touchable
              accessibilityLabel={accessibilityLabel}
              hitSlop={hitSlop}
              style={styles.label}
              onPress={this.toggle}
              analyticsParams={analyticsParams}
              {...props}
            >
              {checked && (
                <Image
                  accessibilityLabel={'checkbox_image_checked'}
                  style={[styles.icon, styles.chekedIcon, iconStyle]}
                  source={require('../../assets/images/checked-icon.png')}
                />
              )}
              {!checked && (
                <View
                  style={[
                    styles.icon,
                    styles.uncheckedIcon,
                    !isValid && styles.errorCheck,
                    iconUncheckedStyle,
                  ]}
                />
              )}
            </Touchable>
          </View>
          <View
            style={[styles.container, style]}
            accessibilityLabel={
              accessibilityLabel
                ? accessibilityLabel + '_container'
                : 'checkbox'
            }
          >
            <Touchable
              accessibilityLabel={accessibilityLabel}
              hitSlop={hitSlop}
              style={styles.label}
              onPress={this.toggle}
              {...props}
            >
              {!!placeholder && (
                <Text
                  accessibilityLabel={'checkbox_text'}
                  style={[
                    styles.placeholderText,
                    placeholderStyle,
                    accent && styles.accent,
                    checked && styles.placeholderChecked,
                  ]}
                >
                  {placeholder}
                </Text>
              )}

              {rightContainer}
              {placeholderMessage2}
            </Touchable>
          </View>
        </View>
        {!isValid && (
          <TextError
            style={styles.textErrorContainer}
            accessibilityLabel={'checkbox_texterror'}
          >
            {errorMessage}
          </TextError>
        )}
      </>
    );
  }
}

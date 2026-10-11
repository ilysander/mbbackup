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
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  } as ViewStyle,
  icon: {
    width: 24,
    height: 24,
  } as ImageStyle,
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  } as TextStyle,
  placeholderText: {
    ...Font(),
    flex: 1,
    fontSize: 13,
    marginLeft: 20,
    color: Colors.grey5,
  } as TextStyle,
  accent: {
    color: Colors.accentDark,
  } as TextStyle,
  placeholderChecked: {
    ...Font(),
  } as TextStyle,
  uncheckedIcon: {
    tintColor: Colors.grey5,
  } as ImageStyle,
  checkedIcon: {
    tintColor: Colors.secondary,
  } as ImageStyle,
});

export interface CircularCheckProps extends TouchableProps {
  accent?: boolean;
  placeholder?: string | React.ReactNode;
  placeholderStyle?: StyleProp<TextStyle>;
  rightContainer?: React.ReactNode[] | React.ReactNode;
  iconStyle?: StyleProp<ImageStyle>;
  defaultValue?: boolean;
  onChangeValue?: (checked: boolean) => void;
}

export interface CircularCheckState {
  checked: boolean;
}

export default class CircularCheck extends React.Component<
  CircularCheckProps,
  CircularCheckState
> {
  static defaultProps = {
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  };

  state: CircularCheckState = {
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
    const { onChangeValue } = this.props;
    const newValue = !this.state.checked;
    this.setState({ checked: newValue });

    if (typeof onChangeValue === 'function') {
      onChangeValue(newValue);
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
      iconStyle,
      hitSlop,
      ...props
    } = this.props;

    return (
      <View
        style={[styles.container, style]}
        accessibilityLabel={
          accessibilityLabel
            ? accessibilityLabel + '_container'
            : 'circularcheck'
        }
      >
        <Touchable
          accessibilityLabel={'circularcheck_button'}
          hitSlop={hitSlop}
          style={styles.label}
          onPress={this.toggle}
          {...props}
        >
          {checked && (
            <Image
              accessibilityLabel={'circularcheck_image_checked'}
              style={[styles.icon, styles.checkedIcon, iconStyle]}
              source={require('../../assets/images/item-checked-icon.png')}
            />
          )}
          {!checked && (
            <Image
              accessibilityLabel={'circularcheck_image_unchecked'}
              style={[styles.icon, styles.uncheckedIcon, iconStyle]}
              source={require('../../assets/images/radio-button-unselected.png')}
            />
          )}
          <Text
            accessibilityLabel={'circularcheck_text'}
            style={[
              styles.placeholderText,
              placeholderStyle,
              accent && styles.accent,
              checked && styles.placeholderChecked,
            ]}
          >
            {placeholder}
          </Text>
        </Touchable>
        {rightContainer}
      </View>
    );
  }
}

import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Validate from '../../resources/functions/Validate';
import TextError from './TextError';
import TextInput, {TextInputProps} from './TextInput';
import Touchable from './Touchable';

const Sizes = {
  ClearButtonWidth: 30,
  Icon: 20,
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'column',
    marginBottom: 20,
    marginTop: 10,
  } as ViewStyle,
  content: {
    position: 'relative',
  } as ViewStyle,
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 10,
    bottom: 1,
    justifyContent: 'center',
  } as ViewStyle,
  textErrorContainer: {
    marginTop: 4,
  } as ViewStyle,
  image: {
    width: Sizes.Icon,
    height: Sizes.Icon,
    tintColor: Colors.grey4,
  } as ImageStyle,

  /**
   * aqui agregamos padding porque debe sobrescribirse en algún momento por `styles.inputImage`
   */
  input: {
    ...Font(),
    color: Colors.grey6,
    borderColor: Colors.grey2,
    backgroundColor: Colors.grey1,
    borderRadius: 12,
    borderWidth: 1,
    paddingBottom: Platform.OS === 'android' ? 15 : 10,
    paddingLeft: 10,
    paddingRight: 8,
    paddingTop: Platform.OS === 'android' ? 15 : 10,
    fontSize: 14,
    textDecorationLine: 'none',
  } as TextStyle,
  labelText: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  labelTextWithSubtitle: {
    ...Font({weight: 'SemiBold'}),
  } as TextStyle,
  labelContainer: {
    zIndex: 2,
    flexDirection: 'row',
    paddingBottom: 4,
    alignItems: 'center',
  } as TextStyle,
  labelContainerWithSubtitle: {
    paddingBottom: 0,
  } as ViewStyle,
  labelSubtitleContainer: {
    paddingBottom: 4,
  } as ViewStyle,
  labelSubtitleText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey5,
  } as TextStyle,
  rightContainer: {
    position: 'absolute',
    right: -Sizes.ClearButtonWidth,
  } as ViewStyle,
  inputImage: {
    paddingLeft: Sizes.Icon + 20,
  } as TextStyle,
  inputContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
  },
  imageIconInput: {
    width: 16,
    height: 16,
  },
});

export interface TextInputMaskedProps extends TextInputProps {
  mask: any;
  typeTooltip?: string;
  onPress?: () => void;
}

export interface TextInputMaskedState {
  errorMessage?: string | React.ReactNode;
}

export default class TextInputMasked extends React.Component<
  TextInputMaskedProps,
  TextInputMaskedState
> {
  state: TextInputMaskedState = {};
  timeoutFocus!: NodeJS.Timeout;
  input!: TextInput | null;

  isValid = (showError = true) => {
    if (this.input) {
      return this.input.isValid(showError);
    }
    return true;
  };
  focus = () => {
    this.timeoutFocus && clearTimeout(this.timeoutFocus);
    this.timeoutFocus = setTimeout(() => {
      this.input && this.input.focus();
    }, 300);
  };

  componentWillUnmount() {
    this.timeoutFocus && clearTimeout(this.timeoutFocus);
  }

  blur = () => {
    this.input && this.input.blur();
  };

  getValue = () => {
    if (this.input) {
      return this.input.getValue();
    }
    const {mask} = this.props;
    return mask.value;
  };

  setValue = (value: string) => {
    this.input && this.input.setValue(value);
  };
  setError = (value?: string | React.ReactNode) => {
    this.input && this.input.setError(value);
    this.setState({errorMessage: value});
  };
  focusError = (value?: string | React.ReactNode) => {
    this.input && this.input.setError(value);
  };
  clearError = () => {
    this.setError(undefined);
  };

  render() {
    const {
      onPress,
      accessibilityLabel,
      style,
      imageSource,
      mask,
      formatText,
      rightContainer,
      children,
      underlineColorAndroid,
      label,
      rightContainerStyle,
      labelContainerStyle,
      labelContainer,
      help,
      containerInputStyle,
      labelSubtitle,
      imageIconStyle,
      typeTooltip,
      accessibilityErrorInput,
      ...props
    } = this.props;

    if (!mask) {
      return (
        <TextInput
          ref={ref => {
            this.input = ref;
          }}
          accessibilityLabel={accessibilityLabel}
          accessibilityErrorInput={accessibilityErrorInput}
          label={label}
          imageSource={imageSource}
          formatText={formatText}
          rightContainer={rightContainer}
          underlineColorAndroid={underlineColorAndroid}
          rightContainerStyle={rightContainerStyle}
          labelContainerStyle={labelContainerStyle}
          labelContainer={labelContainer}
          containerInputStyle={containerInputStyle}
          help={help}
          typeTooltip={typeTooltip}
          labelSubtitle={labelSubtitle}
          style={[styles.inputContainer, style]}
          imageIconStyle={styles.imageIconInput}
          {...props}
        />
      );
    }

    const {errorMessage} = this.state;
    const {labelStyle, containerStyle, textErrorStyle} = this.props;
    const isInvalid = !!errorMessage;
    return (
      <Touchable
        accessibilityLabel={`textinputmasked_touchable_container`}
        activeOpacity={0.5}
        onPress={onPress}>
        <View style={[styles.container, containerStyle]}>
          <View
            accessibilityLabel={'textinputmasked_label_container'}
            style={[
              styles.labelContainer,
              !!labelSubtitle && styles.labelContainerWithSubtitle,
              labelContainerStyle,
            ]}>
            {!!label && (
              <Text
                accessibilityLabel={'textinputmasked_label'}
                style={[
                  styles.labelText,
                  !!labelSubtitle && styles.labelTextWithSubtitle,
                  labelStyle,
                ]}>
                {label}
              </Text>
            )}
            {labelContainer}
          </View>
          {labelSubtitle && (
            <View style={styles.labelSubtitleContainer}>
              <Text
                accessibilityLabel={'textinput_label_subtitle'}
                style={styles.labelSubtitleText}>
                {labelSubtitle}
              </Text>
            </View>
          )}
          <View style={[styles.content, containerInputStyle]}>
            <Text
              accessibilityLabel={'textinputmasked_text'}
              {...props}
              style={[styles.input, !!imageSource && styles.inputImage, style]}>
              {Validate.formattingText(mask.mask, formatText, false)}
            </Text>
            {imageSource && (
              <View style={styles.imageContainer}>
                <Image
                  accessibilityLabel={'textinputmasked_icon'}
                  style={[styles.image, imageIconStyle]}
                  resizeMode={'contain'}
                  source={imageSource}
                />
              </View>
            )}
            <View style={[styles.rightContainer, rightContainerStyle]}>
              {rightContainer}
            </View>
          </View>
          {children}
          {!isInvalid && help}
          {isInvalid && (
            <TextError style={[styles.textErrorContainer, textErrorStyle]}>
              {errorMessage}
            </TextError>
          )}
        </View>
      </Touchable>
    );
  }
}

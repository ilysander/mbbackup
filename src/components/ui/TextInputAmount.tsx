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
  ViewStyle,
} from 'react-native';
import Config from '../../Config';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import ButtonImage from './ButtonImage';
import TextError from './TextError';
import TextInputBase, { TextInputBaseProps } from './TextInputBase';

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
  inputClearButton: {
    paddingRight: Sizes.ClearButtonWidth,
  } as TextStyle,
  textErrorContainer: {
    marginTop: 4,
  } as ViewStyle,
  image: {
    width: Sizes.Icon,
    height: Sizes.Icon,
    tintColor: Colors.grey5,
  } as ImageStyle,
  currencyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  } as ViewStyle,
  input: {
    ...Font(),
    color: Colors.grey6,
    borderColor: Colors.grey2,
    backgroundColor: Colors.grey1,
    borderRadius: 12,
    borderWidth: 1,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 8,
    paddingTop: 10,
    fontSize: 15,
    textDecorationLine: 'none',
  } as TextStyle,
  labelText: {
    ...Font(),
    lineHeight: 16,
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  labelContainer: {
    flexDirection: 'row',
    paddingBottom: 4,
    alignItems: 'center',
  } as TextStyle,
  inputFocus: {
    borderColor: Colors.primary,
  } as TextStyle,
  inputImage: {
    paddingLeft: Sizes.Icon + 20,
  } as TextStyle,
  inputCurrency: {
    paddingLeft: Sizes.Icon + 15,
  } as TextStyle,
  inputError: {
    borderColor: Colors.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: Colors.shadow,
    shadowRadius: 0,
    shadowOpacity: 0,
  } as TextStyle,
  rightContainer: {
    position: 'absolute',
    right: -Sizes.ClearButtonWidth,
  } as ViewStyle,
  clearButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 1,
    width: Sizes.ClearButtonWidth,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  clearButtonIcon: {
    width: 18,
    height: 18,
    right: 4,
    tintColor: Colors.grey4,
  } as ImageStyle,
  currency: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 15,
  } as TextStyle,
});

const defaultInputValue = '0.00';
export interface TextInputAmountProps extends TextInputBaseProps {
  help?: React.ReactNode[] | React.ReactNode;
  label?: string | React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  containerInputStyle?: StyleProp<ViewStyle>;
  imageSource?: ImageSourcePropType;
  rightContainer?: React.ReactNode[] | React.ReactNode;
  rightContainerStyle?: StyleProp<ViewStyle>;
  labelContainer?: React.ReactNode[] | React.ReactNode;
  labelContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  textErrorStyle?: StyleProp<TextStyle>;
  showClearButton?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  currency?: string;
  errorDecoration?: boolean;
}

export interface TextInputAmountState {
  isFocused: boolean;
  isEmpty: boolean;
  errorMessage?: string;
}

export default class TextInputAmount extends React.Component<
  TextInputAmountProps,
  TextInputAmountState
> {
  static defaultProps = {
    editable: true,
    showClearButton: true,
  };

  state: TextInputAmountState = {
    isFocused: false,
    isEmpty: true,
    errorMessage: '',
  };
  input!: TextInputBase | null;

  onEmptyState = (isEmpty: boolean) => {
    this.setState({ isEmpty });
  };
  setValue = (value: string) => {
    this.input && this.input.setValue(value);
  };

  onFormatValue = (originalValue: string) => {
    let value = this.numberWithoutCommas(originalValue);
    const isDecimal =
      value.includes(L.securekeyboard_decimal_separator) &&
      value.split(L.securekeyboard_decimal_separator)[1].length > 1;
    if (isDecimal) {
      value = this.numberWithCommas(
        Amount.toFixedSingle(value, Config.settings.decimals)
      );
    } else {
      value = this.numberWithCommas(value);
    }
    return value;
  };

  getFormatValue = () => {
    if (!this.input) {
      return;
    }
    return this.input.getFormatValue();
  };
  getValue = () => {
    if (!this.input) {
      return 0;
    }
    const value = this.input.getValue();
    return Number(this.numberWithoutCommas(value));
  };
  isValid = (showError = true) => {
    if (!this.input) {
      return false;
    }
    const isValid = this.input.isValid(showError);
    return isValid;
  };
  setError = (errorMessage?: string) => {
    this.setState({ errorMessage });
  };
  clearError = () => {
    this.setError(undefined);
  };
  numberWithCommas = (value: string) => {
    if (value === 'NaN') {
      return defaultInputValue;
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  numberWithoutCommas = (value: string) => {
    return value.toString().replace(/,/g, '');
  };

  getInputRef = () => {
    return this.input;
  };

  onClearAll = () => {
    this.input && this.input.setValue('');
    this.focus();
  };
  focus = () => {
    this.input && this.input.focus();
  };
  blur = () => {
    this.input && this.input.blur();
  };
  onFocus = () => {
    const { onFocus } = this.props;
    this.setState({ isFocused: true });
    typeof onFocus === 'function' && onFocus();
  };

  onBlur = () => {
    const { onBlur } = this.props;
    let value = this.input ? this.input.getValue() : '';
    value = this.numberWithoutCommas(value);
    value = this.numberWithCommas(
      Amount.toFixed(value, Config.settings.decimals)
    );
    if (value !== defaultInputValue) {
      this.input && this.input.setState({ value });
    }
    this.setState({ isFocused: false });
    typeof onBlur === 'function' && onBlur();
  };
  onError = (message?: string) => {
    this.setError(message);
  };

  /* NOSONAR */
  render() {
    const { errorMessage, isEmpty, isFocused } = this.state;
    const {
      style,
      help,
      containerStyle,
      children,
      accessibilityLabel,
      imageSource,
      currency,
      rightContainer,
      showClearButton,
      errorDecoration,
      label,
      labelContainerStyle,
      labelStyle,
      labelContainer,
      containerInputStyle,
      rightContainerStyle,
      textErrorStyle,
      ...props
    } = this.props;
    const isInvalid = !!errorMessage;

    return (
      <View
        accessibilityLabel={
          accessibilityLabel ? accessibilityLabel + '_container' : 'textinput'
        }
        style={[styles.container, containerStyle]}
      >
        {!!label && (
          <View
            accessibilityLabel={'textinput_label_container'}
            style={[styles.labelContainer, labelContainerStyle]}
          >
            <Text
              accessibilityLabel={'textinput_label'}
              style={[styles.labelText, labelStyle]}
            >
              {label}
            </Text>
          </View>
        )}
        {labelContainer}
        <View style={[styles.content, containerInputStyle]}>
          <TextInputBase
            accessibilityLabel={accessibilityLabel}
            selectionColor={Colors.secondary}
            {...props}
            style={[
              styles.input,
              !!imageSource && styles.inputImage,
              !!currency && styles.inputCurrency,
              isInvalid && styles.inputError,
              isFocused && styles.inputFocus,
              showClearButton && styles.inputClearButton,
              style,
            ]}
            onEmptyState={this.onEmptyState}
            onFormatValue={this.onFormatValue}
            onError={this.onError}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            ref={ref => {
              this.input = ref;
            }}
          />

          {imageSource && (
            <View style={styles.imageContainer}>
              <Image
                accessibilityLabel={'textinput_icon'}
                style={[styles.image]}
                resizeMode={'contain'}
                source={imageSource}
              />
            </View>
          )}
          {!!currency && (
            <View style={styles.currencyContainer}>
              <Text
                accessibilityLabel={'amountinput_currency'}
                style={styles.currency}
              >
                {currency}
              </Text>
            </View>
          )}

          {showClearButton && !isEmpty && (
            <ButtonImage
              accessibilityLabel={'textinput_clear_button'}
              onPress={this.onClearAll}
              imageSource={require('../../assets/images/clear-input-icon.png')}
              imageStyle={styles.clearButtonIcon}
              style={styles.clearButton}
            />
          )}
          <View style={[styles.rightContainer, rightContainerStyle]}>
            {rightContainer}
          </View>
        </View>
        {children}
        {!isInvalid && help}
        {isInvalid && (
          <TextError
            style={[styles.textErrorContainer, textErrorStyle]}
            decoration={errorDecoration}
          >
            {errorMessage}
          </TextError>
        )}
      </View>
    );
  }
}

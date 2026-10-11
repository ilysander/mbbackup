import * as React from 'react';
import {
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
import Amount from '../../resources/money/Amount';
import TextInputBase, { TextInputBaseProps } from './TextInputBase';
import Touchable from '../ui/Touchable';

const Sizes = {
  ClearButtonWidth: 30,
  Icon: 20,
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'column',
    marginBottom: 5,
    marginTop: 5,
    marginHorizontal: 5,
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
  textError: {
    marginTop: 4,
    ...Font({ weight: 'Medium' }),
    color: Colors.danger,
    fontSize: 13,
  } as TextStyle,
  textNoError: {
    marginTop: 4,
    ...Font({ weight: 'Medium' }),
    color: Colors.primaryLight,
    fontSize: 13,
  } as TextStyle,
  image: {
    width: Sizes.Icon,
    height: Sizes.Icon,
    tintColor: Colors.grey5,
  } as ImageStyle,
  currencyContainer: {
    justifyContent: 'center',
    paddingRight: 5,
  } as ViewStyle,
  inputSelected: {
    borderColor: Colors.grey2,
    backgroundColor: Colors.grey1,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  inputNotSelected: {
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
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
    borderColor: Colors.primaryLight,
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
    fontSize: 14,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  chipText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.white,
    fontSize: 15,
  } as TextStyle,
  chipTextDisabled: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 15,
    marginVertical: 10,
    marginHorizontal: 10,
  } as TextStyle,
  chipTextEnabled: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.white,
    fontSize: 15,
    marginVertical: 10,
    marginHorizontal: 10,
  } as TextStyle,
  chipContDisabled: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.grey2,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    marginRight: 5,
  } as ViewStyle,
  chipContEnabled: {
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    flex: 2,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  } as ViewStyle,
  emptyViewDisabled: {
    flex: 2,
    marginHorizontal: 5,
  } as ViewStyle,
  chipSelectedCont: {
    left: -2,
    top: -2,
    position: 'absolute',
    borderColor: Colors.primaryLight,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    height: '110%',
    width: '105%',
  } as ViewStyle,
  inputChipSelected: {
    flexDirection: 'row',
    flex: 2,
    marginHorizontal: 5,
    marginLeft: 10,
  } as ViewStyle,
  textInputBase: {
    height: 40,
    flex: 1,
  } as TextStyle,
});

const defaultInputValue = '0.00';
export interface TextInputChipAmountProps extends TextInputBaseProps {
  help?: React.ReactNode[] | React.ReactNode;
  textInputBase?: StyleProp<TextStyle>;
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
  onPressChip?: () => void;
  currency?: string;
  errorDecoration?: boolean;
  inputChipSelected: boolean;
  topAmount: number;
}

export interface TextInputChipAmountState {
  isFocused: boolean;
  isEmpty: boolean;
  errorMessage?: string;
  errorAmount: boolean;
}

export default class TextInputChipAmount extends React.Component<
  TextInputChipAmountProps,
  TextInputChipAmountState
> {
  static defaultProps = {
    editable: true,
    showClearButton: true,
  };

  state: TextInputChipAmountState = {
    isFocused: false,
    isEmpty: true,
    errorMessage: '',
    errorAmount: false,
  };
  input!: TextInputBase | null;
  chipset!: View | null;

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
  setErrorAmountStyle = (error: boolean, errorMess: string) => {
    this.setState({ errorAmount: error, errorMessage: errorMess });
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

  onPressChip = () => {
    const { onPressChip, inputChipSelected } = this.props;
    const { errorMessage } = this.state;
    this.setState({
      errorMessage: inputChipSelected ? undefined : errorMessage,
    });
    if (typeof onPressChip === 'function') {
      onPressChip();
    }
  };
  /* NOSONAR */
  render() {
    const { errorMessage, isFocused, errorAmount } = this.state;
    const {
      textInputBase,
      containerStyle,
      accessibilityLabel,
      imageSource,
      currency,
      rightContainer,
      showClearButton,
      errorDecoration,
      labelContainerStyle,
      labelStyle,
      labelContainer,
      containerInputStyle,
      rightContainerStyle,
      inputChipSelected,
      textErrorStyle,
      topAmount,
      ...props
    } = this.props;
    const isInvalid = !!errorMessage;

    return (
      <Touchable
        accessibilityLabel={'textinput_chip_amount'}
        onPress={this.onPressChip}
        style={[styles.container, containerStyle]}
      >
        <View
          style={[
            inputChipSelected ? styles.inputSelected : styles.inputNotSelected,
            isInvalid && styles.inputError,
            isFocused && styles.inputFocus,
          ]}
        >
          <View
            style={
              inputChipSelected
                ? styles.chipContEnabled
                : styles.chipContDisabled
            }
          >
            {inputChipSelected && <View style={[styles.chipSelectedCont]} />}
            <Text
              accessibilityLabel={'amountinput_currency'}
              style={
                inputChipSelected
                  ? styles.chipTextEnabled
                  : styles.chipTextDisabled
              }
            >
              {L.textinputchipamount_chipview_amount}
            </Text>
          </View>
          {!inputChipSelected && <View style={styles.emptyViewDisabled} />}
          {inputChipSelected && (
            <View style={styles.inputChipSelected}>
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
              <TextInputBase
                accessibilityLabel={accessibilityLabel}
                selectionColor={Colors.secondary}
                {...props}
                style={[styles.textInputBase, textInputBase]}
                onEmptyState={this.onEmptyState}
                onFormatValue={this.onFormatValue}
                onError={this.onError}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                ref={ref => {
                  this.input = ref;
                }}
              />
            </View>
          )}
        </View>
        {inputChipSelected && (
          <Text
            accessibilityLabel={'amountinput_currency'}
            style={errorAmount ? styles.textError : styles.textNoError}
          >
            {L.textinputchipamount_reminder_amount}
            {topAmount}
          </Text>
        )}
      </Touchable>
    );
  }
}

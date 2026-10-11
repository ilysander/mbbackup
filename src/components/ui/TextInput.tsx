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
import { AnalyticsEvent } from '../../resources/analytics';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import ButtonImage from './ButtonImage';
import TextError from './TextError';
import TextInputBase, { TextInputBaseProps } from './TextInputBase';
import { AnalyticsLabelsType } from '../../resources/analytics/index';

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
    tintColor: Colors.grey4,
  } as ImageStyle,
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
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  labelTextWithSubtitle: {
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  labelContainer: {
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
  inputFocus: {
    borderColor: Colors.primary,
  } as TextStyle,
  inputImage: {
    paddingLeft: Sizes.Icon + 20,
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
});

export interface TextInputProps extends TextInputBaseProps {
  help?: React.ReactNode[] | React.ReactNode;
  label?: string | React.ReactNode;
  typeTooltip?: string;
  labelSubtitle?: string | React.ReactNode;
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
  imageIconStyle?: StyleProp<ImageStyle>;
  onBlur?: () => void;
  onFocus?: () => void;
  accessibilityErrorInput?: AnalyticsLabelsType | string | any;
}

export interface TextInputState {
  isFocused: boolean;
  isEmpty: boolean;
  errorMessage?: string | React.ReactNode;
  markError: boolean;
}

export default class TextInput extends React.Component<
  TextInputProps,
  TextInputState
> {
  static defaultProps = {
    editable: true,
    showClearButton: true,
  };
  state: TextInputState = {
    isFocused: false,
    isEmpty: true,
    errorMessage: '',
    markError: false,
  };
  input!: TextInputBase | null;

  setValue = (value: string) => {
    this.input && this.input.setValue(value);
  };

  onEmptyState = (isEmpty: boolean) => {
    this.setState({ isEmpty });
  };
  getFormatValue = () => {
    if (!this.input) {
      return;
    }
    return this.input.getFormatValue();
  };
  getValue = () => {
    if (!this.input) {
      return '';
    }
    return this.input.getValue();
  };
  isValid = (showError = true) => {
    if (!this.input) {
      return false;
    }
    return this.input.isValid(showError);
  };
  setError = (errorMessage?: string | React.ReactNode) => {
    this.setState({ errorMessage, markError: !!errorMessage });
  };

  markError = () => {
    this.setState({ markError: true });
  };
  clearError = () => {
    this.setError(undefined);
  };

  onClearAll = () => {
    this.input && this.input.setValue('');
    this.focus();
  };

  getInputRef = () => {
    return this.input;
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
    this.setState({ isFocused: false });
    typeof onBlur === 'function' && onBlur();
  };

  onError = (message?: string) => {
    if (message) {
      const { accessibilityErrorInput } = this.props;
      if (accessibilityErrorInput !== undefined) AnalyticsEvent.track(accessibilityErrorInput, message)
    }
    this.setError(message);
  };

  /* NOSONAR */
  render() {
    const { errorMessage, isEmpty, isFocused, markError } = this.state;
    const {
      style,
      children,
      accessibilityLabel,
      accessibilityErrorInput,
      help,
      containerStyle,
      containerInputStyle,
      imageSource,
      rightContainer,
      rightContainerStyle,
      showClearButton,
      label,
      labelContainer,
      labelContainerStyle,
      labelStyle,
      textErrorStyle,
      labelSubtitle,
      imageIconStyle,
      typeTooltip,
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
        {typeTooltip == 'indicator' && labelContainer}

        <View
          accessibilityLabel={'textinput_label_container'}
          style={[
            styles.labelContainer,
            !!labelSubtitle && styles.labelContainerWithSubtitle,
            labelContainerStyle,
          ]}
        >
          {!!label && (
            <Text
              accessibilityLabel={'textinput_label'}
              style={[
                styles.labelText,
                !!labelSubtitle && styles.labelTextWithSubtitle,
                labelStyle,
              ]}
            >
              {label}
            </Text>
          )}
          {typeTooltip != 'indicator' && labelContainer}
        </View>

        {labelSubtitle && (
          <View style={styles.labelSubtitleContainer}>
            <Text
              accessibilityLabel={'textinput_label_subtitle'}
              style={styles.labelSubtitleText}
            >
              {labelSubtitle}
            </Text>
          </View>
        )}
        <View style={[styles.content, containerInputStyle]}>
          <TextInputBase
            accessibilityLabel={accessibilityLabel}
            selectionColor={Colors.secondary}
            {...props}
            style={[
              styles.input,
              !!imageSource && styles.inputImage,
              (isInvalid || markError) && styles.inputError,
              isFocused && styles.inputFocus,
              showClearButton && styles.inputClearButton,
              style,
            ]}
            onEmptyState={this.onEmptyState}
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
                style={[styles.image, imageIconStyle]}
                resizeMode={'contain'}
                source={imageSource}
              />
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
          <TextError style={[styles.textErrorContainer, textErrorStyle]}>
            {errorMessage}
          </TextError>
        )}
      </View>
    );
  }
}

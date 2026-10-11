import * as React from 'react';
import {
  InteractionManager,
  MeasureLayoutOnSuccessCallback,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps as BaseTextInputProps,
} from 'react-native';
import { CustomTextInput } from 'RN-custom-keyboard';
import {
  A,
  AnalyticsEvent,
  AnalyticsLabelsType,
} from '../../resources/analytics';
import Colors from '../../resources/constants/Colors';
import LayoutAnimations from '../../resources/constants/LayoutAnimations';
import Validate from '../../resources/functions/Validate';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';

const TAG = '[TextInputBase]';

type BaseTextInputSingleProps = Exclude<
  BaseTextInputProps,
  'accessibilityLabel'
>;

export interface TextInputBaseProps extends BaseTextInputSingleProps {
  formatText?: any;
  customKeyboardType?: string;
  onError?: (error: string) => void;
  onEmptyState?: (isEmpty: boolean) => void;
  onFormatValue?: (value: string) => string;
  focusMode?: 'none' | 'top' | 'bottom' | 'center';
  focusOffset?: number;
  /**
   * es obligatorio que `accessibilityLabel` este agregado en `AnalyticsLabels`
   */
  accessibilityLabel: AnalyticsLabelsType;
  keyboardProps?:any;
}

export interface TextInputBaseState {
  value: string;
}

export default class TextInputBase extends React.Component<
  TextInputBaseProps,
  TextInputBaseState
> {
  static defaultProps = {};

  state: TextInputBaseState = {
    value: '',
  };
  private interaction: any;
  private input!: TextInput | null;

  setValue = (value: string) => {
    this.onChangeText(value);
  };
  onChangeText = (value: string) => {
    const { editable } = this.props;
    if (!editable) {
      return;
    }

    const {
      formatText,
      onError,
      onChangeText,
      onEmptyState,
      onFormatValue,
    } = this.props;
    const isEmpty = !value;
    let error = '';

    if (formatText) {
      if (formatText.isRealTimeValidateActive) {
        error = Validate.validateFormat(value, formatText, true);
      }
      value = Validate.formattingText(value, formatText);
    }

    if (typeof onFormatValue === 'function') {
      value = onFormatValue(value);
    }

    LayoutAnimations.default();

    this.setState({ value }, () => {
      typeof onEmptyState === 'function' && onEmptyState(isEmpty);
      typeof onError === 'function' && onError(error);
      typeof onChangeText === 'function' && onChangeText(value);
    });
  };

  getFormatValue = () => {
    return this.state.value.trim();
  };
  getValue = () => {
    const { formatText } = this.props;
    const { value } = this.state;
    return formatText
      ? Validate.formattingTextNaked(value.trim(), formatText)
      : value.trim();
  };
  isValid = (showError = true) => {
    const { onError, formatText } = this.props;
    const { value } = this.state;

    if (formatText) {
      const error = Validate.validateFormat(value, formatText);
      if (showError) {
        typeof onError === 'function' && onError(error);
      }
      return !error;
    }
    return true;
  };
  focus = () => {
    const { editable } = this.props;
    if (!editable) {
      return;
    }
    Log.debug(TAG, 'focus', 'ok');
    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(() => {
      this.input && this.input.focus();
    });
  };
  getFocusMode = (): string => {
    return this.props.focusMode || '';
  };
  getFocusOffset = (): number => {
    return this.props.focusOffset || 0;
  };
  blur = () => {
    Log.debug(TAG, 'blur', 'ok');
    this.input && this.input.blur();
  };
  measureLayout = (
    relativeToNativeNode: number,
    onSuccess: MeasureLayoutOnSuccessCallback,
    onFail?: () => void
  ) => {
    this.input &&
      this.input.measureLayout(
        relativeToNativeNode,
        onSuccess,
        typeof onFail === 'function'
          ? onFail
          : () => {
            return;
          }
      );
  };
  onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const { onFocus, accessibilityLabel } = this.props;
    const eventLabel = A[accessibilityLabel];
    if (eventLabel) {
      AnalyticsEvent.track(`focus_${eventLabel}`);
    } else if (__DEV__) {
      Log.warn(
        TAG,
        'onFocus',
        'missing AnalyticsEvent for',
        accessibilityLabel
      );
    }
    Log.debug(TAG, 'onFocus', 'ok');
    Emitter.emit('onFocusTextInput', this);

    typeof onFocus === 'function' && onFocus(e);
  };
  onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const { onBlur, accessibilityLabel } = this.props;
    const eventLabel = A[accessibilityLabel];
    if (eventLabel) {
      AnalyticsEvent.track(`blur_${eventLabel}`);
    } else {
      Log.warn(TAG, 'onBlur', 'missing AnalyticsEvent for', accessibilityLabel);
    }
    Log.debug(TAG, 'onBlur', 'ok');

    const { formatText, onError } = this.props;
    if (formatText) {
      const { value } = this.state;
      const error = Validate.validateFormat(value, formatText);
      typeof onError === 'function' && onError(error);
    }
    typeof onBlur === 'function' && onBlur(e);
  };

  componentDidMount() {
    const { defaultValue } = this.props;
    if (defaultValue) {
      this.onChangeText(defaultValue);
    }
  }

  componentWillUnmount() {
    this.interaction && this.interaction.cancel();
  }

  getInputRef = () => {
    return this.input;
  };

  render() {
    const { customKeyboardType,keyboardProps, accessibilityLabel, ...props } = this.props;
    const { value } = this.state;
    const Component = customKeyboardType ? CustomTextInput : TextInput;
    return (
      <Component
        customKeyboardType={customKeyboardType}
        accessibilityLabel={accessibilityLabel || 'textinputbase'}
        underlineColorAndroid={'transparent'}
        placeholderTextColor={Colors.grey4}
        value={value}
        {...props}
        onChangeText={this.onChangeText}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        ref={(ref: TextInput | null) => {
          this.input = ref;
        }}
        keyboardProps={keyboardProps}
      />
    );
  }
}

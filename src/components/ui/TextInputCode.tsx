import * as React from 'react';
import {
  Animated,
  Clipboard,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Validate from '../../resources/functions/Validate';
import {L} from '../../resources/language';
import {Emitter} from '../../resources/listeners';
import TextInput, {TextInputProps} from './TextInput';
import Touchable from './Touchable';
import {AnalyticsLabelsType} from '../../resources/analytics/index';

const styles = StyleSheet.create({
  container: {
    padding: 0,
  } as ViewStyle,
  containerInputHidden: {
    height: 1,
    opacity: 1,
  } as ViewStyle,
  containerInput: {
    marginTop: 0,
    marginBottom: 0,
  } as ViewStyle,
  input: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.transparent,
    borderWidth: 0,
    borderBottomWidth: 0,
    color: Colors.transparent,
  } as TextStyle,
  textCode: {
    ...Font({weight: 'Bold'}),
    textAlign: 'center',
    color: Colors.grey6,
    fontSize: 16,
    marginTop: 8,
  } as TextStyle,
  containerCode: {
    flexDirection: 'row',
  } as ViewStyle,
  containerTextCode: {
    backgroundColor: Colors.grey1,
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: 8,
    width: 40,
    height: 40,
    marginHorizontal: 5,
    position: 'relative',
  } as ViewStyle,
  caret: {
    position: 'absolute',
    left: 12,
  } as ViewStyle,
  caretContainer: {
    width: 2,
    backgroundColor: Colors.secondary,
    bottom: 5,
    top: 5,
  } as ViewStyle,
  textCodeEmpty: {
    color: Colors.transparent,
  } as TextStyle,
  splits: {
    alignItems: 'center',
  } as ViewStyle,
  borderError: {
    borderColor: Colors.danger,
  } as ViewStyle,
  textError: {
    textAlign: 'center',
  } as TextStyle,
});

export interface ChangeTextProps {
  value: string;
  isCompleted: boolean;
}

export interface CaretViewProps extends ViewProps {}

export interface CaretViewState {
  fade: Animated.Value;
  active: boolean;
}

class CaretView extends React.Component<CaretViewProps, CaretViewState> {
  state: CaretViewState = {
    fade: new Animated.Value(1),
    active: true,
  };

  animated!: Animated.CompositeAnimation;
  interval!: any;

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  start = () => {
    this.interval && clearImmediate(this.interval);
    this.interval = setInterval(this.step, 500);
  };
  step = () => {
    this.animated && this.animated.stop();
    const {fade, active} = this.state;
    const newActive = !active;
    this.setState({active: newActive}, () => {
      this.animated && this.animated.stop();
      this.animated = Animated.timing(fade, {
        toValue: newActive ? 1 : 0,
        duration: newActive ? 200 : 0,
        useNativeDriver: false,
      });
      this.animated.start();
    });
  };
  stop = () => {
    this.interval && clearImmediate(this.interval);
  };

  render() {
    const {fade} = this.state;
    const {style, ...props} = this.props;
    return (
      <Animated.View
        style={[styles.caretContainer, {opacity: fade}, style]}
        {...props}
      />
    );
  }
}

export interface TextInputCodeProps extends TextInputProps {
  onCompleteCode?: (text: string) => void;
  onChangeTextCustom?: (props: ChangeTextProps) => void;
  accessibilityErrorInput?: AnalyticsLabelsType | string | any;
}

export interface TextInputCodeState {
  isCompleted: boolean;
  isValid: boolean;
  isFocused: boolean;
  value: string;
}

export default class TextInputCode extends React.Component<
  TextInputCodeProps,
  TextInputCodeState
> {
  state: TextInputCodeState = {
    isCompleted: false,
    isValid: true,
    isFocused: false,
    value: '',
  };

  isReallyMounted!: boolean;
  input!: TextInput | null;

  componentDidMount() {
    this.isReallyMounted = true;
  }

  componentWillUnmount() {
    this.isReallyMounted = false;
  }

  focus = () => {
    this.input && this.input.focus();
  };

  blur = () => {
    this.input && this.input.blur();
  };

  isValid = () => {
    if (this.input) {
      return this.input.isValid();
    }
    return false;
  };

  getValue = () => {
    if (this.input) {
      return this.input.getValue();
    }
    return '';
  };

  setError = (message?: string) => {
    this.input && this.input.setError(message);
  };
  clearError = () => {
    this.setError(undefined);
    this.setState({isValid: true});
  };

  setValue = (value: string) => {
    this.input && this.input.setValue(value);
  };

  onChangeText = (value: string) => {
    const {onCompleteCode, formatText, onChangeTextCustom, onChangeText} =
      this.props;
    const isCompleted = (value || '').length === formatText.format.length;
    this.setState({isCompleted, value, isValid: true}, () => {
      typeof onChangeTextCustom === 'function' &&
        onChangeTextCustom({value, isCompleted});
      typeof onChangeText === 'function' && onChangeText(value);
      if (isCompleted && typeof onCompleteCode === 'function') {
        onCompleteCode(value);
      }
    });
  };

  onBlur = () => {
    if (!this.isReallyMounted) {
      return;
    }
    const {onBlur} = this.props;
    const isValid = this.input ? this.input.isValid() : false;
    this.setState({isValid, isFocused: false});
    typeof onBlur === 'function' && onBlur();
  };

  onFocus = () => {
    if (!this.isReallyMounted) {
      return;
    }
    const {onFocus} = this.props;
    this.setState({isFocused: true});
    typeof onFocus === 'function' && onFocus();
  };

  generateKeysByValue = (totalSpaces: number, value: string) => {
    if (totalSpaces <= 0) {
      return [];
    }
    const keysValues = value.split('');
    const keys = [];
    for (let i = 0; i < totalSpaces; i++) {
      if (keysValues[i]) {
        keys.push({value: keysValues[i]});
      } else {
        keys.push({value: ''});
      }
    }
    return keys;
  };

  paste = async () => {
    const {formatText} = this.props;
    const message = await Clipboard.getString();
    const code = Validate.getCodeDefault(message, formatText.format);
    if (!code) {
      const toastMessage = L.textinputcode_paste_empty_otp;
      Emitter.emit('onToast', {
        message: toastMessage,
      });
    }
    this.setValue(code);
  };

  render() {
    const {
      formatText,
      accessibilityLabel,
      secureTextEntry,
      style,
      editable,
      accessibilityErrorInput,
      ...props
    } = this.props;
    const {isValid, value, isFocused} = this.state;
    const totalSpaces = formatText ? formatText.format.length : 0;
    const keys = this.generateKeysByValue(totalSpaces, value);

    let isShowedCaret = false;
    const isEditable = editable !== false;
    return (
      <View
        style={[styles.container, style]}
        accessibilityLabel={'textinputcode_container'}>
        <Touchable
          onPress={this.focus}
          onLongPress={this.paste}
          accessibilityLabel={'textinputcode_focus'}
          style={styles.splits}
          activeOpacity={1}>
          <View
            accessibilityLabel={'textinputcode_codes'}
            style={styles.containerCode}>
            {keys.map((item, index) => {
              const showCaret = !item.value && !isShowedCaret;
              if (!item.value) {
                isShowedCaret = true;
              }
              return (
                <View
                  accessibilityLabel={'textinputcode_codes_code_' + index}
                  key={index.toString()}
                  style={[
                    styles.containerTextCode,
                    !isValid && styles.borderError,
                  ]}>
                  {showCaret && isFocused && isEditable && (
                    <CaretView style={styles.caret} />
                  )}
                  <Text
                    accessibilityLabel={'textinputcode_codes_code_text' + index}
                    allowFontScaling={false}
                    style={[
                      styles.textCode,
                      !item.value && styles.textCodeEmpty,
                    ]}>
                    {secureTextEntry && item.value ? '•' : item.value || '0'}
                  </Text>
                </View>
              );
            })}
          </View>
        </Touchable>
        <TextInput
          accessibilityLabel={accessibilityLabel}
          accessibilityErrorInput={accessibilityErrorInput}
          ref={ref => {
            this.input = ref;
          }}
          showClearButton={false}
          /**
           * `secureTextEntry` debe estár en false porque en ios
           *  si haces focus y luego blur y luego focus y escribes
           *  se limpia la caja de texto.
           */
          secureTextEntry={false}
          formatText={formatText}
          keyboardType={'numeric'}
          editable={editable}
          {...props}
          onChangeText={this.onChangeText}
          containerInputStyle={styles.containerInputHidden}
          containerStyle={styles.containerInput}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          textErrorStyle={styles.textError}
          style={styles.input}
        />
      </View>
    );
  }
}

import * as React from 'react';
import {
  EmitterSubscription,
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import LayoutAnimations from '../../resources/constants/LayoutAnimations';
import {Log} from '../../resources/log';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  } as ViewStyle,
});

const TAG = '[KeyboardSpacing]';

export interface KeyboardSpacingProps extends ViewProps {
  type?: 'padding' | 'margin';
  enabled?: boolean;
  onChangeDimensions?: (dimensions?: KeyboardDimensions) => void;
}

export interface KeyboardDimensions {
  width: number;
  height: number;
}

export interface KeyboardSpacingState {
  keyboardDimensions?: KeyboardDimensions;
}

export interface KeyboardEventCustom {
  custom?: boolean;
}

export default class KeyboardSpacing extends React.Component<
  KeyboardSpacingProps,
  KeyboardSpacingState
> {
  static defaultProps = {
    type: 'padding',
    enabled: true,
  };
  state: KeyboardSpacingState = {
    keyboardDimensions: undefined,
  };
  timeout!: NodeJS.Timeout;
  keyboardDidShowListener!: EmitterSubscription;
  keyboardDidHideListener!: EmitterSubscription;

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      this.keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = (e: KeyboardEvent & KeyboardEventCustom) => {
    this.clearTimeout();
    // esto permite activar el espacio extra para el teclado, solo cuando sea un teclado virtual o iOS
    // porque el teclado del sistema redimensiona la ventana y en esos casos no es necesario hacer nada aqui
    const enabled = Platform.OS === 'ios' || e.custom;
    if (!enabled) {
      return;
    }
    const {onChangeDimensions} = this.props;
    const keyboardDimensions = {
      height: e.endCoordinates.height,
      width: e.endCoordinates.width,
    };

    LayoutAnimations.default();
    this.setState({keyboardDimensions});
    if (typeof onChangeDimensions === 'function') {
      onChangeDimensions(keyboardDimensions);
    }
  };
  clearTimeout = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  keyboardDidHide = () => {
    Log.debug(TAG, 'keyboardDidHide');
    this.clearTimeout();
    this.timeout = setTimeout(
      () => {
        const {onChangeDimensions} = this.props;
        LayoutAnimations.default();
        this.setState({keyboardDimensions: undefined});
        if (typeof onChangeDimensions === 'function') {
          onChangeDimensions(undefined);
        }
      },
      Platform.OS === 'ios' ? 0 : 200,
    );
  };

  render() {
    const {keyboardDimensions} = this.state;
    const {style, type, children, enabled, ...props} = this.props;

    return (
      <View
        accessibilityLabel={'keyboardspacing'}
        {...props}
        style={[
          styles.container,
          style,
          enabled &&
            type === 'padding' &&
            keyboardDimensions && {
              paddingBottom: keyboardDimensions.height,
            },
          enabled &&
            type === 'margin' &&
            keyboardDimensions && {
              marginBottom: keyboardDimensions.height,
            },
        ]}>
        {children}
      </View>
    );
  }
}

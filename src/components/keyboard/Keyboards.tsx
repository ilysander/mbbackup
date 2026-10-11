import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import {
  backSpace,
  getText,
  hideKeyboard,
  insertText,
  register,
  setText,
  submitEditing,
} from 'RN-custom-keyboard';
import { Size } from '../../resources/dimensions';
import { L } from '../../resources/language';
import { SecureKeyboard } from '../ui';
import SecureKeyboardApi from '../ui/SecureKeyboardApi';

const styles = StyleSheet.create({
  container: {
    minWidth: Size.getWidth(),
    minHeight: 250,
    height: '100%',
  } as ViewStyle,
});

export interface SecureKeyboardNumericProps {
  tag: string;
}

export interface SecureKeyboardNumericState { }

class SecureKeyboardNumeric extends React.Component<
  SecureKeyboardNumericProps,
  SecureKeyboardNumericState
> {
  onKeyPressed = (key: string) => {
    insertText(this.props.tag, key.toString());
  };
  onRemoveAll = () => {
    setText(this.props.tag, '');
  };
  onRemoveKey = () => {
    backSpace(this.props.tag);
  };
  onNext = () => {
    submitEditing(this.props.tag);
  };
  onBlur = () => {
    hideKeyboard(this.props.tag);
  };

  render() {
    const { ...props } = this.props;
    return (
      <SecureKeyboard
        style={styles.container}
        onRemoveAll={this.onRemoveAll}
        onRemoveKey={this.onRemoveKey}
        onNext={this.onNext}
        onBlur={this.onBlur}
        onKeyPressed={this.onKeyPressed}
        
        {...props}
      />
    );
  }
}

class SecureKeyboardApiNumeric extends React.Component<
  SecureKeyboardNumericProps,
  SecureKeyboardNumericState
> {
  onKeyPressed = (key: string) => {
    insertText(this.props.tag, key.toString());
  };
  onRemoveAll = () => {
    setText(this.props.tag, '');
  };
  onRemoveKey = () => {
    backSpace(this.props.tag);
  };
  onNext = () => {
    submitEditing(this.props.tag);
  };
  onBlur = () => {
    hideKeyboard(this.props.tag);
  };

  render() {
    const { ...props } = this.props;
    return (
      <SecureKeyboardApi
        style={styles.container}
        onRemoveAll={this.onRemoveAll}
        onRemoveKey={this.onRemoveKey}
        onNext={this.onNext}
        onBlur={this.onBlur}
        onKeyPressed={this.onKeyPressed}
        onTouchStart={()=>{console.log('ontouchstart.......')}}
        onFocus={()=>{console.log('focussssss piiii')}}
        onMagicTap={()=>{console.log('magic piiii')}}
        {...props}
      />
    );
  }
}

register('numeric-secure-api', {
  factory: () => {
    return (props: any) => <SecureKeyboardApiNumeric {...props} />;
  },
});
register('numeric', {
  factory: () => {
    return (props: any) => <SecureKeyboardNumeric {...props} />;
  },
});

register('numeric-otp', {
  factory: () => {
    return (props: any) => <SecureKeyboardNumeric {...props} />;
  },
});

register('numeric-secure', {
  factory: () => {
    return (props: any) => <SecureKeyboardNumeric {...props} type={'random'} />;
  },
});
register('amount', {
  factory: () => {
    return (props: any) => (
      <SecureKeyboardNumeric
        {...props}
        type={'amount'}
        onDecimalSeparatorPressed={async () => {
          const { text } = await getText(props.tag);
          const separator = L.securekeyboard_decimal_separator;
          if (!text.includes(separator)) {
            insertText(props.tag, separator);
          }
        }}
      />
    );
  },
});

import React, { Component } from 'react';
import {
  AppRegistry,
  findNodeHandle,
  NativeModules,
  TextInput,
} from 'react-native';

const { CustomKeyboard } = NativeModules;
if (!CustomKeyboard) {
  console.info('Missing native module CustomKeyboard');
}
const {
  install,
  uninstall,
  getSelectionRange,
  insertText,
  backSpace,
  doDelete,
  moveLeft,
  moveRight,
  deleteLeftAll,
  hideKeyboard,
  switchSystemKeyboard,
  submitEditing,
  insertKey,
  setText,
  getText,
  
} = CustomKeyboard;

export {
  install,
  uninstall,
  getSelectionRange,
  insertText,
  backSpace,
  doDelete,
  moveLeft,
  moveRight,
  deleteLeftAll,
  hideKeyboard,
  switchSystemKeyboard,
  submitEditing,
  insertKey,
  setText,
  getText,
};

const keyboardTypeRegistry = {};
const keyboardPropsRegistry = {};
const defaultKeyboardHeight = 250;

export function register(type, keyboardInfo) {
  keyboardTypeRegistry[type] = keyboardInfo;
}
const getKeyboardHeightByType = type => {
  const height = keyboardTypeRegistry[type].height;
  return height || defaultKeyboardHeight;
};

const getKeyboardProps = tag => keyboardPropsRegistry[tag] || null;
const setKeyboardProps = (tag, props) => {
  keyboardPropsRegistry[tag] = props;
};
const removeKeyboardProps = tag => {
  delete keyboardPropsRegistry[tag];
};

class CustomKeyboardContainer extends Component {
  render() {
    const { tag, type } = this.props;
    const settings = keyboardTypeRegistry[type] || {};
    const factory = settings.factory;
    const inputFilter = settings.inputFilter;
    if (!factory) {
      console.warn(`Custom keyboard type ${type} not registered.`);
      return null;
    }
    const Container = factory();
    return (
      <Container
        tag={tag}
        inputFilter={inputFilter}
        keyboardProps={getKeyboardProps(tag)}
      />
    );
  }
}

AppRegistry.registerComponent('CustomKeyboard', () => CustomKeyboardContainer);

const TAG = '[CustomTextInputContainer]';
class CustomTextInputContainer extends Component {
  installKeyboard() {
    const { maxLength, customKeyboardType, keyboardProps } = this.props;
    try {
      const tag = findNodeHandle(this.input);
      if (!tag) {
        console.warn(TAG, 'installKeyboard', 'tag', 'missing');
        return;
      }
      setKeyboardProps(tag, keyboardProps);
      install(
        tag,
        customKeyboardType,
        typeof maxLength !== 'number' ? 0 : maxLength,
        getKeyboardHeightByType(customKeyboardType)
      );
    } catch (e) {
      console.warn(TAG, 'installKeyboard', 'error', e);
    }
  }

  componentWillUnmount() {
    try {
      const tag = findNodeHandle(this.input);
      removeKeyboardProps(tag);
    } catch (e) {
      console.warn(TAG, 'componentWillUnmount', e);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.customKeyboardType !== this.props.customKeyboardType) {
      this.installKeyboard();
    }
  }
  onRef = ref => {
    if (!ref) {
      return;
    }
    const { forwardedRef } = this.props;
    this.input = ref;
    this.installKeyboard();
    forwardedRef(ref);
  };

  render() {
    const { customKeyboardType, ...props } = this.props;
    return <TextInput {...props} ref={this.onRef} />;
  }
}
export const CustomTextInput = React.forwardRef((props, ref) => {
  return <CustomTextInputContainer {...props} forwardedRef={ref} />;
});

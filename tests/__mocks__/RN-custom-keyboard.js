import React from 'react';
import { TextInput } from 'react-native';
export default {
  install: jest.fn(),
  uninstall: jest.fn(),
  insertText: jest.fn(),
  backSpace: jest.fn(),
  doDelete: jest.fn(),
  moveLeft: jest.fn(),
  moveRight: jest.fn(),
  switchSystemKeyboard: jest.fn()
};

export const CustomTextInput = React.forwardRef((props, ref) => {
  return <TextInput {...props} ref={ref} />;
});

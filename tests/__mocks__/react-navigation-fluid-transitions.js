import React from 'react';
import { View } from 'react-native';

export const createFluidNavigator = jest.fn();
export class Transition extends React.Component {
  render() {
    const { children, ...props } = this.props;
    return <View {...props}>{children}</View>;
  }
}

import { NavigationProp } from '@react-navigation/native';
import * as React from 'react';
import { View } from 'react-native';

export interface NavigationFocusProps {
  navigation: NavigationProp<any, any>;
  onFocus: () => void;
  onBlur: () => void;
}

export interface NavigationFocusState { }

export default class NavigationFocus extends React.Component<
  NavigationFocusProps,
  NavigationFocusState
> {
  willBlurListener!: any;
  didFocusListener!: any;

  componentDidMount() {
    this.willBlurListener = this.props.navigation.addListener(
      'blur',
      this.willBlur
    );
    this.didFocusListener = this.props.navigation.addListener(
      'focus',
      this.didFocus
    );
  }

  componentWillUnmount() {
    this.willBlurListener && this.willBlurListener();
    this.didFocusListener && this.didFocusListener();
  }

  didFocus = () => {
    const { onFocus } = this.props;
    typeof onFocus === 'function' && onFocus();
  };
  willBlur = () => {
    const { onBlur } = this.props;
    typeof onBlur === 'function' && onBlur();
  };

  render() {
    return <View />;
  }
}

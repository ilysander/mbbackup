import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';

export interface FocusedProps {
  isFocused: boolean;
}

export interface FocusedInstance<T> {
  readonly getScreenRef: () => T;
}

export interface FocusedContainerProps
  extends NativeStackScreenProps<any, any> {
  // navigation: NavigationProp<any, any>;
}

export interface FocusedContainerState {
  isFocused: boolean;
}

export function withFocused<T, P extends FocusedContainerProps>(
  WrappedComponent: React.ComponentType<P & FocusedProps>
) {
  class FocusedContainer extends React.PureComponent<P, FocusedContainerState> {
    static navigationOptions: NativeStackNavigationOptions =
      // @ts-ignore
      WrappedComponent.navigationOptions || {};
    state: FocusedContainerState = {
      isFocused: false,
    };

    screen!: T | null;
    didFocusListener!: any;
    willBlurListener!: any;

    getScreenRef = () => {
      return this.screen;
    };
    didFocus = () => {
      this.setState({ isFocused: true });
    };
    willBlur = () => {
      this.setState({ isFocused: false });
    };

    componentDidMount() {
      if (this.props.navigation) {
        this.didFocusListener = this.props.navigation.addListener(
          'focus',
          this.didFocus
        );
        this.willBlurListener = this.props.navigation.addListener(
          'blur',
          this.willBlur
        );
      }
    }

    componentWillUnmount() {
      this.didFocusListener && this.didFocusListener();
      this.willBlurListener && this.willBlurListener();
    }

    getNavigation = () => {
      return this.props.navigation;
    };

    render() {
      return (
        <WrappedComponent
          ref={(ref: T | null) => {
            this.screen = ref;
          }}
          isFocused={this.state.isFocused}
          {...this.props}
        />
      );
    }
  }

  return FocusedContainer;
}

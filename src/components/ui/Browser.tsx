import * as React from 'react';
import {
  InteractionManager,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {WebView, WebViewProps} from 'react-native-webview';
import {
  WebViewErrorEvent,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {Log} from '../../resources/log';
import LoadingOverlay from './LoadingOverlay';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});

const TAG = '[Browser]';

export interface BrowserProps extends WebViewProps {
  requireLocation?: boolean;
}

export interface BrowserState {
  isLoading: boolean;
  isVisible: boolean;
  allowedLocation: boolean;
}

export default class Browser extends React.Component<
  BrowserProps,
  BrowserState
> {
  state: BrowserState = {
    isLoading: false,
    isVisible: false,
    allowedLocation: false,
  };

  interaction: any;

  componentDidMount() {
    this.interaction = InteractionManager.runAfterInteractions(() => {
      this.load();
    });
  }

  componentWillUnmount() {
    this.interaction && this.interaction.cancel();
  }

  load = async () => {
    const {requireLocation} = this.props;
    let allowedLocation = false;
    if (requireLocation) {
      try {
        allowedLocation = true;
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          allowedLocation = granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (e) {
        Log.warn(TAG, 'load', e);
      }
    }
    this.setState({isVisible: true, allowedLocation});
  };

  onLoadStart = (event: WebViewNavigationEvent) => {
    const {onLoadStart} = this.props;
    if (typeof onLoadStart === 'function') {
      onLoadStart(event);
    }
    this.setState({isLoading: true});
  };
  onLoadEnd = (event: WebViewNavigationEvent | WebViewErrorEvent) => {
    const {onLoadEnd} = this.props;
    if (typeof onLoadEnd === 'function') {
      onLoadEnd(event);
    }
    this.setState({isLoading: false});
  };

  render() {
    const {style, ...props} = this.props;
    const {isVisible, isLoading} = this.state;
    if (!isVisible) {
      return <View />;
    }
    return [
      <WebView
        key={'webview'}
        accessibilityLabel={'browser_webview'}
        {...props}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode={'always'}
        style={[styles.container, style]}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
      />,
      <LoadingOverlay key={'loading'} isLoading={isLoading} duration={200} />,
    ];
  }
}

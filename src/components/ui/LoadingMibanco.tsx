import * as React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
const styles = StyleSheet.create({
  animation: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  } as ViewStyle,
});

export interface LoadingMibancoProps extends ViewProps {
  accessibilityLabel: string;
  loop?: boolean;
  type?: 'default';
}

export default class LoadingMibanco extends React.Component<
  LoadingMibancoProps
> {
  static defaultProps = {
    loop: true,
    type: 'default',
  };

  render() {
    const { style, loop, children } = this.props;
    let source = require('../../assets/lottie/loading.json');
    return (
      <View style={[style]}>
        <LottieView
          style={styles.animation}
          loop={loop}
          autoPlay
          imageAssetsFolder={'lottie/loading/images'}
          source={source}
        />
        {children}
      </View>
    );
  }
}

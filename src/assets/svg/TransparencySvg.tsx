import * as React from 'react';
import { Platform, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, G, Rect } from 'react-native-svg';
import { Colors } from '../../resources/constants';

interface Props {
  size: any;
  style?: ViewStyle;
}

interface State {
  size: any;
}

class DemoSvg extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      size: props.size,
    };
  }

  render() {
    const androidProps =
      Platform.OS === 'android'
        ? { scale: this.props.size / this.state.size }
        : null;
    const otherProps =
      Platform.OS === 'android'
        ? { width: this.state.size, height: this.state.size }
        : { width: this.props.size, height: this.props.size };

    const { style } = this.props;
    return (
      <View
        style={[
          {
            width: this.props.size,
            height: 30,
          },
          style,
        ]}
      >
        <Svg {...otherProps} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient
              id="a"
              x1={0.5}
              y1={0.5}
              x2={0.5}
              y2={1}
              gradientUnits="objectBoundingBox"
            >
              <Stop offset={0} stopColor={Colors.white} stopOpacity={0} />
              <Stop offset={1} stopColor={Colors.white} />
            </LinearGradient>
          </Defs>
          <G {...androidProps}>
            <Rect width="100" height="6" fill="url(#a)" />
          </G>
        </Svg>
      </View>
    );
  }
}

export default DemoSvg;

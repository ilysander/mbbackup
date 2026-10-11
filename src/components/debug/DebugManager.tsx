import * as React from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import DebugScreen from './DebugScreen';
import { Validate } from '../../resources/functions/index';

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#f9f9f9',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    borderWidth: 2,
    borderColor: '#5671fd',
  } as ViewStyle,
  shadow: {
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: 'black',
    elevation: 4,
    shadowOffset: { height: 0, width: 0 },
  } as ViewStyle,
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
  } as TextStyle,
  versionText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  } as TextStyle,
  versionContainer: {
    top: 0,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 8,
    backgroundColor: '#5671fd',
  } as ViewStyle,
});
const DEFAULT_POSITION = { x: 150, y: 150 };
const TAG = '[DebugManager]';

export default class DebugManager extends React.Component<any, any> {
  state: any = {
    showDetails: false,
    isDebug: false,
    dropAreaValues: undefined,
    pan: new Animated.ValueXY({ ...DEFAULT_POSITION }),
    opacity: new Animated.Value(1),
  };

  _val: any;
  panResponder: any;

  UNSAFE_componentWillMount() {
    this._val = { ...DEFAULT_POSITION };
    this.state.pan.addListener((value: any) => (this._val = value));

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y,
        });
        this.state.pan.setValue({ ...DEFAULT_POSITION });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: this.state.pan.x, dy: this.state.pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_e, gesture) => {
        if (this.isDropArea(gesture)) {
          Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
          }).start(() =>
            this.setState({
              isDebug: false,
            })
          );
        }
      },
    });
  }

  componentDidMount() {
    Emitter.on('onToggleDebug', this.onToggleDebug);
    const appId = DeviceInfo.getBundleId();
    const isDevMode = appId.includes('.dev') || appId.includes('.qa');
    this.setState({ isDevMode });
  }

  componentWillUnmount() {
    Emitter.off('onToggleDebug', this.onToggleDebug);
  }

  onToggleDebug = () => {
    // if (Validate.isDemo()) {
    //   return;
    // }

    // const { isDevMode } = this.state;
    // if (!isDevMode) {
    //   Log.warn(TAG, 'onToggleDebug', 'no devMode');
    //   return;
    // }

    this.setState({ isDebug: !this.state.isDebug });
  };

  isDropArea = (gesture: any) => {
    return gesture.moveY < -500;
  };
  toggle = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  hide = () => {
    this.setState({ isDebug: false });
  };

  render() {
    const { isDebug, showDetails, opacity } = this.state;
    const { navigation } = this.props;
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };

    const bundleId = DeviceInfo.getBundleId();
    const version = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();
    const environment =
      bundleId
        .replace('com.mibanco.bancamovil.', '')
        .toUpperCase()
        .trim() || 'prod';

    return [
      isDebug && showDetails && (
        <DebugScreen
          screenProps={{
            navigation,
            toggle: () => {
              this.setState({ showDetails: false, isDebug: false });
            },
          }}
          key={'debug'}
        />
      ),
      <View
        key={'button'}
        style={{
          top: -80,
          left: -80,
          position: 'absolute',
        }}
      >
        {isDebug && (
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[
              panStyle,
              styles.circle,
              styles.shadow,
              { opacity, elevation: 999 },
            ]}
          >
            <Text style={styles.buttonText}>{environment}</Text>

            <TouchableOpacity onPress={this.toggle}>
              <View style={styles.versionContainer}>
                <Text style={styles.versionText} numberOfLines={1}>
                  {version}-{buildNumber}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>,
    ];
  }
}

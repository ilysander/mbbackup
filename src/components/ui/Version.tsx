import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TextStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import DeviceInfo from 'react-native-device-info';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  container: {},
  label: {
    ...Font(),
    fontSize: 13,
    color: Colors.white,
  } as TextStyle,
});

export interface VersionProps {
  style?: StyleProp<ViewStyle>;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
}

export interface VersionState {}

export default class Version extends React.Component<
  VersionProps,
  VersionState
> {
  static defaultProps = {
    label: L.versiontext_label,
  };
  render() {
    const { style, label, labelStyle, ...props } = this.props;
    return (
      <View style={[styles.container, style]} {...props}>
        <Text style={[styles.label, labelStyle]}>
          {label}
          {DeviceInfo.getVersion()}
        </Text>
      </View>
    );
  }
}

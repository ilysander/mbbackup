import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';

const styles = StyleSheet.create({
  rightText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,
  leftText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey6,
  } as TextStyle,
});

export interface PanelItemLeftProps {
  title?: string;
  text?: string | React.ReactNode;
  styleText?: StyleProp<TextStyle>;
  styleTitle?: StyleProp<TextStyle>;
  blockStyle?: StyleProp<ViewStyle>;
}

export interface PanelItemLeftState {}

export default class PanelItemLeft extends React.Component<
  PanelItemLeftProps,
  PanelItemLeftState
> {
  render() {
    const { title, text, styleText, styleTitle, blockStyle } = this.props;
    return (
      <View style={blockStyle}>
        {title && <Text style={[styles.leftText, styleTitle]}>{title}</Text>}
        {typeof text === 'string' ? (
          <Text style={styles.leftText}>
            <Text style={[styles.rightText, styleText]}>{text}</Text>
          </Text>
        ) : (
          <View style={blockStyle}>{text}</View>
        )}
      </View>
    );
  }
}

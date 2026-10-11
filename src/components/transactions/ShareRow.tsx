import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewProps } from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';

const styles = StyleSheet.create({
  textLabel: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  text: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
});

export interface ShareRowProps extends ViewProps {
  title: string;
  details: string[];
}

export interface ShareRowState {}

export default class ShareRow extends React.Component<
  ShareRowProps,
  ShareRowState
> {
  render() {
    const { title, details, children, ...props } = this.props;
    return (
      <View {...props}>
        <Text style={styles.textLabel}>{title}</Text>
        {details.map((text, index) => {
          if (!text) return null;
          return (
            <View key={index.toString()}>
              <Text style={[styles.text]}>{text}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

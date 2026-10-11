import * as React from 'react';
import { Text, TextStyle, View, ViewProps, StyleSheet } from 'react-native';
import Font from '../../resources/functions/Font';
import { Colors } from '../../resources/constants';

const styles = StyleSheet.create({
  titleItemChannel: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primaryLight,
    fontSize: 16,
    textAlign: 'left',
  } as TextStyle,
  bodyItemChannel: {
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'left',
    ...Font(),
  } as TextStyle,
  bodyItemBoldChannel: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'left',
  } as TextStyle,
});

export interface ChannelDescriptionProps extends ViewProps {
  firstDesPartA?: string;
  firstDesPartB?: string;
  firstDesPartC?: string;
  firstDesPartD?: string;
  firstDesPartE?: string;
}

export interface ChannelDescriptionState {}

export default class ChannelDescription extends React.PureComponent<
  ChannelDescriptionProps,
  ChannelDescriptionState
> {
  render() {
    const {
      firstDesPartA,
      firstDesPartB,
      firstDesPartC,
      firstDesPartD,
      firstDesPartE,
    } = this.props;
    return (
      <View>
        <Text style={styles.bodyItemChannel}>
          {!!firstDesPartA && `${firstDesPartA}${' '}`}
          {!!firstDesPartB && (
            <Text style={styles.bodyItemBoldChannel}>{firstDesPartB}</Text>
          )}{' '}
          {!!firstDesPartB && firstDesPartC}{' '}
          {!!firstDesPartD && (
            <Text style={styles.bodyItemBoldChannel}>{firstDesPartD}</Text>
          )}{' '}
          {!!firstDesPartE && firstDesPartE}
        </Text>
      </View>
    );
  }
}

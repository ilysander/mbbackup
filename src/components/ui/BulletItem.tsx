import * as React from 'react';
import { StyleProp, Text, TextStyle, View, StyleSheet } from 'react-native';
import Dot from './Dot';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';

const styles = StyleSheet.create({
  text: {
    color: Colors.grey6,
    fontSize: 14,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
});

export interface BulletItemProps {
  text: string;
  styleContainer?: StyleProp<TextStyle>;
  styleText?: StyleProp<TextStyle>;
}

export interface BulletItemState {}

export default class BulletItem extends React.Component<
  BulletItemProps,
  BulletItemState
> {
  render() {
    const { styleContainer, styleText, text } = this.props;
    return (
      <View style={styleContainer}>
        <Text>
          <Dot /> <Text style={[styles.text, styleText]}>{text}</Text>
        </Text>
      </View>
    );
  }
}

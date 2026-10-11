import * as React from 'react';
import {
  StyleProp,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import ChannelDescription from './ChannelDescription';
const styles = StyleSheet.create({
  titleItemChannel: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primaryLight,
    fontSize: 16,
    textAlign: 'left',
  } as TextStyle,
  textChannel: {
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'left',
    ...Font(),
  } as TextStyle,
});
export interface ItemDescriptionProps extends ViewProps {
  itemTextContainer?: StyleProp<TextStyle>;
  itemBodyContainer?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  secondLabelDescription?: string;
  firstLabelDescription?: string;
  headerLabelDescription?: string;
  firstDesPartA?: string;
  firstDesPartB?: string;
  firstDesPartC?: string;
  firstDesPartD?: string;
  firstDesPartE?: string;
}

export interface ItemDescriptionState {}

export default class ItemDescription extends React.PureComponent<
  ItemDescriptionProps,
  ItemDescriptionState
> {
  render() {
    const {
      itemTextContainer,
      itemBodyContainer,
      accessibilityLabel,
      secondLabelDescription,
      headerLabelDescription,
      firstDesPartA,
      firstDesPartB,
      firstDesPartC,
      firstDesPartD,
      firstDesPartE,
    } = this.props;
    return (
      <View accessibilityLabel={accessibilityLabel} style={itemTextContainer}>
        <Text style={styles.titleItemChannel}>{headerLabelDescription} </Text>
        <View style={itemBodyContainer}>
          <ChannelDescription
            firstDesPartA={firstDesPartA}
            firstDesPartB={firstDesPartB}
            firstDesPartC={firstDesPartC}
            firstDesPartD={firstDesPartD}
            firstDesPartE={firstDesPartE}
          />
          {!!secondLabelDescription && (
            <Text style={styles.textChannel}>{secondLabelDescription}</Text>
          )}
        </View>
      </View>
    );
  }
}

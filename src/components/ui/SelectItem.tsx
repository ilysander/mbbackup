import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  containerItem: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
  } as ViewStyle,
  containerLastItem: {
    borderBottomWidth: 0,
  } as ViewStyle,
  nameContainer: {
    flex: 1,
    paddingRight: 3,
  } as ViewStyle,
  info: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  secondaryText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
});

export interface SelectItemProps extends TouchableProps {
  item: string;
  last?: boolean;
}

export interface SelectItemState { }

export default class SelectItem extends React.Component<
  SelectItemProps,
  SelectItemState
> {
  state: SelectItemState = {};

  render() {
    const { item, last, accessibilityLabel, ...props } = this.props;
     return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'selectitem'}
        analyticsParams={item}
        style={[styles.containerItem, last && styles.containerLastItem]}
        {...props}
      >
        <View style={styles.info}>
          <View style={styles.nameContainer}>
            <Text
              accessibilityLabel={'selectitem_name'}
              style={styles.secondaryText}
            >
              {item}
            </Text>
          </View>
        </View>
      </Touchable>
    );
  }
}

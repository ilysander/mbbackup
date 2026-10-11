import * as React from 'react';
import {
  FlatList,
  InteractionManager,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import SelectFrequentContactItem from './SelectFrequentContactItem';

const styles = StyleSheet.create({
  list: {
    maxHeight: 210,
  } as ViewStyle,
  container: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grey3,
  } as ViewStyle,
  shadow: {
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowColor: Colors.shadow,
    elevation: 3,
    shadowOffset: { height: 2, width: 2 },
  } as ViewStyle,
});

export interface SelectFrequentContactDropdownProps {
  values: any[];
  style?: StyleProp<ViewStyle>;
  onPressItem?: (index: number) => void;
  accessibilityLabel: string;
}

export interface SelectFrequentContactDropdownState {}

export default class SelectFrequentContactDropdown extends React.Component<
  SelectFrequentContactDropdownProps,
  SelectFrequentContactDropdownState
> {
  interaction!: any;
  list!: FlatList<any> | null;

  selectItem = (index: number) => {
    const { onPressItem } = this.props;
    typeof onPressItem === 'function' && onPressItem(index);
  };

  componentDidMount() {
    this.interaction = InteractionManager.runAfterInteractions(() => {
      this.list && this.list.flashScrollIndicators();
    });
  }

  componentWillUnmount() {
    this.interaction && this.interaction.cancel();
  }

  render() {
    const { values, style, accessibilityLabel, ...props } = this.props;
    return (
      <View style={[styles.container, styles.shadow, style]}>
        <FlatList
          nestedScrollEnabled
          accessibilityLabel={
            accessibilityLabel || 'selectfrequentcontactdropdown'
          }
          data={values}
          keyboardShouldPersistTaps={'handled'}
          {...props}
          renderItem={({ item, index }) => {
            return (
              <SelectFrequentContactItem
                item={item}
                accessibilityLabel={'selectfrequentcontactdropdown_item'}
                onPress={() => this.selectItem(index)}
                last={values.length === index + 1}
              />
            );
          }}
          keyExtractor={(_item, index) => index.toString()}
          refreshing={false}
          removeClippedSubviews
          initialNumToRender={5}
          style={styles.list}
          ref={ref => {
            this.list = ref;
          }}
        />
      </View>
    );
  }
}

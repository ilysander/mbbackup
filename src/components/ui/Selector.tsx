import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Separator from './Separator';
import Touchable from './Touchable';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  } as ViewStyle,
  item: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  labelContainer: {} as ViewStyle,
  separator: {
    marginHorizontal: 20,
  } as ViewStyle,
  image: {
    width: 24,
    height: 24,
    /**
     * este marginVertical sirve para compensar
     * el padding que es de 20 sin tener en cuenta esta imágen
     */
    marginVertical: -4,
    marginRight: 10,
    tintColor: Colors.grey5,
  } as ImageStyle,
  imageSelected: {
    tintColor: Colors.secondary,
  } as ImageStyle,
  labelText: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,
});

export interface SelectorOption<T> {
  label: string;
  value: T;
}

export interface SelectorProps<T> {
  // tslint:disable-next-line: prefer-array-literal
  options: Array<SelectorOption<T>>;
  accessibilityLabel: string;
  defaultValue?: T;
  onSelectIndex?: (index: number) => void;
  optionStyle?: StyleProp<ViewStyle>;
  readOnly?: boolean;
  optional?: boolean;
}

export interface SelectorState {
  selectedIndex: number;
}

export default class Selector<T> extends React.Component<
  SelectorProps<T>,
  SelectorState
> {
  static defaultProps = {};

  state: SelectorState = {
    selectedIndex: -1,
  };

  componentDidMount() {
    const {defaultValue} = this.props;
    if (defaultValue) {
      const selectedIndex = this.getIndexByValue(defaultValue);
      this.setState({selectedIndex});
    }
  }

  getIndexByValue = (value: T) => {
    const {options} = this.props;
    return options.findIndex(item => {
      return item.value === value;
    });
  };
  setValue = (value: T) => {
    const selectedIndex = this.getIndexByValue(value);
    this.setState({selectedIndex});
  };

  getValue = () => {
    const {options} = this.props;
    const {selectedIndex} = this.state;
    return options[selectedIndex] ? options[selectedIndex].value : undefined;
  };

  onSelectIndex = (index: number) => {
    const {onSelectIndex, optional} = this.props;
    let selectedIndex = index;
    if (optional && index === this.state.selectedIndex) {
      selectedIndex = -1;
    }
    this.setState({selectedIndex}, () => {
      typeof onSelectIndex === 'function' && onSelectIndex(selectedIndex);
    });
  };

  render() {
    const {optionStyle, accessibilityLabel, readOnly, options, ...props} =
      this.props;
    const {selectedIndex} = this.state;

    return (
      <View
        style={styles.container}
        accessibilityLabel={accessibilityLabel}
        {...props}>
        {options.map((option, index) => {
          const isLast = index === options.length - 1;
          const isSelected = index === selectedIndex;
          return (
            <View key={index.toString()}>
              <Touchable
                accessibilityLabel={'selector_item'}
                onPress={
                  readOnly
                    ? undefined
                    : () => {
                        this.onSelectIndex(index);
                      }
                }
                style={[styles.item, optionStyle]}>
                <Image
                  accessibilityLabel={'item_image'}
                  style={[styles.image, isSelected && styles.imageSelected]}
                  source={
                    isSelected
                      ? require('../../assets/images/radio-button-selected.png')
                      : require('../../assets/images/radio-button-unselected.png')
                  }
                />
                <View style={styles.labelContainer}>
                  <Text
                    accessibilityLabel={'item_label'}
                    style={styles.labelText}>
                    {option.label}
                  </Text>
                </View>
              </Touchable>
              {!isLast && <Separator style={styles.separator} />}
            </View>
          );
        })}
      </View>
    );
  }
}

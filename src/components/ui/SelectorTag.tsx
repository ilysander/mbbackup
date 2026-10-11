import * as React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import TextError from './TextError';
import Tag from './Tag';
import Touchable from './Touchable';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
  } as ViewStyle,
  item: {
    marginBottom: 10,
  } as ViewStyle,
  itemLast: {
    marginRight: 20,
  } as ViewStyle,
  textErrorContainer: {
    marginTop: 10,
  } as ViewStyle,
});

export interface SelectorOptionValue<T> {
  label: string;
  value: T;
}

export interface SelectorTagProps<T> {
  // tslint:disable-next-line: prefer-array-literal
  options: Array<SelectorOptionValue<T>>;
  defaultValue?: T;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  tagStyle?: StyleProp<ViewStyle>;
  textErrorStyle?: StyleProp<TextStyle>;
  onSelectIndex?: (index: number) => void;
  readOnly?: boolean;
  help?: React.ReactNode[] | React.ReactNode;
  optional?: boolean;
  children?: any;
}

export interface SelectorTagState {
  selectedIndex: number;
  errorMessage: string | React.ReactNode;
}

export default class SelectorTag<T> extends React.Component<
  SelectorTagProps<T>,
  SelectorTagState
> {
  static defaultProps = {};

  state: SelectorTagState = {
    selectedIndex: -1,
    errorMessage: '',
  };

  componentDidMount() {
    const {defaultValue} = this.props;
    if (defaultValue) {
      const selectedIndex = this.getIndexByValue(defaultValue);
      this.setState({selectedIndex});
    }
  }

  setError = (errorMessage?: string | React.ReactNode) => {
    this.setState({errorMessage});
  };
  clearError = () => {
    this.setError(undefined);
  };

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
    const {
      children,
      options,
      optionStyle,
      tagStyle,
      readOnly,
      accessibilityLabel,
      help,
      textErrorStyle,
      style,
      ...props
    } = this.props;
    const {selectedIndex, errorMessage} = this.state;

    const isInvalid = !!errorMessage;
    return (
      <View
        style={[styles.container, style]}
        accessibilityLabel={accessibilityLabel}
        {...props}>
        {options.map((option, index) => {
          const isLast = index === options.length - 1;
          const isSelected = index === selectedIndex;
          if (!isSelected && readOnly) {
            return null;
          }
          return (
            <Touchable
              key={index.toString()}
              accessibilityLabel={'selectortag_item'}
              onPress={
                readOnly
                  ? undefined
                  : () => {
                      this.onSelectIndex(index);
                    }
              }
              style={[styles.item, !isLast && styles.itemLast, optionStyle]}>
              <Tag
                selected={isSelected}
                imageSource={
                  isSelected
                    ? require('../../assets/images/item-checked-icon.png')
                    : undefined
                }
                title={option.label}
                accessibilityLabel={'selectortag_tag'}
                style={tagStyle}
              />
            </Touchable>
          );
        })}
        {children}
        {!isInvalid && help}
        {isInvalid && (
          <TextError style={[styles.textErrorContainer, textErrorStyle]}>
            {errorMessage}
          </TextError>
        )}
      </View>
    );
  }
}

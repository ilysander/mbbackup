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

export interface SelectorTagsValue<T> {
  label: string;
  value: T;
}

export interface SelectorTagsProps<T> {
  // tslint:disable-next-line: prefer-array-literal
  options: Array<SelectorTagsValue<T>>;
  defaultValue?: T[];
  accessibilityLabel: string;
  optionStyle?: StyleProp<ViewStyle>;
  textErrorStyle?: StyleProp<TextStyle>;
  onSelectIndex?: (indexes: number[]) => void;
  readOnly?: boolean;
  help?: React.ReactNode[] | React.ReactNode;
  children?: any;
}

export interface SelectorTagsState {
  selectedIndexes: number[];
  errorMessage: string | React.ReactNode;
}

export default class SelectorTags<T> extends React.Component<
  SelectorTagsProps<T>,
  SelectorTagsState
> {
  static defaultProps = {};

  state: SelectorTagsState = {
    selectedIndexes: [],
    errorMessage: '',
  };

  componentDidMount() {
    const {defaultValue} = this.props;
    if (defaultValue) {
      const selectedIndexes = this.getIndexByValue(defaultValue);
      this.setState({selectedIndexes});
    }
  }

  getIndexByValue = (value: T[]) => {
    const {options} = this.props;
    const selectedIndexes: number[] = [];
    value.forEach(valueItem => {
      const index = options.findIndex(item => {
        return item.value === valueItem;
      });
      index !== -1 && selectedIndexes.push(index);
    });
    return selectedIndexes;
  };

  setValue = (value: T[]) => {
    const selectedIndexes = this.getIndexByValue(value);
    this.setState({selectedIndexes});
  };

  getValue = () => {
    const {options} = this.props;
    return this.state.selectedIndexes.map(index => {
      return options[index].value;
    });
  };

  setError = (errorMessage?: string | React.ReactNode) => {
    this.setState({errorMessage});
  };
  clearError = () => {
    this.setError(undefined);
  };

  onSelectIndex = (index: number) => {
    const {onSelectIndex} = this.props;
    const {selectedIndexes} = this.state;
    const indexes = [...selectedIndexes];

    let hasIndex = false;
    for (let i = 0; i < indexes.length; i++) {
      const value = indexes[i];
      if (value === index) {
        hasIndex = true;
        indexes.splice(i, 1);
        break;
      }
    }

    if (!hasIndex) {
      indexes.push(index);
    }

    this.setState({selectedIndexes: indexes}, () => {
      typeof onSelectIndex === 'function' && onSelectIndex(indexes);
    });
  };

  render() {
    const {
      children,
      options,
      optionStyle,
      defaultValue,
      readOnly,
      help,
      textErrorStyle,
      accessibilityLabel,
      ...props
    } = this.props;

    const {selectedIndexes, errorMessage} = this.state;

    const isInvalid = !!errorMessage;
    return (
      <View
        style={styles.container}
        accessibilityLabel={accessibilityLabel || 'selectortags'}
        {...props}>
        {options.map((option, index) => {
          const isLast = index === options.length - 1;
          const isSelected = selectedIndexes.includes(index);

          if (!isSelected && readOnly) {
            return null;
          }
          return (
            <Touchable
              key={index.toString()}
              accessibilityLabel={'selectortags_item'}
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
                accessibilityLabel={'selectortags_tag'}
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

import * as React from 'react';
import { Animated, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { TextError, Separator } from '../ui';
import { AccountItemSavingsAll } from '../../api/backend/response/Execute';
import SelectAccountItem from './SelectAccountItem';

const styles = StyleSheet.create({
  container: {} as ViewStyle,
  separador: {
    marginHorizontal: 20,
  } as ViewStyle,
});

export interface AccountSelectorExpandedProps extends ViewProps {
  isFocused?: boolean;
  disabled?: boolean;
  values: AccountItemSavingsAll[];
  selectedIndex: number;
  readOnly?: boolean;
  onPress?: (index: number) => void;
  accessibilityLabel: string;
}

export interface AccountSelectorExpandedState {
  isFocused: boolean;
  errorMessage?: string;
}

export default class AccountSelectorExpanded extends React.Component<
  AccountSelectorExpandedProps,
  AccountSelectorExpandedState
> {
  static defaultProps = {
    values: [],
    selectedIndex: -1,
    readOnly: false,
    disabled: false,
    isFocused: false,
  };

  static getDerivedStateFromProps({ isFocused }: AccountSelectorExpandedProps) {
    return { isFocused };
  }
  state: AccountSelectorExpandedState = {
    isFocused: false,
    errorMessage: '',
  };
  animation!: Animated.CompositeAnimation;

  focus = () => {
    this.setState({ isFocused: true });
  };
  blur = () => {
    this.setState({ isFocused: false });
  };

  setError = (value?: string) => {
    this.setState({ errorMessage: value });
  };
  clearError = () => {
    this.setError(undefined);
  };

  allowOnPress = () => {
    const { readOnly, disabled } = this.props;
    return !(readOnly || disabled);
  };

  getAccount = () => {
    const { selectedIndex, values } = this.props;
    const isValidSelectedIndex = selectedIndex > -1;
    return isValidSelectedIndex ? values[selectedIndex] : undefined;
  };

  onPress = (index: number) => {
    const { onPress } = this.props;
    typeof onPress === 'function' && onPress(index);
  };

  render() {
    const { values, selectedIndex, accessibilityLabel, ...props } = this.props;
    const { errorMessage } = this.state;
    const allowOnPress = this.allowOnPress();

    return (
      <View
        style={styles.container}
        accessibilityLabel={accessibilityLabel || 'accountselector'}
        {...props}
      >
        {values.map((item, index) => {
          const selected = index === selectedIndex;
          const isLast = values.length - 1 === index;
          return (
            <View key={item.idProduct}>
              <SelectAccountItem
                accessibilityLabel={'selectaccountmodal_item'}
                item={item}
                selected={selected}
                onPress={
                  allowOnPress
                    ? () => {
                        this.onPress(index);
                      }
                    : undefined
                }
              />
              {!isLast && <Separator style={styles.separador} />}
            </View>
          );
        })}
        {!!errorMessage && <TextError>{errorMessage}</TextError>}
      </View>
    );
  }
}

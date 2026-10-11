import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { Amount } from '../../resources/money';
import { Touchable } from '../ui';
import { L } from '../../resources/language';
import { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  } as ViewStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  contentPaddingBottom: {
    paddingBottom: 0,
  } as ViewStyle,
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  containerDetailText: {
    flex: 1,
    flexDirection: 'row',
  } as ViewStyle,
  detailContent: {
    flex: 1,
  } as ViewStyle,
  optionsContainer: {
    marginRight: 20,
  } as ViewStyle,
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 4,
  } as TextStyle,
  feeText: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey5,
    textAlign: 'left',
    lineHeight: 16,
    justifyContent: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 2,
  } as TextStyle,
  amountText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    lineHeight: 16,
    color: Colors.grey6,
    textAlign: 'right',
  } as TextStyle,
  amountTextDefeated: {
    color: Colors.danger,
  } as TextStyle,
  checkbox: {
    width: 24,
    height: 24,
    tintColor: Colors.primaryLight,
  } as ImageStyle,
  uncheckedCheckbox: {
    width: 24,
    height: 24,
    tintColor: Colors.grey3,
  } as ImageStyle,
});

export interface ChoosePaymentItemProps extends TouchableProps {
  enabled?: boolean;
  selected?: boolean;
  onSelect?: (index: number, selected: boolean) => void;
  index: number;
  item: any;
  currency: string;
  label: string;
}

export interface ChoosePaymentItemState {
  showOverlay: boolean;
}

export default class ChoosePaymentItemScreen extends React.Component<
  ChoosePaymentItemProps,
  ChoosePaymentItemState
> {
  public static defaultProps = {
    selected: false,
  };
  state: ChoosePaymentItemState = {
    showOverlay: false,
  };
  timeout!: number;

  toggle = () => {
    const { selected, onSelect, index } = this.props;
    if (selected === undefined) {
      return;
    }
    typeof onSelect === 'function' && onSelect(index, !selected);
  };

  componentDidUpdate(prevProps: ChoosePaymentItemProps) {
    const { enabled } = this.props;
    if (prevProps.enabled !== enabled) {
      this.setState({ showOverlay: false });
    }
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
  }

  render() {
    const {
      item,
      currency,
      selected,
      label,
      children,
      style,
      accessibilityLabel,
      ...props
    } = this.props;
    if (!item) {
      return <View />;
    }
    return (
      <Touchable
        onPress={this.toggle}
        style={[
          styles.container,
          !!children && styles.contentPaddingBottom,
          style,
        ]}
        accessibilityLabel={accessibilityLabel || 'feeitem'}
        {...props}
      >
        <View style={styles.content}>
          <View style={[styles.infoContainer]}>
            <View style={styles.optionsContainer}>
              {selected && (
                <Image
                  accessibilityLabel={'feeitem_checkbox_active'}
                  style={styles.checkbox}
                  resizeMode={'contain'}
                  source={require('../../assets/images/item-checked-icon.png')}
                />
              )}
              {!selected && (
                <Image
                  accessibilityLabel={'feeitem_checkbox_inactive'}
                  style={styles.uncheckedCheckbox}
                  resizeMode={'contain'}
                  source={require('../../assets/images/radio-button-unselected.png')}
                />
              )}
            </View>
            <View style={styles.containerDetailText}>
              <View style={styles.detailContent}>
                <Text
                  style={styles.feeText}
                  accessibilityLabel={'feeitem_quota'}
                >
                  {label}
                </Text>
              </View>
              <View style={styles.amountContainer}>
                {children && (
                  <View>
                    <Text style={styles.amountText}>
                      {L.choosepaymentitemscreen_text_up_to}
                    </Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.amountText,
                    item.status === 'DUE' && styles.amountTextDefeated,
                  ]}
                  accessibilityLabel={'feeitem_amount'}
                >
                  {Amount.format(item.totalAmount || item.amount, currency)}
                </Text>
              </View>
            </View>
          </View>
          <View>{children && <View>{children}</View>}</View>
        </View>
      </Touchable>
    );
  }
}

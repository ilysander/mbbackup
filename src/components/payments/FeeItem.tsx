const moment = require('moment');
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
import {Colors} from '../../resources/constants';
import {Font} from '../../resources/functions';
import {L} from '../../resources/language';
import {Amount} from '../../resources/money';
import {Focus, Touchable} from '../ui';
import ButtonLink from '../ui/ButtonLink';
import {TouchableProps} from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  } as ViewStyle,
  infoContainer: {
    flex: 1,
  } as ViewStyle,
  detailsContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  optionsContainer: {
    marginRight: 10,
  } as ViewStyle,
  dueDateText: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  feeText: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  amountText: {
    ...Font({weight: 'Bold'}),
    fontSize: 16,
    lineHeight: 19,
    color: Colors.grey6,
  } as TextStyle,
  amountTextDefeated: {
    color: Colors.danger,
  } as TextStyle,
  checkbox: {
    width: 24,
    height: 24,
    tintColor: Colors.secondary,
  } as ImageStyle,
  disabledText: {
    color: Colors.grey6,
    fontSize: 12,
    ...Font({weight: 'Medium'}),
  } as TextStyle,
  disabledContainer: {
    padding: 2,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 6,
    justifyContent: 'center',
  } as ViewStyle,
  disabledButton: {
    padding: 2,
  } as ViewStyle,
});

export interface FeeItemProps extends TouchableProps {
  enabled?: boolean;
  selected?: boolean;
  onSelect?: (index: number, selected: boolean) => void;
  onSelectAll?: (index: number) => void;
  index: number;
  item: any;
  currency: string;
}

export interface FeeItemState {
  showOverlay: boolean;
}

export default class FeeItem extends React.Component<
  FeeItemProps,
  FeeItemState
> {
  state: FeeItemState = {
    showOverlay: false,
  };
  timeout!: NodeJS.Timeout;

  toggle = () => {
    const {enabled, selected, onSelect, index} = this.props;
    if (!enabled) {
      this.setState({showOverlay: true});
      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({showOverlay: false});
      }, 3500);
      return;
    }
    typeof onSelect === 'function' && onSelect(index, !selected);
  };
  selectAll = () => {
    const {onSelectAll, index} = this.props;
    typeof onSelectAll === 'function' && onSelectAll(index);
  };

  componentDidUpdate(prevProps: FeeItemProps) {
    const {enabled} = this.props;
    if (prevProps.enabled !== enabled) {
      this.setState({showOverlay: false});
    }
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
  }

  render() {
    const {item, currency, selected, accessibilityLabel, ...props} = this.props;
    const {showOverlay} = this.state;

    return (
      <Focus
        isFocused={!showOverlay}
        overlay={
          showOverlay ? (
            <View style={styles.disabledContainer}>
              <Text style={styles.disabledText}>
                {L.feeitem_disabled_message}
              </Text>
              <ButtonLink
                accessibilityLabel={'feeitem_buttonlink_selectall'}
                style={styles.disabledButton}
                onPress={this.selectAll}
                title={L.feeitem_select_all}
                accent={'primary'}
              />
            </View>
          ) : null
        }>
        <Touchable
          onPress={this.toggle}
          onLongPress={this.selectAll}
          style={styles.container}
          accessibilityLabel={accessibilityLabel || 'feeitem'}
          {...props}>
          {selected && (
            <View style={styles.optionsContainer}>
              <Image
                accessibilityLabel={'feeitem_checkbox_active'}
                style={styles.checkbox}
                resizeMode={'contain'}
                source={require('../../assets/images/item-checked-icon.png')}
              />
            </View>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.feeText} accessibilityLabel={'feeitem_quota'}>
              {L.feeitem_quota} {item.fee}
            </Text>
            <Text
              style={[
                styles.amountText,
                item.status === 'DUE' && styles.amountTextDefeated,
              ]}
              accessibilityLabel={'feeitem_amount'}>
              {Amount.format(item.totalAmount || item.amount, currency)}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.dueDateText} accessibilityLabel={'feeitem_due'}>
              {item.status === 'DUE' ? L.feeitem_due_defeated : L.feeitem_due}{' '}
              {moment(item.dueDate)
                .format(L.feeitem_due_date_format)
                .toLowerCase()}
            </Text>
          </View>
        </Touchable>
      </Focus>
    );
  }
}

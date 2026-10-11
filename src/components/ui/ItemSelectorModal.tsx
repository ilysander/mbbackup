import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { L } from '../../resources/language';
import Modal from '../ui/Modal';
import Separator from '../ui/Separator';
import SelectItem from './SelectItem';
import { ModalProps } from './Modal';
import AnalyticsEvent, { setEventValue } from '../../resources/analytics/AnalyticsEvent';
import { K } from '../../resources/analytics';

const styles = StyleSheet.create({
  modal: {
    maxHeight: 400,
  } as ViewStyle,
  list: {
    overflow: 'hidden',
    borderRadius: 6,
  } as ViewStyle,
  separatorContent: {
    marginHorizontal: 20,
  } as ViewStyle,
});

export interface ItemSelectorModalProps extends ModalProps {
  title?: string;
  values: string[];
  onPressItem?: (index: number) => void;
  hiddenSubtitle?: boolean;
  subtitle?: string;
  styleSubtitle?: StyleProp<TextStyle>;
  accessibilityLabel?: string | any;
}

export interface ItemSelectorModalState { }

export default class ItemSelectorModal extends React.Component<
  ItemSelectorModalProps,
  ItemSelectorModalState
> {
  state: ItemSelectorModalState = {};
  modal!: Modal | null;

  selectItem = (index: number) => {
    const { onPressItem, onClose, accessibilityLabel, values } = this.props;
    if (accessibilityLabel !== undefined) {
      setEventValue(accessibilityLabel, values[index])
      const label = K[accessibilityLabel];
      AnalyticsEvent.trackEvent('virtualEventApp', label)
    }

    typeof onPressItem === 'function' && onPressItem(index);
    typeof onClose === 'function' && onClose();
  };

  renderSeparator = () => {
    return (
      <View style={styles.separatorContent}>
        <Separator />
      </View>
    );
  };

  render() {
    const {
      onClose,
      title,
      hiddenSubtitle,
      subtitle,
      styleSubtitle,
      values,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <Modal
        accessibilityLabel={'itemselectormodal'}
        ref={ref => {
          this.modal = ref;
        }}
        title={title || L.itemselectormodal_title}
        hiddenSubtitle={hiddenSubtitle}
        subtitle={subtitle}
        styleSubtitle={styleSubtitle}
        style={styles.modal}
        withCloseButton
        {...props}
        onClose={onClose}
      >
        <FlatList
          data={values}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={({ item, index }) => {
            return (
              <SelectItem
                item={item}
                accessibilityLabel={accessibilityLabel}
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
        />
      </Modal>
    );
  }
}

import * as React from 'react';
import { FlatList, StyleSheet, View, ViewStyle } from 'react-native';
import { L } from '../../resources/language';
import { Modal, Separator } from '../ui';
import SelectAccountItem from './SelectAccountItem';
import { ModalProps } from '../ui/Modal';
import { AccountItemSavingsAll } from '../../api/backend/response/Execute';

const styles = StyleSheet.create({
  modal: {
    padding: 0,
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

export interface SelectAccountModalProps extends ModalProps {
  placeholder?: string;
  values: AccountItemSavingsAll[];
  onPressItem?: (index: number) => void;
}

export interface SelectAccountModalState {}

export default class SelectAccountModal extends React.Component<
  SelectAccountModalProps,
  SelectAccountModalState
> {
  state: SelectAccountModalState = {};
  modal!: Modal | null;

  selectItem = (index: number) => {
    const { onPressItem, onClose } = this.props;
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
    const { onClose, placeholder, values, ...props } = this.props;
    return (
      <Modal
        accessibilityLabel={'selectaccountmodal'}
        ref={ref => {
          this.modal = ref;
        }}
        title={placeholder || L.selectaccountmodal_title}
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
              <SelectAccountItem
                item={item}
                accessibilityLabel={'selectaccountmodal_item'}
                onPress={() => {
                  this.selectItem(index);
                }}
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

import * as React from 'react';
import { FlatList, StyleSheet, View, ViewStyle, Text } from 'react-native';
import { L } from '../../resources/language';
import Modal from '../ui/Modal';
import Separator from '../ui/Separator';
import { ModalProps } from '../ui/Modal';
import { InsuranceItem } from '../../api/backend/response/Execute';
import Touchable from '../ui/Touchable';
import Colors from '../../resources/constants/Colors';
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
  itemText: {
    color: Colors.grey5,
    fontSize: 13,
    paddingHorizontal: 15,
  },
});

export interface SelectInsuranceModalProps extends ModalProps {
  placeholder?: string;
  values: InsuranceItem[];
  onPressItem?: (index: number) => void;
}

export interface SelectInsuranceModalState {}

export default class SelectInsuranceModal extends React.Component<
  SelectInsuranceModalProps,
  SelectInsuranceModalState
> {
  state: SelectInsuranceModalState = {};
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
  getInsuranceTitle = (id: number) => {
    switch (id) {
      case 1:
        return L.instantcash_insurance_title_1;
      case 2:
        return L.instantcash_insurance_title_2;
      case 3:
        return L.instantcash_insurance_title_3;
      case 4:
        return L.instantcash_insurance_title_4;
      case 5:
        return L.instantcash_insurance_title_5;
      case 6:
        return L.instantcash_insurance_title_6;
      default:
        return '';
    }
  };

  render() {
    const { onClose, placeholder, values, ...props } = this.props;
    return (
      <Modal
        accessibilityLabel={'selectinsurancemodal'}
        ref={ref => {
          this.modal = ref;
        }}
        title={placeholder || L.selectinsurancemodalterms_title}
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
              <Touchable
                accessibilityLabel="accountselector_touchable_modal_open"
                key={index}
                onPress={() => this.selectItem(item.type.id)}
                style={{ paddingVertical: 15 }}
              >
                <Text style={styles.itemText}>
                  {this.getInsuranceTitle(item.product.id)}
                </Text>
              </Touchable>
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

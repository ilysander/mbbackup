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
import { L } from '../../resources/language';
import { Alert } from '../ui';
import { ModalProps } from '../ui/Modal';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  } as ViewStyle,
  icon: {
    width: 20,
    marginRight: 15,
    tintColor: Colors.primaryLight,
    height: 20,
  } as ImageStyle,
  header: {
    fontSize: 18,
    lineHeight: 20,
    color: Colors.accentDark,
    textAlign: 'center',
    marginBottom: 10,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  itemList: {
    flexDirection: 'row',
    marginVertical: 10,
  } as ViewStyle,
  textItemList: {
    ...Font({ weight: 'Bold' }),
    flex: 1,
    fontSize: 14,
    lineHeight: 16,
    color: Colors.grey5,
  } as TextStyle,
  legalNotice: {
    ...Font(),
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    textAlign: 'justify',
    color: Colors.grey5,
  } as TextStyle,
  definition: {
    ...Font({ weight: 'Medium' }),
    fontSize: 13,
    color: Colors.grey3,
  } as TextStyle,
  subtitle: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
});

export interface DeclarationAlertProps extends ModalProps {
  onReject?: () => void;
  onAgree?: () => void;
  loading?: boolean;
}

export interface DeclarationAlertState {}

export default class DeclarationAlert extends React.Component<
  DeclarationAlertProps,
  DeclarationAlertState
> {
  render() {
    const { onReject, onAgree, onClose, loading, ...props } = this.props;
    return (
      <Alert
        accessibilityLabel={'declarationalert'}
        onClose={onClose}
        cancelButton={{
          accessibilityLabel: 'declarationalert_button_reject',
          onPress: !loading ? onReject : undefined,
          title: L.declarationalert_reject,
          loading,
        }}
        actionButton={{
          accessibilityLabel: 'declarationalert_button_agree',
          onPress: !loading ? onAgree : undefined,
          title: L.declarationalert_agree,
        }}
        message={
          <View
            style={styles.container}
            accessibilityLabel={'declarationalert_container'}
          >
            <Text
              accessibilityLabel={'confirmphonealert_text_description'}
              style={styles.header}
            >
              {L.declarationalert_title}
            </Text>
            <View accessibilityLabel={'declarationalert_content'}>
              <Text style={styles.subtitle}>{L.declarationalert_subtitle}</Text>
              <View style={styles.itemList}>
                <Image
                  accessibilityLabel={'check_image'}
                  style={styles.icon}
                  source={require('../../assets/images/item-checked-icon.png')}
                />
                <Text style={styles.textItemList}>
                  {L.declarationalert_list_item_1}
                </Text>
              </View>
              <View style={styles.itemList}>
                <Image
                  accessibilityLabel={'check_image'}
                  style={styles.icon}
                  source={require('../../assets/images/item-checked-icon.png')}
                />
                <Text style={styles.textItemList}>
                  {L.declarationalert_list_item_2}
                </Text>
              </View>
              <View style={styles.itemList}>
                <Image
                  accessibilityLabel={'check_image'}
                  style={styles.icon}
                  source={require('../../assets/images/item-checked-icon.png')}
                />
                <Text style={styles.textItemList}>
                  {L.declarationalert_list_item_3}
                </Text>
              </View>
              <Text style={styles.legalNotice}>
                {L.declarationalert_notice}
              </Text>
              <Text style={styles.definition}>
                {L.declarationalert_definition}
              </Text>
            </View>
          </View>
        }
        {...props}
      />
    );
  }
}

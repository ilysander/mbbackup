import * as React from 'react';
import {
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { L } from '../../resources/language';
import { Alert } from '../ui';
import { ModalProps } from '../ui/Modal';
import { Font } from '../../resources/functions';
import { Size } from '../../resources/dimensions';

const styles = StyleSheet.create({
  container: {
    maxHeight: 280,
    height: 0.7 * Size.getVisibleScreenHeight(),
    flex: 1,
    paddingTop: 10,
  } as ViewStyle,
  content: {
    overflow: 'hidden',
    flex: 1,
    backgroundColor: 'transparent',
  } as ViewStyle,
  icon: {
    width: 10,
    marginRight: 10,
    marginTop: 6,
    tintColor: Colors.grey6,
    height: 8,
  } as ImageStyle,
  header: {
    fontSize: 18,
    lineHeight: 20,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 15,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  itemList: {
    flexDirection: 'row',
    marginVertical: 6,
  } as ViewStyle,
  textItemList: {
    ...Font({ weight: 'Regular' }),
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: Colors.grey6,
  } as TextStyle,
  legalNotice: {
    ...Font(),
    fontSize: 13,
    marginBottom: 15,
    marginTop: 9,
    textAlign: 'left',
    color: Colors.grey6,
  } as TextStyle,
  definition: {
    ...Font({ weight: 'Medium' }),
    fontSize: 13,
    color: Colors.grey6,
    marginBottom: 12,
  } as TextStyle,
  confirmResendStyleActionButton: {
    backgroundColor: Colors.primary,
    minHeight: 40,
    borderColor: Colors.primary,
    minWidth: 260,
  } as ViewStyle,
});

export interface DeclarationPEPProps extends ModalProps {
  onReject?: () => void;
  onAgree?: () => void;
  loading?: boolean;
}

export interface DeclarationPEPState {}

export default class DeclarationPEP extends React.Component<
  DeclarationPEPProps,
  DeclarationPEPState
> {
  render() {
    const { onReject, onAgree, onClose, loading, ...props } = this.props;
    return (
      <Alert
        accessibilityLabel={'declarationalert'}
        onClose={onClose}
        onReject={onReject}
        withCloseButton={true}
        actionButton={{
          style: styles.confirmResendStyleActionButton,
          accessibilityLabel: 'newaccount_declaration_pdp_button_agree',
          onPress: !loading ? onAgree : undefined,
          title: L.newaccountscreen_pdp_button,
        }}
        message={
          <View
            style={styles.container}
            accessibilityLabel={'newaccount_declaration_pdp_container'}
          >
            <Text
              accessibilityLabel={'newaccount_declaration_pdp_title'}
              style={styles.header}
            >
              {L.newaccountscreen_pdp_title}
            </Text>

            <ScrollView style={styles.content}>
              <View accessibilityLabel={'newaccount_declarationalert_content'}>
                <Text style={styles.legalNotice}>
                  {L.newaccountscreen_pdp_legal_declaration}
                </Text>
                <Text style={styles.legalNotice}>
                  {L.newaccountscreen_pdp_legal_declaration2}
                </Text>
                <Text style={styles.legalNotice}>
                  {L.newaccountscreen_pdp_legal_declaration3}
                </Text>
              </View>
            </ScrollView>
          </View>
        }
        {...props}
      />
    );
  }
}

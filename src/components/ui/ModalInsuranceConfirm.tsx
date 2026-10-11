import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Animated,
  Image,
  View,
  Text,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import ModalStandingUp from './ModalStandingUp';
import CardView from '../ui/CardView';
import Button from '../ui/Button';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';
import Size from '../../resources/dimensions/Size';
import { AnalyticsLabelsType, K } from '../../resources/analytics';
import AnalyticsEvent, {
  setEventValue,
} from '../../resources/analytics/AnalyticsEvent';

const initialBottomModal = Size.getProportionalHeight(-2);
const finalBottomModal = -70;
const animationEmergingModalTime = 450;

const styles = StyleSheet.create({
  viewPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderRadius: 0,
    paddingHorizontal: 42,
    marginTop: 0,
    height: Size.getVisibleScreenHeight() * 0.75,
  } as ViewStyle,
  modalContainer: {
    backgroundColor: Colors.transparent,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  topImage: {
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  } as ImageStyle,
  modalTitle: {
    ...Font({ weight: 'Bold' }),
    fontSize: 20,
    color: Colors.secondary,
    textAlign: 'center',
  } as TextStyle,
  modalDescription: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
    color: Colors.grey6,
    paddingVertical: 15,
    paddingHorizontal: 10,
    textAlign: 'center',
  } as TextStyle,
  textButton: {
    fontSize: 16,
    paddingHorizontal: 10,
  } as ViewStyle,
  textButtonAccept: {
    fontSize: 16,
    paddingHorizontal: 20,
  } as ViewStyle,
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 50,
  } as ViewStyle,
});

export interface ValuesModal {
  amount: string;
  productType: number;
  productId: number;
}

export interface ModalLoanInfoResumeProps {
  onClose?: () => void;
  onPress?: () => void;
  onPressCancel?: () => void;
  accessibilityLabel: AnalyticsLabelsType;
  valuesModal: ValuesModal;
}

export interface ModalLoanInfoResumeState {
  bottomPositionEmergingModal: Animated.Value;
  visible: boolean;
}

export default class ModalInsuranceConfirm extends React.Component<
  ModalLoanInfoResumeProps,
  ModalLoanInfoResumeState
> {
  state: ModalLoanInfoResumeState = {
    bottomPositionEmergingModal: new Animated.Value(initialBottomModal),
    visible: false,
  };

  showPanel() {
    this.setState({ visible: true }, () => {
      this.openPanel();
    });
  }

  openPanel() {
    const { accessibilityLabel, valuesModal } = this.props;
    setEventValue(accessibilityLabel, this.getTitleModal(valuesModal?.amount));
    const label = K[accessibilityLabel];
    AnalyticsEvent.trackEvent('virtualEventApp', label);

    Animated.timing(this.state.bottomPositionEmergingModal, {
      toValue: finalBottomModal,
      duration: animationEmergingModalTime,
      useNativeDriver: false,
    }).start();
  }

  dismissPanel() {
    Animated.timing(this.state.bottomPositionEmergingModal, {
      toValue: initialBottomModal,
      duration: animationEmergingModalTime,
      useNativeDriver: false,
    }).start(() => this.setState({ visible: false }));
  }

  getTitle(itemId: number) {
    let pretitle = '';
    switch (itemId) {
      case 1:
        pretitle = L.instantcash_modalconfirm_insurance_title_1;
        break;
      case 2:
        pretitle = L.instantcash_modalconfirm_insurance_title_2;
        break;
      case 3:
        pretitle = L.instantcash_modalconfirm_insurance_title_3;
        break;
      case 4:
        pretitle = L.instantcash_modalconfirm_insurance_title_4;
        break;
      default:
        pretitle = L.instantcash_modalconfirm_insurance_title_default;
        break;
    }
    return pretitle;
  }

  getTitleModal(amount: string) {
    let title = '';
    title =
      L.instantcash_modalconfirm_title_part1 +
      amount +
      ' ' +
      L.instantcash_modalconfirm_title_part2;
    return title;
  }

  getModalDescription(itemId: number) {
    let pretitle = '';
    switch (itemId) {
      case 1:
        pretitle = L.instantcash_modalconfirm_insurance_description_1;
        break;
      case 2:
        pretitle = L.instantcash_modalconfirm_insurance_description_2;
        break;
      case 3:
        pretitle = L.instantcash_modalconfirm_insurance_description_3;
        break;
      case 4:
        pretitle = L.instantcash_modalconfirm_insurance_description_4;
        break;
      default:
        pretitle = L.instantcash_modalconfirm_insurance_description_default;
        break;
    }
    return pretitle;
  }

  render() {
    const {
      onClose,
      onPress,
      onPressCancel,
      accessibilityLabel,
      valuesModal,
    } = this.props;
    const { bottomPositionEmergingModal, visible } = this.state;
    return (
      <ModalStandingUp
        onClose={onClose}
        visible={visible}
        style={styles.modalContainer}
        accessibilityLabel={accessibilityLabel}
      >
        <Animated.View style={[{ bottom: bottomPositionEmergingModal }]}>
          <CardView style={styles.viewPanel}>
            <Image
              resizeMode={'cover'}
              style={styles.topImage}
              source={require('../../assets/images/adn-man-popup-ask.png')}
            />
            <Text style={styles.modalTitle}>
              {this.getTitleModal(valuesModal?.amount)}
              <Text style={{ color: Colors.grey6 }}>
                {this.getModalDescription(valuesModal.productType)}
              </Text>
            </Text>
            <Text style={styles.modalDescription}>
              {this.getTitle(valuesModal.productType)}
            </Text>
            <View style={styles.buttonsContainer}>
              <Button
                light={true}
                typeColor={'secondary'}
                accessibilityLabel={'modalconfirm_insurance_cancel'}
                textStyle={styles.textButton}
                title={L.instantcash_modalconfirm_button_cancel}
                onPress={() => {
                  this.dismissPanel();
                  onPressCancel && onPressCancel();
                }}
              />
              <Button
                typeColor={'secondary'}
                accessibilityLabel={'modalconfirm_insurance_accept'}
                textStyle={styles.textButtonAccept}
                title={L.instantcash_modalconfirm_button_accept}
                onPress={() => {
                  onPress && onPress();
                  this.dismissPanel();
                }}
              />
            </View>
          </CardView>
        </Animated.View>
      </ModalStandingUp>
    );
  }
}

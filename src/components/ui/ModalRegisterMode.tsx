import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Animated,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import ModalStandingUp from './ModalStandingUp';
import CardView from './CardView';
import RegisterModeButton from './RegisterModeButton';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';
import Size from '../../resources/dimensions/Size';
import { AnalyticsLabelsType } from '../../resources/analytics';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.modal,
  } as ViewStyle,
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  } as ViewStyle,
  buttomContainer: {
    paddingHorizontal: 20,
  } as ViewStyle,
  button: {
    marginBottom: 20,
    padding: 9,
    borderWidth: 0,
  } as ViewStyle,
  buttonTitle: {
    fontSize: 16,
  } as TextStyle,
  titlePanelText: {
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'left',
    marginLeft: 8,
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  subtitlePanelText: {
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 18,
    marginTop: -4,
  } as TextStyle,
  viewPanel: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingTop: 10,
  },
  modalContainer: {
    backgroundColor: Colors.transparent,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  } as ViewStyle,
  icon: {
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.grey4,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  iconCard: {
    resizeMode: 'stretch',
    width: 24,
    height: 18,
    tintColor: Colors.grey4,
  } as ImageStyle,
  iconDni: {
    resizeMode: 'stretch',
    width: 24,
    height: 18,
    tintColor: Colors.grey4,
  } as ImageStyle,
  buttonRegisterModeDni: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  } as ViewStyle,
  buttonRegisterModeDocument: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 10,
  } as ViewStyle,
});
const initialBottomModal = Size.getProportionalHeight(-2);
const finalBottomModal = 0;
const animationEmergingModalTime = 450;
export interface ModalRegisterModeProps {
  onClose?: () => void;
  onRegisterWithCard: () => void;
  onRegisterWithDni: () => void;
  textButton: string;
  accessibilityLabel: AnalyticsLabelsType;
  accessibilityLabelDni: AnalyticsLabelsType;
  accessibilityLabelCard: AnalyticsLabelsType;
}

export interface ModalRegisterModeState {
  bottomPositionEmergingModal: Animated.Value;
  visible: boolean;
}

export default class ModalRegisterMode extends React.Component<
  ModalRegisterModeProps,
  ModalRegisterModeState
> {
  state: ModalRegisterModeState = {
    bottomPositionEmergingModal: new Animated.Value(initialBottomModal),
    visible: false,
  };
  componentDidMount() {}

  showPanel() {
    this.setState({ visible: true }, () => {
      this.openPanel();
    });
  }

  openPanel() {
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

  render() {
    const {
      onClose,
      accessibilityLabel,
      onRegisterWithCard,
      onRegisterWithDni,
      accessibilityLabelDni,
      accessibilityLabelCard,
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
            <RegisterModeButton
              accessibilityLabel={accessibilityLabelDni}
              imageSource={require('../../assets/images/dni-front-ico.png')}
              title={L.modalregistermode_text_type_of_register_dni}
              style={styles.buttonRegisterModeDni}
              onPress={onRegisterWithDni}
            />
            <RegisterModeButton
              accessibilityLabel={accessibilityLabelCard}
              imageSource={require('../../assets/images/icon-tarjeta.png')}
              title={L.modalregistermode_text_type_of_register_debit_card}
              style={styles.buttonRegisterModeDocument}
              onPress={onRegisterWithCard}
            />
          </CardView>
        </Animated.View>
      </ModalStandingUp>
    );
  }
}

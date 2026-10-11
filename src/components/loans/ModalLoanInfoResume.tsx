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
  ScrollView,
} from 'react-native';
import {Colors} from '../../resources/constants';
import ItemLoanInfo from './ItemLoanInfo';
import {CardView, Button, Header, ButtonLink, ModalStandingUp} from '../ui';
import Font from '../../resources/functions/Font';
import {L} from '../../resources/language';
import {Size} from '../../resources/dimensions';
import {AnalyticsLabelsType} from '../../resources/analytics';

const initialBottomModal = Size.getProportionalHeight(-2);
const finalBottomModal = -70;
const animationEmergingModalTime = 450;

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
  titlePanelText: {
    ...Font({weight: 'SemiBold'}),
    textAlign: 'left',
    marginLeft: 8,
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  subtitlePanelText: {
    ...Font({weight: 'SemiBold'}),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 18,
    marginTop: -4,
  } as TextStyle,
  viewPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderRadius: 0,
    paddingHorizontal: 37,
    marginTop: 0,
    paddingTop: 20,
    height: Size.getVisibleScreenHeight() + 70 + 20,
  } as ViewStyle,
  modalContainer: {
    backgroundColor: Colors.transparent,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
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
  titlePanel: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.brown,
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  headerTitle: {
    fontSize: 18,
    ...Font({weight: 'Bold'}),
    color: Colors.brown,
  } as TextStyle,
  topImage: {
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  } as ImageStyle,
  loanPanelImage: {
    width: 21,
    height: 21,
    alignItems: 'center',
    resizeMode: 'contain',
    justifyContent: 'center',
  } as ImageStyle,
  loanPanelText: {
    fontSize: 14,
    color: Colors.grey6,
    textAlign: 'left',
    ...Font({weight: 'Regular'}),
  } as TextStyle,
  loanPanelLinkText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'left',
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  buttomContainer: {
    paddingHorizontal: 40,
    width: Size.getWidth(),
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: 'center',
    height: (Size.getVisibleScreenHeight() * 1.5) / 8,
    marginBottom: 70,
  } as ViewStyle,
  button: {
    borderWidth: 0,
    backgroundColor: Colors.brown,
    height: 40,
    minHeight: 40,
    marginVertical: 0,
  } as ViewStyle,
  buttonTitle: {
    fontSize: 16,
  } as TextStyle,
  linkAccount: {
    fontSize: 14,
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  arrowIcon: {
    width: 6,
    height: 12,
    tintColor: Colors.primary,
    marginLeft: 6,
    resizeMode: 'contain',
  } as ImageStyle,
  textLinkImage: {
    marginLeft: 5,
  } as ImageStyle,
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Size.getWidth(),
    height: (Size.getVisibleScreenHeight() * 2) / 8,
  } as ViewStyle,
  iconoLink: {
    width: 21,
    height: 21,
  } as ImageStyle,
});

export interface ModalLoanInfoResumeProps {
  onClose?: () => void;
  goOpenAccount?: () => void;
  accessibilityLabel: AnalyticsLabelsType;
}

export interface ModalLoanInfoResumeState {
  bottomPositionEmergingModal: Animated.Value;
  visible: boolean;
}

export default class ModalLoanInfoResume extends React.Component<
  ModalLoanInfoResumeProps,
  ModalLoanInfoResumeState
> {
  state: ModalLoanInfoResumeState = {
    bottomPositionEmergingModal: new Animated.Value(initialBottomModal),
    visible: false,
  };

  showPanel() {
    this.setState({visible: true}, () => {
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
    }).start(() => this.setState({visible: false}));
  }

  getTextLink() {
    const textLink = (
      <Text style={styles.loanPanelText}>
        {L.modalloan_info_part4_openHere_pt1}
        <Text style={styles.loanPanelLinkText}>
          {L.modalloan_info_part4_openHere_pt2}
          <Image
            style={styles.arrowIcon}
            source={require('../../assets/images/arrow-icon.png')}
          />
        </Text>
      </Text>
    );
    return textLink;
  }

  render() {
    const {onClose, goOpenAccount, accessibilityLabel} = this.props;
    const {bottomPositionEmergingModal, visible} = this.state;
    const textLink = this.getTextLink();
    return (
      <ModalStandingUp
        onClose={onClose}
        visible={visible}
        style={styles.modalContainer}
        accessibilityLabel={accessibilityLabel}>
        <Animated.View style={[{bottom: bottomPositionEmergingModal}]}>
          <CardView style={styles.viewPanel}>
            <View style={styles.headerContainer}>
              <Image
                resizeMode={'cover'}
                style={styles.topImage}
                source={require('../../assets/images/adn-mujer-triangulos.png')}
              />
              <Header
                style={styles.titlePanel}
                titleStyle={styles.headerTitle}
                accessibilityLabel={'loanscreen_header'}
                title={L.modalloan_header_title}
              />
            </View>
            <View
              style={{
                height: (Size.getVisibleScreenHeight() * 4.5) / 8,
                width: Size.getWidth(),
                paddingHorizontal: 37,
              }}>
              <ScrollView>
                <ItemLoanInfo
                  text={L.modalloan_info_part0_reason}
                  imageSource={require('../../assets/images/icon-medal.png')}
                />

                <ItemLoanInfo
                  text={L.modalloan_info_part1_chooseamount}
                  imageSource={require('../../assets/images/icon-checkPan.png')}
                />

                <ItemLoanInfo
                  text={L.modalloan_info_part2_instant}
                  imageSource={require('../../assets/images/icon-fastPan.png')}
                />

                <ItemLoanInfo
                  textComponent={
                    <ButtonLink
                      accessibilityLabel={'loanresume_buttonlink_loan'}
                      accent={'secondary'}
                      imagePosition={'right'}
                      imageStyle={styles.textLinkImage}
                      titleStyle={styles.linkAccount}
                      onPress={goOpenAccount}
                      style={{padding: 0}}
                      titleComponent={textLink}
                    />
                  }
                  imageSource={require('../../assets/images/icon_prestamos.png')}
                  imageStyle={styles.iconoLink}
                />

                <ItemLoanInfo
                  text={L.modalloan_info_part3_toObtain}
                  imageSource={require('../../assets/images/icon-atmPan.png')}
                />
              </ScrollView>
            </View>

            <View style={styles.buttomContainer}>
              <Button
                accessibilityLabel={'modalloans_button_closeInfo'}
                loading={false}
                title={L.modalloan_btn_closemodal}
                onPress={onClose}
                style={styles.button}
                textStyle={styles.buttonTitle}
              />
            </View>
          </CardView>
        </Animated.View>
      </ModalStandingUp>
    );
  }
}

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
import Colors from '../../resources/constants/Colors';
import ModalStandingUp from './ModalStandingUp';
import CardView from '../ui/CardView';
import Button from '../ui/Button';
import Header from '../ui/Header';
import ExpandableSection from './ExpandableSection';
import Font from '../../resources/functions/Font';
import {L} from '../../resources/language';
import {Size} from '../../resources/dimensions';
import {AnalyticsLabelsType} from '../../resources/analytics';
import Touchable from './Touchable';

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
    paddingHorizontal: 37,
    marginTop: 0,
    height: Size.getVisibleScreenHeight() + 50,
  } as ViewStyle,
  modalContainer: {
    backgroundColor: Colors.transparent,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: Colors.grey6,
    textAlign: 'center',
  } as TextStyle,
  iconImage: {
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  } as ImageStyle,
  closeButton: {
    position: 'absolute',
    top: -28,
    right: 25,
    padding: 0,
    zIndex: 2,
  } as ViewStyle,
  buttomContainer: {
    paddingHorizontal: 40,
    width: Size.getWidth(),
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: 'center',
    height: (Size.getVisibleScreenHeight() * 1.5) / 12,
    marginBottom: 70,
  } as ViewStyle,
  button: {
    borderWidth: 0,
    backgroundColor: Colors.green1,
    height: 40,
    minHeight: 40,
    marginVertical: 0,
  } as ViewStyle,
  buttonTitle: {
    fontSize: 16,
  } as TextStyle,
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Size.getWidth(),
    height: 65,
  } as ViewStyle,
  marginToggle: {
    marginTop: 10,
  } as ViewStyle,
  marginExpandableView: {
    marginHorizontal: 0,
  } as ViewStyle,
  formText: {
    color: Colors.grey6,
    ...Font({weight: 'Regular'}),
    fontSize: 14,
  } as TextStyle,
  boxDescription: {
    ...Font({weight: 'Regular'}),
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,
  boxLogo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    padding: 10,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  } as ViewStyle,
  boxIntentContainer: {
    flexShrink: 1,
    width: '75%',
  } as ViewStyle,
  boxIntent: {
    ...Font({weight: 'Bold'}),
    color: Colors.secondary,
    fontSize: 16,
    marginRight: 5,
  } as TextStyle,
  boxIntentSmall: {
    ...Font({weight: 'Regular'}),
    color: Colors.secondary,
    fontSize: 13,
  } as TextStyle,
  boxFooter: {
    ...Font({weight: 'Regular'}),
    color: Colors.secondary,
    fontSize: 14,
  } as TextStyle,
  imgLogo: {
    width: 134,
    height: 16,
  } as ImageStyle,
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    ...Font({weight: 'Bold'}),
  } as TextStyle,
  descriptionBox: {
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 6,
  } as ViewStyle,
  descriptionContainer: {
    flexDirection: 'row',
    padding: 10,
  } as ViewStyle,
});

export interface ExpandableItem {
  title: string;
  description: string;
  maxHeight: number;
}
export interface ValuesModal {
  amount: string;
  amountTotal: string;
  numberFee: string;
  direction: string;
}

export interface ModalLoanInfoResumeProps {
  onClose?: () => void;
  onPress?: () => void;
  accessibilityLabel: AnalyticsLabelsType;
  expandableItems: ExpandableItem[];
  itemId: number;
  valuesModal: ValuesModal;
}

export interface ModalLoanInfoResumeState {
  bottomPositionEmergingModal: Animated.Value;
  visible: boolean;
}

export default class ModalInsuranceInfoResume extends React.Component<
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

  getTitle(itemId: number) {
    let pretitle = '';
    switch (itemId) {
      case 1:
        pretitle = L.instantcash_modalinforesume_insurance_title_1;
        break;
      case 2:
        pretitle = L.instantcash_modalinforesume_insurance_title_2;
        break;
      case 3:
        pretitle = L.instantcash_modalinforesume_insurance_title_3;
        break;
      case 4:
        pretitle = L.instantcash_modalinforesume_insurance_title_4;
        break;
      default:
        pretitle = L.instantcash_modalinforesume_insurance_title_default;
        break;
    }
    return pretitle;
  }

  getBoxDescription(itemId: number) {
    let pretitle = '';
    switch (itemId) {
      case 1:
        pretitle = L.instantcash_modalinforesume_insurance_description_1;
        break;
      case 2:
        pretitle = L.instantcash_modalinforesume_insurance_description_2;
        break;
      case 3:
        pretitle = L.instantcash_modalinforesume_insurance_description_3;
        break;
      case 4:
        pretitle = L.instantcash_modalinforesume_insurance_description_4;
        break;
      default:
        pretitle = L.instantcash_modalinforesume_insurance_description_default;
        break;
    }
    return pretitle;
  }

  render() {
    const {
      onClose,
      onPress,
      accessibilityLabel,
      expandableItems,
      itemId,
      valuesModal,
    } = this.props;
    const {bottomPositionEmergingModal, visible} = this.state;
    return (
      <ModalStandingUp
        onClose={onClose}
        visible={visible}
        style={styles.modalContainer}
        accessibilityLabel={accessibilityLabel}>
        <Animated.View style={[{bottom: bottomPositionEmergingModal}]}>
          <CardView style={styles.viewPanel}>
            <Touchable
              onPress={() => this.dismissPanel()}
              accessibilityLabel="instantcash_modal_insurance_close"
              style={styles.closeButton}>
              <Image
                resizeMode={'cover'}
                style={styles.iconImage}
                source={require('../../assets/images/icon-close-gray.png')}
              />
            </Touchable>

            <View style={styles.headerContainer}>
              <Header
                style={styles.titlePanel}
                titleStyle={styles.headerTitle}
                accessibilityLabel={'loanscreen_header'}
                title={this.getTitle(itemId)}
              />
            </View>
            <View
              style={{
                height: (Size.getVisibleScreenHeight() * 4.5) / 6.5,
                width: Size.getWidth(),
                paddingHorizontal: 37,
              }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.descriptionBox}>
                  <View style={styles.descriptionContainer}>
                    {itemId === 1 && (
                      <Image
                        resizeMode={'cover'}
                        style={styles.iconImage}
                        source={require('../../assets/images/icon_baghand_triangles.png')}
                      />
                    )}
                    {itemId === 2 && (
                      <Image
                        resizeMode={'cover'}
                        style={styles.iconImage}
                        source={require('../../assets/images/icon_store.png')}
                      />
                    )}
                    {itemId === 3 && (
                      <Image
                        resizeMode={'cover'}
                        style={styles.iconImage}
                        source={require('../../assets/images/icon_family.png')}
                      />
                    )}
                    {itemId === 4 && (
                      <Image
                        resizeMode={'cover'}
                        style={styles.iconImage}
                        source={require('../../assets/images/icon_badge_hands.png')}
                      />
                    )}
                    <View style={styles.boxIntentContainer}>
                      <Text
                        style={
                          styles.boxIntent
                        }>{`Paga S/ ${valuesModal.amount} al mes`}</Text>
                      <Text
                        style={
                          styles.boxIntentSmall
                        }>{`Total por ${valuesModal.numberFee} meses S/ ${valuesModal.amountTotal}`}</Text>
                      <Text style={styles.boxDescription}>
                        {this.getBoxDescription(itemId)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.boxLogo}>
                    <Text style={styles.boxFooter}>
                      {L.instantcash_modalinforesume_text_logo}{' '}
                    </Text>
                    <Image
                      style={styles.imgLogo}
                      source={require('../../assets/images/pacifico-seguros-logo.png')}
                    />
                  </View>
                </View>
                <View style={{marginTop: 20}}>
                  <Text style={styles.subtitle}>
                    {L.instantcash_modalinforesume_description_title}
                  </Text>
                </View>

                {expandableItems.map((item, index) => (
                  <ExpandableSection
                    accessibilityLabel={
                      'modalinsuranceinforesume_expandable_view'
                    }
                    maxHeight={item.maxHeight}
                    toggleContainerStyle={styles.marginToggle}
                    style={styles.marginExpandableView}
                    title={item.title}
                    key={index}>
                    <Text style={styles.formText}>{item.description}</Text>
                  </ExpandableSection>
                ))}
              </ScrollView>
            </View>

            <View style={styles.buttomContainer}>
              <Button
                accessibilityLabel={'modalinsuranceinforesume_button_accept'}
                loading={false}
                title={L.instantcash_modalinforesume_button_accept}
                onPress={onPress}
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

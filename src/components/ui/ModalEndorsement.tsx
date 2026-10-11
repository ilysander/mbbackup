import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  Animated,
  ScrollView,
  Text,
  View,
  TextStyle,
  Platform,
  ImageStyle,
  Image,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import ModalStandingUp from './ModalStandingUp';
import Button from './Button';
import Font from '../../resources/functions/Font';
import Size from '../../resources/dimensions/Size';
import { L } from '../../resources/language';

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
    paddingTop: 20,
  } as ViewStyle,
  button: {
    marginBottom: 20,
    padding: 9,
    borderWidth: 0,
  } as ViewStyle,
  buttonTitle: {
    fontSize: 16,
  } as TextStyle,
  titleText: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 14,
  } as TextStyle,
  titlePanelText: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primaryDark,
    fontSize: 18,
    marginBottom: 20,
  } as TextStyle,
  argumentPanelText: {
    ...Font({ weight: 'Regular' }),
    textAlign: 'left',
    color: Colors.grey6,
    fontSize: 14,
    marginBottom: 10,
  } as TextStyle,
  argumentPanelTextSecond: {
    ...Font({ weight: 'Regular' }),
    textAlign: 'left',
    color: Colors.grey6,
    fontSize: 14,
    marginBottom: 10,
    marginTop: 20,
  } as TextStyle,
  itemInfoAttentionView: {
    flexDirection: 'row',
    marginTop: 10,
    flex: 1,
  } as TextStyle,
  itemImageAttentionView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.2,
  } as ViewStyle,
  itemTextAttentionView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    flex: 0.8,
  } as ViewStyle,
  itemImageAttentionImage: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
  } as ImageStyle,
  argumentPanelView: {
    flex: 1,
    paddingRight: 13,
  } as ViewStyle,
  viewPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingRight: 13,
  } as ViewStyle,
  modalContainer: {
    backgroundColor: Colors.transparent,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  } as ViewStyle,
  animatedPanel: {
    padding: 30,
    paddingBottom: 0,
    marginTop: Size.getHeight() * 0.3,
    width: Size.getWidth(),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: Colors.white,
  } as ViewStyle,
  textBannerTitle: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey1,
    fontSize: 16,
    textAlign: 'center',
  } as TextStyle,
  textBannerHigh: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 18,
  } as TextStyle,
  textBanner: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey1,
    textAlign: 'center',
    fontSize: 14,
  } as TextStyle,
  textBannerPlus: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey1,
    fontSize: 14,
  } as TextStyle,
  bannerBorder: {
    marginTop: 25,
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
    borderWidth: Platform.OS === 'android' && Platform.Version < 20 ? 0.75 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowColor: Colors.grey4,
    shadowOffset: { height: 3, width: 0 },
    borderRadius: 12,
    elevation: 4,
    overflow: 'visible',
  } as ViewStyle,
  bannerContent: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  } as ViewStyle,
  bannerAskWidth: {
    maxWidth: 200,
  } as ViewStyle,
  subtitleContentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  } as ViewStyle,
  itemContentRow: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  } as ViewStyle,
  subtitleShineContainerRight: {
    width: 22,
    alignItems: 'flex-start',
    justifyContent: 'center',
  } as ViewStyle,
  subtitleShine: {
    width: 20,
    height: 28,
    tintColor: Colors.shine,
  } as ImageStyle,
  stepsEndorsement: {
    flex: 1,
    paddingRight: 13,
  } as ImageStyle,
  bannerDescriptionPadding: {
    paddingHorizontal: 10,
  } as ViewStyle,
  nameContainerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginBottom: 30,
  } as ViewStyle,
  containerButton: {
    marginBottom: 30,
  } as ViewStyle,
  textFree: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 13,
    textAlign: 'left',
    paddingLeft: 5,
  } as TextStyle,
  listItem1: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,
  listItem: {
    justifyContent: 'flex-start',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,
  itemtext: {
    width: 266,
    textAlign: 'left',
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  procedureStep: {
    textAlign: 'left',
    color: Colors.grey6,
    fontSize: 14,
    marginLeft: 10,
    ...Font({ weight: 'Regular' }),
  } as TextStyle,
  procedureStepView: {
    flex: 0.95,
  } as TextStyle,
  finalRecomendationView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    paddingRight: 13,
  } as ViewStyle,
  finalAdnRecomendation: {
    width: 75,
    height: 75,
    resizeMode: 'stretch',
    marginBottom: 20,
  } as ImageStyle,
  bulletContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    flex: 1,
    paddingRight: 13,
  } as TextStyle,
  textButton: {
    fontSize: 16,
    textAlign: 'center',
    ...Font({ weight: 'SemiBold' }),
    color: Colors.white,
  } as ViewStyle,
  listImage: {
    width: 10,
    height: 10,
    tintColor: Colors.primary,
  } as ImageStyle,
  bulletImage: {
    width: 10,
    height: 10,
    marginTop: 5,
    tintColor: Colors.primary,
  } as ImageStyle,
  buttonLinkText: {
    textAlign: 'left',
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primaryLight,
    fontSize: 14,
  } as TextStyle,
  iconButton: {
    tintColor: Colors.primaryLight,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  textLinkView: {
    padding: 0,
    alignSelf: 'flex-start',
  } as ViewStyle,
  imageBox: {
    marginRight: 2,
    flex: 0.05,
  } as ViewStyle,
  containerInformation: {
    marginVertical: 30,
    marginHorizontal: 40,
  } as ViewStyle,
  textRecomendation: {
    textAlign: 'left',
    color: Colors.grey6,
    fontSize: 14,
    marginLeft: 10,
    ...Font({ weight: 'Regular' }),
  } as TextStyle,
});

export interface ModalEndorsementProps {
  onClose?: () => void;
  visible: boolean;
  bottom: any;
}

export interface ModalEndorsementState {}

export default class ModalEndorsement extends React.Component<
  ModalEndorsementProps,
  ModalEndorsementState
> {
  render() {
    const { visible, bottom, onClose } = this.props;

    return (
      <ModalStandingUp
        onClose={onClose}
        visible={visible}
        style={styles.modalContainer}
      >
        <Animated.View style={[{ bottom: bottom }, styles.animatedPanel]}>
          <ScrollView>
            <View style={styles.viewPanel}>
              <Text
                style={styles.titlePanelText}
                accessibilityLabel={'modalendorsement_text_title'}
              >
                {L.modalendorsement_title}
              </Text>
              <Text
                style={styles.argumentPanelText}
                accessibilityLabel={'modalendorsement_text_customerrights'}
              >
                {L.modalendorsement_customerright}
              </Text>
            </View>
            <View style={styles.subtitleContentRow}>
              <View style={styles.itemContentRow}>
                <Image
                  accessibilityLabel={'modalendorsement_image_leftconditions'}
                  style={styles.subtitleShine}
                  source={require('../../assets/images/highlight-linear-left.png')}
                />
              </View>
              <View style={styles.itemContentRow}>
                <Text style={[styles.textBannerHigh]}>
                  {L.modalendorsement_condition_title}
                </Text>
              </View>
              <View style={styles.subtitleShineContainerRight}>
                <Image
                  accessibilityLabel={'modalendorsement_image_rightconditions'}
                  style={styles.subtitleShine}
                  source={require('../../assets/images/highlight-linear-right.png')}
                />
              </View>
            </View>
            <View style={styles.argumentPanelView}>
              <Text
                style={styles.argumentPanelText}
                accessibilityLabel={'modalendorsement_text_conditions_part1'}
              >
                {L.modalendorsement_condition_part1}
              </Text>
            </View>
            <View style={styles.itemInfoAttentionView}>
              <View style={styles.itemImageAttentionView}>
                <Image
                  accessibilityLabel={'modalendorsement_image_freecharge'}
                  style={styles.itemImageAttentionImage}
                  source={require('../../assets/images/icon-sin-costo.png')}
                />
              </View>
              <View style={styles.itemTextAttentionView}>
                <Text style={styles.itemtext}>
                  {L.modalendorsement_attention_part1}{' '}
                  <Text style={styles.textFree}>
                    {L.modalendorsement_attention_part2}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.itemInfoAttentionView}>
              <View style={styles.itemImageAttentionView}>
                <Image
                  accessibilityLabel={'modalendorsement_image_calendar'}
                  style={styles.itemImageAttentionImage}
                  source={require('../../assets/images/icon-calendar.png')}
                />
              </View>
              <View style={styles.itemTextAttentionView}>
                <Text style={styles.itemtext}>
                  {L.modalendorsement_calendar}
                </Text>
              </View>
            </View>

            <View style={styles.subtitleContentRow}>
              <View style={styles.itemContentRow}>
                <Image
                  accessibilityLabel={'modalendorsement_image_leftprocedures'}
                  style={styles.subtitleShine}
                  source={require('../../assets/images/highlight-linear-left.png')}
                />
              </View>
              <View style={styles.itemContentRow}>
                <Text style={[styles.textBannerHigh]}>
                  {L.modalendorsement_procedure_title}
                </Text>
              </View>
              <View style={styles.subtitleShineContainerRight}>
                <Image
                  accessibilityLabel={'modalendorsement_image_rightprocedures'}
                  style={styles.subtitleShine}
                  source={require('../../assets/images/highlight-linear-right.png')}
                />
              </View>
            </View>
            <View style={styles.stepsEndorsement}>
              <Text
                style={styles.argumentPanelText}
                accessibilityLabel={'modalendorsement_text_procedures_part1'}
              >
                {L.modalendorsement_procedureargs_part1}
              </Text>
              <Text
                style={styles.argumentPanelText}
                accessibilityLabel={'modalendorsement_text_procedures_part2'}
              >
                {L.modalendorsement_procedureargs_part2}
              </Text>
            </View>
            <View style={styles.bulletContainer}>
              <View style={styles.imageBox}>
                <Image
                  accessibilityLabel={'modalendorsement_image_req_part1'}
                  style={styles.bulletImage}
                  source={require('../../assets/images/icon-bullet-triangle.png')}
                />
              </View>
              <View style={styles.procedureStepView}>
                <Text style={styles.procedureStep}>
                  {L.modalendorsement_recomendation}
                </Text>
              </View>
            </View>
            <View style={styles.bulletContainer}>
              <View style={styles.imageBox}>
                <Image
                  accessibilityLabel={'modalendorsement_image_req_part2'}
                  style={styles.bulletImage}
                  source={require('../../assets/images/icon-bullet-triangle.png')}
                />
              </View>
              <View style={styles.procedureStepView}>
                <Text style={styles.procedureStep}>
                  {L.modalendorsement_recomendation_part1}
                </Text>
              </View>
            </View>
            <View style={styles.bulletContainer}>
              <View style={styles.imageBox}>
                <Image
                  accessibilityLabel={'modalendorsement_image_req_part3'}
                  style={styles.bulletImage}
                  source={require('../../assets/images/icon-bullet-triangle.png')}
                />
              </View>
              <View style={styles.procedureStepView}>
                <Text style={styles.procedureStep}>
                  {L.modalendorsement_recomendation_part2}
                </Text>
              </View>
            </View>
            <View style={styles.finalRecomendationView}>
              <Image
                accessibilityLabel={'modalendorsement_image_recommendation'}
                style={styles.finalAdnRecomendation}
                source={require('../../assets/images/adn-hombre-recomendacion.png')}
              />
              <Text style={styles.textRecomendation}>
                {L.modalendorsement_recomendation_last}
              </Text>
            </View>
          </ScrollView>
          <View style={[styles.buttomContainer]}>
            <Button
              accessibilityLabel={'modalendorsement_button_closemodal'}
              loading={false}
              title={L.modalendorsement_understand_button}
              onPress={onClose}
              style={styles.button}
              textStyle={styles.buttonTitle}
            />
          </View>
        </Animated.View>
      </ModalStandingUp>
    );
  }
}

import * as React from 'react';
import {
  StyleSheet,
  TextStyle,
  Text,
  ViewStyle,
  View,
  Image,
  ImageStyle,
  Platform,
} from 'react-native';
import {
  Container,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
  Header,
  CardView,
  Button,
  BulletItem,
  FormSteps,
  InfoMessage,
} from '../../../components/ui';
import { L } from '../../../resources/language';
import { Colors } from '../../../resources/constants';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import { Size } from '../../../resources/dimensions';
import ResumeHeader from '../../../components/loans/ResumeHeader';
import { Font, Validate } from '../../../resources/functions';
import { LoansItem } from '../../../api/backend/response/Execute';
import ResumeAccountReschedule from '../../../components/loans/ResumeAccountReschedule';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  textHeaderStyle: {
    textAlign: 'center',
  } as TextStyle,
  cardView: {
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 8,
  } as ViewStyle,
  descriptionCard: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey6,
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
  } as TextStyle,
  textBold: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  titleCard: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 20,
  } as TextStyle,
  subtitleCard: {
    ...Font({ weight: 'Medium' }),
    color: Colors.primary,
    fontSize: 13,
  } as TextStyle,
  bullet: {
    marginBottom: 10,
  } as ViewStyle,
  containerResumeInfo: {
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  containerResumeDetailInfo: {
    marginLeft: 40,
    marginRight: 36,
    marginBottom: 15,
  } as ViewStyle,
  iconResumeInfo: {
    height: 18,
    width: 18,
    alignSelf: 'center',
    tintColor: Colors.white,
    marginRight: 6,
  } as ImageStyle,
  textTitleResumeInfo: {
    ...Font({ weight: 'Bold' }),
    color: Colors.white,
    fontSize: 16,
    lineHeight: 22,
  } as TextStyle,
  textDescriptionResumeInfo: {
    ...Font({ weight: 'Medium' }),
    color: Colors.white,
    fontSize: 13,
    lineHeight: 15,
  } as TextStyle,
  textBoldDescriptionResumeInfo: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  containerLoan: {
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowColor: Colors.grey6,
    shadowOffset: { height: 4, width: 0 },
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: Platform.OS === 'android' && Platform.Version < 20 ? 0.75 : 0,
    borderColor: Colors.grey1,
    elevation: 4,
    overflow: 'visible',
  } as ViewStyle,
  infoMessage: {
    marginTop: 20,
    backgroundColor: Colors.white,
  } as ViewStyle,
  titleLinkDescription: {
    fontSize: 13,
    lineHeight: 15,
    color: Colors.primaryLight,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  button: {
    borderColor: Colors.primary,
  } as ViewStyle,
  hitSlopFreezing: {
    top: 10,
    bottom: 10,
    right: 10,
    left: 10,
  },
  hitSlopReschedule: {
    top: 10,
    bottom: 10,
    right: 10,
    left: 10,
  },
});
export interface NavigationParams {
  loan: LoansItem;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  loan?: LoansItem;
}

class LoansPostponementOptionScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {};

  componentDidMount() {
    const { route } = this.props;
    const loan = route.params && route.params.loan;

    this.setState({ loan });
  }

  goToReschedule = () => {
    const { navigation } = this.props;
    const { loan } = this.state;

    navigation.navigate('LoansRescheduleConfirm', { loan });
  };

  goToFreezing = () => {
    const { navigation } = this.props;
    const { loan } = this.state;

    navigation.navigate('LoansFreezingConfirm', { loan });
  };

  goToWeb = () => {
    const { navigation } = this.props;
    navigation.navigate('LoansRescheduleContact');
  };

  render() {
    const { isFocused, navigation } = this.props;
    const { loan } = this.state;

    const typeReschedule = Validate.typePostponementReschedule(loan);
    const typeFreezing = Validate.typePostponementFreezing(loan);

    return (
      <Container>
        <FormSteps total={4} current={1} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            {!!loan && (
              <View style={styles.containerLoan}>
                <ResumeAccountReschedule
                  accessibilityLabel={'loanrescheduleconfirmscreen_resume'}
                  account={loan}
                  navigation={navigation}
                />
                <View
                  accessibilityLabel={'loanrescheduleconfirmscreen_resume_info'}
                  style={styles.containerResumeInfo}
                >
                  <Image
                    accessibilityLabel={'feeitem_checkbox_active'}
                    style={styles.iconResumeInfo}
                    resizeMode={'contain'}
                    source={require('../../../assets/images/info-icon.png')}
                  />
                  <Text style={styles.textTitleResumeInfo}>
                    {L.loanspostoptionscreen_resume_info_title}
                  </Text>
                </View>
                <View style={styles.containerResumeDetailInfo}>
                  <Text style={styles.textDescriptionResumeInfo}>
                    {L.loanspostoptionscreen_resume_info_body_part1}
                    <Text style={styles.textBoldDescriptionResumeInfo}>
                      {L.loanspostoptionscreen_resume_info_body_part2}
                    </Text>
                    {L.loanspostoptionscreen_resume_info_body_part3}
                    <Text style={styles.textBoldDescriptionResumeInfo}>
                      {L.loanspostoptionscreen_resume_info_body_part4}
                    </Text>
                    {L.loanspostoptionscreen_resume_info_body_part5}
                    <Text style={styles.textBoldDescriptionResumeInfo}>
                      {L.loanspostoptionscreen_resume_info_body_part6}
                    </Text>
                  </Text>
                </View>
              </View>
            )}
            <Content center vertical>
              <Header
                center
                style={styles.header}
                accessibilityLabel={'loanpostponementoptionscreen_header'}
                titleStyle={styles.textHeaderStyle}
                title={L.loanspostoptionscreen_header_title}
              />
              {typeReschedule && (
                <CardView style={styles.cardView}>
                  <ResumeHeader
                    titleStyle={styles.titleCard}
                    subtitleStyle={styles.subtitleCard}
                    accessibilityLabel={'postponementoption_reschedule_header'}
                    title={L.loanspostoptionscreen_rescheduleitem_title}
                    subtitle={L.loanspostoptionscreen_rescheduleitem_subtitle}
                    rightContainer={
                      <Button
                        typeColor={'primary'}
                        style={styles.button}
                        accessibilityLabel={'postponementoption_button_choose'}
                        title={L.loanspostoptionscreen_button_choose}
                        onPress={this.goToReschedule}
                        small
                        hitSlop={styles.hitSlopReschedule}
                      />
                    }
                  >
                    <Text style={styles.descriptionCard}>
                      {L.loanspostoptionscreen_rescheduleitem_body_part1}
                      <Text style={styles.textBold}>
                        {L.loanspostoptionscreen_rescheduleitem_body_part2}
                      </Text>
                      {L.loanspostoptionscreen_rescheduleitem_body_part3}
                    </Text>
                    <BulletItem
                      text={L.loanspostoptionscreen_rescheduleitem_datail_item1}
                      styleContainer={styles.bullet}
                    />
                    <BulletItem
                      text={L.loanspostoptionscreen_rescheduleitem_datail_item2}
                      styleContainer={styles.bullet}
                    />
                    <BulletItem
                      text={L.loanspostoptionscreen_rescheduleitem_datail_item3}
                    />
                  </ResumeHeader>
                  <InfoMessage
                    accessibilityLabel={
                      'loansrescheduleconfirmscreen_infomessage'
                    }
                    style={styles.infoMessage}
                    typeColor={'primaryLight'}
                    isMessage={false}
                    isCustomMessage
                    customMessage={
                      <View>
                        <Text style={styles.titleLinkDescription}>
                          {L.loanspostoptionscreen_infomesagge_text1}
                        </Text>
                      </View>
                    }
                  />
                </CardView>
              )}
              {typeFreezing && (
                <CardView style={styles.cardView}>
                  <ResumeHeader
                    titleStyle={styles.titleCard}
                    subtitleStyle={styles.subtitleCard}
                    accessibilityLabel={'rescheduleoption_header'}
                    title={L.loanspostoptionscreen_freezingitem_title}
                    subtitle={L.loanspostoptionscreen_freezingitem_subtitle}
                    rightContainer={
                      <Button
                        typeColor={'primary'}
                        style={styles.button}
                        accessibilityLabel={'postponementoption_button_choose'}
                        title={L.loanspostoptionscreen_button_choose}
                        onPress={this.goToFreezing}
                        small
                        hitSlop={styles.hitSlopFreezing}
                      />
                    }
                  >
                    <Text style={styles.descriptionCard}>
                      {L.loanspostoptionscreen_freezingitem_body_part1}
                      <Text style={styles.textBold}>
                        {L.loanspostoptionscreen_freezingitem_body_part2}
                      </Text>
                      {L.loanspostoptionscreen_freezingitem_body_part3}
                    </Text>
                    <BulletItem
                      text={L.loanspostoptionscreen_freezingitem_datail_item1}
                      styleContainer={styles.bullet}
                    />
                    <BulletItem
                      text={L.loanspostoptionscreen_freezingitem_datail_item2}
                      styleContainer={styles.bullet}
                    />
                    <BulletItem
                      text={L.loanspostoptionscreen_freezingitem_datail_item3}
                    />
                  </ResumeHeader>
                </CardView>
              )}
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoansPostponementOptionType = LoansPostponementOptionScreen;
export default withFocused<LoansPostponementOptionScreen, Props>(
  LoansPostponementOptionScreen
);

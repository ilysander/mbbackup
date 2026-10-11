import * as React from 'react';
import {
  StyleSheet,
  ViewProps,
  ViewStyle,
  ImageSourcePropType,
  GestureResponderEvent,
  TextStyle,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ImageStyle,
} from 'react-native';
import { Separator, CardView, Header } from '../ui';
import AccountField from '../account/AccountField';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Colors } from '../../resources/constants';
import Session from '../../api/Session';
import ModalTermsLPDP from '../terms-lpdp/ModalTermsLPDP';

const styles = StyleSheet.create({
  header: {
    marginTop: 11,
    marginBottom: 5,
  } as ViewStyle,
  titleContainer: {
    fontSize: 20,
  } as TextStyle,
  cardContainer: {
    paddingHorizontal: 20,
    borderRadius: 8,
  } as ViewStyle,
  emailContainer: {
    padding: 0,
    paddingBottom: 10,
  } as ViewStyle,
  itemSubtitleContainer: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
  } as ViewStyle,
  passContainer: {
    padding: 0,
    paddingTop: 10,
  } as ViewStyle,
  textContainer: {
    ...Font(),
    color: Colors.grey5,
  } as TextStyle,
  lpdpConfirmedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  lpdpConfirmedIcon: {
    width: 6,
    height: 12,
    tintColor: Colors.grey4,
  } as ImageStyle,
  container: {
    backgroundColor: Colors.grey1,
    borderRadius: 9,
    marginBottom: 30,
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowColor: Colors.grey6,
    shadowOffset: { height: 4, width: 0 },
    borderWidth: Platform.OS === 'android' && Platform.Version < 20 ? 0.75 : 0,
    borderColor: Colors.grey2,
    elevation: 3,
    overflow: 'visible',
  } as ViewStyle,
});

export interface PersonalInfoProps extends ViewProps {
  isLoading?: boolean;
  changeEmail?: boolean;
  changePhone?: boolean;
  goToChangeEmail?: Function;
  goToChangePhone?: Function;
  title: string;
  iconEmail?: ImageSourcePropType;
  iconPhone?: ImageSourcePropType;
  accessibilityLabel: string;
  mail: string;
  mobilePhone: string;
  headerContainer?: ViewStyle;
  titleContainer?: TextStyle;
  cardContainer?: ViewStyle;
  itemSubtitleContainer?: TextStyle;
  emailContainer?: ViewStyle;
  passContainer?: ViewStyle;
}

export interface PersonalInfoState {}

export default class PersonalInfo extends React.Component<
  PersonalInfoProps,
  PersonalInfoState
> {
  modalTermsLpdp!: ModalTermsLPDP | null;

  goToChangeEmail = (event: GestureResponderEvent) => {
    const { goToChangeEmail } = this.props;
    typeof goToChangeEmail === 'function' && goToChangeEmail(event);
  };
  goToChangePhone = (event: GestureResponderEvent) => {
    const { goToChangePhone } = this.props;
    typeof goToChangePhone === 'function' && goToChangePhone(event);
  };

  showTermsLpdp = () => {
    this.modalTermsLpdp && this.modalTermsLpdp.showPanel();
  };

  render() {
    const {
      isLoading,
      changeEmail,
      changePhone,
      mail,
      mobilePhone,
      accessibilityLabel,
      title,
    } = this.props;

    const isLpdpConfirmed = !!Session.dataLpdp.data.value;
    return (
      <>
        <Header
          style={styles.header}
          titleStyle={styles.titleContainer}
          accessibilityLabel={accessibilityLabel}
          title={title}
        />
        <View style={styles.container}>
          <CardView
            style={styles.cardContainer}
            accessibilityLabel={'personalinfo_cardview_maincontainer'}
          >
            <AccountField
              isLoading={isLoading}
              accessibilityLabel={'personalinfo_accountfield_email'}
              onPress={changeEmail ? this.goToChangeEmail : undefined}
              value={L.personalinfo_accountfield_email_title}
              hasValue={!!mail}
              subtitle={Sanitizer.maskEmail(mail)}
              styleSubtitle={styles.itemSubtitleContainer}
              styleView={styles.emailContainer}
              placeholder={L.personalinfo_accountfield_email_placeholder}
            />
            {<Separator />}
            <AccountField
              isLoading={isLoading}
              accessibilityLabel={'personalinfo_accountfield_phone'}
              onPress={changePhone ? this.goToChangePhone : undefined}
              value={L.personalinfo_accountfield_phone_title}
              hasValue={!!mobilePhone}
              subtitle={Sanitizer.maskPhone(mobilePhone)}
              styleSubtitle={styles.itemSubtitleContainer}
              styleView={styles.passContainer}
            />
          </CardView>
          {!!isLpdpConfirmed && (
            <TouchableOpacity onPress={this.showTermsLpdp}>
              <View style={{ padding: 20 }}>
                <View style={styles.lpdpConfirmedContainer}>
                  <Text style={styles.textContainer}>
                    {L.personalinfo_btn_confirmed_text}
                  </Text>
                  <View style={{ justifyContent: 'center' }}>
                    <Image
                      accessibilityLabel={'personalinfo_image_left'}
                      style={styles.lpdpConfirmedIcon}
                      source={require('../../assets/images/arrow-icon.png')}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <ModalTermsLPDP
            ref={ref => {
              this.modalTermsLpdp = ref;
            }}
            isProfileComponent
            accessibilityLabel={'personalinfo_modalldpdp'}
            accessibilityLabelButtonClose={'personalinfo_modalldpdp_close'}
            accessibilityLabelExpandableItem={'personalinfo_modalldpdp_toggle'}
          />
        </View>
      </>
    );
  }
}

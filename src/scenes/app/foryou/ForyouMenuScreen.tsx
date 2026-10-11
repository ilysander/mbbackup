import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  ImageStyle,
  Text,
  Image,
  TextStyle,
} from 'react-native';
import Font from '../../../resources/functions/Font';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Alert,
  Container,
  KeyboardAvoidingView,
  Loading,
  NetworkStatusAlert,
  SafeAreaView,
  Separator,
  Touchable,
} from '../../../components/ui';
import { Colors } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import { KeyboardUtil } from '../../../resources/util';
import { Validate } from '../../../resources/functions';
import API from '../../../api';
import { Log } from '../../../resources/log';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import Session from '../../../api/Session';
import { PreferencesUserDataModifyPreResponse } from '../../../api/backend/response/Execute';
import { Linking } from '../../../resources/functions';
import Config from '../../../Config';
import ModalInfoNoEmail from '../../../components/email/ModalInfoNoEmail';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const TAG = '[ForyouMenuScreen]';
const styles = StyleSheet.create({
  alertStyle: {
    color: Colors.accentDark,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingTop: 20,
  } as ViewStyle,
  mainHeader: {
    width: '60%',
    padding: 5,
    paddingLeft: 20,
    paddingTop: 10,
  } as ViewStyle,
  title: {
    ...Font({ weight: 'Bold' }),
    fontSize: 26,
    color: Colors.primary,
    textTransform: 'capitalize',
  } as TextStyle,
  tabContainer: {
    paddingHorizontal: 40,
    position: 'absolute',
    marginTop: 120,
    zIndex: 2,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  } as ViewStyle,
  tabInsurance: {
    alignItems: 'center',
    flexGrow: 1,
    padding: 18,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: Colors.grey2,
  } as ViewStyle,
  tabSaves: {
    alignItems: 'center',
    flexGrow: 1,
    padding: 18,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: Colors.grey2,
  } as ViewStyle,
  bannerDescription: {
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  tabTitleActive: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primary,
    marginTop: 5,
  } as TextStyle,
  tabTitle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey5,
    marginTop: 5,
  } as TextStyle,
  cardContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    zIndex: 2,
    marginTop: 40,
    width: '100%',
  } as ViewStyle,
  cardContainerHeight: {
    height: 520,
  } as ViewStyle,
  cardContainerText: {
    width: '80%',
  } as ViewStyle,
  cardSeparator: {
    paddingHorizontal: 15,
  } as ViewStyle,
  cardSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  } as ViewStyle,
  cardTitle: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 20,
  } as TextStyle,
  cardDescription: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  buttons: {
    marginVertical: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 20,
  } as ViewStyle,
  header: {
    marginTop: 30,
  } as ViewStyle,
  separator: {
    marginHorizontal: 20,
  } as ViewStyle,
  bannerImage: {
    width: 140,
    height: 140,
  } as ImageStyle,
  tabIcon: {
    width: 40,
    height: 40,
    tintColor: Colors.primary,
  } as ImageStyle,
  tabIconInsurances: {
    width: 23,
    height: 27,
    tintColor: Colors.grey5,
  } as ImageStyle,
  arrowIcon: {
    width: 6,
    height: 12,
    tintColor: Colors.grey4,
  } as ImageStyle,
  cardIcon: {
    width: 40,
    height: 40,
  } as ImageStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, any>;
}

export interface State {
  user?: PreferencesUserDataModifyPreResponse;
  firstName: string;
  scrollMinHeight: number;
  currentSection: string;
  tabActive: string;
  isLoading: boolean;
  showTryGoToLink: boolean;
  showModalEmail: boolean;
}

class ForyouMenuScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.foryouscreen_title,
  //   headerLeft: <View />,
  // };

  state: State = {
    scrollMinHeight: Size.getVisibleTabScreenHeight(),
    firstName: '',
    isLoading: true,
    tabActive: 'ahorrar',
    currentSection: 'ahorro',
    showTryGoToLink: false,
    showModalEmail: false,
  };

  scroll!: ScrollView | null;
  timeoutScroll!: number;

  blur = () => {
    KeyboardUtil.hide();
  };
  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  load = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const user = response.body.data;
      let firstName = user._clientName.split(' ')[0];
      firstName =
        firstName.length < 28 ? firstName : `${firstName.substring(0, 28)}...`;
      this.setState({ user, firstName });
      Session.setProfile(user);
    } catch (e) {
      Log.exception(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  goToDPF = () => {
    const { user } = this.state;
    if (!user) {
      return;
    }
    this.props.navigation.navigate('DPFOpenCalculator', { user });
  };

  goToTab = (tabActive: string) => {
    this.setState({ tabActive });
  };
  goToDetail = (name: string) => {
    const { user } = this.state;
    const hasEmail = user ? !!user._mail : false;

    if (name === L.foryoumenuscreen_goto_soat) {
      this.props.navigation.navigate('Soat');
    }
    if (name === L.foryoumenuscreen_goto_newaccount) {
      if (!!user) {
        if (!hasEmail) {
          this.setState({ showModalEmail: true });
          return;
        }
        this.props.navigation.navigate('NewAccount');
      }
    }
    if (name === L.foryoumenuscreen_goto_flexhome) {
      this.props.navigation.navigate('FlexHome');
    }
    if (name === L.foryoumenuscreen_goto_oncological) {
      this.props.navigation.navigate('Oncological');
    }
    if (name === L.foryoumenuscreen_goto_protectedsale) {
      this.props.navigation.navigate('ProtectedSale');
    }
    if (name === L.foryoumenuscreen_goto_lifedevolution) {
      this.props.navigation.navigate('LifeDevolution');
    }
    if (name === L.foryoumenuscreen_goto_culqi) {
      this.props.navigation.navigate('Culqi');
    }
    if (name === L.foryoumenuscreen_goto_yape) {
      this.props.navigation.navigate('Yape');
    }
    if (name === L.foryoumenuscreen_goto_yevo) {
      this.props.navigation.navigate('Yevo');
    }
    if (name === L.foryoumenuscreen_goto_mbasesora) {
      this.setState({ showTryGoToLink: true });
    }
  };

  hideTryGoToLink = () => {
    this.setState({
      showTryGoToLink: false,
    });
    Log.debug(TAG, 'hideTryGoToLink');
  };

  goToLink = async () => {
    try {
      await Linking.openURL(Config.settings.foryou.mbTeAsesora.url);
    } catch (e) {
      Log.debug(TAG, 'goToWeb', e);
    }
  };

  closeEmailModal = () => {
    this.setState({ showModalEmail: false });
  };

  render() {
    const {
      scrollMinHeight,
      firstName,
      isLoading,
      showTryGoToLink,
      showModalEmail,
      user,
    } = this.state;
    const { isFocused, navigation } = this.props;
    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: scrollMinHeight,
          }}
          scrollEventThrottle={100}
          ref={ref => {
            this.scroll = ref;
          }}
        >
          <SafeAreaView>
            <View>
              <NetworkStatusAlert style={styles.networkStatus} />
              {!!user && showModalEmail && (
                <ModalInfoNoEmail
                  accessibilityLabel={'foryoumenuscreen_modalinfo_noemail'}
                  navigation={navigation}
                  onClose={this.closeEmailModal}
                  user={user}
                />
              )}
              {showTryGoToLink && (
                <Alert
                  title={L.foryou_alert_title}
                  titleStyle={styles.alertStyle}
                  message={L.foryou_mbasesora_alert_msg}
                  onClose={this.hideTryGoToLink}
                  cancelButton={{
                    accessibilityLabel: 'foryou_mbasesora_button_back',
                    title: L.foryou_alert_back,
                  }}
                  actionButton={{
                    accessibilityLabel: 'foryou_mbasesora_button_accept',
                    title: L.foryou_alert_accept,
                    loading: false,
                    onPress: this.goToLink,
                  }}
                />
              )}
              <View>
                <View style={styles.headerContainer}>
                  <View style={styles.mainHeader}>
                    {(!isLoading || !!firstName) && (
                      <Text
                        style={[
                          styles.title,
                          { fontSize: firstName.length > 10 ? 20 : 26 },
                        ]}
                      >
                        {firstName}
                      </Text>
                    )}
                    <Text style={styles.bannerDescription}>
                      {L.foryouscreen_header_text}
                    </Text>
                  </View>
                  <Image
                    accessibilityLabel={'banner_image_left'}
                    style={styles.bannerImage}
                    source={require('../../../assets/images/adn-man-pointing-glasses.png')}
                  />
                </View>
                <View style={styles.tabContainer}>
                  <Touchable
                    accessibilityLabel="foryoumenuscreen_tab_selector_savings"
                    onPress={() =>
                      this.goToTab(L.foryoumenuscreen_action_ahorrar)
                    }
                    style={[
                      styles.tabSaves,
                      {
                        backgroundColor:
                          this.state.tabActive ===
                            L.foryoumenuscreen_action_ahorrar
                            ? Colors.white
                            : Colors.grey2,
                      },
                    ]}
                  >
                    <Image
                      accessibilityLabel={'banner_image_left'}
                      style={
                        this.state.tabActive ===
                          L.foryoumenuscreen_action_ahorrar
                          ? styles.tabIcon
                          : styles.tabIconInsurances
                      }
                      source={require('../../../assets/images/icon-ahorrar.png')}
                    />
                    <Text
                      style={
                        this.state.tabActive ===
                          L.foryoumenuscreen_action_ahorrar
                          ? styles.tabTitleActive
                          : styles.tabTitle
                      }
                    >
                      {L.foryoumenuscreen_tab_saves}
                    </Text>
                  </Touchable>
                  <Touchable
                    accessibilityLabel="foryoumenuscreen_tab_selector_insurances"
                    onPress={() =>
                      this.goToTab(L.foryoumenuscreen_action_seguros)
                    }
                    style={[
                      styles.tabInsurance,
                      {
                        backgroundColor:
                          this.state.tabActive ===
                            L.foryoumenuscreen_action_seguros
                            ? Colors.white
                            : Colors.grey2,
                      },
                    ]}
                  >
                    <Image
                      accessibilityLabel={'banner_image_left'}
                      style={
                        this.state.tabActive ===
                          L.foryoumenuscreen_action_seguros
                          ? styles.tabIcon
                          : styles.tabIconInsurances
                      }
                      source={require('../../../assets/images/icon-seguros.png')}
                    />
                    <Text
                      style={
                        this.state.tabActive ===
                          L.foryoumenuscreen_action_seguros
                          ? styles.tabTitleActive
                          : styles.tabTitle
                      }
                    >
                      {L.foryoumenuscreen_tab_insurances}
                    </Text>
                  </Touchable>
                  <Touchable
                    accessibilityLabel="foryoumenuscreen_tab_selector_sellmore"
                    onPress={() =>
                      this.goToTab(L.foryoumenuscreen_action_vendermas)
                    }
                    style={[
                      styles.tabInsurance,
                      {
                        backgroundColor:
                          this.state.tabActive ===
                            L.foryoumenuscreen_action_vendermas
                            ? Colors.white
                            : Colors.grey2,
                        paddingHorizontal: 2,
                      },
                    ]}
                  >
                    <Image
                      accessibilityLabel={'banner_image_left'}
                      style={
                        this.state.tabActive ===
                          L.foryoumenuscreen_action_vendermas
                          ? styles.tabIcon
                          : styles.tabIconInsurances
                      }
                      source={require('../../../assets/images/calculator.png')}
                    />
                    <Text
                      style={
                        this.state.tabActive ===
                          L.foryoumenuscreen_action_vendermas
                          ? styles.tabTitleActive
                          : styles.tabTitle
                      }
                    >
                      {L.foryoumenuscreen_tab_sellmore}
                    </Text>
                  </Touchable>
                </View>
                {this.state.tabActive === L.foryoumenuscreen_action_ahorrar && (
                  <>
                    {isLoading ? (
                      <View style={[styles.cardContainer, { height: '100%' }]}>
                        <Loading margin="large" size={'large'} />
                      </View>
                    ) : (
                      <View style={styles.cardContainer}>
                        <Touchable
                          onPress={() => this.goToDPF()}
                          accessibilityLabel="foryoumenuscreen_go_dpf"
                          style={styles.cardSelector}
                        >
                          <Image
                            accessibilityLabel={'banner_image_left'}
                            style={styles.cardIcon}
                            source={require('../../../assets/images/icon-dpf.png')}
                          />
                          <View style={styles.cardContainerText}>
                            <Text style={styles.cardTitle}>
                              {L.foryoumenuscreen_dpf_title}
                            </Text>
                            <Text style={styles.cardDescription}>
                              {L.foryoumenuscreen_dpf_description}
                            </Text>
                          </View>
                          <Image
                            accessibilityLabel={'banner_image_left'}
                            style={styles.arrowIcon}
                            source={require('../../../assets/images/arrow-icon.png')}
                          />
                        </Touchable>
                        <View style={{ paddingHorizontal: 15 }}>
                          <Separator />
                        </View>
                        <Touchable
                          onPress={() => this.goToDetail('ahorro-nueva-cuenta')}
                          accessibilityLabel="foryoumenuscreen_go_newaccount"
                          style={styles.cardSelector}
                        >
                          <Image
                            accessibilityLabel={'banner_image_left'}
                            style={styles.cardIcon}
                            source={require('../../../assets/images/icon-ahorro-negocios.png')}
                          />
                          <View style={styles.cardContainerText}>
                            <Text style={styles.cardTitle}>
                              {L.foryoumenuscreen_newaccount_title}
                            </Text>
                            <Text style={styles.cardDescription}>
                              {L.foryoumenuscreen_newaccount_description}
                            </Text>
                          </View>
                          <Image
                            accessibilityLabel={'banner_image_left'}
                            style={styles.arrowIcon}
                            source={require('../../../assets/images/arrow-icon.png')}
                          />
                        </Touchable>
                      </View>
                    )}
                  </>
                )}
                {this.state.tabActive === L.foryoumenuscreen_action_seguros && (
                  <View
                    style={[styles.cardContainer, styles.cardContainerHeight]}
                  >
                    <Touchable
                      onPress={() =>
                        this.goToDetail(L.foryoumenuscreen_goto_protectedsale)
                      }
                      accessibilityLabel="foryoumenuscreen_go_protectedsale"
                      style={styles.cardSelector}
                    >
                      <Image
                        accessibilityLabel={'banner_image_left'}
                        style={styles.cardIcon}
                        source={require('../../../assets/images/icon_store_money.png')}
                      />
                      <View style={styles.cardContainerText}>
                        <Text style={styles.cardTitle}>
                          {L.foryoumenuscreen_protectedsale_title}
                        </Text>
                        <Text style={styles.cardDescription}>
                          {L.foryoumenuscreen_protectedsale_description}
                        </Text>
                      </View>
                      <Image
                        accessibilityLabel={'banner_image_left'}
                        style={styles.arrowIcon}
                        source={require('../../../assets/images/arrow-icon.png')}
                      />
                    </Touchable>
                    <View style={styles.cardSeparator}>
                      <Separator />
                    </View>
                    <Touchable
                      onPress={() =>
                        this.goToDetail(L.foryoumenuscreen_goto_soat)
                      }
                      accessibilityLabel="foryoumenuscreen_go_soat"
                      style={styles.cardSelector}
                    >
                      <Image
                        accessibilityLabel={'banner_image_left'}
                        style={styles.cardIcon}
                        source={require('../../../assets/images/car-soat.png')}
                      />
                      <View style={styles.cardContainerText}>
                        <Text style={styles.cardTitle}>
                          {L.foryoumenuscreen_soat_title}
                        </Text>
                        <Text style={styles.cardDescription}>
                          {L.foryoumenuscreen_soat_description}
                        </Text>
                      </View>
                      <Image
                        accessibilityLabel={'banner_image_left'}
                        style={styles.arrowIcon}
                        source={require('../../../assets/images/arrow-icon.png')}
                      />
                    </Touchable>
                    <View style={styles.cardSeparator}>
                      <Separator />
                    </View>
                    <Touchable
                      onPress={() =>
                        this.goToDetail(L.foryoumenuscreen_goto_flexhome)
                      }
                      accessibilityLabel="foryoumenuscreen_go_flexhome"
                      style={styles.cardSelector}
                    >
                      <Image
                        accessibilityLabel={'banner_image_left'}
                        style={styles.cardIcon}
                        source={require('../../../assets/images/flex-home.png')}
                      />
                      <View style={styles.cardContainerText}>
                        <Text style={styles.cardTitle}>
                          {L.foryoumenuscreen_flexhome_title}
                        </Text>
                        <Text style={styles.cardDescription}>
                          {L.foryoumenuscreen_flexhome_description}
                        </Text>
                      </View>
                      <Image
                        accessibilityLabel={'banner_image_left'}
                        style={styles.arrowIcon}
                        source={require('../../../assets/images/arrow-icon.png')}
                      />
                    </Touchable>
                    <View style={styles.cardSeparator}>
                      <Separator />
                    </View>
                    {Config.settings.foryou.oncological.active && (
                      <View>
                        <Touchable
                          onPress={() =>
                            this.goToDetail(L.foryoumenuscreen_goto_oncological)
                          }
                          accessibilityLabel="foryoumenuscreen_go_oncological"
                          style={styles.cardSelector}
                        >
                          <Image
                            accessibilityLabel={'banner_image_left'}
                            style={styles.cardIcon}
                            source={require('../../../assets/images/cancer-hands.png')}
                          />
                          <View style={styles.cardContainerText}>
                            <Text style={styles.cardTitle}>
                              {L.foryoumenuscreen_oncological_title}
                            </Text>
                            <Text style={styles.cardDescription}>
                              {L.foryoumenuscreen_oncological_description}
                            </Text>
                          </View>
                          <Image
                            accessibilityLabel={'banner_image_left'}
                            style={styles.arrowIcon}
                            source={require('../../../assets/images/arrow-icon.png')}
                          />
                        </Touchable>
                        <View style={styles.cardSeparator}>
                          <Separator />
                        </View>
                      </View>
                    )}
                    <Touchable
                      onPress={() =>
                        this.goToDetail(L.foryoumenuscreen_goto_lifedevolution)
                      }
                      accessibilityLabel="foryoumenuscreen_go_lifedevolution"
                      style={styles.cardSelector}
                    >
                      <Image
                        accessibilityLabel={'banner_image_left'}
                        style={styles.cardIcon}
                        source={require('../../../assets/images/hand-money.png')}
                      />
                      <View style={styles.cardContainerText}>
                        <Text style={styles.cardTitle}>
                          {L.foryoumenuscreen_lifedevolution_title}
                        </Text>
                        <Text style={styles.cardDescription}>
                          {L.foryoumenuscreen_lifedevolution_description}
                        </Text>
                      </View>
                      <Image
                        accessibilityLabel={'banner_image_left'}
                        style={styles.arrowIcon}
                        source={require('../../../assets/images/arrow-icon.png')}
                      />
                    </Touchable>
                  </View>
                )}
                {this.state.tabActive ===
                  L.foryoumenuscreen_action_vendermas && (
                    <View style={styles.cardContainer}>
                      <Touchable
                        onPress={() =>
                          this.goToDetail(L.foryoumenuscreen_goto_culqi)
                        }
                        accessibilityLabel="foryoumenuscreen_go_culqi"
                        style={styles.cardSelector}
                      >
                        <Image
                          accessibilityLabel={'banner_image_left'}
                          style={styles.cardIcon}
                          source={require('../../../assets/images/culqi.png')}
                        />
                        <View style={styles.cardContainerText}>
                          <Text style={styles.cardTitle}>
                            {L.foryoumenuscreen_culqi_title}
                          </Text>
                          <Text style={styles.cardDescription}>
                            {L.foryoumenuscreen_culqi_description}
                          </Text>
                        </View>
                        <Image
                          accessibilityLabel={'banner_image_left'}
                          style={styles.arrowIcon}
                          source={require('../../../assets/images/arrow-icon.png')}
                        />
                      </Touchable>
                      <View style={styles.cardSeparator}>
                        <Separator />
                      </View>
                      <Touchable
                        onPress={() =>
                          this.goToDetail(L.foryoumenuscreen_goto_yape)
                        }
                        accessibilityLabel="foryoumenuscreen_go_yape"
                        style={styles.cardSelector}
                      >
                        <Image
                          accessibilityLabel={'banner_image_left'}
                          style={styles.cardIcon}
                          source={require('../../../assets/images/yape.png')}
                        />
                        <View style={styles.cardContainerText}>
                          <Text style={styles.cardTitle}>
                            {L.foryoumenuscreen_yape_title}
                          </Text>
                          <Text style={styles.cardDescription}>
                            {L.foryoumenuscreen_yape_description}
                          </Text>
                        </View>
                        <Image
                          accessibilityLabel={'banner_image_left'}
                          style={styles.arrowIcon}
                          source={require('../../../assets/images/arrow-icon.png')}
                        />
                      </Touchable>
                      <View style={styles.cardSeparator}>
                        <Separator />
                      </View>
                      <Touchable
                        onPress={() =>
                          this.goToDetail(L.foryoumenuscreen_goto_yevo)
                        }
                        accessibilityLabel="foryoumenuscreen_go_yevo"
                        style={styles.cardSelector}
                      >
                        <Image
                          accessibilityLabel={'banner_image_left'}
                          style={styles.cardIcon}
                          source={require('../../../assets/images/yevo.png')}
                        />
                        <View style={styles.cardContainerText}>
                          <Text style={styles.cardTitle}>
                            {L.foryoumenuscreen_yevo_title}
                          </Text>
                          <Text style={styles.cardDescription}>
                            {L.foryoumenuscreen_yevo_description}
                          </Text>
                        </View>
                        <Image
                          accessibilityLabel={'banner_image_left'}
                          style={styles.arrowIcon}
                          source={require('../../../assets/images/arrow-icon.png')}
                        />
                      </Touchable>
                      {!!Config.features.ForYouMbAsesora && (
                        <>
                          <View style={styles.cardSeparator}>
                            <Separator />
                          </View>
                          <Touchable
                            onPress={() =>
                              this.goToDetail(L.foryoumenuscreen_goto_mbasesora)
                            }
                            accessibilityLabel="foryoumenuscreen_go_mbasesora"
                            style={styles.cardSelector}
                          >
                            <Image
                              accessibilityLabel={'banner_image_left'}
                              style={styles.cardIcon}
                              source={require('../../../assets/images/super-hero.png')}
                            />
                            <View style={styles.cardContainerText}>
                              <Text style={styles.cardTitle}>
                                {L.foryoumenuscreen_mbasesora_title}
                              </Text>
                              <Text style={styles.cardDescription}>
                                {L.foryoumenuscreen_mbasesora_description}
                              </Text>
                            </View>
                            <Image
                              accessibilityLabel={'banner_image_left'}
                              style={styles.arrowIcon}
                              source={require('../../../assets/images/arrow-icon.png')}
                            />
                          </Touchable>
                        </>
                      )}
                    </View>
                  )}
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}
export type ForyouMenuScreenType = ForyouMenuScreen;
export default withFocused<ForyouMenuScreen, Props>(ForyouMenuScreen);

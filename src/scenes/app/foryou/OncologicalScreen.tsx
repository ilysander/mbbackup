import * as React from 'react';
import {
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
  Container,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  Alert,
  Button,
} from '../../../components/ui';
import { Colors } from '../../../resources/constants';
import { Log } from '../../../resources/log';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import { Linking } from '../../../resources/functions';
import Config from '../../../Config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  alertStyle: {
    color: Colors.accentDark,
    textAlign: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  container: {
    paddingTop: 40,
    height: '100%',
    backgroundColor: Colors.secondary,
  } as ViewStyle,
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  headerText: {
    width: '60%',
    paddingLeft: 30,
  } as ViewStyle,
  cardContainer: {
    marginTop: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  } as ViewStyle,
  card: {
    backgroundColor: Colors.white,
    padding: 18,
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 1,
    borderColor: Colors.grey2,
  } as ViewStyle,
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  cardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  } as ViewStyle,
  cardButton: {
    marginBottom: 10,
  } as ViewStyle,
  bannerDescription: {
    ...Font({ weight: 'Regular' }),
    color: Colors.white,
    fontSize: 14,
  } as TextStyle,
  bannerDescriptionBold: {
    ...Font({ weight: 'Bold' }),
    color: Colors.white,
    fontSize: 16,
  } as TextStyle,
  descriptionTitle: {
    ...Font({ weight: 'Regular' }),
    color: Colors.secondary,
    fontSize: 13,
    textAlign: 'center',
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
  cardTitle: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 20,
  } as TextStyle,
  cardDescription: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  cardDescriptionBold: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  cardText: {
    width: '80%',
    paddingLeft: 6,
  } as ViewStyle,
  networkStatus: {
    marginTop: 20,
  } as ViewStyle,
  header: {
    marginTop: 30,
  } as ViewStyle,
  mainIcon: {
    width: 88,
    height: 69,
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
    width: 50,
    height: 50,
  } as ImageStyle,
  pacificoLogo: {
    width: 83,
    height: 18,
    marginHorizontal: 8,
  } as ImageStyle,
  button: {
    height: 50,
  } as ViewStyle,
});

const TAG = '[Oncological]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  showTryGoToLink: boolean;
}

class OncologicalScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.foryou_oncological_title,
  //   header: (props: HeaderProps) => (
  //     <HeaderMain
  //       styleGlobalContainer={{
  //         backgroundColor: Colors.secondary,
  //       }}
  //       {...props}
  //     />
  //   ),
  // };

  state: State = {
    showTryGoToLink: false,
  };

  tryToSubmit = async () => {
    this.setState({ showTryGoToLink: true });
  };

  hideTryGoToLink = () => {
    this.setState({
      showTryGoToLink: false,
    });
    Log.debug(TAG, 'hideTryGoToLink');
  };

  goToLink = async () => {
    try {
      await Linking.openURL(Config.settings.foryou.flexHome.url);
    } catch (e) {
      Log.debug(TAG, 'goToWeb', e);
    }
  };

  render() {
    const { showTryGoToLink } = this.state;
    const { isFocused } = this.props;
    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <View>
              <NetworkStatusAlert style={styles.networkStatus} />
              {showTryGoToLink && (
                <Alert
                  title={L.foryou_alert_title}
                  titleStyle={styles.alertStyle}
                  message={L.foryou_alert_msj}
                  onClose={this.hideTryGoToLink}
                  cancelButton={{
                    accessibilityLabel: 'foryou_oncological_button_back',
                    title: L.foryou_alert_back,
                  }}
                  actionButton={{
                    accessibilityLabel: 'foryou_oncological_button_accept',
                    title: L.foryou_alert_accept,
                    loading: false,
                    onPress: this.goToLink,
                  }}
                />
              )}
              <View style={styles.container}>
                <View style={styles.headerContainer}>
                  <Image
                    style={styles.mainIcon}
                    source={require('../../../assets/images/cancer-hands.png')}
                  />
                  <View style={styles.headerText}>
                    <Text style={styles.bannerDescriptionBold}>
                      {L.foryou_oncological_header_1}
                      <Text style={styles.bannerDescription}>
                        {L.foryou_oncological_header_2}
                      </Text>
                      {L.foryou_oncological_header_3}
                      <Text style={styles.bannerDescription}>
                        {L.foryou_oncological_header_4}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.cardContainer}>
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.descriptionTitle}>
                        {L.foryou_pacifico_container_header_1}
                      </Text>
                      <Image
                        style={styles.pacificoLogo}
                        source={require('../../../assets/images/pacifico-logo.png')}
                      />
                      <Text style={styles.descriptionTitle}>
                        {L.foryou_pacifico_container_header_2}
                      </Text>
                    </View>
                    <View style={styles.cardSection}>
                      <Image
                        style={styles.cardIcon}
                        source={require('../../../assets/images/brief-medical.png')}
                      />
                      <View style={styles.cardText}>
                        <Text style={styles.cardDescription}>
                          {L.foryou_oncological_firstsection_1}
                          <Text style={styles.cardDescriptionBold}>
                            {L.foryou_oncological_firstsection_2}
                          </Text>
                          {L.foryou_oncological_firstsection_3}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardSection}>
                      <Image
                        style={styles.cardIcon}
                        source={require('../../../assets/images/folder-icon.png')}
                      />
                      <View style={styles.cardText}>
                        <Text style={styles.cardDescription}>
                          <Text style={styles.cardDescriptionBold}>
                            {L.foryou_oncological_secondsection_1}
                          </Text>
                          {L.foryou_oncological_secondsection_2}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardSection}>
                      <Image
                        style={styles.cardIcon}
                        source={require('../../../assets/images/hospital-icon.png')}
                      />
                      <View style={styles.cardText}>
                        <Text style={styles.cardDescription}>
                          {L.foryou_oncological_thirdsection_1}
                          <Text style={styles.cardDescriptionBold}>
                            {L.foryou_oncological_thirdsection_2}
                          </Text>
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardButton}>
                      <Button
                        style={styles.button}
                        allowOnPress
                        accessibilityLabel={'foryou_oncological_button_buy'}
                        onPress={this.tryToSubmit}
                        loading={false}
                        title={L.foryou_buy_button}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type OncologicalScreenType = OncologicalScreen;
export default withFocused<OncologicalScreen, Props>(OncologicalScreen);

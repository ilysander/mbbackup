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
  ButtonLink,
  Separator,
} from '../../../components/ui';
import { Colors } from '../../../resources/constants';
import { Log } from '../../../resources/log';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import { Linking } from '../../../resources/functions';
import Config from '../../../Config';
import { Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  nameContainerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginBottom: 20,
  } as ViewStyle,
  textLinkView: {
    padding: 0,
    alignSelf: 'flex-start',
  } as ViewStyle,
  buttonLinkText: {
    textAlign: 'left',
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primaryLight,
    fontSize: 14,
    paddingLeft: 20,
  } as TextStyle,
  iconButton: {
    tintColor: Colors.primaryLight,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  bannerContentRow: {
    height: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
  bannerImageContainerLeft: {
    width: 14,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 5,
  } as ViewStyle,
  bannerImageContainerRight: {
    width: 14,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 5,
  } as ViewStyle,
  textBannerHigh: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    textAlign: 'center',
    fontSize: 18,
  } as TextStyle,
  bannerImage: {
    width: 19,
    height: 24,
    tintColor: Colors.shine,
  } as ImageStyle,
  alertStyle: {
    color: Colors.accentDark,
    textAlign: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  container: {
    paddingTop: 40,
    height: '100%',
    backgroundColor: Colors.accentDark,
  } as ViewStyle,
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  headerText: {
    width: '70%',
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
  cardSectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
  } as ViewStyle,
  cardSectionFooterIcon: {
    justifyContent: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  cardContainerSeparator: {
    padding: 20,
  } as ViewStyle,
  titleFooterContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
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
  cardDescriptionFooter: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey6,
    fontSize: 13,
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
  cardTextFooter: {
    width: '65%',
    paddingLeft: 6,
  } as ViewStyle,
  networkStatus: {
    marginTop: 20,
  } as ViewStyle,
  header: {
    marginTop: 30,
  } as ViewStyle,
  mainIcon: {
    width: 80,
    height: 80,
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
  cardIconBig: {
    width: 80,
    height: 80,
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

const TAG = '[Yape]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  showTryGoToLink: boolean;
  alertMessage: string;
  downloadLink: boolean;
}

class YapeScreen extends React.Component<Props & FocusedProps, State> {

  state: State = {
    showTryGoToLink: false,
    alertMessage: '',
    downloadLink: false,
  };

  tryToSubmit = async (alertMessage: string, downloadLink: boolean) => {
    this.setState({ showTryGoToLink: true, alertMessage, downloadLink });
  };

  hideTryGoToLink = () => {
    this.setState({
      showTryGoToLink: false,
    });
    Log.debug(TAG, 'hideTryGoToLink');
  };

  goToLink = async () => {
    try {
      const urlLink = Config.settings.foryou.yape.url;
      const downloadLink =
        Platform.OS === 'ios'
          ? Config.settings.foryou.yape.iosUrl
          : Config.settings.foryou.yape.androidUrl;
      const link = this.state.downloadLink ? downloadLink : urlLink;
      await Linking.openURL(link);
    } catch (e) {
      Log.debug(TAG, 'goToDownload', e);
    }
  };

  render() {
    const { showTryGoToLink, alertMessage, downloadLink } = this.state;
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
                  message={alertMessage}
                  onClose={this.hideTryGoToLink}
                  cancelButton={{
                    accessibilityLabel: 'foryou_yape_button_back',
                    title: L.foryou_alert_back,
                  }}
                  actionButton={{
                    accessibilityLabel: 'foryou_yape_button_accept',
                    title: downloadLink
                      ? L.foryou_alert_continue
                      : L.foryou_alert_accept,
                    loading: false,
                    onPress: this.goToLink,
                  }}
                />
              )}
              <View style={styles.container}>
                <View style={styles.headerContainer}>
                  <Image
                    style={styles.mainIcon}
                    source={require('../../../assets/images/yape-big.png')}
                  />
                  <View style={styles.headerText}>
                    <Text style={styles.bannerDescriptionBold}>
                      {L.foryou_yape_header_1}
                      <Text style={styles.bannerDescription}>
                        {L.foryou_yape_header_2}
                      </Text>
                      {L.foryou_yape_header_3}
                      <Text style={styles.bannerDescription}>
                        {L.foryou_yape_header_4}
                      </Text>
                      {L.foryou_yape_header_5}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardContainer}>
                  <View style={styles.card}>
                    <View style={styles.cardSection}>
                      <Image
                        style={styles.cardIcon}
                        source={require('../../../assets/images/circle-tdc.png')}
                      />
                      <View style={styles.cardText}>
                        <Text style={styles.cardDescription}>
                          <Text style={styles.cardDescriptionBold}>
                            {L.foryou_yape_firstsection_1}
                          </Text>
                          {L.foryou_yape_firstsection_2}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardSection}>
                      <Image
                        style={styles.cardIcon}
                        source={require('../../../assets/images/circle-qr.png')}
                      />
                      <View style={styles.cardText}>
                        <Text style={styles.cardDescription}>
                          {L.foryou_yape_secondsection_1}
                          <Text style={styles.cardDescriptionBold}>
                            {L.foryou_yape_secondsection_2}
                          </Text>
                          {L.foryou_yape_secondsection_3}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardSection}>
                      <Image
                        style={styles.cardIcon}
                        source={require('../../../assets/images/circle-clock.png')}
                      />
                      <View style={styles.cardText}>
                        <Text style={styles.cardDescription}>
                          {L.foryou_yape_thirdsection_1}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardSection}>
                      <Image
                        style={styles.cardIcon}
                        source={require('../../../assets/images/circle-no-cash.png')}
                      />
                      <View style={styles.cardText}>
                        <Text style={styles.cardDescription}>
                          {L.foryou_yape_fourthsection_1}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardSection}>
                      <Image
                        style={styles.cardIcon}
                        source={require('../../../assets/images/circle-down-currency.png')}
                      />
                      <View style={styles.cardText}>
                        <Text style={styles.cardDescription}>
                          {L.foryou_yape_fifthsection_1}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.nameContainerButton}>
                      <ButtonLink
                        accent={'primaryLight'}
                        accessibilityLabel={
                          'newaccount_textlink_title_know_more'
                        }
                        style={styles.textLinkView}
                        titleStyle={styles.buttonLinkText}
                        onPress={() =>
                          this.tryToSubmit(L.foryou_alert_mb_msj, false)
                        }
                        title={L.foryou_yape_link}
                        imageSource={require('../../../assets/images/arrow-icon.png')}
                        imagePosition={'right'}
                        imageStyle={styles.iconButton}
                      />
                    </View>
                    <View style={styles.cardContainerSeparator}>
                      <Separator />
                    </View>
                    <View style={styles.cardButton}>
                      <View style={styles.titleFooterContainer}>
                        <Text
                          style={styles.textBannerHigh}
                          accessibilityLabel={'newaccount_list_title'}
                        >
                          {L.foryou_yape_title_footer}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardSectionFooter}>
                      <View style={styles.cardSectionFooterIcon}>
                        <Image
                          style={styles.cardIconBig}
                          source={require('../../../assets/images/mibanco-card.png')}
                        />
                      </View>
                      <View style={styles.cardTextFooter}>
                        <Text style={styles.cardDescriptionFooter}>
                          {L.foryou_yape_footersection_1}
                          <Text style={styles.cardDescriptionBold}>
                            {L.foryou_yape_footersection_2}
                          </Text>
                          {L.foryou_yape_footersection_3}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardButton}>
                      <Button
                        style={styles.button}
                        allowOnPress
                        accessibilityLabel={'foryou_yape_button_buy'}
                        onPress={() =>
                          this.tryToSubmit(L.foryou_alert_download_msj, true)
                        }
                        loading={false}
                        title={L.foryou_yape_button}
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

export type YapeScreenType = YapeScreen;
export default withFocused<YapeScreen, Props>(YapeScreen);

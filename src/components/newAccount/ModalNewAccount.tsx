import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
  Image,
  Animated,
  Modal,
} from 'react-native';
import { ButtonLink } from '../ui';

import { Button } from '../ui/index';

import ModalRedirectPage from '../../components/newAccount/ModalRedirectPage';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { AlertProps } from '../ui/Alert';
import Config from '../../Config';
import { Linking } from '../../resources/functions';
import { Log } from '../../resources/log';

const styles = StyleSheet.create({
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
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 14,
    textAlign: 'center',
  } as TextStyle,
  textBannerHigh: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 22,
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
  listItemtext: {
    width: 266,
    textAlign: 'left',
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  bannerContentRow: {
    height: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
  textButton: {
    fontSize: 16,
    textAlign: 'center',
    ...Font({ weight: 'SemiBold' }),
    color: Colors.white,
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
  bannerImage: {
    width: 14,
    height: 18,
    tintColor: Colors.shine,
  } as ImageStyle,
  listImage: {
    width: 10,
    height: 10,
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
    paddingTop: 2,
    marginRight: 5,
  } as ViewStyle,
  overlay: {
    backgroundColor: Colors.modal,
    flex: 1,
    justifyContent: 'flex-end',
  } as ViewStyle,
  container: {
    minHeight: 370,
    backgroundColor: Colors.white,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  } as ViewStyle,
  containerInformation: {
    marginVertical: 30,
    marginHorizontal: 40,
  } as ViewStyle,
  button: {
    minHeight: 40,
  } as ViewStyle,
});

const TAG = '[TransfersScreen]';

export interface ModalNewAccountProps extends AlertProps {
  title?: string;
  onClose?: () => void;
  bottom: any;
}

export interface ModalNewAccountState {
  isShowModalCancel: boolean;
}

export default class ModalNewAccount extends React.Component<
  ModalNewAccountProps,
  ModalNewAccountState
> {
  state: ModalNewAccountState = {
    isShowModalCancel: false,
  };

  actionModal2 = () => {
    this.setState({ isShowModalCancel: !this.state.isShowModalCancel });
  };

  hideModalRedirectPage = () => {
    this.props.onClose;
    this.setState({ isShowModalCancel: false });
  };

  goToHomeBanking = async () => {
    this.hideModalRedirectPage();
    try {
      await Linking.openURL(Config.settings.loanInfoUrlNewAccount);
    } catch (e) {
      Log.debug(TAG, 'goToHomebanking', e);
    }
  };

  render() {
    const { title, onClose, bottom } = this.props;
    const { isShowModalCancel } = this.state;
    if (!bottom) {
      return;
    }
    return (
      <View>
        {isShowModalCancel && (
          <ModalRedirectPage
            accessibilityLabel={'transfersscreen_availabilityalert'}
            onAction={this.goToHomeBanking}
            onClose={onClose}
          />
        )}

        <Modal
          animated
          animationType="fade"
          visible={!isShowModalCancel}
          transparent
          onRequestClose={() => this.hideModalRedirectPage}
        >
          <View style={styles.overlay}>
            <Animated.View style={[{ bottom: bottom }, styles.container]}>
              <View style={styles.containerInformation}>
                <View>
                  {title && (
                    <Text
                      style={styles.titleText}
                      accessibilityLabel={'alertmessage_text_title'}
                    >
                      {title}
                    </Text>
                  )}
                </View>

                <View style={styles.bannerContentRow}>
                  <View style={styles.bannerImageContainerLeft}>
                    <Image
                      accessibilityLabel={'banner_image_left'}
                      style={styles.bannerImage}
                      source={require('../../assets/images/highlight-linear-left.png')}
                    />
                  </View>
                  <Text
                    style={[styles.textBannerHigh]}
                    accessibilityLabel={'instantcashnewaccount_list_title'}
                  >
                    {L.instacashnewaccount_title}
                  </Text>
                  <View style={styles.bannerImageContainerRight}>
                    <Image
                      accessibilityLabel={'banner_image_right'}
                      style={styles.bannerImage}
                      source={require('../../assets/images/highlight-linear-right.png')}
                    />
                  </View>
                </View>
                <View style={styles.listItem1}>
                  <View style={styles.imageBox}>
                    <Image
                      accessibilityLabel={'instantcashnewaccount_list_item1'}
                      style={styles.listImage}
                      source={require('../../assets/images/icon-bullet-triangle.png')}
                    />
                  </View>
                  <View>
                    <Text style={styles.listItemtext}>
                      {L.instacashnewaccount_item_list1}
                      <Text style={styles.textFree}>
                        {L.instacashnewaccount_text_free}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.imageBox}>
                    <Image
                      accessibilityLabel={'instantcashnewaccount_list_item2'}
                      style={styles.listImage}
                      source={require('../../assets/images/icon-bullet-triangle.png')}
                    />
                  </View>
                  <View>
                    <Text style={styles.listItemtext}>
                      {L.instacashnewaccount_item_list2}
                      <Text style={styles.textFree}>
                        {L.instacashnewaccount_text_free}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.listItem}>
                  <View style={styles.imageBox}>
                    <Image
                      accessibilityLabel={'instantcashnewaccount_list_item3'}
                      style={styles.listImage}
                      source={require('../../assets/images/icon-bullet-triangle.png')}
                    />
                  </View>
                  <View>
                    <Text style={styles.listItemtext}>
                      {L.instacashnewaccount_item_list3}
                      <Text style={styles.textFree}>
                        {L.instacashnewaccount_text_free}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.nameContainerButton}>
                  <ButtonLink
                    accent={'primaryLight'}
                    accessibilityLabel={'modalnewaccount_btn_seemore'}
                    style={styles.textLinkView}
                    titleStyle={styles.buttonLinkText}
                    onPress={this.actionModal2}
                    title={L.instacashnewaccount_text4}
                    imageSource={require('../../assets/images/arrow-icon.png')}
                    imagePosition={'right'}
                    imageStyle={styles.iconButton}
                  />
                </View>
                <View style={styles.containerButton}>
                  <Button
                    typeColor={'primary'}
                    accessibilityLabel={'alert_actionbutton'}
                    textStyle={styles.textButton}
                    onPress={onClose}
                    title={L.instantcashnewaccount_alertmodal_button}
                    style={styles.button}
                  />
                </View>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </View>
    );
  }
}

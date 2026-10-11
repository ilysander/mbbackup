import * as React from 'react';
import {
  StyleSheet,
  Image,
  ImageStyle,
  ViewStyle,
  TextStyle,
  ViewProps,
  Animated,
} from 'react-native';
import {
  CardView,
  ButtonLink,
  CommissionLabel,
  ModalChannelsPanel,
  ChannelRow,
  TitleBox,
} from '../ui';
import Font from '../../resources/functions/Font';
import { Colors } from '../../resources/constants';
import { L } from '../../resources/language';
import { Size } from '../../resources/dimensions';
import Config from '../../Config';
import AnalyticsEvent from '../../resources/analytics/AnalyticsEvent';
import { A } from '../../resources/analytics';
const allChannelsReady = Config.features.AllChannelsReady;
const initialBottomModal = Size.getProportionalHeight(-2);
const finalBottomModal = 0;
const animationEmergingModalTime = 450;
const styles = StyleSheet.create({
  descriptionContainer: {
    paddingVertical: '5%',
    alignItems: 'center',
    borderColor: Colors.accentDark,
  } as ViewStyle,
  noCommissionLabel: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 18,
  } as TextStyle,
  infoButtonText: {
    ...Font({ style: 'Italic' }),
    textAlign: 'left',
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  buttonInfo: {
    marginLeft: -20,
    marginRight: -20,
    padding: 0,
    alignItems: 'center',
    marginTop: 8,
  } as ViewStyle,
  iconButtonText: {
    height: 18,
    width: 18,
    marginLeft: 4,
  } as ImageStyle,
  imageBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: '190%',
    width: '100%',
    borderRadius: 20,
    tintColor: Colors.grey4,
    opacity: 0.09,
  } as ImageStyle,
});

export interface ChannelsProps extends ViewProps { }
export interface ChannelsState {
  allChannelsReady: boolean;
  modalVisible: boolean;
  bottomPositionEmergingModal: Animated.Value;
}
export default class Channels extends React.Component<
  ChannelsProps,
  ChannelsState
> {
  state: ChannelsState = {
    allChannelsReady: allChannelsReady,
    modalVisible: false,
    bottomPositionEmergingModal: new Animated.Value(initialBottomModal),
  };
  closeModal = async () => {
    this.dismissPanel();
  };
  show = async () => {
    AnalyticsEvent.track(A.instantcashsuccessscreen_channelsmodal_open, L.channels_modalchannelpanel_title)
    await this.changeVisiblity(true);
    this.state.modalVisible && this.showPanel();
  };
  changeVisiblity = async (val: boolean) => {
    this.setState({ modalVisible: val });
  };
  showPanel() {
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
    }).start(() => this.changeVisiblity(false));
  }

  render() {
    const { style } = this.props;
    return (
      <CardView style={[styles.descriptionContainer, style]}>
        <ModalChannelsPanel
          accessibilityLabel={'channels_modalchannelpanel_moreinfochannels'}
          visible={this.state.modalVisible}
          onClose={this.closeModal}
          allChannelsReady={this.state.allChannelsReady}
          titleTextLabel={L.channels_modalchannelpanel_title}
          subtitleTextLabel={L.channels_modalchannelpanel_subtitle}
          textButton={L.channels_modalchannelpanel_closemodaltext}
          bottom={this.state.bottomPositionEmergingModal}
        />
        <Image
          resizeMode={'cover'}
          style={styles.imageBackground}
          source={require('../../assets/images/bg-confite-large.png')}
        />
        <TitleBox
          accessibilityLabel={'channels_titlebox_titlechannel'}
          title={L.channels_titlebox_title}
          subtitle={L.channels_titlebox_subtitle}
        />
        <ChannelRow
          accessibilityLabel={'channels_channelrow_channelitems'}
          allChannelsReady={this.state.allChannelsReady}
        />
        <CommissionLabel
          accessibilityLabel={'channels_commissionLabel_plaintext'}
          text={L.channels_comissionlabel_commissioninfo}
          imageSourceLeft={require('../../assets/images/highlight-linear-light-mid-left.png')}
          imageSourceRight={require('../../assets/images/highlight-linear-light-mid-right.png')}
        />
        <ButtonLink
          accent={'accentDark'}
          accessibilityLabel={'channels_buttonlink_showpanel'}
          onPress={this.show}
          title={L.channels_buttonlink_text}
          imageSource={require('../../assets/images/info-icon.png')}
          imagePosition={'right'}
          imageStyle={styles.iconButtonText}
          style={styles.buttonInfo}
          titleStyle={styles.infoButtonText}
        />
      </CardView>
    );
  }
}

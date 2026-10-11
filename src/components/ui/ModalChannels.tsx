import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  Animated,
  ScrollView,
  Text,
  View,
  TextStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import ModalStandingUp from './ModalStandingUp';
import Button from './Button';
import ChannelColumn from './ChannelColumn';
import Font from '../../resources/functions/Font';
import Size from '../../resources/dimensions/Size';

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
    color: Colors.primary,
    fontSize: 18,
  } as TextStyle,
  subtitlePanelText: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 18,
    marginTop: -4,
  } as TextStyle,
  viewPanel: {
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.transparent,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  } as ViewStyle,
  animatedPanel: {
    padding: 30,
    paddingBottom: 0,
    width: Size.getWidth(),
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: Colors.white,
  } as ViewStyle,
});

export interface ModalChannelsProps {
  onClose?: () => void;
  visible: boolean;
  allChannelsReady: boolean;
  titleTextLabel: string;
  subtitleTextLabel: string;
  textButton: string;
  bottom: any;
  accessibilityLabel: string;
}

export interface ModalChannelsState {}

export default class ModalChannels extends React.Component<
  ModalChannelsProps,
  ModalChannelsState
> {
  render() {
    const {
      visible,
      onClose,
      allChannelsReady,
      titleTextLabel,
      subtitleTextLabel,
      textButton,
      bottom,
      accessibilityLabel,
    } = this.props;

    return (
      <ModalStandingUp
        onClose={onClose}
        visible={visible}
        style={styles.modalContainer}
        accessibilityLabel={accessibilityLabel}
      >
        <Animated.View style={[{ bottom: bottom }, styles.animatedPanel]}>
          <ScrollView>
            <View style={styles.viewPanel}>
              <Text
                style={styles.titlePanelText}
                accessibilityLabel={'modalchannels_text_titleinfomaxmonto'}
              >
                {titleTextLabel}
              </Text>
              <Text
                style={styles.subtitlePanelText}
                accessibilityLabel={'modalchannels_text_subtitleinfomaxmonto'}
              >
                {subtitleTextLabel}
              </Text>
            </View>
            <ChannelColumn
              accessibilityLabel={
                'modalchannels_channelcolumn_allactivechannels'
              }
              allChannelsReady={allChannelsReady}
            />
            <View style={styles.buttomContainer}>
              <Button
                accessibilityLabel={'modalchannels_button_closemodalchannels'}
                loading={false}
                title={textButton}
                onPress={onClose}
                style={styles.button}
                textStyle={styles.buttonTitle}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </ModalStandingUp>
    );
  }
}

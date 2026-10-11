import * as React from 'react';
import { ButtonLink, TextInputMasked } from '../../../components/ui';
import { L } from '../../../resources/language';
import ModalNewAccountInfo from '../../../components/newAccount/ModalNewAccount';
import { Font } from '../../../resources/functions';
import { Colors } from '../../../resources/constants';
import {
  View,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  ImageStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Size } from '../../../resources/dimensions';
const initialBottomModal = Size.getProportionalHeight(-2);
const animationEmergingModalTime = 700;
const finalBottomModal = 0;
const styles = StyleSheet.create({
  nameContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  } as ViewStyle,
  nameContainerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  } as ViewStyle,
  iconButton: {
    tintColor: Colors.primaryLight,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  titleStyle: {
    fontSize: 32,
    lineHeight: 34,
  } as TextStyle,
  textActionInfoDocument: {
    color: 'white',
    fontSize: 16,
  } as TextStyle,
  viewActionInfoDocument: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
    width: 280,
    height: 40,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  titleModalText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 10,
    textAlign: 'center',
  } as TextStyle,
  titleText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 13,
    textAlign: 'left',
  } as TextStyle,
  subTitleText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 18,
    textAlign: 'left',
  } as TextStyle,
  subTitleText2: {
    textAlign: 'left',
    ...Font({ weight: 'Regular' }),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  buttonLinkText: {
    textAlign: 'left',
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primaryLight,
    fontSize: 14,
  } as TextStyle,
  textLinkView: {
    padding: 0,
    alignSelf: 'flex-start',
  } as ViewStyle,
});

export interface Params {}

export interface Props {}

export interface State {
  isShowModalCancel: boolean;
  bottomPositionEmergingModal: Animated.Value;
}
export default class InstantCashNewAccount extends React.Component<
  Props,
  State
> {
  state: State = {
    isShowModalCancel: false,
    bottomPositionEmergingModal: new Animated.Value(initialBottomModal),
  };

  interaction!: any;
  emailInput!: TextInputMasked | null;

  componentDidMount() {}

  actionModal = () => {
    this.setState({ isShowModalCancel: !this.state.isShowModalCancel });
  };

  show = async () => {
    await this.actionModal();
    this.state.isShowModalCancel && this.showPanel();
  };

  closeModal = async () => {
    this.actionModal();
  };

  showPanel() {
    Animated.timing(this.state.bottomPositionEmergingModal, {
      toValue: finalBottomModal,
      duration: animationEmergingModalTime,
      useNativeDriver: false,
    }).start(() => {});
  }
  dismissPanel() {
    Animated.timing(this.state.bottomPositionEmergingModal, {
      toValue: initialBottomModal,
      duration: animationEmergingModalTime,
      useNativeDriver: false,
    }).start(() => {
      this.actionModal();
    });
  }

  render() {
    const { bottomPositionEmergingModal } = this.state;
    return (
      <View>
        {this.state.isShowModalCancel && (
          <ModalNewAccountInfo
            titleStyle={styles.titleModalText}
            title={L.instacashnewaccount}
            onClose={this.closeModal}
            bottom={bottomPositionEmergingModal}
          />
        )}
        <TouchableOpacity style={styles.nameContainer} onPress={this.show}>
          <View style={styles.nameContainer}>
            <Text
              accessibilityLabel={'newaccount_text_title'}
              style={styles.titleText}
            >
              {L.instacashnewaccount_text1}
            </Text>
            <Text
              accessibilityLabel={'newaccount_text_subtitle'}
              style={styles.subTitleText}
            >
              {L.instacashnewaccount_text2}
            </Text>
            <Text
              accessibilityLabel={'newaccount_text_subtitle2'}
              style={styles.subTitleText2}
            >
              {L.instacashnewaccount_text3}
            </Text>
          </View>
          <View style={styles.nameContainerButton}>
            <ButtonLink
              accent={'primaryLight'}
              accessibilityLabel={'instantcashnewaccount_textlink_title'}
              style={styles.textLinkView}
              titleStyle={styles.buttonLinkText}
              onPress={this.show}
              title={L.instacashnewaccount_text4}
              imageSource={require('../../../assets/images/arrow-icon.png')}
              imagePosition={'right'}
              imageStyle={styles.iconButton}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

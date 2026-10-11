import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  Animated,
  Text,
  ScrollView,
  View,
  Image,
  TextStyle,
  ImageStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import ModalStandingUp from '../ui/ModalStandingUp';
import CardView from '../ui/CardView';
import { L } from '../../resources/language';
import Size from '../../resources/dimensions/Size';
import { AnalyticsLabelsType } from '../../resources/analytics';
import ExpandableView from '../ui/ExpandableView';
import Button from '../ui/Button';
import { Font } from '../../resources/functions';

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Colors.transparent,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  } as ViewStyle,
  text: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,
  title: {
    ...Font({ weight: 'Bold' }),
    fontSize: 18,
    color: Colors.primary,
  } as TextStyle,
  textCenter: {
    textAlign: 'center',
  } as TextStyle,
  scrollContainer: {
    paddingHorizontal: 30,
    paddingTop: 30,
  } as ViewStyle,
  scrollContain: {
    alignItems: 'center',
  } as ViewStyle,
  imageTitle: {
    height: 80,
    width: 80,
  } as ImageStyle,
  titleContainer: {
    width: '65%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  } as ViewStyle,
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  } as ViewStyle,
  itemImage: {
    height: 50,
    width: 50,
    marginRight: 20,
  } as ImageStyle,
  flex: {
    flex: 1,
  } as ViewStyle,
  expandItem: {
    marginTop: 30,
  } as ViewStyle,
  expandToggleContainer: {
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    padding: 0,
  } as ViewStyle,
  expandLabel: {
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  expandContainer: {
    paddingVertical: 10,
  } as ViewStyle,
  buttonContainer: {
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  transparency: {
    position: 'absolute',
    bottom: 90,
  } as ViewStyle,
  cardView: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  } as ViewStyle,
});
const initialBottomModal = Size.getProportionalHeight(-2);
const finalBottomModal = 0;
const animationEmergingModalTime = 450;
export interface ModalTermsLPDPProps {
  onClose?: () => void;
  accessibilityLabel: AnalyticsLabelsType;
  accessibilityLabelButtonClose: AnalyticsLabelsType;
  accessibilityLabelExpandableItem: AnalyticsLabelsType;
  isProfileComponent?: boolean;
}

export interface ModalTermsLPDPState {
  bottomPositionEmergingModal: Animated.Value;
  visible: boolean;
  isExpanded: boolean;
}

export default class ModalTermsLPDP extends React.Component<
  ModalTermsLPDPProps,
  ModalTermsLPDPState
> {
  state: ModalTermsLPDPState = {
    bottomPositionEmergingModal: new Animated.Value(initialBottomModal),
    visible: false,
    isExpanded: false,
  };

  scrollModal!: ScrollView | null;

  showPanel() {
    this.setState({ visible: true }, () => {
      this.openPanel();
    });
  }

  openPanel() {
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
    }).start(() => this.setState({ visible: false }));
  }

  onToggleExpand = () => {
    setTimeout(() => {
      this.scrollModal && this.scrollModal.scrollToEnd({ animated: true });
    }, 460);
  };

  render() {
    const {
      accessibilityLabel,
      accessibilityLabelButtonClose,
      accessibilityLabelExpandableItem,
      isProfileComponent,
    } = this.props;
    const { bottomPositionEmergingModal, visible } = this.state;

    const maxHeight = Size.getVisibleHeight() - 55;

    return (
      <ModalStandingUp
        visible={visible}
        style={styles.modalContainer}
        accessibilityLabel={accessibilityLabel}
        onClose={() => this.dismissPanel()}
      >
        <Animated.View style={[{ bottom: bottomPositionEmergingModal }]}>
          <CardView style={[styles.cardView, { maxHeight }]}>
            <ScrollView
              ref={ref => {
                this.scrollModal = ref;
              }}
            >
              <View style={styles.scrollContainer}>
                <View style={styles.scrollContain}>
                  <Image
                    source={require('../../assets/images/adn-hombre-recomendacion.png')}
                    style={styles.imageTitle}
                  />
                  <View style={styles.titleContainer}>
                    <Text style={[styles.title, styles.textCenter]}>
                      {L.modaltermslpdp_title}
                    </Text>
                  </View>
                  <Text style={[styles.text, styles.textCenter]}>
                    {!isProfileComponent
                      ? L.modaltermslpdp_subtitle
                      : L.modaltermslpdp_subtitle_profile}
                  </Text>
                  <View style={styles.itemView}>
                    <Image
                      source={require('../../assets/images/icon-speaker.png')}
                      style={styles.itemImage}
                    />
                    <View style={styles.flex}>
                      <Text style={styles.text}>{L.modaltermslpdp_item1}</Text>
                    </View>
                  </View>

                  <View style={styles.itemView}>
                    <Image
                      source={require('../../assets/images/icon-like.png')}
                      style={styles.itemImage}
                    />
                    <View style={styles.flex}>
                      <Text style={styles.text}>{L.modaltermslpdp_item2}</Text>
                    </View>
                  </View>
                </View>
                <ExpandableView
                  accessibilityLabel={accessibilityLabelExpandableItem}
                  style={styles.expandItem}
                  maxHeight={490}
                  toggleContainerStyle={styles.expandToggleContainer}
                  labelMore={L.modaltermslpdp_more_label}
                  labelLess={L.modaltermslpdp_more_label}
                  labelStyle={styles.expandLabel}
                  position={'top'}
                  onToggle={this.onToggleExpand}
                >
                  <View style={styles.expandContainer}>
                    <Text style={styles.text}>{L.termsmodal_lpdp}</Text>
                  </View>
                </ExpandableView>

                {!!isProfileComponent && (
                  <>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        marginTop: 20,
                        borderColor: Colors.grey3,
                      }}
                    />
                    <ExpandableView
                      accessibilityLabel={accessibilityLabelExpandableItem}
                      style={[{ marginTop: 20 }]}
                      maxHeight={180}
                      toggleContainerStyle={styles.expandToggleContainer}
                      labelMore={L.modaltermslpdp_expandableview_more}
                      labelLess={L.modaltermslpdp_expandableview_less}
                      labelStyle={styles.expandLabel}
                      position={'top'}
                    >
                      <View style={styles.expandContainer}>
                        <Text style={styles.text}>
                          {L.modaltermslpdp_expandableview_datails}
                        </Text>
                      </View>
                    </ExpandableView>
                  </>
                )}
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <Button
                accessibilityLabel={accessibilityLabelButtonClose}
                title={L.modaltermslpdp_btn_close}
                onPress={() => this.dismissPanel()}
              />
            </View>
          </CardView>
        </Animated.View>
      </ModalStandingUp>
    );
  }
}

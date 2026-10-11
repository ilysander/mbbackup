import * as React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ViewStyle,
  ImageStyle,
  Modal as BaseModal,
  ModalProps as BaseModalProps,
  Image,
  Text,
  TextStyle,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';
import Size from '../../resources/dimensions/Size';
import Button from '../ui/Button';
import StepRectangle from './StepRectangle';
import { TourStepData } from './TourManager';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  } as ViewStyle,
  adnWomen: {
    width: 70,
    height: 65,
  } as ImageStyle,
  flag: {
    width: 25,
    height: 25,
  } as ImageStyle,
  skipText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey1,
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 10,
    paddingTop: 5,
    textAlign: 'center',
  } as TextStyle,
  messageStep: {
    fontSize: 14,
    lineHeight: 19,
    color: Colors.white,
    ...Font({ weight: 'Bold' }),
    paddingLeft: 10,
  } as TextStyle,
  numerationText: {
    fontSize: 14,
    lineHeight: 19,
    color: Colors.white,
    paddingLeft: 15,
    paddingRight: 10,
    ...Font({ weight: 'Regular' }),
  } as TextStyle,
  whiteButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    marginLeft: 8,
    marginVertical: 4,
  } as ViewStyle,
  whiteTextButton: {
    fontSize: 16,
    color: Colors.white,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  primaryButton: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.white,
    marginVertical: 4,
  } as ViewStyle,
  primaryTextButton: {
    fontSize: 16,
    color: Colors.primary,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  banner: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowColor: 'black',
    elevation: 2,
    shadowOffset: { height: 0, width: 0 },
  } as ViewStyle,
  bannerInfo: {
    position: 'relative',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: Colors.primaryLight,
    borderTopEndRadius: 12,
    borderBottomStartRadius: 12,
    borderBottomEndRadius: 12,
  } as ViewStyle,
  containerAdnWomen: {
    flexDirection: 'row',
  } as ViewStyle,
  containerOptions: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    flexGrow: 1,
  } as ViewStyle,
  containerButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'center',
    paddingRight: 10,
    flexWrap: 'wrap',
  } as ViewStyle,
  containerSkip: {
    backgroundColor: Colors.primaryLight,
    borderTopStartRadius: 12,
    borderTopEndRadius: 12,
    alignSelf: 'flex-start',
  } as ViewStyle,
  containerFlag: {
    position: 'absolute',
    bottom: -22,
  } as ViewStyle,
  containerMessage: {
    flex: 1,
  } as ViewStyle,
});

const flagWidth = 25;
const flagHeight = 23;
const paddingLayout = 20;

export interface StepModalProps extends BaseModalProps {
  stepData: TourStepData;
  total: number;
  onClose?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasLoans: boolean;
}
export interface StepModalState {
  leftAnimated: Animated.Value;
  bottomAnimated: Animated.Value;
}

class StepModal extends React.PureComponent<StepModalProps, StepModalState> {
  static defaultProps = {
    message: '',
    hasLoans: false,
  };

  state: StepModalState = {
    leftAnimated: new Animated.Value(0),
    bottomAnimated: new Animated.Value(0),
  };
  animation!: Animated.CompositeAnimation;

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps: StepModalProps) {
    if (prevProps.stepData !== this.props.stepData) {
      this.animate();
    }
  }

  animate = () => {
    const { stepData } = this.props;
    const bottom = this.bottomStep(stepData);
    const left = this.leftStep(stepData);

    if (this.animation) {
      this.animation.stop();
    }
    this.animation = Animated.parallel([
      Animated.spring(this.state.leftAnimated, {
        toValue: left,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(this.state.bottomAnimated, {
        toValue: bottom,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]);

    this.animation.start();
  };

  bottomStep = (data: TourStepData): number => {
    const { height } = data.layout;
    const spacingPhoneX =
      Platform.OS === 'ios' && Size.isiPhoneX()
        ? Size.getBottomInsetHeight() + 12
        : 0;
    const bottom = height + flagHeight + spacingPhoneX;

    return bottom * -1;
  };

  leftStep = (data: TourStepData): number => {
    const { width, x } = data.layout;
    const { stepNumber } = data.step;
    switch (stepNumber) {
      default:
      case 1:
        const left1 = x + width / 2 - paddingLayout;
        return left1;
      case 2:
        const left2 = x + width / 2 - paddingLayout - flagWidth / 2;
        return left2;
      case 3:
        const left3 = x + width / 2 - paddingLayout - flagWidth / 2;
        return left3;
      case 4:
        const left4 = x + width / 2 - paddingLayout - flagWidth / 2;
        return left4;
      case 5:
        const left5 = x - paddingLayout / 2;
        return left5;
    }
  };

  render() {
    const {
      visible,
      stepData,
      total,
      onClose,
      onPrev,
      onNext,
      children,
      hasLoans,
      ...props
    } = this.props;
    const { leftAnimated, bottomAnimated } = this.state;
    const step = stepData.step;

    return (
      <BaseModal
        visible={visible}
        animationType={'fade'}
        transparent
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        {...props}
      >
        <StatusBar
          backgroundColor={Colors.grey4}
          barStyle={'dark-content'}
          animated
        />

        <View style={styles.container}>
          <StepRectangle stepData={stepData} />
          {!!step.message && (
            <Animated.View
              style={[
                styles.banner,
                {
                  transform: [
                    {
                      translateY: bottomAnimated,
                    },
                  ],
                },
              ]}
            >
              {onClose && (
                <TouchableOpacity
                  accessibilityLabel={'step_skip_button'}
                  onPress={onClose}
                  style={styles.containerSkip}
                >
                  <Text style={styles.skipText}>{L.stepmodal_skip_text}</Text>
                </TouchableOpacity>
              )}
              <View style={styles.bannerInfo}>
                <View style={styles.containerAdnWomen}>
                  <Image
                    source={require('../../assets/images/tour-adn-women.png')}
                    resizeMode={'contain'}
                    resizeMethod={'auto'}
                    style={styles.adnWomen}
                  />
                  <View style={styles.containerMessage}>
                    {step.stepNumber === 4 && !hasLoans ? (
                      <Text style={styles.messageStep}>
                        {L.stepmodal_step4_1_message}
                      </Text>
                    ) : (
                      <Text style={styles.messageStep}>{step.message}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.containerOptions}>
                  <Text
                    style={styles.numerationText}
                  >{`${step.stepNumber}${L.stepmodal_of_text}${total}`}</Text>
                  <View style={styles.containerButtons}>
                    {onPrev && !step.hidePrev && (
                      <Button
                        small
                        title={L.stepmodal_back_text}
                        textStyle={styles.whiteTextButton}
                        style={styles.primaryButton}
                        onPress={onPrev}
                        {...(step.buttonPrevProps || {})}
                        accessibilityLabel={'step_back_button'}
                      />
                    )}
                    {onNext && (
                      <Button
                        small
                        title={L.stepmodal_next_text}
                        textStyle={styles.primaryTextButton}
                        style={styles.whiteButton}
                        onPress={onNext}
                        {...(step.buttonNextProps || {})}
                        accessibilityLabel={'step_next_button'}
                      />
                    )}
                  </View>
                </View>
                <Animated.View
                  style={[
                    styles.containerFlag,
                    {
                      transform: [
                        {
                          translateX: leftAnimated,
                        },
                      ],
                    },
                  ]}
                >
                  <Image
                    source={require('../../assets/images/tour-triangle.png')}
                    resizeMode={'stretch'}
                    style={styles.flag}
                  />
                </Animated.View>
              </View>
            </Animated.View>
          )}
        </View>
      </BaseModal>
    );
  }
}

export default StepModal;

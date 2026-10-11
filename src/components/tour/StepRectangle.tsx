import React from 'react';
import Svg, { Rect, Defs, ClipPath, Circle } from 'react-native-svg';
import { Platform, Animated, Dimensions } from 'react-native';
import Size from '../../resources/dimensions/Size';
import { TourStepData } from './TourManager';
import { Log } from '../../resources/log';

export interface PositionStep {
  cx: number;
  cy: number;
  r: number;
}
export interface StepRectangleProps {
  stepData: TourStepData;
}

export interface StepRectangleState {}

export interface StepRectangleState {
  counter: number;
  cx: Animated.Value;
  cy: Animated.Value;
  r: Animated.Value;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const ClipPathFallback = ClipPath as any;

const TAG = '[StepRectangle]';
class StepRectangle extends React.PureComponent<
  StepRectangleProps,
  StepRectangleState
> {
  static defaultProps = {};

  state: StepRectangleState = {
    counter: 0,
    cx: new Animated.Value(0),
    cy: new Animated.Value(Dimensions.get('screen').height),
    r: new Animated.Value(10),
  };

  circle!: typeof AnimatedCircle | null;
  animation!: Animated.CompositeAnimation;

  componentDidMount() {
    this.initialPosition();

    if (Platform.OS === 'android') {
      this.state.cx.addListener(() => {
        this.setState(state => ({
          counter: state.counter + 1,
        }));
      });
    }
  }

  initialPosition = () => {
    this.updateStep();
  };

  componentWillUnmount() {
    Log.debug(TAG, 'componentWillUnmount');
    this.state.cx.removeAllListeners();
    this.state.cy.removeAllListeners();
    this.state.r.removeAllListeners();
  }

  componentDidUpdate(prevProps: StepRectangleProps) {
    if (prevProps.stepData !== this.props.stepData) {
      this.updateStep();
    }
  }
  updateStep = () => {
    const { cx, cy, r } = this.positionStepRectangle();
    Log.debug(TAG, 'updateStep', { cx, cy, r });

    if (this.animation) {
      this.animation.stop();
    }
    const tension = 10;
    this.animation = Animated.parallel([
      Animated.spring(this.state.cx, {
        toValue: cx,
        friction: 9,
        tension,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.cy, {
        toValue: cy,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(this.state.r, {
        toValue: r,
        friction: 5,
        tension,
        useNativeDriver: false,
      }),
    ]);

    this.animation.start();
  };

  positionStepRectangle = () => {
    Log.debug(TAG, 'positionStepRectangle');
    const { stepData } = this.props;
    const { width, x } = stepData.layout;
    const { stepNumber } = stepData.step;
    let cx = 0;
    let cy = 0;
    let r = 0;
    switch (stepNumber) {
      case 1:
        cx = x + width * 0.2;
        cy =
          Platform.OS === 'android'
            ? Size.getScreenHeight() - Size.getHeight() <= 0
              ? Size.getScreenHeight() - width * 0.3
              : Size.getScreenHeight() -
                (Size.getScreenHeight() - Size.getHeight()) / 2
            : Platform.OS === 'ios' && Size.isiPhoneX()
            ? Size.getHeight() - Size.getBottomInsetHeight()
            : Size.getHeight();
        r = width + width * 0.1;
        return { cx, cy, r };
      case 2:
      case 3:
      case 4:
      default:
        cx = x + width * 0.5;
        cy =
          Platform.OS === 'android'
            ? Size.getScreenHeight() - Size.getHeight() <= 0
              ? Size.getScreenHeight() - width * 0.3
              : Size.getScreenHeight() -
                (Size.getScreenHeight() - Size.getHeight()) / 1.5
            : Platform.OS === 'ios' && Size.isiPhoneX()
            ? Size.getHeight() - Size.getBottomInsetHeight()
            : Size.getHeight();
        r = width * 0.9;
        return { cx, cy, r };
      case 5:
        cx = x + width * 0.8;
        cy =
          Platform.OS === 'android'
            ? Size.getScreenHeight() - Size.getHeight() <= 0
              ? Size.getScreenHeight() - width * 0.3
              : Size.getScreenHeight() -
                (Size.getScreenHeight() - Size.getHeight()) / 2
            : Platform.OS === 'ios' && Size.isiPhoneX()
            ? Size.getHeight() - Size.getBottomInsetHeight()
            : Size.getHeight();
        r = width + width * 0.1;
        return { cx, cy, r };
      case 6:
        cx = Size.getScreenWidth() - width / 2 + 10;
        cy =
          Platform.OS === 'ios' && Size.isiPhoneX()
            ? 70 + Size.getStatusBarHeight() + Size.getStatusBarHeight() * 0.4
            : 70 + Size.getStatusBarHeight() + Size.getStatusBarHeight() * 0.8;
        r = width / 1.7;
        return { cx, cy, r };
    }
  };

  render() {
    const { cx, cy, r, counter } = this.state;
    const { width, height } = Dimensions.get('screen');

    return (
      <Svg height={height} width={width}>
        <Defs>
          <ClipPathFallback
            key={'unique_' + counter}
            clipRule={'evenodd'}
            id="mask"
          >
            <Rect width={'100%'} height={'100%'} />
            <AnimatedCircle
              ref={(ref: any) => {
                this.circle = ref;
              }}
              cx={cx}
              cy={cy}
              r={r}
            />
          </ClipPathFallback>
        </Defs>
        <Rect
          width={'100%'}
          height={'100%'}
          fill="rgba(0,0,0,1)"
          opacity="0.5"
          clipPath="url(#mask)"
        />
      </Svg>
    );
  }
}

export default StepRectangle;

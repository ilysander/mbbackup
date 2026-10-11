import * as React from 'react';
import { LayoutRectangle } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Log } from '../../resources/log';
import { Emitter } from '../../resources/listeners';
import StepModal from './StepModal';
import { LoansItem } from '../../api/backend/response/Execute';
import { CommonActions, NavigationContainerRef } from '@react-navigation/native';

export interface TourManagerProps {
  accessibilityLabel: string;
  navigation: () => NavigationContainerRef<any> | null;
}

export interface TourButtonProps {
  title?: string;
}

export interface TourStep {
  message?: string;
  stepNumber: number;
  buttonPrevProps?: TourButtonProps;
  buttonNextProps?: TourButtonProps;
  hidePrev?: boolean;
  onStart?: (navigate: (routeName: string) => void) => void;
  onEnd?: (navigate: (routeName: string) => void) => void;
}
export interface TourStepData {
  layout: LayoutRectangle;
  step: TourStep;
}
export interface TourManagerStep {
  [index: number]: TourStepData;
}

export interface TourManagerState {
  running: boolean;
  stepNumber: number;
  steps: TourManagerStep;
  isHasLoans: boolean;
}

const TAG = '[TourManager]';
export default class TourManager extends React.PureComponent<
  TourManagerProps,
  TourManagerState
> {
  state: TourManagerState = {
    running: false,
    stepNumber: 1,
    steps: {},
    isHasLoans: false,
  };

  componentDidMount() {
    Emitter.on('onTourManagerStepLayout', this.onTourManagerStepLayout);
    Emitter.on('onTourManagerStart', this.start);
    Emitter.on('onTourManagerStop', this.stop);
    Emitter.on('onTourManagerVerifyLoans', this.hasLoans);
  }

  componentWillUnmount() {
    Emitter.off('onTourManagerStepLayout', this.onTourManagerStepLayout);
    Emitter.off('onTourManagerStart', this.start);
    Emitter.off('onTourManagerStop', this.stop);
    Emitter.off('onTourManagerVerifyLoans', this.hasLoans);
  }

  hasLoans = (loansLoaded: LoansItem[]) => {
    if (loansLoaded.length > 0) {
      this.setState({ isHasLoans: true });
      return;
    }
    this.setState({ isHasLoans: false });
  };

  onTourManagerStepLayout = (payload: TourStepData) => {
    const steps = { ...this.state.steps };
    steps[payload.step.stepNumber] = payload;

    this.setState({ steps });
  };

  firstTime = async () => {
    const key = 'second_time';
    let value;
    try {
      value = await AsyncStorage.getItem(key);
    } catch (e) {
      Log.info(TAG, 'secondTime', e);
    }

    if (!value) {
      AsyncStorage.setItem(key, 'true');
    }
    const output = value !== 'true';
    Log.debug(TAG, 'firstTime', output);
    Emitter.emit('onTourManagerEvent', output);
    return output;
  };

  start = async (force: boolean) => {
    if (!force) {
      if (!(await this.firstTime())) {
        Log.debug(TAG, 'skipped', 'not firstTime');
        return;
      }
    }

    Log.debug(TAG, 'start', force);
    this.setState({ running: true, stepNumber: 1 }, () => {
      const { stepNumber } = this.state;
      this.go(stepNumber);
    });
  };

  go = (stepNumber: number) => {
    Log.debug(TAG, 'go', stepNumber);
    const { steps } = this.state;
    if (stepNumber < 1 || !steps[stepNumber]) {
      this.stop();
      return;
    }
    const tempStep = steps[stepNumber];
    if (tempStep) {
      typeof tempStep.step.onStart === 'function' &&
        tempStep.step.onStart(this.navigate);
    }
    setTimeout(() => {
      this.setState({ stepNumber });
    }, 100);
  };
  stop = () => {
    Log.debug(TAG, 'stop');
    this.setState({ running: false });

    const stepData = this.getCurrent();
    if (stepData) {
      typeof stepData.step.onEnd === 'function' &&
        stepData.step.onEnd(this.navigate);
    }
    Emitter.emit('onTourManagerEvent', false);
  };
  skip = () => {
    Log.debug(TAG, 'skip');
    const firstStepNumber = 6;
    this.go(firstStepNumber);
    Emitter.emit('onTourManagerEvent', false);
  };
  onPrev = () => {
    Log.debug(TAG, 'onPrev');
    const stepData = this.getCurrent();
    if (stepData) {
      typeof stepData.step.onEnd === 'function' &&
        stepData.step.onEnd(this.navigate);
    }
    const { stepNumber } = this.state;
    const newNumber = stepNumber - 1;
    this.go(newNumber);
  };
  onNext = () => {
    Log.debug(TAG, 'onNext');
    const stepData = this.getCurrent();
    if (stepData) {
      typeof stepData.step.onEnd === 'function' &&
        stepData.step.onEnd(this.navigate);
    }
    const { stepNumber } = this.state;
    const newNumber = stepNumber + 1;
    this.go(newNumber);
  };

  navigate = (routeName: string) => {
    const navigateAction = CommonActions.navigate({ name: routeName });
    const navigation = this.props.navigation();
    navigation && navigation.dispatch(navigateAction);
  };

  getCurrent = () => {
    Log.debug(TAG, 'getCurrent');
    const { stepNumber, steps } = this.state;
    return steps[stepNumber];
  };
  render() {
    const { running, stepNumber, steps, isHasLoans } = this.state;
    if (!running) {
      return null;
    }

    const stepData = steps[stepNumber];
    if (!stepData) {
      return null;
    }
    Log.debug(TAG, 'render', 'stepNumber', stepNumber);

    const total = Object.keys(steps).length - 1;
    return (
      <>
        <StepModal
          visible
          stepData={stepData}
          total={total}
          hasLoans={isHasLoans}
          onClose={this.skip}
          onPrev={this.onPrev}
          onNext={this.onNext}
        />
      </>
    );
  }
}

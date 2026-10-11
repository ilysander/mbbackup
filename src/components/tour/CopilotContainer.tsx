import * as PropTypes from 'prop-types';
import * as React from 'react';
import { View } from 'react-native';
import CopilotModal from './CopilotModal';

const Mitt = require('mitt');

export interface CopilotProps {
  currentStep: boolean;
  visible: boolean;
  start: () => void;
  stop: () => void;
}

const getFirstStep = (steps: any[]) =>
  Object.values(steps).reduce(
    (a, b) => (!a || a.order > b.order ? b : a),
    undefined
  );

const getLastStep = (steps: any[]) =>
  Object.values(steps).reduce(
    (a, b) => (!a || a.order < b.order ? b : a),
    undefined
  );

const getStepNumber = (steps: any[], step: any) =>
  step &&
  Object.values(steps).filter(_step => _step.order <= step.order).length;

const MAX_START_TRIES = 120;
const OFFSET_WIDTH = -10;

export const withCopilot = ({
  overlay,
  tooltipComponent,
  stepNumberComponent,
  animated,
  androidStatusBarVisible,
}: any = {}): any => (WrappedComponent: any) => {
  return class Copilot extends React.Component<any, any> {
    static childContextTypes = {
      _copilot: PropTypes.object.isRequired,
    };
    state: any = {
      steps: {},
      currentStep: undefined,
      visible: false,
    };
    startTries = 0;
    isReallyMounted = false;
    eventEmitter = Mitt();
    modal!: any;
    screen!: any;

    getChildContext() {
      return {
        _copilot: {
          registerStep: this.registerStep,
          unregisterStep: this.unregisterStep,
          getCurrentStep: () => this.state.currentStep,
        },
      };
    }

    componentDidMount() {
      this.isReallyMounted = true;
    }

    getScreenRef = () => {
      return this.screen.getScreenRef();
    };

    componentWillUnmount() {
      this.isReallyMounted = false;
    }

    getStepNumber = (step = this.state.currentStep) =>
      getStepNumber(this.state.steps, step);

    getFirstStep = () => getFirstStep(this.state.steps);

    getLastStep = () => getLastStep(this.state.steps);

    setCurrentStep = async (step: any, move = true) => {
      this.setState({ currentStep: step });
      this.eventEmitter.emit('stepChange', step);

      if (move) {
        this.moveToCurrentStep();
      }
    };

    setVisibility = (visible: boolean) =>
      new Promise<void>(resolve => {
        this.setState({ visible }, () => resolve());
      });

    isFirstStep = () => this.state.currentStep === this.getFirstStep();

    isLastStep = () => this.state.currentStep === this.getLastStep();

    registerStep = (step: any) => {
      this.setState(({ steps }: any) => ({
        steps: {
          ...steps,
          [step.name]: step,
        },
      }));
    };

    unregisterStep = (stepName: string) => {
      if (!this.isReallyMounted) {
        return;
      }
      this.setState(({ steps }: any) => ({
        steps: Object.entries(steps)
          .filter(([key]) => key !== stepName)
          .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {}),
      }));
    };

    start = async (fromStep: any) => {
      const { steps } = this.state;

      const currentStep = fromStep ? steps[fromStep] : this.getFirstStep();

      if (this.startTries > MAX_START_TRIES) {
        this.startTries = 0;
        return;
      }

      if (!currentStep) {
        this.startTries += 1;
        requestAnimationFrame(() => this.start(fromStep));
      } else {
        this.eventEmitter.emit('start');
        await this.setCurrentStep(currentStep);
        await this.moveToCurrentStep();
        await this.setVisibility(true);
        this.startTries = 0;
      }
    };

    stop = async () => {
      await this.setVisibility(false);
      this.eventEmitter.emit('stop');
    };

    async moveToCurrentStep() {
      const size = await this.state.currentStep.target.measure();

      await this.modal.animateMove({
        width: size.width + OFFSET_WIDTH,
        height: size.height + OFFSET_WIDTH,
        left: size.x - OFFSET_WIDTH / 2,
        top: size.y - OFFSET_WIDTH / 2,
      });
    }

    render() {
      return (
        <View style={{ flex: 1 }}>
          <WrappedComponent
            {...this.props}
            start={this.start}
            stop={this.stop}
            currentStep={this.state.currentStep}
            visible={this.state.visible}
            copilotEvents={this.eventEmitter}
            ref={(ref: any | null) => {
              this.screen = ref;
            }}
          />
          <CopilotModal
            {...this.props}
            stop={this.stop}
            visible={this.state.visible}
            currentStepNumber={this.getStepNumber()}
            currentStep={this.state.currentStep}
            stepNumberComponent={stepNumberComponent}
            tooltipComponent={tooltipComponent}
            overlay={overlay}
            animated={animated}
            androidStatusBarVisible={androidStatusBarVisible}
            ref={modal => {
              this.modal = modal;
            }}
          />
        </View>
      );
    }
  };
};

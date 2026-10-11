import * as PropTypes from 'prop-types';
import * as React from 'react';
import {View} from 'react-native';
import {Log} from '../../resources/log';
import ConnectedCopilotStep from './ConnectedCopilotStep';

const TAG = '[CopilotStep]';
export interface CopilotStepContext {
  _copilot?: any;
}

// @ts-ignore
class CopilotStep extends React.Component<any, any> {
  static contextTypes = {
    _copilot: PropTypes.object,
  };

  render() {
    if (!this.context) {
      Log.warn(TAG, 'render', 'contex empty');
      return <View {...this.props} />;
    }

    const contextAux: any = this.context;

    const currentStep = contextAux._copilot.getCurrentStep();

    return React.createElement(ConnectedCopilotStep, {
      ...this.props,
      _copilot: contextAux._copilot,
      visible: currentStep && currentStep.name === this.props.name,
    });
  }
}

export default CopilotStep as any;

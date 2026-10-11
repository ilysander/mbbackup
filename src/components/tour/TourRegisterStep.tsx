import * as React from 'react';
import { View, LayoutChangeEvent, ViewProps } from 'react-native';
import { TourStepData, TourStep } from './TourManager';
import { Emitter } from '../../resources/listeners';

export interface TourRegisterStepProps extends ViewProps {
  accessibilityLabel: string;
  step: TourStep;
}

export interface TourRegisterStepState {}

export default class TourRegisterStep extends React.PureComponent<
  TourRegisterStepProps,
  TourRegisterStepState
> {
  state: TourRegisterStepState = {};

  onLayout = (event: LayoutChangeEvent) => {
    const { onLayout, step } = this.props;
    typeof onLayout === 'function' && onLayout(event);

    const layout = event.nativeEvent.layout;
    const payload: TourStepData = { step, layout };
    Emitter.emit('onTourManagerStepLayout', payload);
  };

  render() {
    const { onLayout, step, ...props } = this.props;
    return <View {...props} onLayout={this.onLayout} />;
  }
}

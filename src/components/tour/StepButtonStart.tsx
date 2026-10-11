import * as React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Emitter } from '../../resources/listeners';
import TourRegisterStep from './TourRegisterStep';
import { TourStep } from './TourManager';

export interface StepButtonStartProps {
  style?: ViewStyle[] | ViewStyle;
  navigation?: any
}

export interface StepButtonStartState { }

export interface StepButtonStartState { }

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: -8,
  } as ViewStyle,
  image: {
    width: 97,
    height: 56,
  } as ImageStyle,
});

class StepButtonStart extends React.PureComponent<
  StepButtonStartProps,
  StepButtonStartState
> {
  static defaultProps = {};

  state: StepButtonStartState = {};

  start = () => {
    Emitter.emit('onTourManagerStart', true);
  };

  render() {
    const { style, navigation } = this.props;
    const step: TourStep = {
      stepNumber: 6,
      onStart: (navigate: (routeName: string, navigation: any) => void) => {
        navigate('Queries', navigation);

        setTimeout(() => {
          Emitter.emit('onTourManagerStop', true);
        }, 1500);
      },
    };
    return (
      <TouchableOpacity onPress={this.start} style={[styles.container, style]}>
        <TourRegisterStep accessibilityLabel={'start_tour'} step={step}>
          <Image
            source={require('../../assets/images/tour-button-start.png')}
            resizeMode={'cover'}
            style={styles.image}
            resizeMethod={'auto'}
          />
        </TourRegisterStep>
      </TouchableOpacity>
    );
  }
}

export default StepButtonStart;

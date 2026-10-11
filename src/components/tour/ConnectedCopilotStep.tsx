import * as React from 'react';
import { InteractionManager } from 'react-native';

class ConnectedCopilotStep extends React.Component<any, any> {
  wrapper!: any;

  componentDidMount() {
    this.props._copilot.registerStep({
      name: this.props.name,
      order: this.props.order,
      target: this,
      wrapper: this.wrapper,
    });
  }

  componentWillUnmount() {
    this.props._copilot.unregisterStep(this.props.name);
  }

  setNativeProps(obj: any) {
    this.wrapper.setNativeProps(obj);
  }

  measure() {
    if (typeof __TEST__ !== 'undefined' && __TEST__) {
      return new Promise(resolve =>
        resolve({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        })
      );
    }

    return new Promise((resolve, reject) => {
      const measure = () => {
        // Wait until the wrapper element appears
        if (this.wrapper.measure) {
          InteractionManager.runAfterInteractions(() => {
            this.wrapper.measure(
              // @ts-ignore
              (ox, oy, width, height, x, y) => resolve({ x, y, width, height }),
              reject
            );
          });
        } else {
          requestAnimationFrame(measure);
        }
      };

      requestAnimationFrame(measure);
    });
  }

  render() {
    const copilot: any = {
      ref: (wrapper: any) => {
        this.wrapper = wrapper;
      },
      onLayout: () => {
        return true;
      },
    };

    // @ts-ignore
    return React.cloneElement(this.props.children, { copilot });
  }
}

export default ConnectedCopilotStep;

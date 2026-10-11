import * as React from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {
  A,
  AnalyticsEvent,
  AnalyticsLabelsType,
} from '../../resources/analytics';
import { Log } from '../../resources/log';

const TAG = '[Touchable]';

type TouchableOpacitySingleProps = Exclude<
  TouchableOpacityProps,
  'accessibilityLabel'
>;

export interface TouchableProps extends TouchableOpacitySingleProps {
  forwardedRef?: any;
  children?: React.ReactNode[] | React.ReactChild;
  /**
   * es obligatorio que `accessibilityLabel` este agregado en `AnalyticsLabels`
   */
  accessibilityLabel: AnalyticsLabelsType;
  analyticsParams?: unknown;
  param?: string;
}

export interface TouchableState { }

export class TouchableContainer extends React.Component<
  TouchableProps,
  TouchableState
> {
  onPress = (event: GestureResponderEvent) => {
    const { onPress, accessibilityLabel, analyticsParams } = this.props;

    if (accessibilityLabel === 'signinscreen_buttonsecondary_signup') {
      const className = 'modal_overlay';
      AnalyticsEvent.trackScreen(className);
    }

    if (typeof onPress === 'function') {
      onPress(event);
    }
    const label = A[accessibilityLabel];
    if (__DEV__ && !label) {
      Log.info(
        TAG,
        'onPress',
        'missing AnalyticsEvent for',
        accessibilityLabel
      );
      return;
    }
    let params;
    if (typeof analyticsParams === 'function') {
      params = analyticsParams();
      AnalyticsEvent.track(label, params);
    } else if (typeof analyticsParams === 'string') {
      // usa analyticsParams como una string
      AnalyticsEvent.track(label, params);
      AnalyticsEvent.track(label, analyticsParams);
    } else {
      AnalyticsEvent.track(label, params);
    }

  };
  onLongPress = (event: GestureResponderEvent) => {
    const { onLongPress, accessibilityLabel, analyticsParams } = this.props;
    if (typeof onLongPress === 'function') {
      onLongPress(event);
    }
    const label = A[accessibilityLabel];
    if (!label) {
      __DEV__ &&
        Log.info(
          TAG,
          'onPress',
          'missing AnalyticsEvent for',
          accessibilityLabel
        );
      return;
    }
    let params;
    if (typeof analyticsParams === 'function') {
      params = analyticsParams();
      AnalyticsEvent.track(label, params);
    } else if (typeof analyticsParams === 'string') {
      // usa analyticsParams como una string
      AnalyticsEvent.track(label, params);
      AnalyticsEvent.track(label, analyticsParams);
    } else {
      AnalyticsEvent.track(label, params);
    }
  };

  render() {
    const {
      forwardedRef,
      onPress,
      onLongPress,
      accessibilityLabel,
      ...props
    } = this.props;
    const hasAction =
      typeof onPress === 'function' || typeof onLongPress === 'function';
    if (!hasAction) {
      return (
        <View
          ref={forwardedRef}
          accessibilityLabel={accessibilityLabel || 'touchable'}
          {...props}
        />
      );
    }
    return (
      <TouchableOpacity
        ref={forwardedRef}
        accessibilityLabel={accessibilityLabel || 'touchable'}
        {...props}
        onPress={onPress ? this.onPress : undefined}
        onLongPress={onLongPress ? this.onLongPress : undefined}
      />
    );
  }
}

const Touchable = React.forwardRef<TouchableOpacity, TouchableProps>(
  (props, ref) => {
    return <TouchableContainer {...props} forwardedRef={ref} />;
  }
);
export default Touchable;

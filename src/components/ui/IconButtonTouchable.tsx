import * as React from 'react';
import {
  GestureResponderEvent,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
} from 'react-native';
import {
  A,
  AnalyticsEvent,
  AnalyticsLabelsType,
} from '../../resources/analytics';
import { Log } from '../../resources/log';
import { AnalyticsTrackParams } from '../../resources/analytics/AnalyticsEvent';

const TAG = '[IconButtonTouchable]';

type TouchableHighlightSingleProps = Exclude<
  TouchableHighlightProps,
  'accessibilityLabel'
>;

export interface TouchableProps extends TouchableHighlightSingleProps {
  forwardedRef?: any;
  children?: React.ReactNode[] | React.ReactChild;
  /**
   * es obligatorio que `accessibilityLabel` este agregado en `AnalyticsLabels`
   */
  accessibilityLabel: AnalyticsLabelsType;
  analyticsParams?: () => AnalyticsTrackParams;
}

export interface TouchableState {}

export class TouchableContainer extends React.Component<
  TouchableProps,
  TouchableState
> {
  onPress = (event: GestureResponderEvent) => {
    const { onPress, accessibilityLabel, analyticsParams } = this.props;
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
    }
    AnalyticsEvent.track(label, params);
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
    }
    AnalyticsEvent.track(label, params);
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
      <TouchableHighlight
        ref={forwardedRef}
        accessibilityLabel={accessibilityLabel || 'touchable'}
        {...props}
        onPress={onPress ? this.onPress : undefined}
        onLongPress={onLongPress ? this.onLongPress : undefined}
      />
    );
  }
}

const IconButtonTouchable = React.forwardRef<
  TouchableHighlight,
  TouchableProps
>((props, ref) => {
  return <TouchableContainer {...props} forwardedRef={ref} />;
});
export default IconButtonTouchable;

import * as React from 'react';
import {
  ImageStyle,
  StyleSheet,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Image,
  Animated,
} from 'react-native';
import { AnalyticsLabelsType } from '../../resources/analytics';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Touchable } from '../ui';

const styles = StyleSheet.create({
  moreIcon: {
    height: 6,
    width: 10,
    tintColor: Colors.grey5,
  } as ImageStyle,
  toggleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  toggleContainer: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  toggle: {
    ...Font({ weight: 'SemiBold' }),
    paddingRight: 6,
    fontSize: 13,
    lineHeight: 15,
    color: Colors.grey5,
  } as TextStyle,
});

export interface ExpandableViewProps extends ViewProps {
  accessibilityLabel: AnalyticsLabelsType;
  maxHeight: number;
  toggleContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  labelLess?: string;
  labelMore?: string;
  position?: 'top' | 'bottom';
  onToggle?: (expanded: boolean) => void;
}

export interface ExpandableViewState {
  expanded: boolean;
  heightPanel: Animated.Value;
}

export default class ExpandableView extends React.Component<
  ExpandableViewProps,
  ExpandableViewState
> {
  static defaultProps = {
    maxHeight: 130,
    position: 'bottom',
  };
  state: ExpandableViewState = {
    expanded: false,
    heightPanel: new Animated.Value(0),
  };
  animation!: Animated.CompositeAnimation;

  componentDidUpdate(prevProps: ExpandableViewProps) {
    if (prevProps.maxHeight !== this.props.maxHeight) {
      const { heightPanel, expanded } = this.state;
      this.animation && this.animation.stop();
      this.animation = Animated.spring(heightPanel, {
        toValue: expanded ? this.props.maxHeight : 0,
        friction: 10,
        useNativeDriver: false,
      });
      this.animation.start();
    }
  }

  toggleExpandButton = () => {
    let { expanded } = this.state;
    const { heightPanel } = this.state;
    const { maxHeight } = this.props;
    expanded = !expanded;
    this.setState({ expanded });
    const { onToggle } = this.props;
    typeof onToggle === 'function' && onToggle(expanded);

    this.animation && this.animation.stop();
    this.animation = Animated.spring(heightPanel, {
      toValue: expanded ? maxHeight : 0,
      friction: 10,
      useNativeDriver: false,
    });
    this.animation.start();
  };
  renderMoreIcon = () => {
    const { heightPanel } = this.state;
    const { maxHeight } = this.props;
    const rotate = heightPanel.interpolate({
      inputRange: [0, maxHeight],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Image
          accessibilityLabel={'accountselector_more_icon'}
          style={styles.moreIcon}
          source={require('../../assets/images/see-more-arrow.png')}
        />
      </Animated.View>
    );
  };

  render() {
    const { expanded, heightPanel } = this.state;
    const {
      children,
      style,
      toggleContainerStyle,
      labelLess,
      labelMore,
      position,
      labelStyle,
      accessibilityLabel,
    } = this.props;

    return (
      <View accessibilityLabel={'expandableview'} style={style}>
        {position === 'bottom' && (
          <Animated.View
            style={{
              minHeight: heightPanel,
            }}
          >
            {expanded && children}
          </Animated.View>
        )}

        <View style={styles.toggleContent}>
          <Touchable
            accessibilityLabel={accessibilityLabel}
            analyticsParams={expanded
              ? labelLess || L.expandableview_buttonlink_toggle_see_less
              : labelMore || L.expandableview_buttonlink_toggle_see_more}
            style={[styles.toggleContainer, toggleContainerStyle]}
            onPress={this.toggleExpandButton}
          >
            <Text
              accessibilityLabel={
                'expandableview_buttonlink_text_toggle_detail'
              }
              style={[styles.toggle, labelStyle]}
            >
              {expanded
                ? labelLess || L.expandableview_buttonlink_toggle_see_less
                : labelMore || L.expandableview_buttonlink_toggle_see_more}
            </Text>
            {this.renderMoreIcon()}
          </Touchable>
        </View>
        {position === 'top' && (
          <Animated.View
            style={{
              height: heightPanel,
            }}
          >
            {expanded && children}
          </Animated.View>
        )}
      </View>
    );
  }
}

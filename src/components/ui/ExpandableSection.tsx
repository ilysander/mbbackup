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
import {updateEventSubseccion} from '../../resources/analytics/AnalyticsEvent';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable from '../ui/Touchable';

const styles = StyleSheet.create({
  moreIcon: {
    height: 6,
    width: 10,
    tintColor: Colors.grey5,
  } as ImageStyle,
  toggleContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  toggle: {
    ...Font({weight: 'SemiBold'}),
    paddingRight: 6,
    fontSize: 13,
    lineHeight: 15,
    color: Colors.grey5,
  } as TextStyle,
});

export interface ExpandableSectionProps extends ViewProps {
  accessibilityLabel: string;
  maxHeight: number;
  toggleContainerStyle?: StyleProp<ViewStyle>;
  labelLess?: string;
  labelMore?: string;
  position?: 'top' | 'bottom';
  onToggle?: (expanded: boolean) => void;
  title?: string;
}

export interface ExpandableSectionState {
  expanded: boolean;
  heightPanel: Animated.Value;
}

export default class ExpandableSection extends React.Component<
  ExpandableSectionProps,
  ExpandableSectionState
> {
  static defaultProps = {
    maxHeight: 130,
    position: 'bottom',
  };
  state: ExpandableSectionState = {
    expanded: false,
    heightPanel: new Animated.Value(0),
  };
  animation!: Animated.CompositeAnimation;

  componentDidUpdate(prevProps: ExpandableSectionProps) {
    if (prevProps.maxHeight !== this.props.maxHeight) {
      const {heightPanel, expanded} = this.state;
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
    const {title} = this.props;
    updateEventSubseccion('exview_show_hide_detail', title);
    let {expanded} = this.state;
    const {heightPanel} = this.state;
    const {maxHeight} = this.props;
    expanded = !expanded;
    this.setState({expanded});
    const {onToggle} = this.props;
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
    const {heightPanel} = this.state;
    const {maxHeight} = this.props;
    const rotate = heightPanel.interpolate({
      inputRange: [0, maxHeight],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <Animated.View style={{transform: [{rotate}]}}>
        <Image
          accessibilityLabel={'accountselector_more_icon'}
          style={styles.moreIcon}
          source={require('../../assets/images/see-more-arrow.png')}
        />
      </Animated.View>
    );
  };

  render() {
    const {expanded, heightPanel} = this.state;
    const {children, style, toggleContainerStyle, position, title} = this.props;

    return (
      <View accessibilityLabel={'expandableSection'} style={style}>
        <View>
          <Touchable
            accessibilityLabel={'expandableview_buttonlink_toggle_detail'}
            analyticsParams={title}
            style={[styles.toggleContainer, toggleContainerStyle]}
            onPress={this.toggleExpandButton}>
            <Text
              accessibilityLabel={
                'expandableSection_buttonlink_text_toggle_detail'
              }
              style={styles.toggle}>
              {title}
            </Text>
            {this.renderMoreIcon()}
          </Touchable>
        </View>

        {position === 'bottom' && (
          <Animated.View
            style={{
              minHeight: heightPanel,
            }}>
            {expanded && children}
          </Animated.View>
        )}
        {position === 'top' && (
          <Animated.View
            style={{
              height: heightPanel,
            }}>
            {expanded && children}
          </Animated.View>
        )}
      </View>
    );
  }
}

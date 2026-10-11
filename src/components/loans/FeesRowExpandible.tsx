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
    alignItems: 'stretch',
  } as ViewStyle,
  toggleContainer: {
    paddingVertical: 10,
    alignItems: 'stretch',
    flexDirection: 'row',
    alignContent: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
  } as ViewStyle,
  toggle: {
    ...Font({ weight: 'SemiBold' }),
    paddingRight: 6,
    fontSize: 13,
    lineHeight: 15,
    color: Colors.grey5,
  } as TextStyle,
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  } as ViewStyle,
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: Colors.grey3,
  } as ImageStyle,
  iconActive: {
    tintColor: Colors.primaryLight,
  } as ImageStyle,
  infoContainer: {
    flex: 2,
  } as ViewStyle,
  feeText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    lineHeight: 16,
    color: Colors.grey5,
  } as TextStyle,
  amountText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    paddingRight: 4,
    color: Colors.primaryLight,
  } as TextStyle,
  toggleButton: {
    flexDirection: 'row',
    width: 35,
  },
  toggleText: {
    justifyContent: 'center',
  },
  toggleExpand: {
    flexGrow: 1,
  },
  toggleExpandText: {
    flexDirection: 'row',
  },
  toggleExpandButton: {
    width: 10,
    justifyContent: 'center',
  },
  detailsContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  rateText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey5,
  } as TextStyle,
  dueDateText: {
    ...Font(),
    fontSize: 14,
    lineHeight: 16,
    color: Colors.grey5,
  } as TextStyle,
});

export interface ExpandableViewProps extends ViewProps {
  accessibilityLabel: string;
  onPress: () => void;
  selected?: boolean;
  maxHeight: number;
  toggleContainerStyle?: StyleProp<ViewStyle>;
  labelLess?: string;
  labelMore?: string;
  title: string;
  mount: string;
  position?: 'top' | 'bottom';
}

export interface ExpandableViewState {
  expanded: boolean;
  heightPanel: Animated.Value;
}

export default class FeesRowExplandible extends React.Component<
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

  toggleExpandButton = () => {
    let { expanded } = this.state;
    const { heightPanel } = this.state;
    const { maxHeight } = this.props;
    expanded = !expanded;
    this.setState({ expanded });
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
      title,
      mount,
      position,
      selected,
      onPress,
    } = this.props;

    return (
      <View accessibilityLabel={'feesrowexpandableview'} style={style}>
        {position === 'bottom' && (
          <Animated.View
            style={{
              height: heightPanel,
            }}
          >
            {expanded && children}
          </Animated.View>
        )}

        <View style={styles.toggleContent}>
          <View style={[styles.toggleContainer]}>
            <Touchable
              accessibilityLabel={
                'feesrowsexpandableview_buttonlink_toggle_detail'
              }
              style={styles.toggleButton}
              onPress={onPress}
            >
              <View style={styles.toggleText}>
                {selected && (
                  <Image
                    accessibilityLabel={'feesrowexpandible_checkbox_active'}
                    style={[styles.icon, styles.iconActive]}
                    resizeMode={'contain'}
                    source={require('../../assets/images/item-checked-icon.png')}
                  />
                )}
                {!selected && (
                  <Image
                    accessibilityLabel={'feesrowexpandible_checkbox_active'}
                    style={styles.icon}
                    resizeMode={'contain'}
                    source={require('../../assets/images/radio-button-unselected.png')}
                  />
                )}
              </View>
            </Touchable>
            <Touchable
              accessibilityLabel={
                'feesrowsexpandableview_buttonlink_toggle_detail'
              }
              onPress={this.toggleExpandButton}
              style={styles.toggleExpand}
            >
              <View>
                <Text style={styles.rateText}>
                  {L.instantcashshortstartscreen_feesrow_prefix}
                </Text>
                <Text
                  style={styles.feeText}
                  accessibilityLabel={'feesrowexpandible_quota_text'}
                >
                  {title}
                </Text>
                <View style={styles.toggleExpandText}>
                  <Text style={styles.amountText}>{mount}</Text>
                  <Text
                    style={styles.rateText}
                    accessibilityLabel={'feesrowexpandible_rate_text'}
                  >
                    {L.feesrowexpandible_due_tex}
                  </Text>
                </View>
              </View>
            </Touchable>
            <Touchable
              accessibilityLabel={
                'feesrowsexpandableview_buttonlink_toggle_detail'
              }
              onPress={this.toggleExpandButton}
              style={styles.toggleExpandButton}
            >
              {this.renderMoreIcon()}
            </Touchable>
          </View>
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

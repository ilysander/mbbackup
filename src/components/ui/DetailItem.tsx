import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ImageStyle,
  View,
  ViewProps,
  ViewStyle,
  Image,
  Dimensions,
  LayoutRectangle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable from '../ui/Touchable';

const TOOLTIP_WIDTH = 190;

const styles = StyleSheet.create({
  label: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  text: {
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
  } as TextStyle,
  icon: {
    width: 14,
    height: 14,
    marginRight: 10,
    marginLeft: 4,
    tintColor: Colors.grey3,
  } as ImageStyle,
  iconActive: {
    tintColor: Colors.secondary,
  } as ImageStyle,
  detailContainer: {
    flexDirection: 'row',
  } as TextStyle,
  tooltipContainer: {
    position: 'absolute',
    top: 20,
    right: 4,
    justifyContent: 'center',
  } as TextStyle,
  tooltipArrow: {
    width: 25,
    height: 25,
    borderBottomLeftRadius: 5,
    backgroundColor: Colors.secondary,
    transform: [{ rotate: '45deg' }],
  } as TextStyle,
  tooltipBox: {
    position: 'absolute',
    top: 10,
    left: -73,
    width: TOOLTIP_WIDTH,
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 10,
  } as ViewStyle,
  tooltipText: {
    color: Colors.white,
  } as TextStyle,
  tooltipLeft: {
    left: -20,
  } as ViewStyle,
  tooltipRight: {
    left: 45 - TOOLTIP_WIDTH,
  } as ViewStyle,
});

export interface DetailItemProps extends ViewProps {
  label?: string;
  text?: string;
  tooltipText?: string;
  style?: StyleProp<ViewStyle>;
  styleLabel?: StyleProp<TextStyle>;
  styleText?: StyleProp<TextStyle>;
}

export interface DetailItemState {}

export default class DetailItem extends React.Component<
  DetailItemProps,
  DetailItemState
> {
  state = {
    tooltipVisible: false,
    alignLeft: false,
    alignRight: false,
  };
  showTooltip() {
    this.setState({ tooltipVisible: !this.state.tooltipVisible });
  }
  find_dimesions(layout: LayoutRectangle) {
    const windowWidth = Dimensions.get('window').width;
    if (layout.width < TOOLTIP_WIDTH / 2) {
      this.setState({ alignLeft: true, alignRight: false });
    } else if (layout.width + TOOLTIP_WIDTH > windowWidth) {
      this.setState({ alignLeft: false, alignRight: true });
    } else {
      this.setState({ alignLeft: false, alignRight: false });
    }
  }
  render() {
    const {
      label,
      text,
      styleLabel,
      styleText,
      accessibilityLabel,
      children,
      tooltipText,
      ...props
    } = this.props;
    const { tooltipVisible, alignLeft, alignRight } = this.state;
    return (
      <View {...props}>
        {label && (
          <View
            style={styles.detailContainer}
            onLayout={event => {
              this.find_dimesions(event.nativeEvent.layout);
            }}
          >
            <Text
              style={[styles.label, styleLabel]}
              accessibilityLabel={accessibilityLabel}
            >
              {label}
            </Text>
            {tooltipText && (
              <Touchable
                accessibilityLabel="alert_actionbutton"
                onPress={() => this.showTooltip()}
              >
                <Image
                  accessibilityLabel={'help_icon'}
                  style={[styles.icon, styles.iconActive]}
                  resizeMode={'contain'}
                  source={require('../../assets/images/help-icon.png')}
                />
              </Touchable>
            )}
            {tooltipText && tooltipVisible && (
              <View style={styles.tooltipContainer}>
                <View style={styles.tooltipArrow}></View>
                <View
                  style={[
                    styles.tooltipBox,
                    alignLeft
                      ? styles.tooltipLeft
                      : alignRight
                      ? styles.tooltipRight
                      : {},
                  ]}
                >
                  <Text style={styles.tooltipText}>{tooltipText}</Text>
                </View>
              </View>
            )}
          </View>
        )}
        {typeof text === 'string' && (
          <Text style={[styles.text, styleText]}>{text}</Text>
        )}
        {children}
      </View>
    );
  }
}

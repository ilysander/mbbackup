import * as React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, Text } from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import ProgressBar, { ProgressBarProps } from './ProgressBar';
import Size from '../../resources/dimensions/Size';

const styles = StyleSheet.create({
  detailsbox: {
    width: Size.getVisibleWidth() - 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 4,
  } as ViewStyle,
  feeDescriptionText: {
    ...Font(),
    fontSize: 13,
    color: Colors.white,
    lineHeight: 14,
  } as TextStyle,
  feeDescription: {
    ...Font({ weight: 'Black' }),
    fontSize: 14,
    color: Colors.white,
    lineHeight: 15,
  } as TextStyle,
  progressBarLeftDescription: {
    flexDirection: 'column',
  } as ViewStyle,
  progressBarRightDescription: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  } as ViewStyle,
});

export interface ProgressInfoProps extends ProgressBarProps {
  leftLabel?: string;
  leftValue?: string;
  rightLabel?: string;
  rightValue?: string;
  accessibilityLabel: string;
  children?: undefined;
}

export interface ProgressInfoState {}

export default class ProgressInfo extends React.Component<
  ProgressInfoProps,
  ProgressInfoState
> {
  render() {
    const {
      leftLabel,
      leftValue,
      rightLabel,
      rightValue,
      ...props
    } = this.props;
    return (
      <ProgressBar {...props}>
        <View style={styles.detailsbox}>
          <View style={styles.progressBarLeftDescription}>
            <Text style={styles.feeDescription}>{leftValue}</Text>
            <Text style={styles.feeDescriptionText}>{leftLabel}</Text>
          </View>
          <View style={styles.progressBarRightDescription}>
            <Text style={styles.feeDescription}>{rightValue}</Text>
            <Text style={styles.feeDescriptionText}>{rightLabel}</Text>
          </View>
        </View>
      </ProgressBar>
    );
  }
}

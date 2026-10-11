import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Image,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';
import Font from '../../resources/functions/Font';
import Colors from '../../resources/constants/Colors';
const styles = StyleSheet.create({
  commissionLabel: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 18,
  } as TextStyle,
  comissionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  } as ViewStyle,
  image: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.shine,
  } as ImageStyle,
});
export interface CommissionLabelProps extends ViewProps {
  text: string;
  imageSourceLeft: ImageSourcePropType;
  imageSourceRight: ImageSourcePropType;
  accessibilityLabel: string;
}

export interface CommissionLabelState {}
export default class CommissionLabel extends React.PureComponent<
  CommissionLabelProps,
  CommissionLabelState
> {
  render() {
    const {
      text,
      imageSourceLeft,
      imageSourceRight,
      accessibilityLabel,
    } = this.props;
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        style={styles.comissionContainer}
      >
        <Image style={styles.image} source={imageSourceLeft} />
        <Text style={styles.commissionLabel}>{text}</Text>
        <Image style={styles.image} source={imageSourceRight} />
      </View>
    );
  }
}

import * as React from 'react';
import {
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Image,
  ImageStyle,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';

import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';

export interface ItemLoaninfoProps extends ViewProps {
  text?: string;
  textComponent?: React.ReactNode[] | React.ReactNode;
  imageSource: ImageSourcePropType;
  imageStyle?: ImageStyle;
}

export interface ItemLoaninfoState {}

const styles = StyleSheet.create({
  itemLoanContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  imageLoanContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    width: 50,
    height: 50,
    backgroundColor: Colors.greyB,
  } as TextStyle,
  loanPanelImage: {
    width: 21,
    height: 21,
    alignItems: 'center',
    resizeMode: 'contain',
    justifyContent: 'center',
    tintColor: Colors.grey5,
  } as ImageStyle,
  loanPanelText: {
    flex: 4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  } as TextStyle,
  loanText: {
    fontSize: 14,
    color: Colors.grey6,
    textAlign: 'left',
    ...Font({ weight: 'Regular' }),
  } as TextStyle,
});

export default class ItemLoaninfo extends React.PureComponent<
  ItemLoaninfoProps,
  ItemLoaninfoState
> {
  render() {
    const { text, textComponent, imageSource, imageStyle } = this.props;
    return (
      <View style={styles.itemLoanContainer}>
        <View style={styles.imageLoanContainer}>
          <Image
            resizeMode={'cover'}
            style={[styles.loanPanelImage, imageStyle]}
            source={imageSource}
          />
        </View>
        <View style={styles.loanPanelText}>
          {text && <Text style={styles.loanText}>{text}</Text>}
          {textComponent}
        </View>
      </View>
    );
  }
}

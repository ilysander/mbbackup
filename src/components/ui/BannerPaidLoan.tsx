import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  Image,
  ViewProps,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Font } from '../../resources/functions';
import { Colors } from '../../resources/constants';
import { L } from '../../resources/language';
import CardView from './CardView';

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: Colors.primaryLight,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 25,
  } as ViewStyle,
  cardManCelebrate: {
    flex: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  cardTextCelebrate: {
    flex: 10,
  } as ViewStyle,
  strongTextCardView: {
    color: Colors.white,
    ...Font({ weight: 'Bold' }),
    fontSize: 13,
  } as TextStyle,
  regularTextCardView: {
    color: Colors.white,
    ...Font({ weight: 'Medium' }),
    fontSize: 13,
  } as TextStyle,
  imageManCelebrating: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  } as ImageStyle,
});

export interface BannerPaidLoanProps extends ViewProps {}

export interface BannerPaidLoanState {}

export default class BannerPaidLoan extends React.Component<
  BannerPaidLoanProps,
  BannerPaidLoanState
> {
  state: BannerPaidLoanState = {};

  render() {
    return (
      <CardView style={[styles.cardView]}>
        <View style={[styles.cardManCelebrate]}>
          <Image
            source={require('../../assets/images/adn-man-celebrating-banner.png')}
            style={styles.imageManCelebrating}
          />
        </View>
        <View style={styles.cardTextCelebrate}>
          <Text>
            <Text style={styles.regularTextCardView}>
              {L.bannerpaidloan_cardview_text_part1}
              <Text style={styles.strongTextCardView}>
                {L.bannerpaidloan_cardview_text_part2}
              </Text>
            </Text>
            <Text style={styles.regularTextCardView}>
              {L.bannerpaidloan_cardview_text_part3}
              <Text style={styles.strongTextCardView}>
                {L.bannerpaidloan_cardview_text_part4}
              </Text>
            </Text>
            <Text style={styles.regularTextCardView}>
              {L.bannerpaidloan_cardview_text_part5}
              <Text style={styles.strongTextCardView}>
                {L.bannerpaidloan_cardview_text_part6}
              </Text>
            </Text>
            <Text style={styles.regularTextCardView}>
              {L.bannerpaidloan_cardview_text_part7}
            </Text>
          </Text>
        </View>
      </CardView>
    );
  }
}

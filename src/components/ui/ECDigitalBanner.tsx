import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';
import CardView from './CardView';

const styles = StyleSheet.create({
  textEECCMessage: {
    ...Font({ weight: 'Medium' }),
    color: Colors.accentDark,
    fontSize: 13,
  } as TextStyle,
  card: {
    marginTop: 20,
    borderColor: Colors.accentDark,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  cardContainer: {
    paddingRight: 20,
  } as ViewStyle,
  image: {
    width: 44,
    height: 52,
    tintColor: Colors.accentDark,
  } as ImageStyle,
  messageContainer: {
    flex: 1,
  } as ViewStyle,
});

export default function ECDigitalBanner() {
  return (
    <CardView padding style={styles.card}>
      <View style={styles.cardContainer}>
        <Image
          source={require('../../assets/images/icon-invoice.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.textEECCMessage}>
          {L.ecdigitalbanner_text}
          <Text numberOfLines={1}>{L.ecdigitalbanner_phone}</Text>
        </Text>
      </View>
    </CardView>
  );
}

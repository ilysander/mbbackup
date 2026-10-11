import { NavigationProp } from '@react-navigation/native';
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
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import CardView from '../ui/CardView';
import { TouchableProps } from '../ui/Touchable';
const styles = StyleSheet.create({
  emailNoticeText: {
    ...Font({ weight: 'Medium' }),
    fontSize: 14,
    color: Colors.accentDark,
  } as TextStyle,
  emailNoticeTextBold: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    marginBottom: 10,
    color: Colors.accentDark,
  } as TextStyle,
  emailNoticeToolTip: {
    ...Font({ weight: 'Bold' }),
    color: Colors.accentDark,
    fontSize: 14,
  } as TextStyle,
  iconToolTip: {
    tintColor: Colors.accentDark,
    width: 7,
    height: 11,
    alignSelf: 'flex-end',
    marginLeft: -70,
  } as ImageStyle,
  cardView: {
    marginTop: 20,
    borderColor: Colors.accentDark,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  } as ViewStyle,
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  image: {
    width: 60,
    height: 60,
  } as ImageStyle,
  messageContainer: {
    flex: 1,
    paddingLeft: 20,
  } as ViewStyle,
});
export interface Params { }
export interface Props extends TouchableProps {
  navigation: NavigationProp<any, any>;
}
export interface State { }
export default class AddEmailCard extends React.Component<Props, State> {
  render() {
    return (
      <CardView style={styles.cardView}>
        <View style={styles.content}>
          <Image
            style={styles.image}
            source={require('../../assets/images/adn-hombre-importante.png')}
          />
          <View style={styles.messageContainer}>
            <Text style={styles.emailNoticeText}>
              {L.addemailcard_message}
              <Text style={styles.emailNoticeTextBold}>
                {L.addemailcard_message_part1}
              </Text>
              {L.addemailcard_message_part2}
            </Text>
          </View>
        </View>
      </CardView>
    );
  }
}

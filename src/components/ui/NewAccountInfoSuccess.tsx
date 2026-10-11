import * as React from 'react';
import {
  StyleSheet,
  Image,
  ImageStyle,
  ViewStyle,
  TextStyle,
  ViewProps,
  View,
  Text,
} from 'react-native';
import { CardView } from '../ui';
import Font from '../../resources/functions/Font';
import { Colors } from '../../resources/constants';
import { L } from '../../resources/language';
const styles = StyleSheet.create({
  listItemtext: {
    textAlign: 'center',
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  title: {
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 16,
  } as TextStyle,
  descriptionContainer: {
    padding: 20,
    borderColor: Colors.primaryLight,
    borderWidth: 1,
    marginTop: 20,
  } as ViewStyle,
  principalImage: {
    justifyContent: 'center',
    paddingVertical: 20,
  } as ViewStyle,
  bannerPrincipalImage: {
    resizeMode: 'contain',
    width: '100%',
    height: 150,
  } as ImageStyle,
  textFree: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 13,
    textAlign: 'center',
    paddingLeft: 5,
  } as TextStyle,
});

export interface NewAccountInfoSuccessProps extends ViewProps {}
export interface NewAccountInfoSuccessState {}
export default class NewAccountInfoSuccess extends React.Component<
  NewAccountInfoSuccessProps,
  NewAccountInfoSuccessState
> {
  state: NewAccountInfoSuccessState = {};

  render() {
    const { style } = this.props;
    return (
      <CardView style={[styles.descriptionContainer, style]}>
        <View>
          <Text style={styles.title}>
            {L.newaccountscreensuccess_text_free}
          </Text>
        </View>
        <View style={styles.principalImage}>
          <Image
            accessibilityLabel={'banner_image_left'}
            style={styles.bannerPrincipalImage}
            source={require('../../assets/images/promo-transfiere.png')}
          />
        </View>
        <View>
          <Text style={styles.listItemtext}>
            {L.newaccountscreen_item_list2}
            <Text style={styles.textFree}>{L.newaccountscreen_text_free}</Text>
          </Text>
        </View>
      </CardView>
    );
  }
}

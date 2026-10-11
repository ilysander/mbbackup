import * as React from 'react';
import {
  View,
  Text,
  ViewProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Ad as AdView } from '../ui';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { NavigationProp } from '@react-navigation/native';

const styles = StyleSheet.create({
  ad: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: Colors.secondary,
  } as ViewStyle,
  adContent: {
    flex: 1,
    alignItems: 'center',
    color: Colors.white,
    ...Font(),
  } as TextStyle,
  title: {
    fontSize: 15,
    lineHeight: 21,
    color: Colors.white,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.white,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
});

export interface AdRescheduleProps extends ViewProps {
  navigation: NavigationProp<any, any>;
  styleContent?: StyleProp<ViewStyle>;
}
export interface AdRescheduleState { }

class AdReschedule extends React.Component<
  AdRescheduleProps,
  AdRescheduleState
> {
  state: AdRescheduleState = {
    canShow: true,
  };

  open = () => {
    const { navigation } = this.props;
    navigation.navigate('LoansPostponementMessage');
  };

  render() {
    const { styleContent, style } = this.props;

    return (
      <AdView
        accessibilityLabel={'ad_open'}
        onPress={this.open}
        style={[styles.ad, style]}
        content={
          <View style={[styles.adContent, styleContent]}>
            <Text style={styles.title} allowFontScaling={false}>
              {L.ad_text_reschedule_loan_title}
            </Text>
            <Text style={styles.subtitle} allowFontScaling={false}>
              {L.ad_text_reschedule_loan_subtitle}
            </Text>
          </View>
        }
      />
    );
  }
}

export default AdReschedule;

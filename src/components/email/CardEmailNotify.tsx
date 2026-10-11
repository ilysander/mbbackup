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
import Touchable from '../ui/Touchable';
import CardView from '../ui/CardView';
import Sanitizer from '../../resources/functions/Sanitizer';
import Font from '../../resources/functions/Font';
import Colors from '../../resources/constants/Colors';
import { MaskModel } from '../../resources/persistence/models';
import { AnalyticsLabelsType } from '../../resources/analytics';

const styles = StyleSheet.create({
  card: {
    paddingVertical: 20,
    marginTop: 10,
  } as ViewStyle,
  emailNoticeText: {
    ...Font(),
    fontSize: 14,
    marginBottom: 10,
    color: Colors.grey6,
  } as TextStyle,
  emailNoticeEmail: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
    marginBottom: 4,
    color: Colors.grey6,
  } as TextStyle,
  emailNoticeToolTip: {
    ...Font({ style: 'Italic' }),
    color: Colors.brown,
    fontSize: 13,
  } as TextStyle,
  iconToolTip: {
    tintColor: Colors.brown,
    width: 16,
    height: 16,
    // alignSelf: 'flex-end',
    // marginLeft: -70,
  } as ImageStyle,
  iconButtonLink: {
    tintColor: Colors.secondary,
    width: 16,
    height: 16,
    alignSelf: 'flex-end',
    marginLeft: -70,
  } as ImageStyle,
});
export interface Props {
  emailMasked: MaskModel;
  actionModal?: () => void;
  toggleModalEmail: () => void;
  message: string;
  tooltipMessage: string;
  accessibilityLabelBase:
  | 'newaccountscreen_cardemail'
  | 'dpfopenchoosescreen_cardemail'
  | 'instantcashshortscreen_cardemail'
  | 'instantcashchoosescreen_cardemail'
  | 'instantcashfastchoosescreen_cardemail';
  titleTooltip?: string;
}

interface State { }
export default class CardEmailNotify extends React.Component<Props, State> {
  render() {
    const {
      emailMasked,
      actionModal,
      toggleModalEmail,
      message,
      tooltipMessage,
      accessibilityLabelBase,
      titleTooltip
    } = this.props;
    //@ts-ignore
    const analitycsMessage: AnalyticsLabelsType = `${accessibilityLabelBase}_message`;
    //@ts-ignore
    const analitycsToolTip: AnalyticsLabelsType = `${accessibilityLabelBase}_tooltip`;
    return (
      <CardView padding style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 56, height: 84.75 }}
            source={require('../../assets/images/adn-hombre-correo-grande.png')}
          />
          <View style={{ flex: 1, paddingLeft: 20 }}>
            <Touchable
              onPress={actionModal}
              accessibilityLabel={analitycsMessage}
              analyticsParams={titleTooltip || undefined}
            >
              <Text style={styles.emailNoticeText}>
                {message}
                {!!actionModal && (
                  <Image
                    style={styles.iconButtonLink}
                    source={require('../../assets/images/help-icon.png')}
                  />
                )}
              </Text>
            </Touchable>
            <Text style={styles.emailNoticeEmail}>
              {Sanitizer.maskEmail(emailMasked.mask!)}
            </Text>
            <Touchable
              onPress={toggleModalEmail}
              accessibilityLabel={analitycsToolTip}
              analyticsParams={tooltipMessage}
              style={{ flexDirection: 'row' }}
            >
              <View>
                <Text style={[styles.emailNoticeToolTip]}>
                  {tooltipMessage}
                </Text>
              </View>
              <Image
                style={styles.iconToolTip}
                source={require('../../assets/images/help-icon.png')}
              />
            </Touchable>
          </View>
        </View>
      </CardView>
    );
  }
}

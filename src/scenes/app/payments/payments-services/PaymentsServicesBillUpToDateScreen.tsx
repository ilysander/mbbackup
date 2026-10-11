import * as React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import { Happy } from '../../../../components/ui';
import { Colors } from '../../../../resources/constants';
import { L } from '../../../../resources/language';
import { Size } from '../../../../resources/dimensions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  } as ViewStyle,
  happy: {
    height: Size.getHeight(),
    zIndex: -2,
    backgroundColor: Colors.backgroundAnimation,
    paddingTop: 0,
    marginTop: 0,
  } as ViewStyle,
  happyContent: {
    height: Size.getVisibleScreenHeight() - Size.getBottomTabBarHeight(),
    position: 'relative',
    justifyContent: 'center',
  } as ViewStyle,
  titleStyle: {
    marginBottom: 4,
  } as TextStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class PaymentsServicesBillUpToDateScreen extends React.PureComponent<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsservicesbilluptodatescreen_title,
  // };

  render() {
    return (
      <Happy
        type={'fullscreen'}
        accessibilityLabel={'instantcashsuccessscreen_happy'}
        title={L.paymentsservicesbilluptodatescreen_message_title}
        subtitle={L.paymentsservicesbilluptodatescreen_message_description}
        style={styles.happy}
        titleStyle={styles.titleStyle}
        contentStyle={styles.happyContent}
      />
    );
  }
}

export type PaymentsServicesBillUpToDateScreenType = PaymentsServicesBillUpToDateScreen;
export default withFocused<PaymentsServicesBillUpToDateScreen, Props>(
  PaymentsServicesBillUpToDateScreen
);

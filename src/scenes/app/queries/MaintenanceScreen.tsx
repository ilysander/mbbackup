import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import InfoContactMaintenance from '../../../components/info/InfoContactMaintenance';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
} from '../../../components/ui';
import { Colors } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { Font, Sanitizer } from '../../../resources/functions';
import { L } from '../../../resources/language';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 20,
  } as ViewStyle,
  message: {
    alignItems: 'center',
  } as ViewStyle,
  titleText1: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 10,
  } as TextStyle,
  textTitleBoldPart: {
    ...Font({ weight: 'Bold' }),
    fontSize: 22,
  } as TextStyle,
  textTitleNormalPart: {
    ...Font(),
    fontSize: 14,
  } as TextStyle,
  title: {
    ...Font({ weight: 'Bold' }),
    color: Colors.secondary,
    fontSize: 22,
  } as TextStyle,
  titleStrong: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
  } as TextStyle,
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class MaintenanceScreen extends React.Component<Props & FocusedProps, State> {


  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { isFocused, navigation } = this.props;
    const { route } = this.props;
    const item = route.params && route.params.item;
    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical={false} style={{ marginTop: 20 }}>
              <NetworkStatusAlert style={styles.networkStatus} />
            </Content>
            <Content center>
              <View style={styles.message}>
                <Text
                  style={styles.titleText1}
                  accessibilityLabel={'maintenancescreen_text_message'}
                >
                  <Text style={styles.textTitleBoldPart}>
                    {L.maintenancescreen_message_bold}
                    {' \n'}
                  </Text>
                  <Text style={styles.textTitleNormalPart}>
                    {L.maintenancescreen_message_part1}
                    {' \n'}
                  </Text>
                  <Text style={styles.textTitleNormalPart}>
                    <Text>{L.maintenancescreen_message_part2} </Text>
                    <Text style={styles.titleStrong}>
                      {L.maintenancescreen_message_part3}{' '}
                    </Text>
                    <Text>{L.maintenancescreen_message_part4}</Text>
                  </Text>
                </Text>
                <Text
                  accessibilityLabel={'maintenancescreen_text_account'}
                  style={styles.title}
                >
                  {Sanitizer.getProductName(item)}
                </Text>
                <InfoContactMaintenance
                  navigate={navigation.navigate}
                  accessibilityLabel={'maintenancescreen_infocontact'}
                />
              </View>
            </Content>
            <Content vertical={false} style={{ marginBottom: 50 }}>
              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={'maintenancescreen_button_title'}
                  title={L.maintenancescreen_button_title}
                  onPress={this.goBack}
                />
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type MaintenanceScreenType = MaintenanceScreen;
export default withFocused<MaintenanceScreen, Props>(MaintenanceScreen);

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { PreferencesUserDataModifyPreResponse } from '../../../../api/backend/response/Execute';
import InfoContact from '../../../../components/info/InfoContact';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  Header,
  KeyboardAvoidingView,
  SafeAreaView,
} from '../../../../components/ui';
import { Colors } from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Font } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 30,
  } as ViewStyle,
  subtitle: {
    marginTop: 10,
    paddingHorizontal: 40,
  } as ViewStyle,
  descriptionText: {
    ...Font({ weight: 'Medium' }),
    textAlign: 'center',
    color: Colors.grey5,
    fontSize: 13,
    lineHeight: 20,
  } as TextStyle,
  descriptionHighlight: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    marginVertical: 20,
    color: Colors.primaryLight,
    fontSize: 16,
  } as TextStyle,
  headerTitle: {
    color: Colors.primary,
    fontSize: 26,
    lineHeight: 30,
  } as TextStyle,
  buttonInit: {
    marginTop: 20,
    paddingVertical: 8,
  } as ViewStyle,
});

interface Params {
  user: PreferencesUserDataModifyPreResponse;
}

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class DPFOpenInvalidScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      return false;
    }
    return true;
  };

  goToLocation = () => {
    this.props.navigation.navigate('Location', {
      shouldGoBack: true,
    });
  };

  goToInit = () => {
    Emitter.emit('onClearDPFForm');

    const { route } = this.props;

    const user = route.params && route.params.user;
    this.props.navigation.navigate('DPFOpenCalculator', { user });
  };

  render() {
    const { isFocused, navigation } = this.props;
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
            <Content center>
              <Header
                center
                accessibilityLabel={'dpfopeninvalidscreen_header'}
                titleStyle={styles.headerTitle}
                title={L.dpfopeninvalidscreen_text_title}
                subtitleContainer={
                  <View style={styles.subtitle}>
                    <Text style={styles.descriptionText}>
                      {L.dpfopeninvalidscreen_text_description}
                    </Text>
                    <Text style={styles.descriptionHighlight}>
                      {L.dpfopeninvalidscreen_text_description_highlight}
                    </Text>
                    <Text style={styles.descriptionText}>
                      {L.dpfopeninvalidscreen_text_location_description}
                    </Text>
                  </View>
                }
              />

              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={'dpfopeninvalidscreen_button_location'}
                  title={L.dpfopeninvalidscreen_button_location}
                  onPress={this.goToLocation}
                />
                <Button
                  accessibilityLabel={'dpfopeninvalidscreen_button_end'}
                  title={L.dpfopeninvalidscreen_button_end}
                  onPress={this.goToInit}
                  light
                  style={styles.buttonInit}
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                linkStyle={{ color: Colors.primary }}
                navigate={navigation.navigate}
                accessibilityLabel={'dpfopeninvalidscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type DPFOpenInvalidScreenType = DPFOpenInvalidScreen;
export default withFocused<DPFOpenInvalidScreen, Props>(DPFOpenInvalidScreen);

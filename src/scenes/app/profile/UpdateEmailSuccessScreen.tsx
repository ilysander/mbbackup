import * as React from 'react';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  SafeAreaView,
  KeyboardAvoidingView,
  Content,
  NetworkStatusAlert,
  FormSteps,
  Button,
} from '../../../components/ui';
import Size from '../../../resources/dimensions/Size';
import { L } from '../../../resources/language';
import { Font } from '../../../resources/functions';
import { Colors } from '../../../resources/constants';
import {
  View,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  ImageStyle,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  formText: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
  } as TextStyle,
  supplyCode: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 19,
    height: 40,
  } as TextStyle,
  buttons: {
    marginBottom: 50,
    marginTop: 40,
    paddingHorizontal: 20,
  } as ViewStyle,
  marginTop: {
    marginTop: 28,
  } as ViewStyle,
  headerContainer: {
    marginTop: 28,
  } as ViewStyle,
  card: {
    paddingTop: 20,
    paddingBottom: 0,
    marginTop: 5,
  } as ViewStyle,
  header: {
    marginVertical: 6,
  } as ViewStyle,
  imageBalon: {
    width: 64.55,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
  } as ImageStyle,
  headerTitle: {
    fontSize: 22,
  } as TextStyle,
  emailContainer: {
    marginTop: 0,
  } as TextStyle,
  titleContainer: {
    alignItems: 'center',
    marginTop: 30,
  } as ViewStyle,
  title: {
    ...Font({ weight: 'Bold', style: 'Italic' }),
    fontSize: 32,
    color: Colors.primary,
  } as TextStyle,
  subTitle: {
    ...Font({ weight: 'Bold' }),
    fontSize: 18,
    lineHeight: 19,
    color: Colors.accentDark,
    textAlign: 'center',
  } as TextStyle,
  subtitleContainer: {
    width: '80%',
  } as ViewStyle,
  image: {
    width: 112,
    height: 168,
    marginBottom: 20,
  } as ImageStyle,
});

export interface Params { }
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }
class ChangeEmailSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  interaction!: any;

  finish = async () => {
    const { navigation } = this.props;
    navigation.popToTop();
    setTimeout(() => {
      navigation.navigate('Profile');
    }, 100);
  };

  render() {
    return (
      <Container>
        <FormSteps current={3} total={3} />
        <SafeAreaView>
          <KeyboardAvoidingView
            enabled={false}
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={{
              minHeight: Size.getVisibleTabScreenHeight(),
            }}
          >
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={styles.titleContainer}>
                  <Image
                    style={styles.image}
                    source={require('../../../assets/images/adn-hombre-correo-grande.png')}
                  />
                  <Text style={styles.title}>
                    {L.updateemailsuccessscreen_changeheader_title}
                  </Text>
                  <View style={styles.subtitleContainer}>
                    <Text style={styles.subTitle}>
                      {L.updateemailsuccessscreen_changeheader_subtitle}
                    </Text>
                  </View>
                </View>
                <View style={styles.buttons}>
                  <Button
                    allowOnPress
                    accessibilityLabel={'updateemailsuccessscreen_button_end'}
                    onPress={this.finish}
                    title={L.updateemailsuccessscreen_button_next}
                  />
                </View>
              </View>
            </Content>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Container>
    );
  }
}

export type ChangeEmailSuccessScreenType = ChangeEmailSuccessScreen;
export default withFocused<ChangeEmailSuccessScreen, Props>(
  ChangeEmailSuccessScreen
);

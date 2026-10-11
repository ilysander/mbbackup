import * as React from 'react';
import {StyleSheet, TextStyle, ViewStyle, Text, View} from 'react-native';
import {Colors} from '../../resources/constants';
import {L} from '../../resources/language';
import InfoContactError from '../info/InfoContactError';
import Session from '../../api/Session';
import {FocusedProps, withFocused} from '../screen/ScreenContainer';
import {Font} from '../../resources/functions';
import {Button, Header, Content, Container, SafeAreaView, SpacedView} from '.';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  containerSubtitle: {
    marginTop: 20,
    marginHorizontal: 20,
  } as ViewStyle,
  textDescription: {
    ...Font(),
    textAlign: 'center',
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,
  textNumber: {
    ...Font({weight: 'SemiBold'}),
    textAlign: 'center',
    fontSize: 14,
    color: Colors.primary,
  } as TextStyle,
  textButton: {
    ...Font({weight: 'SemiBold'}),
    textAlign: 'center',
    fontSize: 16,
  } as TextStyle,
  content: {
    alignItems: 'center',
  } as ViewStyle,
  buttonView: {
    marginTop: 20,
    alignItems: 'center',
  } as ViewStyle,
  buttonStyle: {
    minHeight: 40,
    marginTop: 20,
  } as ViewStyle,
  infoContact: {
    color: Colors.primary,
  } as ViewStyle,
  header: {
    maxWidth: 280,
    color: Colors.primary,
    ...Font({weight: 'Bold'}),
    fontSize: 22,
  } as TextStyle,
  titleText: {
    ...Font({weight: 'Bold'}),
    color: Colors.primary,
    fontSize: 18,
    lineHeight: 22,
  } as TextStyle,
  footerQuestionText: {
    ...Font({weight: 'Regular'}),
    fontSize: 13,
    color: Colors.grey6,
  } as TextStyle,
});

export interface GenericErrorScreenProps
  extends NativeStackScreenProps<any, any> {}

export interface GenericErrorScreenState {}

class GenericErrorScreen extends React.Component<
  GenericErrorScreenProps & FocusedProps,
  GenericErrorScreenState
> {
  onPress = () => {
    this.props.navigation.navigate('SignUpFacephi');
  };
  onPressBack = async () => {
    try {
      const sesion = await Session.onboardingGet('SignIn');
      if (!!sesion) {
        this.props.navigation.navigate('SignIn');
      } else {
        this.props.navigation.navigate('Onboarding');
      }
    } catch (error) {
      this.props.navigation.navigate('Onboarding');
    }
  };
  render() {
    return (
      <Container accessibilityLabel={'genericerrorscreen'}>
        <SafeAreaView>
          <Content style={styles.content} center>
            <Header
              center
              titleStyle={styles.header}
              accessibilityLabel={'genericError_title'}
              title={L.genericError_title}
            />
            <View style={styles.containerSubtitle}>
              <Text
                style={styles.textDescription}
                accessibilityLabel={'genericError_info_text'}>
                {L.genericError_info_text}
              </Text>
            </View>
            <View style={styles.containerSubtitle}>
              <Text
                style={styles.textDescription}
                accessibilityLabel={'genericError_info_subtext'}>
                {L.genericError_info_subtext}
              </Text>
              <SpacedView style={styles.buttonView}>
                <Button
                  textStyle={styles.textButton}
                  light={true}
                  typeColor={'primary'}
                  accessibilityLabel={'genericError_button_finish'}
                  title={L.genericError_button_finish}
                  onPress={this.onPressBack}
                  style={styles.buttonStyle}
                />
                <Button
                  textStyle={styles.textButton}
                  accessibilityLabel={'genericError_button_tryAgain'}
                  title={L.genericError_button_tryAgain}
                  onPress={this.onPress}
                  style={styles.buttonStyle}
                />
              </SpacedView>
            </View>
          </Content>
          <Content vertical={false}>
            <InfoContactError
              accessibilityLabel={'genericError_footer_question'}
              title={L.genericError_footer_question}
              style={styles.infoContact}
              footerQuestionText={styles.footerQuestionText}
              textStyleNumber={styles.textNumber}
            />
          </Content>
        </SafeAreaView>
      </Container>
    );
  }
}

export type GenericErrorScreenType = GenericErrorScreen;
export default withFocused<GenericErrorScreen, GenericErrorScreenProps>(
  GenericErrorScreen,
);

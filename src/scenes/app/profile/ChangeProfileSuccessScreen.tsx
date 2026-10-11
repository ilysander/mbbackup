import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import InfoContact from '../../../components/info/InfoContact';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  Header,
  SafeAreaView,
  KeyboardAvoidingView,
} from '../../../components/ui';
import { Colors } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import { ReturnOptions } from '../../../components/alert/ConfirmPhoneAlert';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  titleText: {
    color: Colors.secondary,
  } as TextStyle,
  buttons: {
    marginTop: 60,
    marginHorizontal: 20,
    marginBottom: 10,
  } as ViewStyle,
});

export type UpdatedItem = 'email' | 'phone' | 'other';

export interface NavigationParams {
  returnOptions: ReturnOptions;
  updatedItem: UpdatedItem;
  updatedValue: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  returnOptions?: ReturnOptions;
  updatedItem: UpdatedItem;
  updatedValue: string;
}

class ChangeProfileSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {


  state: State = {
    isLoading: true,
    updatedItem: 'other',
    updatedValue: '',
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    const { route } = this.props;
    const returnOptions = route.params && route.params.returnOptions; //navigation.getParam('returnOptions');
    const updatedItem = route.params && route.params.updatedItem; //navigation.getParam('updatedItem');
    const updatedValue = route.params && route.params.updatedValue; //navigation.getParam('updatedValue');
    this.setState({ returnOptions, updatedItem, updatedValue });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      return false;
    }
    this.goBack();
    return true;
  };
  goBack = () => {
    const { navigation } = this.props;
    const { returnOptions } = this.state;
    if (
      returnOptions &&
      returnOptions.success &&
      typeof returnOptions.success.onPress === 'function'
    ) {
      returnOptions.success.onPress();
    } else {
      navigation.navigate('Profile');
    }
  };

  render() {
    const { isFocused, navigation } = this.props;
    const { returnOptions, updatedItem } = this.state;
    const hasSuccessOptions = returnOptions && returnOptions.success;
    const typeItem =
      updatedItem === 'phone'
        ? L.changeprofilesucessscreen_phone_text_description
        : L.changeprofilesucessscreen_email_text_description;
    const subtitle = `${L.changeprofilesucessscreen_text_description} ${typeItem}.`;
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
                accessibilityLabel={'changeprofilesucessscreen_header'}
                title={`¡${L.changeprofilesucessscreen_text_title}!`}
                titleStyle={styles.titleText}
                subtitle={subtitle}
              />
              <View style={styles.buttons}>
                {!hasSuccessOptions && (
                  <Button
                    accessibilityLabel={
                      'changeprofilesucessscreen_button_profile'
                    }
                    onPress={this.goBack}
                    title={L.changeprofilesucessscreen_button_profile}
                  />
                )}
                {!!returnOptions && hasSuccessOptions && (
                  <Button
                    accessibilityLabel={
                      'changeprofilesucessscreen_button_success'
                    }
                    {...returnOptions.success}
                  />
                )}
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'changeprofilesucessscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type ChangeProfileSuccessScreenType = ChangeProfileSuccessScreen;
export default withFocused<ChangeProfileSuccessScreen, Props>(
  ChangeProfileSuccessScreen
);

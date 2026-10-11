import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
  SafeAreaView,
  KeyboardAvoidingView,
  Container,
  Header,
  Content,
} from '../../../components/ui';
import { Colors } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';

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

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
}

class ChangeContactSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.changecontactsuccessscreen_title,
  //   headerLeft: <View />,
  //   gesturesEnabled: false,
  // };

  state: State = {
    isLoading: true,
  };

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
    this.goToTransfers();
    return true;
  };
  goToTransfers = () => {
    const { navigation } = this.props;
    navigation.navigate('TransfersHome');
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
                accessibilityLabel={'changecontactsuccessscreen_header'}
                title={L.changecontactsuccessscreen_text_title}
                titleStyle={styles.titleText}
                subtitle={L.changecontactsuccessscreen_text_description}
              />

              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={
                    'changecontactsuccessscreen_button_transfers'
                  }
                  onPress={this.goToTransfers}
                  title={L.changecontactsuccessscreen_button_transfers}
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'changecontactsuccessscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type ChangeContactSuccessScreenType = ChangeContactSuccessScreen;
export default withFocused<ChangeContactSuccessScreen, Props>(
  ChangeContactSuccessScreen
);

import * as React from 'react';
import {
  Image,
  ImageStyle,
  Platform,
  StatusBar,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Size } from '../../resources/dimensions';
import { L } from '../../resources/language';
import { Log } from '../../resources/log';
import InfoContactError from '../info/InfoContactError';
import {
  Button,
  KeyboardAvoidingView,
  Header,
  Content,
  Container,
  SafeAreaView,
} from '../ui';

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  } as ViewStyle,
  imageMaintenance: {
    marginBottom: 20,
    width: 70,
    height: 70,
    tintColor: Colors.secondary,
  } as ImageStyle,
  buttonStyle: {
    width: 200,
    marginTop: 20,
    marginBottom: 30,
  } as ViewStyle,
  header: {
    color: Colors.secondary,
  } as TextStyle,
});

const TAG = '[HandleError]';

export interface HandleErrorProps {
  accessibilityLabel: string;
  children?: React.ReactNode[] | React.ReactNode;
}

export interface HandleErrorState {
  handleError: boolean;
}

export default class HandleError extends React.PureComponent<
  HandleErrorProps,
  HandleErrorState
> {
  state: HandleErrorState = {
    handleError: false,
  };
  onPress = () => {
    this.setState({
      handleError: false,
    });
  };

  componentDidCatch(error: any) {
    Log.exception(TAG, 'componentDidCatch', error);
    this.setState({
      handleError: true,
    });
  }

  render() {
    const { handleError } = this.state;
    const { accessibilityLabel } = this.props;
    if (!handleError) {
      return this.props.children;
    }
    return (
      <Container accessibilityLabel={accessibilityLabel}>
        <StatusBar
          backgroundColor={Colors.grey3}
          barStyle={'light-content'}
          animated
        />
        <KeyboardAvoidingView
          enabled={false}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight:
              Size.getVisibleHeight() +
              (Platform.OS === 'ios' ? Size.getStatusBarHeight() : 0),
          }}
        >
          <SafeAreaView>
            <Content style={styles.content} center>
              <Image
                resizeMode={'cover'}
                style={styles.imageMaintenance}
                source={require('../../assets/images/maintenance-icon.png')}
              />
              <Header
                center
                titleStyle={styles.header}
                accessibilityLabel={'handleerror_header'}
                title={L.handleerror_title}
                subtitle={L.handleerror_text_message}
              />
              <Button
                accessibilityLabel={'handleerror_button_title'}
                title={L.handleerror_button_title}
                onPress={this.onPress}
                style={styles.buttonStyle}
              />
            </Content>
            <Content vertical={false}>
              <InfoContactError
                accessibilityLabel={'handleerror_infocontact'}
                title={L.handleerror_infocontact}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

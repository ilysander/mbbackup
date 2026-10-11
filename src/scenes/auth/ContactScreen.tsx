import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../components/screen/ScreenContainer';
import { Browser } from '../../components/ui';
import Config from '../../Config';
import { Colors } from '../../resources/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  } as ViewStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class ContactScreen extends React.Component<Props & FocusedProps, State> {

  render() {
    return (
      <View style={styles.container}>
        <Browser
          accessibilityLabel={'contactscreen_browser'}
          source={{ uri: Config.settings.contactUrl }}
        />
      </View>
    );
  }
}

export type ContactScreenType = ContactScreen;
export default withFocused<ContactScreen, Props>(ContactScreen);

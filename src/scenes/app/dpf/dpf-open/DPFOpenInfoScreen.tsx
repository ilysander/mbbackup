import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import PDFView from 'react-native-view-pdf';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import { LoadingOverlay } from '../../../../components/ui';
import Config from '../../../../Config';
import { Colors } from '../../../../resources/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  } as ViewStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
}

class DPFOpenInfoScreen extends React.Component<Props & FocusedProps, State> {

  state: State = {
    isLoading: true,
  };

  onLoad = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { isLoading } = this.state;
    return [
      <PDFView
        key={'pdf'}
        style={styles.container}
        resource={Config.settings.dpfInfoUrl}
        resourceType={'url'}
        onLoad={this.onLoad}
      />,
      <LoadingOverlay
        key={'loading'}
        isLoading={isLoading}
        duration={isLoading ? 0 : 200}
      />,
    ];
  }
}

export type DPFOpenInfoScreenType = DPFOpenInfoScreen;
export default withFocused<DPFOpenInfoScreen, Props>(DPFOpenInfoScreen);

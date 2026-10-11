import * as React from 'react';
import {
  Platform,
  Alert,
  View,
  ViewStyle,
  StyleSheet,
  Linking,
} from 'react-native';
import { compareVersions } from 'compare-versions';
import { Log } from '../../resources/log';
import Config from '../../Config';
import DeviceInfo from 'react-native-device-info';
import { L } from '../../resources/language';
import { Colors } from '../../resources/constants';
import { Emitter } from '../../resources/listeners';
import { NavigationContainerRef } from '@react-navigation/native';

const TAG = '[UpdateManager]';

const styles = StyleSheet.create({
  opaque: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.grey5,
    opacity: 0.5,
  } as ViewStyle,
});

export interface UpdateManagerProps {
  accessibilityLabel: string;
  navigation: () => NavigationContainerRef<any> | null;
}

export interface UpdateManagerState {
  outdated: boolean;
}

export default class UpdateManager extends React.Component<
  UpdateManagerProps,
  UpdateManagerState
> {
  state: UpdateManagerState = {
    outdated: false,
  };

  componentDidMount() {
    Emitter.on('onCheckVersionUpToDate', this.load);
    this.load();
  }

  componentWillUnmount() {
    Emitter.off('onCheckVersionUpToDate', this.load);
  }

  load = async () => {
    const isUpToDate = await this.isUpToDate();
    if (!isUpToDate) {
      this.setState({ outdated: true }, () => {
        /**
         * de esta forma evitamos que se muestre el alert antes que el fondo
         */
        this.updateAppNotice();
      });
    }
  };

  isUpToDate = async () => {
    const appVersion = Config.settings.minVersion;
    /**
     * esto verifica que tenga algun string antes de realizar la validación
     */
    if (!appVersion) {
      return true;
    }
    try {
      const deviceVersion = Config.settings.version || DeviceInfo.getVersion();
      return compareVersions(appVersion, deviceVersion) < 1;
    } catch (e) {
      Log.exception(TAG, 'isUpToDate', e);
      return true;
    }
  };

  updateAppNotice = () => {
    Alert.alert(
      L.updatemanager_updatenotice_title,
      L.updatemanager_updatenotice_message,
      [
        {
          text: L.updatemanager_updatenotice_button,
          onPress: this.goToStore,
        },
      ],
      { cancelable: false }
    );
  };

  goToStore = async () => {
    const isGms = await DeviceInfo.hasGms();
    let link = '';
    if (!isGms && Platform.OS !== 'ios') {
      link = Config.settings.appGalleryLink;
    } else {
      link =
        Platform.OS === 'android'
          ? Config.settings.playStoreLink
          : Config.settings.appStoreLink;
    }
    try {
      /**
       * este Linking debe ser siempre el de react-native
       */
      await Linking.openURL(link);
      this.updateAppNotice();
    } catch (e) {
      Log.debug(TAG, 'goToStore', e);
    }
  };

  render() {
    const { outdated } = this.state;
    const { accessibilityLabel } = this.props;
    if (!outdated) {
      return null;
    }
    return (
      <View style={styles.opaque} accessibilityLabel={accessibilityLabel} />
    );
  }
}

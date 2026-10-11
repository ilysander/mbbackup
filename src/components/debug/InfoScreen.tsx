import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import Config from '../../Config';
import { Size } from '../../resources/dimensions';
import Log from '../../resources/log/Log';
import { Emitter } from '../../resources/listeners';
import RemoteConfig from '../../resources/remote/RemoteConfig';
const AGCCrash = require('@react-native-agconnect/crash').default;
import MobileServiceManager from '../mobile-service/MobileServiceManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    flex: 1,
  } as ViewStyle,
  safeArea: {
    flex: 1,
  } as ViewStyle,
  content: {
    flex: 1,
    padding: 20,
  } as ViewStyle,
  item: {
    padding: 1,
    paddingBottom: 8,
    paddingTop: 3,
    flexDirection: 'column',
  } as ViewStyle,
  labelText: {
    fontSize: 12,
    flex: 1,
    color: '#999',
    fontWeight: '400',
  } as TextStyle,
  valueText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#444',
  } as TextStyle,
  section: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingLeft: 0,
  } as ViewStyle,
  title: {
    fontSize: 16,
    color: '#5671fd',
    fontWeight: '600',
  } as TextStyle,
  textInput: {
    fontSize: 14,
    padding: 10,
    borderColor: '#d4d4d4',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 14,
    backgroundColor: '#fff',
  } as TextStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, any>;
}

const TAG = '[InfoScreen]';
export default class InfoScreen extends React.Component<any, any> {
  // static navigationOptions: NavigationTabScreenOptions = {
  //   tabBarLabel: 'Utilidades',
  //   tabBarIcon: ({ tintColor }) => {
  //     return <Icon name={'rocket'} size={25} color={tintColor || '#5671fd'} />;
  //   },
  // };

  state: any = {
    fcmToken: '',
  };
  didFocusListener!: any;

  didFocus = () => {
    this.forceUpdate();
  };
  showAlert = (message: any) => {
    Alert.alert('Alerta', message, [{ text: 'OK' }]);
  };
  checkToken = async () => {
    let fcmToken = '';
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      this.setState({ fcmToken });
    }
  };

  infoDevice = async () => {
    try {
      const deviceBrand = DeviceInfo.getBrand();
      const deviceName = await DeviceInfo.getDeviceName();
      const manufacturer = await DeviceInfo.getManufacturer();
      const gms = await DeviceInfo.hasGms();
      const hms = await DeviceInfo.hasHms();
      const uniqueId = await DeviceInfo.getUniqueId();
      const isEmulator = await DeviceInfo.isEmulator();
      this.setState({
        deviceBrand,
        deviceName,
        manufacturer,
        gms,
        hms,
        uniqueId,
        isEmulator
      });
    } catch (e) {
      Log.info(TAG, 'secondTime', e);
    }
  };

  componentDidMount() {
    if (this.props.navigation) {
      this.didFocusListener = this.props.navigation.addListener(
        'focus',
        this.didFocus
      );
    }
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.checkToken();
    }
    this.infoDevice();
  }

  componentWillUnmount() {
    this.didFocusListener && this.didFocusListener();
  }

  navigate = (route: any) => {
    const navigateAction = CommonActions.navigate({ name: route });
    const navigation = this.props.navigation();
    navigation && navigation.dispatch(navigateAction);
    // const navigateAction = NavigationActions.navigate({
    //   routeName: route,
    //   params: {},
    // });
    // const navigation = this.props.screenProps.navigation();
    // navigation.dispatch(navigateAction);
  };

  forceCrash = () => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      crashlytics().crash();
    } else {
      AGCCrash.enableCrashCollection(true);
    }
  };

  identifyUser = (firebaseUserIdentifier: any) => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      crashlytics().setUserId(firebaseUserIdentifier);
      analytics().setUserId(firebaseUserIdentifier);
      analytics().setUserProperty('identifier', firebaseUserIdentifier);
      analytics().setAnalyticsCollectionEnabled(true);
    }
  };

  render() {
    const bundleId = DeviceInfo.getBundleId();
    const deviceId = DeviceInfo.getDeviceId();
    const version = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();
    const systemVersion = DeviceInfo.getSystemVersion();
    // const uniqueId = DeviceInfo.getUniqueId();
    const server = Config.server.url;
    const { screenProps } = this.props;
    const {
      fcmToken,
      deviceBrand,
      deviceName,
      manufacturer,
      gms,
      hms,
      uniqueId,
      isEmulator
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={'#d4d4d4'}
          barStyle={'dark-content'}
          animated
        />
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleScreenHeight(),
          }}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.title}>
                  {'Información del dispositivo'}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Fabricante'}:</Text>
                <Text selectable style={styles.valueText}>
                  {manufacturer}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Marca'}:</Text>
                <Text selectable style={styles.valueText}>
                  {deviceBrand}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Nombre'}:</Text>
                <Text selectable style={styles.valueText}>
                  {deviceName}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Mobile Service'}:</Text>
                <Text selectable style={styles.valueText}>
                  {gms ? 'Google Mobile Service' : '--'}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Mobile Service'}:</Text>
                <Text selectable style={styles.valueText}>
                  {hms ? 'Huawei Mobile Service' : '--'}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.title}>
                  {'Información de la aplicación'}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Servidor'}:</Text>
                <Text selectable style={styles.valueText}>
                  {server}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Firebase Token'}:</Text>
                <Text selectable style={styles.valueText}>
                  {fcmToken || '...'}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Id'}:</Text>
                <Text selectable style={styles.valueText}>
                  {bundleId}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Versión'}:</Text>
                <Text selectable style={styles.valueText}>
                  {version}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Número de compilación'}:</Text>
                <Text selectable style={styles.valueText}>
                  {buildNumber}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Dimensiones Window'}:</Text>
                <Text selectable style={styles.valueText}>
                  {JSON.stringify(Dimensions.get('window'), null, ' ')}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Dimensiones Screen'}:</Text>
                <Text selectable style={styles.valueText}>
                  {JSON.stringify(Dimensions.get('screen'), null, ' ')}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Id de dispositivo'}:</Text>
                <Text selectable style={styles.valueText}>
                  {deviceId}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Versión del SO'}:</Text>
                <Text selectable style={styles.valueText}>
                  {systemVersion}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Id Único'}:</Text>
                <Text selectable style={styles.valueText}>
                  {uniqueId}
                </Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.labelText}>{'Emulador'}:</Text>
                <Text selectable style={styles.valueText}>
                  {!!isEmulator?'SI':'NO'}
                </Text>
              </View>

              <View>
                <View style={styles.section}>
                  <Text style={styles.title}>{'Firebase'}</Text>
                </View>

                <View style={styles.item}>
                  <Button onPress={() => { }} title={'Forzar crash'} />
                </View>
                <View style={styles.item}>
                  <Button
                    onPress={this.forceCrash}
                    title={'Enviar error crashlytics'}
                  />
                </View>
                <View style={styles.item}>
                  <TextInput
                    autoCorrect={false}
                    placeholder={'Nombre para sessión firebase'}
                    style={styles.textInput}
                    defaultValue={''}
                    returnKeyType={'done'}
                    blurOnSubmit
                    onChangeText={value => {
                      this.setState({ firebaseUserIdentifier: value });
                    }}
                    onSubmitEditing={() => {
                      const { firebaseUserIdentifier } = this.state;
                      this.identifyUser(firebaseUserIdentifier);
                      this.showAlert(
                        'Actualizado a: ' + firebaseUserIdentifier
                      );
                    }}
                  />
                </View>
                <View style={styles.section}>
                  <Text style={styles.title}>{'Revision demo'}</Text>
                </View>
                {/* <View style={styles.item}>
                  <Button
                    title="Activar Revision Mode"
                    onPress={async () => {
                      try {
                        await CacheService.updateOrCreateValueByKey(
                          'revisionMode',
                          'ACTIVE'
                        );
                      } catch (e) {
                        // Log.exception(TAG, 'updateDemoConfig', e);
                      }
                    }}
                  />
                </View> */}
                <View style={styles.section}>
                  <Text style={styles.title}>{'Utilidades'}</Text>
                </View>

                <View style={styles.item}>
                  <Button
                    onPress={() => {
                      throw new Error('Sample error throw');
                    }}
                    title={'Enviar error throw'}
                  />
                  <Button
                    onPress={async () => {
                      await AsyncStorage.removeItem('not_first_open');
                      screenProps.toggle();
                      this.navigate('Splash');
                    }}
                    title={'Volver a mostrar App Tour'}
                  />
                  <Button
                    onPress={async () => {
                      await AsyncStorage.removeItem(
                        'disable_availability_alert'
                      );
                      screenProps.toggle();
                      this.navigate('Splash');
                    }}
                    title={'Mostrar Alerta T. Inmediatas'}
                  />
                  <Button
                    onPress={async () => {
                      screenProps.toggle();
                      this.navigate('Splash');
                    }}
                    title={'Recargar App'}
                  />
                  <Button
                    onPress={async () => {
                      screenProps.toggle();
                      this.navigate('Splash');
                      setTimeout(() => {
                        Emitter.emit('onCheckVersionUpToDate');
                      }, 1000);
                    }}
                    title={'Revisar Versión'}
                  />
                </View>
                <View style={styles.section}>
                  <Text style={styles.title}>{'Depuración'}</Text>
                </View>

                <View style={styles.item}>
                  {!Config.debug.allowRoot && (
                    <Button
                      onPress={() => {
                        screenProps.toggle();
                        Config.debug.allowRoot = true;
                        this.navigate('Splash');
                      }}
                      title={'Permitir ROOT'}
                    />
                  )}
                  {Config.debug.allowRoot && (
                    <Button
                      onPress={() => {
                        screenProps.toggle();
                        Config.debug.allowRoot = false;
                        this.navigate('Splash');
                      }}
                      title={'Dejar de permitir ROOT'}
                    />
                  )}
                </View>
                <View style={styles.section}>
                  <Text style={styles.title}>{'Remote Config'}</Text>
                </View>

                <View style={styles.item}>
                  <Button
                    onPress={async () => {
                      screenProps.toggle();
                      await RemoteConfig.update(0);
                      this.navigate('Splash');
                      setTimeout(() => {
                        Emitter.emit('onCheckVersionUpToDate');
                      }, 1000);
                    }}
                    title={'Actualizar config'}
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }
}

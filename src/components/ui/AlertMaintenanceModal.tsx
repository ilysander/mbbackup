import * as React from 'react';
import Modal from './Modal';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
  ViewProps,
} from 'react-native';
import Header from './Header';
import Button from './Button';
import Config from '../../Config';
import Font from '../../resources/functions/Font';
import Colors from '../../resources/constants/Colors';
import Validate from '../../resources/functions/Validate';
import MaintenanceStatus from '../../resources/constants/MaintenanceStatus';
import AsyncStorage from '@react-native-community/async-storage';
import { Log } from '../../resources/log';
import { L } from '../../resources/language';
import { AnalyticsEvent, A } from '../../resources/analytics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 20,
    elevation: 3,
  } as ViewStyle,
  image: {
    width: '100%',
    maxHeight: 190,
    marginBottom: 10,
  } as ImageStyle,
  header: {
    marginBottom: 20,
    paddingTop: 0,
    marginTop: 0,
  } as ViewStyle,
  headerTitle: {
    textAlign: 'center',
  } as TextStyle,
  messageText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 16,
    textAlign: 'center',
  } as TextStyle,
  button: {
    marginTop: 30,
    minWidth: 150,
  } as ViewStyle,
  buttonTitle: {
    fontSize: 16,
  } as TextStyle,
});
export interface AlertMaintenanceModalProps extends ViewProps {}
export interface AlertMaintenanceModalState {
  isVisible: boolean;
  title: string;
  message: string;
  isReactivated: boolean;
  isBetweenHours: boolean;
}

const TAG = '[AlertMaintenanceModal]';
export default class AlertMaintenanceModal extends React.Component<
  AlertMaintenanceModalProps,
  AlertMaintenanceModalState
> {
  state: AlertMaintenanceModalState = {
    isVisible: false,
    title: '',
    message: '',
    isReactivated: false,
    isBetweenHours: false,
  };

  componentDidMount() {
    this.load();
  }

  load = async () => {
    const codeMaintenance = Config.settings.maintenanceStatus;
    let isVisible = false;
    let title = '';
    let message = '';
    let isReactivated = false;
    let isBetweenHours = false;
    switch (codeMaintenance) {
      case MaintenanceStatus.Total:
        this.saveMaintenance();
        AnalyticsEvent.track(A.alertmaintenancemodal_maintenance_total);
        break;
      case MaintenanceStatus.Parcial:
        title = L.maintenance_parcial_title;
        message = L.maintenance_parcial_message;
        if (
          !!Config.settings.maintenanceSchedule &&
          Config.settings.maintenanceSchedule.length > 0
        ) {
          const arrayHorarios: any[] = Config.settings.maintenanceSchedule;

          const timeUTC = Validate.getTimeUTC();

          for (const horario of arrayHorarios) {
            if (Validate.isBetweenHours(timeUTC, horario.init, horario.end)) {
              isVisible = true;
              isBetweenHours = true;
              title = L.maintenance_parcial_bhours_title;
              message = L.maintenance_parcial_bhours_message;
              break;
            }
          }
        } else {
          isVisible = true;
        }
        if (isVisible) {
          this.saveMaintenance();
          AnalyticsEvent.track(A.alertmaintenancemodal_maintenance_parcial);
        }
        break;
      default:
        const isMaintenance = await this.isMaintenance();
        if (isMaintenance) {
          isVisible = true;
          title = L.maintenance_reactivated_title;
          message = L.maintenance_reactivated_message;
          isReactivated = true;
          AnalyticsEvent.track(A.alertmaintenancemodal_maintenance_reactivated);
        }
        await AsyncStorage.removeItem('is_maintenance');
        break;
    }

    this.setState({
      isVisible,
      title,
      message,
      isReactivated,
      isBetweenHours,
    });
  };

  isMaintenance = async () => {
    let isMaintenance = false;
    try {
      const isMaintenanceValue = await AsyncStorage.getItem('is_maintenance');
      isMaintenance = isMaintenanceValue
        ? JSON.parse(isMaintenanceValue)
        : false;
    } catch (e) {
      Log.info(TAG, 'isMaintenance', e);
    }
    return isMaintenance;
  };

  saveMaintenance = async () => {
    let isMaintenance;
    try {
      isMaintenance = await AsyncStorage.getItem('is_maintenance');
    } catch (e) {
      Log.info(TAG, 'saveMaintenance', e);
    }

    if (!isMaintenance) {
      AsyncStorage.setItem('is_maintenance', 'true');
    }
  };

  onClose = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const {
      isVisible,
      title,
      message,
      isReactivated,
      isBetweenHours,
    } = this.state;
    return (
      <Modal
        visible={isVisible}
        accessibilityLabel={'alertmaintenancemodal_modal'}
        onClose={this.onClose}
      >
        <View style={styles.container}>
          <Image
            source={
              isReactivated
                ? require('../../assets/images/adn-man-celebrating.png')
                : isBetweenHours
                ? require('../../assets/images/adn-man-surprised.png')
                : require('../../assets/images/adn-woman-pointing.png')
            }
            resizeMode={'contain'}
            style={styles.image}
          />
          <Header
            accessibilityLabel={'alertmaintenancemodal_header'}
            title={title}
            titleStyle={styles.headerTitle}
            style={styles.header}
          />
          <Text style={styles.messageText}>{message}</Text>
          <Button
            onPress={this.onClose}
            style={styles.button}
            textStyle={styles.buttonTitle}
            accessibilityLabel={
              isReactivated
                ? 'alertmaintenancemodal_button_reactivated_ok'
                : 'alertmaintenancemodal_button_parcial_ok'
            }
            typeColor="primaryLight"
            title={L.alertmaintenancemodal_button_ok}
          />
        </View>
      </Modal>
    );
  }
}

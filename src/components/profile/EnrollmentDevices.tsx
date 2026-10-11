import * as React from 'react';
import {
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Panel, Separator, Loading } from '../ui';
import { Colors } from '../../resources/constants';
import { L } from '../../resources/language';
import { EnrolledDevice } from '../../api/backend/response/Enrollment';
import DeviceItem from './DeviceItem';
const moment = require('moment');

const styles = StyleSheet.create({
  panelDevices: {
    fontSize: 20,
  } as ViewStyle,
  separator: {
    marginHorizontal: 20,
  } as ViewStyle,
  textPanelDevices: {
    lineHeight: 15,
    marginBottom: 5,
    color: Colors.grey6,
  } as TextStyle,
  loadingContainer: {
    paddingVertical: 20,
  } as ViewStyle,
});

export interface EnrollmentDevicesProps extends ViewProps {
  devicesList?: any;
  openModal?: Function;
  isLoading: boolean;
}

export interface EnrollmentDevicesState {}

export default class EnrollmentDevices extends React.Component<
  EnrollmentDevicesProps,
  EnrollmentDevicesState
> {
  openModal = (
    selected: boolean,
    selectedPhoneName: string,
    deviceId: string,
    enrollmentStatus: number,
    enrollmentId: string,
    enrolledDevice: EnrolledDevice
  ) => {
    const { openModal } = this.props;
    typeof openModal === 'function' &&
      openModal(
        selected,
        selectedPhoneName,
        deviceId,
        enrollmentStatus,
        enrollmentId,
        enrolledDevice
      );
  };
  render() {
    const { devicesList, isLoading } = this.props;
    const totalItems = !!devicesList && devicesList.length;
    const currentDevice = 1;
    let i = 0;
    return (
      <Panel
        accessibilityLabel={'enrollmentdevices_panel_cellphonelist'}
        titleStyle={styles.panelDevices}
        title={L.enrollmentdevices_panel_celphonelisttitle}
        subtitle={L.enrollmentdevices_panel_celphonelistsubtitle}
        subtitleStyle={styles.textPanelDevices}
      >
        {!!devicesList &&
          devicesList.map((item: any, index: any) => {
            i++;
            let selected = currentDevice == item.currentDevice ? false : true;
            const dateMovement = moment(item.deviceDate)
              .format(L.enrollmentdevices_panel_date_format)
              .toLowerCase();
            if (isLoading) {
              return (
                <View style={styles.loadingContainer}>
                  <Loading
                    key={'key_' + index}
                    size={'small'}
                    color={Colors.primary}
                  />
                </View>
              );
            } else {
              return (
                <View key={'key_' + index}>
                  <DeviceItem
                    accessibilityLabel={'enrollmentdevices_deviceitem_element'}
                    selected={selected}
                    lastConexion={dateMovement}
                    deviceName={item.deviceModel}
                    actionName={L.enrollmentdevices_deviceitem_actionname}
                    deviceNameDescription={
                      L.enrollmentdevices_deviceitem_message
                    }
                    onPress={() =>
                      this.openModal(
                        selected,
                        item.deviceModel,
                        item.deviceId,
                        item.enrollmentStatus,
                        item.enrollmentId,
                        item
                      )
                    }
                  />
                  {i !== totalItems && <Separator style={styles.separator} />}
                </View>
              );
            }
          })}
      </Panel>
    );
  }
}

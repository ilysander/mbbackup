import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { Touchable } from '../ui';
import { TouchableProps } from '../ui/Touchable';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  info: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  infoSelected: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 6.5,
  } as ViewStyle,
  nameContainer: {
    flex: 1,
  } as ViewStyle,
  nameText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey6,
    marginTop: -3,
  } as TextStyle,
  options: {
    alignItems: 'flex-start',
  } as ViewStyle,
  deviceNameText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  takeOut: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.danger,
    fontSize: 14,
  } as TextStyle,
  deviceNameDescriptionText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey6,
  } as TextStyle,
  moreIcon: {
    tintColor: Colors.grey4,
    marginRight: 20,
    width: 32,
    height: 32,
    resizeMode: 'contain',
  } as ImageStyle,
  moreIconSelected: {
    tintColor: Colors.grey4,
    marginRight: 20,
    width: 32,
    height: 32,
    marginVertical: 12,
    resizeMode: 'contain',
  } as ImageStyle,
  activeSession: {
    ...Font({ weight: 'Medium' }),
    fontSize: 13,
    color: Colors.secondary,
    marginBottom: 6.5,
  } as TextStyle,
});

export interface DeviceItemProps extends TouchableProps {
  lastConexion: string;
  deviceName: string;
  deviceNameDescription: string;
  selected: boolean;
  actionName: string;
}

export interface DeviceItemState {}

export default class DeviceItem extends React.Component<
  DeviceItemProps,
  DeviceItemState
> {
  render() {
    const {
      lastConexion,
      deviceName,
      deviceNameDescription,
      style,
      onPress,
      selected,
      actionName,
      accessibilityLabel,
      ...props
    } = this.props;

    return (
      <Touchable
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={[styles.container, style]}
        {...props}
      >
        <Image
          accessibilityLabel={'deviceitem_image_icon'}
          style={selected ? styles.moreIcon : styles.moreIconSelected}
          source={require('../../assets/images/mobile-dark-icon.png')}
        />
        <View style={selected ? styles.info : styles.infoSelected}>
          <View style={styles.nameContainer}>
            <View style={styles.options}>
              <Text
                accessibilityLabel={'deviceitem_text_devicename'}
                style={[styles.deviceNameText]}
              >
                {deviceName}
              </Text>
              {selected ? (
                <Text
                  accessibilityLabel={'deviceitem_text_devicedescription'}
                  style={styles.deviceNameDescriptionText}
                >
                  {deviceNameDescription}
                </Text>
              ) : (
                <Text
                  accessibilityLabel={'deviceitem_text_deviceactivedescription'}
                  style={styles.activeSession}
                >
                  {L.deviceitem_text_actualcellphone}
                </Text>
              )}
              {selected && (
                <Text
                  accessibilityLabel={'deviceitem_text_lastconexion'}
                  style={styles.nameText}
                >
                  {lastConexion}
                </Text>
              )}
            </View>
          </View>
        </View>
        <Text
          accessibilityLabel={'deviceitem_text_devicename'}
          style={styles.takeOut}
        >
          {actionName}
        </Text>
      </Touchable>
    );
  }
}

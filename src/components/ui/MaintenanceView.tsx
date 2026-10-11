import * as React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageStyle,
  ViewStyle,
  TextStyle,
} from 'react-native';
import AlertMaintenanceModal from './AlertMaintenanceModal';
import Header from './Header';
import { L } from '../../resources/language';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';

const styles = StyleSheet.create({
  maintenanceBackgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  } as ImageStyle,
  maintenanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  } as ViewStyle,
  maintenanceImage: {
    width: '100%',
    height: 200,
  } as ImageStyle,
  maintenanceHeader: {
    marginBottom: 20,
    paddingTop: 0,
    marginTop: 0,
  } as ViewStyle,
  maintenanceHeaderText: {
    textAlign: 'center',
  } as TextStyle,
  maintenanceMessage: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 16,
    textAlign: 'center',
  } as TextStyle,
  content: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
});

export default class MaintenanceView extends React.Component {
  render() {
    return (
      <View style={styles.content}>
        <AlertMaintenanceModal />
        <Image
          source={require('../../assets/images/bg-linear-triangles.png')}
          style={styles.maintenanceBackgroundImage}
          resizeMode={'cover'}
        />
        <View style={styles.maintenanceContainer}>
          <Image
            source={require('../../assets/images/adn-woman-pointing-large.png')}
            resizeMode={'contain'}
            style={styles.maintenanceImage}
          />
          <Header
            accessibilityLabel={'signinscreen_header'}
            title={L.maintenance_total_title}
            titleStyle={styles.maintenanceHeaderText}
            style={styles.maintenanceHeader}
          />
          <Text style={styles.maintenanceMessage}>
            {L.maintenance_total_message}
          </Text>
        </View>
      </View>
    );
  }
}

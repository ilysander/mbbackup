/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Main from './src/Main';
import NotificationManager from './src/components/notification/NotificationManager';

NotificationManager.handleBackgroundMessage();

// console.disableYellowBox = true;
AppRegistry.registerComponent('MibancoMovil', () => Main);

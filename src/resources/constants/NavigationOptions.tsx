import {
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import * as React from 'react';

import SessionMenu from '../../components/menu/SessionMenu';
import BackIcon from '../../components/navigation/BackIcon';
import Header from '../../components/navigation/Header';

const header: (props: {
  route: RouteProp<ParamListBase, string>;
  navigation: any;
}) => NativeStackNavigationOptions = ({ navigation }) => ({
  headerLeft: () => (
    <BackIcon
      onPress={() => {
        console.log('backeando...');
        // const prevScreen = undefined

        if (typeof navigation.getParam === 'function' && navigation.getParam('prevScreen')) {
          const prevScreen = navigation.getParam('prevScreen');
          if (prevScreen) {
            navigation.navigate(prevScreen);
          }
        } else {
          navigation.goBack();
        }
      }}
    />
  ),
  header: (props: NativeStackHeaderProps) => {
    return <Header {...props} />;
  },
  headerRight: props => <SessionMenu navigation={navigation} />,
});

const NavigationOptions = {
  header,
};

export default NavigationOptions;

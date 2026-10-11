import { CommonActions } from '@react-navigation/native';
import * as React from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors as ColorsGlobal } from '../../resources/constants';
import { Size } from '../../resources/dimensions';
import { Log } from '../../resources/log';
import { SafeAreaView } from '../ui';

const Colors = ColorsGlobal as any;
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
  labelText: {
    fontSize: 16,
    flex: 1,
    color: '#000',
    fontWeight: 'bold',
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
  label: {} as TextStyle,
});

const TAG = '[ColorsScreen]';

export default class ColorsScreen extends React.Component<any, any> {
  // static navigationOptions: NavigationTabScreenOptions = {
  //   tabBarLabel: 'Colores',
  //   tabBarIcon: ({ tintColor }) => {
  //     return <Icon name={'colours'} size={25} color={tintColor || '#5671fd'} />;
  //   },
  // };

  state: any = {
    colors: [
      '#00964B',
      '#65AF47',
      '#4EB9C4',
      '#E88038',
      '#E0A745',
      '#D4192F',
      '#434A54',
      '#656D78',
      '#AAB2BD',
      '#CCD1D9',
      '#E6E9ED',
      '#F5F7FA',
      '#FFFFFF',
      '#DFBBB1',
      '#F56476',
      '#E43F6F',
      '#B33951',
      '#E3D081',
      '#91C7B1',
      '#008DD5',
      '#3066BE',
      '#119DA4',
      '#91C7B1',
      '#AEECEF',
      '#54494B',
      '#F1F7ED',
    ],
  };

  getKey = (item: any) => {
    return `item_${item}`;
  };

  showAlert = (message: any) => {
    Alert.alert('Alerta', message, [{ text: 'OK' }]);
  };

  updateValue = (item: any, value: any, update = false) => {
    Log.debug(TAG, 'updateValue', item, value);
    const key = this.getKey(item);
    const newState: any = {};
    if (typeof value === 'undefined') {
      newState[key] = undefined;
    } else {
      newState[key] =
        typeof value === 'boolean'
          ? value
          : value
            .toString()
            .toLowerCase()
            .trim();
    }
    this.setState(newState);

    if (update) {
      if (typeof value === 'undefined') {
        delete Colors[item];
      } else {
        Colors[item] = value;
      }
    }
  };

  navigate = (route: any) => {
    const navigateAction = CommonActions.navigate({
      name: route,
      params: {},
    });
    const navigation = this.props.screenProps.navigation();
    navigation.dispatch(navigateAction);
  };

  render() {
    const blocks: any = [];
    const { colors } = this.state;

    Object.keys(Colors).forEach(item => {
      const originalValue = Colors[item];
      const key = this.getKey(item);
      if (typeof this.state[key] === 'undefined') {
        this.updateValue(item, originalValue);
      }

      blocks.push(
        <View key={key}>
          <View style={styles.label}>
            <Text style={styles.labelText}>{item}:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {colors.map((color: any, index: number) => {
                return (
                  <TouchableOpacity
                    hitSlop={{ bottom: 5, top: 5, right: 5, left: 5 }}
                    key={index.toString()}
                    onPress={() => {
                      this.updateValue(item, color, true);
                    }}
                    style={{ marginRight: 5, marginTop: 5, marginBottom: 5 }}
                  >
                    <View
                      style={{ width: 20, height: 20, backgroundColor: color }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <TextInput
            autoCorrect={false}
            placeholder={item}
            style={[styles.textInput, { color: this.state[key] || 'black' }]}
            defaultValue={originalValue.toString()}
            returnKeyType={'done'}
            blurOnSubmit
            value={this.state[key] || ''}
            onChangeText={value => {
              this.updateValue(item, value);
            }}
            onSubmitEditing={() => {
              let value = this.state[key] || '';
              try {
                Log.debug(
                  TAG,
                  'onSubmitEditing',
                  'new value for',
                  `[Colors.${item}]`,
                  ':',
                  originalValue,
                  ' => ',
                  value
                );
              } catch (e) {
                this.showAlert((e as any).message);
                value = originalValue;
              }

              this.updateValue(item, value, true);
            }}
          />
        </View>
      );
    });

    const { screenProps } = this.props;

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
              {blocks.map((item: any) => {
                return item;
              })}
            </View>
          </SafeAreaView>
        </ScrollView>
        <View style={{ padding: 10 }}>
          <Button
            onPress={() => {
              this.navigate('Splash');
              screenProps.toggle();
            }}
            title={'Aplicar cambios'}
          />
        </View>
      </View>
    );
  }
}

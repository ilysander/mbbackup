import * as React from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import ConfigGlobal from '../../Config';
import { Size } from '../../resources/dimensions';
import { Log } from '../../resources/log';
import { SafeAreaView } from '../ui';

let Config = ConfigGlobal as any;
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
    fontSize: 12,
    flex: 1,
    color: '#999',
    fontWeight: '400',
  } as TextStyle,
  section: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingLeft: 0,
  } as ViewStyle,
  textInput: {
    fontSize: 14,
    padding: 10,
    borderColor: '#d4d4d4',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 14,
    backgroundColor: '#fff',
  } as TextStyle,
  switch: {
    marginBottom: 14,
  } as ViewStyle,
  title: {
    fontSize: 16,
    color: '#5671fd',
    fontWeight: '600',
  } as TextStyle,
  label: {} as TextStyle,
});

const TAG = '[SettingsScreen]';

export default class SettingsScreen extends React.Component<any, any> {
  // static navigationOptions: NavigationTabScreenOptions = {
  //   tabBarLabel: 'Configuración',
  //   tabBarIcon: ({ tintColor }) => {
  //     return <Icon name={'battery'} size={25} color={tintColor || '#5671fd'} />;
  //   },
  // };

  state: any = {};

  getKey = (category: any, item: any) => {
    return `item_${category}_${item}`;
  };

  showAlert = (message: any) => {
    Alert.alert('Alerta', message, [{ text: 'OK' }]);
  };

  updateValue = (category: any, item: any, value: any, update = false) => {
    // Log.debug(TAG, 'updateValue', category, item, value);

    try {
      const key = this.getKey(category, item);
      const newState: any = {};
      if (typeof value === 'undefined') {
        newState[key] = undefined;
      } else {
        newState[key] =
          typeof value === 'boolean' ? value : value.toString().trim();
      }
      this.setState(newState);

      if (update) {
        if (typeof value === 'undefined') {
          //TODO: Se va eliminar
          Config[category][item] = undefined;
          delete Config[category][item];
        } else {
          Config[category][item] = value;
        }
      }
    } catch (error) {
      console.warn('Ocurrio un error al intentar:', error);
    }
  };

  /* NOSONAR */
  getOptionsByType = (category: any) => {
    if (category === 'mutualAuth') {
      return (
        <View
          key={`section_options_${category}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 5,
          }}
        >
          {typeof Config[category].cert !== 'undefined' && (
            <Button
              title="Desactivar mutual Auth"
              accessibilityLabel={`config_category_${category
                .toString()
                .toLowerCase()}_btn_off`}
              onPress={() => {
                this.updateValue(category, 'cert', undefined, true);
                this.updateValue(category, 'password', undefined, true);
              }}
            />
          )}
          {typeof Config[category].cert === 'undefined' && (
            <Button
              title="Activar mutual Auth"
              accessibilityLabel={`config_category_${category
                .toString()
                .toLowerCase()}_btn_on`}
              onPress={() => {
                this.updateValue(category, 'cert', '', true);
                this.updateValue(category, 'password', '', true);
              }}
            />
          )}
        </View>
      );
    }
    if (category === 'sslPinning') {
      const hasCert =
        typeof Config[category].cert !== 'undefined' ||
        typeof Config[category].certs !== 'undefined';
      return (
        <View
          key={`section_options_${category}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 5,
          }}
        >
          {hasCert && (
            <Button
              title="Desactivar SSL Pinning"
              accessibilityLabel={`config_category_${category
                .toString()
                .toLowerCase()}_btn_off`}
              onPress={() => {
                this.updateValue(category, 'cert', undefined, true);
                this.updateValue(category, 'certs', undefined, true);
              }}
            />
          )}
          {!hasCert && (
            <Button
              title="Activar SSL Pinning"
              accessibilityLabel={`config_category_${category
                .toString()
                .toLowerCase()}_btn_on`}
              onPress={() => {
                this.updateValue(category, 'cert', '', true);
              }}
            />
          )}
        </View>
      );
    }
    if (category === 'server') {
      return (
        <View
          key={`section_options_${category}`}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
          }}
        >
          <View style={{ width: '20%' }}>
            <Button
              title="DEV"
              accessibilityLabel={`config_category_${category
                .toString()
                .toLowerCase()}_btn_dev`}
              onPress={() => {
                this.updateValue(
                  category,
                  'url',
                  'https://bmesrvd755.domibco.com.pe:8443/api',
                  true
                );
                this.updateValue('sslPinning', 'certs', undefined, true);
                this.updateValue(
                  'sslPinning',
                  'cert',
                  `MIIDnjCCAoagAwIBAgIQGxrAsEOySZZDe1YfupB23jANBgkqhkiG9w0BAQsFADBX
      MRIwEAYKCZImiZPyLGQBGRYCcGUxEzARBgoJkiaJk/IsZAEZFgNjb20xFzAVBgoJ
      kiaJk/IsZAEZFgdkb21pYmNvMRMwEQYDVQQDEwpDQSBNaWJhbmNvMB4XDTE1MDcx
      NjE3MDgwNVoXDTMwMDcxNjE3MTgwNFowVzESMBAGCgmSJomT8ixkARkWAnBlMRMw
      EQYKCZImiZPyLGQBGRYDY29tMRcwFQYKCZImiZPyLGQBGRYHZG9taWJjbzETMBEG
      A1UEAxMKQ0EgTWliYW5jbzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
      AMgxlbU9CnlkcwQfAtknJZBx94byrSBF8SsJh7GrMNT0xBpf0JPV9mSPtJzD4VtU
      2obCcG7h59f7VeK1FbNgZDo9OqX8z8VAstjxM5fzQ4I+gGvZbUu7vYQlS0gkM9Cj
      wbgsTkzHZs5e6UBQ9X86UluNOgxze6TSWYOWV8HLSDgqUJU6cDsA0Ry5/uguf0ow
      1yEB1uLvhYiSpzs3Da/n2U80YgtjBUY1h/9kxl6mIQMqcN7NLSKqsxgtdWbcqm4Q
      P/se7eITQcot8Q8YgsU9hNnoQhlLiON9k91jR7xF8Ev3S614RYd+jSbeUMgXuRIu
      YL+am/sUNk90i431AQVnaoECAwEAAaNmMGQwEwYJKwYBBAGCNxQCBAYeBABDAEEw
      CwYDVR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFFsvbXnbRNVI
      Tcju589wXc8qB1TZMBAGCSsGAQQBgjcVAQQDAgEAMA0GCSqGSIb3DQEBCwUAA4IB
      AQAfHgJ5M20k3ykgkE62bzlTXtcGsoy4UayEw4lg2thXwDZr6XhuWf/as0j+3Flm
      HALjtGUeRCfwJ80pUt61US9Ncj7GPQq46zqEBKwDRHCqCd+u+32LvuRNwdvNu/uM
      kt4j6qGo+A1rrXKAvqcQgu589E9Bafdr0UsINdrnTmDr/ZYx2RRaK4tXw0C8gJEn
      IVa1V4Rgkc440S7WWRoJzISulJ3WAjmOAwLtTf1QMqk1yO+U5rOyiiiDx6dKfPfv
      FtiTbeydEtU38CB2jgmu93zsfEsVh4zZIvlJV8gzexuKxcytOmFyofBDL78DXepn
      HOmZY/VcwhRHIpK+5I+tbMzf`.replace(/\r?\n|\r|\s/g, ''),
                  true
                );
              }}
            />
          </View>
          <View style={{ width: '20%' }}>
            <Button
              title="QA"
              accessibilityLabel={`config_category_${category
                .toString()
                .toLowerCase()}_btn_qa`}
              onPress={() => {
                this.updateValue(
                  category,
                  'url',
                  'https://zonaseguraqamovil.domibco.com.pe/api',
                  true
                );
                this.updateValue('sslPinning', 'certs', undefined, true);
                this.updateValue(
                  'sslPinning',
                  'cert',
                  `MIIDnjCCAoagAwIBAgIQGxrAsEOySZZDe1YfupB23jANBgkqhkiG9w0BAQsFADBX
      MRIwEAYKCZImiZPyLGQBGRYCcGUxEzARBgoJkiaJk/IsZAEZFgNjb20xFzAVBgoJ
      kiaJk/IsZAEZFgdkb21pYmNvMRMwEQYDVQQDEwpDQSBNaWJhbmNvMB4XDTE1MDcx
      NjE3MDgwNVoXDTMwMDcxNjE3MTgwNFowVzESMBAGCgmSJomT8ixkARkWAnBlMRMw
      EQYKCZImiZPyLGQBGRYDY29tMRcwFQYKCZImiZPyLGQBGRYHZG9taWJjbzETMBEG
      A1UEAxMKQ0EgTWliYW5jbzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
      AMgxlbU9CnlkcwQfAtknJZBx94byrSBF8SsJh7GrMNT0xBpf0JPV9mSPtJzD4VtU
      2obCcG7h59f7VeK1FbNgZDo9OqX8z8VAstjxM5fzQ4I+gGvZbUu7vYQlS0gkM9Cj
      wbgsTkzHZs5e6UBQ9X86UluNOgxze6TSWYOWV8HLSDgqUJU6cDsA0Ry5/uguf0ow
      1yEB1uLvhYiSpzs3Da/n2U80YgtjBUY1h/9kxl6mIQMqcN7NLSKqsxgtdWbcqm4Q
      P/se7eITQcot8Q8YgsU9hNnoQhlLiON9k91jR7xF8Ev3S614RYd+jSbeUMgXuRIu
      YL+am/sUNk90i431AQVnaoECAwEAAaNmMGQwEwYJKwYBBAGCNxQCBAYeBABDAEEw
      CwYDVR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFFsvbXnbRNVI
      Tcju589wXc8qB1TZMBAGCSsGAQQBgjcVAQQDAgEAMA0GCSqGSIb3DQEBCwUAA4IB
      AQAfHgJ5M20k3ykgkE62bzlTXtcGsoy4UayEw4lg2thXwDZr6XhuWf/as0j+3Flm
      HALjtGUeRCfwJ80pUt61US9Ncj7GPQq46zqEBKwDRHCqCd+u+32LvuRNwdvNu/uM
      kt4j6qGo+A1rrXKAvqcQgu589E9Bafdr0UsINdrnTmDr/ZYx2RRaK4tXw0C8gJEn
      IVa1V4Rgkc440S7WWRoJzISulJ3WAjmOAwLtTf1QMqk1yO+U5rOyiiiDx6dKfPfv
      FtiTbeydEtU38CB2jgmu93zsfEsVh4zZIvlJV8gzexuKxcytOmFyofBDL78DXepn
      HOmZY/VcwhRHIpK+5I+tbMzf`.replace(/\r?\n|\r|\s/g, ''),
                  true
                );
              }}
            />
          </View>
          <View style={{ width: '20%' }}>
            <Button
              title="PROD"
              accessibilityLabel={`config_category_${category
                .toString()
                .toLowerCase()}_btn_prod`}
              onPress={() => {
                this.updateValue(
                  category,
                  'url',
                  'https://zonasegura.mibanco.com.pe/api',
                  true
                );
                this.updateValue('sslPinning', 'certs', undefined, true);
                this.updateValue(
                  'sslPinning',
                  'cert',
                  `MIIDxTCCAq2gAwIBAgIQAqxcJmoLQJuPC3nyrkYldzANBgkqhkiG9w0BAQUFADBs
      MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
      d3cuZGlnaWNlcnQuY29tMSswKQYDVQQDEyJEaWdpQ2VydCBIaWdoIEFzc3VyYW5j
      ZSBFViBSb290IENBMB4XDTA2MTExMDAwMDAwMFoXDTMxMTExMDAwMDAwMFowbDEL
      MAkGA1UEBhMCVVMxFTATBgNVBAoTDERpZ2lDZXJ0IEluYzEZMBcGA1UECxMQd3d3
      LmRpZ2ljZXJ0LmNvbTErMCkGA1UEAxMiRGlnaUNlcnQgSGlnaCBBc3N1cmFuY2Ug
      RVYgUm9vdCBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMbM5XPm
      +9S75S0tMqbf5YE/yc0lSbZxKsPVlDRnogocsF9ppkCxxLeyj9CYpKlBWTrT3JTW
      PNt0OKRKzE0lgvdKpVMSOO7zSW1xkX5jtqumX8OkhPhPYlG++MXs2ziS4wblCJEM
      xChBVfvLWokVfnHoNb9Ncgk9vjo4UFt3MRuNs8ckRZqnrG0AFFoEt7oT61EKmEFB
      Ik5lYYeBQVCmeVyJ3hlKV9Uu5l0cUyx+mM0aBhakaHPQNAQTXKFx01p8VdteZOE3
      hzBWBOURtCmAEvF5OYiiAhF8J2a3iLd48soKqDirCmTCv2ZdlYTBoSUeh10aUAsg
      EsxBu24LUTi4S8sCAwEAAaNjMGEwDgYDVR0PAQH/BAQDAgGGMA8GA1UdEwEB/wQF
      MAMBAf8wHQYDVR0OBBYEFLE+w2kD+L9HAdSYJhoIAu9jZCvDMB8GA1UdIwQYMBaA
      FLE+w2kD+L9HAdSYJhoIAu9jZCvDMA0GCSqGSIb3DQEBBQUAA4IBAQAcGgaX3Nec
      nzyIZgYIVyHbIUf4KmeqvxgydkAQV8GK83rZEWWONfqe/EW1ntlMMUu4kehDLI6z
      eM7b41N5cdblIZQB2lWHmiRk9opmzN6cN82oNLFpmyPInngiK3BD41VHMWEZ71jF
      hS9OMPagMRYjyOfiZRYzy78aG6A9+MpeizGLYAiJLQwGXFK3xPkKmNEVX58Svnw2
      Yzi9RKR/5CYrCsSXaQ3pjOLAEFe4yHYSkVXySGnYvCoCWw9E1CAx2/S6cCZdkGCe
      vEsXCS+0yx5DaMkHJ8HSXPfqIbloEpw8nL+e/IBcm2PN7EeqJSdnoDfzAIJ9VNep
      +OkuE6N36B9K`.replace(/\r?\n|\r|\s/g, ''),
                  true
                );
              }}
            />
          </View>
          <View style={{ width: '20%' }}>
            <Button
              title="EJEM"
              accessibilityLabel={`config_category_${category
                .toString()
                .toLowerCase()}_btn_ejem`}
              onPress={() => {
                this.updateValue(
                  category,
                  'url',
                  'https://zonaqa.ejemplo.cc/integracion-hbk-app/v1',
                  true
                );
                this.updateValue('sslPinning', 'certs', undefined, true);
                this.updateValue('sslPinning', 'cert', undefined, true);

                this.updateValue('mutualAuth', 'cert', undefined, true);
                this.updateValue('mutualAuth', 'password', undefined, true);

                this.setState({});
              }}
            />
          </View>
          <View style={{ width: '20%' }}>
            <Button
              title="Demo"
              accessibilityLabel={`config_category_${category
                .toString()
                .toLowerCase()}_btn_demo`}
              onPress={() => {
                this.updateValue(category, 'url', 'demo', true);
                this.updateValue('sslPinning', 'certs', undefined, true);
                this.updateValue('sslPinning', 'cert', undefined, true);
              }}
            />
          </View>
        </View>
      );
    }
    return null;
  };

  render() {
    const blocks: any = [];
    Object.keys(Config).forEach(category => {
      blocks.push(
        <View style={styles.section} key={`section_${category}`}>
          <Text style={styles.title}>{category}</Text>
        </View>
      );
      Object.keys(Config[category]).forEach(item => {
        const originalValue = Config[category][item];
        const key = this.getKey(category, item);
        if (typeof this.state[key] === 'undefined') {
          this.updateValue(category, item, originalValue);
        }

        blocks.push(
          <View key={key}>
            <View style={styles.label}>
              <Text style={styles.labelText}>{item}:</Text>
            </View>
            {typeof originalValue === 'boolean' && (
              <View style={styles.switch}>
                <Switch
                  value={this.state[key]}
                  onValueChange={value => {
                    this.updateValue(category, item, value, true);
                  }}
                />
              </View>
            )}
            {typeof originalValue !== 'boolean' && (
              <TextInput
                autoCorrect={false}
                placeholder={item}
                style={styles.textInput}
                defaultValue={originalValue.toString()}
                returnKeyType={'done'}
                blurOnSubmit
                value={this.state[key] || ''}
                accessibilityLabel={`config_category_${category.toLowerCase()}_${item.toLowerCase
                  }_input`}
                onChangeText={value => {
                  this.updateValue(category, item, value);
                }}
                onSubmitEditing={() => {
                  let value = this.state[key] || '';
                  try {
                    value =
                      typeof originalValue === 'number'
                        ? parseInt(value, 10)
                        : value;
                    if (typeof originalValue === 'number' && isNaN(value)) {
                      value = originalValue;
                    }
                    Log.debug(
                      TAG,
                      'onSubmitEditing',
                      'new value for',
                      `[Config.${category}.${item}]`,
                      ':',
                      originalValue,
                      ' => ',
                      value
                    );
                  } catch (e) {
                    this.showAlert((e as any).message);
                    value = originalValue;
                  }

                  this.updateValue(category, item, value, true);
                }}
              />
            )}
          </View>
        );
      });

      const options = this.getOptionsByType(category);
      options && blocks.push(options);
    });

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
      </View>
    );
  }
}

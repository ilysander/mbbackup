import * as React from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle } from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import API from '../../../../api';
import {
  Container,
  Content,
  Header,
  KeyboardAvoidingView,
  LoadingOverlay,
  NetworkStatusAlert,
  SafeAreaView,
} from '../../../../components/ui';
import {
  Colors,
  Currencies,
  ErrorRequest,
} from '../../../../resources/constants';
import { Sanitizer, Validate, Font } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import IconButton from '../../../../components/ui/IconButton';
import {
  ServiceCategory,
  AccountItemSavingsAll,
} from '../../../../api/backend/response/Execute';
import { Size } from '../../../../resources/dimensions';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 40,
  } as ViewStyle,
  headerTitle: {
    fontSize: 26,
    lineHeight: 30,
  } as TextStyle,
  loadingOverlay: {
    backgroundColor: Colors.grey1,
  } as ViewStyle,
  category: {
    padding: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  } as ViewStyle,
  titleStyle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  } as TextStyle,
  imageButtonContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    marginBottom: 30,
  } as ViewStyle,
});

const TAG = '[PaymentsServicesChooseCategoryScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  serviceCategories: ServiceCategory[];
  accounts: AccountItemSavingsAll[];
}

class PaymentsServicesChooseCategoryScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsserviceschoosecategoryscreen_title,
  // };

  state: State = {
    isLoading: false,
    serviceCategories: [],
    accounts: [],
  };

  componentDidMount() {
    this.load();
  }

  load = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      const response = await API.Execute.servicepaymentsPre();
      if (response.body.code === API.ResponseCode.OK) {
        const { serviceCategories } = response.body.data;
        this.setState({
          serviceCategories: serviceCategories || [],
        });
        await this.loadAccounts();
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'load',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.info(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
    this.setState({
      isLoading: false,
    });
  };

  onPress = async (serviceCategory: ServiceCategory) => {
    const { navigation } = this.props;
    const { accounts } = this.state;
    this.setState({
      isLoading: true,
    });
    const hasAccountsValidAccount = accounts.some(
      account => account.currency === Currencies.PEN.label
    );
    if (hasAccountsValidAccount) {
      navigation.navigate('PaymentsServicesChooseProvider', {
        serviceCategory,
      });
    } else {
      navigation.navigate('PaymentsServicesValidAccountNotFound');
    }
    this.setState({
      isLoading: false,
    });
  };

  loadAccounts = async () => {
    try {
      const response = await API.Execute.accountList();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadAccounts', response);
      }
      const { accounts } = response.body.data;
      this.setState({
        accounts,
      });
    } catch (e) {
      Log.info(TAG, 'loadAccounts', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadAccounts',
        e,
      });
    }
  };

  render() {
    const { serviceCategories, isLoading } = this.state;
    const { isFocused } = this.props;
    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <LoadingOverlay
            isLoading={isLoading}
            duration={isLoading ? 0 : 100}
            style={styles.loadingOverlay}
          />
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert />
              <Header
                style={styles.header}
                accessibilityLabel={
                  'paymentsserviceschoosecategoryscreen_header_title'
                }
                center
                title={L.paymentsserviceschoosecategoryscreen_header_title}
                titleStyle={styles.headerTitle}
              />
              <View style={styles.imageButtonContainer}>
                {serviceCategories.map(serviceCategory => {
                  const sourceIcon = Validate.getIconResourceByCategory(
                    serviceCategory.name
                  );
                  return (
                    <IconButton
                      key={serviceCategory.code}
                      accessibilityLabel={
                        'paymentsserviceschoosecategoryscreen_iconbutton_category'
                      }
                      onPress={() => {
                        this.onPress(serviceCategory);
                      }}
                      style={styles.category}
                      source={sourceIcon}
                    >
                      <Text
                        accessibilityLabel={
                          'paymentsserviceschoosecategoryscreen_text_category'
                        }
                        style={styles.titleStyle}
                      >
                        {Sanitizer.firstCase(
                          serviceCategory.name.toLowerCase()
                        )}
                      </Text>
                    </IconButton>
                  );
                })}
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsServicesChooseCategoryScreenType = PaymentsServicesChooseCategoryScreen;
export default withFocused<PaymentsServicesChooseCategoryScreen, Props>(
  PaymentsServicesChooseCategoryScreen
);

import * as React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Image,
  Text,
  TextStyle,
  ImageStyle,
  ScrollView,
  InteractionManager,
} from 'react-native';
import API from '../../../../api';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  KeyboardAvoidingView,
  LoadingOverlay,
  MessageCenter,
  NetworkStatusAlert,
  SafeAreaView,
  ItemSelector,
  TextInput,
  CardView,
} from '../../../../components/ui';

import { Colors, ErrorRequest } from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Validate, Font, Sanitizer } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { KeyboardUtil } from '../../../../resources/util';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import {
  ServiceCategory,
  CompanyService,
  Company,
} from '../../../../api/backend/response/Execute';
import NetworkManager from '../../../../components/network/NetworkManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
const styles = StyleSheet.create({
  messageItem: {
    marginTop: 10,
  } as ViewStyle,
  containerTitle: {
    flex: 1,
    marginLeft: 5,
  } as ViewStyle,
  title: {
    ...Font({ weight: 'Bold' }),
    fontSize: 26,
    lineHeight: 35,
    color: Colors.primary,
  } as TextStyle,
  titleDescription: {
    ...Font({ weight: 'Medium' }),
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  detailsContainer: {
    marginTop: 10,
  } as ViewStyle,
  scheduleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  } as ViewStyle,
  textSchedule: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.brown,
    fontSize: 13,
    lineHeight: 15,
  } as TextStyle,
  supplyContainer: {
    alignItems: 'center',
  } as ViewStyle,
  supplyTitle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  supplyCode: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  containerSupplyCode: {
    marginTop: 4,
    marginBottom: 0,
  } as ViewStyle,
  imageIcon: {
    width: 60,
    height: 60,
    tintColor: Colors.primary,
  } as ImageStyle,
  serviceContainer: {
    flexDirection: 'row',
    marginTop: 10,
  } as ViewStyle,
  supplyContainerText: {
    width: '100%',
    marginBottom: 20,
  } as ViewStyle,
  button: {
    marginBottom: 40,
    height: 50,
  } as ViewStyle,
  cardView: {
    marginVertical: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  } as ViewStyle,
  itemSelectorFix: {
    marginBottom: 20,
  } as ViewStyle,
  selectorService: {
    marginTop: 20,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
  } as TextStyle,
});

const TAG = '[PaymentsServicesChooseProviderScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  services: CompanyService[];
  companies: Company[];
  indexCompany: number;
  readOnlyCompany: boolean;
  indexService: number;
  readOnlyService: boolean;
  isValid: boolean;
  isLoading: boolean;
  isLoadingData: boolean;
  serviceCategory?: ServiceCategory;
}

class PaymentsServicesChooseProviderScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsserviceschooseproviderscreen_title,
  // };

  state: State = {
    services: [],
    companies: [],
    indexCompany: -1,
    indexService: -1,
    isValid: false,
    isLoading: false,
    isLoadingData: false,
    readOnlyCompany: false,
    readOnlyService: true,
  };

  selectCompany!: ItemSelector | null;
  selectService!: ItemSelector | null;
  // navigation!: NavigationContainerComponent | null;
  message!: MessageCenter | null;
  supply!: TextInput | null;
  scroll!: ScrollView | null;

  getCompany = (): Company | undefined => {
    const { companies, indexCompany } = this.state;
    if (indexCompany < 0) {
      return;
    }
    return companies[indexCompany];
  };
  getService = (): CompanyService | undefined => {
    const { services, indexService } = this.state;
    if (indexService < 0) {
      return;
    }
    return services[indexService];
  };

  componentDidMount() {
    this.loadCompanies();
  }

  getAccountsValid = () => {
    const { companies } = this.state;
    return companies;
  };

  isValid = () => {
    const { isValid } = this.state;
    return isValid && NetworkManager.isConnected;
  };

  tryToSubmit = async () => {
    const isValid = this.isValid();
    if (!isValid) {
      return;
    }
    this.blur();
    this.scrollToEnd();
    this.setState({ isLoading: true });
    await this.submit();
    this.setState({ isLoading: false });
  };

  scrollToEnd = () => {
    InteractionManager.runAfterInteractions(() => {
      this.scroll && this.scroll.scrollToEnd();
    });
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };

  submit = async () => {
    try {
      const { navigation } = this.props;
      const { serviceCategory } = this.state;
      if (!serviceCategory) {
        return;
      }
      const company = this.getCompany();
      if (!company) {
        return;
      }
      const service = this.getService();
      if (!serviceCategory || !service) {
        return;
      }
      const supply = this.supply ? this.supply.getValue() : '';
      const formData = {
        totalAmount: '0',
        category: serviceCategory.code,
        codigoempresa: company.code,
        nombreempresa: '',
        codigogrupoempresa: company.groupCodeCompany,
        company: company.code,
        codigoservicio: service.code,
        nombreservicio: service.name,
        service: service.code,
        supply,
      };

      const response = await API.Execute.servicePaymentBillsList(formData);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
        return;
      }

      const body = response.body;
      if (body.code === API.ResponseCode.OK) {
        const { bills, error, error_message } = body.data;
        if (error) {
          this.supply && this.supply.setError(error_message);
        } else if (bills.length > 0) {
          const supplyLabel = service.message;
          navigation.navigate('PaymentsServicesChooseBill', {
            bills,
            supplyLabel,
            supply,
          });
        } else if (bills.length === 0) {
          navigation.navigate('PaymentsServicesBillUpToDate');
        }
        return;
      }
      if (body.code === API.ResponseCode.INVALID) {
        const { supply } = body.data;
        this.supply && this.supply.setError(supply);
        return;
      }
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e: ErrorRequest.Default,
      });
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  blur = () => {
    KeyboardUtil.hide();
  };

  loadCompanies = async () => {
    const { route } = this.props;
    const serviceCategory = route.params && route.params.serviceCategory;//navigation.getParam('serviceCategory');
    this.setState({ isLoadingData: true, serviceCategory });
    try {
      const response = await API.Execute.servicepaymentsGetCompanies(
        serviceCategory.code
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadCompanies', response);
      }
      const { serviceCompanies } = response.body.data;
      this.setState({ companies: serviceCompanies || [] });
      this.validateOneCompany();
    } catch (e) {
      Log.info(TAG, 'loadCompanies', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadCompanies',
        e,
      });
      this.setState({ isLoadingData: false });
    }
  };
  validateOneCompany = () => {
    const { companies } = this.state;
    const isOneCompany = companies.length === 1;
    this.setState({ readOnlyCompany: isOneCompany });
    if (isOneCompany) {
      this.changeCompany(0);
    } else {
      this.setState({ isLoadingData: false });
    }
  };
  loadServices = async (company: any) => {
    const { isLoadingData, serviceCategory } = this.state;
    if (isLoadingData) {
      Log.info(TAG, 'loadServices', 'now already isLoading');
      return;
    }
    if (!serviceCategory) {
      return;
    }
    this.setState({ isLoadingData: true });
    try {
      const response = await API.Execute.servicepaymentsGetServices(
        serviceCategory.code,
        company.code
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadServices', response);
      }
      const { services = [] } = response.body.data;
      if (services.length > 0) {
        this.setState({ services });
        this.validateOneService();
      }
    } catch (e) {
      Log.info(TAG, 'loadServices', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadServices',
        e,
      });
    }
    this.setState({ isLoadingData: false });
  };

  validateOneService = () => {
    const { services } = this.state;
    const isOneService = services.length === 1;
    this.setState({ isLoadingData: false, readOnlyService: isOneService });
    if (isOneService) {
      this.changeService(0);
    }
  };

  changeCompany = (indexCompany: number) => {
    this.setState(
      {
        indexCompany,
        services: [],
        indexService: -1,
        isValid: false,
        isLoadingData: false,
      },
      () => {
        this.isValidCompany();
      }
    );
  };

  isValidCompany = () => {
    this.selectCompany && this.selectCompany.clearError();
    const company = this.getCompany();
    if (!company) {
      return false;
    }
    this.loadServices(company);
    return true;
  };

  changeService = (indexService: number) => {
    this.supply && this.supply.setValue('');

    this.setState({ indexService, isValid: false }, () => {
      this.supply && this.supply.focus();
      this.isValidService();
    });
    this.clearSupplyError();
  };

  isValidService = () => {
    this.selectService && this.selectService.clearError();
    const service = this.getService();
    return !!service;
  };

  onChangeSupply = (value: string) => {
    this.setState({ isValid: value.trim() !== '' });
    this.clearSupplyError();
  };

  clearSupplyError = () => this.supply && this.supply.clearError();

  render() {
    const {
      isLoading,
      indexCompany,
      indexService,
      companies,
      services,
      isLoadingData,
      isValid,
      serviceCategory,
    } = this.state;
    const { isFocused } = this.props;

    const service = services[indexService];
    const schedule = service ? service.schedule : undefined;
    const scheduleFormated = Sanitizer.formatSchedule(schedule);
    const keyboardType = service
      ? Validate.getKeyboardType(service.inputValidation)
      : undefined;
    const formatText = service
      ? Validate.getFormatText(service.inputValidation)
      : undefined;
    const message = service ? (service.message || '').toLowerCase() : '';
    const maxLength = service ? parseInt(service.maxLength, 10) : 40;
    return (
      <Container>
        <LoadingOverlay
          isLoading={isLoadingData}
          duration={isLoadingData ? 0 : 100}
        />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          ref={ref => {
            this.scroll = ref;
          }}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert />
              <MessageCenter
                style={styles.messageItem}
                accessibilityLabel={
                  'paymentsserviceschooseproviderscreen_messagecenter'
                }
                ref={ref => {
                  this.message = ref;
                }}
              />

              {serviceCategory && (
                <View style={styles.serviceContainer}>
                  <Image
                    source={Validate.getIconResourceByCategory(
                      serviceCategory.name
                    )}
                    style={styles.imageIcon}
                    resizeMode={'contain'}
                  />
                  <View style={styles.containerTitle}>
                    <Text style={styles.title}>
                      {Sanitizer.firstCase(serviceCategory.name.toLowerCase())}
                    </Text>
                    <Text style={styles.titleDescription}>
                      {
                        L.paymentsserviceschooseproviderscreen_subtitle_description
                      }
                    </Text>
                  </View>
                </View>
              )}

              <CardView style={styles.cardView}>
                <ItemSelector
                  accessibilityLabel={
                    'paymentsserviceschooseproviderscreen_itemselector_company'
                  }
                  ref={ref => {
                    this.selectCompany = ref;
                  }}
                  placeholder={
                    L.paymentsserviceschooseproviderscreen_itemselector_company_ph
                  }
                  title={
                    L.paymentsserviceschooseproviderscreen_itemselector_company_tm
                  }
                  values={companies.map(company => Sanitizer.getName(company))}
                  selectedIndex={indexCompany}
                  onPress={this.changeCompany}
                />
                {indexCompany > -1 && (
                  <ItemSelector
                    accessibilityLabel={
                      'paymentsserviceschooseproviderscreen_itemselector_service'
                    }
                    ref={ref => {
                      this.selectService = ref;
                    }}
                    placeholder={
                      L.paymentsserviceschooseproviderscreen_itemselector_service_ph
                    }
                    title={
                      L.paymentsserviceschooseproviderscreen_itemselector_service_tm
                    }
                    values={services.map(service => Sanitizer.getName(service))}
                    selectedIndex={indexService}
                    onPress={this.changeService}
                    style={styles.selectorService}
                  />
                )}
                {indexService > -1 ? (
                  <View style={styles.detailsContainer}>
                    {!!scheduleFormated && (
                      <View style={styles.scheduleContainer}>
                        <Text style={styles.textSchedule}>
                          {
                            L.paymentsserviceschooseproviderscreen_schedule_description
                          }
                          {scheduleFormated}
                        </Text>
                      </View>
                    )}

                    <View style={styles.detailsContainer}>
                      <Text style={styles.supplyTitle}>
                        {L.paymentsserviceschooseproviderscreen_supply_title}
                        {message}
                      </Text>
                      <View style={styles.supplyContainerText}>
                        <TextInput
                          accessibilityLabel={
                            'paymentsserviceschooseproviderscreen_textinput_supply'
                          }
                          style={styles.supplyCode}
                          containerStyle={styles.containerSupplyCode}
                          ref={ref => {
                            this.supply = ref;
                          }}
                          blurOnSubmit
                          autoCorrect={false}
                          returnKeyType={'done'}
                          autoComplete={'off'}
                          autoCapitalize={'characters'}
                          focusMode={'top'}
                          focusOffset={-40}
                          onChangeText={this.onChangeSupply}
                          showClearButton={false}
                          formatText={formatText}
                          keyboardType={keyboardType}
                          maxLength={maxLength}
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.itemSelectorFix} />
                )}
              </CardView>
              <Button
                textStyle={styles.buttonText}
                style={styles.button}
                disabled={!isValid}
                accessibilityLabel={
                  'paymentsserviceschooseproviderscreen_button_continue'
                }
                onPress={this.tryToSubmit}
                loading={isLoading}
                title={L.paymentsserviceschooseproviderscreen_button_continue}
                big
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsServicesChooseProviderScreenType = PaymentsServicesChooseProviderScreen;
export default withFocused<PaymentsServicesChooseProviderScreen, Props>(
  PaymentsServicesChooseProviderScreen
);

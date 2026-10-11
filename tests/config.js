import NetworkManager from '../src/components/network/NetworkManager';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
jest.useFakeTimers();

let mockDate;
beforeAll(() => {
  NetworkManager.isConnected = true;
  mockDate = jest.spyOn(Date, 'now').mockImplementation(() => 1514808000000);
});
afterAll(() => {
  mockDate && mockDate.mockRestore();
});
afterEach(() => {
  jest.clearAllTimers();
});

jest.mock('@react-native-community/netinfo', () => {
  return {
    NetInfoStateType: {
      unknown: 'unknown',
      none: 'none',
      cellular: 'cellular',
      wifi: 'wifi',
      bluetooth: 'bluetooth',
      ethernet: 'ethernet',
      wimax: 'wimax',
      vpn: 'vpn',
      other: 'other',
    },
    configure: jest.fn(),
    fetch: jest.fn(),
    refresh: jest.fn(),
    addEventListener: jest.fn(),
    useNetInfo: jest.fn(),
  };
});

jest.mock('react-native-view-shot', () => {
  return {
    captureRef: jest.fn(),
  };
});

jest.mock('react-native-device-info', () => {
  return {
    getVersion: jest.fn(() => Promise.resolve('1.0')),
    getApplicationName: jest.fn(() => Promise.resolve('My App')),
    getBuildId: jest.fn(() => Promise.resolve('1234')),
    getManufacturer: jest.fn(() => Promise.resolve('Apple')),
    getDeviceId: jest.fn(),
    getUniqueId: jest.fn(() => Promise.resolve('yuttiyuyi')),
    getBundleId: jest.fn(),
    getBuildNumber: jest.fn(),
    getSystemVersion: jest.fn(),
  };
});

jest.mock('@react-native-community/async-storage', () => {
  return {
    default: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    },
  };
});

jest.mock('react-native-fast-rsa', () => {
  return {
    Hash: {
      SHA512: 'sha-512',
    },
    SaltLength: {
      AUTO: 0,
      EQUALS_HASH: 1,
    },
    encryptOAEP: jest.fn(),
    signPSS: jest.fn(),
  };
});

// jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation');

// jest.mock('react-native/Libraries/Interaction/InteractionManager', () => {
//   const ActualInteractionManager = require.requireActual(
//     'react-native/Libraries/Interaction/InteractionManager'
//   );
//   return {
//     ...ActualInteractionManager,
//     runAfterInteractions: callback => {
//       callback && callback();
//       return {
//         then: () => {
//           return jest.fn();
//         },
//         done: () => {
//           return true;
//         },
//         cancel: () => {
//           return true;
//         },
//       };
//     },
//   };
// });

jest.mock('../src/Config', () => {
  return {
    rsa: {
      passphrase: '123456789',
      p12: `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
`,
    },
    mutualAuth: {
      cert: `sample`,
      password: 'sample',
    },
    sslPinning: {
      cert: 'sample',
    },
    server: {
      url: 'https://server/api',
      subscriptionKey: 'sample',
    },
    defaults: {
      cardNumber: '1234123412341234',
      password: '111111',
      document: '20676859',
    },
    features: {
      ForYouMbAsesora: false,
      SignIn: true,
      SignInRemember: true,
      ExchangeRate: true,
      SignUp: true,
      SignUpWeb: false,
      ForgotPassword: false,
      ForgotPasswordWeb: true,
      Foryou: true,
      Location: true,
      Contact: true,
      Feedback: true,
      Profile: true,
      ChangePhone: false,
      ChangeEmail: false,
      TransfersMyAccounts: true,
      TransfersOtherAccounts: true,
      TransfersOtherBanks: true,
      TransfersOtherBanksWeb: false,
      FrequentList: true,
      ChangeContact: true,
      PaymentsLoans: true,
      PaymentsOwnLoans: true,
      PaymentsOwnLoansWeb: true,
      PaymentsOtherLoans: false,
      PaymentsOtherLoansWeb: true,
      PaymentsServices: false,
      PaymentsServicesWeb: true,
      DPFOpen: true,
      Captcha: false,
      KeyboardByApi: true,
      UpdateTokenUrlActive: true,
      LoansPostponement: true,
      LoansPostponementReschedule: true,
      LoansPostponementFreezing: false,
      AllChannelsReady: false,
      ChangeDestinyMailEECC: false,
      LoginWithDniConventional: true,
      LoginWithDniBiometric: false,
      EnrollmentProcess: false,
      HeaderTraceEnabled: false,
      NewAccount: true,
      EnableNewRequestKeyFour: true,
      EnableTransferCTS: false,
      EnableAutomaticUnblock: false,
      EnableInstaCashFast: false,
      isRevision: false,
    },
    settings: {
      minVersion: '3.0',
      version: '', // Por conflicto con CI
      playStoreId: 'com.mibanco.bancamovil',
      appStoreId: '1437814246',
      playStoreLink: 'market://details?id=com.mibanco.bancamovil',
      appStoreLink:
        'itms-apps://itunes.apple.com/us/app/apple-store/id1437814246?mt=8',
      appGalleryLink: 'appmarket://details?id=com.mibanco.bancamovil',
      sessionIncreaseSeconds: 180,
      requestTimeout: 0,
      timeoutSplash: 3 * 1000,
      timeoutSignUpSuccess: 10 * 1000,
      forgotPasswordUrl:
        'https://zonaseguraqamovil.domibco.com.pe/frontend/recoverpin/',
      enrollmentUrl:
        'https://zonaseguraqamovil.domibco.com.pe/frontend/enrollment/',
      dpfInfoUrl:
        'https://www.mibanco.com.pe/repositorioaps/data/1/1/1/jer/tarifario-y-documentos-contractuales-dpf-online/files/DPF%20Online%20V001%20-%20Final.pdf',
      frontendUrl: 'https://zonaseguraqamovil.domibco.com.pe/frontend',
      dpfListUrl:
        'https://zonaseguraqamovil.domibco.com.pe/frontend/deposits/index',
      transfersUrl:
        'https://zonaseguraqamovil.domibco.com.pe/frontend/transfers/index',
      loanListUrl:
        'https://zonaseguraqamovil.domibco.com.pe/frontend/loanpayments/index',
      locationUrl: 'https://www.mibanco.com.pe/ubicanos',
      contactUrl: 'https://www.mibanco.com.pe/categoria/atencion-al-usuario',
      servicePaymentsUrl:
        'https://zonaseguraqamovil.domibco.com.pe/frontend/servicepayments/index',
      loanInfoUrlNewAccount:
        'https://www.mibanco.com.pe/categoria/ahorro-negocios',
      loanPaymentsUrl:
        'https://zonaseguraqamovil.domibco.com.pe/frontend/loanpayments/index',
      loanInfoUrl: 'https://www.mibanco.com.pe',
      firebaseFunctionsUrl: 'https://us-central1-hbmovil-qa.cloudfunctions.net',
      updateTokenUrl:
        'https://apimqaappmovil.azure-api.net/notifications/v1/notificationservice',
      contactPhone: '013199999',
      contactPhoneShow: '(01) 319-9999',
      maxSecurityImages: 12,
      instabugAPIKey: '665a20c1b2ef2ef15f1dc2d3b44907e0',
      limitMinTransfersMyAccountsUSD: 1,
      limitMinTransfersMyAccountsPEN: 1,
      limitMinTransfersOtherAccountsUSD: 1,
      limitMinTransfersOtherAccountsPEN: 1,
      limitMinTransfersOtherBanksUSD: 1,
      limitMinTransfersOtherBanksPEN: 1,
      limitTransfersOtherAccountsUSD: 1500,
      limitTransfersOtherAccountsPEN: 5000,
      limitTransfersOtherBanksUSD: 1500,
      limitTransfersOtherBanksPEN: 5000,
      limitMinPaymentsAccountsPEN: 1,
      limitMinPaymentsAccountsUSD: 1,
      limitMinDPFOpenPEN: 350,
      limitMinDPFOpenUSD: 100,
      timeoutExpirationSignUp: 1000 * 60 * 2,
      timeoutMinimalSignUp: 1000 * 15,
      timeoutSignUpSMS: 1000 * 60 * 3,
      timeoutTokenExpirationSignUp: 1000 * 60 * 5,
      timeoutExpirationForgotPassword: 1000 * 60 * 2,
      timeoutMinimalForgotPassword: 1000 * 15,
      timeoutForgotPasswordSMS: 1000 * 60 * 3,
      timeoutMinimalEnrollment: 1000 * 15,
      timeoutEnrollmentSMS: 1000 * 60 * 3,
      timeoutTokenExpirationForgotPassword: 1000 * 60 * 5,
      timeoutClearDPFOpenForm: 1000 * 30,
      timeoutResetAd: 1,
      numberDaysEmailPopupUpdate: 7,
      numberDaysEmailPopupAdd: 1,
      allowedSender: '88800',
      widthReceipt: 360,
      maxLengthFrequentContact: 50,
      startTimeDPFOpening: '05:00:00',
      endTimeDPFOpening: '20:00:00',
      startTimeInterbanksOperations: '06:00:00',
      endTimeInterbanksOperations: '20:30:00',
      startTimePayments: '06:00:00',
      endTimePayments: '20:00:00',
      startTimePaymentsServices: '09:00:00',
      endTimePaymentsServices: '21:00:00',
      countryTimezone: '-05:00',
      defaultTasksTime: '08:00:00',
      decimals: 2,
      emailTransfersImmediate: '',
      maintenanceMode: false,
      instantCashSuperRate: false,
      maintenanceStatus: 0,
      maintenanceSchedule: [],
      transfersAdCommission: false,
      instantCashShortProfilingAmount: 5000,
      numberDaysReminderLPDP: 7,
      revisionVersion: '3.13.7',
      docDemo: '71756524',
      kDemo: '121212',
      foryou: {
        soat: {
          url: 'https://web.pacifico.com.pe/seguros/soat/compraonline/soatmibanco?utm_source=appmibanco&utm_medium=referral&utm_campaign=app-mibanco_soat_per&utm_content=btnparati',
          active: true,
        },
        flexHome: {
          url: 'https://ventasonline.pacifico.com.pe/hogar/mibanco/inicio?utm_source=appmibanco&utm_medium=referral&utm_campaign=app-mibanco_hogar_per&utm_content=btnparati',
          active: true,
        },
        LifeDevolution: {
          url: 'https://ventasonline.pacifico.com.pe/vida/seguros/devoluciontotalsoles/compras/mibanco/principal?utm_source=appmibanco&utm_medium=referral&utm_campaign=app-mibanco_viddev_per&utm_content=btnparati',
          active: true,
        },
        protectedSale: {
          url: 'https://www.pacifico.com.pe/venta-del-dia-protegida-generico',
          active: true,
        },
        oncological: {
          url: '',
          active: false,
        },
        culqi: {
          url: 'https://www.mibanco.com.pe/noticia/pos-culqi-incrementa-ventas',
          active: true,
        },
        yape: {
          url: 'https://www.mibanco.com.pe/noticia/nos-unimos-a-yape',
          iosUrl: 'https://apps.apple.com/pe/app/yape/id1147249919',
          androidUrl:
            'https://play.google.com/store/apps/details?id=com.bcp.innovacxion.yapeapp',
          active: true,
        },
        yevo: {
          url: 'https://www.yevo.pe',
          active: true,
        },
        mbTeAsesora: {
          url: 'https://www.nopodranpararnos.pe',
          active: true,
        },
      },
      amountNotAllowedForEat: 1000,
    },
    debug: {
      disableRemoteConfig: false,
      allowRoot: false,
      allowAllLoanPayments: false,
      showRecordTransfer: false,
      captchaNotRequired: false,
      allowEmulator: false,
    },
    recaptcha: {
      siteKey: 'sample',
      site: 'https://zonaseguraqamovil.domibco.com.pe',
    },
  };
});

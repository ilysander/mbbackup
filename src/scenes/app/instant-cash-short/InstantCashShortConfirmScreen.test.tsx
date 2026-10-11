import * as React from 'react';
import * as renderer from 'react-test-renderer';
import InstantCashShortConfirmScreen, {
  Props,
  Params,
} from './InstantCashShortConfirmScreen';
import Session from '../../../api/Session';
import {ContentCreditLine} from '../../../api/backend/response/Execute';

const params: Params = {
  seedA: 'eat_urpi_ini',
  currency: '1',
  email: 'sample@sample.com',
  insurances: {ids: '', aceptTermAndCondition: 'true', selecteds: ''},
  insurancesList: [],
  target: {
    idEnvironment: 0,
    idProduct: '31240209',
    productType: 'CA',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: 'Mi ahorro por un sueño',
    smsAlias: null,
    label: 'Ahorro por un sueño (Soles) 6009363244',
    shortLabel: 'Mi ahorro por un sueño',
    extraInfo: '3|1428|12|1|6009363244|0|0|8|3',
    currency: '1',
    number: '6009363244',
    consolidatedAmount: 0,
    position: 5409.26,
    canRead: false,
    permissions: null,
    cci: '04901200600936324480',
    availableBalance: 5409.26,
    balance: 5409.26,
    rate: 0,
    category: 'apsSoles',
    family: '8',
    rateOfInterest: 0,
  },
  creditLine: {
    amountToDisburse: 503.19,
    capitalAmount: 500,
    amountLifeInsurance: 3.19,
    amountITF: 0,
    productID: '35538814',
    type: 1,
    productKey: '1514',
    branchKey: '355',
    currencyKey: 1,
    accountKey: '1624208',
    dispositionMaximumFee: '',
    dispositionMaximumFeeToShow: '',
    payDay: '12',
    creditAccountKey: '20444150',
    wayToPay: 'CV',
    loanUse: '1',
    typeOfOffer: 'disbursement',
    loanDestinations: [
      {
        idEnvironment: 0,
        idProduct: null,
        productType: null,
        productTypeLabel: null,
        productTypeShortLabel: null,
        description: null,
        productAlias: null,
        smsAlias: null,
        label: null,
        shortLabel: null,
        extraInfo: null,
        currency: null,
        number: null,
        consolidatedAmount: 0,
        position: 0,
        canRead: false,
        permissions: null,
        destinationName: 'CAPITAL DE TRABAJO',
        destinationId: 1,
      },
      {
        idEnvironment: 0,
        idProduct: null,
        productType: null,
        productTypeLabel: null,
        productTypeShortLabel: null,
        description: null,
        productAlias: null,
        smsAlias: null,
        label: null,
        shortLabel: null,
        extraInfo: null,
        currency: null,
        number: null,
        consolidatedAmount: 0,
        position: 0,
        canRead: false,
        permissions: null,
        destinationName: 'COMPRA DE DEUDA',
        destinationId: 13,
      },
      {
        idEnvironment: 0,
        idProduct: null,
        productType: null,
        productTypeLabel: null,
        productTypeShortLabel: null,
        description: null,
        productAlias: null,
        smsAlias: null,
        label: null,
        shortLabel: null,
        extraInfo: null,
        currency: null,
        number: null,
        consolidatedAmount: 0,
        position: 0,
        canRead: false,
        permissions: null,
        destinationName: 'ACTIVO FIJO',
        destinationId: 2,
      },
    ],
    creditLine: '1428653',
    dispositionMinimumAmount: 0,
    dispositionMaximunAmount: 0,
    requestNumber: '19279138',
  } as ContentCreditLine,
  dataPreview: {
    amount: 336.19,
    requestedAmount: 333,
    amountFee: '27.50',
    term: '18',
    tea: '63.46%',
    payDay: 4,
    rate: 65.56,
    insuranceDisposal: 3.19,
    insuranceDisposalRate: 9.49,
    debitAccount: 'Full ahorro (Soles) 6006087289',
    operationDate: '2020-10-08T00:00:00.000-0500',
    operationNumber: 1020530,
    mail: 'jer****@gmail.com',
    itf: 0.05,
    permissions: {
      hasPermissionOverDPF: true,
      transfer: true,
      hasPermissionOverTransferInterna: true,
      hasUserData: true,
      hasPermissionOverTransferInterbank: true,
      hasPermissionOvertransferInterbankInmediate: true,
      hasPermissionOvertransferThirdPartie: true,
      hasPermissionOverRequestLoan: true,
      preferences: true,
      hasPermissionOverServicePayment: true,
    },
    insurances: [],
    forms: [],
    debitAccountTicket: 'Full ahorro (Soles) 6006087289',
  },
};
const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<InstantCashShortConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just view', () => {
    const snapshot = renderer
      .create(<InstantCashShortConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  Session.save('sample');
});

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import InstantCashShortStartScreen, {
  Props,
  Params,
} from './InstantCashShortStartScreen';
import Session from '../../../api/Session';
import {ContentCreditLine} from '../../../api/backend/response/Execute';

const params: Params = {
  seedA: 'eat_urpi_ini',
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
  locked: false,
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
      .create(<InstantCashShortStartScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just view', () => {
    const snapshot = renderer
      .create(<InstantCashShortStartScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  Session.save('sample');
});

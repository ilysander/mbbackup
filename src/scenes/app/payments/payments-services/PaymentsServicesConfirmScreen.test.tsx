import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PaymentsServicesConfirmScreen, {
  Props,
  State,
  PaymentsServicesConfirmScreenType,
} from './PaymentsServicesConfirmScreen';
import {CurrencyType} from '../../../../resources/persistence/models/AmountModel';
import {withCatch} from '../../../../resources/util/Tests';
import Session from '../../../../api/Session';

const params: any = {};
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

const state: State = {
  isTermsValid: true,
  showTerms: true,
  isRequiredTerms: true,
  isAllowedReadSMS: true,
  resume: {
    totalAmount: '118.00',
    debitAccount: 'Full ahorro (Soles) 6011383139',
    clientName: 'AGAPITO REYNAGA  JULIO JULIAN',
    company_service: 'CABLE PERU COMAS E-COBROS - PAGO DE CABLE',
    companyService: 'CABLE PERU COMAS E-COBROS - PAGO DE CABLE',
    supply: '6361847',
    ticketNro: 'Nro. 201808050003738',
    expirationDate: '20/05/2019',
    mustUpdateMobile: true,
  },
  currency: CurrencyType.PEN,
  isLoading: false,
  isValid: true,
  bill: {
    clientCode: '2505567',
    companyGroupCode: '1',
    companyCode: '90',
    companyName: null,
    serviceCode: '90',
    serviceName: null,
    added: '0',
    state: '0000',
    emissionDate: '2019-01-31T00:00:00.000-0500',
    expirationDate: '20/05/2019',
    debtAmount: '599.00',
    totalAmount: '599.00',
    clientName: 'ADRIANO MATAMOROS  ROSA LUZ   ',
    ticketNumber: '201901050008557',
    supply: '2505567',
    traceConsulta: '110832',
  },
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<PaymentsServicesConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsServicesConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('getDetails empty', () => {
    const wrapper = renderer.create(
      <PaymentsServicesConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesConfirmScreenType;
    instance.getDetails();
  });

  Session.save('sample');
});

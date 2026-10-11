import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PaymentsServicesChooseAccountScreen, {
  Props,
  State,
  PaymentsServicesChooseAccountScreenType,
} from './PaymentsServicesChooseAccountScreen';
import {withCatch} from '../../../../resources/util/Tests';
import {CurrencyType} from '../../../../resources/persistence/models/AmountModel';
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
  showInvalidModal: true,
  accountIndex: 0,
  accounts: [
    {
      idEnvironment: 0,
      idProduct: '31240209',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Ahorro por un sueño (MN) 6009363244',
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
  ],
  isLoadingAccounts: false,
  isValid: true,
  isLoading: false,
  currency: CurrencyType.PEN,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<PaymentsServicesChooseAccountScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsServicesChooseAccountScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('load', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;
    await instance.load();
  });

  it(
    'load with catch',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <PaymentsServicesChooseAccountScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsServicesChooseAccountScreenType;
      await instance.load();
    }),
  );

  it('getAccount', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;
    expect(instance.getAccount()).toBeUndefined();
  });

  it('getAccount', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;
    const account = {sample: true} as any;
    instance.setState({
      accountIndex: 0,
      accounts: [account],
    });
    expect(instance.getAccount()).toBe(account);
  });

  it('isValidAccount', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;

    instance.setState(state);
    expect(instance.isValidAccount()).toBe(true);
  });

  it('isValidAccount false', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;

    expect(instance.isValidAccount()).toBe(false);
  });

  it('isValid', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;

    instance.setState(state);
    expect(instance.isValid()).toBe(true);
  });

  it('isValid false', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;

    expect(instance.isValid()).toBe(false);
  });

  it('tryToSubmit', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;

    instance.setState(state);
    expect(instance.state.isLoading).toBe(false);
    await instance.tryToSubmit();
    expect(instance.state.isLoading).toBe(false);
  });

  it('submit', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;

    instance.setState(state);
    await instance.submit();
  });

  it(
    'submit withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <PaymentsServicesChooseAccountScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsServicesChooseAccountScreenType;

      instance.setState(state);
      await instance.submit();
    }),
  );

  it('scrollToEnd', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;

    instance.scrollToEnd();
  });
  it('changeAccountOrigin', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseAccountScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseAccountScreenType;

    instance.changeAccountOrigin(2);

    expect(instance.state.accountIndex).toBe(2);
  });

  Session.save('sample');
});

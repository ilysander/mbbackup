import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PaymentsServicesChooseCategoryScreen, {
  Props,
  State,
  PaymentsServicesChooseCategoryScreenType,
} from './PaymentsServicesChooseCategoryScreen';
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
  isLoading: false,
  serviceCategories: [
    {
      code: '2',
      name: 'AGUA',
    },
    {
      code: '4',
      name: 'CABLE',
    },
    {
      code: '5',
      name: 'FINANCIERA',
    },
    {
      code: '7',
      name: 'GLOBOKAS',
    },
    {
      code: '1',
      name: 'LUZ',
    },
    {
      code: '3',
      name: 'TELEFONIA',
    },
  ],
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<PaymentsServicesChooseCategoryScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsServicesChooseCategoryScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('load', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseCategoryScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseCategoryScreenType;

    instance.setState(state);
    expect(instance.state.isLoading).toBe(false);
    await instance.load();
    expect(instance.state.isLoading).toBe(false);
  });

  it(
    'load withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <PaymentsServicesChooseCategoryScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsServicesChooseCategoryScreenType;

      instance.setState(state);
      expect(instance.state.isLoading).toBe(false);
      await instance.load();
      expect(instance.state.isLoading).toBe(false);
    }),
  );

  it('onPress', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseCategoryScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseCategoryScreenType;

    instance.setState(state);
    expect(instance.state.isLoading).toBe(false);
    await instance.load();
    expect(instance.state.isLoading).toBe(false);
  });

  it('loadAccounts', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseCategoryScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseCategoryScreenType;

    instance.setState(state);
    expect(instance.state.isLoading).toBe(false);
    await instance.loadAccounts();
    expect(instance.state.isLoading).toBe(false);
  });

  it(
    'loadAccounts withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <PaymentsServicesChooseCategoryScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsServicesChooseCategoryScreenType;

      instance.setState(state);
      expect(instance.state.isLoading).toBe(false);
      await instance.loadAccounts();
      expect(instance.state.isLoading).toBe(false);
    }),
  );

  Session.save('sample');
});

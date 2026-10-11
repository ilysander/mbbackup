import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PaymentsServicesChooseProviderScreen, {
  Props,
  State,
  PaymentsServicesChooseProviderScreenType,
} from './PaymentsServicesChooseProviderScreen';
import {withCatch} from '../../../../resources/util/Tests';
import Session from '../../../../api/Session';
import {InputValidation} from '../../../../api/backend/response/Execute';

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
  services: [
    {
      code: 'SC',
      name: 'PAGO DE AGUA',
      message: 'CODIGO DE INSCRIPCION',
      schedule: '04:00 - 23:50',
      maxLength: '8',
      inputValidation: '1' as InputValidation,
    },
  ],
  companies: [
    {
      code: '02',
      name: 'CAJA METROPOLITANA',
      groupCodeCompany: '38',
    },
    {
      code: '44',
      name: 'CREDINKA',
      groupCodeCompany: '80',
    },
  ],
  indexCompany: 0,
  indexService: 0,
  isValid: true,
  isLoading: false,
  isLoadingData: false,
  serviceCategory: undefined,
  readOnlyCompany: false,
  readOnlyService: false,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<PaymentsServicesChooseProviderScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsServicesChooseProviderScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('getCompany empty', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    expect(instance.getCompany()).toBe(undefined);
  });

  it('getCompany', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    expect(instance.getCompany()).toMatchObject(state.companies[0]);
  });

  it('getService empty', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    expect(instance.getService()).toBe(undefined);
  });

  it('getService', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    expect(instance.getService()).toMatchObject(state.services[0]);
  });

  it('getAccountsValid', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    expect(instance.getAccountsValid()).toMatchObject(state.companies);
  });

  it('tryToSubmit', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    await instance.tryToSubmit();
  });

  it(
    'tryToSubmit withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <PaymentsServicesChooseProviderScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

      instance.setState(state);
      await instance.tryToSubmit();
    }),
  );

  it('submit', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    await instance.submit();
  });

  it(
    'submit withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <PaymentsServicesChooseProviderScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

      instance.setState(state);
      await instance.submit();
    }),
  );

  it('loadCompanies', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    await instance.loadCompanies();
  });

  it(
    'loadCompanies withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <PaymentsServicesChooseProviderScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

      instance.setState(state);
      await instance.loadCompanies();
    }),
  );

  it('loadServices', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    await instance.loadServices(state.companies[0]);
  });

  it(
    'loadServices withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(
        <PaymentsServicesChooseProviderScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

      instance.setState(state);
      await instance.loadServices(state.companies[0]);
    }),
  );

  it('validateOneCompany', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    instance.validateOneCompany();
  });

  it('validateOneService', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    instance.validateOneService();
  });

  it('isValid', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    instance.isValid();
  });

  it('isValidService', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    instance.isValidService();
  });

  it('onChangeSupply', () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseProviderScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseProviderScreenType;

    instance.setState(state);
    instance.onChangeSupply('sample');
  });

  Session.save('sample');
});

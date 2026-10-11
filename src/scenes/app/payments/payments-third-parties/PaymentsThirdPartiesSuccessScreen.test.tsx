import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {
  withAuth,
  withCatch,
  withFetchConfig,
} from '../../../../resources/util/Tests';
import PaymentsThirdPartiesSuccessScreen, {
  PaymentsThirdPartiesSuccessScreenType,
  Props,
} from './PaymentsThirdPartiesSuccessScreen';

const params: any = {
  idTransaction: '7ea039ed4221445d9614f064e89c00ac',
  resume: {
    userEmail: 'test@test.com',
    capital: 'S/ 0.00',
    creditCurrency: '1',
    currency: '1',
    date: '03/12/2018 14:17:19',
    debitAccount: '12617360',
    debitAccountLabel: 'Cuenta ahorro negocios (MN) 2174023203',
    debitAmount: '0.10',
    interest: 'S/ 0.10',
    itf: 'S/ 0.00',
    loanAmount: {currency: '1', quantity: 0.1},
    loanLabel: 'Préstamo LineaDeCredito 110313878',
    operationNumber: '1020591',
    originLabel: 'Cuenta ahorro negocios (MN) 2174023203',
    otherAmount: '0.00',
    overdue: 'S/ 0.00',
    targetLabel: 'Préstamo LineaDeCredito 110313878',
    totalAmount: '0.10',
    creditAccountCurrency: 1,
    creditAccountHolder: 'LOAYZA GARCIA EUFRACIO',
    creditAccountNumber: '6007644726',
    creditAmount: 20, // valor para el destino
    debitAccountCurrency: '1', // currency de origen
    debitAccountHolder: 'TORRES SALAZAR SUSY VANESSA',
    debitProductLabel: 'Ahorro Fácil (MN) 6009361985',
    exchangeRate: 'asd dasdasd asd S/ 12.23',
    exchange: 3.33,
    loan: 'asdasd',
  },
  origin: {
    shortLabel: 'Préstamo LineaDeCredito 109689003',
    number: '1712',
  },
  loan: {
    loanNumber: '125689',
  },
};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    state: {
      routeName: 'Profile',
    },
  } as any,
  route: {
    params,
  } as any,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<PaymentsThirdPartiesSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });
  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsThirdPartiesSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  it('render with no email', () => {
    const paramsWithNoEmail: any = {
      idTransaction: '123456789',
      resume: {
        userEmail: undefined,
      },
    };
    const propsWithoutEmail = {
      ...props,
      getParam: (name: string, defaultValue = undefined) => {
        return paramsWithNoEmail[name] || defaultValue;
      },
    };
    const snapshot = renderer
      .create(<PaymentsThirdPartiesSuccessScreen {...propsWithoutEmail} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('Loading data', async () => {
    const wrapper = renderer.create(
      <PaymentsThirdPartiesSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;
    await instance.load();
    expect(instance.state.isLoading).toBe(false);
    expect(instance.state.resume).not.toBe({});
  });

  it(
    'loading data with status-code 404',
    withAuth(
      'sample',
      withFetchConfig({session: 'error'}, async () => {
        const wrapper = renderer.create(
          <PaymentsThirdPartiesSuccessScreen {...props} />,
        );
        const instance = (
          wrapper.getInstance() as any
        ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;
        await instance.load();
        expect(instance.state.isLoading).toBe(false);
        expect(instance.state.resume).not.toBe({});
      }),
    ),
  );

  it('Pressed tooltip Positive button', () => {
    const wrapper = renderer.create(
      <PaymentsThirdPartiesSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;
    instance.tooltipAction();
    expect(instance.tooltipAction()).toBe(true);
  });

  it('Pressed share transaction button', () => {
    const wrapper = renderer.create(
      <PaymentsThirdPartiesSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;
    instance.share();
  });
  it('Pressed update mail button when no email is present', () => {
    const wrapper = renderer.create(
      <PaymentsThirdPartiesSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;
    instance.updateMail();
  });
  it('go to transfers menu', () => {
    const wrapper = renderer.create(
      <PaymentsThirdPartiesSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;
    instance.goToPaymentsHome();
    expect(instance.props.navigation.navigate).toBeCalled();
  });
  it('Pressed back button on android', () => {
    const wrapper = renderer.create(
      <PaymentsThirdPartiesSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;

    expect(instance.handleBackPress()).toBe(false);
  });

  it('componentWillUnmount', () => {
    const wrapper = renderer.create(
      <PaymentsThirdPartiesSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;
    instance.componentWillUnmount();
  });

  it(
    'loading data with exception',
    withAuth(
      'sample',
      withCatch(true, async () => {
        const wrapper = renderer.create(
          <PaymentsThirdPartiesSuccessScreen {...props} />,
        );
        const instance = (
          wrapper.getInstance() as any
        ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;
        instance.setState({
          isLoading: false,
        });
        await instance.load();
        expect(instance.state.resume.operationNumber).toBe(undefined);
      }),
    ),
  );

  it(
    'loading data',
    withAuth('sample', async () => {
      const wrapper = renderer.create(
        <PaymentsThirdPartiesSuccessScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as PaymentsThirdPartiesSuccessScreenType;
      instance.setState({
        isLoading: false,
      });
      await instance.load();
      expect(instance.state.resume.operationNumber).toBe(undefined);
    }),
  );
  Session.save('sample');
});

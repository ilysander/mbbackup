import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {withAuth, withFetchConfig} from '../../../../resources/util/Tests';
import TransfersOtherBanksSuccessScreen, {
  Props,
  TransfersOtherBanksSuccessScreenType,
} from './TransfersOtherBanksSuccessScreen';

const params: any = {
  idTransaction: '65d472e506814249be0d4d101c674ee7',
  resume: {
    userEmail: 'test@test.com',
    loanAmount: {currency: '1', quantity: 0.1},
  },
  origin: {
    shortLabel: 'Cuenta ahorro negocios (ME) 791732501',
    number: '791732501',
  },
};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    resume: {
      currencyLabel: '2',
      amountCurrency: '2',
      bankName: 'CMAC Sullana',
      beneficiaryName: 'SANCHEZ HUAYANAY JOSE EDILBERTO',
      creditAccountCCI: '80517100000100697565',
      debitAccountID: '12481239',
      debitAccountLabel: 'Cuenta ahorro negocios (ME) 791732501',
      interbankComission: 2,
      itf: 0,
      mail: 'fiorela.contreras@avantica.net',
      mibancoComission: 0,
      requestedAmount: 1,
      totalAmount: {quantity: 3},
      transferReason: '',
    },
    idTransaction: '65d472e506814249be0d4d101c674ee7',
    origin: {
      shortLabel: 'Cuenta ahorro negocios (ME) 791732501',
      number: '791732501',
    },
    frequentContactName: 'felix xapaza',
  } as any,
  route: {
    params,
  } as any,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<TransfersOtherBanksSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });
  it('render just views', () => {
    const snapshot = renderer
      .create(<TransfersOtherBanksSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  it('render with no email', () => {
    const paramsWithNoEmail: any = {
      idTransaction: '65d472e506814249be0d4d101c674ee7',
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
      .create(<TransfersOtherBanksSuccessScreen {...propsWithoutEmail} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it(
    'Loading data',
    withAuth(
      'sample',
      withFetchConfig({session: 'default'}, async () => {
        const params: any = {
          resume: {
            currencyLabel: '2',
            amountCurrency: '2',
            bankName: 'CMAC Sullana',
            beneficiaryName: 'SANCHEZ HUAYANAY JOSE EDILBERTO',
            creditAccountCCI: '80517100000100697565',
            debitAccountID: '12481239',
            debitAccountLabel: 'Cuenta ahorro negocios (ME) 791732501',
            interbankComission: 2,
            itf: 0,
            mail: 'fiorela.contreras@avantica.net',
            mibancoComission: 0,
            requestedAmount: 1,
            totalAmount: {quantity: 3},
            transferReason: '',
          },
          idTransaction: '65d472e506814249be0d4d101c674ee7',
          origin: {
            shortLabel: 'Cuenta ahorro negocios (ME) 791732501',
            number: '791732501',
          },
          frequentContactName: 'felix xapaza',
        };
        const props: Props = {
          navigation: {
            addListener: jest.fn(),
            navigate: jest.fn(),
          } as any,
          route: {
            params,
          } as any,
        };

        const wrapper = renderer.create(
          <TransfersOtherBanksSuccessScreen {...props} />,
        );
        const instance = (
          wrapper.getInstance() as any
        ).getScreenRef() as TransfersOtherBanksSuccessScreenType;
        await instance.load();
        expect(instance.state.isLoading).toBe(false);
        expect(instance.state.resume).not.toBe({});
      }),
    ),
  );

  it('Pressed share transaction button', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksSuccessScreenType;
    instance.share();
  });
  it('go to transfers menu', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksSuccessScreenType;
    instance.goToTransfersMenu();
    expect(instance.props.navigation.navigate).toBeCalled();
  });
  it('Pressed back button on android', () => {
    const wrapper = renderer.create(
      <TransfersOtherBanksSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherBanksSuccessScreenType;

    expect(instance.handleBackPress()).toBe(false);
  });
  Session.save('sample');
});

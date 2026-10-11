import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../api/Session';
import Demo from '../../resources/persistence/demo/Demo';
import {
  withAuth,
  withCatch,
  withFetchConfig,
} from '../../resources/util/Tests';
import AccountList, { AccountListProps } from './AccountList';

const props: AccountListProps = {
  accessibilityLabel: 'test',
  navigation: {} as any,
  user:
    Demo['execute/preferences.userData.modify.pre_POST.cache'].response.body
      .data,
  isLoadingProfile: false,
};

const state = {
  isLoading: true,
  showModalEmail: false,
  accountsCTS: [
    {
      idEnvironment: 0,
      idProduct: '14528525',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'CTS (MN) 4000041071',
      extraInfo: '3|1426|470|1|4000041071|0|0|9|3',
      currency: '1',
      number: '4000041071',
      consolidatedAmount: 0,
      position: 10152.75,
      canRead: false,
      permissions: null,
      cci: '0',
      availableBalance: 0,
      balance: 10152.75,
      rate: 0,
      rateOfInterest: 0,
      category: 'ctsSoles',
      family: '9',
    },
    {
      idEnvironment: 0,
      idProduct: '13693841',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'CTS (MN) 4999980347',
      extraInfo: '3|1406|616|1|4999980347|0|0|9|3',
      currency: '1',
      number: '4999980347',
      consolidatedAmount: 0,
      position: 0,
      canRead: false,
      permissions: null,
      cci: '0',
      availableBalance: 0,
      balance: 0,
      rate: 0,
      rateOfInterest: 0,
      category: 'ctsSoles',
      family: '9',
    },
  ],
  loans: [
    {
      idEnvironment: 0,
      idProduct: '28725203',
      productType: 'PR',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Préstamo LineaDeCredito 109689003',
      extraInfo: '5|1712|463|1|109689003|0|0|1|7',
      currency: '1',
      number: '1712',
      consolidatedAmount: 0,
      position: 40293.7,
      canRead: false,
      permissions: null,
      loanAmount: 40293.7,
      amountPerDayOfLateness: 15789.66,
      totalAmountOfFees: 445,
      currentCapitalBalance: 40293.7,
      nextFeeAmount: 16234.66,
      groupFeeAmount: 0,
      nextFeeDueDate: '2018-03-14T00:00:00.000-0500',
      paymentDate: '2018-02-12T00:00:00.000-0500',
      paidFees: 0,
      totalFees: 12,
      apr: 25.64,
      aprc: 27.38,
      creditLineProductID: '26221416',
      category: 'LineaDeCredito',
      loanNumber: '109689003',
      subFamily: '7',
      family: '1',
    },
    {
      idEnvironment: 0,
      idProduct: '28725204',
      productType: 'PR',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Préstamo LineaDeCredito 109689003',
      extraInfo: '5|1712|463|1|109689003|0|0|1|7',
      currency: '1',
      number: '1712',
      consolidatedAmount: 0,
      position: 40293.7,
      canRead: false,
      permissions: null,
      loanAmount: 40293.7,
      amountPerDayOfLateness: 15789.66,
      totalAmountOfFees: 445,
      currentCapitalBalance: 40293.7,
      nextFeeAmount: 16234.66,
      groupFeeAmount: 0,
      nextFeeDueDate: '2018-03-14T00:00:00.000-0500',
      paymentDate: '2018-02-12T00:00:00.000-0500',
      paidFees: 0,
      totalFees: 12,
      apr: 25.64,
      aprc: 27.38,
      creditLineProductID: '26221416',
      category: 'LineaDeCredito',
      loanNumber: '109689003',
      subFamily: '7',
      family: '1',
    },
  ],
  accountsCC: [
    {
      idEnvironment: 0,
      idProduct: '31727067',
      productType: 'CC',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Mi Chequera (ME) 5000003940',
      extraInfo: '2|1410|496|2|5000003940|0|0|10|2',
      currency: '2',
      number: '5000003940',
      consolidatedAmount: 0,
      position: 180,
      canRead: false,
      permissions: null,
      cci: '04949600500000394039',
      availableBalance: 180,
      balance: 180,
      rate: 0,
      rateOfInterest: 0,
      category: 'ccDolares',
      family: '10',
    },
    {
      idEnvironment: 0,
      idProduct: '31727068',
      productType: 'CC',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Mi Chequera (MN) 5000003958',
      extraInfo: '2|1408|496|1|5000003958|0|0|10|2',
      currency: '1',
      number: '5000003958',
      consolidatedAmount: 0,
      position: 0,
      canRead: false,
      permissions: null,
      cci: '04949600500000395831',
      availableBalance: 0,
      balance: 0,
      rate: 0,
      rateOfInterest: 0,
      category: 'ccSoles',
      family: '10',
    },
  ],
  accountsCA: [
    {
      idEnvironment: 0,
      idProduct: '26224632',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Ahorro por un sueño (MN) 6005291079',
      extraInfo: '3|1428|350|1|6005291079|0|0|8|3',
      currency: '1',
      number: '6005291079',
      consolidatedAmount: 0,
      position: 1000.01,
      canRead: false,
      permissions: null,
      cci: '04935000600529107925',
      availableBalance: 1000.01,
      balance: 1000.01,
      rate: 0,
      rateOfInterest: 0,
      category: 'apsSoles',
      family: '8',
    },
    {
      idEnvironment: 0,
      idProduct: '26794063',
      productType: 'CA',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Full ahorro (MN) 6005697407',
      extraInfo: '3|1416|350|1|6005697407|0|0|8|3',
      currency: '1',
      number: '6005697407',
      consolidatedAmount: 0,
      position: 0.04,
      canRead: false,
      permissions: null,
      cci: '04935000600569740728',
      availableBalance: 0.04,
      balance: 0.04,
      rate: 0,
      rateOfInterest: 0,
      category: 'faSoles',
      family: '8',
    },
  ],
  creditLines: [],
  deposits: [
    {
      idEnvironment: 0,
      idProduct: '28186004',
      productType: 'DPF',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: '10000001494196',
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'DPF soles (Al vencimiento) 10000001494196',
      extraInfo: '4|1402|531|1|10000001494196|0|0|7|1',
      currency: '1',
      number: '1402',
      consolidatedAmount: 0,
      position: 822000,
      canRead: false,
      permissions: null,
      openingDate: '2018-01-10T00:00:00.000-0500',
      closingDate: '2019-01-10T00:00:00.000-0500',
      term: 365,
      rateOfInterest: 4.9,
      capital: 822000,
      interest: 40851.09,
      productKey: 1402,
      currencyKey: 1,
      availableRetirements: 0,
      accruedInterest: 22362.96,
    },
  ],
  otherLoans: [],
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<AccountList {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer.create(<AccountList {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('hasResultsAccounts', () => {
    const wrapper = renderer.create(<AccountList {...props} />);
    const instance = (wrapper.getInstance() as any) as AccountList;
    instance.setState(state);
    const results = instance.hasResultsAccounts();
    expect(results).toBe(true);
  });

  it('hasResultsAccounts returns empty', () => {
    const wrapper = renderer.create(<AccountList {...props} />);
    const instance = (wrapper.getInstance() as any) as AccountList;
    const results = instance.hasResultsAccounts();
    expect(results).toBe(false);
  });

  it('loading data with exception', async () => {
    const wrapper = renderer.create(<AccountList {...props} />);
    const instance = (wrapper.getInstance() as any) as AccountList;
    instance.setState({
      isLoading: false,
    });

    await instance.load();
  });

  it('safeReturnValue undefined', () => {
    const wrapper = renderer.create(<AccountList {...props} />);
    const instance = (wrapper.getInstance() as any) as AccountList;
    expect(instance.safeReturnValue(undefined)).toEqual({ ok: true });
  });

  it('setStateByResponse', () => {
    const body = {
      code: 'COR000I',
      idTransaction: '6063e37c152848fc91830c72e6c0c5c7',
      message: 'Operación ejecutada con éxito',
      data: {
        productMap: {
          loans: {
            products: [],
          },
          accountsCTS: { products: [] },
          creditLines: { products: [] },
          deposits: { products: [] },
          accountsCA: { products: [] },
          accountsCC: { products: [] },
        },
      },
    };
    const wrapper = renderer.create(<AccountList {...props} />);
    const instance = (wrapper.getInstance() as any) as AccountList;
    instance.setStateByResponse(body);
    expect(instance.state.deposits).toEqual([]);
  });

  it(
    'loading data with exception',
    withCatch(true, async () => {
      const wrapper = renderer.create(<AccountList {...props} />);
      const instance = (wrapper.getInstance() as any) as AccountList;
      instance.setState({
        isLoading: false,
      });

      await instance.load();
    })
  );
  it(
    'loading data with status-code',
    withAuth(
      'sample',
      withFetchConfig({ session: 'status-code' }, async () => {
        const wrapper = renderer.create(<AccountList {...props} />);
        const instance = (wrapper.getInstance() as any) as AccountList;
        await instance.load();
      })
    )
  );

  it(
    'loading data with default',
    withAuth(
      'sample',
      withFetchConfig({ session: 'default' }, async () => {
        const wrapper = renderer.create(<AccountList {...props} />);
        const instance = (wrapper.getInstance() as any) as AccountList;
        await instance.load();
      })
    )
  );

  Session.save('sample');
});

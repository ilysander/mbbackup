import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../api/Session';
import { Emitter } from '../../resources/listeners';
import PaymentsTypes, { PaymentsTypesProps } from './PaymentsTypes';

const props: PaymentsTypesProps = {
  user: {},
  accessibilityLabel: 'test',
  loans: [
    {
      idEnvironment: 0,
      idProduct: '626211',
      productType: 'PR',
      productTypeLabel: null,
      productTypeShortLabel: null,
      description: null,
      productAlias: null,
      smsAlias: null,
      label: '',
      shortLabel: 'Préstamo CapitalDeTrabajo 100326103',
      extraInfo: '5|151|84|1|100326103|0|0|1|1',
      currency: '1',
      number: '151',
      consolidatedAmount: 0,
      position: 2477.98,
      canRead: false,
      permissions: null,
      loanAmount: 6516.78,
      amountPerDayOfLateness: 2739.89,
      totalAmountOfFees: 3522.47,
      currentCapitalBalance: 2477.98,
      nextFeeAmount: 6262.36,
      groupFeeAmount: 0,
      nextFeeDueDate: '2050-06-19T00:00:00.000-0500',
      paymentDate: '2050-09-19T00:00:00.000-0500',
      paidFees: 8,
      totalFees: 12,
      apr: 51.11,
      aprc: 51.81,
      creditLineProductID: null,
      category: 'CapitalDeTrabajo',
      loanNumber: '100326103',
      subFamily: '1',
      family: '1',
    },
  ],
  accounts: [
    {
      shortLabel: '',
      number: '4334660303986087',
      balance: 123,
      availableBalance: 123,
      currency: 1,
      cci: '12313123',
    },
  ],
  isBetweenOfficeHours: true,
  navigation: { navigate: jest.fn() } as any,
};
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<PaymentsTypes {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });
  it('render just views', () => {
    const snapshot = renderer.create(<PaymentsTypes {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  it('my loans: expired', () => {
    const props: PaymentsTypesProps = {
      user: {},
      accessibilityLabel: 'test',
      loans: [
        {
          idEnvironment: 0,
          idProduct: '626211',
          productType: 'PR',
          productTypeLabel: null,
          productTypeShortLabel: null,
          description: null,
          productAlias: null,
          smsAlias: null,
          label: '',
          shortLabel: 'Préstamo CapitalDeTrabajo 100326103',
          extraInfo: '5|151|84|1|100326103|0|0|1|1',
          currency: '1',
          number: '151',
          consolidatedAmount: 0,
          position: 2477.98,
          canRead: false,
          permissions: null,
          loanAmount: 6516.78,
          amountPerDayOfLateness: 2739.89,
          totalAmountOfFees: 3522.47,
          currentCapitalBalance: 2477.98,
          nextFeeAmount: 6262.36,
          groupFeeAmount: 0,
          nextFeeDueDate: '2007-06-19T00:00:00.000-0500',
          paymentDate: '2006-09-19T00:00:00.000-0500',
          paidFees: 8,
          totalFees: 12,
          apr: 51.11,
          aprc: 51.81,
          creditLineProductID: null,
          category: 'CapitalDeTrabajo',
          loanNumber: '100326103',
          subFamily: '1',
          family: '1',
        },
      ],
      accounts: [
        {
          shortLabel: '',
          number: '4334660303986087',
          balance: 123,
          availableBalance: 123,
          currency: 1,
          cci: '12313123',
        },
      ],
      isBetweenOfficeHours: true,
      navigation: { navigate: jest.fn() } as any,
    };
    const wrapper = renderer.create(<PaymentsTypes {...props} />);
    const instance = (wrapper.getInstance() as any) as PaymentsTypes;
    instance.onPressMyLoans();
    expect(props.navigation.navigate).not.toHaveBeenCalled();
  });
  it('out of office  hours', () => {
    const props: PaymentsTypesProps = {
      user: {},
      accessibilityLabel: 'test',
      loans: [
        {
          idEnvironment: 0,
          idProduct: '626211',
          productType: 'PR',
          productTypeLabel: null,
          productTypeShortLabel: null,
          description: null,
          productAlias: null,
          smsAlias: null,
          label: '',
          shortLabel: 'Préstamo CapitalDeTrabajo 100326103',
          extraInfo: '5|151|84|1|100326103|0|0|1|1',
          currency: '1',
          number: '151',
          consolidatedAmount: 0,
          position: 2477.98,
          canRead: false,
          permissions: null,
          loanAmount: 6516.78,
          amountPerDayOfLateness: 2739.89,
          totalAmountOfFees: 3522.47,
          currentCapitalBalance: 2477.98,
          nextFeeAmount: 6262.36,
          groupFeeAmount: 0,
          nextFeeDueDate: '2007-06-19T00:00:00.000-0500',
          paymentDate: '2006-09-19T00:00:00.000-0500',
          paidFees: 8,
          totalFees: 12,
          apr: 51.11,
          aprc: 51.81,
          creditLineProductID: null,
          category: 'CapitalDeTrabajo',
          loanNumber: '100326103',
          subFamily: '1',
          family: '1',
        },
      ],
      isBetweenOfficeHours: false,
      navigation: { navigate: jest.fn() } as any,
    };
    const spy = jest.spyOn(Emitter, 'emit');
    const wrapper = renderer.create(<PaymentsTypes {...props} />);
    const instance = (wrapper.getInstance() as any) as PaymentsTypes;
    instance.onPressMyLoans();
    expect(spy).toHaveBeenCalled();
  });
  it('more of one loan', () => {
    const props: PaymentsTypesProps = {
      user: {},
      accessibilityLabel: 'test',
      loans: [
        {
          idEnvironment: 0,
          idProduct: '626211',
          productType: 'PR',
          productTypeLabel: null,
          productTypeShortLabel: null,
          description: null,
          productAlias: null,
          smsAlias: null,
          label: '',
          shortLabel: 'Préstamo CapitalDeTrabajo 100326103',
          extraInfo: '5|151|84|1|100326103|0|0|1|1',
          currency: '1',
          number: '151',
          consolidatedAmount: 0,
          position: 2477.98,
          canRead: false,
          permissions: null,
          loanAmount: 6516.78,
          amountPerDayOfLateness: 2739.89,
          totalAmountOfFees: 3522.47,
          currentCapitalBalance: 2477.98,
          nextFeeAmount: 6262.36,
          groupFeeAmount: 0,
          nextFeeDueDate: '2007-06-19T00:00:00.000-0500',
          paymentDate: '2006-09-19T00:00:00.000-0500',
          paidFees: 8,
          totalFees: 12,
          apr: 51.11,
          aprc: 51.81,
          creditLineProductID: null,
          category: 'CapitalDeTrabajo',
          loanNumber: '100326103',
          subFamily: '1',
          family: '1',
        },
        {
          idEnvironment: 0,
          idProduct: '626212',
          productType: 'PR',
          productTypeLabel: null,
          productTypeShortLabel: null,
          description: null,
          productAlias: null,
          smsAlias: null,
          label: '',
          shortLabel: 'Préstamo CapitalDeTrabajo 100326104',
          extraInfo: '5|151|84|1|100326103|0|0|1|1',
          currency: '1',
          number: '151',
          consolidatedAmount: 0,
          position: 2477.98,
          canRead: false,
          permissions: null,
          loanAmount: 6516.78,
          amountPerDayOfLateness: 2739.89,
          totalAmountOfFees: 3522.47,
          currentCapitalBalance: 2477.98,
          nextFeeAmount: 6262.36,
          groupFeeAmount: 0,
          nextFeeDueDate: '2007-06-19T00:00:00.000-0500',
          paymentDate: '2006-09-19T00:00:00.000-0500',
          paidFees: 8,
          totalFees: 12,
          apr: 51.11,
          aprc: 51.81,
          creditLineProductID: null,
          category: 'CapitalDeTrabajo',
          loanNumber: '100326104',
          subFamily: '1',
          family: '1',
        },
      ],
      isBetweenOfficeHours: true,
      navigation: { navigate: jest.fn() } as any,
    };
    const spy = jest.spyOn(Emitter, 'emit');
    const wrapper = renderer.create(<PaymentsTypes {...props} />);
    const instance = (wrapper.getInstance() as any) as PaymentsTypes;
    instance.onPressMyLoans();
    expect(spy).toHaveBeenCalled();
  });
  Session.save('sample');
});

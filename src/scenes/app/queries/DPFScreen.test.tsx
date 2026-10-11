import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import DPFScreen, {Props, DPFScreenType} from './DPFScreen';
import {DepositsItem} from '../../../api/backend/response/Execute';

const params: any = {
  item: {
    shortLabel: '',
    number: '',
    cci: '123123',
    availableBalance: 1000,
    currency: 1,
    openingDate: '2019-09-01T00:00:00.000-0500',
    closingDate: '2019-10-31T00:00:00.000-0500',
  },
};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<DPFScreen {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer.create(<DPFScreen {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('render modal dpfclose left 1 day,31 current days, less interes', () => {
    const wrapper = renderer.create(<DPFScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFScreenType;

    const dataaccount = {
      openingDate: '2019-10-01T00:00:00.000-0500',
      closingDate: '2019-11-01T00:00:00.000-0500',
    } as DepositsItem;
    const messageAlert = instance.getMessageAlert(
      dataaccount,
      '2019-11-01T00:00:00.000-0500',
    );

    expect(messageAlert.messageDaysLeft).toBe('1 día');
    expect(messageAlert.isLessThanTheMinimum).toBe(false); // recibe menos intereses
  });

  it('render modal dpfclose left 2 day, 30 current days, no interes', () => {
    const wrapper = renderer.create(<DPFScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFScreenType;

    const dataaccount = {
      openingDate: '2019-10-01T00:00:00.000-0500',
      closingDate: '2019-11-01T00:00:00.000-0500',
    } as DepositsItem;
    const messageAlert = instance.getMessageAlert(
      dataaccount,
      '2019-10-31T00:00:00.000-0500',
    );

    expect(messageAlert.messageDaysLeft).toBe('2 días');
    expect(messageAlert.isLessThanTheMinimum).toBe(false); // recibe menos intereses *
  });

  it('render modal dpfclose,dpf2years, left 2 day, 30 current days, no interes', () => {
    const wrapper = renderer.create(<DPFScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFScreenType;

    const dataaccount = {
      openingDate: '2018-09-25T00:00:00.000-0500',
      closingDate: '2020-09-15T00:00:00.000-0500',
    } as DepositsItem;
    const messageAlert = instance.getMessageAlert(
      dataaccount,
      '2018-10-25T15:35:00.000-0500',
    );

    expect(messageAlert.messageDaysLeft).toBe('692 días');
    expect(messageAlert.daysCurrent).toBe(30); // dias pasados
    expect(messageAlert.isLessThanTheMinimum).toBe(false); // recibe menos intereses *
  });

  Session.save('sample');
});

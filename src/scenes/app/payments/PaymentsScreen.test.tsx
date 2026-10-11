import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import PaymentsScreen, {PaymentsScreenType, Props} from './PaymentsScreen';

const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {} as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<PaymentsScreen {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });
  it('load', async () => {
    const wrapper = renderer.create(<PaymentsScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsScreenType;
    const spy = jest.spyOn(instance, 'setLoadingOff');
    await instance.load();
    expect(spy).toHaveBeenCalled();
  });

  it('load early return', async () => {
    const wrapper = renderer.create(<PaymentsScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsScreenType;
    instance.setState({isLoadingAccountsAndLoans: true});
    const load = await instance.load();
    expect(load).toBeUndefined();
  });

  it('isBetweenOfficeHours returning true', () => {
    const wrapper = renderer.create(<PaymentsScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsScreenType;
    const isBetweenOfficeHours = instance.isBetweenOfficeHours(
      'Mon, 03 Dec 2018 16:00:17 GMT',
    );
    expect(isBetweenOfficeHours).toBe(true);
  });

  it('isBetweenOfficeHours returning false (4am)', () => {
    const wrapper = renderer.create(<PaymentsScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsScreenType;
    const isBetweenOfficeHours = instance.isBetweenOfficeHours(
      'Mon, 03 Dec 2018 09:00:17 GMT',
    );
    expect(isBetweenOfficeHours).toBe(false);
  });

  it('isBetweenOfficeHours returning false (Sunday)', () => {
    const wrapper = renderer.create(<PaymentsScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsScreenType;
    const isBetweenOfficeHours = instance.isBetweenOfficeHours(
      'Sun, 02 Dec 2018 16:00:17 GMT',
    );
    expect(isBetweenOfficeHours).toBe(false);
  });

  it('render just views', () => {
    const snapshot = renderer.create(<PaymentsScreen {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  Session.save('sample');
});

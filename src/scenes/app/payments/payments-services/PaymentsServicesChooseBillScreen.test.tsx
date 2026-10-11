import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PaymentsServicesChooseBillScreen, {
  Props,
  PaymentsServicesChooseBillScreenType,
} from './PaymentsServicesChooseBillScreen';
import Session from '../../../../api/Session';

const params: any = {
  bills: [
    {
      expirationDate: '23/05/2019',
      clientName: 'Jorge',
      totalAmount: '100',
      ticketNumber: '123',
    },
  ],
};
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

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<PaymentsServicesChooseBillScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsServicesChooseBillScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('loadbills one', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseBillScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseBillScreenType;
    await instance.load();
    expect(instance.state.bills.length).toBe(1);
  });

  it('tryToSubmit', async () => {
    const wrapper = renderer.create(
      <PaymentsServicesChooseBillScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesChooseBillScreenType;
    expect(await instance.tryToSubmit()).toBe(undefined);
  });

  Session.save('sample');
});

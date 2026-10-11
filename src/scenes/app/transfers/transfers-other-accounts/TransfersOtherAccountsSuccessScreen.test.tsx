import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TransfersOtherAccountsSuccessScreen, {
  Props,
  TransfersOtherAccountsSuccessScreenType,
} from './TransfersOtherAccountsSuccessScreen';

const params: any = {
  idTransaction: '123456789',
  resume: {
    userEmail: 'test@test.com',
    loanAmount: {currency: '1', quantity: 0.1},
  },
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
describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<TransfersOtherAccountsSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });
  it('render just views', () => {
    const snapshot = renderer
      .create(<TransfersOtherAccountsSuccessScreen {...props} />)
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
      .create(<TransfersOtherAccountsSuccessScreen {...propsWithoutEmail} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  it('Loading data', async () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsSuccessScreenType;
    await instance.load();
    expect(instance.state.isLoading).toBe(false);
    expect(instance.state.resume).not.toBe({});
  });

  it('Pressed share transaction button', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsSuccessScreenType;
    instance.share();
  });
  it('go to transfers menu', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsSuccessScreenType;
    instance.goToTransfersMenu();
    expect(instance.props.navigation.navigate).toBeCalled();
  });
  it('Pressed back button on android', () => {
    const wrapper = renderer.create(
      <TransfersOtherAccountsSuccessScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersOtherAccountsSuccessScreenType;

    expect(instance.handleBackPress()).toBe(false);
  });
});

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PaymentsServicesValidAccountNotFoundScreen, {
  Props,
  PaymentsServicesValidAccountNotFoundScreenType,
} from './PaymentsServicesValidAccountNotFoundScreen';
import Session from '../../../../api/Session';

const params: any = {};
const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
    getParam: (name: string, defaultValue = undefined) => {
      return params[name] || defaultValue;
    },
  } as any,
  route: {} as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<PaymentsServicesValidAccountNotFoundScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<PaymentsServicesValidAccountNotFoundScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('goToLocation', () => {
    const wrapper = renderer.create(
      <PaymentsServicesValidAccountNotFoundScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as PaymentsServicesValidAccountNotFoundScreenType;
    instance.goToLocation();
  });

  Session.save('sample');
});

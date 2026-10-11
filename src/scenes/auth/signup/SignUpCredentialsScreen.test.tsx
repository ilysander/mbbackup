import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import {withFetchConfig} from '../../../resources/util/Tests';
import SignUpCredentialsScreen, {
  Props,
  State,
  SignUpCredentialsScreenType,
} from './SignUpCredentialsScreen';

const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
  } as any,
  route: {} as any,
};

const state: State = {
  isLoading: false,
  isValid: true,
  dictionary: [],
};

const stateResults: State = {
  isLoading: false,
  isValid: true,
  dictionary: [],
};

it('renders without crashing', () => {
  const rendered = renderer
    .create(<SignUpCredentialsScreen {...props} />)
    .toJSON();
  expect(rendered).toBeTruthy();
});

it('render just views', () => {
  const tree = renderer.create(<SignUpCredentialsScreen {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('submit true 1 ', () => {
  const wrapper = renderer.create(<SignUpCredentialsScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpCredentialsScreenType;
  instance.setState(stateResults);
  instance.props.navigation.navigate('SignUpSMS', {
    phoneNumber: '99·····30',
    cardNumber: '123123123123',
    atmPass: '123123',
  });
});

it('submit true', () => {
  const wrapper = renderer.create(<SignUpCredentialsScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpCredentialsScreenType;
  instance.setState(state);

  instance.props.navigation.navigate('SignUpSMS', {
    phoneNumber: '99·····30',
    cardNumber: '123123123123',
    atmPass: '123123',
  });
});

it('submit', () => {
  const wrapper = renderer.create(<SignUpCredentialsScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpCredentialsScreenType;
  instance.setState(state);

  instance.submit();
});

it('focus', async () => {
  const wrapper = renderer.create(<SignUpCredentialsScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpCredentialsScreenType;
  instance.setState(state);
  expect(setTimeout).toHaveBeenCalled();
});

describe('session', () => {
  it('toggleDebug', async () => {
    const wrapper = renderer.create(<SignUpCredentialsScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as SignUpCredentialsScreenType;
    await instance.submit();
  });
  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(<SignUpCredentialsScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as SignUpCredentialsScreenType;

      await instance.submit();
    }),
  );
  Session.save('sample');
});

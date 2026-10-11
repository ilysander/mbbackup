import * as React from 'react';
import * as renderer from 'react-test-renderer';
import IdentityCheckLoginScreen, {
  Props,
  State,
  IdentityCheckLoginScreenType,
} from './IdentityCheckLoginScreen';

const params: any = {
  document: '12345678',
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

const state: State = {
  isLoading: false,
  isValid: false,
  frontDniImage: '',
  liveToken: '',
  backDniImage: '',
  selfieDniImage: '',
  doiOCRTokenFront: '',
  doiOCRTokenBack: '',
  doiFaceToken: '',
  selfie: '',
  selfieTemplate: '',
  credentialsReady: false,
  activeBackButton: false,
  activeLiveButton: false,
  header: '',
};

it('renders without crashing', () => {
  const rendered = renderer
    .create(<IdentityCheckLoginScreen {...props} />)
    .toJSON();
  expect(rendered).toBeTruthy();
});

it('render just views', () => {
  const tree = renderer
    .create(<IdentityCheckLoginScreen {...props} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('submit true', () => {
  const wrapper = renderer.create(<IdentityCheckLoginScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as IdentityCheckLoginScreenType;
  instance.setState(state);
  instance.props.navigation.navigate('SignUpFacephiReset', {
    exchangeToken: 'xdsdfsdeas',
    documentNumber: '12345678',
  });
});

it('submit', () => {
  const wrapper = renderer.create(<IdentityCheckLoginScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as IdentityCheckLoginScreenType;
  instance.setState(state);

  instance.tryToSubmit();
});

it('focus', async () => {
  const wrapper = renderer.create(<IdentityCheckLoginScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as IdentityCheckLoginScreenType;
  instance.setState(state);
  expect(setTimeout).toHaveBeenCalled();
});

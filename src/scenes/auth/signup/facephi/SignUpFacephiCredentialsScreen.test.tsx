import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SignUpFacephiCredentialsScreen, {
  Props,
  State,
  SignUpFacephiCredentialsScreenType,
} from './SignUpFacephiCredentialsScreen';

const params: any = {};
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
  documentIsValid: false,
  dniCompleted: false,
  activeBackButton: false,
  activeLiveButton: false,
};

it('renders without crashing', () => {
  const rendered = renderer
    .create(<SignUpFacephiCredentialsScreen {...props} />)
    .toJSON();
  expect(rendered).toBeTruthy();
});

it('render just views', () => {
  const tree = renderer
    .create(<SignUpFacephiCredentialsScreen {...props} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('submit true', () => {
  const wrapper = renderer.create(
    <SignUpFacephiCredentialsScreen {...props} />,
  );
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpFacephiCredentialsScreenType;
  instance.setState(state);
  instance.props.navigation.navigate('SignUpFacephiReset', {
    exchangeToken: 'xdsdfsdeas',
    documentNumber: '12345678',
  });
});

it('submit', () => {
  const wrapper = renderer.create(
    <SignUpFacephiCredentialsScreen {...props} />,
  );
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SignUpFacephiCredentialsScreenType;
  instance.setState(state);

  instance.tryToSubmit();
});

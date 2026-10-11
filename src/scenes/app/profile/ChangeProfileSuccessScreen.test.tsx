import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import ChangeProfileSuccessScreen, {
  ChangeProfileSuccessScreenType,
  Props,
} from './ChangeProfileSuccessScreen';

const params: any = {
  updatedItem: 'celular',
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
      .create(<ChangeProfileSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<ChangeProfileSuccessScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('go to profile', () => {
    const wrapper = renderer.create(<ChangeProfileSuccessScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeProfileSuccessScreenType;
    instance.goBack();
    expect(instance.props.navigation.navigate).toBeCalled();
  });
  it('handleBackPress', () => {
    const wrapper = renderer.create(<ChangeProfileSuccessScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as ChangeProfileSuccessScreenType;

    expect(instance.handleBackPress).toBeTruthy();
  });

  Session.save('sample');
});

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import DPFOpenInvalidScreen, {
  DPFOpenInvalidScreenType,
  Props,
} from './DPFOpenInvalidScreen';
import {ParamListBase} from '@react-navigation/native';
const params: ParamListBase = {
  user: {},
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
      .create(<DPFOpenInvalidScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });
  it('render just views', () => {
    const snapshot = renderer
      .create(<DPFOpenInvalidScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('go to init', () => {
    const wrapper = renderer.create(<DPFOpenInvalidScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenInvalidScreenType;
    instance.goToInit();
    expect(instance.props.navigation.navigate).toBeCalled();
  });
  it('go to location', () => {
    const wrapper = renderer.create(<DPFOpenInvalidScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenInvalidScreenType;
    instance.goToLocation();
    expect(instance.props.navigation.navigate).toBeCalled();
  });
  Session.save('sample');
});

import * as React from 'react';
import { Linking } from 'react-native';
import * as renderer from 'react-test-renderer';
import InfoContact, { InfoContactProps } from './InfoContact';

const props: InfoContactProps = {
  accessibilityLabel: 'test',
  navigate: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<InfoContact {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<InfoContact {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('goToContactScreenOrOpenPhone', async () => {
  const url = 'tel:013199999';
  const wrapper = renderer.create(<InfoContact {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContact;

  await instance.goToContactScreenOrOpenPhone(true, url);
  jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
});

it('goToContactScreenOrOpenPhone:false', () => {
  const url = 'tel:013199999';
  const wrapper = renderer.create(<InfoContact {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContact;

  instance.goToContactScreenOrOpenPhone(false, url);
});

it('goToContactScreenWithError', () => {
  const wrapper = renderer.create(<InfoContact {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContact;

  instance.goToContactScreenWithError(null);
});

it('render with props', async () => {
  const wrapper = renderer.create(<InfoContact {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContact;

  jest
    .spyOn(Linking, 'canOpenURL')
    .mockImplementation(() => Promise.resolve(false));
  await instance.goToContact();
});

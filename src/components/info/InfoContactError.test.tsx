import * as React from 'react';
import { Linking } from 'react-native';
import * as renderer from 'react-test-renderer';
import InfoContactError, { InfoContactErrorProps } from './InfoContactError';

const props: InfoContactErrorProps = {
  accessibilityLabel: 'test',
  title: 'Sample',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<InfoContactError {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<InfoContactError {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('goToContactScreenOrOpenPhone', async () => {
  const url = 'tel:013199999';
  const wrapper = renderer.create(<InfoContactError {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContactError;

  await instance.goToContactScreenOrOpenPhone(true, url);
  jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
});

it('goToContactScreenOrOpenPhone:false', () => {
  const url = 'tel:013199999';
  const wrapper = renderer.create(<InfoContactError {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContactError;

  instance.goToContactScreenOrOpenPhone(false, url);
});

it('goToContactScreenWithError', () => {
  const wrapper = renderer.create(<InfoContactError {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContactError;

  instance.goToContactScreenWithError(null);
});

it('render with props', async () => {
  const wrapper = renderer.create(<InfoContactError {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContactError;

  jest
    .spyOn(Linking, 'canOpenURL')
    .mockImplementation(() => Promise.resolve(false));
  await instance.goToContact();
});

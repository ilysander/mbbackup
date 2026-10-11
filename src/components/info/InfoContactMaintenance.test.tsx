import * as React from 'react';
import { Linking } from 'react-native';
import * as renderer from 'react-test-renderer';
import InfoContactMaintenance, {
  InfoContactMaintenanceProps,
} from './InfoContactMaintenance';

const props: InfoContactMaintenanceProps = {
  accessibilityLabel: 'test',
  navigate: jest.fn(),
};

it('renders without crashing', () => {
  const snapshot = renderer
    .create(<InfoContactMaintenance {...props} />)
    .toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer
    .create(<InfoContactMaintenance {...props} />)
    .toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('goToContactScreenOrOpenPhone', async () => {
  const url = 'tel:013199999';
  const wrapper = renderer.create(<InfoContactMaintenance {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContactMaintenance;

  await instance.goToContactScreenOrOpenPhone(true, url);
  jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
});

it('goToContactScreenOrOpenPhone:false', () => {
  const url = 'tel:013199999';
  const wrapper = renderer.create(<InfoContactMaintenance {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContactMaintenance;

  instance.goToContactScreenOrOpenPhone(false, url);
});

it('goToContactScreenWithError', () => {
  const wrapper = renderer.create(<InfoContactMaintenance {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContactMaintenance;

  instance.goToContactScreenWithError({});
});

it('render with props', async () => {
  const wrapper = renderer.create(<InfoContactMaintenance {...props} />);
  const instance = (wrapper.getInstance() as any) as InfoContactMaintenance;

  jest
    .spyOn(Linking, 'canOpenURL')
    .mockImplementation(() => Promise.resolve(false));
  await instance.goToContact();
});

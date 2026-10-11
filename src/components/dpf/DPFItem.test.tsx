import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Currencies } from '../../resources/constants';
import DPFItem, { DPFItemProps } from './DPFItem';

const props: DPFItemProps = {
  accessibilityLabel: 'test',
  item: {
    client: '1177429',
    product: '1726',
    amount: 1000,
    rate: 4.9,
    term: 721,
    amountgenerated: 1100.55,
  },
  currency: Currencies.PEN,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<DPFItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<DPFItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('setError', () => {
  const wrapper = renderer.create(<DPFItem {...props} />);
  const instance = (wrapper.getInstance() as any) as DPFItem;
  instance.setError('Error');
  expect(instance.state.errorMessage).toBe('Error');
});

it('clearError', () => {
  const wrapper = renderer.create(<DPFItem {...props} />);
  const instance = (wrapper.getInstance() as any) as DPFItem;
  instance.clearError();
  expect(instance.state.errorMessage).toBeUndefined();
});

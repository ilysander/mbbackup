import * as React from 'react';
import * as renderer from 'react-test-renderer';
import MovementItem, { MovementItemProps } from './MovementItem';

const props: MovementItemProps = {
  accessibilityLabel: 'modal_overlay',
  account: {
    shortLabel: '',
    number: '123',
    balance: 123,
    availableBalance: 123,
    currency: 1,
    cci: '12313123',
  } as any,
  item: {
    type: 'D',
    amount: 133,
    date: new Date('2018-03-14T00:00:00.000-0500'),
  } as any,
  size: 1,
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
  } as any,
};

const props2: MovementItemProps = {
  accessibilityLabel: 'modal_overlay',
  account: {
    shortLabel: '',
    number: '123',
    balance: 123,
    availableBalance: 123,
    currency: 1,
    cci: '12313123',
  } as any,
  item: {
    type: 'C',
    amount: 0,
    date: new Date('2018-03-14T00:00:00.000-0500'),
  } as any,
  size: 1,
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
  } as any,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<MovementItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<MovementItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('renders without crashing', () => {
  const snapshot = renderer.create(<MovementItem {...props2} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<MovementItem {...props2} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('goToMovement', () => {
  const wrapper = renderer.create(<MovementItem {...props} />);
  const instance = (wrapper.getInstance() as any) as MovementItem;
  instance.goToMovement();
  expect(props.navigation.navigate).toHaveBeenCalled();
});

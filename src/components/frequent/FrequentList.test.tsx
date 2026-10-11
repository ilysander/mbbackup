import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FrequentList, { FrequentListProps } from './FrequentList';

const props: FrequentListProps = {
  accessibilityLabel: 'test',
  ListHeaderComponent: () => {
    return null;
  },
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    state: {},
    goBack: jest.fn(),
  } as any,
  list: [],
  serviceAvailability: async () => true,
  accounts: [],
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<FrequentList {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<FrequentList {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

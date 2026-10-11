import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ItemLoanInfo, { ItemLoaninfoProps } from './ItemLoanInfo';

const props: ItemLoaninfoProps = {
  text: 'text',
  imageSource: require('../../assets/images/cable-icon.png'),
};
it('renders without crashing', () => {
  const snapshot = renderer.create(<ItemLoanInfo {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<ItemLoanInfo {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

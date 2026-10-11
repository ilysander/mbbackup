import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PersonalInfo, { PersonalInfoProps } from './PersonalInfo';

const props: PersonalInfoProps = {
  title: 'test',
  mail: 'test',
  mobilePhone: 'test',
  accessibilityLabel: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<PersonalInfo {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<PersonalInfo {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

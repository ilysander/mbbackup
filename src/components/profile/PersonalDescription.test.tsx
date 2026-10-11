import * as React from 'react';
import * as renderer from 'react-test-renderer';
import PersonalDescription, {
  PersonalDescriptionProps,
} from './PersonalDescription';

const props: PersonalDescriptionProps = {
  title: 'test',
  subtitle: 'test',
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<PersonalDescription {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<PersonalDescription {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

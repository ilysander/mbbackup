import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Captcha from './Captcha';

it('renders without crashing', () => {
  const rendered = renderer
    .create(<Captcha accessibilityLabel={'signinscreen_captcha'} />)
    .toJSON();
  expect(rendered).toBeTruthy();
});

it('render just views', () => {
  const tree = renderer
    .create(<Captcha accessibilityLabel={'signinscreen_captcha'} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

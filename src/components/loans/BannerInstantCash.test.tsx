import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Demo from '../../resources/persistence/demo/Demo';
import BannerInstantCash, {BannerInstantCashProps} from './BannerInstantCash';

const props: BannerInstantCashProps = {
  accessibilityLabel: 'accountfield_touchable_edit',
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
  } as any,
  user: Demo['execute/preferences.userData.modify.pre_POST.cache'].response.body
    .data,
  nameRoute: '',
};

it('render just views', () => {
  const snapshot = renderer.create(<BannerInstantCash {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

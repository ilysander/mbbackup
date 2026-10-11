import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../../api/Session';
import {withFetchConfig} from '../../../../resources/util/Tests';
import TransfersMyAccountsConfirmScreen, {
  Props,
  TransfersMyAccountsConfirmScreenType,
} from './TransfersMyAccountsConfirmScreen';

const params: any = {
  resume: {
    amount: {
      quantity: '1000',
      currency: '1',
    },
    origin: {
      shortLabel: 'Ahorro soles (AH) 65656',
      number: '65656',
    },
    target: {
      shortLabel: 'Ahorro soles (AH) 65656',
      number: '65656',
    },
  },
};
const props: Props = {
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  } as any,
  route: {
    params,
  } as any,
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<TransfersMyAccountsConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<TransfersMyAccountsConfirmScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('submit', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsConfirmScreenType;

    instance.submit();
  });

  it(
    'submit data with error response',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(
        <TransfersMyAccountsConfirmScreen {...props} />,
      );
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as TransfersMyAccountsConfirmScreenType;

      instance.submit();
    }),
  );

  it('goBack', () => {
    const wrapper = renderer.create(
      <TransfersMyAccountsConfirmScreen {...props} />,
    );
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as TransfersMyAccountsConfirmScreenType;
    instance.goBack();
  });
  Session.save('sample');
});

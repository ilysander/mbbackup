import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../../api/Session';
import {withCatch, withFetchConfig} from '../../../resources/util/Tests';
import MovementScreen, {
  NavigationParams,
  MovementScreenType,
  Props,
} from './MovementScreen';
import {StatementsItem} from '../../../api/backend/response/Execute';

const params: NavigationParams = {
  account: {
    idEnvironment: 0,
    idProduct: '31240209',
    productType: 'CA',
    productTypeLabel: null,
    productTypeShortLabel: null,
    description: null,
    productAlias: null,
    smsAlias: null,
    label: '',
    shortLabel: 'Ahorro por un sueño (MN) 6009363244',
    extraInfo: '3|1428|12|1|6009363244|0|0|8|3',
    currency: '1',
    number: '6009363244',
    consolidatedAmount: 0,
    position: 5409.26,
    canRead: false,
    permissions: null,
    cci: '04901200600936324480',
    availableBalance: 5409.26,
    balance: 5409.26,
    rate: 0,
    category: 'apsSoles',
    family: '8',
    rateOfInterest: 0,
  },
  item: {
    id: 290907792,
    note: 'test',
    comment: 'TR HB 6000104521 a 1909222301',
    check: 0,
    amount: 0.3,
    type: 'C',
    date: '2018-11-12T00:00:00.000-0500',
    reference: 1021419,
  } as StatementsItem,
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
    const snapshot = renderer.create(<MovementScreen {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer.create(<MovementScreen {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('goBack', () => {
    const wrapper = renderer.create(<MovementScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as MovementScreenType;
    instance.goBack();
  });

  it('onFocusNote', () => {
    const wrapper = renderer.create(<MovementScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as MovementScreenType;
    instance.onFocusNote();
    expect(instance.state.isNoteFocused).toBe(true);
  });

  it('onBlurNote', () => {
    const wrapper = renderer.create(<MovementScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as MovementScreenType;
    instance.onBlurNote();
    expect(instance.state.isNoteFocused).toBe(false);
  });

  it('onChangeText true', () => {
    const wrapper = renderer.create(<MovementScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as MovementScreenType;
    instance.onChangeText('nueva nota');
    expect(instance.state.hasNoteChanged).toBe(true);
  });

  it('submit', () => {
    const wrapper = renderer.create(<MovementScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as MovementScreenType;
    instance.submit();
    expect(instance.state.isLoading).toBe(true);
  });

  it('saveNote loading', async () => {
    const wrapper = renderer.create(<MovementScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as MovementScreenType;
    await instance.saveNote();
    expect(instance.state.isLoading).toBe(false);
  });

  it(
    'saveNote loading withCatch',
    withCatch(true, async () => {
      const wrapper = renderer.create(<MovementScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as MovementScreenType;
      await instance.saveNote();
      expect(instance.state.isLoading).toBe(false);
    }),
  );

  it('saveNote', async () => {
    const wrapper = renderer.create(<MovementScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as MovementScreenType;
    await instance.saveNote();
  });

  it(
    'saveNote with error',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(<MovementScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as MovementScreenType;
      await instance.saveNote();
      expect(instance.state.isLoading).toBe(false);
    }),
  );

  it('loadMovement', async () => {
    const wrapper = renderer.create(<MovementScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as MovementScreenType;
    await instance.loadMovement('', '');
    jest.runOnlyPendingTimers();
    expect(setTimeout).toHaveBeenCalled();
  });
  it(
    'loadMovement with error',
    withFetchConfig({session: 'error'}, async () => {
      const wrapper = renderer.create(<MovementScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as MovementScreenType;
      await instance.loadMovement('', '');
      expect(instance.state.isLoading).toBe(false);
    }),
  );
  Session.save('sample');
});

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SecuritySealScreen, {
  Props,
  SecuritySealScreenType,
} from './SecuritySealScreen';

const params: any = {
  data: {
    _exchangeToken: '123',
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

const pages = [
  {
    id: 0,
    items: [
      {id: 1, imagen: 'imagen'},
      {id: 2, imagen: 'imagen'},
      {id: 3, imagen: 'imagen'},
    ],
  },
  {
    id: 1,
    items: [
      {id: 4, imagen: 'imagen'},
      {id: 5, imagen: 'imagen'},
      {id: 6, imagen: 'imagen'},
    ],
  },
  {
    id: 2,
    items: [
      {id: 7, imagen: 'imagen'},
      {id: 8, imagen: 'imagen'},
      {id: 9, imagen: 'imagen'},
    ],
  },
];

it('renders without crashing', () => {
  const snapshot = renderer.create(<SecuritySealScreen {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const wrapper = renderer.create(<SecuritySealScreen {...props} />);
  const snapshot = wrapper.toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('sendImageServer', () => {
  const wrapper = renderer.create(<SecuritySealScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SecuritySealScreenType;

  instance.setState({
    selectedIndex: 2,
    _exchangeToken: '123456',
    pages,
    isLoading: false,
  });
  instance.sendImageServer();
});

it('goBack', () => {
  const wrapper = renderer.create(<SecuritySealScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SecuritySealScreenType;

  instance.goBack();
});

it('navigate pages', () => {
  const wrapper = renderer.create(<SecuritySealScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SecuritySealScreenType;
  instance.setState({currentIndexPage: 1, pages, isLoading: false});
  expect(instance.state.currentIndexPage).toBe(1);
  instance.prev();

  expect(instance.state.currentIndexPage).toBe(0);

  instance.next();

  expect(instance.state.currentIndexPage).toBe(1);

  instance.goTo(2);
  expect(instance.state.currentIndexPage).toBe(2);
});

it('navigate pages exceded', () => {
  const wrapper = renderer.create(<SecuritySealScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SecuritySealScreenType;
  instance.setState({currentIndexPage: 0, pages, isLoading: false});
  instance.prev();

  expect(instance.state.currentIndexPage).toBe(2);

  instance.next();

  expect(instance.state.currentIndexPage).toBe(0);
});

it('onScroll', () => {
  const wrapper = renderer.create(<SecuritySealScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SecuritySealScreenType;
  instance.setState({width: 300});
  instance.onScroll({
    nativeEvent: {contentOffset: {x: 300, y: 0}},
  } as any);
  jest.runOnlyPendingTimers();
  expect(instance.state.currentIndexPage).toBe(1);
});

it('selectIndex', () => {
  const wrapper = renderer.create(<SecuritySealScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SecuritySealScreenType;
  instance.setState({selectedIndex: -1});
  expect(instance.state.selectedIndex).toBe(-1);

  instance.selectIndex(2);
  expect(instance.state.selectedIndex).toBe(2);
  instance.selectIndex(2);
  expect(instance.state.selectedIndex).toBe(-1);
});

it('acceptGeneralConditions', () => {
  const wrapper = renderer.create(<SecuritySealScreen {...props} />);
  const instance = (
    wrapper.getInstance() as any
  ).getScreenRef() as SecuritySealScreenType;
  const data = {_accessToken: '123', _exchangeToken: '3243'};
  instance.acceptGeneralConditions(data as any);
});

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import {DpfListItem} from '../../../../api/backend/response/Execute';
import Session from '../../../../api/Session';
import {withFetchConfig} from '../../../../resources/util/Tests';
import DPFOpenCalculatorScreen, {
  DPFOpenCalculatorScreenType,
  Props,
} from './DPFOpenCalculatorScreen';
import {ParamListBase} from '@react-navigation/native';
import Demo from '../../../../resources/persistence/demo/Demo';

const params: ParamListBase = {};

const props: Props = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
    getParam: (name: string, defaultValue = undefined) => {
      return params[name] || defaultValue;
    },
  } as any,
  route: {
    params: {
      user: Demo['execute/preferences.userData.modify.pre_POST.cache'].response
        .body.data,
    },
  } as any,
};

const rowsData: DpfListItem[] = [
  {
    client: 'Gerson',
    product: '123',
    amount: 100,
    rate: 12,
    term: 1,
    amountgenerated: 101,
  },
  {
    client: 'Gerson',
    product: '234',
    amount: 100,
    rate: 24,
    term: 2,
    amountgenerated: 101,
  },
] as any;

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer
      .create(<DPFOpenCalculatorScreen {...props} />)
      .toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer
      .create(<DPFOpenCalculatorScreen {...props} />)
      .toJSON();
    expect(snapshot).toMatchSnapshot();
  });
  it('clearForm', async () => {
    const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenCalculatorScreenType;
    instance.clearForm();
    if (instance.amountInput) {
      expect(instance.amountInput.getValue()).toBe(0);
    }
  });

  it('onChooseDpf', async () => {
    const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenCalculatorScreenType;
    instance.state.rowsData = rowsData;
    instance.onChooseDpf(0);
    instance.showDeclarationAlert();
    expect(instance.state.showDeclarationAlert).toBe(true);
  });

  it('loading data', async () => {
    const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenCalculatorScreenType;
    instance.load();
    expect(instance.state.isLoading).toBe(true);
  });

  it('onSubmitEditingAmount', async () => {
    const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenCalculatorScreenType;
    instance.onSubmitEditingAmount();

    if (instance.amountInput) {
      expect(instance.amountInput.getValue()).toBe(0);
    }
  });

  it('isAvailable', async () => {
    const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenCalculatorScreenType;
    const isAvailable = await instance.isAvailable();

    expect(isAvailable).toBe(true);
  });

  it('fill data form', async () => {
    const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenCalculatorScreenType;
    instance.amountInput && instance.amountInput.setValue('1000');
    instance.onSubmitEditingAmount();
    instance.onBlurAmount();

    if (instance.amountInput) {
      expect(instance.amountInput.getValue()).toBe(1000);
    }
  });

  it('onChangeAmount', async () => {
    const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenCalculatorScreenType;
    await instance.onChangeAmount();
    await instance.loadListOptions();
    expect(instance.state.isLoadingRows).toBe(false);
  });

  it('clearAmount', async () => {
    const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenCalculatorScreenType;
    instance.clearAmount();
    if (instance.amountInput) {
      expect(instance.amountInput.getValue()).toBe(0);
    }
  });

  it('goBack', async () => {
    const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
    const instance = (
      wrapper.getInstance() as any
    ).getScreenRef() as DPFOpenCalculatorScreenType;
    instance.goBack();
    expect(instance.props.navigation.navigate).toBeCalled();
  });

  it(
    'tryToSubmit with status code error',
    withFetchConfig({session: 'status-code'}, async () => {
      const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as DPFOpenCalculatorScreenType;
      instance.goToInvalid();
      instance.hideAvailabilityAlert();
      expect(instance.state.showAvailabilityAlert).toBe(false);
    }),
  );

  it(
    'changing view with status code error',
    withFetchConfig({session: 'status-code'}, async () => {
      const wrapper = renderer.create(<DPFOpenCalculatorScreen {...props} />);
      const instance = (
        wrapper.getInstance() as any
      ).getScreenRef() as DPFOpenCalculatorScreenType;
      await instance.submit();
      instance.goToChoose();
      instance.showAvailabilityAlert();
      expect(instance.state.showAvailabilityAlert).toBe(true);
    }),
  );

  Session.save('sample');
});

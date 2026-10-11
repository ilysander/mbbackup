import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../api/Session';
import { withCatch } from '../../resources/util/Tests';
import ExchangeRate, { ExchangeRateProps } from './ExchangeRate';

const props: ExchangeRateProps = {
  accessibilityLabel: 'test',
  label: 'label',
};

describe('session', () => {
  it('renders without crashing', () => {
    const snapshot = renderer.create(<ExchangeRate {...props} />).toJSON();
    expect(snapshot).toBeTruthy();
  });

  it('render just views', () => {
    const snapshot = renderer.create(<ExchangeRate {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('getSale', () => {
    const wrapper = renderer.create(<ExchangeRate {...props} />);
    const instance = (wrapper.getInstance() as any) as ExchangeRate;
    instance.setState({
      rate: {
        sale: '3.27',
      },
    });
    expect(instance.getSale()).toEqual('3.27');
  });

  it('getPurchase', () => {
    const wrapper = renderer.create(<ExchangeRate {...props} />);
    const instance = (wrapper.getInstance() as any) as ExchangeRate;
    instance.setState({
      rate: {
        purchase: '3.25',
      },
    });
    expect(instance.getPurchase()).toBe('3.25');
  });

  it('loading data', async () => {
    const wrapper = renderer.create(<ExchangeRate {...props} />);
    const instance = (wrapper.getInstance() as any) as ExchangeRate;
    await instance.load();

    expect(instance.state.rate.length).not.toBe(0);
  });

  it(
    'loading data with exception',
    withCatch(true, async () => {
      const wrapper = renderer.create(<ExchangeRate {...props} />);
      const instance = (wrapper.getInstance() as any) as ExchangeRate;
      instance.setState({
        isLoading: true,
      });

      await instance.load();
    })
  );

  Session.save('sample');
});

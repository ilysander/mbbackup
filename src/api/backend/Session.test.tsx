import { withAuth } from '../../resources/util/Tests';
import SessionAPI from '../Session';
import Request from '../util/Request';
import Session from './Session';

describe('without session', () => {
  it(
    'put with no auth',
    withAuth(undefined, async () => {
      await expect(Session.put()).rejects.toBeInstanceOf(Error);
    })
  );
});

describe('session', () => {
  it('loginWithSecondFactorAndPasswordStep1Mobile', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Session.loginWithSecondFactorAndPasswordStep1Mobile(
      '',
      '',
      '',
      '',
      ''
    );
    expect(spy).toBeCalled();
  });

  it('loginWithSecondFactorAndPasswordStep2Mobile', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Session.loginWithSecondFactorAndPasswordStep2Mobile('', '');
    expect(spy).toBeCalled();
  });

  it('selectEnvironment', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Session.selectEnvironment('', '');
    expect(spy).toBeCalled();
  });

  it('recoverPinMobileStep2', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Session.recoverPinMobileStep2('', '');
    expect(spy).toBeCalled();
  });

  it('recoverPinMobileFinish', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Session.recoverPinMobileFinish('', '', '', '');
    expect(spy).toBeCalled();
  });

  it('acceptGeneralConditions', async () => {
    const spy = jest.spyOn(Request, 'post');
    await Session.acceptGeneralConditions('', false);
    expect(spy).toBeCalled();
  });

  it('get', async () => {
    const spy = jest.spyOn(Request, 'get');
    await Session.get();
    expect(spy).toBeCalled();
  });

  it('put', async () => {
    const spy = jest.spyOn(Request, 'put');
    await Session.put();
    expect(spy).toBeCalled();
  });

  it('delete', async () => {
    const spy = jest.spyOn(Request, 'delete');
    await Session.delete();
    expect(spy).toBeCalled();
  });

  SessionAPI.save('sample');
});

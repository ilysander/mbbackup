import { withCatch } from '../resources/util/Tests';
import Session from './Session';

describe('session', () => {
  it('session save token', () => {
    expect(Session.getAccessToken()).toBe('sample');
  });

  it('session save active environment', () => {
    Session.setActiveEnvironment({
      _name: 's',
      segment: 's',
      type: 's',
    });

    expect(Session.getActiveEnvironment()).toEqual({
      _name: 's',
      segment: 's',
      type: 's',
    });
  });

  it(
    'logout with exception',
    withCatch(true, async () => {
      await Session.logout();
    })
  );

  it(
    'updateExpirationDate with exception',
    withCatch(true, async () => {
      await Session.updateExpirationDate();
    })
  );

  it(
    'extendExpirationDate with exception',
    withCatch(true, async () => {
      await Session.extendExpirationDate();
    })
  );

  it('session clear token without logout', async () => {
    const spy = jest.spyOn(Session, 'logout');
    await Session.clear(false);
    expect(spy).not.toBeCalled();
    expect(Session.getAccessToken()).toBe(undefined);
  });

  it('session clear token', async () => {
    const spy = jest.spyOn(Session, 'logout');
    await Session.clear();
    expect(spy).toBeCalled();
    expect(Session.getAccessToken()).toBe(undefined);
  });
  Session.save('sample');
});

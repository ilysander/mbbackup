import Session from '../Session';
import Messages from './Messages';

describe('session', () => {
  it('list', async () => {
    await Messages.list();
  });

  Session.save('sample');
});

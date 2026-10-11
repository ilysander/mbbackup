import Session from '../Session';
import Configuration from './Configuration';

describe('session', () => {
  it('list', async () => {
    await Configuration.list();
  });

  Session.save('sample');
});

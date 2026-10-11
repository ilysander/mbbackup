import Session from '../Session';
import ServiceAvalability from './ServiceAvalability';

describe('session', () => {
  it('list', async () => {
    await ServiceAvalability.list();
  });

  Session.save('sample');
});

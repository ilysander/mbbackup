import Session from '../Session';
import AvailableFeatures from './AvailableFeatures';

describe('session', () => {
  it('list', async () => {
    await AvailableFeatures.list();
  });

  Session.save('sample');
});

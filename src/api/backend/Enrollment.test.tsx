import Session from '../Session';
import Enrollment from './Enrollment';

describe('session', () => {
  it('securitySealsList', async () => {
    await Enrollment.securitySealsList('', false);
  });

  it('mobileStep1', async () => {
    await Enrollment.mobileStep1('', '');
  });

  it('mobileFinish', async () => {
    await Enrollment.mobileFinish('', '', '', '', false);
  });
  Session.save('sample');
});

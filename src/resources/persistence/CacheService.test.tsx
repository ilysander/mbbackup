import CacheService from './CacheService';
import { CacheObj } from './models';

const cache = CacheObj.init('sample', 'sample');

it('delete', async () => {
  await CacheService.delete(cache);
});
it('createOrUpdate', async () => {
  await CacheService.createOrUpdate(cache);
});

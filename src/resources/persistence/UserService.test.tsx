import { UserObj } from './models/UserModel';
import UserService from './UserService';

const user = UserObj.init('sample');
it('delete', async () => {
  await UserService.delete(user);
});

it('findOne', async () => {
  try {
    await UserService.findOne(user.id);
  } catch (e) {
    expect(e).not.toBe(undefined);
  }
});

it('save', async () => {
  await UserService.create(user);
});

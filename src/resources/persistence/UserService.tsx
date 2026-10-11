import { UserModel, OnboardingModel, EmailStatusModel } from './models';
import AppStorage from './storage/AppStorage';

export default class UserService {
  static create(object: UserModel) {
    return AppStorage.create<UserModel>(UserModel.schema.name, object);
  }

  static findOne(id: string) {
    return AppStorage.findOne<UserModel>(UserModel.schema.name, `id=$0`, id);
  }

  static async getSettings(object: UserModel) {
    const user = await AppStorage.findOne<UserModel>(
      UserModel.schema.name,
      `id=$0`,
      object.id
    );
    return user.settings;
  }

  static delete(object: UserModel) {
    return AppStorage.delete(UserModel.schema.name, `id=$0`, object.id);
  }

  static onboardingSave(object: OnboardingModel) {
    return AppStorage.create<OnboardingModel>(
      OnboardingModel.schema.name,
      object
    );
  }
  static async onboardingGet(value: string) {
    return AppStorage.findOne<OnboardingModel>(
      OnboardingModel.schema.name,
      `id=$0`,
      value
    );
  }
  static emailStatusSave(object: EmailStatusModel) {
    return AppStorage.create<EmailStatusModel>(
      EmailStatusModel.schema.name,
      object
    );
  }
  static async emailStatusGet(value: string) {
    return AppStorage.findOne<EmailStatusModel>(
      EmailStatusModel.schema.name,
      `id=$0`,
      value
    );
  }
}

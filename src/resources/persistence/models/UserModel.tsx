import SettingsModel from './SettingsModel';
export class UserModel {
  public static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: { type: 'string' },
      dateCreated: { type: 'date', default: new Date() },
      dateUpdated: { type: 'date', optional: true },
      settings: {
        type: 'Settings',
        default: SettingsModel.initWithDefaults(),
      },
    },
  };

  // public static init(id: string) {
  //   const user = new UserModel();
  //   user.id = id;
  //   return user;
  // }

  public id!: string;
  public dateCreated!: Date;
  public dateUpdated?: Date;
  public settings!: SettingsModel;
}

export class UserObj {
  public static init(id: string) {
    const user = new UserObj();
    user.id = id;
    return user;
  }
  public id!: string;
  public dateCreated!: Date;
  public dateUpdated?: Date;
  public settings!: SettingsModel;
}

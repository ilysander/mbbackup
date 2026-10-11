export default class SettingsModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Settings',
    properties: {
      hideReminderCreateTask: { type: 'bool', default: false },
    },
  };

  public static initWithDefaults() {
    return new SettingsModel();
  }

  public hideReminderCreateTask!: boolean;
}

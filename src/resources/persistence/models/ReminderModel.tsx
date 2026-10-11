export default class ReminderModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Reminder',
    properties: {
      description: { type: 'string', default: '' },
      date: { type: 'date' },
      /**
       * aqui se podra agregar los recordatorios repetitivos, cada dia, weekdays
       * repeat: { type: 'string' },
       */
    },
  };

  // public static init(date: Date, description: string) {
  //   const reminder = new ReminderModel();
  //   reminder.date = date;
  //   reminder.description = description;
  //   return reminder;
  // }
  public date!: Date;
  public description!: string;

  // clone() {
  //   const reminder = new ReminderModel();
  //   reminder.date = this.date;
  //   reminder.description = this.description;
  //   return reminder;
  // }
}

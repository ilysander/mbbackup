export class OnboardingModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Onboarding',
    primaryKey: 'id',
    properties: {
      id: { type: 'string' },
      value: { type: 'string' },
    },
  };

  // public static init(id: string) {
  //   const onboarding = new OnboardingModel();
  //   onboarding.id = id;
  //   onboarding.value = id;
  //   return onboarding;
  // }

  public id!: string;
  public value!: string;
}

export class OnboardingObj {
  public static init(id: string) {
    const onboarding = new OnboardingObj();
    onboarding.id = id;
    onboarding.value = id;
    return onboarding;
  }

  public id!: string;
  public value!: string;
}

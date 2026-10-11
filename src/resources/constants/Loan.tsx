const RulesCodePostponement = {
  PostponementEnabled: 1,
  PosponementDisabled: 0,
  PosponementStatus: 2,
  codePhoneBanking: 401,
  codeRuleCovid: 402,
  codeIncomingRequest: 403,
  codeRequestReady: 404,
  typeReschedule: 19,
  typeRescheduleFreezing: 20,
};

const PeriodsGrace = [
  {
    title: 'Sin periodo de gracia',
    quantity: 0,
  },
  {
    title: '1 mes',
    quantity: 1,
  },
  {
    title: '2 meses',
    quantity: 2,
  },
  {
    title: '3 meses',
    quantity: 3,
  },
];

const Terms = [
  {
    title: 'Sin cambio de plazo',
    quantity: 0,
  },
  {
    title: '1 mes más',
    quantity: 1,
  },
  {
    title: '2 meses más',
    quantity: 2,
  },
  {
    title: '3 meses más',
    quantity: 3,
  },
  {
    title: '4 meses más',
    quantity: 4,
  },
  {
    title: '5 meses más',
    quantity: 5,
  },
  {
    title: '6 meses más',
    quantity: 6,
  },
];

export default {
  PeriodsGrace,
  Terms,
  RulesCodePostponement,
};

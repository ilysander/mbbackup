const TypeOfOffer = {
  Request: 'request',
  Disposition: 'disposition',
  // NewLoan: 'request',
};

const RequestType = {
  Disposition: '3287', //unico es disposicion, el resto son request
  Urpi: '2045',
  UrpiLocked: '1000',
  NewLoan: '3321',
};

const ScreenType = {
  StartDisposition: {
    code: 1,
    screenName: 'InstantCashStart',
    locked: false,
  },
  RequestUrpi: {
    code: 2,
    screenName: 'InstantCashShortStart',
    locked: false,
  },
  RequestUrpiLocked: {
    code: 2, //Define el mensaje
    screenName: 'InstantCashShortStart', //Define la pantalla
    locked: true, //si es bloqueado o no
  },
  StartNewLoan: {
    code: 3,
    screenName: 'InstantCashFastStart',
    locked: false,
  }
};

export default {
  TypeOfOffer,
  RequestType,
  ScreenType,
};

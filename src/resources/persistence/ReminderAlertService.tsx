import UtilApi from '../../api/backend/UtilApi';
import ResponseCode from '../../api/ResponseCode';
import Session from '../../api/Session';
import Config from '../../Config';
import { Log } from '../log';
import CacheService from './CacheService';
const moment = require('moment');
const TAG = '[ReminderAlertService]';
export default class ReminderAlertService {
  static LPDPTERMS_REMINDERACCEPT_: string = 'LPDPTERMS_REMINDERACCEPT_';

  // 2013-02-08 24:00:00.000
  static dateFormat = 'DD/MM/YYYY HH:mm:ss';

  // Pre carga los datos, para mantenerlo lo mas actualizado, previo a una tx
  static async preValidateLPDP() {
    return this.verifyLPDP(undefined, undefined, true, false);
  }

  static async verifyLPDP(
    docVal?: string,
    docType?: string,
    isSession: boolean = true,
    countAsAView: boolean = true
  ) {
    let isNeededCallApi = false;
    let showLpdp = false;

    if (!docVal) {
      docVal = Session.getDocumentNumber();
    }

    if (!docType) {
      docType = Session.getDocumentType();
    }

    if (!docType) {
      docType = '1';
    }

    if (isSession) {
      console.log(
        `Session.data(${docVal}):`,
        JSON.stringify(Session.dataLpdp.data)
      );
      // La primera vez debe mostrar!!!!
      if (Session.dataLpdp.data.value != undefined) {
        // Ya tiene valor en sesion, se validara si se muestra o no y si se guarda la fecha de vista
        if (!!Session.dataLpdp.data.value) {
          // ya acepto previamente
          Session.dataLpdp.data.show = false;
          return Session.dataLpdp.data.show;
        }

        if (!!countAsAView) {
          // Validar si ya se guardo
          let isFirstTime = true;
          try {
            const cacheReminder = await CacheService.findOne(
              ReminderAlertService.LPDPTERMS_REMINDERACCEPT_ + docVal
            );

            if (!!cacheReminder && !!cacheReminder.value) {
              // tiene fecha de recordatorio siguiente
              const dateNow = moment(new Date());
              const date = moment(
                cacheReminder.value + '',
                ReminderAlertService.dateFormat
              );
              const nextDateShow = date.add(
                Config.settings.numberDaysReminderLPDP,
                'd'
              );
              if (nextDateShow.isBefore(dateNow)) {
                // ya debe mostrarse//consultar de nuevo (Ya vencio el tiempo de espera, debe consultar de nuevo)
                // isFirstTime = true;//TODO
              } else {
                isFirstTime = false; // el unico necesario
              }
              // no debe consultarse aun
            } else {
              // consultar de nuevo (No tiene guardado localente ningun valor)
              // isFirstTime = true;
            }
          } catch (error) {
            // consultar de nuevo (No tiene guardado localente ningun valor)
            // isFirstTime = true;
          }

          // Sino se guardo, se guardara y se mostrara la primera vez
          if (isFirstTime) {
            // solo la primera vez que se ve, o cuando vencio la fecha
            try {
              const dateNow = moment(new Date());
              const dateFormated = dateNow.format(
                ReminderAlertService.dateFormat
              );
              await CacheService.updateOrCreateValueByKey(
                ReminderAlertService.LPDPTERMS_REMINDERACCEPT_ + docVal,
                dateFormated
              );
              if (
                !Config.settings.numberDaysReminderLPDP ||
                Config.settings.numberDaysReminderLPDP === 0
              ) {
                Session.dataLpdp.data.show = true;
              } else {
                Session.dataLpdp.data.show = false;
              }
            } catch (error) {}
          }

          return isFirstTime;
        }
      }
    }

    if (!!docVal && !!docType) {
      // 1.-validar localmente para no llamar al servicio
      try {
        const cacheReminder = await CacheService.findOne(
          ReminderAlertService.LPDPTERMS_REMINDERACCEPT_ + docVal
        );
        if (!!cacheReminder && !!cacheReminder.value) {
          // tiene fecha de recordatorio siguiente
          const dateNow = moment(new Date());
          const date = moment(
            cacheReminder.value + '',
            ReminderAlertService.dateFormat
          );
          const nextDateShow = date.add(
            Config.settings.numberDaysReminderLPDP,
            'd'
          );
          if (nextDateShow.isBefore(dateNow)) {
            // ya debe mostrarse//consultar de nuevo (Ya vencio el tiempo de espera, debe consultar de nuevo)
            isNeededCallApi = true;
          }
          // no debe consultarse aun
        } else {
          // consultar de nuevo (No tiene guardado localente ningun valor)
          isNeededCallApi = true;
        }
      } catch (error) {
        // consultar de nuevo (No tiene guardado localente ningun valor)
        isNeededCallApi = true;
      }

      // 2.- validacion api
      if (isNeededCallApi) {
        let apiValue;

        try {
          isSession && (Session.dataLpdp.loading = true);

          const response = await UtilApi.getLPDP(docType, docVal);

          const body = response.body;
          if (body.code === ResponseCode.OK) {
            if (body.data.flagLPDP === '0') {
              apiValue = false;
              showLpdp = true;
            } else if (body.data.flagLPDP === '1') {
              apiValue = true;
              showLpdp = false;
            }
            isSession && (Session.dataLpdp.lastRequestTime = new Date());

            // En esta sesion si va mostrar, pero debe registrarse para que ya no muestre en esta sesion segun el tiempo configurado
            if (countAsAView) {
              try {
                const dateNow = moment(new Date());
                const dateFormated = dateNow.format(
                  ReminderAlertService.dateFormat
                );
                await CacheService.updateOrCreateValueByKey(
                  ReminderAlertService.LPDPTERMS_REMINDERACCEPT_ + docVal,
                  dateFormated
                );
                if (
                  !Config.settings.numberDaysReminderLPDP ||
                  Config.settings.numberDaysReminderLPDP === 0
                ) {
                  Session.dataLpdp.data.show = true;
                } else {
                  Session.dataLpdp.data.show = false;
                }
              } catch (error) {}
            }
          }
        } catch (e) {
          Log.warn(TAG, (e as any).message);
        }
        if (isSession) {
          Session.dataLpdp.loading = false;
          // Session.dataLpdp.data.show = showLpdp;
          Session.dataLpdp.data.value = apiValue;
        }
      }
    }
    return showLpdp;
  }

  static async updateLPDP(
    docType: string,
    document: string,
    flagLPDP: '0' | '1',
    documentCountry: string
  ) {
    try {
      if (flagLPDP === '1') {
        Session.dataLpdp.data.value = true;
        Session.dataLpdp.data.show = false;
      }
      await UtilApi.updateLPDP(docType, document, flagLPDP, documentCountry);
      const dateNow = moment(new Date());
      const dateFormated = dateNow.format(this.dateFormat);
      await CacheService.updateOrCreateValueByKey(
        this.LPDPTERMS_REMINDERACCEPT_ + document,
        dateFormated
      );
    } catch (e) {
      Log.warn(TAG, (e as any).message);
    }
    Session.dataLpdp.data.show = false;
  }
}

import TemplateShare from '../constants/TemplateShare';
import { L } from '../language';

export default class UI {
  static shareCCI(data: any): any {
    const title = L.template_share_cci_title;
    let message = L.template_share_account;
    let message2 = L.template_share_cci;
    if (
      data.account_name
        .toLowerCase()
        .trim()
        .startsWith('cuenta')
    ) {
      data.account_name = data.account_name
        .split(' ')
        .splice(1, data.account_name.length)
        .join(' ');
      data.account_name =
        data.account_name.charAt(0).toUpperCase() + data.account_name.slice(1);
    }

    let accountName = data.account_name
      .split(TemplateShare.MN)
      .join(L.template_share_replace_mn);
    accountName = accountName
      .split('(' + TemplateShare.MN.trim() + ')')
      .join('(' + L.template_share_replace_mn + ')');

    accountName = accountName
      .split(TemplateShare.ME)
      .join(L.template_share_replace_me);
    accountName = accountName
      .split('(' + TemplateShare.ME.trim() + ')')
      .join('(' + L.template_share_replace_me + ')');

    message = message.split(TemplateShare.ACCOUNT_NAME).join(accountName);
    message = message
      .split(TemplateShare.ACCOUNT_NUMBER)
      .join(data.account_number);
    if (data.cci) {
      message2 = message2.split(TemplateShare.CCI).join(data.cci);
      message = message.split(TemplateShare.CCITEXT).join(message2);
    } else {
      message = message.split(TemplateShare.CCITEXT).join('');
    }
    const options = {
      title,
      message,
      subject: title, //  for email
    };
    return options;
  }

  static shareAccountDetails(data: any): any {
    const title = L.template_share_movement_title;
    let message = L.template_share_movement_details;

    message = message.split(TemplateShare.GLOSA).join(data.glosa);
    message = message.split(TemplateShare.AMOUNT).join(data.amount);
    message = message
      .split(TemplateShare.DATE_MOVEMENT)
      .join(data.date_movement);

    const noteMovement = data.note ? ' (' + data.note + ')' : '';
    message = message.split(TemplateShare.MOVEMENT_NOTE).join(noteMovement);

    const options = {
      title,
      message,
      // url: downloadDest,
      subject: title,
    };
    return options;
  }

  static async sharePDF(data: any, url: string): Promise<any> {
    return { data, url };
  }
}

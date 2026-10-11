/**
 * En vista de pasos
 * paso 1: S -> Seleccion
 * paso 2: C -> Confirmar
 * paso 3: E -> Exito
 */
export interface AnalyticsLabels {
  [name: string]: string;
}

export default {
  backicon: 'btn_back', // Botón Atras, cabecera
  signinscreen_buttonexternal_contact: 'signin_btn_contacto', // Botón Contacto
  signinscreen_buttonexternal_map: 'signin_btn_ubicanos', // Botón Ubícanos
  signinscreen_button_signin: 'signin_btn_ingresar', // Botón Ingresar
  signinscreen_buttonsecondary_signup: 'signin_btn_registrate', // Botón Registrate Aquí
  signinscreen_buttonsecondary_signup_onb:
    'signinscreen_buttonsecondary_signup_onb', //Botón Registrate Onboarding
  copilotmodal_buttonsecondary_apptour_signup: 'signin_tour_btn_registrate', // Botón Registrate Aquí Tour
  copilotmodal_touchableopacity_apptour_close: 'signin_tour_btn_cerrar', // Botón Cerrar Tour
  signinscreen_buttonlink_forgot_password: 'signin_btn_olvide_clave', // Botón Olvidé mi clave de Internet
  confirmcode_no_is_my_number: 'Register_btn_no_number',
  confirmcode_no_is_my_number_enroll: 'confirmcode_no_is_my_number_enroll',
  confirmcode_text_resend_title: 'Register_btn_resend_number',
  signupsmsscreen_textinputcode_otp_link:
    'signupsmsscreen_textinputcode_otp_link',
  signinscreen_checkbox_reminder: 'signin_chck_recordar', // Checkbox Recordar Tarjeta
  signinscreen_checkbox_reminder_off: 'signin_chck_recordar_off', // Checkbox Recordar Tarjeta
  signinscreen_tooltip_reminder: 'signin_tip_recordar', // Tooltip Recordar Tarjeta
  signinscreen_tooltip_internet_key: 'signin_tip_clave_de_internet', // Tooltip Clave de Internet
  signinscreen_tooltip_tap_internet_key: 'signin_tap_tip_clave_de_internet', // Clic Tooltip Clave de Internet
  signinscreen_tooltip_tap_internet_nrodoc: 'signin_tap_tip_nro_doc',
  signinscreen_textinput_card_number: 'signin_caja_numero_tarjeta', // Caja Numero de Tarjeta
  signinscreen_textinput_internet_key: 'signin_caja_clave_de_internet', // Caja Clave de Internet
  signinscreen_textinput_document: 'signin_caja_documento', // Caja Documento de identidad

  focus_toggle: 'focus_toggle', // Cambiar foco
  analytics_test: 'analytics_test', // Cambiar foco

  securitysealscreen_button_prev: 'securityseal_btn_anterior', // Flecha Página Anterior
  securitysealscreen_button_next: 'securityseal_btn_siguiente', // Flecha Página Siguiente
  securitysealscreen_button_send_image_server: 'securityseal_btn_seleccionar', // Botón Seleccionar
  securitysealscreen_page_button_active_icon: 'securityseal_btn_page',
  securitysealscreen_select_item: 'securityseal_btn_item',

  resumeaccount_button_share: 'saving_btn_compartir', // Botón Compartir
  resumeaccount_buttonimagetooltipmodal_cci: 'saving_tip_cci', // Tooltip
  resumeaccount_buttonlink_toggle_detail: 'show_hide_detail_dpf', // Mostrar menos/mas detalle de dpf

  movementitem_itemlist: 'saving_tap_lista_movimiento', // Detalle Movimiento

  queriesscreen_itemlist: 'queries_tap_lista_cuenta', // Detalle Cuenta
  queriesscreen_itemlist_tab: 'queries_tap_lista_cuenta_tab', // Detalle Cuenta

  spotlightscreen_typesitem_see_all_tasks: 'dia_btn_ver_pendientes',
  spotlightscreen_button_create_task: 'dia_btn_agregar_pendiente',

  movementscreen_textinput_note: 'savingsmov_caja_nota_mov', // Caja Nota de Movimiento
  movementscreen_button_back: 'savingsmov_btn_ir_atras', // Botón Ir Atras
  movementscreen_button_share: 'savingsmov_btn_compartir', // Botón Compartir
  movementscreen_button_save_note: 'savingsmov_btn_guardar_nota', // Botón Guardar Nota de Movimiento
  movementscreen_button_cancel: 'savingsmov_btn_cancelar', // Botón Cancelar

  handleerror_button_title: 'error_btn_reiniciar',

  loanscreen_resumeaccount_button_pay: 'prestamo_btn_pagar',
  loanscreen_bannerinstantcash: 'prestamo_banner_efectivo',
  loanscreen_bannergenericloan: 'prestamo_banner_generico',

  loanspostponementmessagescreen_header: 'prestamo_postponement_header',
  loanspostponementmessagescreen_button_start:
    'prestamo_postponement_btn_empezar',
  loanspostponementmessagenotallowscreen_button_finish:
    'prestamo_postponement_btn_terminar',
  loansreschedulemessagescreen_period_item_selector:
    'prestamo_periodo_item_selector',
  loansrescheduleconfirmscreen_term_item_selector:
    'prestamo_reschedule_term_item_selector',
  loansrescheduleconfirmscreen_button_calculate:
    'prestamo_reschedule_btn_calcular',
  loansrescheduleconfirmscreen_button_reprogramar:
    'prestamo_reschedule_btn_reprogramar',
  loansfreezingcodeverifyscreen_button_reprogramar:
    'prestamo_freezing_btn_reprogramar',
  loansreschedulesuccessscreen_button_share:
    'prestamo_reschedule_exit_btn_compartir',
  loansreschedulesuccessscreen_button_end: 'prestamo_reschedule_exit_btn_fin',
  loansrescheduleverifyscreen_textinputmasked_email:
    'prestamo_reschedule_caja_correo',
  loansrescheduleverifyscreen_buttonlink_terms:
    'prestamo_reschedule_link_terminos',
  loansrescheduleverifyscreen_tooltip_terms:
    'confirmcode_alertmodal_actionbutton',
  loansfreezingcodeverifyscreen_buttonlink_terms:
    'prestamo_freezing_link_terminos',

  loansfreezingconfirmscreen_button_reprogramar:
    'prestamo_freezing_btn_reprogramar',
  loansfreezingsuccessscreen_button_share:
    'prestamo_freezing_success_exit_btn_compartir',
  loansfreezingsuccessscreen_button_end:
    'prestamo_freezing_success_exit_btn_fin',

  alertmodaloptionsneartoexpire_button_cancel: 'alert_nearexpire_btn_cancelar',
  alertmodaloptionsneartoexpire_button_success: 'alert_nearexpire_btn_aceptar',
  alertmodaloptions_button_success: 'alert_btn_aceptar',
  alertmanager_onalert: 'alert_nueva_alerta',

  alertmodalmediaoptions_button_success: 'alert_btn_aceptar',

  maintenancemodaloptions_button_success: 'mantenimiento_btn_aceptar',
  maintenancemodaloptions_button_gotoweb: 'mantenimiento_btn_web',

  alert_cancelbutton: 'alert_btn_cancel',
  alert_actionbutton: 'alert_btn_accion',

  transferstypes_item_between_my_accounts: 'trans_entre_propias',
  transferstypes_item_to_other_accounts: 'trans_a_terceros_mibanco',
  transferstypes_item_to_other_banks: 'trans_a_terceros_otros_bancos',
  transferstypes_item_to_other_banks_web: 'trans_a_terceros_otros_bancos_web',
  transferstypes_item_to_other_banks_web_go_to_web:
    'trans_a_terceros_otros_bancos_web_btn_pagar',

  paymentstypes_item_own_loans: 'pagos_prestamos_propios',
  paymentstypes_item_other_loans: 'pagos_prestamos_terceros',
  paymentstypes_item_other_loans_go_to_web: 'pagos_prestamos_terceros_web',
  paymentstypes_typesitem_go_to_pay_my_services_go_to_web:
    'pagos_mis_servicios_btn',
  paymentstypes_item_own_loans_notallowedalert_btn:
    'pagos_prestamos_terceros_modal_btn',

  paymentstypes_typesitem_go_to_pay_my_services: 'pagos_mis_servicios',

  transfersmyaccountschoosescreen_accountselector_origin:
    't_my_acnts_s_cuenta_origen', // Seleccionador Cuenta Origen
  transfersmyaccountschoosescreen_accountselector_target:
    't_my_acnts_s_cuenta_destino', // Seleccionador Cuenta Destino
  transfersmyaccountschoosescreen_textinput_amount: 't_my_acnts_s_caja_monto', // Caja Monto
  transfersmyaccountschoosescreen_button_continue:
    't_my_acnts_s_boton_siguiente', // Botón Siguiente
  transfersmyaccountschoosescreen_button_cancel: 't_my_acnts_s_boton_atras', // Botón Ir atrás

  transfersmyaccountsconfirmscreen_button_back: 't_my_acnts_c_boton_regresar', // Boton Ir atrás
  transfersmyaccountsconfirmscreen_button_confirm:
    't_my_acnts_c_boton_transferir', // Boton Transferir

  transfersmyaccountssuccessscreen_button_share: 't_my_acnts_e_boton_compartir', // Boton Compartir

  transfersotheraccountschoosescreen_accountselector_origin:
    't_ot_acnts_s_cuenta_origen', // Seleccionador Cuenta Origen
  transfersotheraccountschoosescreen_event_origin_autoassigned:
    't_ot_acnts_s_evento_origen_auto', // Evento usuario con una cuenta
  transfersotheraccountschoosescreen_textinput_target:
    't_ot_acnts_s_caja_destino', // Caja Cuenta Destino
  transfersotheraccountschoosescreen_textinput_amount:
    't_ot_acnts_s_caja_monto', // Caja Monto
  transfersotheraccountschoosescreen_button_continue:
    't_ot_acnts_s_boton_siguiente', // Botón Siguiente
  transfersotheraccountschoosescreen_button_cancel: 't_ot_acnts_s_boton_atras', // Botón Ir atrás

  transfersotheraccountsconfirmscreen_textinputfrequentcontact_contactname:
    't_ot_acnts_e_crear_contacto',
  transfersotheraccountsconfirmscreen_textinputcode_otp:
    't_ot_acnts_c_caja_codigo_sms', // Caja Código SMS
  transfersotheraccountsconfirmscreen_checkbox_save_transference:
    't_ot_acnts_c_marcar_trans', // Marcar transferencia
  transfersotheraccountsconfirmscreen_show_modal_tooltip:
    't_ot_acnts_c_tip_informacion_cel', // Tooltip información celular
  transfersotheraccountsconfirmscreen_modal_close:
    't_ot_acnts_c_modal_cel_cerrar', // Boton Tooltip Modal Cerrar
  transfersotheraccountsconfirmscreen_modal_action:
    't_ot_acnts_c_modal_cel_cambiar', // Boton Tooltip Modal Cambiar celular
  transfersotheraccountsconfirmscreen_button_confirm:
    't_ot_acnts_c_boton_confirmar', // Botón Confirmar
  transfersotheraccountsconfirmscreen_button_back: 't_ot_acnts_c_btn_atras', // Botón atras
  transfersotheraccountsconfirmscreen_text_resend_sms:
    't_ot_acnts_c_boton_reenviar_sms', // Botón Reenviar SMS
  transfersotheraccountsconfirmscreen_confirmation_tooltipmodal:
    't_ot_acnts_c_tooltip',
  transfersotherbankschoosescreen_button_closebankdoesntaccept:
    'transfersotherbankschoosescreen_button_closebankdoesntaccept',
  transfersotherbankschoosescreen_button_actionbankdoesntaccept:
    'transfersotherbankschoosescreen_button_actionbankdoesntaccept',

  transfersotheraccountssuccessscreen_button_share: 't_o_acnts_s_share', // Boton Compartir

  confirmationsendingmessage_tooltipmodal: 'msg_constancia_tip_correo', // Tooltip Correo Electrónico
  confirmationsendingmessage_text_set_mail: 'msg_constancia_ingresar_correo', // Boton Ingresar correo electrónico
  confirmationsendingmessage_tooltipmodal_action:
    'msg_constancia_btn_cambiar_correo', // Boton Tooltip Modal Actualizar correo
  confirmationsendingmessage_tooltipmodal_close: 'msg_constancia_btn_cerrar', // Boton Tooltip Modal Cerrar

  /**
   * nombres reservados por firebase
   * https://support.google.com/firebase/answer/6317498?authuser=0
   */
  signin_success: 'login',
  signin_success_enroll_sms: 'login_enroll_sms',
  signin_success_security_seal: 'login_security_seal',
  signupdni_success: 'regfacephi_exitoso',
  signup_success: 'regtarjeta_exitoso',

  /**
   * nombres reservados por facebook
   * https://developers.facebook.com/docs/marketing-api/app-event-api/?locale=es_ES
   */
  fb_signup_success: 'fb_mobile_complete_registration',
  fb_signup_dni_success: 'fb_mobile_complete_dni_registration',

  fb_instantcash_success: 'fb_mobile_purchase',

  fb_instantcash_success_urpi: 'fb_mobile_purchase',
  fb_payment_cuota: 'fb_product_pagocuota',
  product_deseembolso_urpi: 'product_deseembolso_urpi',
  fee_payment: 'fee_payment',
  instantcash_success: 'ecommerce_purchase',
  forgotpassword_success: 'sign_up',

  instantcash_short_success: 'ecommerce_short_purchase',

  session_save: 'sesion_guardar',
  root_status: 'estado_dispo',
  session_clear: 'sesion_limpiar',

  securekeyboard_next: 'tecla_aceptar_presionada',
  securekeyboard_hide: 'tecla_ocultar_presionada',
  securekeyboard_removekey: 'tecla_borrar_presionada',
  securekeyboard_removekey_long: 'tecla_borrar_todo_presionada',
  securekeyboard_decimalseparator_key: 'tecla_borrar_todo_presionada',

  sessionmenu_actionmenu_dots: 'menu_abrir',
  sessionmenu_actionmenu_profile: 'menu_mi_perfil',
  sessionmenu_actionmenu_feedback: 'menu_sugerencias',
  sessionmenu_actionmenu_logout: 'menu_cerrar_session',

  profilescreen_panel_email: 'perfil_btn_correo', // Botón Correo
  profilescreen_panel_phone: 'perfil_btn_telefono', // Botón Teléfono

  changeemailscreen_textinput_new_email: 'cambiar_email_caja', // Caja Correo electrónico
  changeemailscreen_button_back: 'cambiar_email_btn_atras', // Botón Ir Atrás
  changeemailscreen_button_save: 'cambiar_email_btn_guardar', // Botón Guardar
  changeemailscreen_button_accept_atm: 'cambiar_email_btn_aceptar_clave', // Botón Modal Aceptar
  changeemailscreen_button_cancel_atm: 'cambiar_email_btn_cancelar_clave', // Botón Modal Cancelar
  changeemailscreen_textinputcode_otp: 'cambiar_email_caja_clavesms', // Caja Clave OTP
  changeemailscreen_buttonlink_resend: 'cambiar_email_btn_reenviarsms',

  changephonescreen_textinput_new_phone: 'cambiar_tel_caja', // Caja Celular
  changephonescreen_button_back: 'cambiar_tel_btn_atras', // Botón Ir Atrás
  changephonescreen_button_save: 'cambiar_tel_btn_guardar', // Botón Guardar
  changephonescreen_button_accept_atm: 'cambiar_tel_btn_aceptar_clave', // Botón Modal Aceptar
  changephonescreen_button_cancel_atm: 'cambiar_tel_btn_cancelar_clave', // Botón Modal Cancelar
  changephonescreen_textinputcode_otp: 'cambiar_tel_caja_clavesms', // Caja Clave OTP
  changephonescreen_buttonlink_resend: 'cambiar_tel_btn_reenviarsms',

  changeprofilesucessscreen_button_profile: 'perfil_s_btn_regresar', // Botón Ir a Mi Perfil
  changeprofilesucessscreen_button_success: 'perfil_s_btn_regresar', // Botón Regresar, se usa cuando tiene returnOptions

  accountselector_touchable_modal_open: 'accountselector_btn_modal_abrir', // Boton Seleccionar Cuenta
  accountselector_open: 'accountselector_abrir',

  selectaccountdropdown_item: 'accountselector_item',

  feeitem_buttonlink_selectall: 'cuota_selec_todo',

  circularcheck_button: 'circularcheck_button',

  frequentitem_touchable_edit: 'contacto_boton_editar',
  frequentitem_detail: 'contacto_ir',

  rootedscreen_button_exit: 'rooteado_btn_salir', // Botón Salir
  rootedscreen_link_homebanking: 'rooteado_link_homebanking', // Link a Homebanking
  rootedscreen_button_homebanking: 'rooteado_btn_homebanking', // Botón a Homebanking

  changecontactscreen_button_delete: 'contacto_pre_eliminar', // Eliminar Contacto
  changecontactscreen_button_modal_trydelete_close:
    'contacto_eli_btn_modal_pre_canc', // Botón Cancelar
  changecontactscreen_button_modal_trydelete_action:
    'contacto_eli_btn_modal_pre_eli', // Botón Eliminar
  changecontactscreen_button_modal_return: 'contacto_eli_btn_modal_regresar', // Botón Ir a transferencias

  changecontactscreen_textinput_new_alias: 'contacto_mod_caja_nuevo_alias', // Caja Nuevo alias
  changecontactscreen_button_back: 'contacto_mod_btn_atras', // Botón Atrás
  changecontactscreen_button_save: 'contacto_mod_btn_guardar', // Botón Guardar

  changecontactsuccessscreen_button_transfers: 'contacto_mod_s_btn_trans', // Botón Ir a Transferencias

  tooltip_overlay: 'tooltip_btn_ocultar', // Ocultar tooltip clic fuera
  tooltip_touchable_content: 'tooltip_btn_tooltip', // Botón tooltip

  modal_overlay: 'modal_ocultar', // Clic fuera del modal
  modal_buttonimage_close: 'modal_cerrar',

  step_modal_overlay: 'step_modal_ocultar',
  step_next_button: 'step_siguiente_boton',
  step_finish_button: 'step_finalizar_boton',
  step_back_button: 'step_finalizar_boton',
  step_skip_button: 'step_omitir_boton',

  validationmodal_textinput_otp: 'caja_otp', // Caja OTP
  validationmodal_link_ask_again: 'validacion_btn_linksms',

  termsmodal_button_close: 'btn_cerrar_terms', // Botón Cerrar Términos y condiciones
  termsmodal_button_agree: 'btn_aceptar_terms', // Botón Aceptar Términos y condiciones

  instantcashconfirmscreen_termsmodal: 'instantcashconfirmscreen_termsmodal',
  instantcashshortconfirmscreen_termsmodal:
    'instantcashshortconfirmscreen_termsmodal',
  instantcashshortconfirmscreen_termsmodal_clau:
    'instcashshortconf_termsmodal_clau',
  instantcashshortconfirmscreen_termsmodal_certificate:
    'instantcashshortconfi_termsmodal_cert',

  instantcashshortconfirmscreen_termsmodal_1:
    'instcashshortconfirm_termsmodal1',
  instantcashshortconfirmscreen_termsmodal_2:
    'instcashshortconfirm_termsmodal2',
  instantcashshortconfirmscreen_termsmodal_3:
    'instcashshortconfirm_termsmodal3',

  signupcredentialsscreen_textinput_document:
    'regtarjeta_c_caja_numero_documento', // Caja Numero de tarjeta
  signupcredentialsscreen_textinput_card_number:
    'regtarjeta_c_caja_numero_tarjeta', // Caja Numero de tarjeta
  signupcredentialsscreen_textinput_atmpassword:
    'regtarjeta_c_caja_clave_del_cajero', // Caja Clave del cajero
  signupcredentialsscreen_textinput_cellphone_number:
    'regtarjeta_c_caja_numero_de_celular', // Caja Número de celular
  signupcredentialsscreen_tooltip_internet_key:
    'regtarjeta_tip_clave_de_internet', // Tooltip Clave de Internet
  signupcredentialsscreen_captcha: 'regtarjeta_captcha', // Captcha
  signupcredentialsscreen_button_continue: 'regtarjeta_pas1_btn_continuar', // Botón Siguiente

  signupinvalidscreen_button_login: 'regtarjeta_novalid_btn_terminar',
  signupinvalidscreen_button_map: 'regtarjeta_novalid_btn_ubicanos',

  signupsmsscreen_textinputcode_otp: 'regtarjeta_sms_caja_otp', // Caja Código SMS
  signupsmsscreen_button_continue: 'regtarjeta_pas2_btn_continuar', // Botón Continuar
  signupresetscreen_button_continue: 'regtarjeta_pas3_btn_continuar',

  signupresetscreen_checkbox_terms: 'regtarjeta_r_chck_term_condi', // Checkbox Términos y condiciones
  signupresetscreen_checkbox_terms_off: 'regtarjeta_r_chck_term_condi_off', // Checkbox Términos y condiciones

  signupresetscreen_buttonlink_terms: 'regtarjeta_r_btn_term_condi', // Botón Términos y condiciones
  signupresetscreen_textinput_internet_key: 'regtarjeta_r_caja_clave_internet', // Caja Clave de Internet
  signupresetscreen_textinput_internet_key_repeat:
    'regtarjeta_r_caja_repite_clave_inet', // Caja Repite Clave de Internet
  signupsuccessscreen_signup_button: 'regtarjeta_pasofin_btn_finish', // Botón Ir al Inicio

  forgotpasswordcredentialsscreen_textinput_document:
    'recuperar_c_caja_numero_documento', // Caja Numero de tarjeta
  forgotpasswordcredentialsscreen_textinput_card_number:
    'recuperar_c_caja_numero_tarjeta', // Caja Numero de tarjeta
  forgotpasswordcredentialsscreen_textinput_atmpassword:
    'recuperar_c_caja_clave_del_cajero', // Caja Clave del cajero
  forgotpasswordcredentialsscreen_textinput_cellphone_number:
    'recuperar_c_caja_numero_de_celular', // Caja Número de celular
  forgotpasswordcredentialsscreen_tooltip_internet_key:
    'recuperar_tip_clave_de_internet', // Tooltip Clave de Internet
  forgotpasswordcredentialsscreen_captcha: 'recuperar_captcha', // Captcha
  forgotpasswordcredentialsscreen_button_continue: 'recuperar_c_btn_continuar', // Botón Siguiente

  forgotpasswordinvalidscreen_button_login: 'recuperar_novalid_btn_terminar',
  forgotpasswordinvalidscreen_button_map: 'recuperar_novalid_btn_ubicanos',

  forgotpasswordsmsscreen_textinputcode_otp: 'recuperar_sms_caja_otp', // Caja Código SMS
  forgotpasswordsms_modal: 'forgotpasswordsms_modal',
  forgotpasswordsms_link: 'forgotpasswordsms_link',
  forgotpasswordsms_open_modal: 'forgotpasswordsms_open_modal',
  forgotpasswordsmsscreen_button_continue: 'recuperar_sms_btn_continuar', // Botón Continuar

  forgotpasswordresetscreen_checkbox_terms: 'recuperar_r_chck_term_condi', // Checkbox Términos y condiciones
  forgotpasswordresetscreen_buttonlink_terms: 'recuperar_r_btn_term_condi', // Botón Términos y condiciones
  forgotpasswordresetscreen_textinput_internet_key:
    'recuperar_r_caja_clave_internet', // Caja Clave de Internet
  forgotpasswordresetscreen_textinput_internet_key_repeat:
    'recuperar_r_caja_repite_clave_inet', // Caja Repite Clave de Internet
  forgotpasswordresetscreen_button_submit:
    'recuperar_r_btn_crear_clave_internet', // Botón Crear clave de internet

  forgotpasswordsuccessscreen_forgotpassword_button:
    'recuperar_btn_ir_a_inicio', // Botón Ir al Inicio

  paymentsownloanschoosescreen_accountselector_origin:
    'p_mis_pres_s_cuenta_origen', // Seleccionador Cuenta Origen
  paymentsownloanschoosescreen_event_origin_autoassigned:
    'p_mis_pres_s_evento_origen_auto', // Evento usuario con una cuenta
  paymentsownloanschoosescreen_tab_fee_item: 'p_mis_pres_s_btn_cuota', // Botón cuota
  paymentsownloanschoosescreen_textinput_target: 'p_mis_pres_s_caja_destino', // Caja Cuenta Destino
  paymentsownloanschoosescreen_textinput_amount: 'p_mis_pres_s_caja_monto', // Caja Monto
  paymentsownloanschoosescreen_button_continue: 'p_mis_pres_s_btn_siguiente', // Botón Siguiente
  paymentsownloanschoosescreen_button_cancel: 'p_mis_pres_s_btn_atras', // Botón Ir atrás
  paymentsownloanschoosescreen_loanitem: 'p_mis_pres_s_btn_detalle', // Botón Ir detalle préstamo
  paymentsownloanschoosescreen_tab_fee: 'p_mis_pres_s_tab_cuotas', // Tab cuotas
  paymentsownloanschoosescreen_tab_partial: 'p_mis_pres_s_tab_parcial', // Tab parcial

  paymentsownloansconfirmscreen_button_confirm: 'p_mis_pres_c_boton_confirmar', // Botón Confirmar
  paymentsownloansconfirmscreen_button_back: 'p_mis_pres_c_btn_atras', // Botón atras
  paymentsownloansconfirmscreen_buttonlink_details: 'p_mis_pres_c_btn_details', // Botón Detalles de monto

  paymentsownloansconfirmscreen_checkbox_terms: 'p_mis_pres_c_chck_term_condi', // Checkbox Términos y condiciones
  paymentsownloansconfirmscreen_buttonlink_terms: 'p_mis_pres_c_btn_term_condi', // Botón Términos y condiciones

  paymentsownloansuptodatescreen_button_back: 'p_mis_pres_ad_regresar', // Boton Regresar
  paymentsownloansuptodatescreen_button_pay_all_loan:
    'p_mis_pres_ad_pagar_todo',

  postponementoption_button_choose: 'postponementoption_button_choose',
  paymentsownloanssuccessscreen_button_share: 'p_mis_pres_e_share', // Boton Compartir
  paymentsownloanssuccessscreen_button_link: 'p_mis_pres_e_s_link', // Boton Ir a detalle de prestamos

  loanresume_buttonlink_loan: 'loanresume_buttonlink_loan',
  adlarge_buttonexternal_loan: 'anuncio_grande_btn_abrir',
  availabilityalert_button_close: 't_ot_banks_alert_horario_cerrar', // Boton Cerrar
  availabilityalert_button_action: 't_ot_banks_alert_horario_web', // Boton Ir a nuestra web
  availabilityalert_checkbox_save_preference: 't_ot_banks_alert_horario_check',

  transfersotherbankschoosescreen_accountselector_origin:
    't_ot_banks_s_cuenta_origen', // Seleccionador Cuenta Origen
  transfersotherbankschoosescreen_event_origin_autoassigned:
    't_ot_banks_s_evento_origen_auto', // Evento usuario con una cuenta
  transfersotherbankschoosescreen_textinput_target: 't_ot_banks_s_caja_destino', // Caja Cuenta Destino
  transfersotherbankschoosescreen_textinput_frequent: 't_ot_banks_s_caja_frecu', // Caja Contacto frecuente
  transfersotherbankschoosescreen_textinput_amount: 't_ot_banks_s_caja_monto', // Caja Monto
  transfersotherbankschoosescreen_touchable_toggle_frequent:
    't_ot_banks_s_btn_frecu', // Botón estrella frecuente
  transfersotherbankschoosescreen_selectfrequentcontactdropdown_item:
    't_ot_banks_s_sel_frec', // Selector contacto frecuente
  transfersotherbankschoosescreen_button_continue:
    't_ot_banks_s_boton_siguiente', // Botón Siguiente
  transfersotherbankschoosescreen_button_cancel: 't_ot_banks_s_boton_atras', // Botón Ir atrás
  transfersotherbankschoosescreen_sectionheader_target_tooltipmodal:
    't_ot_banks_s_tip', // Botón tooltip cuenta interbancaria
  transfersotherbankschoosescreen_sectionheader_target_tooltipmodal_close:
    't_ot_banks_s_tip_cerrar', // Botón cerrar tooltip cuenta interbancaria

  transfersotherbanksconfirmscreen_textinputfrequentcontact_contactname:
    't_ot_banks_e_crear_contacto',
  transfersotherbanksconfirmscreen_textinputcode_otp:
    't_ot_banks_c_caja_codigo_sms', // Caja Código SMS
  transfersotherbanksconfirmscreen_checkbox_save_transference:
    't_ot_banks_marcar_trans', // Marcar transferencia
  transfersotherbanksconfirmscreen_show_modal_tooltip:
    't_ot_banks_c_tip_informacion_cel', // Tooltip información celular
  transfersotherbanksconfirmscreen_modal_close: 't_ot_banks_c_modal_cel_cerrar', // Boton Tooltip Modal Cerrar
  transfersotherbanksconfirmscreen_modal_action:
    't_ot_banks_c_modal_cel_cambiar', // Boton Tooltip Modal Cambiar celular
  transfersotherbanksconfirmscreen_button_confirm:
    't_ot_banks_c_boton_confirmar', // Botón Confirmar
  transfersotherbanksconfirmscreen_button_back: 't_ot_banks_c_btn_atras', // Botón atras
  transfersotherbanksconfirmscreen_text_resend_sms:
    't_ot_banks_c_boton_reenviar_sms', // Botón Reenviar SMS
  transfersotherbanksconfirmscreen_buttonlink_details:
    't_ot_banks_c_btn_details', // Botón Detalles de monto
  transfersotherbanksconfirmscreen_buttonlink_terms:
    't_ot_banks_c_btn_link_terms',
  transfersotherbanksconfirmscreen_checkbox_terms: 't_ot_banks_c_check_terms',
  transfersotherbanksconfirmscreen_confirmation_tooltipmodal:
    't_ot_banks_c_tooltip',
  savingscreen_movementitem: 'saving_movimiento',
  ctsscreen_movementitem: 'cts_movimiento',

  transfersotherbankssuccessscreen_button_share: 't_o_banks_s_share', // Boton Compartir,
  declarationalert_button_agree: 'dpfopen_ca_modal_dec_aceptar', // Botón Si
  declarationalert_button_reject: 'dpfopen_ca_modal_dec_rechazar', // Botón No

  dpfopensuccessscreen_button_share: 'dpfopen_btn_compartir', // Botón Compartir

  dpfopeninvalidscreen_button_location: 'dpfopen_btn_ubicanos', // Botón Ir a Consultas
  dpfopeninvalidscreen_button_end: 'dpfopen_btn_fin',

  dpfopencalculatorscreen_textinput_email: 'dpfopen_ca_caja_correo', // Caja texto correo
  dpfopencalculatorscreen_textinput_amount: 'dpfopen_ca_caja_monto', // Caja monto
  dpfopencalculatorscreen_dpf_selected: 'dpfopen_ca_seleccion_dpf', // Seleccionador DPF
  dpfopencalculatorscreen_button_continue: 'dpfopen_ca_btn_siguiente', // Boton Siguiente
  dpfopencalculatorscreen_dpfrow: 'dpfopen_ca_resul_item',

  dpfopenchoosescreen_accountselector_origin: 'dpfopen_s_cuenta_origen', // Seleccionador Cuenta Origen
  dpfopenchoosescreen_accountselector_target: 'dpfopen_s_cuenta_destino', // Seleccionador Cuenta Destino
  dpfopenchoosescreen_checkbox_autorenew: 'dpfopen_s_check_renovar', // Check renovar automáticamente
  dpfopenchoosescreen_button_continue: 'dpfopen_s_btn_siguiente', // Botón siguiente
  dpfopenchoosescreen_button_cancel: 'dpfopen_s_btn_iratras', // Botón ir atrás
  dpfopenchoosescreen_textinput_email: 'dpfopen_s_caja_correo', // Caja texto correo
  dpfopenchoosescreen_textinput_email_empty: 'dpfopen_s_caja_correo_e', // Evento indicando que presiono siguiente con el email vacío
  dpfopenchoosescreen_form_invalid: 'dpfopen_s_form_invalid', // Evento indicando que presiono siguiente con el formulario inválido

  dpfopenconfirmscreen_textinputcode_otp: 'dpfopen_c_s_caja_codigo_sms', // Text input codee
  dpfopenconfirmscreen_text_resend_sms: 'dpfopen_c_s_boton_reenviar_sms', // Botón Reenviar SMS
  dpfopenconfirmscreen_button_back: 'dpfopen_c_s_btn_atras', //
  dpfopenconfirmscreen_button_confirm: 'dpfopen_c_s_btn_confirmar', //
  dpfopenconfirmscreen_modal_action: 'dpfopen_c_s_modal_btn_si',
  dpfopenconfirmscreen_modal_close: 'dpfopen_c_s_modal_btn_no',
  dpfopenconfirmscreen_buttonlink_terms: 'dpfopen_c_s_btn_terms',
  dpfopenconfirmscreen_checkbox_terms: 'dpfopen_c_s_check_terms',
  dpfopenconfirmscreen_confirmation_tooltipmodal: 'dpfopen_c_s_tooltip',

  dpfavailabilityalert_button_close: 'dpfopen_ca_hora_alert_btn_cerr', // Botón de alerta fuera de horario botón Cerrar

  confirmphonealert_button_close: 'dpfopen_s_cfm_alert_btn_actu', // Botón de alerta confirmación número botón Actualizar
  confirmphonealert_button_action: 'dpfopen_s_cfm_alert_btn_cont', // Botón de alerta confirmación número botón Continuar

  invalidphonealert_button_close: 'dpfopen_s_ivl_alert_btn_cerr', // Botón de alerta invalido número botón Cerrar
  invalidphonealert_button_action: 'dpfopen_s_ivl_alert_btn_per', // Botón de alerta invalido número botón Ir a mi Perfil

  maintenancescreen_button_title: 'manteni_btn_regresar',

  resumeaccount_button_cancel_dpf: 'dpf_btn_cancelar',
  dpfscreen_movementitem: 'dpf_movimiento',
  dpfscreen_expandableview_button: 'dpf_detail_btn_try_cancel',
  dpfscreen_alertmodal_actionbutton: 'dpf_detail_modal_btn_closedpf',
  dpfscreen_expandableview_others: 'dpf_detail_btn_expandir',
  confirmcode_alertmodal_actionbutton: 'smscode_alertm_btn',
  instcashshort_confirm_codebtnlink: 'instcashshort_confirm_codebtnlink',
  instantcashshort_actionbtn: 'instantcashshort_actionbtn',
  confirmcode_alertmodal_resend_actionbutton: 'smscode_alertm_btn_resend',
  confirmcode_alertmodal_cancel_actionbutton: 'smscode_alertm_btn_cancel',
  dpfscreen_alertmodal_cancelbutton: 'dpf_detail_modal_btn_cancel',

  modalsuccess_button_close: 'modal_btn_cerrar',
  toast_touchable_action: 'toast_btn_action',
  scrollmore_button: 'scrollbtn',
  networkstatusalert_message: 'sinconexion_btn',
  confirmmodal_button_success: 'confirmmodal_btn_ok',
  confirmmodal_button_cancel: 'confirmmodal_btn_cancel',
  actionmenu_tooltip: 'actionmenu_tooltip',
  actionmenu_overlay: 'actionmenu_overlay',
  selectfrequentcontactdropdown_item: 'contactofrecuente_item',
  selectaccountmodal_item: 'cuenta_item',
  confirmationsendingmessage_touchable: 'confirmacion_btn',
  infocontactcrash_buttonlink: 'infocontact_link',
  infocontact_buttonlink: 'infocontact_link',
  textinput_clear_button: 'textinput_limpiar',
  selector_item: 'selector_item',
  selectortag_item: 'selectortag_item',
  selectortags_item: 'selectortags_item',
  loanresumeitem: 'prestamo_btn_resumen',
  frequentlist_item: 'frecuentes_item',

  accountlist_loan: 'cuentas_item_prestamo',
  accountlist_accountcts: 'cuentas_item_cts',
  accountlist_deposit: 'cuentas_item_dpf',
  accountlist_accountcc: 'cuentas_item_cc',
  accountlist_accountca: 'cuentas_item_ca',

  renameaccount_textinput_alias: 'renombrar_txt_alias',
  renameaccount_button_save: 'renombrar_btn_guardar',
  renameaccount_button_rename: 'renombrar_btn_renombrar',
  renameaccount_button_edit: 'renombrar_btn_editar',

  accountfield_touchable_edit: 'cuenta_btn_editar',

  textinputmasked_touchable_container: 'textinput_mask_btn',
  textinputcode_focus: 'textinputcode_btn_focus',

  taskdetailsscreen_button_complete: 'tarea_btn_completar',
  taskdetailsscreen_button_delete: 'tarea_pre_eliminar',
  taskdetailsscreen_alert_button_cancel: 'tarea_eliminar_cancel',
  taskdetailsscreen_alert_button_success: 'tarea_eliminar_ok',

  itemselectormodal_item: 'item_selector',
  itemselector_open: 'itemselector_abrir',

  paymentsserviceschoosecategoryscreen_iconbutton_category:
    'p_serv_escoger_btn_category',
  paymentsserviceschooseproviderscreen_itemselector_company:
    'p_serv_proveedor_item_empresa',
  paymentsserviceschooseproviderscreen_itemselector_service:
    'p_serv_proveedor_item_servicio',
  paymentsserviceschooseproviderscreen_textinput_supply:
    'p_serv_proveedor_txt_suministro',
  paymentsserviceschooseproviderscreen_button_continue:
    'p_serv_proveedor_btn_continuar',
  paymentsserviceschooseaccountscreen_button_continue:
    'p_serv_cuenta_btn_continuar',

  paymentsservicesconfirmscreen_button_continue: 'p_serv_confir_btn_continuar',
  paymentsservicesvalidaccountnotfoundscreen_button_map:
    'p_serv_acc_ntf_btn_ubicanos',

  confirmcode_button_resend: 'p_serv_confir_btn_reenviar',
  confirmcode_textinputcode_otp: 'p_serv_confir_txt_otp',

  paymentsserviceschoosebillscreen_button_continue:
    'p_serv_deuda_btn_continuar',
  paymentsserviceschoosebillscreen_bill_item: 'p_serv_recibo_bill_item',

  paymentsservicessuccessscreen_button_share: 'p_serv_exit_btn_continuar',
  paymentsservicessuccessscreen_button_movements: 'p_serv_exit_btn_movimientos',
  signinscreen_captcha: 'signin_captcha',

  captcha_open: 'captcha_abrir',
  captcha_cancel: 'captcha_cancelar',

  selectoramount_pay_all_loan: 'sel_monto_btn_pagar_todo',

  loanresume_button_pay: 'prestamo_btn_pagar',

  instantcashstartscreen_apicall_list_options: 'efectalt_flargo_api_opciones',
  instantcashstartscreen_button_continue: 'efectalt_flargo_calc_btn_continuar',
  instantcashstartscreen_panel_options_feesrow: 'efectalt_flargo_calc_opcion',
  instantcashstartscreen_itemselector_destination:
    'efectalt_flargo_calc_destino',
  instantcashstartscreen_itemselector_paymentdate:
    'efectalt_flargo_calc_fechap',
  instantcashstartscreen_textinputamount_amount:
    'efectalt_flargo_calc_txt_monto',
  instantcashstartscreen_modalaccount_btn_newaccount:
    'efectalt_flargo_calc_mdl_btn_nuevacta',
  instantcashstartscreen_modalaccount_btn_canccel:
    'efectalt_flargo_calc_mdl_btn_cancel',
  instantcashshortstartscreen_email_tooltip: 'efectalt_cort_email_tooltp',
  instantcashshortstartscreen_modal_email_open: 'efectalt_cort_email_modalopen',
  instantcashshortstartscreen_modal_email_open_tooltip:
    'efectalt_cort_tooltipmodalopen',

  ad_buttonexternal_title: 'anuncio_btn_ir',
  bannerinstantcash_buttonlink_title: 'banner_efecalt_btn_ir',
  bannergenericloan_buttonlink_title: 'banner_gnrloan_btn_ir',

  emptyloansscreen_button_map: 'emptyloans_btn_ubicanos',
  emptyloansscreen_button_kind_of_loans: 'emptyloans_btn_ubicanos',
  ad_open: 'anuncio_abrir',
  ad_overlay_hide: 'anuncio_fondo_ocultar',
  ad_adlarge_open: 'anuncio_grande_abrir',
  ad_close: 'anuncio_cerrar',
  ad_arrow: 'anuncio_btn_continuar',
  adlarge_close: 'anuncio_grande_minimizar',
  notallowedalert_button_action: 'nopermitido_btn_entiendo',
  expandableview_buttonlink_toggle_detail: 'exview_show_hide_detail',
  feesrowsexpandableview_buttonlink_toggle_detail:
    'feesrowsexview_show_hide_detail',
  instantcash_modal_insurance_close: 'instantcash_modal_insurance_close',
  instantcashselectinsurance_select_plan: 'efectalt_sseguro_select_plan',
  instantcashselectinsurance_change_option: 'efectalt_sseguro_change_option',
  instantcashselectinsurance_button_default: 'efectalt_sseguro_button_default',
  instantcashselectinsurance_select_finantialprotection:
    'efectalt_sseguro_select_finantialprotection',
  instantcashselectinsurance_cancel_finantialprotection:
    'efectalt_sseguro_cancel_finantialprotection',
  instantcashselectinsurance_modal_finantialprotection:
    'efectalt_sseguro_modal_finantialprotection',
  instantcashselectinsurance_select_oncological:
    'efectalt_sseguro_select_oncological',
  instantcashselectinsurance_cancel_oncological:
    'efectalt_sseguro_cancel_oncological',
  instantcashselectinsurance_modal_oncological:
    'efectalt_sseguro_modal_oncological',
  instantcashselectinsurance_select_family: 'efectalt_sseguro_select_family',
  instantcashselectinsurance_cancel_family: 'efectalt_sseguro_cancel_family',
  instantcashselectinsurance_modal_family: 'efectalt_sseguro_modal_family',
  instantcashselectinsurance_cancel_business:
    'efectalt_sseguro_cancel_business',
  instantcashselectinsurance_select_business:
    'efectalt_sseguro_select_business',
  instantcashselectinsurance_modal_business: 'efectalt_sseguro_modal_family',
  instantcashchoosescreen_textinputmasked_email:
    'efectalt_flargo_escoj_caja_correo',
  instantcashchoosescreen_button_continue:
    'efectalt_flargo_escoj_btn_continuar',
  instantcashchoosescreen_accountselector_target:
    'efectalt_flargo_escoj_cuenta_destino', // Seleccionador Cuenta Destino

  instantcashshortstartscreen_accountselector_target_urpi:
    'efectalt_fcorto_escoj_cta_dest_urpi',
  instantcashshortstartscreen_accountselector_target:
    'efectalt_fcorto_escoj_cta_dest', // Seleccionador Cuenta Destino
  instantcashshortstartscreen_textinputmasked_email:
    'efectalt_fcorto_escoj_caja_correo',
  instantcashshortstartscreen_button_continue:
    'efectalt_fcorto_escoj_btn_continuar',
  instantcashshortstartscreen_alert_button_agree:
    'efectalt_fcorto_escoj_alert_ok',
  instantcashshortstartscreen_alert_button_cancel:
    'efectalt_fcorto_escoj_alert_cancel',
  instantcashshortstartscreen_alert_button_understand:
    'efectalt_fcorto_escoj_alert_getit',
  instantcashconfirmscreen_checkbox_terms: 'efectalt_flargo_c_check_terminos',
  instantcashconfirmscreen_checkbox_terms_off:
    'efectalt_flargo_c_check_terminos_off',
  instantcashconfirmscreen_checkbox_termsPEP:
    'instantcashconfirmscreen_checkbox_termsPEP',
  instantcashconfirmscreen_buttonlink_termsPEP:
    'instantcashconfirmscreen_buttonlink_termsPEP',
  instantcashconfirmscreen_buttonlink_terms: 'efectalt_flargo_c_link_terminos',
  instantcashconfirmscreen_button_continue: 'efectalt_flargo_c_btn_siguiente',
  instantcashconfirmscreen_text_resend_sms: 'efectalt_flargo_c_btn_reenvio',
  instantcashconfirmscreen_expandable_view: 'efectalt_flargo_c_btn_expandir',
  instantcashshortconfirmscreen_checkbox_terms:
    'efectalt_fcorto_c_check_terminos',
  instantcashshortconfirmscreencheckbox_terms_two:
    'efectalt_fcorto_c_check_terms_two',
  instantcashshortconfirmscreencheckbox_terms_two_off:
    'efectalt_fcorto_c_check_terms_two_off',
  instantcashshortconfirmscreencheckbox_terms_final:
    'efectalt_fcorto_c_check_terms_final',
  instantcashshortconfirmscreencheckbox_terms_final_off:
    'efectalt_fcorto_c_check_terms_final_off',
  instantcashshortconfirmscreen_checkbox_terms_insurance:
    'efectalt_fcorto_c_check_terminos_seg',
  instantcashshortconfirmscreen_checkbox_terms_dataprotect:
    'efectalt_fcorto_c_check_terminos_data',
  instantcashshortconfirmscreen_checkbox_terms_urpi_on:
    'inscashshortconfirmcheckboxterm_urpion',
  instantcashshortconfirmscreen_checkbox_terms_urpi_off:
    'inscashshortconfirmcheckboxterm_urpioff',

  instantcashshortconfirmscreen_checkbox_termsinsurances_urpi_on:
    'inscashshortconfirmtermsinsurances_on',
  instantcashshortconfirmscreen_checkbox_termsinsurances_urpi_off:
    'inscashshortconfirmtermsinsurances_off',

  instantcashshortconfirmscreen_checkbox_termspersonaldata_urpi_on:
    'inscashshortconfirmtermspersonal_on',
  instantcashshortconfirmscreen_checkbox_termspersonaldata_urpi_off:
    'inscashshortconfirmtermspersonal_off',
  instantcashshortconfirmscreen_buttonlink_terms:
    'efectalt_fcorto_c_link_terminos',
  instantcashshortconfirmscreen_button_continue:
    'efectalt_fcorto_c_btn_siguiente',
  instantcashshortconfirmscreen_text_resend_sms:
    'efectalt_fcorto_c_btn_reenvio',
  instantcashshortconfirmscreen_text_resend_sms_modal:
    'instcashshortconfirm_btnresendsms',
  instantcashsuccessscreen_button_share: 'efectalt_flargo_exit_btn_continuar',
  instantcashsuccessscreen_button_loan: 'efectalt_flargo_exit_btn_movimientos',
  instantcashsuccessscreen_button_end: 'efectalt_flargo_exit_btn_fin',
  alertmaintenancemodal_button_parcial_ok: 'mantenimiento_modal_parcial_btn',
  alertmaintenancemodal_button_reactivated_ok:
    'mantenimiento_modal_regresamos_btn',
  alertmaintenancemodal_maintenance_total: 'mantenimiento_total',
  alertmaintenancemodal_maintenance_parcial: 'mantenimiento_parcial',
  alertmaintenancemodal_maintenance_reactivated: 'mantenimiento_regresamos',
  instantcashsuccessscreen_channelsmodal_open:
    'instantcashsuccessscreen_channelsmodal',
  instantcashshortsuccessscreen_button_share_title:
    'efectalt_fcorto_exit_btn_compartir',
  instantcashshortsuccessscreen_button_end_title:
    'efectalt_fcorto_exit_btn_fin',
  instantcashshortsuccessscreen_expandableview:
    'efectalt_fcorto_exit_btn_expandir',
  onboardingscreen_gotologinscreen: 'onboarding_btn_loginscreen',
  modalchannels_button_closemodalchannels:
    'modalchannels_button_closemodalchannels',
  modalendorsement_button_closemodal: 'modalendorsement_button_c',
  modalloans_button_closeInfo: 'modalloans_button_closeInfo',
  channels_panel_info_maxMonto: 'channels_panel_info_maxMonto',
  channels_buttonlink_showpanel: 'channels_buttonlink_showpanel',
  instantcashchoosescreen_alertmodal_actionbutton:
    'instantcashchoosescreen_alertmodal_actionbutton',
  instantcashshortstartscreen_textlink_title:
    'instantcashshortstartscreen_textlink_title',
  instantcashshortconfirmscreen_confirmcode:
    'instcashshortconfirmscreen_confirmcode',
  instcashshortconfirm_confirmcodetooltip:
    'instcashshortconfirm_confirmcodetooltip',
  instantcashchoosescreen_textlink: 'instantcashchoosescreen_textlink',
  instantcashchoosescreen_textlink_title:
    'instantcashchoosescreen_textlink_title',
  instantcashchoosescreen_expandable_view:
    'instantcashchoosescreen_btn_expandir',
  instantcashshortstartscreen_alertmodal_actionbutton:
    'instcashshortstart_modal_actionbutton',
  instantcashshortstartscreen_resume_toogle_active:
    'instantcashshortstartscreen_modalexpand',
  instantcashchoosescreen_email_tooltip: 'efectalt_flargo_escoj_email_tooltp',
  instantcashconfirmscreen_email_tooltip: 'efectalt_flargo_conf_email_tooltp',
  instantcashnewaccount_textlink_title: 'efectalt_nuevacta_link_titulo',
  modalnewaccount_btn_seemore: 'modalnuevacta_btn_vermas',
  modalconfirm_insurance_accept: 'modalconfirm_insurance_accept',
  modalconfirm_insurance_cancel: 'modalconfirm_insurance_cancel',
  modalinsuranceinforesume_button_accept: 'modalinforesume_button_accept',
  modalinsuranceinforesume_expandable_view: 'modalinforesume_expandable_view',
  newaccount_redirectmodal: 'nueva_cta_url_modal',
  newaccount_button_close: 'nueva_cta_btn_cerrar',
  newaccount_button_action: 'nueva_cta_btn_accion',
  newaccount_button_modal_action: 'nueva_cta_btn_accion_modal',
  newaccountscreen_text_title: 'nueva_cta_txt_titulo',
  newaccount_list_title: 'nueva_cta_lista_titulo',
  newaccount_list_item1: 'nueva_cta_lista_primer_elemento',
  newaccount_list_item2: 'nueva_cta_lista_segundo_elemento',
  newaccount_list_item3: 'nueva_cta_lista_tercer_elemento',
  newaccount_textlink_title_know_more: 'nueva_cta_btn_conocer_mas',
  newaccount_textlink_title_view_documents: 'nueva_cta_btn_ver_documentos',
  newaccount_btn_continue: 'nueva_cta_btn_continuar',
  newaccountscreen_checkbox_termsPEP: 'nueva_cta_chck_terms_pep',
  newaccountconfirmscreen_header_title: 'nueva_cta_titulo_confirmar',
  newaccountconfirmscreen_confirmcode: 'nueva_cta_confirmar_codigo',
  newaccountconfirmscreen_checkbox_terms: 'nueva_cta_chck_terminos',
  newaccountconfirmscreen_buttonlink_terms: 'nueva_cta_btn_terminos',
  newaccountconfirmscreen_checkbox_footer: 'nueva_cta_chck_final',
  newaccountconfirmscreen_button_continue: 'nueva_cta_btn_continuar',
  newaccountconfirmsscreen_declaration_alert: 'nueva_cta_declaracion_pep',
  declarationalert: 'nueva_cta_declaracion_alert_pep',
  newaccount_declarationalert_button_agree: 'nueva_cta_dec_aceptar',
  newaccount_declarationalert_container: 'nueva_cta_dec_contenedor',
  newaccount_declaration_pep_title: 'nueva_cta_dec_titulo',
  newaccount_declarationalert_content: 'nueva_cta_dec_contenedor',
  newaccountconfirmscreen_checkbox_terms_data: 'nueva_cta_chck_terminos_datos',
  newaccountconfirmscreen_buttonlink_terms_data: 'nueva_cta_btn_terminos_datos',
  newaccountconfirmscreen_termsmodaldata: 'nueva_cta_terminos_datos',
  newaccount_declaration_pdp_button_agree: 'nueva_cta_pdp_aceptar',
  newaccount_declaration_pdp_container: 'nueva_cta_pdp_contenedor',
  newaccountsuccessscreen_button_share: 'nueva_cta_success_btn_compartir',
  newaccountsuccessscreen_button_end_title: 'nueva_cta_success_btn_terminar',
  newaccountcreen_textinputmasked_email: 'nueva_cta_correo_enmascarado',
  newaccount_flashmessage_button_close: 'nueva_cta_btn_cerrar_sms_rapido',
  newaccount_textlink_flashmessage: 'nueva_cta_txt_link_sms_rapido',
  signupfacephicredentialsscreen_button_continue:
    'regfacephi_pas1_btn_continuar', // Botón Siguiente
  signupfacephicredentialscreen_header: 'regfacephi_pas1_header',
  textinputdni_textinput_documentnumber:
    'textinputdni_textinput_documentnumber',

  genericError_button_tryAgain: 'errorfp_btn_intentar_nuevamente',
  genericError_title: 'errorfp_titulo',
  genericError_info_text: 'errorfp_info_texto',
  genericError_info_subtext: 'errorfp_info_subtexto',
  genericError_button_finish: 'errorfp_btn_terminar',
  genericError_footer_question: 'errorfp_pregunta_final',

  signupfacephiresetscreen_textinput_internet_key:
    'regfacephi_r_caja_clave_internet', // Caja Clave de Internet
  signupfacephiresetscreen_textinput_internet_key_repeat:
    'regfacephi_r_caja_repite_clave_inet', // Caja Repite Clave de Internet
  signupfacephiresetscreen_checkbox_terms: 'regfacephi_r_chck_term_condi', // Checkbox Términos y condiciones
  signupfacephiresetscreen_checkbox_terms_off:
    'regfacephi_r_chck_term_condi_off', // Checkbox Términos y condiciones

  signupfacephiresetscreen_buttonlink_terms: 'regfacephi_r_btn_term_condi', // Botón Términos y condiciones
  signupfacephiresetscreen_button_continue: 'regfacephi_pas2_btn_continuar', // Botón Crear clave de internet

  signupfacephisuccessscreen_signup_button: 'regfacephi_pasofin_btn_finish', // Botón Ir al Inicio
  paymentsthirdpartieschoosescreen_accountselector_origin:
    'p_tp_escoj_cuenta_origen', // Seleccionador Cuenta Origen
  paymentsthirdpartieschoosescreen_event_origin_autoassigned:
    'p_tp_escoj_evento_origen_auto', // Evento usuario con una cuenta
  paymentsthirdpartieschoosescreen_sectionheader_accounts:
    'p_tp_escoj_cabecera',
  paymentsthirdpartieschoosescreen_cardview: 'p_prestamo_terceros_card',
  paymentsthirdpartieschoosescreen_sectionheader_target:
    'p_tp_escoj_txt_cuenta_destino',
  paymentsthirdpartieschoosescreen_textinput_target:
    'p_tp_escoj_caja_cuenta_destino',
  paymentsthirdpartieschoosescreen_sectionheader_amount: 'p_tp_escoj_txt_monto',
  paymentsthirdpartieschoosescreen_textinput_amount: 'p_tp_escoj_caja_monto',
  paymentsthirdpartieschoosescreen_accountselector_title_origin:
    'p_tp_escoj_txt_cuenta_origen',
  paymentsthirdpartieschoosescreen_button_continue: 'p_tp_escoj_btn_continuar',
  paymentsthirdpartiesconfirmscreen_confirmcode: 'p_tp_c_codigo_confirmacion',
  paymentsthirdpartiesconfirmscreen_text_others: 'p_tp_c_txt_otros',
  paymentsthirdpartiesconfirmscreen_text_others_description:
    'p_tp_c_txt_others_description',
  paymentsthirdpartiesconfirmscreen_text_itf: 'p_tp_c_txt_itf',
  paymentsthirdpartiesconfirmscreen_text_itf_description:
    'p_tp_c_txt_itf_descripcion',
  paymentsthirdpartiesconfirmscreen_text_account_status: 'p_tp_c_txt_status',
  paymentsthirdpartiesconfirmscreen_text_account_status_descrition:
    'p_tp_c_txt_status_description',
  paymentsthirdpartiesconfirmscreen_text_fee_penalty: 'p_tp_c_txt_extra',
  paymentsthirdpartiesconfirmscreen_text_fee_penalty_description:
    'p_tp_c_txt_extra_descripcion',
  paymentsthirdpartiesconfirmscreen_text_fee: 'p_tp_c_txt_impuesto',
  paymentsthirdpartiesconfirmscreen_text_fee_description:
    'p_tp_c_txt_impuesto_descripcion',
  paymentsthirdpartiesconfirmscreen_text_capital: 'p_tp_c_txt_capital',
  paymentsthirdpartiesconfirmscreen_text_capital_description:
    'p_tp_c_txt_capital_descripcion',
  paymentsthirdpartiesconfirmscreen_expandable_view: 'p_tp_c_exp_view',
  paymentsthirdpartiesconfirmscreen_text_loan_owner:
    'p_tp_c_txt_poseedor_prestamo',
  paymentsthirdpartiesconfirmscreen_text_loan_owner_description:
    'p_tp_c_txt_poseedor_descripcion',
  paymentsthirdpartiesconfirmscreen_text_loan_number: 'p_tp_c_txt_num_prestamo',
  paymentsthirdpartiesconfirmscreen_text_loan_number_description:
    'p_tp_c_txt_num_prestamo_descripcion',
  paymentsthirdpartiesconfirmscreen_text_origin_account_description:
    'p_tp_c_cuenta_origen_descripcion',
  paymentsthirdpartiesconfirmscreen_text_origin_account: 'p_tp_c_cuenta_origen',
  paymentsthirdpartiesconfirmscreen_header_title: 'p_tp_c_titulo',
  paymentsthirdpartiesconfirmscreen_terms_modal: 'p_tp_c_terminos_modal',
  paymentsthirdpartiesconfirmscreen_text_request_amount: 'p_tp_c_txt_monto',
  paymentsthirdpartiesconfirmscreen_text_request_amount_description:
    'p_tp_c_txt_monto_descripcion',
  paymentsthirdpartiesconfirmscreen_text_resend_sms: 'p_tp_c_btn_reenvio',
  paymentsthirdpartiesconfirmscreen_button_confirm: 'p_tp_c_btn_confirmar',
  paymentsthirdpartiesconfirmscreen_checkbox_terms: 'p_tp_c_chck_terminos',
  paymentsthirdpartiesconfirmscreen_buttonlink_terms: 'p_tp_c_btn_terminos',
  paymentsthirdpartieschoosescreen_alert_button_agree:
    'p_tp_escoj_alert_aceptar',
  paymentsthirdpartiessuccessscreen_button_share: 'p_tp_s_btn_compartir',
  paymentsthirdpartiessuccessscreen_button_finish: 'p_tp_s_btn_fin',
  paymentsthirdpartiessuccessscreen_expandable_view: 'p_tp_s_btn_expandir',
  onboardingscreen_modalregistermode_chooseregistermode:
    'onboardingscreen_registro_modal',
  loanscreen_modalloaninforesume_showdescription:
    'loanscreen_genericloan_modal',

  onboardingscreen_register_by_dni_start: 'onboarding_regfacephi_inicio',
  onboardingscreen_register_by_card_start: 'onboarding_regtarjeta_inicio',
  signin_modalregistermode_chooseregistermode: 'signin_registro_modal',
  signinscreen_register_by_dni_start: 'signin_regfacephi_inicio',
  signinscreen_register_by_card_start: 'signin_regtarjeta_inicio',
  enrollmentdevices_deviceitem_element:
    'enrollmentdevices_dispositivo_enrolado',
  unrollmentmodal_alertmodal_actionbutton:
    'unrollmentmodal_btn_cancel_desenrolar',
  unrollmentmodal_alertmodal_cancelbutton:
    'unrollmentmodal_btn_confir_desenrolar',

  openaccountmodal_alertmodal_actionbutton: 'newproducto_pas0_btn_abrircuenta',
  openaccountmodal_alertmodal_cancelbutton:
    'newproducto_pas0_btn_loharedespues',
  personalinfo_accountfield_phone: 'personalinfo_accountfield_phone',
  personalinfo_accountfield_email: 'personalinfo_accountfield_email',
  enrollmentsmsscreen_button_continue: 'enrollment_sms_btn_continuar', // Botón Continuar Enrolamiento
  enrollmentinvalidscreen_button_map: 'enrollmentinvalidscreen_button_map',
  enrollmentblacklistscreen_button_close: 'enrollmentblacklistscreen_btn_close',
  signinscreen_textinput_header_trace: 'signinscreen_textinput_header_trace',

  seed_dni_ob: 'logdniob_cred',
  // referenciales
  seed_dni_ob_gerr: 'logdniob_cred_gerr', // paso1 cred: error generico
  seed_dni_ob_sms: 'logdniob_cred_sms', // paso2 cred
  seed_dni_ob_sms_res: 'logdniob_cred_sms_err', // paso2 sms :error
  seed_dni_ob_sms_errpw: 'logdniob_cred_sms_errpw', // paso2 sms :error de clave
  // paso 3 succes es signupdni_success: 'signdni_up',
  logdniob_cred_sms_log: 'logdniob_cred_sms_log', // signin intento login
  logdniob_cred_sms_logok: 'logdniob_cred_sms_logok', // home
  logdniob_cred_sms_logok_ss: 'logdniob_cred_sms_logok_ss', // security seal
  logdniob_cred_sms_logok_enrol: 'logdniob_cred_sms_logok_enrol', // enrolamiento
  logdniob_cred_sms_logerr: 'logdniob_cred_sms_logerr', // paso2 cred

  seed_dni_free: 'logdnifree_cred',
  seed_dni_free_sms: 'logdnifree_cred_sms',
  seed_dni_free_gerr: 'logdnifree_cred_gerr',
  instantcashinsurancesscreen_header_title: 'efectalt_flargo_seg_header_title',
  instantcashinsurancesscreen_selector_item: 'efectalt_flargo_seg_selitem',
  instantcashinsurancesscreen_button_continue:
    'efectalt_flargo_seg_btn_continue',
  instantcashinsurancesscreen_toggle_button:
    'efectalt_flargo_seg_toggle_button',
  instantcashinsurancesscreen_toggle_active:
    'efectalt_flargo_seg_toggle_active',
  instantcashsuccessscreen_expandableview: 'efectalt_flargo_s_btn_expandir',
  instacashnewaccount_tooltip_reminder: 'instacashnewaccount_tooltip_reminder',
  textinput_chip_amount: 'textinput_chip_amount',
  instantCashSuccessScreenCongratulations:
    'instantcash_success_congratulations',
  forgotpassword_success_congrats: 'forgotpassword_success_congrats',
  instantCashShortSuccessScreenUrpi: 'instcashshortsuccess_congrats_urpi',
  instantcashfaststartscreen_apicall_list_options:
    'efectalt_ffast_api_opciones',
  instantcashfaststartscreen_button_continue:
    'efectalt_ffast_calc_btn_continuar',
  instantcashfaststartscreen_panel_options_feesrow:
    'efectalt_ffast_calc_opcion',
  instantcashfaststartscreen_itemselector_destination:
    'efectalt_ffast_calc_destino',
  instantcashfaststartscreen_itemselector_paymentdate:
    'efectalt_ffast_calc_fechap',
  instantcashfaststartscreen_textinputamount_amount:
    'efectalt_ffast_calc_txt_monto',
  foryoumenuscreen_tab_selector: 'foryoumenuscreen_tab_selector',
  foryoumenuscreen_tab_selector_savings:
    'foryoumenuscreen_tab_selector_savings',
  foryoumenuscreen_tab_selector_insurances:
    'foryoumenuscreen_tab_selector_insurances',
  foryoumenuscreen_tab_selector_sellmore:
    'foryoumenuscreen_tab_selector_sellmore',
  foryoumenuscreen_go_dpf: 'foryoumenuscreen_go_dpf',
  foryoumenuscreen_go_newaccount: 'foryoumenuscreen_go_newaccount',
  foryoumenuscreen_go_soat: 'foryoumenuscreen_go_soat',
  foryoumenuscreen_go_flexhome: 'foryoumenuscreen_go_flexhome',
  foryoumenuscreen_go_oncological: 'foryoumenuscreen_go_oncological',
  foryoumenuscreen_go_protectedsale: 'parati_venta_proteg',
  foryoumenuscreen_go_lifedevolution: 'foryoumenuscreen_go_lifedevolution',
  foryoumenuscreen_go_culqi: 'foryoumenuscreen_go_culqi',
  foryoumenuscreen_go_yape: 'foryoumenuscreen_go_yape',
  foryoumenuscreen_go_yevo: 'foryoumenuscreen_go_yevo',
  foryoumenuscreen_go_mbasesora: 'foryoumenuscreen_go_mbasesora',
  foryou_soat_button_buy: 'foryou_soat_button_buy',
  foryou_soat_button_back: 'foryou_soat_button_back',
  foryou_soat_button_accept: 'foryou_soat_button_accept',
  // Registro por tarjeta
  seed_card_reg: 'regtarjeta_paso1',
  seed_card_reg_sms: 'regtarjeta_paso2',
  seed_card_reg_reset: 'regtarjeta_paso3',
  // Registro por biometría
  seed_dni_reg: 'regfacephi_paso1',
  seed_dni_reg_reset: 'regfacephi_paso2',

  // eat_pres_flargo_ots: 'eat_flargo_pres',
  eat_flargo_pres: 'eat_flargo_pres', // desde prestamos
  eat_flargo_ini: 'eat_flargo_ini', // desde consultas
  eat_flargo: 'eat_flargo', // desde ambos(repetido)

  eat_urpi_pres: 'eat_urpi_pres',
  eat_urpi_ini: 'eat_urpi_ini',
  eat_urpi: 'eat_urpi',

  eat_fast_pres: 'eat_rap_pres',
  eat_fast_ini: 'eat_rap_ini',
  eat_fast: 'eat_rap',

  // paso 1 ->seguros
  eat_flargo_pres_calc_sig: 'eat_flargo_pres_calc_sig',
  eat_flargo_ini_calc_sig: 'eat_flargo_ini_calc_sig',
  eat_flargo_calc_sig: 'eat_flargo_calc_sig',

  eat_urpi_pres_calc_sig: 'eat_urpi_pres_calc_sig',
  eat_urpi_ini_calc_sig: 'eat_urpi_ini_calc_sig',
  eat_urpi_calc_sig: 'eat_urpi_calc_sig',

  // paso seguros - >paso 2
  eat_flargo_pres_seguros_sig: 'eat_flargo_pres_seguros_sig',
  eat_flargo_ini_seguros_sig: 'eat_flargo_ini_seguros_sig',
  eat_flargo_seguros_sig: 'eat_flargo_seguros_sig', //

  // paso 2 ->paso 3
  eat_flargo_pres_escoje_sig: 'eat_flargo_pres_escoje_sig',
  eat_flargo_ini_escoje_sig: 'eat_flargo_ini_escoje_sig',
  eat_flargo_escoje_sig: 'eat_flargo_escoje_sig', //

  // paso 3 ->paso 4(fin)
  eat_flargo_pres_confirm_sig: 'eat_flargo_pres_confirm_sig',
  eat_flargo_ini_confirm_sig: 'eat_flargo_ini_confirm_sig',
  eat_flargo_confirm_sig: 'eat_flargo_confirm_sig', //

  eat_urpi_pres_confirm_sig: 'eat_urpi_pres_confirm_sig',
  eat_urpi_ini_confirm_sig: 'eat_urpi_ini_confirm_sig',
  eat_urpi_confirm_sig: 'eat_urpi_confirm_sig',

  // paso 4 ->prestamos(fin)
  eat_flargo_pres_exito_sig: 'eat_flargo_pres_exito_sig',
  eat_flargo_ini_exito_sig: 'eat_flargo_ini_exito_sig',
  eat_flargo_exito_sig: 'eat_flargo_exito_sig', //

  eat_urpi_pres_exito_sig: 'eat_urpi_pres_exito_sig',
  eat_urpi_ini_exito_sig: 'eat_urpi_ini_exito_sig',
  eat_urpi_exito_sig: 'eat_urpi_exito_sig',
  foryou_flexhome_button_buy: 'foryou_flexhome_button_buy',
  foryou_flexhome_button_back: 'foryou_flexhome_button_back',
  foryou_flexhome_button_accept: 'foryou_flexhome_button_accept',
  foryou_lifedevolution_button_accept: 'foryou_lifedevolution_button_accept',
  foryou_lifedevolution_button_back: 'foryou_lifedevolution_button_back',
  foryou_lifedevolution_button_buy: 'foryou_lifedevolution_button_buy',
  foryou_culqi_button_buy: 'foryou_culqi_button_buy',
  foryou_culqi_button_back: 'foryou_culqi_button_back',
  foryou_culqi_button_accept: 'foryou_culqi_button_accept',
  foryou_oncological_button_buy: 'foryou_oncological_button_buy',
  foryou_oncological_button_back: 'foryou_oncological_button_back',
  foryou_oncological_button_accept: 'foryou_oncological_button_accept',
  foryou_protectedsale_button_buy: 'foryou_protectedsale_button_buy',
  foryou_protectedsale_button_back: 'foryou_protectedsale_button_back',
  foryou_protectedsale_button_accept: 'foryou_protectedsale_button_accept',
  foryou_yape_button_buy: 'foryou_yape_button_buy',
  foryou_yape_button_back: 'foryou_yape_button_back',
  foryou_yape_button_accept: 'foryou_yape_button_accept',
  foryou_yevo_button_buy: 'foryou_yevo_button_buy',
  foryou_yevo_button_back: 'foryou_yevo_button_back',
  foryou_yevo_button_accept: 'foryou_yevo_button_accept',

  instantcashselectinsurancesscreen_modal_btn_cancel:
    'eat_flargo_seguros_mdl_no',
  instantcashselectinsurancesscreen_modal_btn_liked:
    'eat_flargo_seguros_mdl_quiero',
  bannerinstantcash_btn_open_modal: 'banner_efecalt_btn_abrirmodal',
  bannerinstantcash_open_modal: 'banner_abrirmodal_tooltip',
  bannerinstantcash_modal_header: 'banner_efecalt_header',
  bannerinstantcash_modal_new_account_openhere:
    'banner_efecalt_mdl_newcta_aqui',
  bannerinstantcash_modal_btn_ok: 'banner_efecalt_mdl_btn_ok',
  foryou_mbasesora_button: 'foryou_mbasesora_button',
  foryou_mbasesora_button_back: 'foryou_mbasesora_button_back',
  foryou_mbasesora_button_accept: 'foryou_mbasesora_button_accept',
  // nuevo producto digital
  seed_instafastcash_pas0: 'newproducto_pas0',
  seed_instafastcash_pas1: 'newproducto_pas1',

  instantcashfastchoosescreen_alert_button_agree:
    'efectalt_fast_escoj_alert_ok',
  instantcashfastchoosescreen_alertmodal_actionbutton:
    'efectalt_fast_escoj_btn_abrircuenta',
  instantcashfastchoosescreen_textinputmasked_email:
    'efectalt_fast_escoj_email',
  instantcashfastchoosescreen_button_continue:
    'efectalt_fast_escoj_btn_continuar',
  instantcashfastchoosescreen_resume_toogle_active:
    'efectalt_fast_escoj_btn_expandir',
  instantcashselectinsurancescreen_active_modal:
    'active_modalinstantcashselectinsurances',
  instantcashfastconfirmscreen_text_resend_sms: 'efectalt_fast_c_btn_reenvio',
  instantcashfastconfirmscreen_checkbox_terms: 'efectalt_fast_c_terms',
  instantcashfastconfirmscreen_buttonlink_terms:
    'efectalt_fast_c_terms_btnlink',
  instantcashfastconfirmscreen_button_continue: 'efectalt_fast_c_btn_continuar',
  instantcashfastconfirmscreen_expandable_view: 'efectalt_fast_c_btn_expandir',
  instantcashfastsuccessscreen_button_share: 'efectalt_fast_exit_btn_share',
  instantcashfastsuccessscreen_button_end: 'efectalt_fast_exit_btn_fin',
  instantcashfastsuccessscreen_expandableview:
    'efectalt_fast_exit_btn_expandir',
  updateemailsuccessscreen_button_continue:
    'updateemailsuccessscreen_button_continue',

  changeemailstartscreen_button_continue: 'agregarcorreo_i_btn_sig',
  changeemailstartscreen_textinputmasked_email: 'agregarcorreo_i_caja_email',
  changeemailstartscreen_textinputmasked_repeatemail:
    'agregarcorreo_i_caja_remail',
  changeemailconfirmscreen_button_next: 'agregarcorreo_c_btn_sig',
  changeemailconfirmscreen_checkbox_terms: 'agregarcorreo_c_check_terms',
  changeemailconfirmscreen_terms_link: 'agregarcorreo_c_check_terms_link',
  changeemailsuccessscreen_button_end: 'agregarcorreo_f_btn_sig',

  updateemailstartscreen_button_continue: 'cambiarcorreo_i_btn_sig',
  updateemailstartscreen_textinputmasked_email: 'cambiarcorreo_i_caja_email',
  updateemailstartscreen_textinputmasked_repeatemail:
    'cambiarcorreo_i_caja_remail',

  modalinfochangeemail_btn_cancel: 'mdl_cambiarcorreo_cerrar',
  modalinfochangeemail_btn_action: 'mdl_cambiarcorreo_btn_ir',

  modalinfonoemail_btn_cancel: 'mdl_notienecorreo_cerrar',
  modalinfonoemail_btn_action: 'mdl_notienecorreo_btn_ir',

  newaccountscreen_cardemail_message: 'nueva_cta_emailcard_msg',
  newaccountscreen_cardemail_tooltip: 'nueva_cta_emailcard_tp_email',

  dpfopenchoosescreen_cardemail_message: 'dpf_c_emailcard_msg',
  dpfopenchoosescreen_cardemail_tooltip: 'dpf_c_emailcard_tp_email',

  instantcashshortscreen_cardemail_message: 'eat_urpi_c_emailcard_msg',
  instantcashshortscreen_cardemail_tooltip: 'eat_urpi_c_emailcard_tp_email',

  instantcashshort_changeemailmodal_btn_action: 'eat_urpi_btn_action',

  instantcashchoosescreen_cardemail_message: 'eat_flargo_c_emailcard_msg',
  instantcashchoosescreen_cardemail_tooltip: 'eat_flargo_c_emailcard_tp_email',

  instantcashfastchoosescreen_cardemail_cardemail_message:
    'eat_flargo_c_emailcard_msg',
  instantcashfastchoosescreen_cardemail_cardemail_tooltip:
    'eat_flargo_c_emailcard_tp_email',

  transfersmyaccountssuccessscreen_ademailcard: 't_my_acnts_e_btn_agregaremail',
  transfersotheraccountssuccessscreen_ademailcard:
    't_o_acnts_s_btn_agregaremail',
  transfersotherbankssuccessscreen_ademailcard: 't_o_banks_s_btn_agregaremail',
  paymentsthirdpartiessuccessscreen_ademailcard: 'p_tp_s_btn_agregaremail',
  paymentsownloanssuccessscreen_ademailcard: 'p_mis_pres_e_btn_agregaremail',
  paymentsservicessuccessscreen_ademailcard: 'p_serv_exit_btn_agregaremail',

  updateemailconfirmscreen_checkbox_terms: 'cambiarcorreo_c_check_terms',
  updateemailconfirmscreen_buttonlink_terms: 'cambiarcorreo_c_check_terms_link',
  updateemailconfirmscreen_button_continue: 'cambiarcorreo_c_btn_sig',
  updateemailsuccessscreen_button_end: 'cambiarcorreo_f_btn_sig',

  emailstatusmodal_button_parcial_changemail: 'modalcambiaremail_btn_cambiar',
  emailstatusmodal_button_parcial_close: 'modalcambiaremail_btn_cerrar',
  acceptemailmodal_button_accept: 'modalcambiaremailok_btn_ok',
  loginincorrectinfomodal_btn_ok: 'modalloginerror_btn_ok',
  rooted_android: 'app_inseguro_android',
  rooted_ios: 'app_inseguro_ios',
  updateemailconfirmscreen_checkbox_terms_lpdp: 'cambiarcorreo_c_check_lpdp',
  updateemailconfirmscreen_checklink_terms_lpdp:
    'cambiarcorreo_c_check_lpdp_link',
  updateemailconfirmscreen_modalldpdp: 'cambiarcorreo_c_lpdp',
  updateemailconfirmscreen_modalldpdp_close: 'cambiarcorreo_c_lpdp_cerrar',
  updateemailconfirmscreen_modalldpdp_toggle: 'cambiarcorreo_c_lpdp_expandir',

  changeemailconfirmscreen_checkbox_terms_lpdp: 'agregarcorreo_c_check_lpdp',
  changeemailconfirmscreen_checklink_terms_lpdp:
    'agregarcorreo_c_check_lpdp_link',
  changeemailconfirmscreen_modalldpdp: 'agregarcorreo_c_lpdp',
  changeemailconfirmscreen_modalldpdp_close: 'agregarcorreo_c_lpdp_cerrar',
  changeemailconfirmscreen_modalldpdp_toggle: 'agregarcorreo_c_lpdp_expandir',
  // signupresetscreen_modalldpdp
  signupresetscreen_checkbox_terms_lpdp: 'agregarcorreo_c_check_lpdp',
  signupresetscreen_checklink_terms_lpdp: 'agregarcorreo_c_check_lpdp_link',
  signupresetscreen_modalldpdp: 'agregarcorreo_c_lpdp',
  signupresetscreen_modalldpdp_close: 'agregarcorreo_c_lpdp_cerrar',
  signupresetscreen_modalldpdp_toggle: 'agregarcorreo_c_lpdp_expandir',

  transactionpaymentloan_panelitem_expandableview:
    'pagotransaccion_btn_expandir',

  transfersmyaccountsconfirmscreen_checkbox_terms_lpdp:
    't_my_acnts_c_check_lpdp',
  transfersmyaccountsconfirmscreen_checklink_terms_lpdp:
    't_my_acnts_c_check_lpdp_link',
  transfersmyaccountsconfirmscreen_modalldpdp: 't_my_acnts_c_lpdp',
  transfersmyaccountsconfirmscreen_modalldpdp_close: 't_my_acnts_c_lpdp_cerrar',
  transfersmyaccountsconfirmscreen_modalldpdp_toggle:
    't_my_acnts_c_lpdp_expandir',

  transfersotheraccountsconfirmscreen_checkbox_terms_lpdp:
    't_ot_acnts_c_check_lpdp',
  transfersotheraccountsconfirmscreen_checklink_terms_lpdp:
    't_ot_acnts_c_check_lpdp_link',
  transfersotheraccountsconfirmscreen_modalldpdp: 't_ot_acnts_c_lpdp',
  transfersotheraccountsconfirmscreen_modalldpdp_close:
    't_ot_acnts_c_lpdp_cerrar',
  transfersotheraccountsconfirmscreen_modalldpdp_toggle:
    't_ot_acnts_c_lpdp_expandir',

  transfersotherbanksconfirmscreen_checkbox_terms_lpdp:
    't_ot_banks_c_check_lpdp',
  transfersotherbanksconfirmscreen_checklink_terms_lpdp:
    't_ot_banks_c_check_lpdp_link',
  transfersotherbanksconfirmscreen_modalldpdp: 't_ot_banks_c_lpdp',
  transfersotherbanksconfirmscreen_modalldpdp_close: 't_ot_banks_c_lpdp_cerrar',
  transfersotherbanksconfirmscreen_modalldpdp_toggle:
    't_ot_banks_c_lpdp_expandir',

  paymentsownloansconfirmscreen_checkbox_terms_lpdp: 'p_mis_pres_c_check_lpdp',
  paymentsownloansconfirmscreen_checklink_terms_lpdp:
    'p_mis_pres_c_check_lpdp_link',
  paymentsownloansconfirmscreen_modalldpdp: 'p_mis_pres_c_lpdp',
  paymentsownloansconfirmscreen_modalldpdp_close: 'p_mis_pres_c_lpdp_cerrar',
  paymentsownloansconfirmscreen_modalldpdp_toggle: 'p_mis_pres_c_lpdp_expandir',
  enrollmentblockadscreen_button_signin: 'enrollmentlogin_btn_signin',
  enrollmentblockadscreen_button_validate: 'enrollmentlogin_btn_validate',
  identitycheckloginscreen_button_continue: 'bioenrollment_btn_ok',
  identitycheckloginscreen_textinput_header_trace: 'bioenrollment_txt_trace',
  enrollmentblockvalscreen_button_login: 'enrollmentblock_btn_ok',
  enrollmenterrorscreen_button_end: 'enrollmenterror_btn_ok',
  popupcelconfirmmodal_button_accept: 'popupcelconfirmmodal_button_ok',

  personalinfo_checkbox_terms_lpdp: 'agregarcorreo_c_check_lpdp',
  personalinfo_checklink_terms_lpdp: 'agregarcorreo_c_check_lpdp_link',
  personalinfo_modalldpdp: 'agregarcorreo_c_lpdp',
  personalinfo_modalldpdp_close: 'agregarcorreo_c_lpdp_cerrar',
  personalinfo_modalldpdp_toggle: 'agregarcorreo_c_lpdp_expandir',
  validation_dni_front: 'validation_dni_front',
  validation_dni_back: 'validation_dni_back',
  validation_live: 'validation_live',
  signup_front_dni: 'signup_front_dni',
  signup_back_dni: 'signup_back_dni',
  signup_live: 'signup_live',
  SignInScreenBtnErrorIncorrect: 'SignInScreenBtnErrorIncorrect',
  IdentityCheckLoginDniFrontOk: 'IdentityCheckLogin',
  IdentityCheckLoginDniBackOk: 'IdentityCheckLogin',
  IdentityCheckLoginFaceLiveOk: 'IdentityCheckLogin',
  IdentityCheckLoginFaceLiveInstructions: 'IdentityCheckLogin',
  IdentityCheckLoginFaceLiveFinal: 'IdentityCheckLogin',
  IdentityCheckSignupDniFrontInstru: 'SignUpFacephi',
  IdentityCheckSignupDniFrontFinal: 'SignUpFacephi',
  IdentityCheckSignupDniBack: 'SignUpFacephi',
  IdentityCheckSignupDniBackInstru: 'SignUpFacephi',
  IdentityCheckSignupDniBackFinal: 'SignUpFacephi',
  IdentityCheckSignupLive: 'SignUpFacephi',
  IdentityCheckSignupLiveInstru: 'SignUpFacephi',
  IdentityCheckSignupLiveFinal: 'SignUpFacephi',
  IdentityCheckSignupResumen: 'SignUpFacephi',
  InstantCashChooseModalChangeEmail: 'instcash_choose_modal_changeemail',
  InstantCashConfirmScreenModal: 'instcashconfirm_modal',
  InstantCashConfirmScreenModalTwo: 'instcashconfirm_modaltwo',
  InstantCashConfirmScreenLinkTwo: 'instcashconfirm_linktwo',
  InstantCashConfirmScreenLinkThree: 'instcashconfirm_linkthree',
  InstantCashConfirmScreenModalThree: 'instcashconfirm_modalthree',
  InstantCashConfirmScreenLinkFour: 'instcashconfirm_linkfour',
  InstantCashConfirmScreenModalFour: 'instcashconfirm_modalfour',
  signupfacephiresetscreen_open_terms: 'signupfacephiresetscreen_open_terms',
  instantcashconfirmscreen_confirmcode: 'instantcashconfirmscreen_confirmcode',
  instantcashconfirmscreen_code_resend: 'instantcashconfirmscreen_code_resend',
  instant_cash_short_confirmscreen_modal1: 'instcashshortconfirm_modal1',
  instant_cash_short_confirmscreen_modal2: 'instcashshortconfirm_modal2',
  instant_cash_short_confirmscreen_modal3: 'instcashshortconfirm_modal3',

  instant_cash_short_confirmscreen_2_urpi: 'instcashshort_confirm_2_urpi',
  instant_cash_short_confirmscreen_3_urpi: 'instcashshort_confirm_3_urpi',
  instantcashshortstartscreen_accountselector_title_target:
    'instcashshortstart_accselector',
  instantcashshortstartscreen_accountselector_title_target_modal:
    'instcashshortstart_accselectormodal',
  signupsmss_confirm_modal_open: 'signupsmss_confirm_modal_open',
  instantcashchoosescreen_choose_ask_endorsement: 'fcorto_open_btn',
  SignInScreenErrorModal: 'SignInScreenErrorModal',
};

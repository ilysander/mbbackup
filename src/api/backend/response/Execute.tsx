export interface CoreReadTransactionTransfersOtherBanksResponse {
  idTransaction: string;
  idParentTransaction: string | null;
  creationDateTime: string;
  submitDateTime: string;
  valueDateTime: string;
  idEnvironment: number;
  idTransactionStatus: string;
  transactionStatusName: string | null;
  transactionData: string | null;
  data: CoreReadTransactionTransfersOtherBanksData;
  idUserCreator: string;
  idActivity: string;
  activityName: string;
  totalAmount: number;
  products: ProductsItem[];
  signatures: SignaturesItem[];
  channel: string;
  productsLabel: string | null;
  signatureGroupUsed: string;
  modificationDateTime: string;
  idUserEditor: string;
  idForm: number;
  userCreatorFirstName: string;
  userCreatorLastName: string;
  userEditorFirstName: string;
  userEditorLastName: string;
  userCreatorIp: string;
  userEditorIp: string;
  userCreatorLocation: string | null;
  userEditorLocation: string | null;
  executingStartedAtDateTime: string | null;
  fullCreationDateTimeAsString: string;
  submitDateTimeAsString: string;
  fullSubmitDateTimeAsString: string;
  shortDescriptionForMobile: string;
  transactionAmountDescription: string;
  statusLabel: string;
  usersSigners: string;
  extendedData: string;
  valueDateAsString: string;
  creatorUsername: string;
  creatorUsernameLabel: string;
  editorUsernameLabel: string;
  successfullyCompleted: boolean;
  creationDateTimeAsString: string;
  shortDescription: string;
  fullDescription: string;
  totalAmountAsString: string;
  final: boolean;
}

interface CoreReadTransactionTransfersOtherBanksData {
  isFrequentContact: boolean;
  frequentContact: string;
  aceptTermAndCondition: boolean;
  destinationAccount: string;
  debitAccount: string;
  amount: Amount;
  _mail: string;
  idUser: string;
  userEmail: string;
  ticketOnly: string;
  requestedAmount: string;
  totalAmount: TotalAmount;
  mibancoComission: string;
  interbankComission: string;
  itf: string;
  bankName: string;
  destinationAccountTicket: string;
  beneficiary: string;
  operationNumber: number;
  date: string;
  debitAccountLabel: string;
}

interface Amount {
  currency: string;
  quantity: number;
}

interface TotalAmount {
  currency: string;
  quantity: number;
}

interface ProductsItem {
  idActivity: string;
  idField: string;
  idPermission: string;
  idProduct: string;
}

export interface CoreReadTransactionTransfersOtherAccountsResponse {
  idTransaction: string;
  idParentTransaction: string | null;
  creationDateTime: string;
  submitDateTime: string;
  valueDateTime: string;
  idEnvironment: number;
  idTransactionStatus: string;
  transactionStatusName: string | null;
  transactionData: string | null;
  data: CoreReadTransactionTransfersOtherAccountsData;
  idUserCreator: string;
  idActivity: string;
  activityName: string;
  totalAmount: number;
  products: ProductsItem[];
  signatures: SignaturesItem[];
  channel: string;
  productsLabel: string | null;
  signatureGroupUsed: string;
  modificationDateTime: string;
  idUserEditor: string;
  idForm: number;
  userCreatorFirstName: string;
  userCreatorLastName: string;
  userEditorFirstName: string;
  userEditorLastName: string;
  userCreatorIp: string;
  userEditorIp: string;
  userCreatorLocation: string | null;
  userEditorLocation: string | null;
  executingStartedAtDateTime: string | null;
  fullDescription: string;
  totalAmountAsString: string;
  extendedData: string;
  valueDateAsString: string;
  creatorUsername: string;
  creatorUsernameLabel: string;
  editorUsernameLabel: string;
  successfullyCompleted: boolean;
  creationDateTimeAsString: string;
  fullCreationDateTimeAsString: string;
  submitDateTimeAsString: string;
  fullSubmitDateTimeAsString: string;
  shortDescriptionForMobile: string;
  transactionAmountDescription: string;
  statusLabel: string;
  usersSigners: string;
  shortDescription: string;
  final: boolean;
}

interface CoreReadTransactionTransfersOtherAccountsData {
  debitAccount: string;
  frequentContact: string;
  isFrequentContact: boolean;
  Amount: Amount;
  valueDate: string;
  ToAccount: string;
  aceptTermAndCondition: boolean;
  exchange: number;
  exchangeRate: string;
  ticketOnly: string;
  debitAccountHolder: string;
  debitProductLabel: string;
  debitAccountCurrency: string;
  debitAmount: number;
  creditAccountNumber: string;
  creditAccountCurrency: string;
  creditAccountHolder: string;
  codigoAutorizacion: number;
  date: string;
  termsAndConditions: string;
  userEmail?: string;
}

interface Amount {
  currency: string;
  quantity: number;
}

interface ProductsItem {
  idActivity: string;
  idField: string;
  idPermission: string;
  idProduct: string;
}

export interface CoreReadTransactionTransfersMyAccountsResponse {
  idTransaction: string;
  idParentTransaction: string | null;
  creationDateTime: string;
  submitDateTime: string;
  valueDateTime: string;
  idEnvironment: number;
  idTransactionStatus: string;
  transactionStatusName: string | null;
  transactionData: string | null;
  data: CoreReadTransactionTransfersMyAccountsData;
  idUserCreator: string;
  idActivity: string;
  activityName: string;
  totalAmount: number;
  products: ProductsItem[];
  signatures: SignaturesItem[];
  channel: string;
  productsLabel: string | null;
  signatureGroupUsed: string;
  modificationDateTime: string;
  idUserEditor: string;
  idForm: number;
  userCreatorFirstName: string;
  userCreatorLastName: string;
  userEditorFirstName: string;
  userEditorLastName: string;
  userCreatorIp: string;
  userEditorIp: string;
  userCreatorLocation: string | null;
  userEditorLocation: string | null;
  executingStartedAtDateTime: string | null;
  fullCreationDateTimeAsString: string;
  submitDateTimeAsString: string;
  fullSubmitDateTimeAsString: string;
  shortDescriptionForMobile: string;
  transactionAmountDescription: string;
  statusLabel: string;
  usersSigners: string;
  extendedData: string;
  valueDateAsString: string;
  creatorUsername: string;
  creatorUsernameLabel: string;
  editorUsernameLabel: string;
  successfullyCompleted: boolean;
  creationDateTimeAsString: string;
  shortDescription: string;
  fullDescription: string;
  totalAmountAsString: string;
  final: boolean;
}

export interface CoreReadTransactionPaymentsServicesResponse {
  idTransaction: string;
  idParentTransaction: string | null;
  creationDateTime: string;
  submitDateTime: string;
  valueDateTime: string;
  idEnvironment: number;
  idTransactionStatus: string;
  transactionStatusName: string | null;
  transactionData: string | null;
  data: CoreReadTransactionTransfersPaymentsServicesData;
  idUserCreator: string;
  idActivity: string;
  activityName: string;
  totalAmount: number;
  products: ProductsItem[];
  signatures: SignaturesItem[];
  channel: string;
  productsLabel: string | null;
  signatureGroupUsed: string;
  modificationDateTime: string;
  idUserEditor: string;
  idForm: number;
  userCreatorFirstName: string;
  userCreatorLastName: string;
  userEditorFirstName: string;
  userEditorLastName: string;
  userCreatorIp: string;
  userEditorIp: string;
  userCreatorLocation: string | null;
  userEditorLocation: string | null;
  executingStartedAtDateTime: string | null;
  fullCreationDateTimeAsString: string;
  submitDateTimeAsString: string;
  fullSubmitDateTimeAsString: string;
  shortDescriptionForMobile: string;
  transactionAmountDescription: string;
  statusLabel: string;
  usersSigners: string;
  extendedData: string;
  valueDateAsString: string;
  creatorUsername: string;
  creatorUsernameLabel: string;
  editorUsernameLabel: string;
  successfullyCompleted: boolean;
  creationDateTimeAsString: string;
  shortDescription: string;
  fullDescription: string;
  totalAmountAsString: string;
  final: boolean;
}

interface CoreReadTransactionTransfersPaymentsServicesData {
  valueDate?: string;
  isFrequentContact: boolean;
  aceptTermAndCondition: boolean;
  frequentPaymentAlias: string;
  totalAmount: string;
  debitAccount: string;
  billSelector: Bill;
  ticketOnly: string;
  clientName: string;
  company_service: string;
  companyService: string;
  supply: string;
  ticketNro: string;
  expirationDate: string;
  serviceName: string;
  operationNumberTopaz: string;
  operationNumberPayment: string;
  debitAccountLabel: string;
  userEmail?: string;
}

interface CoreReadTransactionTransfersMyAccountsData {
  amount: Amount;
  destinationAccount: string;
  originAccount: string;
  date: string;
  codigoAutorizacion: number;
  debitAmount: number;
  ticketOnly: string;
  debitAccountLabel: string;
  destinationAccountLabel: string;
  debitCurrency: string;
  exchange: number;
  userEmail?: string;
}

interface Amount {
  currency: string;
  quantity: number;
}

interface ProductsItem {
  idActivity: string;
  idField: string;
  idPermission: string;
  idProduct: string;
}

export interface CoreReadTransactionPaymentsOwnLoansResponse {
  idTransaction: string;
  idParentTransaction: string | null;
  creationDateTime: string;
  submitDateTime: string;
  valueDateTime: string;
  idEnvironment: number;
  idTransactionStatus: string;
  transactionStatusName: string | null;
  transactionData: string | null;
  data: CoreReadTransactionPaymentsOwnLoansData;
  idUserCreator: string;
  idActivity: string;
  activityName: string;
  totalAmount: number;
  products: any[];
  signatures: SignaturesItem[];
  channel: string;
  productsLabel: string | null;
  signatureGroupUsed: string;
  modificationDateTime: string;
  idUserEditor: string;
  idForm: number;
  userCreatorFirstName: string;
  userCreatorLastName: string;
  userEditorFirstName: string;
  userEditorLastName: string;
  userCreatorIp: string;
  userEditorIp: string;
  userCreatorLocation: string | null;
  userEditorLocation: string | null;
  executingStartedAtDateTime: string | null;
  fullDescription: string;
  extendedData: string;
  totalAmountAsString: string;
  shortDescriptionForMobile: string;
  transactionAmountDescription: string;
  statusLabel: string;
  usersSigners: string;
  valueDateAsString: string;
  creatorUsername: string;
  creatorUsernameLabel: string;
  editorUsernameLabel: string;
  successfullyCompleted: boolean;
  creationDateTimeAsString: string;
  fullCreationDateTimeAsString: string;
  submitDateTimeAsString: string;
  fullSubmitDateTimeAsString: string;
  shortDescription: string;
  final: boolean;
}

interface CoreReadTransactionPaymentsOwnLoansData {
  loan: string;
  loanAmount: LoanAmount;
  debitAccount: string;
  valueDate: string;
  aceptTermAndCondition: boolean;
  isFrequentContact: boolean;
  userEmail: string;
  date: string;
  totalAmount: TotalAmount;
  debitAmount: string;
  creditCurrency: string;
  exchange: number;
  capital: string;
  interest: string;
  overdue: string;
  otherAmount: string;
  itf: string;
  debitAccountLabel: string;
  loanLabel: string;
  operationNumber: number;
  ticketOnly: string;
  termsAndConditions: string;
  loanFinished: boolean;
}

interface LoanAmount {
  amount: Amount;
  otherAmountQuantity: string;
  pendingPayment: PendingPayment;
  oldPayments: OldPayments;
  lastLoanId: string;
  lastDueDate: string;
}

interface Amount {
  currency: string;
  quantity: number;
}

interface PendingPayment {
  amount: string;
  dueDate: string;
  selected: boolean;
}

interface OldPayments {
  amount: string;
  fees: string;
  selected: boolean;
}

interface TotalAmount {
  currency: string;
  quantity: number;
}

export interface CoreReadTransactionDPFOpenResponse {
  idTransaction: string;
  idParentTransaction: string | null;
  creationDateTime: string;
  submitDateTime: string;
  valueDateTime: string;
  idEnvironment: number;
  idTransactionStatus: string;
  transactionStatusName: string | null;
  transactionData: string | null;
  data: Data;
  idUserCreator: string;
  idActivity: string;
  activityName: string;
  totalAmount: number;
  products: any[];
  signatures: SignaturesItem[];
  channel: string;
  productsLabel: string | null;
  signatureGroupUsed: string;
  modificationDateTime: string;
  idUserEditor: string;
  idForm: number;
  userCreatorFirstName: string;
  userCreatorLastName: string;
  userEditorFirstName: string;
  userEditorLastName: string;
  userCreatorIp: string;
  userEditorIp: string;
  userCreatorLocation: string | null;
  userEditorLocation: string | null;
  executingStartedAtDateTime: string | null;
  fullDescription: string;
  extendedData: string;
  totalAmountAsString: string;
  creationDateTimeAsString: string;
  fullCreationDateTimeAsString: string;
  submitDateTimeAsString: string;
  fullSubmitDateTimeAsString: string;
  shortDescriptionForMobile: string;
  transactionAmountDescription: string;
  statusLabel: string;
  usersSigners: string;
  successfullyCompleted: boolean;
  valueDateAsString: string;
  creatorUsername: string;
  creatorUsernameLabel: string;
  editorUsernameLabel: string;
  shortDescription: string;
  final: boolean;
}

interface Data {
  idTransaction: string;
  valueDate: string;
  isFrequentContact: boolean;
  aceptTermAndCondition: boolean;
  depositDetails: DepositDetails;
  debitAccount: string;
  frequency: string;
  renewDeposit: boolean;
  creditAccount: string;
  mail: string;
  userEmail: string;
  date: string;
  depositCurrency: string;
  amount: Amount;
  exchange: number;
  debitAccountLabel: string;
  debitAccountCurrency: string;
  creditAccountLabel: string;
  trea: string;
  term: string;
  interest: string;
  returnDate: string;
  ticketOnly: string;
  operationNumber: number;
  termsAndConditions: string;
  accountKey: string;
  accountID: string;
  type: string;
  currencyKey: string;
  paymentPeriod: string;
  versionDoc: string;
  branchKey: string;
  clientType: string;
  clientName: string;
  clientDocument: string;
  clientM: string;
  currencyName: string;
  currencySign: string;
  shortName: string;
  branchClient: string;
  contractReference: string;
  contractName: string;
  contractVersion: string;
  managerArea: string;
  managerAreaPosition: string;
  managerTerritory: string;
  managerTerritoryPosition: string;
  productName: string;
  interestPrimer: string;
  termPrimer: string;
  maxWithdrawalPercent: string;
  currentCapital: string;
  apr: string;
  totalPaymentInterest: string;
  finalAmount: string;
  itf: string;
  currencyCommissionNational: string;
  currencyCommissionForeign: string;
  expense: string;
  minWithdrawalAmount: string;
  minAmountLimit: string;
  minDepositAmount: string;
  minOpeningAmount: string;
  maxWithdrawalLimit: string;
  amount1: string;
  amount2: string;
  amount3: string;
  amount4: string;
  amount5: string;
  amount6: string;
  amount7: string;
  amount8: string;
  amount9: string;
  amount10: string;
  amount11: string;
  amount12: string;
  amount13: string;
  amount14: string;
  amount15: string;
  amount16: string;
  ratePrimer: string;
  openingDate: string;
  closingDate: string;
  maxDateLimit: string;
}

interface DepositDetails {
  amount: string;
  rate: string;
  generatedAmount: string;
  currency: string;
  term: string;
}

interface Amount {
  currency: string;
  quantity: number;
}

export interface SignaturesItem {
  idTransactionSignature: number;
  idTransaction: string;
  creationDateTime: string;
  valid: boolean;
  idUser: string;
  userFirstName: string;
  userLastName: string;
  extendedData: string;
  signatureLevel: string;
  channel: string | null;
  userAgent: string | null;
  ip: string;
  signatureLocation: string | null;
  userFullName: string;
  usernameLabel: string;
}

export interface SessionChangeEnvironmentResponse {
  activeIdEnvironment: number;
  activeEnvironmentName: string;
  administrationScheme: string;
  environments: Environments;
  permissions: Permissions;
  accountswhitread: number;
  forms: string[];
  frequentActions: number[];
  environmentSegment: string;
}

interface Environments {
  [id: string]: Environment;
}

interface Environment {
  segment: string;
  name: string;
  type: string;
}

interface Permissions {
  hasPermissionOverDPF: boolean;
  preferences: boolean;
  transfer: boolean;
  hasPermissionOverTransferInterbank: boolean;
  hasPermissionOverTransferInterna: boolean;
  hasPermissionOvertransferThirdPartie: boolean;
  hasUserData: boolean;
  hasPermissionOvertransferInterbankInmediate: boolean;
  hasPermissionOverRequestLoan: boolean;
  hasPermissionOverServicePayment: boolean;
}

export interface DesktopLoadLayoutResponse {
  widgets: WidgetsItem[];
}

interface WidgetsItem {
  id: string;
  uri: string;
  column: number;
  row: number;
}

export interface LoansListResponse {
  orphanLoanByCategory: OrphanLoanByCategory;
  loanCount: number;
  loansByCreditLine: LoansByCreditLine;
}

interface OrphanLoanByCategory {
  [name: string]: LoanItem[];
}

interface LoansByCreditLine {
  [name: string]: LoanItem[];
}

interface LoanItem {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string | null;
  productAlias: string;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  loanAmount: number;
  amountPerDayOfLateness: number;
  totalAmountOfFees: number;
  currentCapitalBalance: number;
  nextFeeAmount: number;
  groupFeeAmount: number;
  nextFeeDueDate: string;
  paymentDate: string;
  paidFees: number;
  totalFees: number;
  apr: number;
  aprc: number;
  creditLineProductID: string | null;
  category: string;
  family: string;
  subFamily: string;
  loanNumber: string;
}

export interface LoansReadResponse {
  loan: Loan;
  numberOfFees: number;
  currency: string;
}

interface Loan {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string | null;
  productAlias: string;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  loanAmount: number;
  amountPerDayOfLateness: number;
  totalAmountOfFees: number;
  currentCapitalBalance: number;
  nextFeeAmount: number;
  groupFeeAmount: number;
  nextFeeDueDate: string;
  paymentDate: string;
  paidFees: number;
  totalFees: number;
  apr: number;
  aprc: number;
  creditLineProductID: string | null;
  category: string;
  family: string;
  subFamily: string;
  loanNumber: string;
}

export interface TransfersDynamicMessageResponse {
  messagedynamic: string;
}

export interface WidgetsExchangeRatesResponse {
  rates: RatesItem[];
  middleCurrencyRatesFloor: number;
}

interface RatesItem {
  targetCurrencyCode: string;
  baseCurrencyCode: string;
  purchase: number;
  sale: number;
}

export type AccountItemSavingsAll = AccountsCAItem | AccountsCCItem;
export type AccountItemAll =
  | AccountsCAItem
  | AccountsCCItem
  | LoansItem
  | AccountsCTSItem
  | CreditLinesItem
  | DepositsItem;

export interface WidgetsProductsResponse {
  productMap: ProductMap;
}

interface ProductMap {
  loans: Loans;
  accountsCTS: AccountsCTS;
  creditLines: CreditLines;
  deposits: Deposits;
  accountsCA: AccountsCA;
  accountsCC: AccountsCC;
}

interface Loans {
  products: LoansItem[];
}

export interface LoansItem {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string | null;
  productAlias: string | null;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  loanAmount: number;
  amountPerDayOfLateness: number;
  totalAmountOfFees: number;
  currentCapitalBalance: number;
  nextFeeAmount: number;
  groupFeeAmount: number;
  nextFeeDueDate: string;
  paymentDate: string;
  paidFees: number;
  totalFees: number;
  apr: number;
  aprc: number;
  creditLineProductID: string | null;
  category: string;
  loanNumber: string;
  subFamily: string;
  family: string;
  reschedule?: {
    code: number;
    type: number;
    calculationDate: string;
    message: string;
    enabled: number;
    status: number;
  };
  totalAmount?: number;
  fees?: LoansItemFee[];
  product?: LoansItemProduct;
}

export interface LoansItemFee {
  number: number;
  amount: number;
  capital: number;
  interest: number;
  itf: number;
  expenses: number;
  mora: number;
  expirationdate: string;
}

export interface LoansItemFeeComplete {
  fee: LoansItemFee;
  nameMonth: string;
}

export interface LoansItemProduct {
  id: string;
  description: string;
}

interface AccountsCTS {
  products: AccountsCTSItem[];
}

export interface AccountsCTSItem {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string | null;
  productAlias: string | null;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  cci: string;
  availableBalance: number;
  balance: number;
  rate: number;
  rateOfInterest: number;
  category: string;
  family: string;
}

interface CreditLines {
  products: CreditLinesItem[];
}

export interface CreditLinesItem {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string | null;
  productAlias: string | null;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  approvedCreditLineAmount: number;
  withdrawnCreditLineAmount: number;
  availableCreditLineAmount: number;
  creditLineDueDate: string;
  creditLineTerm: number;
  creditLineNumber: string;
}

interface Deposits {
  products: DepositsItem[];
}

export interface DepositsItem {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string;
  productAlias: string | null;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  openingDate: string;
  closingDate: string;
  term: number;
  rateOfInterest: number;
  capital: number;
  interest: number;
  productKey: number;
  currencyKey: number;
  availableRetirements: number;
  accruedInterest: number;
}

interface AccountsCA {
  products: AccountsCAItem[];
}

export interface AccountsCAItem {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string | null;
  productAlias: string | null;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  cci: string;
  availableBalance: number;
  balance: number;
  rate: number;
  rateOfInterest: number;
  category: string;
  family: string;
}

interface AccountsCC {
  products: AccountsCCItem[];
}

export interface AccountsCCItem {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string | null;
  productAlias: string | null;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  cci: string;
  availableBalance: number;
  balance: number;
  rate: number;
  rateOfInterest: number;
  category: string;
  family: string;
}

export interface TransfersInternalPreviewResponse {
  amount: Amount;
  originAccount: string;
  destinationAccount: string;
  debitAmount: number;
  exchangeRate: number;
  currencyLabel: string;
}

interface Amount {
  currency: string;
  quantity: number;
}

export interface TransfersLocalPreviewResponse {
  transferData: TransferData;
  mustUpdateMobile: boolean;
}

export interface ThirdPartiesLocalPreviewResponse {
  loanAmount: Amount;
  totalAmount: number;
  creditCurrency: string;
  capital: string;
  exchange: number;
  debitAccount: string;
  debitAccountLabel: string;
  loan: string;
  interest: string;
  overdue: string;
  itf: string;
  otherAmount: string;
  _loanHolder: string;
  eeccAmount: string;
  otherAmountWithoutEECC: string;
  quantityLoans: number;
}

interface TransferData {
  debitAmount: number;
  creditAmount: number;
  exchangeRate: number;
  debitAccountHolder: string;
  creditAccountHolder: string;
  creditAccountCurrency: number;
  operationNumber: number;
  debitProductLabel: string;
  debitAccountCurrency: string;
  creditAccountNumber: string;
}

export interface TransfersLocalSendResponse {}

export interface AccountsReadResponse {
  account: Account;
  environmentType: string;
}

interface Account {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string | null;
  productAlias: string | null;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  cci: string;
  availableBalance: number;
  balance: number;
  rate: number;
  rateOfInterest: number;
  category: string;
  family: string;
}

export interface AccountsListStatementsResponse {
  moreStatements: boolean;
  pageNumber: number;
  statements: StatementsItem[];
  currency: string;
  movementsPerPage: number;
}

export interface StatementsItem {
  id: number;
  note: string | null;
  comment: string;
  check: number;
  amount: number;
  type: string;
  date: string;
  reference: number;
}

export interface DepositsListStatementsResponse {
  moreStatements: boolean;
  pageNumber: number;
  statements: DepositsStatementsItem[];
  currency: string;
  movementsPerPage: number;
}

export interface DepositsStatementsItem {
  id: number;
  note: string | null;
  comment: string;
  movementIdKey: number;
  amount: number;
  type: string;
  date: string;
  reference: number;
}

export interface AccountsListStatementDetailsResponse {
  note: string | null;
}

export interface NotesEditStatementNoteResponse {
  note: string | null;
}

export interface LoansListStatementsResponse {
  moreStatements: boolean;
  pageNumber: number;
  statements: StatementsItem[];
  currency: string;
}

export interface StatementsItem {
  id: number;
  note: string | null;
  fee: number;
  dueDate: string;
  paymentDate: string;
  amount: number;
  totalAmount: number;
  status: string;
  closeDueDate: boolean;
  showPendingFee: number;
}

export interface PreferencesUserDataModifyPreResponse {
  client: Client;
  _clientName: string;
  _clientLastName: string;
  _clientSecondLastName: string;
  _mail: string;
  mobilePhone: string;
  communicationConfigurations: CommunicationConfigurationsItem[];
  _securitySeal: number;
  securitySealImage: string;
  defaultEnvironment: number;
}

interface Client {
  idUser: string;
  username: string;
  email: string;
  _firstName: string;
  _lastName: string;
  deleted: boolean;
  lang: string;
  langLabel: string | null;
  idDefaultEnvironment: number;
  status: Status;
  idUserStatus: string;
  description: string;
  loggedIn: boolean;
  lastAccessIp: string;
  lastLogin: string;
  creationDate: string;
  lastPasswordChange: string | null;
  phoneNumber: string | null;
  mobileNumber: number | null;
  facebookId: string | null;
  facebookName: string | null;
  twitterId: string | null;
  twitterName: string | null;
  trustfull: boolean;
  documentCountry: string;
  documentType: string;
  _documentNumber: string;
  gender: string;
  idEnrolledClient: number;
  _secondSurname: string;
  employee: string;
  clientList: string[];
  province: string | null;
  district: string | null;
  wayType: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  postCode: string | null;
  state: string | null;
  country: string | null;
  password: string | null;
  _nameAndId: string;
  lastLoginAsMediumString: string;
  _usernameLabel: string;
  statusDescription: string | null;
  idSeal: number;
  lastLoginAsFullString: string;
  _fullName: string;
  idAddress: string;
  addressType: string;
  addressFormat: string;
}

interface Status {
  idUserStatus: string;
  description: string | null;
  canLogin: boolean;
  reserved: boolean;
  idUserStatusLabel: string | null;
}

export interface CommunicationConfigurationsItem {
  idUser: string;
  communicationType: string;
  subscribedSMS: boolean;
  subscribedMail: boolean;
  subscribedDefault: boolean;
  subscribedFacebook: boolean;
  subscribedTwitter: boolean;
}

export interface PreferencesUserdataUpdateMobilePhoneSendResponse {
  mobilePhone: string;
}

export interface PreferencesUserdataUpdateMailSendResponse {
  mail: string;
}

export interface PreferencesUserdataModifySendResponse {
  successMessage: string;
  _securitySeal: number;
}

export interface InsurancesList {
  insurances: InsuranceItem[];
}

export interface InsuranceItem {
  id: string;
  index?: number;
  policy: string;
  amount: number;
  selected?: boolean;
  showed?: boolean;
  direction: string;
  name?: string;
  type: {
    id: number;
    code: string;
    description: string;
  };
  product: {
    id: number;
    description: string;
  };
  rate: {
    type: number;
    value: number;
  };
}

export interface InsuranceDetail {
  id: number;
  policy?: string;
  description?: string;
  amount: string;
  direction: string;
  type?: {
    id: number;
    code: string;
    description: string;
  };
  product: {
    id: number;
    description?: string;
  };
  rate: string;
  summary: string;
  note: string;
}

export interface AccountListResponse {
  accounts: AccountsItem[];
}

interface AccountsItem {
  idEnvironment: number;
  idProduct: string;
  productType: string;
  productTypeLabel: string | null;
  productTypeShortLabel: string | null;
  description: string | null;
  productAlias: string | null;
  smsAlias: string | null;
  label: string;
  shortLabel: string;
  extraInfo: string;
  currency: string;
  number: string;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions: string | null;
  cci: string;
  availableBalance: number;
  balance: number;
  rate: number;
  rateOfInterest: number;
  category: string;
  family: string;
}

export interface TransfersInternalSendResponse {
  amount: Amount;
}

interface Amount {
  currency: string;
  quantity: number;
}

export interface TransfersFrequentContactsListResponse {
  frequentContactList: FrequentContactType[];
}

export interface TransfersFrequentContactsEditResponse {}

export interface TransfersFrequentContactsDeletePreResponse {
  frequentContact: FrequentContactType;
}

export interface FrequentContactType {
  idFrequentContact: number;
  idUser: string;
  _alias: string;
  type: string;
  accountNumber: string;
  bankName: string;
  currency: number;
  documentType: number | null;
  documentNumber: string | null;
  _beneficiaryName: string | null;
  _beneficiaryFirstSurname: string | null;
  _beneficiarySecondSurname: string | null;
}

export interface TransfersFrequentContactsDeleteResponse {}

export interface PayLoanOwnPreview6Response {
  exchangeRate: string;
  loanAmount: LoanAmount;
  totalAmount: string;
  creditCurrency: string;
  capital: string;
  exchange: number;
  debitAccount: string;
  debitAccountLabel: string;
  loan: string;
  loanLabel: string;
  interest: string;
  overdue: string;
  itf: string;
  otherAmountWithoutEECC: string;
  eeccAmount: string;
}

interface LoanAmount {
  currency: string;
  quantity: number;
}

export interface PayLoanOwnSend6Response {}

export interface PayLoanThirdPartiesSend7Response {}

export interface TransferInterbankInmediatePreviewResponse {
  requestedAmount: number;
  amountCurrency: string;
  debitAccountLabel: string;
  totalAmount: number;
  itf: number;
  mibancoComission: number;
  interbankComission: number;
  debitAccountID: string;
  creditAccountCCI: string;
  bankName: string;
  _beneficiaryName: string;
  transferReason: string;
  _mail: string;
}

export interface TransferInterbankInmediateSendResponse {}

export interface DepositSunatDeclarationResponse {}

export interface DepositCreatePreviewResponse {
  renewDeposit: boolean;
  depositCurrency: string;
  amount: number;
  exchange: number;
  debitAccount: string;
  debitAccountLabel: string;
  debitAccountCurrency: string;
  creditAccount: string;
  creditAccountLabel: string;
  trea: string;
  term: number;
  interest: string;
  returnDate: string;
  frequency: string;
}

export interface CoreProductChangeAliasResponse {
  smsAlias: string;
  alias: string;
}
export interface ServicePaymentPreviewResponse {
  totalAmount: string;
  debitAccount: string;
  clientName: string;
  company_service: string;
  companyService: string;
  supply: string;
  ticketNro: string;
  expirationDate: string;
  mustUpdateMobile: boolean;
}
export interface ServicePaymentSendResponse {}

export interface DepositListOptionsResponse {
  dpfList: DpfListItem[];
  dpffList: DpffListItem[];
  currency: string;
  mail: string;
}

export interface DpfListItem {
  client: string;
  product: string;
  amount: number;
  rate: number;
  term: number;
  amountgenerated: number;
}

interface DpffListItem {
  client: string;
  product: string;
  amount: number;
  rate: number;
  term: number;
  amountgenerated: number;
}
export interface CompanyListResponse {
  serviceCompanies: Company[];
}

export interface Company {
  code: string;
  name: string;
  groupCodeCompany: string;
}

export interface CompanyServiceListResponse {
  services: CompanyService[];
}

export enum InputValidation {
  Numeric = '1',
  Alphanumeric = '2',
  Alphabetical = '3',
}
export interface CompanyService {
  code: string;
  name: string;
  message: string;
  schedule: string;
  maxLength: string;
  inputValidation: InputValidation;
}
export interface ServiceCategory {
  code: string;
  name: string;
}
export interface ServicePaymentsResponse {
  serviceCategories: ServiceCategory[];
}

export interface BillListResponse {
  bills: Bill[];
  error: boolean;
  error_message: string | null;
  supply: string;
}

export interface Bill {
  clientCode: string;
  companyGroupCode: string;
  companyCode: string;
  companyName: string | null;
  serviceCode: string | null;
  serviceName: string | null;
  added: string;
  state: string;
  emissionDate: string;
  expirationDate: string;
  payDate?: string | null;
  debtAmount: string;
  totalAmount: string;
  clientName: string;
  ticketNumber: string;
  supply: string;
  traceConsulta: string;
}

export interface LoanDestination {
  idEnvironment: number;
  idProduct?: any;
  productType?: any;
  productTypeLabel?: any;
  productTypeShortLabel?: any;
  description?: any;
  productAlias?: any;
  smsAlias?: any;
  label?: any;
  shortLabel?: any;
  extraInfo?: any;
  currency?: any;
  number?: any;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions?: any;
  destinationName: string;
  destinationId: number;
}

export interface ContentCreditLine {
  idEnvironment: number;
  idProduct?: any;
  productType?: any;
  productTypeLabel?: any;
  productTypeShortLabel?: any;
  description?: any;
  productAlias?: any;
  smsAlias?: any;
  label?: any;
  shortLabel?: any;
  extraInfo?: any;
  currency?: any;
  number?: any;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions?: any;
  approvedCreditLineAmount: number;
  withdrawnCreditLineAmount: number;
  availableCreditLineAmount: number;
  avaiCredLAmountWithoutTax: number;
  amountToDisburse: number;
  capitalAmount: number;
  amountLifeInsurance: number;
  amountITF: number;
  productID: string;
  type: number;
  productKey: string;
  branchKey: string;
  currencyKey: number;
  accountKey: string;
  dispositionMaximumFee: string;
  dispositionMaximumFeeToShow: string;
  payDay: string;
  creditAccountKey: string;
  wayToPay: string;
  loanUse: string;
  typeOfOffer: string;
  requesttype: number;
  loanDestinations: LoanDestination[];
  creditLine: string;
  dispositionMinimumAmount: number;
  dispositionMaximunAmount: number;
  requestNumber: string;
  paymentDatesList: string[];
  expirationdate?: string;
}

export interface CreditLineDisplayResponse {
  contentList: ContentCreditLine[];
}

export interface OptionsList {
  idEnvironment: number;
  idProduct?: any;
  productType?: any;
  productTypeLabel?: any;
  productTypeShortLabel?: any;
  description?: any;
  productAlias?: any;
  smsAlias?: any;
  label?: any;
  shortLabel?: any;
  extraInfo?: any;
  currency: string;
  number?: any;
  consolidatedAmount: number;
  position: number;
  canRead: boolean;
  permissions?: any;
  totalAmount: number;
  insuranceDisposal: number;
  amountFee: number;
  accountKeyr: string;
  itf: number;
  numberFee: number;
  payDay: number;
  rate: number;
  creditLine: string;
  loanUse: string;
  tcea: number;
}

export interface LoanRequestListOptions {
  optionsList: OptionsList[];
}

export interface LoanPreviewResponse {
  amount: number;
  requestedAmount: number;
  amountFee: string;
  term: string;
  tea: string;
  payDay: number;
  rate: number;
  insuranceDisposal: number;
  insuranceDisposalRate: number;
  debitAccount: string;
  operationDate: string;
  operationNumber: number;
  mail: string;
  permissions: Permissions;
  forms: any[];
  debitAccountTicket: string;
  itf: number;
  insurances: InsuranceItem[];
}

export interface LoanRecalculateResponse {
  amount: string;
  requestedAmount: string;
  amountFee: string;
  term: string;
  tea: string;
  payDay: number;
  rate: number;
  insuranceDisposal: number;
  insuranceDisposalRate: number;
  insurances: InsuranceItem[];
}

export interface DataInstantCash {
  mail: string;
  valueDate: string;
  aceptTermAndCondition: boolean;
  numberFee: string;
  wayToPay: string;
  payDay: number;
  currency: string;
  debitAccount: string;
  amount: string;
  isFrequentContact: false;
  creditLine: string;
  ticketOnly: string;
  requestedAmount: string;
  amountFee: string;
  userEmail: string;
  mailTicket: string;
  debitAccountTicket: string;
  term: string;
  tea: string;
  rate: number;
  insuranceDisposal: number;
  insuranceDisposalRate: number;
  operationNumber: number;
  requestNumber: string;
  date: string;
  loan: string;
  lineNumber: string;
  loanNumber: string;
  depositedAmount: string;
  term2: string;
  destination: string;
  product: string;
  productDesc: string;
  fixedInstallments: string;
  gracePeriod: string;
  tcea: string;
  teaPrimerData: string;
  tot_Int_Compensatorios: string;
  rate_cartilla: string;
  policy: string;
  groupedAmount: string;
  premiumTotalAmount: string;
  policyNumber: string;
  rate1: string;
  itfAmount: string;
  c1454: string;
  c1489: string;
  des_Dir_Com: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  gender: string;
  countryCode: string;
  countryName: string;
  maritalStatus: string;
  phone1: string;
  phone2: string;
  occupation: string;
  work: string;
  insuranceMail: string;
  streetType: string;
  streetName: string;
  reference: string;
  district: string;
  province: string;
  department: string;
  credit: string;
  officeCode: string;
  func1: string;
  func2: string;
  disbursementDate: string;
  cohabiting: string;
  regionId: string;
  insurances: InsuranceItem[];
}

export interface CoreReadTransactionInstantCashResponse {
  idTransaction: string;
  idParentTransaction: string | null;
  creationDateTime: string;
  submitDateTime: string;
  valueDateTime: string;
  idEnvironment: number;
  idTransactionStatus: string;
  transactionStatusName: string | null;
  transactionData: string | null;
  data: DataInstantCash;
  idUserCreator: string;
  idActivity: string;
  activityName: string;
  totalAmount: number;
  products: any[];
  signatures: SignaturesItem[];
  channel: string;
  productsLabel: string | null;
  signatureGroupUsed: string;
  modificationDateTime: string;
  idUserEditor: string;
  idForm: number;
  userCreatorFirstName: string;
  userCreatorLastName: string;
  userEditorFirstName: string;
  userEditorLastName: string;
  userCreatorIp: string;
  userEditorIp: string;
  userCreatorLocation: string | null;
  userEditorLocation: string | null;
  executingStartedAtDateTime: string | null;
  fullDescription: string;
  extendedData: string;
  totalAmountAsString: string;
  creationDateTimeAsString: string;
  fullCreationDateTimeAsString: string;
  submitDateTimeAsString: string;
  fullSubmitDateTimeAsString: string;
  shortDescriptionForMobile: string;
  transactionAmountDescription: string;
  statusLabel: string;
  usersSigners: string;
  successfullyCompleted: boolean;
  valueDateAsString: string;
  creatorUsername: string;
  creatorUsernameLabel: string;
  editorUsernameLabel: string;
  shortDescription: string;
  final: boolean;
}

export interface LoanPostponementPreviewResponse {
  status: LoanPostponementStatus;
  client: LoanPostponementClient;
  number: number;
  amount: number;
  totalamount: number;
  term: number;
  rate: number;
  tcea: number;
  currency: LoanPostponementCurrency;
  grace: LoanPostponementGrace;
  insurance: LoanPostponementInsurance;
  product: LoanPostponementProduct;
  fee: LoanPostponementFee;
  reschedule: LoanPostponementReschedule;
  documents: LoanPostponementDocuments;
  operation: LoanPostponementOperation;
}

export interface LoanPostponementSendResponse {
  status: LoanPostponementStatus;
  client: LoanPostponementClient;
  number: number;
  amount: number;
  totalamount: number;
  term: number;
  rate: number;
  tcea: number;
  currency: LoanPostponementCurrency;
  grace: LoanPostponementGrace;
  insurance: LoanPostponementInsurance;
  product: LoanPostponementProduct;
  fee: LoanPostponementFee;
  reschedule: LoanPostponementReschedule;
  documents: LoanPostponementDocuments;
  operation: LoanPostponementOperation;
}

export interface LoanPostponementStatus {
  code: number;
  status: number;
  message: string;
}

export interface LoanPostponementClient {
  id: number;
}

export interface LoanPostponementCurrency {
  id: number;
  description: string;
}

export interface LoanPostponementGrace {
  period: number;
  amount: number;
  type: LoanPostponementType;
}

export interface LoanPostponementType {
  id: string;
  description: string;
}

export interface LoanPostponementInsurance {
  rate: number;
  amount: number;
}

export interface LoanPostponementProduct {
  id: number;
  description: string;
}

export interface LoanPostponementFee {
  number: number;
  amount: number;
  capital: number;
  interest: number;
  itf: number;
  expenses: number;
  mora: number;
  expirationdate: string;
}

export interface LoanPostponementReschedule {
  type: LoanPostponementType2;
  amount: number;
  freezequotas: LoanPostponementFreezequotas;
  monthsadd: number;
  calculationDate: string;
  loans: LoanPostponementLoan[];
}

export interface LoanPostponementType2 {
  id: number;
  description: string;
}

export interface LoanPostponementFreezequotas {
  quotas: number;
  capital: number;
  interest: number;
  itf: number;
  expenses: number;
  mora: number;
}

export interface LoanPostponementLoan {
  id: number;
  product: LoanPostponementProduct2;
  capitalbalance: number;
  requestamount: number;
  requesttotalamount: number;
  number: number;
  fees: LoanPostponementFee2[];
}

export interface LoanPostponementProduct2 {
  id: number;
  description: string;
}

export interface LoanPostponementFee2 {
  number: number;
  amount: number;
  capital: number;
  interest: number;
  itf: number;
  expenses: number;
  mora: number;
  expirationdate: string;
}

export interface LoanPostponementDocuments {
  delivery: LoanPostponementDelivery;
}

export interface LoanPostponementDelivery {
  type: number;
  destination: string;
}

export interface LoanPostponementOperation {
  agency: LoanPostponementAgency;
  number: number;
  date: string;
}

export interface LoanPostponementAgency {
  id: number;
  description: string;
}

export interface DigitalLoanPreviewResponse {
  amount: number;
  totalAmount: number;
  amountFee: number;
  term: number;
  tea: number;
  payDay: number;
  rate: number;
  insuranceDisposal: number;
  insuranceDisposalRate: number;
  debitAccount: string;
  mail: string;
}
export interface DigitalLoanResponse {
  loan: string;
  amount: number;
  totalAmount: number;
  amountFee: number;
  term: number;
  tea: number;
  payDay: number;
  rate: number;
  insuranceDisposal: number;
  insuranceDisposalRate: number;
  debitAccount: string;
  documents: {
    delivery: {
      type: number;
      destination: string;
    };
  };
}

export interface DigitalLoanPreviewResponse {
  amount: number;
  totalAmount: number;
  amountFee: number;
  term: number;
  tea: number;
  payDay: number;
  rate: number;
  insuranceDisposal: number;
  insuranceDisposalRate: number;
  debitAccount: string;
  mail: string;
}

export interface OptionListChip {
  clientId: string;
  totalAmount: number;
  insuranceDisposal: number;
  itf: number;
  numberFee: number;
  amountFee: number;
  payDay: number;
  firstVenc: string;
  rate: number;
  tcea: number;
  amount: number;
  insuranceDisposalRate: number;
  tea: number;
}

export interface LoanRequestListOptionsChips {
  options: OptionListChip[];
}
export interface CurrencyOptions {
  id: string;
  description: string;
  symbol: string;
}

export interface ProductOptions {
  id: string;
  description: string;
}
export interface AmountOption {
  totalAmount: number;
  flex?: number | null;
  index?: number | null;
}
export interface RequestOptions {
  number: string;
  amount: number;
  totalAmount: number;
  term: number;
  payDay: number;
  maxFeeAmount: number;
  currency: CurrencyOptions;
  product: ProductOptions;
}

export interface DigitalProductOptions {
  request: RequestOptions;
  amountOptions: AmountOption[];
  dayOptions: number[];
}

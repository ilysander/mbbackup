export default {
  startWithToken: jest.fn(),
  setLocale: jest.fn(),
  setPrimaryColor: jest.fn(),
  setReproStepsMode: jest.fn(),
  setViewHierarchyEnabled: jest.fn(),
  setEnabledAttachmentTypes: jest.fn(),
  setAutoScreenRecordingEnabled: jest.fn(),
  locale: {},
  reproStepsMode: {},
  invocationEvent: {},
  invocationOptions: {},
};

export const BugReporting = {
  invocationOptions: {},
  setInvocationOptions: jest.fn(),
  setPromptOptionsEnabled: jest.fn(),
  setReportTypes: jest.fn(),
  reportType: {
    question: 1,
  },
};
export const Surveys = {
  showSurveyIfAvailable: jest.fn(),
};
export const NetworkLogger = {
  setEnabled: jest.fn(),
};

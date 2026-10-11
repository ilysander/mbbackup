import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Session from '../../api/Session';
import Ad, {AdProps} from './Ad';

const props: AdProps = {
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn(),
    goBack: jest.fn(),
  } as any,
  user: {
    client: {
      idUser: '7023d27584d94fbf9341f2ccf4dd9f8d',
      username:
        '1e752fde415bb2ae4a892cffd8d7aad2623331a05ebd96f00bafa7f9f51ee0f7',
      email: '',
      _firstName: 'RENE ',
      _lastName: 'ALAVE',
      deleted: false,
      lang: 'es',
      langLabel: null,
      idDefaultEnvironment: 269,
      status: {
        idUserStatus: 'active',
        description: null,
        canLogin: true,
        reserved: false,
        idUserStatusLabel: null,
      },
      idUserStatus: 'active',
      description: '',
      loggedIn: true,
      lastAccessIp: '200.60.21.201',
      lastLogin: '2018-11-29T09:34:28.743-0500',
      creationDate: '2018-10-23T11:49:42.767-0500',
      lastPasswordChange: null,
      phoneNumber: null,
      mobileNumber: null,
      facebookId: null,
      facebookName: null,
      twitterId: null,
      twitterName: null,
      trustfull: true,
      documentCountry: 'PE',
      documentType: '1',
      _documentNumber: '10023329',
      gender: 'M',
      idEnrolledClient: 4505585,
      _secondSurname: 'CHOQUE',
      employee: 'O',
      clientList: [],
      province: null,
      district: null,
      wayType: null,
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      postCode: null,
      state: null,
      country: null,
      password: null,
      idSeal: 3,
      _nameAndId: 'RENE  ALAVE (7023d27584d94fbf9341f2ccf4dd9f8d)',
      lastLoginAsFullString: '29/11/2018 09:34:28',
      lastLoginAsMediumString: '29/11/2018 09:34',
      _usernameLabel: '********6313',
      statusDescription: null,
      _fullName: 'RENE  ALAVE',
      idAddress: '1234',
      addressType: '2',
      addressFormat: '3',
    },
    _clientName: 'RENE ',
    _clientLastName: 'ALAVE',
    _clientSecondLastName: 'CHOQUE',
    _mail: '',
    mobilePhone: '',
    communicationConfigurations: [
      {
        idUser: '7023d27584d94fbf9341f2ccf4dd9f8d',
        communicationType: 'message',
        subscribedSMS: false,
        subscribedMail: true,
        subscribedDefault: true,
        subscribedFacebook: false,
        subscribedTwitter: false,
      },
      {
        idUser: '7023d27584d94fbf9341f2ccf4dd9f8d',
        communicationType: 'promos',
        subscribedSMS: false,
        subscribedMail: true,
        subscribedDefault: true,
        subscribedFacebook: false,
        subscribedTwitter: false,
      },
      {
        idUser: '7023d27584d94fbf9341f2ccf4dd9f8d',
        communicationType: 'loanExpiration',
        subscribedSMS: false,
        subscribedMail: true,
        subscribedDefault: true,
        subscribedFacebook: false,
        subscribedTwitter: false,
      },
      {
        idUser: '7023d27584d94fbf9341f2ccf4dd9f8d',
        communicationType: 'userBlock',
        subscribedSMS: false,
        subscribedMail: true,
        subscribedDefault: true,
        subscribedFacebook: false,
        subscribedTwitter: false,
      },
    ],
    _securitySeal: 3,
    securitySealImage:
      'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MjVEMTAyQzgzQkMxMUU1ODIyOURENzdEMDcxMkRDNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5MjVEMTAyRDgzQkMxMUU1ODIyOURENzdEMDcxMkRDNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjkyNUQxMDJBODNCQzExRTU4MjI5REQ3N0QwNzEyREM0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjkyNUQxMDJCODNCQzExRTU4MjI5REQ3N0QwNzEyREM0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4AJkFkb2JlAGTAAAAAAQMAFQQDBgoNAAAMxwAAFNQAAB2J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',
    defaultEnvironment: 269,
  },
  nameRoute: '',
};

describe('session', () => {
  it('render just views', () => {
    const snapshot = renderer.create(<Ad {...props} />).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  Session.save('sample');
});

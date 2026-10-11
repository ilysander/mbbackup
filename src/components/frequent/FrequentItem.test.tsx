import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FrequentItem, { FrequentItemProps } from './FrequentItem';

const props: FrequentItemProps = {
  accessibilityLabel: 'modal_overlay',
  item: {
    idFrequentContact: 34,
    idUser: '3525a93459aa41619cd9034dee12968e',
    alias: 'Felix chapaza',
    type: 'inter',
    accountNumber: '6001816150',
    bankName: 'Mibanco',
    currency: 1,
    documentType: null,
    documentNumber: null,
    beneficiaryName: null,
    beneficiaryFirstSurname: null,
    beneficiarySecondSurname: null,
  },
  navigation: {
    addListener: jest.fn(),
    navigate: jest.fn(),
    state: {},
    goBack: jest.fn(),
  } as any,
};

it('renders without crashing', () => {
  const snapshot = renderer.create(<FrequentItem {...props} />).toJSON();
  expect(snapshot).toBeTruthy();
});

it('render just views', () => {
  const snapshot = renderer.create(<FrequentItem {...props} />).toJSON();
  expect(snapshot).toMatchSnapshot();
});

it('goToEdit', () => {
  const wrapper = renderer.create(<FrequentItem {...props} />);
  const instance = (wrapper.getInstance() as any) as FrequentItem;
  instance.goToEdit();
  expect(props.navigation.navigate).toHaveBeenCalled();
});

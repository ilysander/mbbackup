import { Formats } from '../constants';
import { Validate } from '../functions';

it('Validate formattingText', () => {
  const response = Validate.formattingText(
    '1234123412341234',
    Formats.DebitCard
  );
  expect(response).toBe('1234 1234 1234 1234');

  const badFormat = JSON.parse(JSON.stringify(Formats.DebitCard));
  badFormat.format = '';
  const response2 = Validate.formattingText('1234 1234 1234 1234', badFormat);
  expect(response2).toBe('1234123412341234');
});

it('Validate formattingText error', () => {
  const badFormat = JSON.parse(JSON.stringify(Formats.DebitCard));
  badFormat.format = '';
  const response1 = Validate.formattingText('1234 1234 1234 1234', badFormat);
  expect(response1).toBe('1234123412341234');

  const badFormat2 = JSON.parse(JSON.stringify(Formats.DebitCard));
  badFormat2.format = undefined;
  const response2 = Validate.formattingText('1234 1234 1234 1234', badFormat2);
  expect(response2).toBe('1234123412341234');

  const badFormat3 = JSON.parse(JSON.stringify(Formats.DebitCard));
  badFormat3.format = undefined;
  const response3 = Validate.formattingText('1234 1234 1234 1234', badFormat3);
  expect(response3).toBe('1234123412341234');

  const response5 = Validate.formattingText('1234 1234 1234 1234', undefined);
  expect(response5).toBe('1234 1234 1234 1234');

  const response6 = Validate.formattingText('1234 1234 1234 1234', '');
  expect(response6).toBe('1234 1234 1234 1234');
});

it('Validate formattingTextNaked', () => {
  const response = Validate.formattingTextNaked(
    '1234 1234 1234 1234',
    Formats.DebitCard
  );
  expect(response).toBe('1234123412341234');
});

it('Validate validateFormat valid', () => {
  const response = Validate.validateFormat(
    '4334660305911117',
    Formats.DebitCard
  );
  expect(response).toBe('');
});

it('Validate validateFormat CellphoneNumber not valid', () => {
  const response = Validate.validateFormat(
    '123456789',
    Formats.CellphoneNumber
  );
  expect(response).not.toBe('');
});

it('Validate validateFormat CellphoneNumber valid', () => {
  const response = Validate.validateFormat(
    '987654321',
    Formats.CellphoneNumber
  );
  expect(response).toBe('');
});

it('Validate validateFormat error', () => {
  const response2 = Validate.validateFormat('', Formats.DebitCard);
  expect(response2).toBe(Formats.DebitCard.validateList[0].msjError);

  const response3 = Validate.validateFormat('123412341234', Formats.DebitCard);
  expect(response3).toBe(Formats.DebitCard.validateList[1].msjError);
});

it('Validate validate repeated numbers error', () => {
  const response = Validate.validateFormat('346662', Formats.InternetKey);
  expect(response).toBe(Formats.InternetKey.validateList[3].msjError);
});

it('Validate validate repeated numbers error - Internet key repeat', () => {
  const response = Validate.validateFormat('123123', Formats.InternetKeyRepeat);
  expect(response).toBe(Formats.InternetKeyRepeat.validateList[4].msjError);
});

it('Validate validate an valid visa card', () => {
  const response = Validate.validateFormat(
    '4334660305911117',
    Formats.DebitCard
  );
  expect(response).not.toBe(Formats.DebitCard.validateList[3].msjError);
});

it('Validate validate a no valid visa card', () => {
  const response = Validate.validateFormat(
    '4334660305911118',
    Formats.DebitCard
  );
  expect(response).toBe(Formats.DebitCard.validateList[3].msjError);
});

it('Validate validate status code -> true', () => {
  const isAValidCode = Validate.validateStatusCode(200);
  expect(isAValidCode).toBe(true);
});

it('Validate validate status code -> false', () => {
  const isAValidCode = Validate.validateStatusCode(500);
  expect(isAValidCode).toBe(false);
});

it('formatAmount -> true', () => {
  const formattedAmount = Validate.formatAmount(12.01, '1');
  expect(formattedAmount.valueFormatted).toBe('S/ 12.01');
});

it('formatAmount -> false', () => {
  const formattedAmount = Validate.formatAmount(0, '1');
  expect(formattedAmount.valueFormatted).toBe('S/ 0.00');
});

it('Validate dates are same -> true', () => {
  const isAValidCode = Validate.validateDatesLoanPostponement(
    '2020-11-03T00:00:00.000-0500',
    '03-11-2020'
  );
  expect(isAValidCode).toBe(true);
});

it('Validate second date is more old -> true', () => {
  const isAValidCode = Validate.validateDatesLoanPostponement(
    '2020-11-03T00:00:00.000-0500',
    '02-11-2020'
  );
  expect(isAValidCode).toBe(true);
});

it('Validate second date is more young -> true', () => {
  const isAValidCode = Validate.validateDatesLoanPostponement(
    '2020-11-03T00:00:00.000-0500',
    '05-11-2020'
  );
  expect(isAValidCode).toBe(false);
});

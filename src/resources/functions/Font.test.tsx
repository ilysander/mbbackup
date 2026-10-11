import {withPlatform} from '../../resources/util/Tests';
import Font from './Font';

it(
  'default',
  withPlatform('ios', () => {
    const result = Font({weight: 'Medium'});
    expect(JSON.stringify(result)).toBe(
      JSON.stringify({
        fontFamily: 'Brevia',
        fontWeight: '500',
        fontStyle: 'normal',
      }),
    );
  }),
);
// it(
//   'default android',
//   withPlatform('android', () => {
//     const result = Font({ weight: 'Medium' });
//     expect(JSON.stringify(result)).toBe(
//       JSON.stringify({ fontFamily: 'Brevia-Medium' })
//     );
//   })
// );
it(
  'bold',
  withPlatform('ios', () => {
    const result = Font({weight: 'Bold'});
    expect(JSON.stringify(result)).toBe(
      JSON.stringify({
        fontFamily: 'Brevia',
        fontWeight: '700',
        fontStyle: 'normal',
      }),
    );
  }),
);
// it(
//   'bold android',
//   withPlatform('android', () => {
//     const result = Font({ weight: 'Bold' });
//     expect(JSON.stringify(result)).toBe(
//       JSON.stringify({ fontFamily: 'Brevia-Bold' })
//     );
//   })
// );
it(
  'italic',
  withPlatform('ios', () => {
    const result = Font({style: 'Italic'});
    expect(JSON.stringify(result)).toBe(
      JSON.stringify({
        fontFamily: 'Brevia',
        fontWeight: '400',
        fontStyle: 'italic',
      }),
    );
  }),
);
// it(
//   'italic android',
//   withPlatform('android', () => {
//     const result = Font({ style: 'Italic' });
//     expect(JSON.stringify(result)).toBe(
//       JSON.stringify({ fontFamily: 'Brevia-RegularItalic' })
//     );
//   })
// );

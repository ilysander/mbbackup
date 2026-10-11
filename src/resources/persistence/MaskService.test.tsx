import MaskService from './MaskService';

it('findFirst', async () => {
  try {
    await MaskService.findFirst();
  } catch (e) {
    expect(e).not.toBe(undefined);
  }
});

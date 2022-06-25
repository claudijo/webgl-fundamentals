import { surface } from './surface';

test('surface', () => {
  const result = surface(2, 1);
  expect(result.position).toStrictEqual([
    0, 0, 0,
    1, 0, 0,
    2, 0, 0,
    0, 0, 1,
    1, 0, 1,
    2, 0, 1,
  ]);


});
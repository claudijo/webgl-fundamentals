export const surface = (width, depth, distortion = 0) => {
  const position = [];
  for (let row = 0; row <= depth; row++) {
    for (let column = 0; column <= width; column++) {
      position.push(column, distortion, row);
    }
  }

  const indices = [];
  for (let row = 0; row <= depth - 1; row++) {
    for (let column = 0; column <= width - 1; column++) {
      indices.push(column + row);
      indices.push(column + row + width + 1);
      indices.push(column + row + 1);

      indices.push(column + row + 1);
      indices.push(column + row + width + 1);
      indices.push(column + row + width + 2);
    }
  }

  return {
    position,
    indices,
  };
};
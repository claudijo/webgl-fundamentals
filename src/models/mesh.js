import { cross, subtractVectors } from '../libs/m4';

const heightMap = (x, _, z) => {
  const y = Math.sin(x) / (4) + Math.sin(z) / (3);
  return [x, y, z];
};

const triangleNormal = triangle => {
  const d1 = subtractVectors(triangle[1], triangle[0]);
  const d2 = subtractVectors(triangle[2], triangle[0]);
  return cross(d1, d2);
};

// https://www.cs.uregina.ca/Links/class-info/315/WebGL/Lab4/
export function make2DMesh(xzMin, xzMax, xDivs, zDivs) {
  const position = [];
  const dim = subtractVectors(xzMax, xzMin);
  const dx = dim[0] / xDivs;
  const dz = dim[2] / zDivs;

  for (let x = xzMin[0]; x < xzMax[0]; x += dx) {
    for (let z = xzMin[2]; z < xzMax[2]; z += dz) {

      //Triangle 1
      //  x,z
      //   |\
      //   |  \
      //   |    \
      //   |      \
      //   |        \
      //   |__________\
      // x,z+dz      x+dx,z+dz
      position.push(
        x, 0, z,
        x, 0, z + dz,
        x + dx, 0, z + dz
      );

      //Triangle 2
      //  x,z         x+dx,z
      //    \----------|
      //      \        |
      //        \      |
      //          \    |
      //            \  |
      //              \|
      //           x+dx,z+dz
      position.push(
        x, 0, z,
        x + dx, 0, z + dz,
        x + dx, 0, z
      );
    }
  }

  return position;
}
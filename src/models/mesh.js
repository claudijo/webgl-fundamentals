import { cross, subtractVectors } from '../libs/m4';

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
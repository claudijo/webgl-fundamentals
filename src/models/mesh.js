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
  const normal = [];
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
      const triangle1 = [
        heightMap(x, 0, z),
        heightMap(x, 0, z + dz),
        heightMap(x + dx, 0, z + dz),
      ];
      position.push(...triangle1.flat());

      const normal1 = triangleNormal(triangle1);

      normal.push(
        ...normal1,
        ...normal1,
        ...normal1,
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
      const triangle2 = [
        heightMap(x, 0, z),
        heightMap(x + dx, 0, z + dz),
        heightMap(x + dx, 0, z),
      ];

      position.push(...triangle2.flat());

      const normal2 = triangleNormal(triangle2);

      normal.push(
        ...normal2,
        ...normal2,
        ...normal2,
      );
    }
  }

  return {
    position,
    normal,
  };
}
import { make2DMesh } from './mesh';
import { applyWaves, calculateNormals } from '../utils/vertex';
import { createBufferInfoFromArrays } from '../libs/webgl';

const position = make2DMesh([-20, 0, -20], [20, 0, 20], 30, 30);
const normal = new Array(position.length);

export function createOceanBufferInfo(gl, time) {
  applyWaves(position, position, time);
  calculateNormals(position, normal);

  return createBufferInfoFromArrays(gl, {
    position,
    normal,
  });
}
import { make2DMesh } from './mesh';
import { applyWaves, calculateNormals } from '../utils/vertex';
import { createBufferInfoFromArrays } from '../libs/webgl';

export const xzMinOcean = [-20, 0, -20];
export const xzMaxOcean = [20, 0, 20];
export const xDivsOcean = 30;
export const zDivsOcean = 30;

const position = make2DMesh(xzMinOcean, xzMaxOcean, xDivsOcean, zDivsOcean);
const normal = new Array(position.length);

export function createOceanBufferInfo(gl, time) {
  applyWaves(position, position, time);
  calculateNormals(position, normal);

  return createBufferInfoFromArrays(gl, {
    position,
    normal,
  });
}
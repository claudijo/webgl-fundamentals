import { random } from '../libs/math';

export function applyHight(vertices, time, dest) {
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];
    dest[i + 1] = Math.sin(x * 0.5 + time * 1.5) / 5 + Math.sin(z * 0.3 + time * 1.5) / 4;
    // dest[i + 1] = Math.sin(x * 1.5 + time * 1.5) / 3 + Math.sin(z + time * 1.5) / 2;
  }
}

export function calculateNormals(array, dest) {
  for (let i = 0; i < array.length; i += 9) {
    // First vertex
    const ax = array[i];
    const ay = array[i + 1];
    const az = array[i + 2];

    // Second vertex
    const bx = array[i + 3];
    const by = array[i + 4];
    const bz = array[i + 5];

    // Third Vertex
    const cx = array[i + 6];
    const cy = array[i + 7];
    const cz = array[i + 8];

    // Subtract second and first vectors
    const vx = bx - ax;
    const vy = by - ay;
    const vz = bz - az;

    // Subtract third and first vectors
    const wx = cx - ax;
    const wy = cy - ay;
    const wz = cz - az;

    // Calculate normals with cross product
    const nx = vy * wz - vz * wy;
    const ny = vz * wx - vx * wz;
    const nz = vx * wy - vy * wx;

    dest[i] = nx;
    dest[i + 1] = ny;
    dest[i + 2] = nz;

    dest[i + 3] = nx;
    dest[i + 4] = ny;
    dest[i + 5] = nz;

    dest[i + 6] = nx;
    dest[i + 7] = ny;
    dest[i + 8] = nz;
  }
}
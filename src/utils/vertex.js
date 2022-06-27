import { random } from '../libs/math';

export function applyHeightMap(vertices, time, dest) {
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];
    dest[i + 1] = Math.sin(x * 0.5 + time * 1.5) / 5 + Math.sin(z * 0.3 + time * 1.5) / 4;
    // dest[i + 1] = Math.sin(x * 1.5 + time * 1.5) / 3 + Math.sin(z + time * 1.5) / 2;
  }
}

export function calculateNormals(vertices, dest) {
  for (let i = 0; i < vertices.length; i += 9) {
    // X coords
    const a0 = vertices[i];
    const a1 = vertices[i + 1];
    const a2 = vertices[i + 2];

    // y coords
    const a3 = vertices[i + 3];
    const a4 = vertices[i + 4];
    const a5 = vertices[i + 5];

    // z coords
    const a6 = vertices[i + 6];
    const a7 = vertices[i + 7];
    const a8 = vertices[i + 8];

    // a
    const d0 = a3 - a0;
    const d1 = a4 - a1;
    const d2 = a5 - a2;

    // b
    const d3 = a6 - a0;
    const d4 = a7 - a1;
    const d5 = a8 - a2;

    // normals
    const n0 = d1 * d5 - d2 * d4;
    const n1 = d2 * d3 - d0 * d5;
    const n2 = d0 * d4 - d1 * d3;


    dest[i] = n0;
    dest[i + 1] = n1;
    dest[i + 2] = n2;

    dest[i + 3] = n0;
    dest[i + 4] = n1;
    dest[i + 5] = n2;

    dest[i + 6] = n0;
    dest[i + 7] = n1;
    dest[i + 8] = n2;
  }
}
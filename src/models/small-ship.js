import { createBufferInfoFromArrays } from '../libs/webgl';

const CUBE_FACE_INDICES = [
  [3, 7, 5, 1], // right
  [6, 2, 0, 4], // left
  [6, 7, 3, 2], // ??
  [0, 1, 5, 4], // ??
  [7, 6, 4, 5], // front
  [2, 3, 1, 0], // back
];

const width = 4;
const height = 2;
const depth = 2;

export function getWaterLineTriangle (x, z) {
  return [
    x - width / 2, 0, z - depth / 2,
    x - width / 2, 0, z + depth / 2,
    x + width / 2, 0, z,
  ]
}

// https://webglfundamentals.org/webgl/resources/primitives.js
export function createSmallShipBufferInfo(gl) {
  const w = width / 2;
  const h = height / 2;
  const d = depth / 2;
  const cornerVertices = [
    [-w, -h, -d],
    [+w, -h, -d],
    [-w, +h, -d],
    [+w, +h, -d],
    [-w, -h, +d],
    [+w, -h, +d],
    [-w, +h, +d],
    [+w, +h, +d],
  ];

  const faceNormals = [
    [+1, +0, +0],
    [-1, +0, +0],
    [+0, +1, +0],
    [+0, -1, +0],
    [+0, +0, +1],
    [+0, +0, -1],
  ];

  const positions = [];
  const normals = [];
  const indices = [];

  for (let f = 0; f < 6; ++f) {
    const faceIndices = CUBE_FACE_INDICES[f];
    for (let v = 0; v < 4; ++v) {
      const position = cornerVertices[faceIndices[v]];
      const normal = faceNormals[f];
      positions.push(...position);
      normals.push(...normal);
    }

    // Two triangles make a square face.
    const offset = 4 * f;
    indices.push(offset + 0, offset + 1, offset + 2);
    indices.push(offset + 0, offset + 2, offset + 3);
  }

  return createBufferInfoFromArrays(gl, {
    position: positions,
    normal: normals,
    indices,
  });
}
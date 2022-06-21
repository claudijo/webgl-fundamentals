const EPSILON = 0.000001;

export function createIdentityMatrix() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

export function createOrthographicProjectionMatrix(left, right, bottom, top, near, far) {
  const matrix = new Float32Array(16);

  if (left === right || bottom === top || near === far) {
    throw 'null frustum';
  }

  const rw = 1 / (right - left);
  const rh = 1 / (top - bottom);
  const rd = 1 / (far - near);

  matrix[0] = 2 * rw;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;

  matrix[4] = 0;
  matrix[5] = 2 * rh;
  matrix[6] = 0;
  matrix[7] = 0;

  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = -2 * rd;
  matrix[11] = 0;

  matrix[12] = -(right + left) * rw;
  matrix[13] = -(top + bottom) * rh;
  matrix[14] = -(far + near) * rd;
  matrix[15] = 1;

  return matrix;
}


export function createPerspectiveProjectionMatrix(fieldOfView, aspect, near, far) {
  if (near === far || aspect === 0) {
    throw 'null frustum';
  }
  if (near <= 0) {
    throw 'near <= 0';
  }
  if (far <= 0) {
    throw 'far <= 0';
  }

  fieldOfView = fieldOfView / 2;
  const s = Math.sin(fieldOfView);
  if (s === 0) {
    throw 'null frustum';
  }

  const rd = 1 / (far - near);
  const ct = Math.cos(fieldOfView) / s;

  const matrix = new Float32Array(16);

  matrix[0] = ct / aspect;
  matrix[1] = 0;
  matrix[2] = 0;
  matrix[3] = 0;

  matrix[4] = 0;
  matrix[5] = ct;
  matrix[6] = 0;
  matrix[7] = 0;

  matrix[8] = 0;
  matrix[9] = 0;
  matrix[10] = -(far + near) * rd;
  matrix[11] = -1;

  matrix[12] = 0;
  matrix[13] = 0;
  matrix[14] = -2 * near * far * rd;
  matrix[15] = 0;

  return matrix;
}

export function multiply(scalar, vector) {
  vector.forEach((component, index) => {
    vector[index] = component * scalar;
  });

  return vector;
}

export function translate(matrix, x, y, z) {
  matrix[12] += matrix[0] * x + matrix[4] * y + matrix[8] * z;
  matrix[13] += matrix[1] * x + matrix[5] * y + matrix[9] * z;
  matrix[14] += matrix[2] * x + matrix[6] * y + matrix[10] * z;
  matrix[15] += matrix[3] * x + matrix[7] * y + matrix[11] * z;
  return matrix;
}

export function rotate(matrix, rad, x, y, z) {
  let len = Math.hypot(x, y, z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  a00 = matrix[0];
  a01 = matrix[1];
  a02 = matrix[2];
  a03 = matrix[3];
  a10 = matrix[4];
  a11 = matrix[5];
  a12 = matrix[6];
  a13 = matrix[7];
  a20 = matrix[8];
  a21 = matrix[9];
  a22 = matrix[10];
  a23 = matrix[11];

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;

  matrix[0] = a00 * b00 + a10 * b01 + a20 * b02;
  matrix[1] = a01 * b00 + a11 * b01 + a21 * b02;
  matrix[2] = a02 * b00 + a12 * b01 + a22 * b02;
  matrix[3] = a03 * b00 + a13 * b01 + a23 * b02;
  matrix[4] = a00 * b10 + a10 * b11 + a20 * b12;
  matrix[5] = a01 * b10 + a11 * b11 + a21 * b12;
  matrix[6] = a02 * b10 + a12 * b11 + a22 * b12;
  matrix[7] = a03 * b10 + a13 * b11 + a23 * b12;
  matrix[8] = a00 * b20 + a10 * b21 + a20 * b22;
  matrix[9] = a01 * b20 + a11 * b21 + a21 * b22;
  matrix[10] = a02 * b20 + a12 * b21 + a22 * b22;
  matrix[11] = a03 * b20 + a13 * b21 + a23 * b22;

  return matrix;
};

export function transpose(matrix) {
  let t = matrix[1];
  matrix[1] = matrix[4];
  matrix[4] = t;

  t = matrix[2];
  matrix[2] = matrix[8];
  matrix[8] = t;

  t = matrix[3];
  matrix[3] = matrix[12];
  matrix[12] = t;

  t = matrix[6];
  matrix[6] = matrix[9];
  matrix[9] = t;

  t = matrix[7];
  matrix[7] = matrix[13];
  matrix[13] = t;

  t = matrix[11];
  matrix[11] = matrix[14];
  matrix[14] = t;

  return matrix;
}

export function invert(matrix) {
  const m0 = matrix[0];
  const m1 = matrix[1];
  const m2 = matrix[2];
  const m3 = matrix[3];
  const m4 = matrix[4];
  const m5 = matrix[5];
  const m6 = matrix[6];
  const m7 = matrix[7];
  const m8 = matrix[8];
  const m9 = matrix[9];
  const m10 = matrix[10];
  const m11 = matrix[11];
  const m12 = matrix[12];
  const m13 = matrix[13];
  const m14 = matrix[14];
  const m15 = matrix[15];

  matrix[0] = m5 * m10 * m15 - m5 * m11 * m14 - m9 * m6 * m15
    + m9 * m7 * m14 + m13 * m6 * m11 - m13 * m7 * m10;
  matrix[4] = -m4 * m10 * m15 + m4 * m11 * m14 + m8 * m6 * m15
    - m8 * m7 * m14 - m12 * m6 * m11 + m12 * m7 * m10;
  matrix[8] = m4 * m9 * m15 - m4 * m11 * m13 - m8 * m5 * m15
    + m8 * m7 * m13 + m12 * m5 * m11 - m12 * m7 * m9;
  matrix[12] = -m4 * m9 * m14 + m4 * m10 * m13 + m8 * m5 * m14
    - m8 * m6 * m13 - m12 * m5 * m10 + m12 * m6 * m9;

  matrix[1] = -m1 * m10 * m15 + m1 * m11 * m14 + m9 * m2 * m15
    - m9 * m3 * m14 - m13 * m2 * m11 + m13 * m3 * m10;
  matrix[5] = m0 * m10 * m15 - m0 * m11 * m14 - m8 * m2 * m15
    + m8 * m3 * m14 + m12 * m2 * m11 - m12 * m3 * m10;
  matrix[9] = -m0 * m9 * m15 + m0 * m11 * m13 + m8 * m1 * m15
    - m8 * m3 * m13 - m12 * m1 * m11 + m12 * m3 * m9;
  matrix[13] = m0 * m9 * m14 - m0 * m10 * m13 - m8 * m1 * m14
    + m8 * m2 * m13 + m12 * m1 * m10 - m12 * m2 * m9;

  matrix[2] = m1 * m6 * m15 - m1 * m7 * m14 - m5 * m2 * m15
    + m5 * m3 * m14 + m13 * m2 * m7 - m13 * m3 * m6;
  matrix[6] = -m0 * m6 * m15 + m0 * m7 * m14 + m4 * m2 * m15
    - m4 * m3 * m14 - m12 * m2 * m7 + m12 * m3 * m6;
  matrix[10] = m0 * m5 * m15 - m0 * m7 * m13 - m4 * m1 * m15
    + m4 * m3 * m13 + m12 * m1 * m7 - m12 * m3 * m5;
  matrix[14] = -m0 * m5 * m14 + m0 * m6 * m13 + m4 * m1 * m14
    - m4 * m2 * m13 - m12 * m1 * m6 + m12 * m2 * m5;

  matrix[3] = -m1 * m6 * m11 + m1 * m7 * m10 + m5 * m2 * m11
    - m5 * m3 * m10 - m9 * m2 * m7 + m9 * m3 * m6;
  matrix[7] = m0 * m6 * m11 - m0 * m7 * m10 - m4 * m2 * m11
    + m4 * m3 * m10 + m8 * m2 * m7 - m8 * m3 * m6;
  matrix[11] = -m0 * m5 * m11 + m0 * m7 * m9 + m4 * m1 * m11
    - m4 * m3 * m9 - m8 * m1 * m7 + m8 * m3 * m5;
  matrix[15] = m0 * m5 * m10 - m0 * m6 * m9 - m4 * m1 * m10
    + m4 * m2 * m9 + m8 * m1 * m6 - m8 * m2 * m5;

  let det = m0 * matrix[0] + m1 * matrix[4] + m2 * matrix[8] + m3 * matrix[12];
  if (det === 0) {
    return null;
  }

  return multiply(1 / det, matrix);
}
export function wave(x,z, time) {
  const xHeight = 0.2;
  const xSpeed = 1.5;
  const xFrequency = 0.5;
  const zHeight = 0.25
  const zSpeed = 1.5;
  const zFrequency = 0.3;

  return Math.sin(x * xFrequency + time * xSpeed) * xHeight + Math.sin(z * zFrequency + time * zSpeed) * zHeight;
}

export function applyWaves(source, dest, time) {
  for (let i = 0; i < source.length; i += 3) {
    dest[i + 1] = wave(source[i], source[i + 2], time);
  }
}

export function calculateNormals(source, dest) {
  for (let i = 0; i < source.length; i += 9) {
    // First vertex
    const ax = source[i];
    const ay = source[i + 1];
    const az = source[i + 2];

    // Second vertex
    const bx = source[i + 3];
    const by = source[i + 4];
    const bz = source[i + 5];

    // Third Vertex
    const cx = source[i + 6];
    const cy = source[i + 7];
    const cz = source[i + 8];

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
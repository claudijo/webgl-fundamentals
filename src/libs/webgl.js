// Inspired by https://twgljs.org/

export function resizeCanvasToDisplaySize(canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

export function clear(gl, rgba = [0, 0, 0, 1.0]) {
  gl.clearColor(...rgba);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

export function createProgramInfo(gl, vsSource, fsSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionLoc = gl.getAttribLocation(program, 'a_position');

  return {
    program,
    positionLoc,
  };
}

export function createBufferInfoFromArrays(gl, arrays) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays.positions), gl.STATIC_DRAW);

  return {
    positionBuffer,
    numElements: 6,
  };
}

export function setBuffersAndAttributes(gl, programInfo, bufferInfo) {
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.positionBuffer);
  gl.vertexAttribPointer(programInfo.positionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.positionLoc);
}

export function setUniforms(programInfo, uniforms) {
  // TODO
}

export function drawBufferInfo(gl, bufferInfo) {
  gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
}

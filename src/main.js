import { createElement } from './libs/dom';
import {
  createBufferInfoFromArrays,
  createProgramInfo,
  drawBufferInfo,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes, setUniforms,
} from './libs/webgl';
import vsSource from './shaders/shader.vert';
import fsSource from './shaders/shader.frag';
import {
  inverse,
  lookAt, multiply,
  normalize,
  perspective,
  translation, transpose,
  yRotate,
} from './libs/m4';
import { degToRad } from './libs/math';
import { make2DMesh } from './models/mesh';
import { applyWaves, calculateNormals } from './utils/vertex';
import '../styles/main.css';

const SCENE_WIDTH = 640;
const SCENE_HEIGHT = 480;

const canvas = createElement('canvas', { width: SCENE_WIDTH, height: SCENE_HEIGHT });
document.body.appendChild(canvas);

const gl = canvas.getContext('webgl');

// Don't draw pixels that are behind other pixels
gl.enable(gl.DEPTH_TEST);

//  Draw only forward facing triangles
gl.enable(gl.CULL_FACE);

const programInfo = createProgramInfo(gl, vsSource, fsSource);

const position = make2DMesh([-20, 0, -20], [20, 0, 20], 30, 30);
const normal = new Array(position.length);

function render(time) {
  time = time * 0.001;
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Attributes
  applyWaves(position, position, time);
  calculateNormals(position, normal);

  const bufferInfo = createBufferInfoFromArrays(gl, {
    position,
    normal,
  });

  const projectionMatrix = perspective(degToRad(60), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100);
  const cameraMatrix = lookAt([0, 6, 30], [0, 0, 0], [0, 1, 0]);
  const viewMatrix = inverse(cameraMatrix);

  const viewProjectionMatrix = multiply(projectionMatrix, viewMatrix);

  const worldMatrix = translation(0, 0, -4);
  yRotate(worldMatrix, degToRad(45), worldMatrix);

  const worldViewProjectionMatrix = multiply(viewProjectionMatrix, worldMatrix);
  const worldInverseMatrix = inverse(worldMatrix);
  const worldInverseTransposeMatrix = transpose(worldInverseMatrix);

  const uniforms = {
    u_worldViewProjection: worldViewProjectionMatrix,
    u_worldInverseTranspose: worldInverseTransposeMatrix,
    u_reverseLightDirection: normalize([-1, 1, 0]),
    u_color: [0.42, 0.85, 0.91, 1],
  };

  gl.useProgram(programInfo.program);
  setBuffersAndAttributes(gl, programInfo, bufferInfo);
  setUniforms(programInfo, uniforms);

  drawBufferInfo(gl, bufferInfo);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

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
  axisRotate,
  identity,
  inverse,
  lookAt, multiply,
  normalize,
  perspective,
  translation, transpose, xRotate,
  yRotate, zRotate,
} from './libs/m4';
import { degToRad } from './libs/math';
import { applyWaves, calculateNormals, waveHeight } from './utils/vertex';
import '../styles/main.css';
import { createOceanBufferInfo } from './models/ocean';
import { createSmallShipBufferInfo, getWaterLineTriangle } from './models/small-ship';

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

const smallShipBuffer = createSmallShipBufferInfo(gl);

function render(time) {
  time = time * 0.001;
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const oceanBufferInfo = createOceanBufferInfo(gl, time);

  const projectionMatrix = perspective(degToRad(40), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100);
  const cameraMatrix = lookAt([0, 6, 30], [0, 0, 0], [0, 1, 0]);
  const viewMatrix = inverse(cameraMatrix);

  const viewProjectionMatrix = multiply(projectionMatrix, viewMatrix);

  const worldMatrix = translation(0, 0, -4);
  yRotate(worldMatrix, degToRad(45), worldMatrix);

  const worldViewProjectionMatrix = multiply(viewProjectionMatrix, worldMatrix);
  const worldInverseMatrix = inverse(worldMatrix);
  const worldInverseTransposeMatrix = transpose(worldInverseMatrix);

  const globalUniforms = {
    u_worldViewProjection: worldViewProjectionMatrix,
    u_worldInverseTranspose: worldInverseTransposeMatrix,
    u_reverseLightDirection: normalize([-1, 1, 0]),
  };

  const oceanUniforms = {
    u_color: [0.42, 0.85, 0.91, 1],
    u_model: identity(),
  };

  const waterLineTriangle = getWaterLineTriangle(0,0);
  applyWaves(waterLineTriangle, waterLineTriangle, time);

  const waterLineTriangleNormals = new Array(waterLineTriangle.length);
  calculateNormals(waterLineTriangle, waterLineTriangleNormals);
  normalize(waterLineTriangleNormals, waterLineTriangleNormals);
  const smallShipRotation = waterLineTriangleNormals.slice(0, 3);

  const xRot = Math.atan2(smallShipRotation[2], smallShipRotation[1]);
  const zRot = Math.atan2(smallShipRotation[0], smallShipRotation[1]);

  const modelMatrix = translation(0,waveHeight(0,0, time),0);
  xRotate(modelMatrix, xRot, modelMatrix);
  zRotate(modelMatrix, -zRot, modelMatrix);

  const smallShipUniforms = {
    u_color: [1, 0, 0, 1],
    u_model: modelMatrix,

  };

  gl.useProgram(programInfo.program);
  setUniforms(programInfo, globalUniforms);

  setUniforms(programInfo, oceanUniforms);
  setBuffersAndAttributes(gl, programInfo, oceanBufferInfo);
  drawBufferInfo(gl, oceanBufferInfo);

  setUniforms(programInfo, smallShipUniforms);
  setBuffersAndAttributes(gl, programInfo, smallShipBuffer);
  drawBufferInfo(gl, smallShipBuffer);


  requestAnimationFrame(render);
}

requestAnimationFrame(render);

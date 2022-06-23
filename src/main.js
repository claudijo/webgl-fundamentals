import { createElement } from './libs/dom';
import { triangle } from './models/triangle';
import {
  createBufferInfoFromArrays,
  createProgramInfo,
  drawBufferInfo,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes, setUniforms,
} from './libs/webgl';
import vsSource from './shaders/shader.vert';
import fsSource from './shaders/shader.frag';
import { identity, lookAt, perspective, scaling, translate, translation, xRotate, yRotate, zRotate } from './libs/m4';
import { degToRad } from './libs/math';

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

const arrays = {
  position: [
    -1, 0.2, 1,
    1, 0, -1,
    -1, 0, -1,

    -1, 0.2, 1,
    1, 0, 1,
    1, 0, -1,
  ],
};

const bufferInfo = createBufferInfoFromArrays(gl, arrays);

function render(time) {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const modelMatrix = translation(0, 0, -4);
  xRotate(modelMatrix, degToRad(0), modelMatrix);

  const uniforms = {
    u_projection: perspective(degToRad(90), gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100),
    u_view: lookAt([0, -1, 0], [0, 0, -2], [0, 1, 0]),
    u_model: modelMatrix,
  };

  gl.useProgram(programInfo.program);
  setBuffersAndAttributes(gl, programInfo, bufferInfo);
  setUniforms(programInfo, uniforms);

  drawBufferInfo(gl, bufferInfo);

  // requestAnimationFrame(render);
}

requestAnimationFrame(render);

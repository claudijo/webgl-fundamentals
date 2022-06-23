import { createElement } from './libs/dom';
import { triangle } from './models/triangle';
import {
  clear,
  createBufferInfoFromArrays,
  createProgramInfo,
  draw, drawBufferInfo,
  resizeCanvasToDisplaySize,
  setBuffersAndAttributes, setUniforms,
} from './libs/webgl';
import vsSource from './shaders/shader.vert';
import fsSource from './shaders/shader.frag';

const SCENE_WIDTH = 640;
const SCENE_HEIGHT = 480;

const canvas = createElement('canvas', { width: SCENE_WIDTH, height: SCENE_HEIGHT });
document.body.appendChild(canvas);

const gl = canvas.getContext('webgl');

gl.enable(gl.DEPTH_TEST);

const programInfo = createProgramInfo(gl, vsSource, fsSource);

const arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const bufferInfo = createBufferInfoFromArrays(gl, arrays);

function render(time) {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const uniforms = {
    // time: time * 0.001,
    u_resolution: [gl.canvas.width / 64, gl.canvas.height / 48],
  };

  gl.useProgram(programInfo.program);
  setBuffersAndAttributes(gl, programInfo, bufferInfo);
  setUniforms(programInfo, uniforms);

  drawBufferInfo(gl, bufferInfo);

  // requestAnimationFrame(render);
}

requestAnimationFrame(render);

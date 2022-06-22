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

const programInfo = createProgramInfo(gl, vsSource, fsSource);

const arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const bufferInfo = createBufferInfoFromArrays(gl, arrays);

function render(time) {
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const uniforms = {
    time: time * 0.001,
    resolution: [gl.canvas.width, gl.canvas.height],
  };

  gl.useProgram(programInfo.program);
  setBuffersAndAttributes(gl, programInfo, bufferInfo);
  setUniforms(programInfo, uniforms);

  clear(gl);
  drawBufferInfo(gl, bufferInfo);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

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
import { identity, perspective, scaling } from './libs/m4';
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
  position: [-0.5, -0.5, -2, 0.5, -0.5, -2, -0.5, 0.5, -2, -0.5, 0.5, -2, 0.5, -0.5, -2, 0.5, 0.5, -2],
};

const bufferInfo = createBufferInfoFromArrays(gl, arrays);

function render(time) {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas AND the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const uniforms = {
    u_worldViewProjection: perspective(degToRad(90), gl.canvas.clientWidth / gl.canvas.clientHeight,1, 100),
  };

  gl.useProgram(programInfo.program);
  setBuffersAndAttributes(gl, programInfo, bufferInfo);
  setUniforms(programInfo, uniforms);

  drawBufferInfo(gl, bufferInfo);

  // requestAnimationFrame(render);
}

requestAnimationFrame(render);

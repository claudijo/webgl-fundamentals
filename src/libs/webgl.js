// From https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html

export function createProgram(gl, vertexShader, fragmentShader, onError = console.error.bind(console)) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  onError(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function createShader(gl, type, source, onError = console.error.bind(console)) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  onError(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}


export function createProgramFromSources(gl, vsSource, fsSource, onError = console.error.bind(console)) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource, onError);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource, onError);
  return createProgram(gl, vertexShader, fragmentShader, onError);
}

//Returns the corresponding bind point for a given sampler type
function getBindPointForSamplerType(gl, type) {
  if (type === gl.SAMPLER_2D) {
    return gl.TEXTURE_2D;
  }
  if (type === gl.SAMPLER_CUBE) {
    return gl.TEXTURE_CUBE_MAP;
  }
}

export function setUniforms(setters, ...values) {
  setters = setters.uniformSetters || setters;

  for (const uniforms of values) {
    Object.keys(uniforms).forEach(name => {
      const setter = setters[name];
      if (setter) {
        setter(uniforms[name]);
      }
    });
  }
}

export function setAttributes(setters, attribs) {
  setters = setters.attribSetters || setters;
  Object.keys(attribs).forEach(name => {
    const setter = setters[name];
    if (setter) {
      setter(attribs[name]);
    }
  });
}

export function createAttributeSetters(gl, program) {
  const attribSetters = {};

  const createAttribSetter = index => {
    return b => {
      if (b.value) {
        gl.disableVertexAttribArray(index);
        switch (b.value.length) {
          case 4:
            gl.vertexAttrib4fv(index, b.value);
            break;
          case 3:
            gl.vertexAttrib3fv(index, b.value);
            break;
          case 2:
            gl.vertexAttrib2fv(index, b.value);
            break;
          case 1:
            gl.vertexAttrib1fv(index, b.value);
            break;
          default:
            throw new Error('the length of a float constant value must be between 1 and 4!');
        }
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
        gl.enableVertexAttribArray(index);
        gl.vertexAttribPointer(index, b.numComponents
          || b.size, b.type
          || gl.FLOAT, b.normalize
          || false, b.stride
          || 0, b.offset
          || 0);
      }
    };
  };

  const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

  for (let ii = 0; ii < numAttribs; ++ii) {
    const attribInfo = gl.getActiveAttrib(program, ii);
    if (!attribInfo) {
      break;
    }
    const index = gl.getAttribLocation(program, attribInfo.name);
    attribSetters[attribInfo.name] = createAttribSetter(index);
  }

  return attribSetters;
}

export function createUniformSetters(gl, program) {
  let textureUnit = 0;

  const createUniformSetter = (program, uniformInfo) => {
    const location = gl.getUniformLocation(program, uniformInfo.name);
    const type = uniformInfo.type;

    // Check if this uniform is an array
    const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]');

    if (type === gl.FLOAT && isArray) {
      return value => {
        gl.uniform1fv(location, value);
      };
    }

    if (type === gl.FLOAT) {
      return v0 => {
        gl.uniform1f(location, v0);
      };
    }

    if (type === gl.FLOAT_VEC2) {
      return value => {
        gl.uniform2fv(location, value);
      };
    }

    if (type === gl.FLOAT_VEC3) {
      return value => {
        gl.uniform3fv(location, value);
      };
    }

    if (type === gl.FLOAT_VEC4) {
      return value => {
        gl.uniform4fv(location, value);
      };
    }

    if (type === gl.INT && isArray) {
      return value => {
        gl.uniform1iv(location, value);
      };
    }

    if (type === gl.INT) {
      return v0 => {
        gl.uniform1i(location, v0);
      };
    }

    if (type === gl.INT_VEC2) {
      return value => {
        gl.uniform2iv(location, value);
      };
    }

    if (type === gl.INT_VEC3) {
      return value => {
        gl.uniform3iv(location, value);
      };
    }

    if (type === gl.INT_VEC4) {
      return value => {
        gl.uniform4iv(location, value);
      };
    }

    if (type === gl.BOOL) {
      return value => {
        gl.uniform1iv(location, value);
      };
    }

    if (type === gl.BOOL_VEC2) {
      return value => {
        gl.uniform2iv(location, value);
      };
    }

    if (type === gl.BOOL_VEC3) {
      return value => {
        gl.uniform3iv(location, value);
      };
    }

    if (type === gl.BOOL_VEC4) {
      return value => {
        gl.uniform4iv(location, value);
      };
    }

    if (type === gl.FLOAT_MAT2) {
      return value => {
        gl.uniformMatrix2fv(location, false, value);
      };
    }

    if (type === gl.FLOAT_MAT3) {
      return value => {
        gl.uniformMatrix3fv(location, false, value);
      };
    }

    if (type === gl.FLOAT_MAT4) {
      return value => {
        gl.uniformMatrix4fv(location, false, value);
      };
    }

    if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
      const units = [];
      for (let ii = 0; ii < uniformInfo.size; ++ii) {
        units.push(textureUnit++);
      }
      return ((bindPoint, units) => {
        return textures => {
          gl.uniform1iv(location, units);
          textures.forEach((texture, index) => {
            gl.activeTexture(gl.TEXTURE0 + units[index]);
            gl.bindTexture(bindPoint, texture);
          });
        };
      })(getBindPointForSamplerType(gl, type), units);
    }

    if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
      return ((bindPoint, unit) => {
        return texture => {
          gl.uniform1i(location, unit);
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(bindPoint, texture);
        };
      })(getBindPointForSamplerType(gl, type), textureUnit++);
    }

    throw ('unknown type: 0x' + type.toString(16)); // we should never get here.
  };

  const uniformSetters = {};
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (let ii = 0; ii < numUniforms; ++ii) {
    const uniformInfo = gl.getActiveUniform(program, ii);

    if (!uniformInfo) {
      break;
    }
    let name = uniformInfo.name;
    // remove the array suffix.
    if (name.substr(-3) === '[0]') {
      name = name.substr(0, name.length - 3);
    }
    const setter = createUniformSetter(program, uniformInfo);
    uniformSetters[name] = setter;
  }
  return uniformSetters;
}

export function createVAOAndSetAttributes(gl, setters, attribs, indices) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  setAttributes(setters, attribs);
  if (indices) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  }
  // We unbind this because otherwise any change to ELEMENT_ARRAY_BUFFER
  // like when creating buffers for other stuff will mess up this VAO's binding
  gl.bindVertexArray(null);
  return vao;
}

export function createVAOFromBufferInfo(gl, programInfo, bufferInfo) {
  return createVAOAndSetAttributes(gl, programInfo.attribSetters || programInfo, bufferInfo.attribs, bufferInfo.indices);
}

export function createBufferInfoFromArrays(gl, arrays, opt_mapping) {
  const bufferInfo = {
    attribs: createAttribsFromArrays(gl, arrays, opt_mapping),
  };
  let indices = arrays.indices;
  if (indices) {
    indices = makeTypedArray(indices, 'indices');
    bufferInfo.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
    bufferInfo.numElements = indices.length;
  } else {
    bufferInfo.numElements = getNumElementsFromNonIndexedArrays(arrays);
  }

  return bufferInfo;
}

export function createBuffersFromArrays(gl, arrays) {
  const buffers = { };
  Object.keys(arrays).forEach(function(key) {
    const type = key === 'indices' ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    const array = makeTypedArray(arrays[key], name);
    buffers[key] = createBufferFromTypedArray(gl, array, type);
  });

  // hrm
  if (arrays.indices) {
    buffers.numElements = arrays.indices.length;
  } else if (arrays.position) {
    buffers.numElements = arrays.position.length / 3;
  }

  return buffers;
}

export function drawBufferInfo(gl, bufferInfo, primitiveType, count, offset) {
  const indices = bufferInfo.indices;
  primitiveType = primitiveType === undefined ? gl.TRIANGLES : primitiveType;
  const numElements = count === undefined ? bufferInfo.numElements : count;
  offset = offset === undefined ? 0 : offset;
  if (indices) {
    gl.drawElements(primitiveType, numElements, gl.UNSIGNED_SHORT, offset);
  } else {
    gl.drawArrays(primitiveType, offset, numElements);
  }
}

export function drawObjectList(gl, objectsToDraw) {
  let lastUsedProgramInfo = null;
  let lastUsedBufferInfo = null;

  objectsToDraw.forEach(function(object) {
    const programInfo = object.programInfo;
    const bufferInfo = object.bufferInfo;
    let bindBuffers = false;

    if (programInfo !== lastUsedProgramInfo) {
      lastUsedProgramInfo = programInfo;
      gl.useProgram(programInfo.program);
      bindBuffers = true;
    }

    // Setup all the needed attributes.
    if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
      lastUsedBufferInfo = bufferInfo;
      setBuffersAndAttributes(gl, programInfo.attribSetters, bufferInfo);
    }

    // Set the uniforms.
    setUniforms(programInfo.uniformSetters, object.uniforms);

    // Draw
    drawBufferInfo(gl, bufferInfo);
  });
}

export function glEnumToString(gl, v) {
  const results = [];
  for (const key in gl) {
    if (gl[key] === v) {
      results.push(key);
    }
  }
  return results.length
    ? results.join(' | ')
    : `0x${v.toString(16)}`;
}

const isIE = /*@cc_on!@*/false || !!document.documentMode;
// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;
if (isEdge) {
  // Hack for Edge. Edge's WebGL implmentation is crap still and so they
  // only respond to "experimental-webgl". I don't want to clutter the
  // examples with that so his hack works around it
  HTMLCanvasElement.prototype.getContext = function(origFn) {
    return function() {
      let args = arguments;
      const type = args[0];
      if (type === 'webgl') {
        args = [].slice.call(arguments);
        args[0] = 'experimental-webgl';
      }
      return origFn.apply(this, args);
    };
  }(HTMLCanvasElement.prototype.getContext);
}

// Add your prefix here.
const browserPrefixes = [
  '',
  'MOZ_',
  'OP_',
  'WEBKIT_',
];

export function getExtensionWithKnownPrefixes(gl, name) {
  for (let ii = 0; ii < browserPrefixes.length; ++ii) {
    const prefixedName = browserPrefixes[ii] + name;
    const ext = gl.getExtension(prefixedName);
    if (ext) {
      return ext;
    }
  }
  return undefined;
}

// Add `push` to a typed array. It just keeps a 'cursor'
// and allows use to `push` values into the array so we
// don't have to manually compute offsets
function augmentTypedArray(typedArray, numComponents) {
  let cursor = 0;
  typedArray.push = function () {
    for (let ii = 0; ii < arguments.length; ++ii) {
      const value = arguments[ii];
      if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
        for (let jj = 0; jj < value.length; ++jj) {
          typedArray[cursor++] = value[jj];
        }
      } else {
        typedArray[cursor++] = value;
      }
    }
  };
  typedArray.reset = function (opt_index) {
    cursor = opt_index || 0;
  };
  typedArray.numComponents = numComponents;
  Object.defineProperty(typedArray, 'numElements', {
    get: function () {
      return this.length / this.numComponents | 0;
    },
  });
  return typedArray;
}

export function createAugmentedTypedArray(numComponents, numElements, opt_type) {
  const Type = opt_type || Float32Array;
  return augmentTypedArray(new Type(numComponents * numElements), numComponents);
}

function createBufferFromTypedArray(gl, array, type, drawType) {
  type = type || gl.ARRAY_BUFFER;
  const buffer = gl.createBuffer();
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, array, drawType || gl.STATIC_DRAW);
  return buffer;
}

function allButIndices(name) {
  return name !== 'indices';
}

function createMapping(obj) {
  const mapping = {};
  Object.keys(obj).filter(allButIndices).forEach(key => {
    mapping['a_' + key] = key;
  });
  return mapping;
}

function getGLTypeForTypedArray(gl, typedArray) {
  if (typedArray instanceof Int8Array) {
    return gl.BYTE;
  }
  if (typedArray instanceof Uint8Array) {
    return gl.UNSIGNED_BYTE;
  }
  if (typedArray instanceof Int16Array) {
    return gl.SHORT;
  }
  if (typedArray instanceof Uint16Array) {
    return gl.UNSIGNED_SHORT;
  }
  if (typedArray instanceof Int32Array) {
    return gl.INT;
  }
  if (typedArray instanceof Uint32Array) {
    return gl.UNSIGNED_INT;
  }
  if (typedArray instanceof Float32Array) {
    return gl.FLOAT;
  }

  throw 'unsupported typed array type';
}

// This is really just a guess. Though I can't really imagine using
// anything else? Maybe for some compression?
function getNormalizationForTypedArray(typedArray) {
  if (typedArray instanceof Int8Array) {
    return true;
  }
  if (typedArray instanceof Uint8Array) {
    return true;
  }
  return false;
}

function isArrayBuffer(a) {
  return a.buffer && a.buffer instanceof ArrayBuffer;
}

const texcoordRE = /coord|texture/i;
const colorRE = /color|colour/i;

function guessNumComponentsFromName(name, length) {
  let numComponents;
  if (texcoordRE.test(name)) {
    numComponents = 2;
  } else if (colorRE.test(name)) {
    numComponents = 4;
  } else {
    numComponents = 3;  // position, normals, indices ...
  }

  if (length % numComponents > 0) {
    throw new Error(`Can not guess numComponents for attribute '${name}'. Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}. You should specify it.`);
  }

  return numComponents;
}

function makeTypedArray(array, name) {
  if (isArrayBuffer(array)) {
    return array;
  }

  if (array.data && isArrayBuffer(array.data)) {
    return array.data;
  }

  if (Array.isArray(array)) {
    array = {
      data: array,
    };
  }

  if (!array.numComponents) {
    array.numComponents = guessNumComponentsFromName(name, array.length);
  }

  let type = array.type;
  if (!type) {
    if (name === 'indices') {
      type = Uint16Array;
    }
  }

  const typedArray = createAugmentedTypedArray(array.numComponents, array.data.length / array.numComponents | 0, type);
  typedArray.push(array.data);
  return typedArray;
}

export function createAttribsFromArrays(gl, arrays, opt_mapping) {
  const mapping = opt_mapping || createMapping(arrays);
  const attribs = {};
  Object.keys(mapping).forEach(function (attribName) {
    const bufferName = mapping[attribName];
    const origArray = arrays[bufferName];
    if (origArray.value) {
      attribs[attribName] = {
        value: origArray.value,
      };
    } else {
      const array = makeTypedArray(origArray, bufferName);
      attribs[attribName] = {
        buffer: createBufferFromTypedArray(gl, array),
        numComponents: origArray.numComponents || array.numComponents || guessNumComponentsFromName(bufferName),
        type: getGLTypeForTypedArray(gl, array),
        normalize: getNormalizationForTypedArray(array),
      };
    }
  });
  return attribs;
}

function getArray(array) {
  return array.length ? array : array.data;
}

function getNumComponents(array, arrayName) {
  return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
}

// Tries to get the number of elements from a set of arrays.
const positionKeys = ['position', 'positions', 'a_position'];
function getNumElementsFromNonIndexedArrays(arrays) {
  let key;
  for (const k of positionKeys) {
    if (k in arrays) {
      key = k;
      break;
    }
  }
  key = key || Object.keys(arrays)[0];
  const array = arrays[key];
  const length = getArray(array).length;
  const numComponents = getNumComponents(array, key);
  const numElements = length / numComponents;
  if (length % numComponents > 0) {
    throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
  }
  return numElements;
}

export function setBuffersAndAttributes(gl, setters, buffers) {
  setAttributes(setters, buffers.attribs);
  if (buffers.indices) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  }
}

export function createProgramInfo(gl, vsSource, fsSource, onError) {
  const program = createProgramFromSources(gl, vsSource, fsSource, onError);
  if (!program) {
    return null;
  }

  const uniformSetters = createUniformSetters(gl, program);
  const attribSetters = createAttributeSetters(gl, program);

  return {
    program: program,
    uniformSetters: uniformSetters,
    attribSetters: attribSetters,
  };
}

export function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width = canvas.clientWidth * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}




// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

varying vec3 v_normal;

// all shaders have a main function
void main() {
    gl_Position = u_worldViewProjection * a_position;

    // orient the normals and pass to the fragment shader
    v_normal = mat3(u_worldInverseTranspose) * a_normal;
}
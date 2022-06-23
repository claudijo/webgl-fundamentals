// an attribute will receive data from a buffer
attribute vec4 a_position;
uniform mat4 u_worldViewProjection;

// all shaders have a main function
void main() {
    gl_Position = u_worldViewProjection * a_position;
}
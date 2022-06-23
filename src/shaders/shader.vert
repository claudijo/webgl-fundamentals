// an attribute will receive data from a buffer
attribute vec4 a_position;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_model;

// all shaders have a main function
void main() {
    mat4 mvpMatrix = u_projection * u_view * u_model;
    gl_Position = mvpMatrix * a_position;
}
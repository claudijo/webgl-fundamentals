// an attribute will receive data from a buffer
attribute vec4 a_position;
uniform vec2 u_resolution;

// all shaders have a main function
void main() {

    vec2 xy = a_position.xy / u_resolution;
    gl_Position = vec4(xy, 0, 1);

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
//    gl_Position = a_position;
}
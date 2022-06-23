// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

varying vec3 v_normal;

void main() {
    // because v_normal is a varying it's interpolated
    // so it will not be a unit vector. Normalizing it
    // will make it a unit vector again
    vec3 normal = normalize(v_normal);

    float light = dot(normal, u_reverseLightDirection);

    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = u_color;

    // Lets multiply just the color portion (not the alpha)
    // by the light
    gl_FragColor.rgb *= light;
}
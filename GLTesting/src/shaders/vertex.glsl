attribute vec2 aPosition;
uniform mediump float uTime;
//uniform mat4 uViewMatrix; // Add a uniform for the view matrix
//varying vec3 vFragPos;
void main() {
    //vFragPos = aPosition;
    vec3 pos = vec3(aPosition, 0.0);

    //pos.z += sin(uTime);
//uViewMatrix * 
    vec4 viewPos = vec4(pos, 1.0); // Apply the view matrix transformation
    gl_Position = viewPos;
}
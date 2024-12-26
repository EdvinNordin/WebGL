//const mat4 = glMatrix.mat4;

// Get the canvas element and set up WebGL context
const canvas = document.getElementById("webglCanvas");
const gl = canvas.getContext("webgl");

// Set canvas size to match the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// Clear canvas with a black background
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Function to load a shader file
async function loadShaderFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader file: ${url}`);
    }
    return response.text();
}

// Compile shader
function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
/*
function createViewMatrix() {
    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, [0, 0, -5]); // Translate the view 5 units back
    return viewMatrix;
}*/

// Initialize WebGL program
async function initWebGL() {
    // Load shaders
    const vertexShaderSource = await loadShaderFile("src/shaders/vertex.glsl");
    const fragmentShaderSource = await loadShaderFile("src/shaders/fragment.glsl");

    // Create shaders
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create and link the program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);

    // Define the triangle vertices
    const vertices = new Float32Array([
        -1.0,  1.0,  // Top vertex
       -1.0, -1.0,  // Bottom-left vertex
        1.0, 1.0,   // Bottom-right vertex

        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0
    ]);

    // Create a buffer and bind the data
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Link the buffer to the shader attribute
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Get the uniform location for `uTime`
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const resolution = gl.getUniformLocation(program, "resolution");

    // Get the uniform location for `uViewMatrix`
    /*const viewMatrixLocation = gl.getUniformLocation(program, "uViewMatrix");

    // Create the view matrix
    const viewMatrix = createViewMatrix();

    // Pass the view matrix to the shader
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
*/
    // Render loop
    function render(time) {
        // Convert time from milliseconds to seconds and pass it to the shader
        gl.uniform1f(timeLocation, time * 0.001);
        gl.uniform2f(resolution, canvas.width, canvas.height);

        // Pass the view matrix to the shader (in case it changes over time)
        //gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);

        // Clear and draw
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Request the next frame
        requestAnimationFrame(render);
    }

    // Start the render loop
    requestAnimationFrame(render);
}

// Initialize WebGL
initWebGL().catch(err => console.error(err));
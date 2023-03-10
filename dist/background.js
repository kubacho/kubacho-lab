


var fragCode = `

#ifdef GL_ES
    precision highp float;
#endif


uniform float time;
uniform float pageScroll;

varying vec2 uv;

void main(void) 
{
    float f = .0;

    f = fract(pageScroll);

    gl_FragColor = vec4(f,f,f, 1);
}

`;




var vertCode = `

    attribute vec3 vertexPos;
    attribute vec2 vertexUV;
    varying   vec2 uv;

    void main(void) 
    {
        gl_Position = vec4(vertexPos, 1);
        uv = vec2(vertexUV.x, 1.0 - vertexUV.y);
    }

`;




var canvas = document.getElementById('backgroundCanvas');
var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");





const program = gl.createProgram();

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertCode);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragCode);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);
gl.useProgram(program);






var vertices = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
var uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);

var vertexPosLoc = gl.getAttribLocation(program, "vertexPos");
gl.enableVertexAttribArray(vertexPosLoc);

var vertexUVLoc = gl.getAttribLocation(program, "vertexUV");
gl.enableVertexAttribArray(vertexUVLoc);

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + uvs.byteLength, gl.STATIC_DRAW);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, uvs);
gl.vertexAttribPointer(vertexPosLoc, 3, gl.FLOAT, gl.FALSE, 0, 0);
gl.vertexAttribPointer(vertexUVLoc, 2, gl.FLOAT, gl.FALSE, 0, vertices.byteLength);


var startTime = new Date().getTime();


Update();




function Update() {

    gl.uniform1f(gl.getUniformLocation(program, "time"), (startTime - new Date().getTime()) / 1000);
    gl.uniform1f(gl.getUniformLocation(program, "pageScroll"), (document.documentElement.scrollTop || document.body.scrollTop) / window.innerHeight);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();


    requestAnimationFrame(Update);
}

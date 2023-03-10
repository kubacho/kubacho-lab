


var fragCode = `

void main(void) 
{
    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.1);
}
`;




var vertCode = `

    attribute vec3 aPos;
    attribute vec2 aTexCoord;
    varying   vec2 pixel;

    void main(void) 
    {
        gl_Position = vec4(aPos, 1.);
        pixel = aTexCoord;
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
var texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);

// gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());



var aPosLoc = gl.getAttribLocation(program, "aPos");
gl.enableVertexAttribArray(aPosLoc);

var aTexLoc = gl.getAttribLocation(program, "aTexCoord");
gl.enableVertexAttribArray(aTexLoc);

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + texCoords.byteLength, gl.STATIC_DRAW);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, texCoords);
gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, gl.FALSE, 0, 0);
gl.vertexAttribPointer(aTexLoc, 2, gl.FLOAT, gl.FALSE, 0, vertices.byteLength);







gl.clearColor(0, 1, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.drawArrays(gl.TRIANGLES, 0, 3);





Update();

function Update() {


    requestAnimationFrame(Update);
}

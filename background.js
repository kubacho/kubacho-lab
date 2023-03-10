


var fragCode = `

#ifdef GL_ES
    precision highp float;
#endif


const float scale = 1.5;
const float parallax = 2.0;

const float speed = .1;
const float dim = 3.0;
const mat2 rotation = mat2( 0.80,  0.60, -0.60,  0.80 );


uniform float time;
uniform float scaleX;
uniform float scaleY;
uniform float pageScroll;
varying vec2 uv;



float random01(vec2 uv) { return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453); }
float smoothstep(float f) { return f*f*(3.0-2.0*f); }
vec2 smoothstep(vec2 f) { return f*f*(3.0-2.0*f); }

float perlin(vec2 p) 
{
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = smoothstep(u);

    float f = mix(
        mix(random01(ip),random01(ip+vec2(1.0,0.0)),u.x),
        mix(random01(ip+vec2(0.0,1.0)),random01(ip+vec2(1.0,1.0)),u.x)
        ,u.y);

    return f*f;
}

float fractal(vec2 uv)
{
    float f = 0.0;

    f += 0.500000 * perlin(uv + time*speed); 
    uv = rotation * uv * 2.0;

    f += 0.031250 * perlin(uv);
    uv = rotation * uv * 2.0;

    f += 0.250000 * perlin(uv); 
    uv = rotation * uv * 2.0;

    f += 0.125000 * perlin(uv);
    uv = rotation * uv * 2.0;

    f += 0.062500 * perlin(uv); 
    uv = rotation * uv * 2.0;
    
    f += 0.015625 * perlin(uv + sin(time*speed));//

    f*=1.1;

    return f;
}


void main(void) 
{

    vec2 uvTransformed = (uv+ vec2(0, pageScroll/parallax)) * vec2(scaleX, scaleY) * scale;



    float f = 0.0;

    f = fractal(uvTransformed + f);
    f = fractal(uvTransformed + f);
    f = fractal(uvTransformed + f);


    f = 1.0-f;

    for(int i = 0; i < 4; i++)
        if(pageScroll < float(i))
            f = 1.0-f;

         if(uv.y < 1.0-fract(pageScroll))
             f = 1.0-f;



    f *= uv.x;

    f /= dim;
    f /= dim/2.0;


    f = .1 + f;

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
    gl.uniform1f(gl.getUniformLocation(program, "scaleX"), (window.innerWidth + window.innerHeight) / 2 / window.innerHeight);
    gl.uniform1f(gl.getUniformLocation(program, "scaleY"), (window.innerWidth + window.innerHeight) / 2 / window.innerWidth);
    gl.viewport(0, 0, canvas.width, canvas.height);


    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();


    requestAnimationFrame(Update);
}

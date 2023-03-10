#ifdef GL_ES
precision mediump float;
#endif


const float panes = 4.0;
const float scale = 1.0;
const float speed = .5;
const float dim = 4.0;
const mat2 rotation = mat2( 0.80,  0.60, -0.60,  0.80 );


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;



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

    f += 0.500000 * perlin(uv + u_time*speed); 
    uv = rotation * uv * 2.0;

    f += 0.031250 * perlin(uv);
    uv = rotation * uv * 2.0;

    f += 0.250000 * perlin(uv); 
    uv = rotation * uv * 2.0;

    f += 0.125000 * perlin(uv);
    uv = rotation * uv * 2.0;

    f += 0.062500 * perlin(uv); 
    uv = rotation * uv * 2.0;
    
    f += 0.015625 * perlin(uv + sin(u_time*speed));//

    f*=1.1;

    return f;
}


void main() 
{
    vec2 uv = (vec2(0, u_resolution.y)- gl_FragCoord.xy)/u_resolution.x;
    float uvPane = (u_resolution.y- gl_FragCoord.y)/u_resolution.y * panes;

uv *= scale;

    float f = 0.0;
    f = fractal(uv + f);
    f = fractal(uv + f);
    f = fractal(uv + f);
    f = fractal(uv + f);
    f = fractal(uv + f);
    f = fractal(uv + f);
    f = fractal(uv + f);
    f = fractal(uv + f);   


    for(float i = 1.0; i < panes; i++)
        if(uvPane > i)
            f = 1.0-f;

    f /= dim;

    gl_FragColor = vec4(f,f,f,1.0);

}
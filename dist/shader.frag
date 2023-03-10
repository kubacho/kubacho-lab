#ifdef GL_ES
precision mediump float;
#endif


const float panes = 4.0;
const float scale = 1.0;
const float dim = 8.0;


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;



const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float noise( in vec2 p ) { return sin(p.x)*sin(p.y); }

float fbm4( vec2 p )
{
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}

float fbm6( vec2 p )
{
    float f = 0.0;
    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
    f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
    f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.015625*(0.5+0.5*noise( p ));
    return f/0.96875;
}

vec2 fbm4_2( vec2 p )
{
    return vec2(fbm4(p), fbm4(p+vec2(7.8)));
}

vec2 fbm6_2( vec2 p )
{
    return vec2(fbm6(p+vec2(16.8)), fbm6(p+vec2(11.5)));
}


float func( vec2 q, out vec4 ron )
{
    q += 0.03*sin( vec2(0.27,0.23)*u_time + length(q)*vec2(4.1,4.3));

	vec2 o = fbm4_2( 0.9*q );

    o += 0.04*sin( vec2(0.12,0.14)*u_time + length(o));

    vec2 n = fbm6_2( 3.0*o );

	ron = vec4( o, n );

    float f = 0.5 + 0.5*fbm4( 1.8*q + 6.0*n );

    return mix( f, f*f*f*3.5, f*abs(n.x) );
}




void main() 
{
    


    vec2 p = gl_FragCoord.xy/u_resolution.xy*vec2(1.0, 4.0)*1.5;
    float e = 2.0/u_resolution.y;

    vec4 on = vec4(0.0);
    float f = func(p, on);



float f2 = on.b;

f = mix(f, f2, .5);
if(p.y>1.333)
f = 1.0-f;


for(float i = 0.0; i < panes; i++) 
if(f > i/panes)
f = 1.0-f;

f /= dim;





    gl_FragColor = vec4(f,f,f,1.0);
}
#version 140

varying vec3 vColor;
uniform highp float[15] coeffs;
uniform highp vec2 resolution;
uniform highp vec2 offset;
uniform highp vec2 zoom;
uniform int steps;
uniform highp float seed;
uniform int lenCoeffs;

const highp float M_PI = 3.14159265358979323846;

highp float rand(highp vec2 co) {return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}
highp float rand(highp vec2 co, highp float l) {return rand(vec2(rand(co), l));}
highp float rand(highp vec2 co, highp float l, highp float t) {return rand(vec2(rand(co, l), t));}

highp float perlin(highp vec2 p, highp float dim, highp float time) {
  highp vec2 pos = floor(p * dim);
  highp vec2 posx = pos + vec2(1.0, 0.0);
  highp vec2 posy = pos + vec2(0.0, 1.0);
  highp vec2 posxy = pos + vec2(1.0);

  highp float c = rand(pos, dim, time);
  highp float cx = rand(posx, dim, time);
  highp float cy = rand(posy, dim, time);
  highp float cxy = rand(posxy, dim, time);

  highp vec2 d = fract(p * dim);
  d = -0.5 * cos(d * M_PI) + 0.5;

  highp float ccx = mix(c, cx, d.x);
  highp float cycxy = mix(cy, cxy, d.x);
  highp float center = mix(ccx, cycxy, d.y);

  return center * 2.0 - 1.0;
}

highp float perlin(highp vec2 p, highp float dim) {
  return perlin(p, dim, 0.0);
}

highp vec3 hsv2rgb(highp vec3 c)
{
    highp vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    highp vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

highp vec2 div(highp vec2 x, highp vec2 y) {
  return vec2(x.x*y.x+y.y*x.y, y.x*x.y-x.x*y.y)/(y.x*y.x+y.y*y.y);
}

highp vec2 mul(highp vec2 x, highp vec2 y) {
  return vec2(x.x*y.x - x.y*y.y, x.y*y.x + x.x*y.y);
}

highp float abs(highp vec2 a) {
  return sqrt(a.x*a.x+a.y*a.y);
}

highp vec2 computeStep(highp vec2 z, highp vec2 c) {
  return mul(z, z)+c;
}

void main(void)
{
  highp vec2 xy = (vec2(float(gl_FragCoord.x), float(gl_FragCoord.y))/resolution-vec2(0.5, 0.5))/zoom+offset;
  highp vec2 z = vec2(0.0, 0.0);
  int threshold = int(seed*1000);
  int overflow = steps;
  for(int i = 0; i < steps; ++i) {
    z = computeStep(z, xy);
    if(abs(z) > threshold) {
      overflow = i;
      break;
    }
  }
  float col = 1. - float(overflow)/float(steps);
  gl_FragColor.rgb = vec3(col, col, col);
}

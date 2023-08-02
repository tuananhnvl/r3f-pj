const fragBgNoise = `
uniform float uTime;
uniform float noiseScale;
uniform float noiseStrength;
uniform vec3 backgroundColor;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
      mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
      u.y
  );
}


void main() {
    vec2 uvNoise = vec2(gl_FragCoord.xy );
    float noiseValue = noise(uvNoise + 1.5) * 0.08;
 // noiseValue -=0.02;
    vec4 color = vec4(vec3(noiseValue), 1.0);
   
    // Calculate the distance from black
  //  float dist = length(color.rgb - vec3(0.0));

    // Use a smoothstep function to interpolate between 0 and 1 based on the distance from black
  //  float alpha = smoothstep(0.001, 0.1, dist);
    //step old
    float alpha = step(0.06, length(color.rgb)); 
    gl_FragColor = vec4(color.rgb,alpha);
}

` 

export default fragBgNoise






/* 



#define GLSLIFY 1
// #pragma glslify: snoise = require(glsl-noise/simplex/2d)\n
uniform vec3 colorB;\n
uniform vec3 colorW;\n
uniform vec2 resolution;\n
uniform float alpha;\n
uniform float alpha2;\n
uniform float time;\n
uniform float random;\n
uniform float mabiku;\n
uniform float radius;\n
uniform float rate;\n
varying float vNoise;\n
float rand (vec2 st, float r) {    
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123 * r);}\n
  void main(void) {  
    vec3 dest = mix(colorB, colorW, rate);
      vec2 st = gl_FragCoord.xy / resolution.xy;
        float rnd = rand(st, vNoise);
          rnd *= step(mabiku, rnd);
            float len = length(gl_FragCoord.xy - vec2(resolution.x * 0.5, resolution.y * 0.5));
              rnd += (max(0.0, (radius - len)) / radius) * 0.5;
                float alpha3 = mix(alpha, -alpha, rate);
                  dest += rnd * alpha3;
                    gl_FragColor = vec4(dest, 1.0 * alpha2);}



 */

















/* 
const fragBgNoise = `
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
void main() {
    float f = 0.0;
  
    f = snoise(vec2(gl_FragCoord.x*float(20.0),gl_FragCoord.y*float(50.0)));
    vec4 finalNosie = vec4(f,f,f,1.0);
  
    gl_FragColor = finalNosie;
   // gl_FragColor = mix(finalNosie,vec4(0.0,0.0,0.0,0.7),0.8);
  }
`

export default fragBgNoise */




/* const vertexShader = `

uniform float uTime;
uniform float uRandom;
varying vec2 vUv;
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
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  
 float f = 0.0;
 f = snoise(vec2(modelPosition.x/float(4), modelPosition.y/float(5.)));

  modelPosition.y += sin(modelPosition.y  * 2.0 + uTime  * 2.0  )  * f  ;

  // Uncomment the code and hit the refresh button below for a more complex effect 🪄
// modelPosition.z += sin(modelPosition.x * 2.0 + uTime * 2.0) * 0.1;



  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}

`

export default vertexShader */

const vertexLine = `

uniform float uTime;
uniform float uRandom;
uniform float uRandomTo1;
uniform float uRandomTimePart;
uniform float uScroll;
varying vec2 vUv;

float noise(vec2 p) {
	return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 456367.5453);
}
float random (vec2 st) {
  return fract(sin(dot(st.xy,
                       vec2(12.9898,78.233)))*
      43758.5453123);
}

void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0); 
  float f = 0.0;
  f = noise(vec2(modelPosition.x, modelPosition.y));

        // modelPosition.y += sin(modelPosition.y  * 2.0 + uTime   )  * f  ;
          // Uncomment the code and hit the refresh button below for a more complex effect 🪄
        //modelPosition.x += sin(modelPosition.x * float(3.0 + uRandom) + uTime * 2.0) * float(f+ 0.38);
        //modelPosition.x += cos(modelPosition.x + uTime ) * uRandomTo1;


  modelPosition.x  += sin(modelPosition.x    + uTime ) * (uRandomTo1);
  modelPosition.z  += cos(modelPosition.x   + uTime ) * (uRandomTo1);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

}

`

export default vertexLine
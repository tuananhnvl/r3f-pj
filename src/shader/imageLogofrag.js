const imageLogofrag = `
uniform sampler2D uTexture1;

varying vec2 vUv;
varying float vZ;
void main() {
 // vec4 color = mix(texture2D(uTexture1, vUv), vec4(0.0,0.0,0.0,0.0), 1.0 ); 
  gl_FragColor = texture2D(uTexture1, vUv);

 // gl_FragColor = textureImage1;
  }
`

export default imageLogofrag
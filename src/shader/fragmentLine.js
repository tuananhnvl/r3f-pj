const fragmentLine = `
uniform float uRandomColor;
varying vec2 vUv;

void main() {
  float finalC = 0.0;
  finalC = uRandomColor;
    gl_FragColor = vec4(finalC,finalC, finalC, 1.0);
  }
`

export default fragmentLine
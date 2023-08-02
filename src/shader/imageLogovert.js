const imageLogovert = `
varying vec2 vUv;
varying float vZ;
uniform float uTime;
void main(){  
    vUv = uv;  
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
    

  
  // modelPosition.z += sin(vUv.x * 7.0  + uTime*2.0) * 0.6  ;
    //modelPosition.y += sin(vUv.x * 2.0  + uTime ) * 0.6  ;
    // Uncomment the code and hit the refresh button below for a more complex effect 🪄
  modelPosition.x += sin(vUv.x* 10.0 + uTime ) * 0.2;
  // vZ= modelPosition.z;
  
  
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
  
    gl_Position = projectedPosition;
}


`

export default imageLogovert





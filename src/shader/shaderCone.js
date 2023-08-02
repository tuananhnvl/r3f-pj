
export const vertexShader = `
attribute vec3 dog_pos;
attribute vec3 brain_pos;
attribute vec3 bud_pos;
uniform float u_time;
uniform vec3 uMouse;
uniform float uScroll;  // Scroll value from 0 to 1
varying vec3 v_pos;
varying vec3 v_normal;

float getRandomDelay(float index) {
  float seed = index;           // Use a unique seed for each instance
  float delayAmount = 0.5;      // Adjust this to control the delay amount

  // Use a pseudo-random function based on the instance's seed
  float randomValue = fract(sin(seed) * 43758.5453);
  return randomValue * delayAmount ;
}

void main() {
  float scaleObjDog = 7.2;
  float scaleObjBrain = 0.22;
  float scaleObjBud = 0.52;
  float index = float(gl_InstanceID);  // Convert gl_InstanceID to float
  float delay = getRandomDelay(index);
  float normalizedScroll = smoothstep(delay, 1.0, uScroll); // Apply delay to scroll value

  vec3 dog_posNew = vec3(dog_pos.x - 0.1, dog_pos.y, dog_pos.z) * scaleObjDog;
  vec3 brain_posNew = vec3(brain_pos.x, brain_pos.y, brain_pos.z) * scaleObjBrain;
  vec3 bud_posNew = vec3(bud_pos.x, bud_pos.y - 7.0, bud_pos.z) * scaleObjBud;

  // Define the spiral variables
  float spiralRadius = 0.5;   // Adjust this to control the radius of the spiral

  float angle = normalizedScroll * 2.0 * 3.14159  ;
  float spiralOffset = spiralRadius * angle;

  vec3 interpolatedPos;
  interpolatedPos = mix(dog_posNew, bud_posNew, normalizedScroll );

  interpolatedPos.x += spiralOffset * cos(angle );
  interpolatedPos.y += spiralOffset * sin(angle) ;
  interpolatedPos.z += spiralOffset / float(5.0);

  vec3 position = position + interpolatedPos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


`
/* 

void main() {
  float scaleObjDog = 7.2;
  float scaleObjBrain = 0.22;
  float scaleObjBud = 0.52;
  float index = float(gl_InstanceID);  // Convert gl_InstanceID to float
  float delay = getRandomDelay(index);
  float normalizedScroll = smoothstep(delay, 1.0, uScroll); // Apply delay to scroll value

  vec3 dog_posNew = vec3(dog_pos.x - 0.1, dog_pos.y, dog_pos.z) * scaleObjDog;
  vec3 brain_posNew = vec3(brain_pos.x, brain_pos.y, brain_pos.z) * scaleObjBrain;
  vec3 bud_posNew = vec3(bud_pos.x + 6.0, bud_pos.y - 7.0, bud_pos.z) * scaleObjBud;

  // Define the spiral variables
  float spiralRadius = 1.0;   // Adjust this to control the radius of the spiral
  float spiralFrequency = 1.5;  // Adjust this to control the frequency of the spiral

  vec3 interpolatedPos;
  if (normalizedScroll < 0.5) {
    interpolatedPos = mix(dog_posNew, bud_posNew, normalizedScroll * 2.0);
  } else if (normalizedScroll > 0.5 && normalizedScroll < 0.7) {
    interpolatedPos = mix(bud_posNew, brain_posNew, 0.0);
  } else {
    interpolatedPos = mix(bud_posNew, dog_posNew, (normalizedScroll - 0.7) * 3.3);
  }

  // Apply the spiral offset to the x and y components of interpolatedPos
  // Apply the spiral effect only when necessary
  if (normalizedScroll < 0.5 || normalizedScroll > 0.7) {
    // Calculate the angle based on the normalizedScroll
    float angle = normalizedScroll * 2.0 * 3.14159  * spiralFrequency;;

    // Calculate the spiral offset based on the angle
    float spiralOffset = spiralRadius * angle;

    // Apply the spiral offset to the x and y components of interpolatedPos
    interpolatedPos.x += spiralOffset * cos(angle) ;
    interpolatedPos.z += spiralOffset * sin(angle) ;
  }

  vec3 position = position + interpolatedPos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
*/
/* 
//// USE INSTANCE MATRIX 
vec3 pos = position.xyz;
  vec4 globalPosition = instanceMatrix * vec4(pos, 1.0);
  vec4 mPos = modelMatrix * globalPosition;
  //////////////
  // Normalize mPos.xyz and uMouse to the range of -1 to 1
  vec3 normalizedmPos = mPos.xyz / max(abs(mPos.x), max(abs(mPos.y), abs(mPos.z)));
  //////////////

  // Calculate the distance between the instance position and uMouse
  float distance = distance( mPos.xyz, uMouse);

  // Calculate the smoothstep factor based on the hover distance
  float smoothFactor = smoothstep(1.0, 0.0, distance);

  // Calculate the displacement vector
  vec3 direction = normalize(mPos.xyz - uMouse);
  vec3 displacement = direction * smoothFactor;
  
  // Apply the displacement to the position
  vec3 displacedPosition = mPos.xyz + displacement;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);  // Set the final position
  v_pos = displacedPosition;
*/
/* vec2 direction = normalize(vec2(uMouse.x,uMouse.y) - vec2(globalPosition.x,globalPosition.y) );
float distance = length(vec2(uMouse.x,uMouse.y)-vec2(globalPosition.x,globalPosition.y));
float rotationAmount = smoothstep(0.42, 0.0, distance); 
vec2 newPosition = mPos.xy + (rotationAmount );
vec3 position = vec3(mPos.x, mPos.y, mPos.z + rotationAmount); */
export const fragmentShader = `
    uniform vec3 u_light;
    uniform sampler2D uTexture;
    varying vec3 v_pos;
    varying vec3 v_normal;
   
    void main() {
        vec3 color = vec3(0.8);

        vec3 fromLight = v_pos - u_light;
        float d = 1.0 - (dot(v_normal, normalize(fromLight)) + 1.0) * 0.5; // 0 ~ 1
        color *= smoothstep(0.5, 0.8, d);
        vec4 final;
        if(v_pos.z < 2.6) {
          final = vec4(vec3(0.1,0.0,1.0), 0.5);
        }else{
          final = texture2D(uTexture, vec2(v_pos.x,v_pos.y));
        }
        gl_FragColor = final;
    }
`

/*  vec3 transformed = vec3( position );
vec3 seg = position - uMouse;
vec3 dir = normalize(seg);
float dist = length(seg);
if (dist < 4.){
    float force = clamp(1. / (dist * dist), 0., 1.);
    transformed = dir * force;
}

gl_Position= projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(transformed + position, 1.0);
} */


/* 
attribute vec3 a_pos;
attribute vec3 a_instancePos;
uniform float u_time;
varying vec3 v_pos;
varying vec3 v_normal;
uniform vec3 uMouse;
vec3 rotateX(vec3 v, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec3(
      v.x,
      c * v.y + -s * v.z,
      s * v.y + c * v.z
    );
  }
  vec3 rotateY(vec3 v, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec3(
      c * v.x + s * v.z,
      v.y,
      -s * v.x + c * v.z
    );
  }
  vec3 rotateZ(vec3 v, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float m = cos(angle);
    return vec3(
      c * v.x + -s * v.y,
      s * v.x + c * v.y,
      v.z 
    );
  }

void main() {
   
  vec3 pos = position.xyz;
  pos = rotateX(pos, 1.0);
  pos = rotateY(pos, u_time);
  pos = rotateZ(pos, u_time);

  vec4 globalPosition = instanceMatrix * vec4(pos, 1.0);
 // globalPosition.xyz = rotateY(globalPosition.xyz, u_time * length(a_pos) * 0.3);
  
  vec3 norm = normal;
  norm = rotateX(norm, u_time);
  norm = rotateY(norm, u_time);
  norm = rotateZ(norm, u_time);
  norm = rotateY(norm, u_time * length(a_pos) * 0.3);
  v_normal = normalize(norm);

  vec4 mPos = modelMatrix * globalPosition;
  v_pos = mPos.xyz;
  
  // Calculate the distance between the object instance and the mouse cursor
  float distance = length(globalPosition.xy - vec2(uMouse.x,uMouse.y));
  
  // Define the rotation amount based on the distance
  float rotationAmount = smoothstep(0.79, 0.0, distance); // Adjust the threshold as needed
  
  // Apply rotation around the Y-axis based on the rotation amount
  mPos.xyz = rotateZ(mPos.xyz, rotationAmount * 2.0 * 3.14159); // Rotate by 360 degrees
  mPos.xyz = rotateX(mPos.xyz, rotationAmount * 2.0 * 3.14159); // Rotate by 360 degrees
  mPos.xyz = rotateY(mPos.xyz, rotationAmount * 2.0 * 3.14159); // Rotate by 360 degrees
  gl_Position = projectionMatrix * viewMatrix * vec4(mPos.x,mPos.y,mPos.z,1.0);

}

*/
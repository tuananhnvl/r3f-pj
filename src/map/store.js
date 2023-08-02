import brainJson from '.././map/brain.json'
import dogonplane from '.././map/dogonplane.json'
import lightbud from '.././map/lightbud.json'
import * as THREE from 'three';
const randomVector = (r) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r]
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
const datademo = Array.from({ length: 5000 }, (r = 10) => ({ random: Math.random(), position: randomVector(r), rotation: randomEuler() }))

const data = [];
const jsonBrain = brainJson.brainJson.slice(0,15000)
const jsonDog = dogonplane.dogonplane.slice(0,15000)
const jsonBud = lightbud.lightbud.slice(0,15000)

for (var i = 0; i < 15000; i += 3) {
  let brain = new THREE.Vector3(jsonBrain[i], jsonBrain[i + 1], jsonBrain[i + 2]);
  let dog = new THREE.Vector3(jsonDog[i], jsonDog[i + 1], jsonDog[i + 2]);
  let bud = new THREE.Vector3(jsonBud[i], jsonBud[i + 1], jsonBud[i + 2]);
  data.push({'id':i,'brain':brain,'dog':dog,'bud':bud});
}


export { data }

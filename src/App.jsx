import { useState, Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree, useLoader } from '@react-three/fiber'
import './App.css'
import './locomotive-scroll.css'
import * as THREE from 'three';
import { Perf } from 'r3f-perf'
import gsap, { Power4, Back } from 'gsap'
import { useGLTF, OrbitControls, Instances, Instance, Stars } from '@react-three/drei'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import brainJson from './map/brain.json'
import lightbud from './map/lightbud.json'
import dogonplane from './map/dogonplane.json'
import stt from './map/stt.json'
import useLocoScrollTrigger from './hook/useLocoScrollTrigger'
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useHover } from 'react-use-gesture'
import Effects from './hook/Effects'
import { createNoise3D } from 'simplex-noise';
import load from '../public/image.png'
import { data } from './map/store'
import { vertexShader, fragmentShader } from './shader/shaderCone'
import { DissolveMaterial } from "./components/DissolveMaterial";
import Logo from './assets/4.png'
import vertLogo from './shader/imageLogovert.js';
import fragLogo from './shader/imageLogofrag.js';
import vertexLine from './shader/vertexLine.js';
import fragmentLine from './shader/fragmentLine.js';
import fragBgNoise from './shader/fragBgNoise.js';
import vertBgNoise from './shader/vertBgNoise.js';

extend(useGLTF)


class CustomSinCurve extends THREE.Curve {

  constructor(scale = 1.0) {
    super();
    this.scale = scale;
    this.randomNumber = Math.random() * .4
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {

    const tx = t + 1.2;
    const ty = t * 4.2 - 2.0;
    //	const ty = -Math.sin( this.randomNumber * -Math.PI * t ) - 0.5;
    const tz = 0;


    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}
const Lines = (axisZ) => {
  const groupLines = useRef(null)
  const listChildRef = useRef({

  })
  const infoListLines = [
    'Name01',
    'Name02',
    'Name03',
    'Nam04',
    'Nam04',
    'Name01',
    'Name02',
    'Name03',
    'Nam04',
    'Nam04',
    'Name01',
    'Name02',
    'Name03',
    'Nam04',
    'Nam04',
    'Name02',
    'Name03',
    'Nam04',
    'Nam04',
    'Name01',
    'Name02',
    'Name03',
    'Nam04',
    'Nam04',
  ]

  useEffect(() => {
    const listItem = groupLines.current.children
    for (let index = 0; index < listItem.length; index++) {


    }
    groupLines.current.position.z = axisZ.axisZ
  }, [groupLines])

  /*  function updateUniformChild(object,value,typevalue,delta,factor) {
 
   } */

  useFrame(() => {

    const listItem = groupLines.current.children
    let positionCurent = localStorage.getItem('scroll-position')
    console.log(positionCurent)
    for (let index = 0; index < listItem.length; index++) {
      listItem[index].material.uniforms.uScroll.value = positionCurent

    }
  })

  return (

    <group ref={groupLines}>
      {infoListLines.map((infoListLine, index) =>
        <LineItem index={index} />
      )}
    </group>

  )
}
const LineItem = (index) => {
 // const noise2D = createNoise2D();
  const path = new CustomSinCurve(2);
  // console.log(path)
  const lineRef = useRef(null)
  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uScroll: {
        value: 0.0
      },
      uRandom: {
        value: Math.random() * 2.0 + 0.1
      },
      uRandomTo1: {
        value: Math.random() * 0.9999 + 0.2222
      },
      uRandomToIncreas: {
        value: Math.random()
      },
      uRandomTimePart: {
        value: Math.random() * 2.0 + 0.5
      },
      uRandomColor: {
        value: Math.random() * 0.69 + 0.10
      }
    }), []
  );
  useEffect(() => {
    // console.log(lineRef.current.geometry.attributes.position.array)

  }, [lineRef])

  const randomA = Math.random() * 2.0 + 0.1

  const randomB = Math.random() * 0.9999 + 0.2222

  useFrame((state) => {
    const { clock } = state;

    lineRef.current.material.uniforms.uTime.value = (clock.getElapsedTime() / 4.2);
  });
  return (
    <mesh ref={lineRef}>
      <tubeGeometry args={[path, 100, 0.0001, 1, false]} />

      <shaderMaterial
        fragmentShader={fragmentLine}
        vertexShader={vertexLine}
        uniforms={uniforms}
        wireframe
      />
    </mesh>
  )
}
const ImgPlane = (props) => {
  const imgPlaneRef = useRef(null)

  const tex = useLoader(THREE.TextureLoader, Logo)

  const uniformImgPlane = useMemo(
    () => ({
      uTexture1: { type: "t", value: tex },
      uTime: { type: "f", value: 0.0 }
    }), []
  );
  const uTimeSpeed = 0.5
  useEffect(() => {
   // console.log(tex.source.data.naturalWidth / 1000, tex.source.data.naturalHeight / 1000)
    imgPlaneRef.current.scale.set((tex.source.data.naturalWidth / 1000) * 0.8, tex.source.data.naturalHeight / 520, 0)
  }, [tex, imgPlaneRef])
  useFrame((state) => {
    const { clock } = state;
    imgPlaneRef.current.material.uniforms.uTime.value = (clock.getElapsedTime() * uTimeSpeed);
  })
  return (
    <mesh ref={imgPlaneRef} {...props}>
      <planeGeometry args={[1, 0.37, 16, 16]} />
      <shaderMaterial
        fragmentShader={fragLogo}
        vertexShader={vertLogo}
        uniforms={uniformImgPlane}
        wireframe={false}
        transparent={true}
      />
    </mesh>
  )
}



const BackgroundNosie = (axisZ) => {
  const meshBackgroundNosie = useRef(null)
  const { viewport, camera } = useThree()
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const texture1 = textureLoader.load('./noise_bg_b.jpg');
  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: texture1,
      }

    }), []
  );
  useFrame(() => {
    //console.log(camera.position.z - 1)
    //  meshBackgroundNosie.current.position.z = camera.position.z - 1
  })
  return (
    <mesh ref={meshBackgroundNosie}>
      <planeGeometry
        args={[viewport.width, viewport.height, 1, 1]}
      />
      <shaderMaterial
        fragmentShader={fragBgNoise}
        vertexShader={vertBgNoise}
        uniforms={uniforms}
        transparent={true}
        opacity={1.0}
      />
    </mesh>
  )
}
export function Demo2() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: '0', left: '0', backgroundColor: 'black' }}>
    <Canvas
      gl={{ antialias: false }}
      onCreated={({ gl }) => (gl.gammaFactor = 2.2, gl.outputEncoding = THREE.sRGBEncoding)}
      camera={{ position: [0, 0, 3] }}
    >
     
      <pointLight position={[0, 0, 2]} />

      <ImgPlane position={[0, 0, 1]} />
      <BackgroundNosie axisZ={1.2} />
      <Lines axisZ={-0.5} />

     {/*  <OrbitControls enableZoom={false}/> */}
    </Canvas>
  </div>

  )
}

const maxRange = 5000

const tempBoxes = new THREE.Object3D();
const tempBoxes2 = new THREE.Object3D();
export const clampedRandom = (min, max) => {
  return Math.random() * (max - min) + min
}
const InstancesConeShader = (datane) => {
  const { mouse, viewport } = useThree()
  const meshRef = useRef()
  const shaderRef = useRef()
  const [texture] = useLoader(THREE.TextureLoader, [load])
  const a_pos = useRef()
  const AMOUNT = 2000
  // create position
  const position = useMemo(() => {
    /* const pos = []
    for (let i = 0; i < AMOUNT; i++) {
      pos.push(clampedRandom(-5, 5), clampedRandom(-5, 5), clampedRandom(-5, 5))
    }
    return pos */
    console.log(viewport.width / 2)
  }, [AMOUNT])

  // init position matrix
  useEffect(() => {

    let random = []
    for (let i = 0; i < AMOUNT; i++) {
      random.push(i)
    }


    meshRef.current.geometry.setAttribute('dog_pos', new THREE.InstancedBufferAttribute(Float32Array.from(dogonplane.dogonplane), 3))
    meshRef.current.geometry.setAttribute('brain_pos', new THREE.InstancedBufferAttribute(Float32Array.from(brainJson.brainJson), 3))
    meshRef.current.geometry.setAttribute('bud_pos', new THREE.InstancedBufferAttribute(Float32Array.from(lightbud.lightbud), 3))


    console.log(meshRef)
  }, [meshRef])

  function mixVec1ToVec2(posA, posB, t) {
    return new THREE.Vector3(
      posA.x + (posB.x - posA.x) * t,
      posA.y + (posB.y - posA.y) * t,
      posA.z + (posB.z - posA.z) * t
    )
  }


  const marginDog = new THREE.Vector3(1.0, 1.0, 1.0)

  const marginBrain = new THREE.Vector3(0.0, 2.0, -2.0)

  function moveCurve(fromtarget, toTarget, progess, count) {
    const curve = new THREE.CubicBezierCurve3(
      fromtarget,
      new THREE.Vector3(5, 4, 0),
      new THREE.Vector3(-5, -4, Math.cos(count / 10) * toTarget.z),
      toTarget,
    );
    return curve.getPointAt(progess);
  }
  let counter = 0

  useFrame((clock) => {

    //console.log(mouse)
    //console.log(mouse.x * viewport.width/2)
    const processScroll = localStorage.getItem('process-scroll');

    if (shaderRef.current) {
      shaderRef.current.uniforms.uScroll.value = processScroll
      shaderRef.current.uniforms.u_time.value += 0.008
      shaderRef.current.uniforms.uMouse.value = new THREE.Vector3(mouse.x * viewport.width / 1.5, mouse.y * viewport.height / 2, 2.5)
    }
    const matrix = new THREE.Matrix4()
    if (1 == 2) {
      for (let i = 0; i < AMOUNT; i++) {

        let positionDog = datane.datane[i]['dog'];
        let posBrain = datane.datane[i]['brain'];
        let posBud = datane.datane[i]['bud'];


        let adjustDog = new THREE.Vector3().copy(positionDog).multiplyScalar(4.8).add(marginDog);
        let adjustBrain = new THREE.Vector3().copy(posBrain).multiplyScalar(0.2).sub(marginBrain);
        let adjustBud = new THREE.Vector3().copy(posBud).multiplyScalar(0.3).sub(marginBrain);
        let interpolatedPosition = new THREE.Vector3();

        if (processScroll < 0.33) {
          const t = processScroll / 0.33;
          //interpolatedPosition = mixVec1ToVec2(adjustDog, adjustBrain, t);
          interpolatedPosition = moveCurve(adjustDog, adjustBrain, t, i);
        } else if (processScroll <= 0.67) {
          const t = (processScroll - 0.33) / 0.34;
          interpolatedPosition = mixVec1ToVec2(adjustBrain, adjustBud, t);
          // interpolatedPosition = moveCurve(adjustBrain,adjustBud,t);
        } else {
          const t = (processScroll - 0.67) / 0.33;
          //interpolatedPosition = mixVec1ToVec2(adjustBud, adjustDog, t);
          interpolatedPosition = moveCurve(adjustBud, adjustDog, t, i);
        }

        matrix.setPosition(interpolatedPosition)
        if (meshRef.current) {
          meshRef.current.setMatrixAt(i, matrix)
        }

      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, AMOUNT]} >
      <coneGeometry args={[0.02, 0.03, 3]}>
        {/*   <instancedBufferAttribute
            attachObject={['attributes', 'a_pos']}
            args={[Float32Array.from(dogonplane.dogonplane), 3]}
          /> */}
      </coneGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe={false}
        uniforms={{
          u_light: { value: [0, 0, 0] },
          uTexture: { value: texture },
          u_time: { value: 0 },
          uMouse: { value: new THREE.Vector3(0, 0, 0) },
          uScroll: { value: 0.0 }
        }}
      />
    </instancedMesh>
  )
}




function ModelLoad() {
  const ref = useRef()
  const jsonBrain = brainJson.brainJson.slice(0, 15000)
  const jsonBud = lightbud.lightbud.slice(0, 15000)
  const jsonDog = dogonplane.dogonplane.slice(0, 15000)

  const material = new THREE.MeshLambertMaterial({ color: "red", wireframe: false });
  const conegeo = new THREE.ConeGeometry(0.02, 0.03, 3, true);
  let counter = 0;

  useEffect(() => {
    console.log(ref.current)
    ref.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // Set instanceMatrix usage to dynamic

    for (let i = 0; i < jsonBrain.length / 3; i += 3) {
      const id = counter++;
      //console.log('run')
      ref.current.position.y = -3
      tempBoxes.position.set(jsonBrain[i] / 4, jsonBrain[i + 1] / 4, jsonBrain[i + 2] / 4)

      tempBoxes.updateMatrix();
      ref.current.setMatrixAt(id, tempBoxes.matrix);

    }
  }, [ref])

  const quaternion = new THREE.Quaternion();
  const noise3D = createNoise3D();

  const roundedSquareWave = (t, delta, a, f) => {
    return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)
  }
  let processRoteee = 0
  let targetRotate = 0
  let clonePos = 0
  let cloneProgess = 0
  let countTam = 0
  let curentTimeChange1 = 0
  let progresseachFrame = 0
  let stepProcessFrame = 0
  let targetRotationExample = new THREE.Vector3(0, 0, 0)
  let cloneLastRotation = new THREE.Vector3(0, 0, 0)
  let targetPositionExample = new THREE.Vector3(0, -3, 0)

  useFrame(({ clock, gl, scene, camera }) => {


    const conditionStart = localStorage.getItem('lock3d')
    const processScroll = localStorage.getItem('process-scroll');
    const posScroll = localStorage.getItem('pos-scroll-y')
    const t = clock.oldTime * 0.001;
    clonePos = posScroll
    cloneProgess = processScroll
    // console.log(cloneProgess)

    if (cloneProgess < 0.25) {
      //console.log('in')
      progresseachFrame = 4
      stepProcessFrame = 0

    } else if (cloneProgess > 0.25 && cloneProgess < 0.35) {
      // console.log('lock')
      progresseachFrame = 0

      ref.current.rotation.y += 0.0005
    } else if (cloneProgess > 0.35 && cloneProgess < 0.50) {
      //console.log('in1')
      progresseachFrame = 6.6
      stepProcessFrame = 0.35
    } else if (cloneProgess > 0.50 && cloneProgess < 0.65) {
      //console.log('lock')
      progresseachFrame = 0
    } else if (cloneProgess > 0.65 && cloneProgess < 0.85) {
      // console.log('in2')
      progresseachFrame = 5
      stepProcessFrame = 0.65
    }
    else if (cloneProgess > 0.85 && cloneProgess < 1.0) {
      // console.log('boom!')
      progresseachFrame = 6.6
      stepProcessFrame = 0.85
    } else if (cloneProgess == 1) {
      // console.log('boom!')
      progresseachFrame = 1
      stepProcessFrame = 0
    }

    curentTimeChange1 = (cloneProgess - stepProcessFrame) * progresseachFrame
    // console.log(typeof localStorage.getItem('lock3d'))
    if (localStorage.getItem('lock3d') === 'false') {
      processRoteee = 1
    } else {
      processRoteee = 0
    }

    for (let i = 0; i < jsonBrain.length / 3; i += 3) {
      // gen val pos from arr
      const brianPos = new THREE.Vector3(jsonBrain[i] / 4, jsonBrain[i + 1] / 4, jsonBrain[i + 2] / 4);
      const brianPos_scale = brianPos.clone().multiplyScalar(2); // * n to scale
      const dogPos = new THREE.Vector3(jsonDog[i] * 4 + 1.0, jsonDog[i + 1] * 4 + 4.0, jsonDog[i + 2] * 4 + 1.0);
      const budPos = new THREE.Vector3(jsonBud[i] / 2, jsonBud[i + 1] / 2, jsonBud[i + 2] / 2);
      const budPos_sacle = budPos.clone().multiplyScalar(-2); // * n to scale

      let targetPos = new THREE.Vector3(); // clone vec3 target
      if (cloneProgess < 0.25) {
        // move

        targetPos = tempBoxes.position.lerpVectors(brianPos_scale, brianPos, curentTimeChange1);
      } else if (cloneProgess > 0.25 && cloneProgess < 0.35) {
        // stop

        targetPos = tempBoxes.position.lerpVectors(brianPos, brianPos_scale, curentTimeChange1);
      } else if (cloneProgess > 0.35 && cloneProgess < 0.50) {
        // move
        targetPos = tempBoxes.position.lerpVectors(brianPos, dogPos, curentTimeChange1);
      } else if (cloneProgess > 0.50 && cloneProgess < 0.65) {
        // stop
        targetPos = tempBoxes.position.lerpVectors(dogPos, dogPos, curentTimeChange1);
      } else if (cloneProgess > 0.65 && cloneProgess < 0.85) {
        // move
        targetPos = tempBoxes.position.lerpVectors(dogPos, budPos, curentTimeChange1);
      }
      else if (cloneProgess > 0.85 && cloneProgess < 1.0) {
        // stop??

        targetPos = tempBoxes.position.lerpVectors(budPos, brianPos_scale, curentTimeChange1);
      }
      else if (cloneProgess == 1) {
        // stop??

        targetPos = tempBoxes.position.lerpVectors(budPos, brianPos_scale, curentTimeChange1);
      }
      tempBoxes.position.copy(targetPos); // get clone val


      tempBoxes.rotation.set(t * processRoteee, t * processRoteee, t * processRoteee)
      tempBoxes.updateMatrix(); //df
      ref.current.setMatrixAt(i / 3, tempBoxes.matrix);//df
    }

    ref.current.instanceMatrix.needsUpdate = true;

  });

  return (

    <instancedMesh ref={ref} args={[conegeo, material, jsonBrain.length / 3]} />

  )
}

function CalcPosObj() {
  const ref = useRef(null)
  const grRef = useRef(null)
  const clock = new THREE.Clock();
  const jsonBrain = brainJson.brainJson.slice(0, 15000)
  const jsonBud = lightbud.lightbud.slice(0, 15000)
  const { nodes, materials } = useGLTF('/dogonplane.glb')
  const { scene } = useThree()
  useEffect(() => {
    console.log(nodes)
    grRef.current.scale.set(1.5, 1.5, 1.5)
    grRef.current.name = '3dModel'
    setTimeout(() => {
      console.log(scene)
      const boxClone = new THREE.Box3().setFromObject(grRef.current);
      const sizeGruopW = boxClone.max.x - boxClone.min.x;
      const sizeGruopH = boxClone.max.y - boxClone.min.y;
      grRef.current.position.set(-1, 0, 4.2)
      const sampler = new MeshSurfaceSampler(grRef.current.children[0])
        .setWeightAttribute('color')
        .build()
      console.log(sampler)
      calcPoint(sampler)
    }, 1000)
  }, [grRef])
  function calcPoint(sampler) {

    const vertices = [];
    const tempPosition = new THREE.Vector3();
    for (let i = 0; i < 5000; i++) {
      sampler.sample(tempPosition);
      vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
    }
    // console.log(JSON.stringify(vertices))
    /* Create a geometry from the coordinates */
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    /* Create a material */
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xff61d5,
      size: 0.003
    });
    /* Create a Points object */
    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    /* Add the points into the scene */
    grRef.current.add(points);

  }


  /* useEffect(() => {
    const boxClone = new THREE.Box3().setFromObject(grRef.current);
    const sizeGruopW = boxClone.max.x - boxClone.min.x;
    const sizeGruopH = boxClone.max.y - boxClone.min.y;
    grRef.current.scale.set(1,1,1)
    grRef.current.position.x = -sizeGruopW +5
    grRef.current.position.y = -sizeGruopH +5
    grRef.current.position.z = 0
    //check
  /*   setTimeout(() => {
      for (let i = 0; i < jsonBud.length/3; i++) {
        const index = i * 3;
        const position = new THREE.Vector3(jsonBud[index], jsonBud[index + 1], jsonBud[index + 2]);
        gsap.timeline({}).to(grRef.current.children[i].position, {
          x: jsonBud[index],
          y: jsonBud[index + 1],
          z:jsonBud[index + 2],
          duration: 5
        })
      }
      gsap.to(grRef.current.scale,{
        x:2.5,
        y:2.5,
        z:2.5,
        duration:5
      })
  },5000) */

  /* gsap.to(grRef.current.children[0].geometry.attributes.position.array, {
    delay: 2,
    endArray: jsonBud,
    duration: 5,
    // Make sure to tell it to update
    onUpdate: () => grRef.current.geometry.attributes.position.needsUpdate = true
  }) 

 
}, [grRef]) 
*/



  useFrame((delta) => {

  });

  return (
    <group ref={grRef}>
      <primitive object={nodes['Node-Mesh_2']} />
    </group>
  )
}
function ControlCustom() {
  const { scene } = useThree()
  const ref = useRef(null)
  useEffect(() => {
    console.log(scene.children)
  }, [scene])
  useEffect(() => {

  }, [ref])
  return (
    // null
    <OrbitControls ref={ref} enableZoom={false} enableRotate={true} />
  )
}


function Rocket() {

  const tempBoxes = new THREE.Object3D()
  const grRocket = useRef()
  const { scene, camera } = useThree()
  const { nodes, materials } = useGLTF('Jet.glb')
  console.log(nodes['Jet'],materials['Mat'])
  const boxMaterial = new THREE.MeshStandardMaterial({ color: "white" });
const sphereMaterial = new THREE.MeshStandardMaterial({ color: "white" });

  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.75, -0.75, 5),
    new THREE.Vector3(-7, 2, -3),
    new THREE.Vector3(3, 2, -5),
    new THREE.Vector3(0, 0, 6)
  );
  const curveForCam = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.5, -0.5, 6),
    new THREE.Vector3(-8, 1.8, -4),
    new THREE.Vector3(3, 4.2, -5),
    new THREE.Vector3(0, -0.2, 5)
  );
  const curveLength = curve.getLength();
  const curveCamLength = curveForCam.getLength();
  useEffect(() => {
    grRocket.current.name = 'Rocket'
    const points = curve.getPoints(50);
    const points1 = curveForCam.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
    const material = new THREE.LineBasicMaterial({ color: 'red' });
    const material1 = new THREE.LineBasicMaterial({ color: 'white' });
    const curveObject = new THREE.Line(geometry, material);
    const curveObject2 = new THREE.Line(geometry1, material1);
  scene.add(curveObject)
   // scene.add(curveObject2)
  

    grRocket.current.children[0].scale.set(0.0042, 0.0042, 0.0042)
  }, [grRocket])
  let count = 0
  let targetScroll = 0
  const lastCamMove = new THREE.Vector3(-0.16205354888848428, 0.05604252449359942, 5.372504861863849)
  useFrame((state) => {
    count++
    targetScroll = localStorage.getItem('process-scroll');


    /////////////
    //GROUP ROCKET
    /////////////


    const currentCurvePosition = THREE.MathUtils.clamp(
      (targetScroll / 14) * curveLength,
      0,
      curveLength
    );
    const targetPos = curve.getPointAt(currentCurvePosition)
    const tangent = curve.getTangentAt(currentCurvePosition);
    let targetPosRocket = targetPos
    let targetRocketlookAt = new THREE.Vector3().copy(grRocket.current.position).add(tangent)
    grRocket.current.position.copy(targetPosRocket);
    grRocket.current.lookAt(targetRocketlookAt); // inclu rote

    /////////////
    //CAMERA
    /////////////
    const targetCamPosition = THREE.MathUtils.clamp(
      (targetScroll / 14) * curveCamLength,
      0,
      curveCamLength
    );
    const targerPosForCam = curveForCam.getPointAt(targetCamPosition);
    const targerRotateForCam = curveForCam.getTangentAt(targetCamPosition);

    const posCameraDF = new THREE.Vector3(0.2, -0.2, -0.5)
    const cameraDistance = 0.1; // Adjust this value to change the distance of the camera from the rocket


    const cameraOffsetRotate = new THREE.Vector3().copy(targerRotateForCam).multiplyScalar(-cameraDistance).sub(posCameraDF)
    const cameraPosition = new THREE.Vector3().copy(targerPosForCam).add(cameraOffsetRotate);
    //console.log( targetScroll)
    //console.log( state.camera.position)
    if (targetScroll > 0.7) {
      // state.camera.position.copy(lastCamMove);
      //state.camera.lookAt(cameraOffsetRotate);
    } else {
      state.camera.position.copy(cameraPosition);
      state.camera.lookAt(cameraOffsetRotate);
    }

    //  console.log(state.camera.position)
  });

  
  return (
    <group ref={grRocket}  dispose={null}>
    <mesh geometry={nodes['Jet'].geometry}>
      <DissolveMaterial
        baseMaterial={materials['Mat']}
       
        //visible={props.dissolveVisible}
        //onFadeOut={props.onFadeOut}
        color="#7f532f"
      />
    </mesh>
    </group>


  )
}
function Plane() {
  const meshRef = useRef()
  const { scene } = useThree()
  useEffect(() => {
    console.log('========================================')
    meshRef.current.position.y = -3
  }, [scene])
  return (
    <mesh ref={meshRef}>
      <sphereGeometry arg={[15, 32, 16]} />
      <meshBasicMaterial wireframe={true} />
    </mesh>
  )
}
function PlaneAndRocket() {
  const grRef = useRef()

  return (
    <group ref={grRef}>
      <Plane />
      <Rocket />
    </group>
  )
}
function App() {
  const containerRef = useRef(null)
  const intiScroll = useLocoScrollTrigger(true)
  const canvasRef = useRef(null)

  localStorage.setItem('pos-scroll-y', 0)
  localStorage.setItem('lock3d', true)
  useEffect(() => {
    localStorage.setItem('process-scroll', 0)
    if (canvasRef.current) {
      let ctx = gsap.context(() => {

        const scrollTrigger = ScrollTrigger.create({
          trigger: canvasRef.current,
          scroller: '.container',
          scrub: true,
          pin: true,
          pinSpacing: true,
          markers: true,
          start: "top top",
          end: "+=300% bottom",

          onUpdate: (self) => {
            //console.log(self.progress)
            let a = self.progress
            localStorage.setItem('process-scroll', a)

          },
          onLeaveBack: () => {
            localStorage.setItem('lock3d', true)
            console.log(localStorage.getItem('lock3d'))
          },
          onEnterBack: () => {
            localStorage.setItem('lock3d', false)
            console.log(localStorage.getItem('lock3d'))
          },
          onEnter: () => {
            localStorage.setItem('lock3d', false)
            console.log(localStorage.getItem('lock3d'))
          },
          onLeave: () => {
            localStorage.setItem('lock3d', true)
            console.log(localStorage.getItem('lock3d'))
          }
        });


        return () => {
          scrollTrigger.kill(); // Destroy the ScrollTrigger instance when the component unmounts
        };
      })
      return () => ctx.revert();
    }

  }, [canvasRef])


  return (
    <>
      <section data-scroll-container className='container' ref={containerRef}>

        <div className='content'>
          <div className='sectiondm'><span>Section 1</span></div>
          <div>
          <Demo2/>
            <div className='r3f' ref={canvasRef} >
              <Canvas
                gl={{ antialias: false }}
                onCreated={({ gl }) => (gl.gammaFactor = 2.2, gl.setClearColor(0xEEE3CB))}
              >
             {/*  
                <directionalLight /> */}
                <PlaneAndRocket />
          
                <directionalLight />

                <Suspense fallback={null}>
                  <InstancesConeShader datane={data} />
            
                </Suspense>

                <Perf />
                <ControlCustom />
              </Canvas>
            </div>
          </div>

          <div className='sectiondm'><span>Section 2</span></div>
        </div>

      </section>
    </>
  )
}

export default App

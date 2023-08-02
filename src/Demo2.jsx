import React,{useState, useRef, useEffect, useMemo} from 'react'
import { extend, Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import {Caustics,useGLTF,CubeCamera, MeshRefractionMaterial,OrbitControls, MapControls, Text, Text3D, Stats, Line,MeshWobbleMaterial } from '@react-three/drei'
import Logo from './assets/4.png'
import vertLogo from './shader/imageLogovert.js';
import fragLogo from './shader/imageLogofrag.js';
import vertexLine from './shader/vertexLine.js';
import fragmentLine from './shader/fragmentLine.js';
import fragBgNoise from './shader/fragBgNoise.js';
import vertBgNoise from './shader/vertBgNoise.js';
import * as THREE from 'three';

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
export default function Demo2() {
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

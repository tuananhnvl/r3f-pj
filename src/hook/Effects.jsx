import * as THREE from 'three'
import React, { useRef, useEffect, useMemo } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { usePrevious } from 'react-use'

extend({ EffectComposer, ShaderPass, RenderPass, SSAOPass, UnrealBloomPass })

export default function Effects() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 2)

  const bloom = useRef()
  const previous = usePrevious(bloom.current)
  useEffect(() => {
    console.log(bloom.current === previous)
  }, [bloom.current])

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <sSAOPass attachArray="passes" args={[scene, camera]} kernelRadius={0.6} maxDistance={0.03} />
      <unrealBloomPass ref={bloom} attachArray="passes" args={[aspect, 2, 1, 0.991]} />
      <shaderPass
        attachArray="passes"
        args={[FXAAShader]}
        material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
        renderToScreen
      />
    </effectComposer>
  )
}

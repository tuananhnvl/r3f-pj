import React, { FC, RefObject, useEffect, useLayoutEffect, useRef } from 'react'

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

import {
  BufferAttribute,
  Color,
  Group,
  InstancedMesh,
  Mesh,
  Object3D,
  Vector,
  Vector3
} from 'three'

type SamplePayload = {
  /**
   * The position of the sample.
   */
  position: Vector3
  /**
   * The normal of the mesh at the sampled position.
   */
  normal: Vector3
  /**
   * The vertex color of the mesh at the sampled position.
   */
  color: Color
}

export type TransformFn = (payload: TransformPayload, i: number) => void

type TransformPayload = SamplePayload & {
  /**
   * The dummy object used to transform each instance.
   * This object's matrix will be updated after transforming & it will be used
   * to set the instance's matrix.
   */
  dummy: Object3D
  /**
   * The mesh that's initially passed to the sampler.
   * Use this if you need to apply transforms from your mesh to your instances
   * or if you need to grab attributes from the geometry.
   */
  sampledMesh: Mesh
}

type Props = {
  /**
   * The mesh that will be used to sample.
   * Does not need to be in the scene graph.
   */
  mesh: RefObject<Mesh>
  /**
   * The InstancedMesh that will be controlled by the component.
   * This InstancedMesh's count value will determine how many samples are taken.
   *
   * @see Props.transform to see how to apply transformations to your instances based on the samples.
   *
   */
  instances: RefObject<InstancedMesh>
  /**
   *
   */
  buffer: RefObject<BufferAttribute>
  /**
   * The NAME of the weight attribute to use when sampling.
   *
   * @see https://threejs.org/docs/#examples/en/math/MeshSurfaceSampler.setWeightAttribute
   */
  weight?: string
  /**
   * Transformation to be applied to each instance.
   * Receives a dummy object3D with all the sampled data ( @see TransformPayload ).
   * It should mutate `transformPayload.dummy`.
   *
   * @see ( @todo add link to example )
   *
   * There is no need to update the dummy's matrix
   */
  transform?: TransformFn
}

export const SurfaceSampler: FC<Props> = ({
  children,
  weight,
  transform,
  instances,
  mesh,
  ...props
}) => {
  const group = useRef<Group>(null)
  const instancedRef = useRef<InstancedMesh>(null)
  const meshToSampleRef = useRef<Mesh>(null)

  useEffect(() => {
    instancedRef.current =
      instances?.current ??
      (group.current.children.find((c) => c.hasOwnProperty('instanceMatrix')) as InstancedMesh)

    meshToSampleRef.current =
      mesh?.current ?? (group.current.children.find((c) => c.type === 'Mesh') as Mesh)
  }, [])

  const doSampling = () => {
    if (typeof meshToSampleRef.current === 'undefined') return
    if (typeof instancedRef.current === 'undefined') return

    const sampler = new MeshSurfaceSampler(meshToSampleRef.current)

    if (weight) {
      sampler.setWeightAttribute(weight)
    }

    sampler.build()

    const position = new Vector3()
    const normal = new Vector3()
    const color = new Color()

    const dummy = new Object3D()

    meshToSampleRef.current.updateMatrixWorld(true)

    for (let i = 0; i < instancedRef.current.count; i++) {
      sampler.sample(position, normal, color)

      if (typeof transform === 'function') {
        transform(
          {
            dummy,
            sampledMesh: meshToSampleRef.current!,
            position,
            normal,
            color
          },
          i
        )
      } else {
        dummy.position.copy(position)
      }

      dummy.updateMatrix()

      instancedRef.current.setMatrixAt(i, dummy.matrix)
    }

    instancedRef.current.instanceMatrix.needsUpdate = true
  }

  useEffect(() => {
    doSampling()
  }, [])

  return (
    <group ref={group} {...props}>
      {children}
    </group>
  )
}

/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

//@ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";



export function Model(props) {
  const group = useRef();

  const { nodes, materials, scene } = useGLTF("/reb.glb");



  const { animations } = useGLTF("/animations.glb");
  const { actions, mixer } = useAnimations(animations, group);

  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === "idle") ? "idle" : animations[1].name // Check if Idle animation exists otherwise use first animation
  );

  useEffect(() => {
    actions[animation]
      .reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group name="rebca">
            <skinnedMesh
              name="Body001"
              geometry={nodes.Body001.geometry}
              material={materials["Skin.002"]}
              skeleton={nodes.Body001.skeleton}
            />
            <skinnedMesh
              name="Body001_1"
              geometry={nodes.Body001_1.geometry}
              material={materials["Lips.002"]}
              skeleton={nodes.Body001_1.skeleton}
            />
            <skinnedMesh
              name="Body001_2"
              geometry={nodes.Body001_2.geometry}
              material={materials["Mouth.002"]}
              skeleton={nodes.Body001_2.skeleton}
            />
            <skinnedMesh
              name="Body001_3"
              geometry={nodes.Body001_3.geometry}
              material={materials["EyeInner.002"]}
              skeleton={nodes.Body001_3.skeleton}
            />
            <skinnedMesh
              name="Body001_4"
              geometry={nodes.Body001_4.geometry}
              material={materials["EyeBrows.002"]}
              skeleton={nodes.Body001_4.skeleton}
            />
            <skinnedMesh
              name="Body001_5"
              geometry={nodes.Body001_5.geometry}
              material={materials["Teeth.002"]}
              skeleton={nodes.Body001_5.skeleton}
            />
            <skinnedMesh
              name="Body001_6"
              geometry={nodes.Body001_6.geometry}
              material={materials["Hair.002"]}
              skeleton={nodes.Body001_6.skeleton}
            />
            <skinnedMesh
              name="Body001_7"
              geometry={nodes.Body001_7.geometry}
              material={materials["Shoes.002"]}
              skeleton={nodes.Body001_7.skeleton}
            />
            <skinnedMesh
              name="Body001_8"
              geometry={nodes.Body001_8.geometry}
              material={materials["Jeans.002"]}
              skeleton={nodes.Body001_8.skeleton}
            />
            <skinnedMesh
              name="Body001_9"
              geometry={nodes.Body001_9.geometry}
              material={materials["Button.002"]}
              skeleton={nodes.Body001_9.skeleton}
            />
            <skinnedMesh
              name="Body001_10"
              geometry={nodes.Body001_10.geometry}
              material={materials["Jacket.002"]}
              skeleton={nodes.Body001_10.skeleton}
            />
            <skinnedMesh
              name="Body001_11"
              geometry={nodes.Body001_11.geometry}
              material={materials["Vest.002"]}
              skeleton={nodes.Body001_11.skeleton}
            />
          </group>
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/reb.glb");

// useGLTF.preload("/animations.glb");
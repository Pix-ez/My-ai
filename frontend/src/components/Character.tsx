//@ts-nocheck

import {
    CameraControls,
    ContactShadows,
    Environment,
    Text,
  } from "@react-three/drei";

import { Suspense, useEffect, useRef, useState } from "react";

import {Chat} from "../hooks/Chat"

import { Model } from "./Model";

const Dots = (props) => {
    const { loading } = Chat();
    const [loadingText, setLoadingText] = useState("");
    useEffect(() => {
      if (loading) {
        const interval = setInterval(() => {
          setLoadingText((loadingText) => {
            if (loadingText.length > 2) {
              return ".";
            }
            return loadingText + ".";
          });
        }, 800);
        return () => clearInterval(interval);
      } else {
        setLoadingText("");
      }
    }, [loading]);
    if (!loading) return null;
    return (
      <group {...props}>
        <Text fontSize={7.0}  anchorX={"left"} anchorY={"bottom"}>
          {loadingText}
          <meshBasicMaterial attach="material" color="black" />
        </Text>
      </group>
    );
  };

  export const Character = () => {
    const cameraControls = useRef();
    const { cameraZoomed } = Chat();
  
    useEffect(() => {
      cameraControls.current.setLookAt(2.0, 20, 40, 0, 5.0, 0,);
    }, []);
   
    useEffect(() => {
      if (cameraZoomed) {
        cameraControls.current.setLookAt( -7.0, 10, 40, 0.6, 8.0, 0, true);
      } else {
        cameraControls.current.setLookAt(10.0, 20, 60, 0, 5.0, 0, true);
      }
    }, [cameraZoomed]);
    return (
      <>
        <CameraControls ref={cameraControls} />
        <Environment preset="sunset" />
        {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
        <Suspense>
          <Dots position-y={1.75} position-x={1} />
        </Suspense>
        <Model/>
        <ContactShadows opacity={0.9} />
      </>
    );
  };
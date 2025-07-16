"use client";

import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Text,
  OrbitControls,
  useTexture,
  RoundedBox,
  Plane,
  Environment,
} from "@react-three/drei";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function CardMesh({ scale }: { scale: number }) {
  const groupRef = useRef<Group>(null);

  const profileTexture = useTexture(
    "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const qrCodeTexture = useTexture(
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CivicCast-Voter-123456789"
  );
  const hologramTexture = useTexture(
    "https://plus.unsplash.com/premium_photo-1681488277609-1806135d1126?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );

  useFrame((state) => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: gsap.utils.interpolate(
          groupRef.current.rotation.y,
          (state.mouse.x * Math.PI) / 10,
          0.1
        ),
        x: gsap.utils.interpolate(
          groupRef.current.rotation.x,
          (-state.mouse.y * Math.PI) / 10,
          0.1
        ),
        duration: 0.5,
        ease: "power2.out",
      });
    }
  });

  const Z_OFFSET = 0.051;

  return (
    <group ref={groupRef} scale={scale}>
      <RoundedBox args={[4, 2.5, 0.1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#484848" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      <Text
        position={[-0.8, 1.05, Z_OFFSET]}
        fontSize={0.22}
        color="white"
        anchorX="left"
      >
        VOTER ID CARD
      </Text>
      <Text
        position={[-0.8, 0.85, Z_OFFSET]}
        fontSize={0.1}
        color="#e50914"
        anchorX="left"
      >
        REPUBLIC OF NITR
      </Text>
      <Plane args={[0.8, 0.8]} position={[-1.4, 0.3, Z_OFFSET]}>
        <meshStandardMaterial map={profileTexture} />
      </Plane>
      <Text
        position={[-1.4, -0.2, Z_OFFSET]}
        fontSize={0.08}
        color="#cccccc"
        anchorX="center"
      >
        Alex Doe
      </Text>
      <Text
        position={[-0.5, 0.5, Z_OFFSET]}
        fontSize={0.09}
        color="#bbbbbb"
        anchorX="left"
      >
        ID No:
      </Text>
      <Text
        position={[0.1, 0.5, Z_OFFSET]}
        fontSize={0.09}
        color="#ffffff"
        anchorX="left"
      >
        CIV-123456789
      </Text>
      <Text
        position={[-0.5, 0.3, Z_OFFSET]}
        fontSize={0.09}
        color="#bbbbbb"
        anchorX="left"
      >
        Issued:
      </Text>
      <Text
        position={[0.1, 0.3, Z_OFFSET]}
        fontSize={0.09}
        color="#ffffff"
        anchorX="left"
      >
        01/01/2024
      </Text>
      <Text
        position={[-0.5, 0.1, Z_OFFSET]}
        fontSize={0.09}
        color="#bbbbbb"
        anchorX="left"
      >
        Expires:
      </Text>
      <Text
        position={[0.1, 0.1, Z_OFFSET]}
        fontSize={0.09}
        color="#ffffff"
        anchorX="left"
      >
        31/12/2034
      </Text>
      <Text
        position={[-0.5, -0.1, Z_OFFSET]}
        fontSize={0.09}
        color="#bbbbbb"
        anchorX="left"
      >
        Status:
      </Text>
      <Text
        position={[0.1, -0.1, Z_OFFSET]}
        fontSize={0.09}
        color="#22c55e"
        anchorX="left"
      >
        VERIFIED
      </Text>
      <Plane args={[0.6, 0.6]} position={[1.4, 0.2, Z_OFFSET]}>
        <meshStandardMaterial map={qrCodeTexture} />
      </Plane>
      <Plane args={[0.7, 0.7]} position={[1.4, -0.7, Z_OFFSET + 0.001]}>
        <meshStandardMaterial
          map={hologramTexture}
          transparent
          opacity={1}
          emissive={"#fff"}
          emissiveIntensity={0.4}
        />
      </Plane>
      <Text
        position={[-0.5, -0.6, Z_OFFSET]}
        fontSize={0.15}
        color="#dddddd"
        anchorX="left"
      >
        Alex Doe
      </Text>
      <mesh position={[-0.5, -0.7, Z_OFFSET]}>
        <boxGeometry args={[1.5, 0.01, 0.01]} />
        <meshBasicMaterial color="#bbbbbb" />
      </mesh>
      <Text
        position={[-0.5, -0.8, Z_OFFSET]}
        fontSize={0.06}
        color="#888888"
        anchorX="left"
      >
        SIGNATURE
      </Text>
    </group>
  );
}

export default function VoterIdCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const cardScale = isMobile ? 0.75 : 1;
  const cameraFov = isMobile ? 65 : 50;

  useGSAP(
    () => {
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 120 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 3,
          ease: "power3.out",
          delay: 1.8,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      // FIX: Use responsive height for the container.
      className="invisible flex h-[400px] w-full cursor-grab items-center justify-center md:h-[500px]"
    >
      <Canvas camera={{ position: [0, 0, 4.5], fov: cameraFov }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[-5, 5, 10]} intensity={1} />
        <directionalLight
          position={[-5, 5, 15]}
          intensity={0.5}
          color="#e50914"
        />
        <Suspense fallback={null}>
          <Environment preset="park" environmentIntensity={0.8} />
        </Suspense>
        <Suspense fallback={null}>
          {/* FIX: Pass the dynamic scale to the mesh component. */}
          <CardMesh scale={cardScale} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.9}
        />
      </Canvas>
    </div>
  );
}

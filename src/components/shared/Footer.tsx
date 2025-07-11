"use client";

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const PhysicsWord = ({
  text,
  engine,
  onWordClick,
}: {
  text: string;
  engine: Matter.Engine;
  onWordClick: (word: string, element: HTMLDivElement) => void;
}) => {
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wordRef.current) return;

    const body = Matter.Bodies.rectangle(
      Math.random() * (window.innerWidth * 0.6) + window.innerWidth * 0.2,
      Math.random() * 100,
      wordRef.current.clientWidth,
      wordRef.current.clientHeight,
      { restitution: 0.7, friction: 0.2, label: text }
    );

    Matter.World.add(engine.world, [body]);
    (wordRef.current as any).body = body;
  }, [text, engine]);

  return (
    <div
      ref={wordRef}
      onClick={() => onWordClick(text, wordRef.current!)}
      className="absolute cursor-pointer select-none whitespace-nowrap rounded-md border border-gray-700 bg-gray-900/50 px-4 py-2 text-xl font-semibold text-gray-200 shadow-lg backdrop-blur-sm transition-colors hover:border-red-500/50 hover:text-white"
    >
      {text}
    </div>
  );
};

const PhysicsSandbox = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create({ gravity: { y: 0.4 } }));
  const [words, setWords] = useState([
    "CivicCast",
    "Vote",
    "Democracy",
    "Future",
    "AboutUs",
  ]);

  const handleWordClick = (word: string, element: HTMLDivElement) => {
    if (word === "AboutUs") {
      const body = (element as any).body;
      if (!body) return;

      Matter.World.remove(engineRef.current.world, body);
      setWords((prev) => prev.filter((w) => w !== "AboutUs"));

      setTimeout(() => setWords((prev) => [...prev, "Pyro", "Dipankar"]), 100);
    }
  };

  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;
    const runner = Matter.Runner.create();
    let render: Matter.Render | null = null;

    if (sceneRef.current) {
      const sceneWidth = sceneRef.current.clientWidth;
      const sceneHeight = 300;

      const ground = Matter.Bodies.rectangle(
        sceneWidth / 2,
        sceneHeight + 20,
        sceneWidth,
        40,
        { isStatic: true }
      );
      const ceiling = Matter.Bodies.rectangle(
        sceneWidth / 2,
        -20,
        sceneWidth,
        40,
        { isStatic: true }
      );
      const leftWall = Matter.Bodies.rectangle(
        -20,
        sceneHeight / 2,
        40,
        sceneHeight,
        { isStatic: true }
      );
      const rightWall = Matter.Bodies.rectangle(
        sceneWidth + 20,
        sceneHeight / 2,
        40,
        sceneHeight,
        { isStatic: true }
      );
      Matter.World.add(world, [ground, ceiling, leftWall, rightWall]);

      const mouse = Matter.Mouse.create(sceneRef.current);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      Matter.World.add(world, mouseConstraint);
    }

    let animationFrameId: number;
    const update = () => {
      if (sceneRef.current) {
        const wordElements = sceneRef.current.children;
        const sceneWidth = sceneRef.current.clientWidth;
        const sceneHeight = 300;

        for (let i = 0; i < wordElements.length; i++) {
          const el = wordElements[i] as HTMLElement;
          const body = (el as any).body;
          if (body) {
            // --- FIX: Clamp positions to ensure words never escape the container ---
            const clampedX = clamp(
              body.position.x,
              el.offsetWidth / 2,
              sceneWidth - el.offsetWidth / 2
            );
            const clampedY = clamp(
              body.position.y,
              el.offsetHeight / 2,
              sceneHeight - el.offsetHeight / 2
            );

            Matter.Body.setPosition(body, { x: clampedX, y: clampedY });

            el.style.transform = `translate(${
              body.position.x - el.offsetWidth / 2
            }px, ${body.position.y - el.offsetHeight / 2}px) rotate(${
              body.angle
            }rad)`;
          }
        }
      }
      animationFrameId = requestAnimationFrame(update);
    };

    Matter.Runner.run(runner, engine);
    update();

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={sceneRef} className="relative w-full h-[300px] cursor-grab">
      {words.map((word) => (
        <PhysicsWord
          key={word}
          text={word}
          engine={engineRef.current}
          onWordClick={handleWordClick}
        />
      ))}
    </div>
  );
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(footerRef.current, {
        y: 100,
        autoAlpha: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
        },
      });
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#080808] text-gray-400 py-16 px-6 z-20 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-red-900/30 blur-[150px] rounded-full z-[-1]"></div>
      <div className="absolute bottom-0 left-1/4 w-[50%] h-[200px] bg-gray-700/20 blur-[120px] rounded-full z-[-1]"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-4xl font-extrabold text-white tracking-tighter">
            An Interactive Democracy
          </h3>
          <p className="text-lg mt-2 text-gray-400">
            Drag the words around. Click "AboutUs" for a surprise.
          </p>
        </div>

        <PhysicsSandbox />

        <nav className="mt-16 border-t border-gray-800/50 pt-12">
          <ul className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <li>
              <Link
                href="/election"
                className="group relative inline-block rounded-lg bg-gray-800/50 px-8 py-3 text-lg font-bold text-white transition-all duration-300 hover:bg-gray-800/80"
              >
                <span className="absolute top-0 left-0 h-full w-0 bg-red-600 rounded-lg transition-all duration-300 group-hover:w-full"></span>
                <span className="relative">Vote Now</span>
              </Link>
            </li>
            <li>
              <Link
                href="/signin"
                className="group relative inline-block rounded-lg border-2 border-gray-700 px-8 py-3 text-lg font-bold text-white transition-all duration-300 hover:border-red-600"
              >
                <span className="absolute top-0 left-0 h-full w-full scale-x-0 bg-red-600/20 transition-transform duration-300 group-hover:scale-x-100"></span>
                <span className="relative">Login / Register</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-center mt-16 text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} CivicCast. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

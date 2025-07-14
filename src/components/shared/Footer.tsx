"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// The PhysicsSandbox and PhysicsWord components remain unchanged.
type PhysicsEnabledElement = HTMLDivElement & { body?: Matter.Body };

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const PhysicsWord = ({
  text,
  engine,
  onWordClick,
}: {
  text: string;
  engine: Matter.Engine;
  onWordClick: (word: string, element: PhysicsEnabledElement) => void;
}) => {
  const wordRef = useRef<PhysicsEnabledElement>(null);
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
    if (wordRef.current) {
      wordRef.current.body = body;
    }
  }, [text, engine]);
  return (
    <div
      ref={wordRef}
      onClick={() => {
        if (wordRef.current) {
          onWordClick(text, wordRef.current);
        }
      }}
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
  const handleWordClick = useCallback(
    (word: string, element: PhysicsEnabledElement) => {
      if (word === "AboutUs") {
        const body = element.body;
        if (!body) return;
        Matter.World.remove(engineRef.current.world, body);
        setWords((prev) => prev.filter((w) => w !== "AboutUs"));
        setTimeout(
          () => setWords((prev) => [...prev, "Pyro", "Dipankar"]),
          100
        );
      }
    },
    []
  );
  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;
    const runner = Matter.Runner.create();
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
          const el = wordElements[i] as PhysicsEnabledElement;
          const body = el.body;
          if (body) {
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
    <div ref={sceneRef} className="relative h-[300px] w-full cursor-grab">
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
  const { data: session } = useSession();
  const isSignedIn = !!session;

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
      className="relative z-20 overflow-hidden bg-[#080808] px-6 py-16 text-gray-400"
    >
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[80%] -translate-x-1/2 rounded-full bg-red-900/30 blur-[150px]"></div>
      <div className="absolute bottom-0 left-1/4 -z-10 h-[200px] w-[50%] rounded-full bg-gray-700/20 blur-[120px]"></div>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h3 className="text-4xl font-extrabold tracking-tighter text-white">
            An Interactive Democracy
          </h3>
          <p className="mt-2 text-lg text-gray-400">
            Drag the words around. Click &quot;AboutUs&quot; for a surprise.
          </p>
        </div>
        <PhysicsSandbox />
        <nav className="mt-16 border-t border-gray-800/50 pt-12">
          <ul className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            {/* FIX: The "Vote Now" button is now always visible */}
            <li>
              <Link
                href="/vote"
                className="group relative inline-block rounded-lg bg-gray-800/50 px-8 py-3 text-lg font-bold text-white transition-all duration-300 hover:bg-gray-800/80"
              >
                <span className="absolute top-0 left-0 h-full w-0 rounded-lg bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                <span className="relative">Vote Now</span>
              </Link>
            </li>

            {/* FIX: Only the authentication button is conditional */}
            <li>
              {isSignedIn ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="group relative inline-block rounded-lg border-2 border-gray-700 px-8 py-3 text-lg font-bold text-white transition-all duration-300 hover:border-red-600"
                >
                  <span className="absolute top-0 left-0 h-full w-full scale-x-0 bg-red-600/20 transition-transform duration-300 group-hover:scale-x-100"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </span>
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="group relative inline-block rounded-lg border-2 border-gray-700 px-8 py-3 text-lg font-bold text-white transition-all duration-300 hover:border-red-600"
                >
                  <span className="absolute top-0 left-0 h-full w-full scale-x-0 bg-red-600/20 transition-transform duration-300 group-hover:scale-x-100"></span>
                  <span className="relative">Sign In / Register</span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <div className="mt-16 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} CivicCast. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

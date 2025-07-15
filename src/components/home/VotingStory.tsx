"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const storyData = [
  {
    id: 1,
    title: "The Power of Your Vote",
    text: "Voting is the cornerstone of democracy, giving every citizen a voice and shaping the future of their community and nation.",
    img: "https://plus.unsplash.com/premium_photo-1708598525588-eae2b2d05a9e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Fair Chance for All",
    text: "Elections ensure a fair chance for all candidates to represent the people, fostering equality and preventing dominance by a select few.",
    img: "https://images.unsplash.com/photo-1534293230397-c067fc201ab8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Building a Strong Democracy",
    text: "Your vote helps build a transparent and accountable government, strengthening the foundations of a just and equitable society.",
    img: "https://plus.unsplash.com/premium_photo-1663090950403-4ad1b5dc2e5a?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Make Your Voice Heard",
    text: "Every vote counts, contributing to the collective decision-making process and allowing citizens to participate directly in their governance.",
    img: "https://images.unsplash.com/photo-1597701548622-cf60627fd70a?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

function ParticleCanvas({ scrollProgress }: { scrollProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedY: Math.random() * 0.5 + 0.1,
    }));

    function animate() {
      if (!canvas) return;
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const red = 229;
      const green = 255 - 246 * scrollProgress;
      const blue = 255 - 235 * scrollProgress;
      const particleColor = `rgb(${red}, ${green}, ${blue})`;

      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) p.y = canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = 0.5 + scrollProgress * 0.5;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function VotingStory() {
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLDivElement>(".story-panel");
      const totalPanels = panels.length;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${totalPanels * 1500}`,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      panels.forEach((panel, i) => {
        const title = panel.querySelector("h2");
        const text = panel.querySelector("p");
        const imageContainer = panel.querySelector(".image-container");
        const image = panel.querySelector(".story-image");

        if (!title || !text || !imageContainer || !image) return;

        // Split title for character animation
        const splitTitle = (title.textContent || "")
          .split("")
          .map(
            (char) =>
              `<span class="char inline-block">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        title.innerHTML = splitTitle;
        const titleChars = title.querySelectorAll(".char");

        const splitWordsAndKeepSpaces = (element: Element) => {
          const words: HTMLElement[] = [];
          const textContent = element.textContent || "";
          element.innerHTML = ""; // Clear original content

          textContent.split(" ").forEach((wordString) => {
            if (wordString.length > 0) {
              const wordSpan = document.createElement("span");
              wordSpan.textContent = wordString;
              wordSpan.className = "word inline-block";
              element.appendChild(wordSpan);
              words.push(wordSpan);
            }
            const spaceNode = document.createTextNode(" ");
            element.appendChild(spaceNode);
          });
          return words;
        };
        const textWords = splitWordsAndKeepSpaces(text);

        const panelTl = gsap.timeline();

        panelTl
          .to(panel, { autoAlpha: 1, duration: 0.3 })
          .from(titleChars, {
            y: 50,
            opacity: 0,
            stagger: 0.03,
            ease: "power2.out",
          })
          .from(
            textWords,
            { y: 20, opacity: 0, stagger: 0.02, ease: "power2.out" },
            "-=0.5"
          )
          .fromTo(
            imageContainer,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "power3.inOut",
            },
            "-=0.7"
          )
          .from(image, { scale: 1.2, duration: 1.5, ease: "power2.out" }, "<");

        if (i < totalPanels - 1) {
          panelTl.to(panel, {
            autoAlpha: 0,
            scale: 0.95,
            filter: "blur(10px)",
            duration: 1.5,
            ease: "power2.in",
            delay: 0.5,
          });
        }

        masterTl.add(panelTl);
      });
    },
    { scope: pinContainerRef }
  );

  return (
    <div className="relative py-20 bg-[#0a0a0a] overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 pointer-events-none">
        <div
          className="h-full bg-[#e50914]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <ParticleCanvas scrollProgress={progress} />

      <div ref={pinContainerRef} className="relative w-full h-screen z-10">
        {storyData.map((story) => (
          <div
            key={story.id}
            className="story-panel absolute inset-0 flex flex-col items-center justify-center opacity-0 px-6"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                {story.title}
              </h2>
              <p className="text-gray-300 text-lg md:text-xl mb-8">
                {story.text}
              </p>
              <div
                className="image-container relative w-full h-80 rounded-lg overflow-hidden shadow-2xl mx-auto"
                style={{ maxWidth: "600px" }}
              >
                <Image
                  src={story.img}
                  alt={story.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="story-image object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

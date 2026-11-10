"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export type MascotPose =
  | "yarn"
  | "cloud"
  | "sleepy"
  | "celebrating"
  | "checklist"
  | "laptop"
  | "sleeping"
  | "peek"
  | "avatar"
  | "logo"
  | "rest";

interface NimiiMascotProps {
  pose?: MascotPose;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  animate?: boolean;
  withShadow?: boolean;
}

const POSE_IMAGES: Record<MascotPose, string> = {
  yarn: "/images/mascot/nimii-3d-yarn.png",
  cloud: "/images/mascot/nimii-3d-cloud.png",
  sleepy: "/images/mascot/nimii-3d-rest.png",
  rest: "/images/mascot/nimii-3d-rest.png",
  celebrating: "/images/mascot/nimii-3d-celebrating.png",
  checklist: "/images/mascot/nimii-3d-checklist.png",
  laptop: "/images/mascot/nimii-3d-laptop.png",
  sleeping: "/images/mascot/nimii-3d-sleeping.png",
  peek: "/images/mascot/nimii-3d-peek.png",
  avatar: "/images/mascot/nimii-3d-avatar.png",
  logo: "/images/mascot/nimii-3d-logo.png",
};

const SIZES = {
  sm: "w-[clamp(28px,3vw,36px)] h-[clamp(28px,3vw,36px)]",
  md: "w-[clamp(48px,5vw,60px)] h-[clamp(48px,5vw,60px)]",
  lg: "w-[clamp(80px,8vw,104px)] h-[clamp(80px,8vw,104px)]",
  xl: "w-[clamp(120px,13vw,160px)] h-[clamp(90px,10vw,120px)]",
  hero: "w-[clamp(180px,20vw,280px)] h-[clamp(115px,13vw,160px)]",
};

export function NimiiMascot({
  pose = "yarn",
  size = "md",
  className = "",
  animate = true,
  withShadow = true,
}: NimiiMascotProps) {
  const shouldReduceMotion = useReducedMotion();
  const src = POSE_IMAGES[pose] || POSE_IMAGES.yarn;

  const content = (
    <div
      className={`relative select-none inline-block ${SIZES[size]} ${className}`}
    >
      {/* 3D Character contact shadow */}
      {withShadow && pose !== "peek" && pose !== "avatar" && pose !== "logo" && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2.5 bg-black/10 blur-sm rounded-full pointer-events-none"
          aria-hidden="true"
        />
      )}

      <Image
        src={src}
        alt={`Nimii fluffy 3D kitten mascot (${pose})`}
        fill
        className="object-contain relative z-10 drop-shadow-sm"
        priority={size === "hero" || pose === "yarn" || pose === "cloud"}
      />
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="inline-block cursor-pointer"
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -5, 0],
                rotate: [0, 0.4, -0.4, 0],
              }
        }
        transition={{
          duration: 3.8,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        {content}
      </motion.div>
    </motion.div>
  );
}

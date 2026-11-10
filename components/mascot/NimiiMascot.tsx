"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
  | "logo";

interface NimiiMascotProps {
  pose?: MascotPose;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  animate?: boolean;
}

const POSE_IMAGES: Record<MascotPose, string> = {
  yarn: "/images/mascot/kitten-yarn.png",
  cloud: "/images/mascot/kitten-cloud.png",
  sleepy: "/images/mascot/kitten-sleepy.png",
  celebrating: "/images/mascot/kitten-celebrating.png",
  checklist: "/images/mascot/kitten-checklist.png",
  laptop: "/images/mascot/kitten-laptop.png",
  sleeping: "/images/mascot/kitten-sleeping.png",
  peek: "/images/mascot/kitten-chat-peek.png",
  avatar: "/images/mascot/nimii-avatar.png",
  logo: "/images/mascot/nimii-logo.png",
};

const SIZES = {
  sm: "w-8 h-8",
  md: "w-14 h-14",
  lg: "w-24 h-24",
  xl: "w-40 h-32",
  hero: "w-64 h-48 md:w-80 md:h-56",
};

export function NimiiMascot({
  pose = "yarn",
  size = "md",
  className = "",
  animate = true,
}: NimiiMascotProps) {
  const src = POSE_IMAGES[pose] || POSE_IMAGES.yarn;

  const content = (
    <div className={`relative select-none pointer-events-none inline-block ${SIZES[size]} ${className}`}>
      <Image
        src={src}
        alt="Nimii fluffy kitten mascot"
        fill
        className="object-contain"
        priority
      />
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="inline-block"
    >
      <div className="animate-soft-bounce">{content}</div>
    </motion.div>
  );
}

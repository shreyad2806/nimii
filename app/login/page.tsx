"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsGuest, updateUser } = useApp();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setStatusMessage("Connecting with Google...");
    setTimeout(() => {
      updateUser({
        name: "Shreya Dubey",
        email: "shreya.dubey@gmail.com",
        avatarInitial: "S",
        isGuest: false,
        status: "Online",
      });
      setIsLoading(false);
      router.push("/app");
    }, 700);
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setStatusMessage("Authenticating...");
    setTimeout(() => {
      updateUser({
        name: email.split("@")[0],
        email: email,
        avatarInitial: email[0].toUpperCase(),
        isGuest: false,
        status: "Online",
      });
      setIsLoading(false);
      router.push("/app");
    }, 700);
  };

  const handleGuestDemo = () => {
    loginAsGuest();
    router.push("/app");
  };

  return (
    <div className="min-h-screen w-full relative bg-[#F6F4FC] scenic-background flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background scenic overlay */}
      <div className="fixed inset-0 pointer-events-none scenic-background-overlay opacity-80 z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Brand Hero & Illustration */}
        <div className="lg:col-span-7 flex flex-col justify-between py-4 px-2 md:px-6 space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-12 h-12">
              <Image
                src="/images/mascot/nimii-3d-avatar.png?v=3d"
                alt="Nimii 3D Mascot Logo"
                fill
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-[#1E1B4B] tracking-tight">Nimii</span>
              <span className="text-xs font-bold text-[#8B5CF6]">®</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-1 max-w-lg">
            <h1 className="text-3xl md:text-5xl font-black text-[#1E1B4B] leading-tight tracking-tight">
              Your AI companion,{" "}
              <span className="relative inline-block text-[#6C5CE7] italic">
                always
                <svg
                  className="absolute left-0 -bottom-1 w-full text-[#6C5CE7]"
                  height="8"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q50,0 100,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              by your side
            </h1>
            <p className="text-sm md:text-base text-[#64748B] pt-1 font-medium">
              Search. Remember. Get things done.
            </p>
          </div>

          {/* 3D Mascot sleeping on soft lavender cloud artwork */}
          <div className="relative w-full max-w-lg h-[clamp(220px,25vw,320px)] select-none pointer-events-none animate-soft-bounce">
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-3 bg-black/10 blur-md rounded-full pointer-events-none"
              aria-hidden="true"
            />
            <Image
              src="/images/mascot/nimii-3d-cloud.png"
              alt="Nimii 3D kitten sleeping nestled on soft lavender cloud"
              fill
              className="object-contain relative z-10 drop-shadow-md"
              priority
            />
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-4xl p-8 md:p-10 border border-white shadow-2xl shadow-[#6C5CE7]/10 flex flex-col gap-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl md:text-3xl font-black text-[#1E1B4B] tracking-tight">
                Welcome to Nimii!
              </h2>
              <p className="text-xs md:text-sm text-[#7C7F96]">
                Sign in to access your memories, loops and more.
              </p>
            </div>

            {statusMessage && (
              <div className="p-3 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] text-xs font-semibold text-center flex items-center justify-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Social & Email Buttons */}
            <div className="flex flex-col gap-3">
              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl border border-[#E2DEFA] hover:border-[#6C5CE7] bg-white hover:bg-[#FAF8FF] font-semibold text-sm text-[#1E1B4B] shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Email Sign In Toggle */}
              {!showEmailForm ? (
                <button
                  onClick={() => setShowEmailForm(true)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl border border-[#E2DEFA] hover:border-[#6C5CE7] bg-white hover:bg-[#FAF8FF] font-semibold text-sm text-[#1E1B4B] shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
                >
                  <Mail className="w-5 h-5 text-[#6C5CE7]" />
                  <span>Continue with Email</span>
                </button>
              ) : (
                <form onSubmit={handleEmailSignIn} className="space-y-3 pt-2">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE] text-sm text-[#1E1B4B] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Enter your password (optional)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE] text-sm text-[#1E1B4B] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5B46D9] text-white font-bold text-sm shadow-md transition-all"
                  >
                    Sign In with Email
                  </button>
                </form>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#F1EFF8] w-full" />
              <span className="bg-white px-3 text-xs text-[#94A3B8] font-medium absolute">
                or
              </span>
            </div>

            {/* Try as Guest Button */}
            <div className="space-y-2 text-center">
              <button
                onClick={handleGuestDemo}
                className="w-full flex items-center justify-between py-3.5 px-6 rounded-2xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6C5CE7] font-bold text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🐱</span>
                  <span>Try as Guest</span>
                </div>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <p className="text-[11px] text-[#7C7F96]">
                Explore Nimii with limited features. No account required!
              </p>
            </div>

            {/* Terms and Privacy */}
            <p className="text-[11px] text-[#94A3B8] text-center leading-relaxed pt-2">
              By continuing, you agree to our{" "}
              <Link href="/app/settings" className="underline hover:text-[#6C5CE7]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/app/settings" className="underline hover:text-[#6C5CE7]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

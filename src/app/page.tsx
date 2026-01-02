"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Brain,
  Target,
  BookOpen,
  Zap,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Tablet Mockup Component with Interactive Mouse Tracking
function TabletMockup({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    function updateRect() {
      const container = document.getElementById("tablet-container");
      if (container) {
        setContainerRect(container.getBoundingClientRect());
      }
    }
    updateRect(); // Initialize on mount
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  const rotateX = containerRect
    ? ((mousePosition.y - containerRect.top - containerRect.height / 2) / 100) *
      5
    : 0;
  const rotateY = containerRect
    ? ((mousePosition.x - containerRect.left - containerRect.width / 2) / 100) *
      -5
    : 0;

  return (
    <div
      id="tablet-container"
      className="relative w-full h-full flex items-center justify-center"
    >
      <div
        className="w-full max-w-md transition-transform duration-200 ease-out"
        style={{
          transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Tablet Bezel */}
        <div className="relative bg-secondary rounded-3xl p-3 shadow-2xl">
          {/* Screen */}
          <div className="relative bg-white rounded-2xl overflow-hidden aspect-video">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-secondary rounded-b-2xl z-20" />

            <div className="w-full h-full bg-white p-6 flex flex-col justify-center items-center">
              <div className="space-y-4 w-full">
                <div className="h-3 bg-primary rounded-full w-3/4 mx-auto" />
                <div className="h-2 bg-primary rounded-full w-1/2 mx-auto" />
                <div className="space-y-3 mt-6">
                  <div className="h-12 bg-primary rounded-lg" />
                  <div className="h-12 bg-accent rounded-lg" />
                  <div className="h-12 bg-primary rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard */}
          <div className="mt-2 px-4 py-3 bg-secondary/80 rounded-2xl">
            <div className="grid grid-cols-12 gap-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-2 bg-secondary/50 rounded" />
              ))}
            </div>
            <div className="flex gap-1 mt-2">
              <div className="flex-1 h-2 bg-secondary/50 rounded" />
              <div className="flex-1 h-2 bg-secondary/50 rounded" />
              <div className="flex-1 h-2 bg-secondary/50 rounded" />
            </div>
          </div>

          {/* Stand */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-2 bg-secondary rounded-full blur-md opacity-50" />
        </div>

        {/* Floating elements around Tablet */}
        <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 opacity-0 animate-float pointer-events-none">
          <div className="w-full h-full rounded-full border-2 border-primary/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen size={24} className="text-primary/40" />
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 w-32 h-32 -ml-12 -mb-10 opacity-0 animate-float pointer-events-none"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-full h-full rounded-full border-2 border-accent/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Zap size={24} className="text-accent/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section - Premium Split Layout */}
      <section className="relative w-full min-h-screen flex items-center pt-20 pb-12 md:pt-32 md:pb-20 overflow-hidden bg-background">
        {/* Background accent elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Compelling Copy with Bold Typography */}
            <div className="space-y-8 order-2 lg:order-1">
              <div
                className="space-y-6 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                {/* Premium badge */}
                <div className="inline-flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-glow-pulse absolute inline-flex h-full w-full rounded-full bg-accent/60"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    Transform Your Learning
                  </span>
                </div>

                {/* Main headline with bold styling */}
                <h1 className="text-6xl md:text-7xl lg:text-7xl font-bold tracking-tighter text-foreground leading-tight">
                  Learn Smarter,
                  <br />
                  <span className="relative">
                    Score Better
                    <span className="absolute bottom-2 left-0 h-3 w-32 bg-accent/20 -z-10 rounded-sm" />
                  </span>
                </h1>

                {/* Premium subheading */}
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg font-medium">
                  India&apos;s most comprehensive learning platform. Master any
                  subject across CBSE, ICSE, and state boards with expert-led
                  video lectures, interactive notes, AI-powered mind maps, and
                  adaptive quizzes.
                </p>
              </div>

              {/* CTA Buttons - Premium styling */}
              <div
                className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Learning
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background text-foreground rounded-xl font-semibold text-lg border-2 border-foreground/20 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 active:scale-95"
                >
                  Explore Features
                </Link>
              </div>

              {/* Trust Metrics - Enhanced layout */}
              <div
                className="grid grid-cols-3 gap-6 pt-12 border-t border-border animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                {[
                  { number: "15K+", label: "Active Students" },
                  { number: "1000+", label: "Video Lectures" },
                  { number: "95%", label: "Pass Rate" },
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-4xl font-bold bg-linear-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground font-semibold">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive Tablet Mockup */}
            <div
              className="relative h-96 md:h-full min-h-96 flex items-center justify-center order-1 lg:order-2 animate-scale-in"
              style={{ animationDelay: "0.3s" }}
            >
              <TabletMockup mousePosition={mousePosition} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bold Dynamic Layouts */}
      <section className="w-full py-24 md:py-40 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24 md:space-y-32">
            {/* Section Header */}
            <div className="text-center space-y-4 animate-slide-up">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight">
                Why Students Love
                <br />
                <span className="text-primary">Tekurious</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                Designed by educators who understand the Indian exam system
              </p>
            </div>

            {/* Feature 1 - Left Content, Right Visual */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6 animate-slide-up">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-semibold text-primary">
                    Expert Video Lectures
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                  Learn from Subject
                  <br />
                  <span className="text-primary">Experts</span>
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  50-minute structured lessons breaking down complex concepts.
                  Every video is crafted to match your board&apos;s curriculum
                  with real exam-pattern questions.
                </p>
                <ul className="space-y-4">
                  {[
                    "Step-by-step concept breakdown",
                    "Real exam pattern practice",
                    "Board-specific curriculum",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      <span className="text-base font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-80 md:h-96">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl border-2 border-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center group cursor-pointer">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play
                        size={48}
                        className="text-primary/60 group-hover:text-primary/80 transition-colors"
                      />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-primary/30 group-hover:border-primary/60 transition-all duration-300 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Right Content, Left Visual */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative h-80 md:h-96 order-2 md:order-1">
                <div className="absolute inset-0 bg-linear-to-br from-accent/10 to-accent/5 rounded-3xl border-2 border-accent/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-accent/15 flex items-center justify-center">
                      <Brain size={48} className="text-accent/60" />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-accent/30 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-6 order-1 md:order-2 animate-slide-up">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-sm font-semibold text-accent">
                    Visual Learning
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                  Mind Maps That
                  <br />
                  <span className="text-accent">Stick</span>
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  Interconnected visual hierarchies that show how concepts
                  relate. Research shows visual learning improves retention by
                  up to 65%.
                </p>
                <ul className="space-y-4">
                  {[
                    "Connected concept hierarchies",
                    "Quick revision summaries",
                    "Downloadable formats",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                      <span className="text-base font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 - Left Content, Right Visual */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6 animate-slide-up">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm font-semibold text-primary">
                    Adaptive Learning
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                  Quizzes That
                  <br />
                  <span className="text-primary">Adapt</span>
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  Our AI learns your weak areas and adjusts difficulty
                  accordingly. Get instant feedback with detailed explanations
                  for every answer.
                </p>
                <ul className="space-y-4">
                  {[
                    "2000+ practice questions",
                    "Adaptive difficulty levels",
                    "Instant detailed feedback",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                      <span className="text-base font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-80 md:h-96">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl border-2 border-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center">
                      <Target size={48} className="text-primary/60" />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-primary/30 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board Coverage - Distinctive Layout */}
      <section className="w-full py-24 md:py-40 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 animate-slide-up">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                One Platform,
                <br />
                <span className="text-primary">Every Board</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                Complete coverage for CBSE, ICSE, and all state boards
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  board: "CBSE",
                  icon: BookOpen,
                  desc: "All classes & subjects with NCERT-aligned curriculum",
                },
                {
                  board: "ICSE",
                  icon: Sparkles,
                  desc: "Complete curriculum with ISC support",
                },
                {
                  board: "State Boards",
                  icon: Zap,
                  desc: "Coverage across multiple Indian states",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="group relative p-8 rounded-2xl border-2 border-foreground/10 bg-background hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                        <Icon
                          className="text-primary/60 group-hover:text-primary transition-colors"
                          size={24}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.board}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-b-2xl" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section - Coming Soon */}
      <section className="w-full py-24 md:py-40 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 animate-slide-up">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full border border-accent/40">
                <Sparkles size={16} className="text-accent" />
                <span className="text-sm font-semibold text-accent">
                  Coming Soon
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                The Future of
                <br />
                <span className="text-accent">Learning</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                Immersive AR and VR experiences are coming
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "VR Science Labs",
                  description:
                    "Conduct virtual experiments in immersive 3D environments. Understand physics, chemistry, and biology through hands-on experimentation.",
                  color: "primary",
                },
                {
                  title: "AR Learning Companion",
                  description:
                    "Visualize 3D molecular structures, geometric figures, and complex diagrams in your real environment using AR technology.",
                  color: "accent",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative p-8 md:p-12 rounded-3xl border-2 border-foreground/10 bg-background hover:border-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-all duration-300 -z-10" />
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    {item.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    {item.description}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    Coming Soon
                    <ArrowRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Premium Layout */}
      <section className="w-full py-24 md:py-40 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 animate-slide-up">
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                Loved by
                <br />
                <span className="text-primary">Students & Parents</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                Join 15,000+ students transforming their academics
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "I scored 94 in Physics! The lectures made complex concepts so simple.",
                  author: "Ananya, Class 12",
                  rating: 5,
                },
                {
                  quote:
                    "Best investment for my daughter's education. Her grades improved from 72 to 88.",
                  author: "Rajesh, Parent",
                  rating: 5,
                },
                {
                  quote:
                    "Mind maps made studying Chemistry fun. I actually enjoy learning now!",
                  author: "Priya, Class 11",
                  rating: 5,
                },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-muted/40 border-2 border-foreground/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300 space-y-4"
                >
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-accent text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed italic text-lg font-medium">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <p className="font-semibold text-sm text-primary">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold and Premium */}
      <section className="w-full py-24 md:py-40 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-slide-up">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight">
            Ready to Transform
            <br />
            Your Academics?
          </h2>
          <p className="text-xl text-primary-foreground/90 leading-relaxed font-medium max-w-2xl mx-auto">
            Join 15,000+ students achieving their dream scores. Start learning
            free today—no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
            >
              Start Free Trial
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground/20 text-primary-foreground rounded-xl font-semibold text-lg border-2 border-primary-foreground/40 hover:border-primary-foreground/70 hover:bg-primary-foreground/30 transition-all duration-300 active:scale-95"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

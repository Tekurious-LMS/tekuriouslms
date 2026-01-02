"use client";

import { useEffect, useRef, useState } from "react";

export default function TabletMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left - rect.width / 2) / 20,
        y: (e.clientY - rect.top - rect.height / 2) / 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center perspective"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full max-w-2xl"
        style={{
          transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Tablet Frame */}
        <div className="relative w-full bg-linear-to-b from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-900">
          {/* Screen */}
          <div className="aspect-video bg-linear-to-br from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
            {/* Content Display */}
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white">
              {/* Platform Preview */}
              <div className="w-full h-full bg-background rounded-lg overflow-hidden shadow-inner">
                {/* Tekurious Platform Preview */}
                <div className="p-6 h-full flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div className="font-bold text-primary">
                      Tekurious Learning Hub
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-muted rounded-full"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {/* Card 1 */}
                    <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-center border border-primary/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          ₹500
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Enrollment Cost
                        </div>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-secondary/10 rounded-lg p-4 flex items-center justify-center border border-secondary/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary mb-1">
                          1000+
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Video Lectures
                        </div>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-accent/10 rounded-lg p-4 flex items-center justify-center border border-accent/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent mb-1">
                          5000+
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Practice Problems
                        </div>
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-center border border-primary/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          24/7
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Access Anytime
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-2 bg-slate-900 rounded-b-3xl" />

          {/* Tablet Base */}
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-linear-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        {/* Stand */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-linear-to-r from-slate-900 via-slate-700 to-slate-900 rounded-full shadow-lg" />
      </div>
    </div>
  );
}

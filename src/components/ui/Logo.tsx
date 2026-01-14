"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    // Keeping props optional but unused to prevent breaking changes if passed
    width?: number;
    height?: number;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("relative h-8 w-auto aspect-[3/1]", className)}>
            {/* Aspect padding or just rely on image. Using h-8 w-auto on container is safe if images are loaded. 
                 But Next Image needs known width/height if not fill. 
                 Using 'sizes' and 'fill' is good, but 'w-auto' on container doesn't work well with fill.
                 Better: Use standard img tag for SVGs if we want perfect auto sizing, OR Next Image with 'width={0} height={0}' and style.
             */}
            <Image
                src="/logo_light.svg"
                alt="Tekurious LMS"
                width={0}
                height={0}
                sizes="100vw"
                className="block dark:hidden h-full w-auto object-contain"
                priority
            />
            <Image
                src="/logo_dark.svg"
                alt="Tekurious LMS"
                width={0}
                height={0}
                sizes="100vw"
                className="hidden dark:block h-full w-auto object-contain"
                priority
            />
        </div>
    );
}

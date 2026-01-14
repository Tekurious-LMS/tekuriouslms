"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
    ArrowRight,
    BookOpen,
    Users,
    BarChart3,
    Calendar,
    CheckCircle2,
    Box,
    Glasses,
    GraduationCap,
    School,
    ShieldCheck,
    UserCheck,
    Globe,
    Sun,
    Moon
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background sticky top-0 z-50">
                <Link className="flex items-center justify-center gap-2" href="#">
                    <Logo />
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
                    <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#features">
                        Features
                    </Link>
                    <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#roles">
                        Solutions
                    </Link>
                    <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#immersive">
                        AR/VR
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="mr-2"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <div className="flex items-center gap-2 ml-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Login</Button>
                        </Link>
                        <Link href="/users">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background relative overflow-hidden">
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
                    {/* Floating Elements (Decorative) */}
                    <div className="absolute top-20 left-10 md:left-20 animate-bounce delay-700 opacity-20 dark:opacity-10">
                        <Box className="h-12 w-12 text-primary rotate-12" />
                    </div>
                    <div className="absolute bottom-40 right-10 md:right-20 animate-bounce delay-1000 opacity-20 dark:opacity-10">
                        <Glasses className="h-16 w-16 text-purple-500 -rotate-12" />
                    </div>

                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <Badge className="w-fit" variant="secondary">Next-Gen Education</Badge>
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        A Unified Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 dark:to-emerald-400">Schools, Teachers & Students</span>
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Manage multi-tenant campuses, deliver live classes, and prepare for the future with upcoming AI and AR/VR integration.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href="/users">
                                        <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                                            Get Started <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button size="lg" variant="outline">
                                            Login
                                        </Button>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4 text-primary" /> Multi-tenant Ready
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4 text-primary" /> Analytics Driven
                                    </div>
                                </div>
                            </div>
                            <div className="mx-auto aspect-video overflow-hidden rounded-xl border bg-muted/50 p-4 lg:order-last w-full shadow-2xl shadow-primary/10">
                                <div className="w-full h-full bg-background rounded-lg border shadow-sm flex items-center justify-center text-muted-foreground relative group overflow-hidden">
                                    <span className="z-10 font-medium relative">Dashboard Preview</span>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-100" />
                                    {/* Mock UI Lines */}
                                    <div className="absolute top-10 left-4 right-4 h-2 bg-muted rounded-full opacity-20" />
                                    <div className="absolute top-16 left-4 right-12 h-2 bg-muted rounded-full opacity-20" />
                                    <div className="absolute bottom-0 right-0 p-10 opacity-10">
                                        <BarChart3 className="h-32 w-32" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features Grid */}
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/10 border-y">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Platform Features</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Everything you need to run a modern educational institution.
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <School className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Multi-Tenant Architecture</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Manage multiple schools, branches, and departments from a single super-admin dashboard.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <BookOpen className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Course Management</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Create rich curriculum with videos, notes, and interactive content. seamless enrollment logic.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <BarChart3 className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Analytics Ready</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Deep insights into student performance, attendance trends, and faculty effectiveness.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Calendar className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Live Classes & Schedule</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Integrated timetable with support for live video sessions and automated attendance.</p>
                                </CardContent>
                            </Card>
                            <Card className="border-primary/50 bg-primary/5">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Box className="h-10 w-10 text-primary mb-2" />
                                        <Badge>Coming Soon</Badge>
                                    </div>
                                    <CardTitle>AR / VR Learning</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Immersive 3D models and virtual labs to explain complex concepts visually.</p>
                                </CardContent>
                            </Card>
                            <Card className="border-primary/50 bg-primary/5">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Glasses className="h-10 w-10 text-primary mb-2" />
                                        <Badge>Coming Soon</Badge>
                                    </div>
                                    <CardTitle>AI Tutor Access</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Personalized AI assistance for students to clear doubts 24/7.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* NEW: Flexible Learning Environment (Text Left, Image Right) */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-background border-t">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-4">
                                <Badge variant="secondary" className="w-fit">Flexibility</Badge>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Learn Anything, Anytime</h2>
                                <p className="text-muted-foreground md:text-lg">
                                    Our platform adapts to your schedule. Whether you're a night owl or an early bird, access your course materials, recorded lectures, and assignments 24/7.
                                </p>
                                <ul className="space-y-2 mt-4">
                                    <li className="flex items-center gap-2 text-sm text-foreground/80">
                                        <CheckCircle2 className="h-4 w-4 text-primary" /> Offline access support
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-foreground/80">
                                        <CheckCircle2 className="h-4 w-4 text-primary" /> Mobile-first optimized design
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-foreground/80">
                                        <CheckCircle2 className="h-4 w-4 text-primary" /> Seamless sync across devices
                                    </li>
                                </ul>
                            </div>
                            <div className="mx-auto aspect-square overflow-hidden rounded-xl bg-muted/30 p-8 w-full flex items-center justify-center border shadow-sm">
                                {/* Placeholder Graphic */}
                                <div className="text-center space-y-4 text-muted-foreground/40">
                                    <div className="h-32 w-48 bg-muted rounded-lg mx-auto mb-4 animate-pulse" />
                                    <p>Image: Flexibility / Mobile Learning</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NEW: Role-Based (Image Left, Text Right) */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900/10 border-y">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
                            <div className="mx-auto aspect-square overflow-hidden rounded-xl bg-background p-8 w-full flex items-center justify-center border shadow-sm order-last lg:order-first">
                                {/* Placeholder Graphic */}
                                <div className="text-center space-y-4 text-muted-foreground/40">
                                    <div className="grid grid-cols-2 gap-2 max-w-[200px] mx-auto opacity-50">
                                        <div className="h-20 bg-muted rounded-md" />
                                        <div className="h-20 bg-muted rounded-md" />
                                        <div className="h-20 bg-muted rounded-md" />
                                        <div className="h-20 bg-muted rounded-md" />
                                    </div>
                                    <p>Image: Teachers & Students Collaboration</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Badge variant="secondary" className="w-fit">Ecosystem</Badge>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Built for Students, Teachers & Institutions</h2>
                                <p className="text-muted-foreground md:text-lg">
                                    Tekurious LMS connects the dots between all stakeholders. Teachers can focus on teaching, students on learning, and admins on managing—all in perfect harmony.
                                </p>
                                <div className="grid gap-2 text-sm mt-4">
                                    <div className="p-3 bg-background rounded-lg border shadow-sm">
                                        <p className="font-semibold">For Teachers</p>
                                        <p className="text-muted-foreground">Automated grading and attendance.</p>
                                    </div>
                                    <div className="p-3 bg-background rounded-lg border shadow-sm">
                                        <p className="font-semibold">For Admins</p>
                                        <p className="text-muted-foreground">Real-time fee and enrollment insights.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Immersive Learning Highlight (Dedicated Section) */}
                <section id="immersive" className="w-full py-12 md:py-24 lg:py-32 bg-background overflow-hidden relative">
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-muted/50 to-transparent pointer-events-none" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5">Future of EdTech</Badge>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Immersive AR/VR Learning</h2>
                            <p className="text-muted-foreground md:text-xl">
                                Step inside the textbook. Experience complex concepts through interactive virtual simulations and augmented reality models.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <Card className="group overflow-hidden border-muted-foreground/20 hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
                                <div className="aspect-video bg-muted/30 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                                    <Box className="h-16 w-16 text-muted-foreground/20 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-500" />
                                    <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground border shadow-sm">Coming Soon</Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle>Virtual Labs</CardTitle>
                                    <CardDescription>Safe Chemical Experiments</CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Mix volatile chemicals and observe reactions without any physical danger. safe, repeatable, and cost-effective.
                                </CardContent>
                                <CardFooter>
                                    <Button variant="ghost" className="w-full group-hover:bg-primary/5" disabled>Enter Lab</Button>
                                </CardFooter>
                            </Card>

                            {/* Card 2 */}
                            <Card className="group overflow-hidden border-muted-foreground/20 hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm relative top-0 md:-top-8 shadow-xl">
                                <div className="aspect-video bg-muted/30 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
                                    <Glasses className="h-16 w-16 text-muted-foreground/20 group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-500" />
                                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-sm">Featured</Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle>Human Anatomy AR</CardTitle>
                                    <CardDescription>Interactive Biological Systems</CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Visualize the human heart, brain, and skeletal systems in high-fidelity 3D. Rotate, zoom, and dissect virtually.
                                </CardContent>
                                <CardFooter>
                                    <Button variant="default" className="w-full shadow-lg shadow-primary/20" disabled>Launch AR View</Button>
                                </CardFooter>
                            </Card>

                            {/* Card 3 */}
                            <Card className="group overflow-hidden border-muted-foreground/20 hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
                                <div className="aspect-video bg-muted/30 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
                                    <Globe className="h-16 w-16 text-muted-foreground/20 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500" />
                                    <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground border shadow-sm">Coming Soon</Badge>
                                </div>
                                <CardHeader>
                                    <CardTitle>History Portals</CardTitle>
                                    <CardDescription>Time Travel Simulation</CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    Walk through the streets of Ancient Rome or visit the Pyramids of Giza. History lesson reimagined.
                                </CardContent>
                                <CardFooter>
                                    <Button variant="ghost" className="w-full group-hover:bg-primary/5" disabled>Start Journey</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
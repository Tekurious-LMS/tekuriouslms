"use client";

import Link from "next/link";
import { BookOpen, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full py-12 bg-background border-t">
            <div className="container px-4 md:px-6 mx-auto grid md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <Link className="flex items-center gap-2" href="/">
                        <div className="bg-primary text-primary-foreground p-1 rounded-md">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-lg">Tekurious</span>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        Empowering the next generation of learners with immersive technology.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-4 w-4" /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-4 w-4" /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-4 w-4" /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-4 w-4" /></Link>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Product</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/#features" className="hover:text-foreground">Features</Link></li>
                        <li><Link href="/#immersive" className="hover:text-foreground">AR/VR Learning</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Roadmap</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Company</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Contact</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Sales: sales@tekurious.com</li>
                        <li>Support: help@tekurious.com</li>
                        <li>Phone: 99994 63641</li>
                        <li>Address: 123 Education Lane, Tech City</li>
                    </ul>
                </div>
            </div>
            <div className="container px-4 md:px-6 mx-auto mt-12 pt-8 border-t text-center text-xs text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
                <span>© 2024 Tekurious LMS. All rights reserved.</span>
                <div className="flex gap-4">
                    <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                    <Link href="#" className="hover:text-foreground">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}

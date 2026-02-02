import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                T
              </div>
              <span className="font-bold text-lg">Tekurious</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering Indian students with comprehensive online learning
              resources.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="p-2 bg-foreground/10 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Learning */}
          <div>
            <h3 className="font-semibold mb-4 text-primary-foreground">
              Learning
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                "Video Lectures",
                "Interactive Notes",
                "Mind Maps",
                "Quizzes",
                "PYQs",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-primary-foreground">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {["About Us", "Careers", "Blog", "Press"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-primary-foreground">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <Mail size={16} className="shrink-0 mt-0.5" />
                <a
                  href="mailto:support@tekurious.com"
                  className="hover:text-primary transition-colors"
                >
                  support@tekurious.com
                </a>
              </li>
              <li className="flex gap-2">
                <Phone size={16} className="shrink-0 mt-0.5" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-primary transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Tekurious. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

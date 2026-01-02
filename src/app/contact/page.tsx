import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="w-full py-16 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you. Our
            team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="w-full py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>

              <form className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option>Select a subject</option>
                    <option>Course Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Partnership Opportunity</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-bold">Contact Information</h2>

              {/* Email */}
              <div className="flex gap-4 p-6 rounded-lg bg-primary/8 border border-primary/20 hover:border-primary/40 transition-all duration-300 group cursor-pointer">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail size={24} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:support@tekurious.com"
                    className="text-primary hover:underline"
                  >
                    support@tekurious.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll respond within 24 hours
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 p-6 rounded-lg bg-secondary/8 border border-secondary/20 hover:border-secondary/40 transition-all duration-300 group cursor-pointer">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-secondary/15 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Phone size={24} className="text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a
                    href="tel:+919876543210"
                    className="text-secondary hover:underline"
                  >
                    +91 98765 43210
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monday to Friday, 9 AM - 6 PM IST
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-4 p-6 rounded-lg bg-accent/10 border border-accent/20 hover:border-accent/40 transition-all duration-300 group cursor-pointer">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-accent/15 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <MapPin size={24} className="text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Office Location</h3>
                  <p className="text-foreground">Bangalore, India</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    TechPark Building, Sector 7
                  </p>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="p-6 rounded-lg bg-muted/50 border border-border">
                <h3 className="font-semibold mb-2">
                  Frequently Asked Questions
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check out our FAQ section for quick answers to common
                  questions.
                </p>
                <a
                  href="/faq"
                  className="text-primary hover:underline font-medium text-sm"
                >
                  View FAQs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="w-full py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            More Ways to Reach Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Live Chat",
                description:
                  "Chat with our support team in real-time for immediate assistance.",
                action: "Start Chat",
              },
              {
                title: "Social Media",
                description:
                  "Connect with us on Instagram, Twitter, and Facebook for updates and tips.",
                action: "Follow Us",
              },
              {
                title: "Community Forum",
                description:
                  "Join our community forum to discuss topics with other students.",
                action: "Visit Forum",
              },
            ].map((method, idx) => (
              <div
                key={idx}
                className="p-8 rounded-lg bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg text-center animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {method.description}
                </p>
                <button className="text-primary hover:underline font-semibold">
                  {method.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

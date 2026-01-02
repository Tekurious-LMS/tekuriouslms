import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  BookOpen,
  Zap,
  Brain,
  Award,
  Users,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function Services() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-28 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Our Comprehensive Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in your studies, all in one platform
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid - Unique layout per service */}
      <section className="w-full py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {/* Service 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/8 rounded-lg border border-primary/20">
                  <BookOpen className="text-primary" size={20} />
                  <span className="text-sm font-semibold text-primary">
                    Video Lectures
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  1000+ Expert Video Lectures
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From fundamentals to advanced concepts, each lecture is
                  crafted by subject experts and aligned with your board&apos;s
                  curriculum. Progressive learning paths ensure you master every
                  topic.
                </p>
                <ul className="space-y-4">
                  {[
                    "Interactive explanations with real-world examples",
                    "Available in multiple languages",
                    "Downloadable for offline viewing",
                    "Subtitles and transcripts included",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-80 md:h-full">
                <div className="absolute inset-0 bg-primary/8 rounded-2xl border border-primary/20 flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen size={100} className="text-primary/30" />
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-80 md:h-full order-2 md:order-1">
                <div className="absolute inset-0 bg-secondary/8 rounded-2xl border border-secondary/20 flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={100} className="text-secondary/30" />
                </div>
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/8 rounded-lg border border-secondary/20">
                  <Zap className="text-secondary" size={20} />
                  <span className="text-sm font-semibold text-secondary">
                    Smart Quizzes
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Adaptive Assessment System
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Intelligent quizzes that adapt to your learning level. Get
                  real-time feedback, identify weak areas, and receive
                  personalized recommendations for improvement.
                </p>
                <ul className="space-y-4">
                  {[
                    "5000+ curated practice problems",
                    "Real-time performance analytics",
                    "Board-specific exam patterns",
                    "Instant solution explanations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Service 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
                  <Brain className="text-accent" size={20} />
                  <span className="text-sm font-semibold text-accent">
                    Mind Maps
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Visual Learning with Mind Maps
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Beautiful, interconnected mind maps for every chapter. Visual
                  learning improves retention and helps you see how concepts
                  relate to each other.
                </p>
                <ul className="space-y-4">
                  {[
                    "500+ professional mind maps",
                    "Customizable color schemes",
                    "Print-friendly formats",
                    "Quick revision summaries",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-80 md:h-full">
                <div className="absolute inset-0 bg-accent/8 rounded-2xl border border-accent/20 flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain size={100} className="text-accent/30" />
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-80 md:h-full order-2 md:order-1">
                <div className="absolute inset-0 bg-primary/8 rounded-2xl border border-primary/20 flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award size={100} className="text-primary/30" />
                </div>
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/8 rounded-lg border border-primary/20">
                  <Award className="text-primary" size={20} />
                  <span className="text-sm font-semibold text-primary">
                    PYQs
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Previous Year Questions
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Complete collection of previous year board exam questions with
                  detailed solutions. Understand exam patterns and build
                  confidence with authentic practice.
                </p>
                <ul className="space-y-4">
                  {[
                    "10+ years of exam papers",
                    "Topic-wise organization",
                    "Detailed step-by-step solutions",
                    "Difficulty assessment",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="w-full py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Additional Features
              </h2>
              <p className="text-lg text-muted-foreground">
                Beyond the core services
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Users,
                  title: "Peer Learning Community",
                  description:
                    "Connect with other students, share notes, and discuss concepts in forums.",
                },
                {
                  icon: Lightbulb,
                  title: "Doubt Support",
                  description:
                    "Get quick answers to your questions from expert tutors and community.",
                },
                {
                  icon: Award,
                  title: "Progress Tracking",
                  description:
                    "Detailed analytics showing your learning journey and improvement areas.",
                },
                {
                  icon: Users,
                  title: "Study Plans",
                  description:
                    "AI-powered personalized study schedules based on your pace and goals.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <feature.icon className="text-primary mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore all features with our free 7-day trial. No credit card
            required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold border border-secondary/30 hover:border-secondary/50 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

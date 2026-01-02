import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Download,
  BookOpen,
  Video,
  FileText,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function Resources() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-pretty">
              Free Resources & Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Download study materials, templates, and tools to enhance your
              learning journey
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories - Custom layout */}
      <section className="w-full py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Study Notes Category */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <BookOpen className="text-primary" size={32} />
                <h2 className="text-3xl font-bold">Study Notes & Summaries</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Physics Class 12 - Complete Notes",
                    downloads: "15.2K",
                    format: "PDF",
                  },
                  {
                    title: "Chemistry Formulas & Reactions",
                    downloads: "12.8K",
                    format: "PDF",
                  },
                  {
                    title: "Biology Diagrams & Explanations",
                    downloads: "11.5K",
                    format: "PDF",
                  },
                ].map((resource, idx) => (
                  <div
                    key={idx}
                    className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <FileText className="text-primary" size={28} />
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                        {resource.format}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{resource.downloads} downloads</span>
                      <Download size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Papers Category */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-secondary" size={32} />
                <h2 className="text-3xl font-bold">Sample Question Papers</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "CBSE Board Sample Paper 2026",
                    downloads: "8.7K",
                    format: "PDF",
                  },
                  {
                    title: "ICSE Previous Year Solved Papers",
                    downloads: "7.2K",
                    format: "PDF",
                  },
                  {
                    title: "State Board Model Papers Bundle",
                    downloads: "6.4K",
                    format: "ZIP",
                  },
                ].map((resource, idx) => (
                  <div
                    key={idx}
                    className="group p-6 rounded-2xl border border-border bg-card hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <BarChart3 className="text-secondary" size={28} />
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold">
                        {resource.format}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-secondary transition-colors">
                      {resource.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{resource.downloads} downloads</span>
                      <Download size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tutorials Category */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Video className="text-accent" size={32} />
                <h2 className="text-3xl font-bold">Free Video Tutorials</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "How to Ace Your Board Exams",
                    views: "125K",
                    duration: "15 mins",
                  },
                  {
                    title: "Time Management for Students",
                    views: "89K",
                    duration: "12 mins",
                  },
                  {
                    title: "Effective Note-Taking Techniques",
                    views: "76K",
                    duration: "10 mins",
                  },
                ].map((resource, idx) => (
                  <div
                    key={idx}
                    className="group rounded-2xl border border-border overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                  >
                    <div className="h-40 bg-linear-to-br from-accent/20 to-primary/20 flex items-center justify-center group-hover:from-accent/30 group-hover:to-primary/30 transition-colors">
                      <Video className="text-accent/50" size={48} />
                    </div>
                    <div className="p-6 bg-card space-y-3">
                      <h3 className="font-bold group-hover:text-accent transition-colors">
                        {resource.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{resource.views} views</span>
                        <span>{resource.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="w-full py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Useful Tools & Calculators
            </h2>
            <p className="text-lg text-muted-foreground">
              Free tools to help you study smarter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "GPA Calculator",
                description: "Calculate your GPA based on marks and grades",
              },
              {
                title: "Study Schedule Generator",
                description: "AI-powered study plan based on your subjects",
              },
              {
                title: "Periodic Table Interactive",
                description: "Explore elements with detailed information",
              },
              {
                title: "Formula Reference Tool",
                description: "Quick access to all important formulas",
              },
              {
                title: "Concept Mapper",
                description: "Create and visualize concept connections",
              },
              {
                title: "Exam Countdown Timer",
                description: "Track days left for your exams",
              },
            ].map((tool, idx) => (
              <button
                key={idx}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-left hover:scale-105 group"
              >
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  Launch Tool <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-linear-to-r from-primary/10 to-secondary/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-pretty">
            Need More? Get Premium Access
          </h2>
          <p className="text-lg text-muted-foreground">
            Unlock all resources, full video library, and personalized study
            plans.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Start Free Trial <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

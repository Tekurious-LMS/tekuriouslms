import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Heart, Zap, Users, Target, Lightbulb, Award } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-28 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              Transforming Education in India
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our mission is to democratize quality education and empower every
              Indian student to achieve their academic dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="w-full py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Our Mission */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/8 rounded-lg border border-primary/20">
                <Target className="text-primary" size={20} />
                <span className="text-sm font-semibold">Our Mission</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Quality Education for Every Student
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that geography and socioeconomic status should never
                be barriers to quality education. Started in 2024, Tekurious is
                on a mission to bring world-class learning to every corner of
                India.
              </p>
              <ul className="space-y-3">
                {[
                  "Accessible to all",
                  "Affordable pricing",
                  "Expert guidance",
                  "Proven results",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-80 md:h-full">
              <div className="absolute inset-0 bg-primary/8 rounded-2xl border border-primary/20 flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Target size={100} className="text-primary/30" />
              </div>
            </div>
          </div>

          {/* Our Vision */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-full order-2 md:order-1">
              <div className="absolute inset-0 bg-secondary/8 rounded-2xl border border-secondary/20 flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lightbulb size={100} className="text-secondary/30" />
              </div>
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/8 rounded-lg border border-secondary/20">
                <Lightbulb className="text-secondary" size={20} />
                <span className="text-sm font-semibold">Our Vision</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Revolutionizing How India Learns
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a future where learning is personalized, engaging,
                and accessible to all. With emerging technologies like AR and
                VR, we&apos;re building the next generation of education
                platforms.
              </p>
              <div className="flex gap-6">
                {[
                  { number: "1M+", label: "Students by 2025" },
                  { number: "50+", label: "Cities Covered" },
                  { number: "95%", label: "Pass Rate" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-2xl font-bold text-secondary">
                      {stat.number}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Our Core Values</h2>
            <p className="text-lg text-muted-foreground">
              What drives us every single day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Student First",
                description:
                  "Every decision we make is centered around student success and their learning experience.",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We maintain the highest standards in content, teaching, and platform technology.",
              },
              {
                icon: Users,
                title: "Community",
                description:
                  "We believe in the power of peer learning and building a supportive learning community.",
              },
              {
                icon: Zap,
                title: "Innovation",
                description:
                  "We constantly innovate to bring cutting-edge technology to education.",
              },
              {
                icon: Target,
                title: "Transparency",
                description:
                  "Clear communication, honest metrics, and transparent pricing are our commitments.",
              },
              {
                icon: Lightbulb,
                title: "Accessibility",
                description:
                  "Quality education should be affordable and accessible to everyone, regardless of background.",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-lg border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg space-y-4"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <value.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Leadership Team</h2>
            <p className="text-lg text-muted-foreground">
              Passionate educators and tech innovators
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Raj Sharma",
                role: "Founder & CEO",
                bio: "Former educator with 15+ years in Indian schools, passionate about accessible education.",
                initials: "RS",
              },
              {
                name: "Dr. Priya Malhotra",
                role: "Chief Academic Officer",
                bio: "PhD in Education Technology, IIT Delhi. Designed curriculum for 50,000+ students.",
                initials: "PM",
              },
              {
                name: "Amit Verma",
                role: "Chief Technology Officer",
                bio: "Tech entrepreneur, built 3 edtech startups. Expert in scalable platform design.",
                initials: "AV",
              },
              {
                name: "Anjali Singh",
                role: "Head of Learning Experience",
                bio: "Learning designer with expertise in CBSE, ICSE, and competitive exam preparation.",
                initials: "AS",
              },
            ].map((member, idx) => (
              <div key={idx} className="group">
                <div className="mb-4 h-48 bg-primary/8 rounded-lg border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-lg">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-3xl font-bold text-primary/60">
                    {member.initials}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="w-full py-20 md:py-32 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Our Impact</h2>
            <p className="text-lg text-secondary-foreground/90">
              Measurable difference in students&apos; lives
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { metric: "15K+", label: "Students", icon: "👥" },
              { metric: "95%", label: "Pass Rate", icon: "✨" },
              { metric: "500+", label: "5-Star Reviews", icon: "⭐" },
              { metric: "500+", label: "Mind Maps", icon: "🧠" },
              { metric: "24/7", label: "Support", icon: "🤝" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-lg bg-secondary-foreground/10 border border-secondary-foreground/20 hover:bg-secondary-foreground/15 transition-all"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-3xl font-bold mb-1">{stat.metric}</p>
                <p className="text-sm text-secondary-foreground/80">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="w-full py-16 md:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Join the Learning Revolution
          </h2>
          <p className="text-lg text-muted-foreground">
            Be part of a movement to transform education in India.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Start Your Journey →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

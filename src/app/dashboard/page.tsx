import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { BookOpen, Zap, Target, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <Navbar />

      <section className="w-full min-h-screen bg-linear-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Welcome Header */}
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome back, Student! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Continue your learning journey and ace your upcoming exams.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: BookOpen,
                label: "Courses",
                value: "12",
                color: "primary",
              },
              {
                icon: Zap,
                label: "Streak",
                value: "7 days",
                color: "secondary",
              },
              {
                icon: Target,
                label: "Accuracy",
                value: "87%",
                color: "accent",
              },
              {
                icon: TrendingUp,
                label: "Improvement",
                value: "+15%",
                color: "primary",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <stat.icon className="text-primary mb-4" size={24} />
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link
              href="/learn"
              className="group p-8 rounded-2xl border-2 border-primary/30 bg-linear-to-br from-primary/10 to-secondary/10 hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <BookOpen className="text-primary mb-4" size={32} />
              <h3 className="text-2xl font-bold mb-2">Continue Learning</h3>
              <p className="text-muted-foreground mb-4">
                Resume your courses and watch new lectures
              </p>
              <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                Go to Learning <ArrowRight size={18} />
              </div>
            </Link>

            <Link
              href="/practice"
              className="group p-8 rounded-2xl border-2 border-secondary/30 bg-linear-to-br from-secondary/10 to-accent/10 hover:border-secondary/50 transition-all hover:shadow-lg"
            >
              <Zap className="text-secondary mb-4" size={32} />
              <h3 className="text-2xl font-bold mb-2">Practice & Quizzes</h3>
              <p className="text-muted-foreground mb-4">
                Test your knowledge with adaptive quizzes
              </p>
              <div className="flex items-center gap-2 text-secondary font-semibold group-hover:gap-3 transition-all">
                Start Practicing <ArrowRight size={18} />
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-2xl border border-border p-8">
            <h2 className="text-2xl font-bold mb-6">Your Recent Activity</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Completed Physics Chapter 3: Kinematics",
                  time: "2 hours ago",
                  icon: "✅",
                },
                {
                  title: "Scored 92% on Chemistry Quiz",
                  time: "Yesterday",
                  icon: "🎯",
                },
                {
                  title: "Watched 5 Biology video lectures",
                  time: "2 days ago",
                  icon: "📹",
                },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

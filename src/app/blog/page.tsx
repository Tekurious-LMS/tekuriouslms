import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Study Hacks That Changed My JEE Preparation",
      excerpt:
        "Discover the proven techniques used by top scorers to master their studies and secure seats in prestigious colleges.",
      author: "Arjun Sharma",
      date: "Jan 15, 2026",
      category: "Study Tips",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "How to Score 90+ in Physics: A Step-by-Step Guide",
      excerpt:
        "Physics seems tough, but with the right approach and resources, you can master it. Learn the strategies that work.",
      author: "Priya Desai",
      date: "Jan 12, 2026",
      category: "Subject Guide",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "CBSE vs ICSE vs State Boards: Which is Better for Your Child?",
      excerpt:
        "A comprehensive comparison of different board systems to help parents make informed decisions about their child's education.",
      author: "Rajesh Patel",
      date: "Jan 10, 2026",
      category: "Parent Guide",
      readTime: "8 min read",
    },
    {
      id: 4,
      title: "The Role of Mental Health in Academic Success",
      excerpt:
        "Academic pressure is real. Learn how to maintain mental health while pursuing excellence in studies.",
      author: "Dr. Meera Singh",
      date: "Jan 8, 2026",
      category: "Wellness",
      readTime: "6 min read",
    },
    {
      id: 5,
      title:
        "Technology in Education: How Digital Learning Transforms Students",
      excerpt:
        "Explore how platforms like Tekurious are revolutionizing education and making learning more accessible and effective.",
      author: "Vikram Kapoor",
      date: "Jan 5, 2026",
      category: "EdTech",
      readTime: "7 min read",
    },
    {
      id: 6,
      title: "Class 10 Board Exams: Ultimate Preparation Timeline",
      excerpt:
        "A month-by-month breakdown of how to prepare for board exams starting from class 10 to maximize your scores.",
      author: "Anjali Nair",
      date: "Jan 2, 2026",
      category: "Exam Prep",
      readTime: "9 min read",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-28 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Learning Insights & Tips
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert advice, study strategies, and inspiration from top
              educators and high achievers
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="w-full py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Featured Post */}
            <div className="group p-8 rounded-lg border-2 border-primary/20 bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-2/3 space-y-4">
                  <div className="inline-flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-semibold">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-secondary/15 text-secondary rounded-full text-xs font-semibold">
                      Study Tips
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold">
                    10 Study Hacks That Changed My JEE Preparation
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Discover the proven techniques used by top scorers to master
                    their studies and secure seats in prestigious colleges. From
                    time management to effective note-taking.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      Arjun Sharma
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Jan 15, 2026
                    </div>
                    <span>5 min read</span>
                  </div>
                </div>
                <div className="md:w-1/3 h-64 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                  <span className="text-6xl">📚</span>
                </div>
              </div>
            </div>

            {/* Regular Posts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.slice(1).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group p-6 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:scale-105 space-y-4"
                >
                  <div className="h-40 rounded-lg bg-primary/8 flex items-center justify-center text-5xl">
                    {post.category === "Subject Guide" && "📐"}
                    {post.category === "Parent Guide" && "👨‍👩‍👧"}
                    {post.category === "Wellness" && "💆"}
                    {post.category === "EdTech" && "💻"}
                    {post.category === "Exam Prep" && "✏️"}
                  </div>

                  <div className="space-y-2">
                    <span className="inline-flex px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {post.author}
                      </p>
                      <p>{post.date}</p>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Get Study Tips in Your Inbox
          </h2>
          <p className="text-primary-foreground/90">
            Weekly tips, strategies, and insights from top educators delivered
            directly to you.
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/50 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}

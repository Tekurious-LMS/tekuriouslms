import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PlayCircle, Clock } from "lucide-react";

export default function LearnPage() {
  const courses = [
    {
      id: 1,
      title: "Physics Complete - Class 12 CBSE",
      subject: "Physics",
      board: "cbse",
      lessons: 45,
      duration: "120 hrs",
      image: "📚",
    },
    {
      id: 2,
      title: "Chemistry Mastery - Class 12 CBSE",
      subject: "Chemistry",
      board: "cbse",
      lessons: 38,
      duration: "95 hrs",
      image: "⚗️",
    },
    {
      id: 3,
      title: "Mathematics Complete - Class 12 CBSE",
      subject: "Mathematics",
      board: "cbse",
      lessons: 52,
      duration: "150 hrs",
      image: "📐",
    },
    {
      id: 4,
      title: "Biology Fundamentals - Class 12 ICSE",
      subject: "Biology",
      board: "icse",
      lessons: 40,
      duration: "100 hrs",
      image: "🔬",
    },
    {
      id: 5,
      title: "English Literature - Class 12 CBSE",
      subject: "English",
      board: "cbse",
      lessons: 35,
      duration: "80 hrs",
      image: "📖",
    },
    {
      id: 6,
      title: "History & Civics - Class 12 ICSE",
      subject: "History",
      board: "icse",
      lessons: 42,
      duration: "90 hrs",
      image: "🏛️",
    },
  ];

  return (
    <>
      <Navbar />

      <section className="w-full py-12 bg-linear-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Video Lectures & Courses
            </h1>
            <p className="text-lg text-muted-foreground">
              Access 1000+ expertly-crafted video lectures across all subjects
              and boards
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="h-48 bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {course.image}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                        {course.board.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <PlayCircle size={16} />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {course.duration}
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all group-hover:shadow-lg">
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

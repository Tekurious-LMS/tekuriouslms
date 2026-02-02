import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Brain, Trophy, Target, Clock } from "lucide-react";

export default function PracticePage() {
  const quizzes = [
    {
      id: 1,
      title: "Physics Chapter 1: Mechanics - Full Chapter Quiz",
      difficulty: "Medium",
      questions: 30,
      avgTime: "45 mins",
      yourScore: "88%",
    },
    {
      id: 2,
      title: "Chemistry: Chemical Bonding - Practice Test",
      difficulty: "Hard",
      questions: 25,
      avgTime: "40 mins",
      yourScore: "92%",
    },
    {
      id: 3,
      title: "Mathematics: Calculus - Quick Revision Quiz",
      difficulty: "Medium",
      questions: 20,
      avgTime: "30 mins",
      yourScore: "78%",
    },
    {
      id: 4,
      title: "Biology: Genetics & Evolution - Practice Set",
      difficulty: "Hard",
      questions: 28,
      avgTime: "50 mins",
      yourScore: "85%",
    },
  ];

  const pyqs = [
    {
      id: 1,
      title: "CBSE Physics Previous 10 Years - All Topics",
      year: "2015-2025",
      questions: 150,
      solved: 87,
      completion: "58%",
    },
    {
      id: 2,
      title: "ICSE Chemistry PYQs - Full Collection",
      year: "2016-2025",
      questions: 120,
      solved: 45,
      completion: "38%",
    },
    {
      id: 3,
      title: "CBSE Mathematics Previous Years",
      year: "2014-2025",
      questions: 180,
      solved: 120,
      completion: "67%",
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
              Practice & Assessments
            </h1>
            <p className="text-lg text-muted-foreground">
              Test your knowledge with adaptive quizzes and solve previous year
              questions
            </p>
          </div>

          {/* Quizzes Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Brain className="text-primary" />
              Adaptive Quizzes
            </h2>
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="px-3 py-1 bg-secondary/10 rounded-full">
                          {quiz.difficulty}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target size={16} /> {quiz.questions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={16} /> {quiz.avgTime}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {quiz.yourScore}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your score
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors">
                    Retake Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PYQs Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="text-accent" />
              Previous Year Questions
            </h2>
            <div className="space-y-4">
              {pyqs.map((pyq) => (
                <div
                  key={pyq.id}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-accent/50 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{pyq.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span>{pyq.year}</span>
                        <span>{pyq.questions} questions total</span>
                        <span>{pyq.solved} solved</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-accent">
                        {pyq.completion}
                      </div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div
                      className="bg-accent rounded-full h-2 transition-all"
                      style={{ width: pyq.completion }}
                    />
                  </div>
                  <button className="w-full py-2 bg-accent/10 text-accent rounded-lg font-semibold hover:bg-accent/20 transition-colors">
                    Continue Practice
                  </button>
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

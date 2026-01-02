import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      <Navbar />

      {/* Signup Container */}
      <section className="w-full min-h-screen flex items-center justify-center py-20 bg-linear-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="w-full max-w-md px-4">
          <div className="animate-scale-in">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Get Started</h1>
              <p className="text-muted-foreground">
                Join thousands of students learning with Tekurious
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <form className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-3 text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-3 text-muted-foreground"
                    />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-3 text-muted-foreground"
                    />
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Class/Board Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Class / Board
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option>Select your class/board</option>
                    <option>Class 6 - CBSE</option>
                    <option>Class 7 - CBSE</option>
                    <option>Class 8 - CBSE</option>
                    <option>Class 9 - CBSE</option>
                    <option>Class 10 - CBSE</option>
                    <option>Class 11 - CBSE</option>
                    <option>Class 12 - CBSE</option>
                    <option>Class 6 - ICSE</option>
                    <option>Class 7 - ICSE</option>
                  </select>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 rounded border-border accent-primary mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Create My Account <ArrowRight size={18} />
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Social Signup */}
              <div className="space-y-3">
                <button className="w-full py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-all flex items-center justify-center gap-2">
                  <span>📱</span> Sign up with Google
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Log In
                </Link>
              </p>
            </div>

            {/* Features List */}
            <div className="mt-8 space-y-3">
              {[
                "No credit card required",
                "Free access to sample lessons",
                "Full 7-day money-back guarantee",
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                    ✓
                  </span>
                  {feature}
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

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <Navbar />

      {/* Login Container */}
      <section className="w-full min-h-screen flex items-center justify-center py-20 bg-linear-to-br from-secondary/5 via-transparent to-accent/5">
        <div className="w-full max-w-md px-4">
          <div className="animate-scale-in">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                Log in to continue your learning journey
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <form className="space-y-6">
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-3 text-muted-foreground"
                    />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Log In <ArrowRight size={18} />
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <button className="w-full py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-all flex items-center justify-center gap-2">
                  <span>📱</span> Continue with Google
                </button>
              </div>

              {/* Signup Link */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Check, X, ArrowRight, Zap, Award, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: 99,
      period: "month",
      description: "Begin your learning journey",
      highlight: false,
      icon: Lightbulb,
      features: [
        { included: true, text: "100+ Video Lectures" },
        { included: true, text: "Basic Notes & Summaries" },
        { included: true, text: "50+ Practice Quizzes" },
        { included: true, text: "Mobile Access" },
        { included: false, text: "Mind Maps" },
        { included: false, text: "Previous Year Questions" },
        { included: false, text: "Live Classes" },
        { included: false, text: "1-on-1 Mentoring" },
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Pro",
      price: 499,
      period: "month",
      description: "Most comprehensive coverage",
      highlight: true,
      icon: Zap,
      features: [
        { included: true, text: "1000+ Video Lectures" },
        { included: true, text: "Complete Interactive Notes" },
        { included: true, text: "500+ Practice Problems" },
        { included: true, text: "Mobile & Desktop Access" },
        { included: true, text: "Complete Mind Maps" },
        { included: true, text: "500+ PYQ Solutions" },
        { included: true, text: "2x Monthly Live Classes" },
        { included: false, text: "1-on-1 Mentoring" },
      ],
      cta: "Get Started Now",
    },
    {
      name: "Excellence",
      price: 999,
      period: "month",
      description: "Complete learning ecosystem",
      highlight: false,
      icon: Award,
      features: [
        { included: true, text: "All Pro Features" },
        { included: true, text: "Unlimited Everything" },
        { included: true, text: "2000+ Complete PYQs" },
        { included: true, text: "24/7 Priority Support" },
        { included: true, text: "Weekly Live Classes" },
        { included: true, text: "Personalized Learning Path" },
        { included: true, text: "4 Doubt Sessions/Month" },
        { included: true, text: "AR/VR Preview Access" },
      ],
      cta: "Unlock Premium",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold text-pretty">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your goals. All plans include unlimited
            access to your selected features.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <div
                  key={idx}
                  className={`relative rounded-3xl transition-all duration-300 animate-slide-up overflow-hidden group ${
                    plan.highlight
                      ? "md:scale-105 bg-linear-to-br from-primary/10 to-secondary/10 border-2 border-primary shadow-2xl shadow-primary/30"
                      : "bg-card border border-border hover:border-primary/50 hover:shadow-lg"
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {plan.highlight && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
                  )}

                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-1 bg-linear-to-r from-primary to-secondary text-primary-foreground rounded-full text-xs font-semibold">
                        Most Popular ⭐
                      </div>
                    </div>
                  )}

                  <div className="p-8 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            plan.highlight
                              ? "bg-linear-to-br from-primary to-secondary"
                              : "bg-primary/10"
                          }`}
                        >
                          <Icon
                            size={24}
                            className={
                              plan.highlight ? "text-white" : "text-primary"
                            }
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plan.description}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-5xl font-bold">
                            ₹{plan.price}
                          </span>
                          <span className="text-muted-foreground">
                            /{plan.period}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Billed monthly • Cancel anytime
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn ${
                        plan.highlight
                          ? "bg-linear-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
                          : "bg-muted text-foreground hover:bg-muted/80 border border-border hover:border-primary/50"
                      }`}
                    >
                      {plan.cta}{" "}
                      <ArrowRight
                        size={18}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>

                    {/* Features */}
                    <div className="space-y-3 border-t border-border pt-8">
                      {plan.features.map((feature, fidx) => (
                        <div key={fidx} className="flex items-start gap-3">
                          {feature.included ? (
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={16} className="text-primary" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 shrink-0 mt-0.5">
                              <X
                                size={16}
                                className="text-muted-foreground/40"
                              />
                            </div>
                          )}
                          <span
                            className={`text-sm ${
                              feature.included
                                ? "text-foreground"
                                : "text-muted-foreground line-through opacity-50"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison CTA */}
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Not sure which plan is right for you?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl hover:border-primary/50 hover:bg-muted transition-all"
            >
              Compare Plans & Get Recommendations →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Pricing Questions Answered
          </h2>

          <div className="space-y-4">
            {[
              {
                question: "Can I change my plan anytime?",
                answer:
                  "Upgrade or downgrade anytime. Changes take effect immediately with pro-rata adjustments to your billing.",
              },
              {
                question: "Is there a free trial?",
                answer:
                  "Yes! All new users get 7 days free access to the Pro plan. No credit card required. If you like it, we&apos;ll charge you; if not, no payment ever.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit/debit cards, UPI, PayPal, and mobile wallets. All payments are encrypted and secure.",
              },
              {
                question: "Is there a refund policy?",
                answer:
                  "Yes! 7-day money-back guarantee. If you're not happy, we'll refund you entirely. After 7 days, you can cancel anytime.",
              },
              {
                question: "Do you offer discounts?",
                answer:
                  "Yes! Annual subscriptions save 20%. We also offer special rates for students, families, and schools. Contact our team.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                <summary className="font-semibold flex justify-between items-center select-none">
                  <span className="text-left">{faq.question}</span>
                  <span className="text-primary group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-muted-foreground mt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-linear-to-r from-primary/10 to-secondary/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-pretty">
            Ready to Transform Your Results?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of students achieving their dreams. Start your free
            7-day trial today.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Get Started Today →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

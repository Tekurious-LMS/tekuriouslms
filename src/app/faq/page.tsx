import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      items: [
        {
          question: "How do I sign up for Tekurious?",
          answer:
            "Simply click the 'Get Started' button and follow the registration process. You can sign up with your email or phone number. Once registered, you'll have access to sample lessons immediately.",
        },
        {
          question: "Is there a free trial?",
          answer:
            "Yes! All new users get access to sample video lectures and practice quizzes. No credit card required for the free trial.",
        },
        {
          question: "Which boards does Tekurious cover?",
          answer:
            "We cover CBSE, ICSE, and all state boards for Classes 6-12. We also have resources for competitive exams like JEE and NEET.",
        },
      ],
    },
    {
      category: "Learning Features",
      items: [
        {
          question: "Can I download videos for offline viewing?",
          answer:
            "Yes, with Pro and Premium plans, you can download lectures to watch offline. Downloaded content remains accessible for 30 days.",
        },
        {
          question: "Are the mind maps interactive?",
          answer:
            "Yes, our mind maps are fully interactive with clickable nodes that provide detailed explanations. You can also customize them based on your learning style.",
        },
        {
          question: "How often are new courses added?",
          answer:
            "We add new courses and lessons every week. Subscribe to our newsletter to stay updated on latest content.",
        },
      ],
    },
    {
      category: "Pricing & Plans",
      items: [
        {
          question: "Can I change my plan?",
          answer:
            "Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately, and we'll adjust your billing accordingly.",
        },
        {
          question: "Do you offer student discounts?",
          answer:
            "Yes, we offer special discounts for students who can verify their student ID. Contact our sales team for details.",
        },
        {
          question: "Is there a refund policy?",
          answer:
            "We offer a 7-day money-back guarantee if you're not satisfied. After 7 days, we cannot process refunds but you can cancel anytime.",
        },
      ],
    },
    {
      category: "Technical Support",
      items: [
        {
          question: "What devices are supported?",
          answer:
            "Tekurious works on all devices - laptops, tablets, and smartphones. We support iOS, Android, Windows, and Mac.",
        },
        {
          question: "What internet speed do I need?",
          answer:
            "For smooth streaming, we recommend at least 1 Mbps for HD quality and 2.5 Mbps for full HD. Lower speeds will work but with reduced quality.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "Click 'Forgot Password' on the login page. You'll receive an email with instructions to reset your password. The link expires in 24 hours.",
        },
      ],
    },
  ];

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="w-full py-16 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-balance mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about Tekurious. Can&apos;t find
            what you&apos;re looking for? Contact our support team.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="w-full py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, catIdx) => (
            <div
              key={catIdx}
              className="mb-16 animate-fade-in"
              style={{ animationDelay: `${catIdx * 100}ms` }}
            >
              <h2 className="text-3xl font-bold mb-8">{category.category}</h2>

              <div className="space-y-4">
                {category.items.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <summary className="font-semibold text-lg flex justify-between items-center select-none">
                      <span className="text-left group-open:text-primary transition-colors">
                        {faq.question}
                      </span>
                      <span className="text-primary ml-4 shrink-0 group-open:rotate-180 transition-transform duration-300">
                        ▼
                      </span>
                    </summary>
                    <p className="text-muted-foreground mt-6 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Still Need Help */}
          <div className="mt-16 p-8 rounded-xl bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-3">Still need help?</h3>
            <p className="text-muted-foreground mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our support
              team is here to help!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

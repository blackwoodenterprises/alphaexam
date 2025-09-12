import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Arjun Sharma",
      role: "IMO Qualifier",
      institution: "IIT Delhi",
      image:
        "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='24' fill='%239333EA'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='18' font-weight='bold'%3EAS%3C/text%3E%3C/svg%3E",
      content:
        "AlphaExam's Olympiad mock tests were instrumental in my IMO qualification. The quality of questions and detailed explanations helped me understand complex problem-solving techniques.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "JEE Advanced AIR 247",
      institution: "IIT Bombay",
      image:
        "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23EC4899'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='18' font-weight='bold'%3EPP%3C/text%3E%3C/svg%3E",
      content:
        "The JEE mock tests on AlphaExam were incredibly realistic. The timer-based environment helped me manage time effectively in the actual exam. Highly recommended!",
      rating: 5,
    },
    {
      name: "Rahul Kumar",
      role: "NEET Topper",
      institution: "AIIMS Delhi",
      image:
        "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='24' fill='%2310976B'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='18' font-weight='bold'%3ERK%3C/text%3E%3C/svg%3E",
      content:
        "AlphaExam's NEET preparation materials are top-notch. The performance analytics helped me identify my weak areas and improve systematically.",
      rating: 5,
    },
    {
      name: "Sneha Reddy",
      role: "Math Olympiad Medalist",
      institution: "Chennai Mathematical Institute",
      image:
        "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23F59E0B'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='18' font-weight='bold'%3ESR%3C/text%3E%3C/svg%3E",
      content:
        "The platform's LaTeX rendering is perfect for mathematical formulas. As a math olympiad participant, I found the question quality exceptional.",
      rating: 5,
    },
    {
      name: "Vikash Singh",
      role: "Engineering Student",
      institution: "NIT Trichy",
      image:
        "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='24' fill='%236366F1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='18' font-weight='bold'%3EVS%3C/text%3E%3C/svg%3E",
      content:
        "Started using AlphaExam during my JEE preparation. The mock tests helped me crack JEE Main with a good rank. The platform is user-friendly and reliable.",
      rating: 4,
    },
    {
      name: "Ananya Verma",
      role: "Medical Student",
      institution: "JIPMER",
      image:
        "data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23DC2626'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='18' font-weight='bold'%3EAV%3C/text%3E%3C/svg%3E",
      content:
        "AlphaExam's NEET mock tests were a game-changer for me. The detailed solutions and performance tracking helped me focus on my preparation strategy.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container-restricted px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Students Say
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful students who achieved their dreams with
            AlphaExam. Read their success stories and get inspired.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-purple-400" />
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Testimonial content */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* User info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-purple-600 font-medium">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.institution}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div>
              <div className="text-2xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <div className="text-2xl font-bold text-gray-900">10,000+</div>
              <div className="text-sm text-gray-600">Happy Students</div>
            </div>
            <div className="h-8 w-px bg-gray-300" />
            <div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

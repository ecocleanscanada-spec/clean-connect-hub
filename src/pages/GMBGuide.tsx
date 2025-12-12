import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MapPin, Star, Image, MessageSquare, Calendar, TrendingUp, Clock, Phone } from "lucide-react";

const GMBGuide = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Claim & Verify Your Listing",
      description: "Start by claiming your business on Google Business Profile. Verification typically happens via postcard, phone, or email.",
      tips: [
        "Use your exact business name as registered",
        "Choose the most specific category (e.g., 'House Cleaning Service')",
        "Add secondary categories like 'Office Cleaning Service', 'Carpet Cleaning Service'",
        "Verify your address is accurate and matches your website"
      ]
    },
    {
      icon: Clock,
      title: "Complete Business Information",
      description: "Fill out every field in your profile. Complete profiles rank higher in local search results.",
      tips: [
        "Add accurate business hours including holidays",
        "Include your service areas in Winnipeg",
        "Write a compelling 750-character business description with keywords",
        "Add your website URL and appointment booking link"
      ]
    },
    {
      icon: Image,
      title: "Add High-Quality Photos",
      description: "Businesses with photos receive 42% more requests for directions and 35% more website clicks.",
      tips: [
        "Upload your logo and cover photo",
        "Add photos of your team in action",
        "Show before/after cleaning results",
        "Update photos monthly to stay fresh"
      ]
    },
    {
      icon: Star,
      title: "Generate & Manage Reviews",
      description: "Reviews are a top local ranking factor. Aim for consistent, authentic reviews from satisfied customers.",
      tips: [
        "Ask customers for reviews after each service",
        "Respond to ALL reviews within 24-48 hours",
        "Thank positive reviewers personally",
        "Address negative reviews professionally and offer solutions"
      ]
    },
    {
      icon: MessageSquare,
      title: "Use Google Posts",
      description: "Posts appear in your Business Profile and can highlight offers, events, and updates.",
      tips: [
        "Post weekly updates about services or promotions",
        "Include a clear call-to-action button",
        "Use high-quality images (400x300px minimum)",
        "Highlight seasonal cleaning specials"
      ]
    },
    {
      icon: Phone,
      title: "Enable Messaging & Booking",
      description: "Make it easy for customers to contact you directly through your profile.",
      tips: [
        "Turn on messaging for quick inquiries",
        "Set up automated welcome messages",
        "Add a booking button linked to your scheduling system",
        "Respond to messages within minutes when possible"
      ]
    },
    {
      icon: Calendar,
      title: "Add Services & Products",
      description: "List your cleaning services with descriptions and pricing to help customers understand your offerings.",
      tips: [
        "Add all service types with detailed descriptions",
        "Include pricing ranges where appropriate",
        "Update seasonally for special services",
        "Link services to relevant website pages"
      ]
    },
    {
      icon: TrendingUp,
      title: "Monitor Insights & Optimize",
      description: "Use Google Business Profile insights to understand how customers find and interact with your listing.",
      tips: [
        "Track search queries driving visibility",
        "Monitor photo views and engagement",
        "Analyze customer actions (calls, directions, website visits)",
        "Adjust strategy based on performance data"
      ]
    }
  ];

  const localSEOTips = [
    "Ensure NAP (Name, Address, Phone) consistency across all online directories",
    "Build citations on local directories like Yelp, Yellow Pages, and Winnipeg Chamber of Commerce",
    "Create location-specific content on your website targeting Winnipeg neighborhoods",
    "Encourage customers to mention specific services and locations in reviews",
    "Use local keywords in your business description (e.g., 'Winnipeg house cleaning')",
    "Add your business to Google Maps and ensure the pin location is accurate"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Google My Business Guide for Local SEO
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Maximize your visibility in Winnipeg with an optimized Google Business Profile. 
            Follow these steps to attract more local customers.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-primary">Step {index + 1}</span>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Tips Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Additional Local SEO Tips for Winnipeg
          </h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {localSEOTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need Help With Your Online Presence?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Focus on what you do best—cleaning—while we help you build a strong local presence in Winnipeg.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Us Today
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GMBGuide;

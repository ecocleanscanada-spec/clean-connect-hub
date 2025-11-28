import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Maintaining a Clean Home Between Professional Cleanings",
    excerpt: "Learn simple daily habits that keep your home spotless and extend the freshness of your professional cleaning service.",
    date: "March 15, 2024",
    category: "Home Tips",
    slug: "maintaining-clean-home",
  },
  {
    id: 2,
    title: "The Benefits of Regular Office Cleaning for Employee Productivity",
    excerpt: "Discover how a clean workspace directly impacts employee health, morale, and overall productivity in your business.",
    date: "March 10, 2024",
    category: "Business",
    slug: "office-cleaning-productivity",
  },
  {
    id: 3,
    title: "Green Cleaning: Eco-Friendly Solutions for Your Home",
    excerpt: "Explore our environmentally-friendly cleaning methods that are safe for your family, pets, and the planet.",
    date: "March 5, 2024",
    category: "Sustainability",
    slug: "green-cleaning-solutions",
  },
  {
    id: 4,
    title: "How Often Should You Deep Clean Your Carpets?",
    excerpt: "Professional recommendations on carpet cleaning frequency based on household traffic, pets, and other factors.",
    date: "February 28, 2024",
    category: "Home Care",
    slug: "carpet-cleaning-frequency",
  },
  {
    id: 5,
    title: "Spring Cleaning Checklist: Don't Miss These Often-Overlooked Areas",
    excerpt: "A comprehensive guide to spring cleaning, including those hidden spots that collect dust and grime all year long.",
    date: "February 20, 2024",
    category: "Seasonal",
    slug: "spring-cleaning-checklist",
  },
  {
    id: 6,
    title: "The Science Behind Professional Cleaning: Why It Matters",
    excerpt: "Understanding the difference between household cleaning and professional-grade sanitation methods.",
    date: "February 15, 2024",
    category: "Education",
    slug: "professional-cleaning-science",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cleaning Tips & Insights</h1>
            <p className="text-xl text-primary-foreground/90">
              Expert advice, industry news, and helpful guides to keep your spaces spotless
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span className="text-primary font-medium">{post.category}</span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3 text-base">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="text-lg text-muted-foreground">
              Subscribe to our newsletter for cleaning tips, special offers, and company updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
              />
              <button className="px-6 py-2 bg-primary hover:bg-primary-hover text-primary-foreground rounded-md font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

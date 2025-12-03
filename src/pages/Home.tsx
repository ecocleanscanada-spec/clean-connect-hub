import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Shield, Clock, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-cleaning.jpg";

const services = [
  {
    name: "Maid Service",
    slug: "maid-service",
    description: "Regular housekeeping to keep your home spotless",
    icon: "🏠",
  },
  {
    name: "House Cleaning",
    slug: "house-cleaning",
    description: "Deep cleaning for every corner of your home",
    icon: "✨",
  },
  {
    name: "Office Cleaning",
    slug: "office-cleaning",
    description: "Professional workspace cleaning solutions",
    icon: "🏢",
  },
  {
    name: "Warehouse Cleaning",
    slug: "warehouse-cleaning",
    description: "Large-scale industrial cleaning services",
    icon: "🏭",
  },
  {
    name: "Window Cleaning",
    slug: "window-cleaning",
    description: "Crystal clear windows, inside and out",
    icon: "🪟",
  },
  {
    name: "Carpet Cleaning",
    slug: "carpet-cleaning",
    description: "Deep carpet and rug restoration",
    icon: "🧺",
  },
  {
    name: "Janitorial Service",
    slug: "janitorial-service",
    description: "Complete facility maintenance programs",
    icon: "🧹",
  },
  {
    name: "Upholstery Cleaning",
    slug: "upholstery-cleaning",
    description: "Furniture and fabric care specialists",
    icon: "🛋️",
  },
  {
    name: "Air Duct Cleaning",
    slug: "air-duct-cleaning",
    description: "Improve air quality with clean ductwork",
    icon: "💨",
  },
];

const features = [
  {
    icon: Shield,
    title: "Trusted Professionals",
    description: "All staff are background-checked, insured, and trained to the highest standards",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book services at times that work for you, including evenings and weekends",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "100% satisfaction guarantee - we'll make it right if you're not happy",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative text-primary-foreground py-20 md:py-32 min-h-[600px] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Blue Transparent Overlay */}
        <div className="absolute inset-0 bg-primary/70" />
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Professional Cleaning Services
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Space, Sparkling Clean
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Experience the difference with our professional cleaning services. From homes to offices, 
              we deliver exceptional results every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/book">
                <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground text-lg px-8">
                  Book Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white text-lg px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive cleaning solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link key={service.slug} to={`/services/${service.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-primary font-medium text-sm">Learn More →</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Experience the CleanPro Difference?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied customers who trust us with their cleaning needs
            </p>
            <Link to="/book">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground text-lg px-8">
                Schedule Your Cleaning
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

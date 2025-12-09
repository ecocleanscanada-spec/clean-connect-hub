import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const serviceData: Record<string, any> = {
  "maid-service": {
    title: "Maid Service",
    icon: "🏠",
    description: "Professional housekeeping services to maintain your home's cleanliness on a regular schedule.",
    features: [
      "Weekly, bi-weekly, or monthly service",
      "Dusting and vacuuming all rooms",
      "Bathroom sanitization",
      "Kitchen cleaning and organization",
      "Bed making and linen changes",
      "Floor mopping and care",
    ],
    blogs: [
      {
        title: "5 Tips for Maintaining a Clean Home Between Maid Visits",
        excerpt: "Discover simple daily habits that keep your home fresh and tidy between professional cleanings.",
        date: "December 5, 2024",
        slug: "tips-maintaining-clean-home"
      },
      {
        title: "Why Regular Maid Service Saves You Time and Money",
        excerpt: "Learn how investing in professional maid service can actually reduce your overall household expenses.",
        date: "November 28, 2024",
        slug: "maid-service-saves-money"
      }
    ],
    faqs: [
      {
        question: "How long does a typical maid service visit take?",
        answer: "Most homes take 2-4 hours depending on size and condition. We can provide a more accurate estimate after discussing your specific needs."
      },
      {
        question: "Do I need to be home during the service?",
        answer: "No, many of our clients provide us with keys or access codes. All our staff are fully vetted and insured for your peace of mind."
      },
      {
        question: "What if I'm not satisfied with the service?",
        answer: "We offer a 100% satisfaction guarantee. If you're not happy with any aspect of our service, we'll return within 24 hours to make it right at no additional charge."
      }
    ]
  },
  "house-cleaning": {
    title: "House Cleaning",
    icon: "✨",
    description: "Deep cleaning services that tackle every corner of your home for a thorough, top-to-bottom clean.",
    features: [
      "Deep cleaning of all surfaces",
      "Appliance interior cleaning",
      "Baseboards and ceiling fans",
      "Window sill and track cleaning",
      "Cabinet exterior wiping",
      "Detailed bathroom scrubbing",
    ],
    blogs: [
      {
        title: "Deep Cleaning Checklist: Room-by-Room Guide",
        excerpt: "A comprehensive guide to deep cleaning every area of your home like a professional.",
        date: "December 3, 2024",
        slug: "deep-cleaning-checklist"
      },
      {
        title: "Spring Cleaning vs Deep Cleaning: What's the Difference?",
        excerpt: "Understanding the key differences between seasonal and deep cleaning services.",
        date: "November 20, 2024",
        slug: "spring-vs-deep-cleaning"
      }
    ],
    faqs: [
      {
        question: "What's the difference between deep cleaning and regular cleaning?",
        answer: "Deep cleaning is more thorough and intensive, tackling areas often overlooked in regular cleaning like inside appliances, behind furniture, and detailed grout work."
      },
      {
        question: "How often should I schedule a deep clean?",
        answer: "We recommend deep cleaning every 3-6 months, or seasonally, to maintain optimal cleanliness and hygiene in your home."
      },
      {
        question: "Do you bring your own cleaning supplies?",
        answer: "Yes, we bring all necessary professional-grade cleaning supplies and equipment. If you prefer we use specific products, just let us know."
      }
    ]
  },
  "office-cleaning": {
    title: "Office Cleaning",
    icon: "🏢",
    description: "Comprehensive commercial cleaning solutions to maintain a professional, healthy workspace for your team.",
    features: [
      "After-hours cleaning available",
      "Desk and workstation sanitization",
      "Conference room cleaning",
      "Kitchen and break room service",
      "Restroom deep cleaning",
      "Floor care and maintenance",
    ],
    blogs: [
      {
        title: "How a Clean Office Boosts Employee Productivity",
        excerpt: "Studies show that clean workspaces can increase productivity by up to 15%.",
        date: "December 1, 2024",
        slug: "clean-office-productivity"
      },
      {
        title: "Office Hygiene Best Practices Post-Pandemic",
        excerpt: "Essential cleaning protocols to keep your workplace safe and healthy.",
        date: "November 15, 2024",
        slug: "office-hygiene-practices"
      }
    ],
    faqs: [
      {
        question: "Can you work around our business hours?",
        answer: "Absolutely! We offer flexible scheduling including evenings and weekends to minimize disruption to your operations."
      },
      {
        question: "Do you handle specialized equipment cleaning?",
        answer: "Yes, we can clean most office equipment safely. For specialized items, we'll work with you to establish proper cleaning protocols."
      },
      {
        question: "What COVID-19 precautions do you take?",
        answer: "We follow CDC guidelines including enhanced disinfection of high-touch surfaces, use of EPA-approved disinfectants, and our staff are trained in proper sanitation procedures."
      }
    ]
  },
  "warehouse-cleaning": {
    title: "Warehouse Cleaning",
    icon: "🏭",
    description: "Industrial-strength cleaning for warehouses, manufacturing facilities, and large commercial spaces.",
    features: [
      "High-ceiling and racking cleaning",
      "Floor scrubbing and sealing",
      "Dock and loading area cleaning",
      "Restroom and office area service",
      "Trash removal and recycling",
      "Safety compliance cleaning",
    ],
    blogs: [
      {
        title: "Industrial Cleaning Safety Standards You Should Know",
        excerpt: "OSHA requirements and best practices for warehouse cleanliness and safety.",
        date: "November 25, 2024",
        slug: "industrial-cleaning-safety"
      },
      {
        title: "Maximizing Warehouse Efficiency Through Cleanliness",
        excerpt: "How organized, clean warehouses reduce accidents and improve workflow.",
        date: "November 10, 2024",
        slug: "warehouse-efficiency-cleanliness"
      }
    ],
    faqs: [
      {
        question: "Can you accommodate 24/7 operations?",
        answer: "Yes, we can schedule cleaning during shift changes, weekends, or any time that works best for your operation."
      },
      {
        question: "Do you have experience with food-grade facilities?",
        answer: "Yes, we're trained in specialized cleaning protocols for food-grade warehouses and understand FDA compliance requirements."
      },
      {
        question: "What size facilities can you handle?",
        answer: "We service facilities from 10,000 to over 500,000 square feet, with scalable crews and equipment."
      }
    ]
  },
  "window-cleaning": {
    title: "Window Cleaning",
    icon: "🪟",
    description: "Professional window cleaning services for crystal-clear views, inside and out.",
    features: [
      "Interior and exterior cleaning",
      "Screen cleaning and repair",
      "Hard water stain removal",
      "Sill and frame cleaning",
      "High-rise capabilities",
      "Streak-free guarantee",
    ],
    blogs: [
      {
        title: "How Often Should You Clean Your Windows?",
        excerpt: "A guide to window cleaning frequency based on your location and environment.",
        date: "November 22, 2024",
        slug: "window-cleaning-frequency"
      },
      {
        title: "DIY vs Professional Window Cleaning: Which is Right for You?",
        excerpt: "Weighing the pros and cons of cleaning windows yourself versus hiring professionals.",
        date: "November 5, 2024",
        slug: "diy-vs-professional-windows"
      }
    ],
    faqs: [
      {
        question: "How often should windows be professionally cleaned?",
        answer: "We recommend twice yearly for most homes and quarterly for businesses, though frequency can vary based on location and conditions."
      },
      {
        question: "Can you clean high windows or skylights?",
        answer: "Yes, we have specialized equipment and trained staff for high-access window cleaning up to four stories."
      },
      {
        question: "What about screens and tracks?",
        answer: "All our window cleaning services include screen cleaning and track vacuuming at no additional charge."
      }
    ]
  },
  "carpet-cleaning": {
    title: "Carpet Cleaning",
    icon: "🧺",
    description: "Deep carpet and rug cleaning that removes stains, odors, and allergens for a fresher home.",
    features: [
      "Hot water extraction method",
      "Stain and odor removal",
      "Pet treatment available",
      "Scotchgard protection",
      "Fast drying time",
      "Area rug cleaning",
    ],
    blogs: [
      {
        title: "The Science Behind Professional Carpet Cleaning",
        excerpt: "Understanding hot water extraction and why it's the gold standard for carpet care.",
        date: "November 18, 2024",
        slug: "science-carpet-cleaning"
      },
      {
        title: "Pet Owners Guide to Carpet Maintenance",
        excerpt: "Tips and tricks for keeping your carpets fresh when you have furry friends.",
        date: "October 30, 2024",
        slug: "pet-owners-carpet-guide"
      }
    ],
    faqs: [
      {
        question: "How long until carpets are dry?",
        answer: "Most carpets are dry within 6-8 hours with our advanced equipment and methods. We can also offer faster drying options."
      },
      {
        question: "Can you remove pet stains and odors?",
        answer: "Yes, we specialize in pet stain and odor removal using enzyme-based treatments that neutralize odors at the source."
      },
      {
        question: "Will cleaning damage my carpet warranty?",
        answer: "No, our hot water extraction method is approved by major carpet manufacturers and often required to maintain warranties."
      }
    ]
  },
  "janitorial-service": {
    title: "Janitorial Service",
    icon: "🧹",
    description: "Comprehensive facility maintenance programs tailored to your business needs.",
    features: [
      "Daily or scheduled cleaning",
      "Restroom restocking",
      "Floor care programs",
      "Common area maintenance",
      "Trash and recycling service",
      "Supply management",
    ],
    blogs: [
      {
        title: "Choosing the Right Janitorial Service for Your Business",
        excerpt: "Key factors to consider when selecting a commercial cleaning partner.",
        date: "November 12, 2024",
        slug: "choosing-janitorial-service"
      },
      {
        title: "Green Cleaning: Eco-Friendly Janitorial Practices",
        excerpt: "How sustainable cleaning practices benefit your business and the environment.",
        date: "October 25, 2024",
        slug: "green-cleaning-practices"
      }
    ],
    faqs: [
      {
        question: "What's included in a janitorial contract?",
        answer: "We customize each contract based on your needs, typically including daily cleaning, restroom service, trash removal, and floor care."
      },
      {
        question: "Can you provide supplies and equipment?",
        answer: "Yes, we can manage all cleaning supplies, paper products, and equipment as part of your service package."
      },
      {
        question: "Do you offer emergency cleaning services?",
        answer: "Yes, we provide 24/7 emergency response for urgent cleaning needs at our contract facilities."
      }
    ]
  },
  "upholstery-cleaning": {
    title: "Upholstery Cleaning",
    icon: "🛋️",
    description: "Expert furniture and fabric care to restore and protect your upholstered pieces.",
    features: [
      "Fabric-specific cleaning methods",
      "Stain removal expertise",
      "Color restoration",
      "Odor elimination",
      "Fabric protection treatment",
      "Leather conditioning",
    ],
    blogs: [
      {
        title: "How to Identify Your Upholstery Fabric Type",
        excerpt: "Understanding fabric codes and what they mean for cleaning your furniture.",
        date: "November 8, 2024",
        slug: "identify-upholstery-fabric"
      },
      {
        title: "Extending the Life of Your Furniture Through Proper Care",
        excerpt: "Professional tips to keep your sofas and chairs looking new for years.",
        date: "October 20, 2024",
        slug: "extending-furniture-life"
      }
    ],
    faqs: [
      {
        question: "What types of fabric can you clean?",
        answer: "We clean all upholstery types including microfiber, cotton, linen, velvet, and leather. We assess each piece to use the appropriate method."
      },
      {
        question: "Can you clean antique furniture?",
        answer: "Yes, we have specialists trained in cleaning delicate and antique upholstery with gentle, appropriate methods."
      },
      {
        question: "How long does furniture take to dry?",
        answer: "Most upholstery is dry within 4-6 hours, though we recommend waiting 24 hours before heavy use."
      }
    ]
  },
  "air-duct-cleaning": {
    title: "Air Duct Cleaning",
    icon: "💨",
    description: "Improve indoor air quality and HVAC efficiency with professional duct cleaning services.",
    features: [
      "Complete system inspection",
      "Vent and duct cleaning",
      "Dryer vent service",
      "Mold prevention treatment",
      "Filter replacement",
      "Before/after photos",
    ],
    blogs: [
      {
        title: "Signs Your Air Ducts Need Professional Cleaning",
        excerpt: "Warning signs that indicate it's time to schedule duct cleaning service.",
        date: "November 1, 2024",
        slug: "signs-ducts-need-cleaning"
      },
      {
        title: "The Connection Between Air Quality and Health",
        excerpt: "How clean air ducts contribute to a healthier home environment.",
        date: "October 15, 2024",
        slug: "air-quality-health-connection"
      }
    ],
    faqs: [
      {
        question: "How often should air ducts be cleaned?",
        answer: "The EPA recommends cleaning as needed, typically every 3-5 years, or more frequently if you have pets, allergies, or recent renovations."
      },
      {
        question: "Will duct cleaning help with allergies?",
        answer: "Yes, removing dust, pollen, and allergens from your ductwork can significantly improve indoor air quality and reduce allergy symptoms."
      },
      {
        question: "How long does the service take?",
        answer: "Most residential duct cleaning takes 2-4 hours depending on system size and condition."
      }
    ]
  },
};

export default function ServicePage() {
  const { slug } = useParams();
  const service = slug ? serviceData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero */}
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="text-5xl mb-4">{service.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-primary-foreground/90 mb-8">{service.description}</p>
            <Link to="/book">
              <Button size="lg" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
                Book This Service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Blog Posts */}
      {service.blogs && service.blogs.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.blogs.map((blog: any, index: number) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardDescription>{blog.date}</CardDescription>
                      <CardTitle className="text-xl leading-tight">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                      <Link to={`/blog/${blog.slug}`}>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Read More →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {service.faqs.map((faq: any, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground">
              Book your {service.title.toLowerCase()} today and experience the CleanPro difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  Book Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

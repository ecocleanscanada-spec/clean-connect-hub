import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import ecocleans from "@/assets/ecocleans-logo.png";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const services = [
  { name: "Maid Service", slug: "maid-service" },
  { name: "House Cleaning", slug: "house-cleaning" },
  { name: "Office Cleaning", slug: "office-cleaning" },
  { name: "Warehouse Cleaning", slug: "warehouse-cleaning" },
  { name: "Window Cleaning", slug: "window-cleaning" },
  { name: "Carpet Cleaning", slug: "carpet-cleaning" },
  { name: "Janitorial Service", slug: "janitorial-service" },
  { name: "Upholstery Cleaning", slug: "upholstery-cleaning" },
  { name: "Air Duct Cleaning", slug: "air-duct-cleaning" },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Contact Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-8 text-sm">
            <a 
              href="tel:204-990-7686" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
            >
              <Phone className="h-4 w-4 animate-[pulse_2s_ease-in-out_infinite] group-hover:scale-110 transition-transform" />
              <span>204-990-7686</span>
            </a>
            <a 
              href="mailto:contact@ecocleans.ca" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
            >
              <Mail className="h-4 w-4 animate-[bounce_2s_ease-in-out_infinite] group-hover:scale-110 transition-transform" />
              <span>contact@ecocleans.ca</span>
            </a>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-28 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={ecocleans} alt="Ecocleans Pristine Clean" style={{ width: '360px', height: '144px' }} className="object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {services.map((service) => (
                        <li key={service.slug}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/services/${service.slug}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{service.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            
            <Link to="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Blog
            </Link>

            <Link to="/book">
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/"
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <div className="space-y-2">
              <div className="py-2 text-sm font-medium flex items-center gap-1">
                Services <ChevronDown className="h-4 w-4" />
              </div>
              <div className="pl-4 space-y-2">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/contact"
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <Link
              to="/blog"
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>

            <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                Book Now
              </Button>
            </Link>
          </div>
        )}
      </div>
      </nav>
    </>
  );
}

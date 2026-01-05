import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import ecocleans from "@/assets/ecocleans-logo.png";

const services = [
  { name: "Maid Service", slug: "maid-service" },
  { name: "House Cleaning", slug: "house-cleaning" },
  { name: "Office Cleaning", slug: "office-cleaning" },
  { name: "Warehouse Cleaning", slug: "warehouse-cleaning" },
  { name: "Window Cleaning", slug: "window-cleaning" },
  { name: "Carpet Cleaning", slug: "carpet-cleaning" },
];

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img src={ecocleans} alt="Ecocleans Pristine Clean" style={{ width: '180px', height: '72px' }} className="object-contain" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional cleaning services you can trust. Making spaces shine since 2024.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:204-990-7686" className="hover:text-foreground transition-colors">204-990-7686</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@ecocleans.ca" className="hover:text-foreground transition-colors">contact@ecocleans.ca</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>6-719 Sherbrook Street<br />Winnipeg, MB R3B 2X4</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ecocleans. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

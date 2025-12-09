import { useParams, Link } from "react-router-dom";
import { useBlogBySlug } from "@/hooks/useBlogs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { format } from "date-fns";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: blog, isLoading, error } = useBlogBySlug(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
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
      <section className="bg-gradient-hero text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          {blog.category && (
            <Badge variant="secondary" className="mb-4">
              {blog.category}
            </Badge>
          )}
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(blog.created_at), "MMMM d, yyyy")}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {blog.image_url && (
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
            />
          )}
          
          {blog.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
          
          <div className="prose prose-lg max-w-none">
            {blog.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {blog.service_slug && (
            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Related Service</h3>
              <p className="text-muted-foreground mb-4">
                Learn more about our {blog.service_slug.replace(/-/g, " ")} service.
              </p>
              <Link to={`/services/${blog.service_slug}`}>
                <Button>View Service Details</Button>
              </Link>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}

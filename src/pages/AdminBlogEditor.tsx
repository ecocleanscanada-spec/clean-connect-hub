import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBlogBySlug, useCreateBlog, useUpdateBlog, Blog } from "@/hooks/useBlogs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const serviceOptions = [
  { value: "maid-service", label: "Maid Service" },
  { value: "house-cleaning", label: "House Cleaning" },
  { value: "office-cleaning", label: "Office Cleaning" },
  { value: "warehouse-cleaning", label: "Warehouse Cleaning" },
  { value: "window-cleaning", label: "Window Cleaning" },
  { value: "carpet-cleaning", label: "Carpet Cleaning" },
  { value: "janitorial-service", label: "Janitorial Service" },
  { value: "upholstery-cleaning", label: "Upholstery Cleaning" },
  { value: "air-duct-cleaning", label: "Air Duct Cleaning" },
];

export default function AdminBlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== "new";
  
  const { user, loading: authLoading, isAdmin } = useAuth();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loadingBlog, setLoadingBlog] = useState(false);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [serviceSlug, setServiceSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      toast.error("Admin access required");
      navigate("/admin");
    }
  }, [authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (isEditing && id) {
      setLoadingBlog(true);
      supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            toast.error("Failed to load blog post");
            navigate("/admin");
          } else if (data) {
            setBlog(data as Blog);
            setTitle(data.title);
            setSlug(data.slug);
            setExcerpt(data.excerpt || "");
            setContent(data.content);
            setCategory(data.category || "");
            setServiceSlug(data.service_slug || "");
            setImageUrl(data.image_url || "");
            setPublished(data.published);
          }
          setLoadingBlog(false);
        });
    }
  }, [isEditing, id, navigate]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error("Please fill in title, slug, and content");
      return;
    }

    const blogData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content: content.trim(),
      category: category || undefined,
      service_slug: serviceSlug || undefined,
      image_url: imageUrl.trim() || undefined,
      published,
    };

    try {
      if (isEditing && id) {
        await updateBlog.mutateAsync({ id, ...blogData });
      } else {
        await createBlog.mutateAsync(blogData);
      }
      navigate("/admin");
    } catch (error) {
      // Error is handled by mutation
    }
  };

  if (authLoading || loadingBlog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
              <CardDescription>
                {isEditing ? "Update your blog post content" : "Write a new blog post for your website"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="blog-post-slug"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description for previews..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your blog post content here..."
                    rows={12}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g., Tips, Guides"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Related Service</Label>
                    <Select value={serviceSlug} onValueChange={setServiceSlug}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {serviceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Featured Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={createBlog.isPending || updateBlog.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createBlog.isPending || updateBlog.isPending
                      ? "Saving..."
                      : isEditing
                      ? "Update Post"
                      : "Create Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

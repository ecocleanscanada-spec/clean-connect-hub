import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  service_slug: string | null;
  image_url: string | null;
  author_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  service_slug?: string;
  image_url?: string;
  published?: boolean;
}

export function useBlogs(serviceSlug?: string) {
  return useQuery({
    queryKey: ["blogs", serviceSlug],
    queryFn: async () => {
      let query = supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (serviceSlug) {
        query = query.eq("service_slug", serviceSlug);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Blog[];
    },
  });
}

export function useAllBlogs() {
  return useQuery({
    queryKey: ["blogs", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Blog[];
    },
  });
}

export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Blog | null;
    },
    enabled: !!slug,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: BlogInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("blogs")
        .insert({ ...blog, author_id: user?.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...blog }: BlogInput & { id: string }) => {
      const { data, error } = await supabase
        .from("blogs")
        .update(blog)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

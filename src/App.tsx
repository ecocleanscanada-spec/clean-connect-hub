import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import Contact from "./pages/Contact";
import Book from "./pages/Book";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import GMBGuide from "./pages/GMBGuide";
import NotFound from "./pages/NotFound";
import FloatingCallButton from "./components/FloatingCallButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<Book />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/blog/:id" element={<AdminBlogEditor />} />
          <Route path="/gmb-guide" element={<GMBGuide />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingCallButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAllBlogs, useDeleteBlog } from "@/hooks/useBlogs";
import { useBookings, useDeleteBooking, useUpdateBooking } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, LogOut, Eye, Calendar, FileText, Phone, Mail, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { format } from "date-fns";

const BOOKING_STATUSES = [
  { value: "pending", label: "Pending", color: "secondary" },
  { value: "confirmed", label: "Confirmed", color: "default" },
  { value: "completed", label: "Completed", color: "outline" },
  { value: "cancelled", label: "Cancelled", color: "destructive" },
] as const;

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const { data: blogs, isLoading: blogsLoading } = useAllBlogs();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const deleteBlog = useDeleteBlog();
  const deleteBooking = useDeleteBooking();
  const updateBooking = useUpdateBooking();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleDeleteBlog = async () => {
    if (deleteId) {
      await deleteBlog.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleDeleteBooking = async () => {
    if (deleteBookingId) {
      await deleteBooking.mutateAsync(deleteBookingId);
      setDeleteBookingId(null);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    await updateBooking.mutateAsync({ id: bookingId, status: newStatus });
  };

  if (authLoading) {
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

  if (!user) {
    return null;
  }

  const getStatusBadgeVariant = (status: string) => {
    const found = BOOKING_STATUSES.find(s => s.value === status);
    return found?.color || "secondary";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                {isAdmin ? "Manage bookings and blog posts" : "Admin access required"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {!isAdmin && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Access Restricted</CardTitle>
                <CardDescription>
                  You need admin privileges to access this dashboard. Please contact an administrator.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {isAdmin && (
            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Bookings
                </TabsTrigger>
                <TabsTrigger value="blogs" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Blogs
                </TabsTrigger>
              </TabsList>

              {/* Bookings Tab */}
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>
                      View and manage customer booking requests from the voice agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookingsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : bookings && bookings.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Customer</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead>Schedule</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bookings.map((booking) => (
                              <TableRow key={booking.id}>
                                <TableCell>
                                  <div className="font-medium">
                                    {booking.customer_name || "Unknown"}
                                  </div>
                                  {booking.address && (
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                      <MapPin className="h-3 w-3" />
                                      {booking.address}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    {booking.phone_number && (
                                      <div className="text-sm flex items-center gap-1">
                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                        {booking.phone_number}
                                      </div>
                                    )}
                                    {booking.email && (
                                      <div className="text-sm flex items-center gap-1">
                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                        {booking.email}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm space-y-1">
                                    {booking.cleaning_size && (
                                      <div>Size: {booking.cleaning_size}</div>
                                    )}
                                    {(booking.bedrooms || booking.bathrooms) && (
                                      <div>
                                        {booking.bedrooms && `${booking.bedrooms} bed`}
                                        {booking.bedrooms && booking.bathrooms && " / "}
                                        {booking.bathrooms && `${booking.bathrooms} bath`}
                                      </div>
                                    )}
                                    {booking.cleaning_frequency && (
                                      <div className="text-muted-foreground">
                                        {booking.cleaning_frequency}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {booking.schedule_date || "-"}
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={booking.status}
                                    onValueChange={(value) => handleStatusChange(booking.id, value)}
                                  >
                                    <SelectTrigger className="w-[130px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {BOOKING_STATUSES.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                          {status.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  {format(new Date(booking.created_at), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell className="text-right">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteBookingId(booking.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Booking?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete this booking record.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeleteBookingId(null)}>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteBooking}>
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No bookings yet.</p>
                        <p className="text-sm mt-2">Bookings from the voice agent will appear here.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blogs Tab */}
              <TabsContent value="blogs">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>All Blog Posts</CardTitle>
                      <CardDescription>
                        Manage your published and draft blog posts
                      </CardDescription>
                    </div>
                    <Button onClick={() => navigate("/admin/blog/new")}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Blog Post
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {blogsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : blogs && blogs.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blogs.map((blog) => (
                            <TableRow key={blog.id}>
                              <TableCell className="font-medium">{blog.title}</TableCell>
                              <TableCell>{blog.category || "-"}</TableCell>
                              <TableCell>{blog.service_slug || "-"}</TableCell>
                              <TableCell>
                                <Badge variant={blog.published ? "default" : "secondary"}>
                                  {blog.published ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {format(new Date(blog.created_at), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {blog.published && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => navigate(`/blog/${blog.slug}`)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/admin/blog/${blog.id}`)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteId(blog.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the blog post "{blog.title}".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteBlog}>
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No blog posts yet.</p>
                        <Button className="mt-4" onClick={() => navigate("/admin/blog/new")}>
                          Create your first blog post
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

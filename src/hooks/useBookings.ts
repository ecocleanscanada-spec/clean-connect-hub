import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Booking {
  id: string;
  customer_name: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  cleaning_size: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  cleaning_frequency: string | null;
  schedule_date: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BookingInput {
  customer_name?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  cleaning_size?: string;
  bedrooms?: number;
  bathrooms?: number;
  cleaning_frequency?: string;
  schedule_date?: string;
  notes?: string;
  status?: string;
}

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: BookingInput) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert(booking)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: BookingInput & { id: string }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking updated successfully");
    },
    onError: (error) => {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    },
  });
};

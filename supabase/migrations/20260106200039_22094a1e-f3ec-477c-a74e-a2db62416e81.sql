-- Remove the overly permissive public insert policy for bookings
-- Bookings are now created through the secure create-booking edge function
-- which uses the service role key for database access

DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
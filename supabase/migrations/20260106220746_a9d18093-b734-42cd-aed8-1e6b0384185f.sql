-- Add INSERT policy for authenticated users on bookings table
CREATE POLICY "Authenticated users can create bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (true);
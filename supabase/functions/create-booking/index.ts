import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingInput {
  id?: string;
  customerName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  cleaningSize?: string;
  bedrooms?: number;
  bathrooms?: number;
  cleaningFrequency?: string;
  scheduleDate?: string;
  notes?: string;
}

// Validation functions
function sanitizeString(str: string | undefined, maxLength: number): string | null {
  if (!str || typeof str !== "string") return null;
  // Remove HTML tags and trim
  const sanitized = str.replace(/<[^>]*>/g, "").trim();
  return sanitized.length > 0 ? sanitized.slice(0, maxLength) : null;
}

function validateEmail(email: string | undefined): string | null {
  if (!email || typeof email !== "string") return null;
  const sanitized = email.trim().toLowerCase().slice(0, 255);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(sanitized) ? sanitized : null;
}

function validatePhone(phone: string | undefined): string | null {
  if (!phone || typeof phone !== "string") return null;
  // Remove non-digit characters for validation, keep original format
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 10 || digitsOnly.length > 15) return null;
  return phone.trim().slice(0, 20);
}

function validateNumber(num: number | undefined, min: number, max: number): number | null {
  if (num === undefined || num === null || typeof num !== "number") return null;
  if (isNaN(num) || num < min || num > max) return null;
  return Math.floor(num);
}

function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

async function sendEmailNotification(booking: BookingInput): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not configured, skipping email notification");
    return;
  }

  const adminEmail = "info@ecocleans.ca";
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #22c55e; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">🧹 New Booking Request</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9fafb;">
        <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
          Customer Information
        </h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; width: 40%;">Name:</td>
            <td style="padding: 10px 0;">${escapeHtml(booking.customerName || "Not provided")}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 10px 0;">${escapeHtml(booking.phoneNumber || "Not provided")}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Email:</td>
            <td style="padding: 10px 0;">${escapeHtml(booking.email || "Not provided")}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Address:</td>
            <td style="padding: 10px 0;">${escapeHtml(booking.address || "Not provided")}</td>
          </tr>
        </table>
        
        <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px; margin-top: 20px;">
          Cleaning Details
        </h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; width: 40%;">Home Size:</td>
            <td style="padding: 10px 0;">${escapeHtml(booking.cleaningSize || "Not specified")}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Bedrooms:</td>
            <td style="padding: 10px 0;">${booking.bedrooms ?? "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Bathrooms:</td>
            <td style="padding: 10px 0;">${booking.bathrooms ?? "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Frequency:</td>
            <td style="padding: 10px 0;">${escapeHtml(booking.cleaningFrequency || "Not specified")}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;">Preferred Date:</td>
            <td style="padding: 10px 0;">${escapeHtml(booking.scheduleDate || "Not specified")}</td>
          </tr>
        </table>
        
        ${booking.notes ? `
          <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px; margin-top: 20px;">
            Additional Notes
          </h2>
          <p style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
            ${escapeHtml(booking.notes)}
          </p>
        ` : ""}
        
        <div style="margin-top: 30px; padding: 15px; background-color: #dcfce7; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #166534;">
            <strong>Action Required:</strong> Please follow up with this customer as soon as possible.
          </p>
        </div>
      </div>
      
      <div style="background-color: #1f2937; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">EcoCleans - Professional Cleaning Services</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "EcoCleans <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New Booking: ${escapeHtml(booking.customerName || "New Customer")} - ${escapeHtml(booking.scheduleDate || "Date TBD")}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to send email:", error);
    } else {
      console.log("Email notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase configuration missing");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const input: BookingInput = await req.json();
    const isUpdate = !!input.id;

    console.log(`Processing ${isUpdate ? "update" : "create"} booking request`);

    // Validate and sanitize all inputs
    const validatedData: Record<string, any> = {
      customer_name: sanitizeString(input.customerName, 100),
      phone_number: validatePhone(input.phoneNumber),
      email: validateEmail(input.email),
      address: sanitizeString(input.address, 200),
      cleaning_size: sanitizeString(input.cleaningSize, 50),
      bedrooms: validateNumber(input.bedrooms, 0, 50),
      bathrooms: validateNumber(input.bathrooms, 0, 50),
      cleaning_frequency: sanitizeString(input.cleaningFrequency, 50),
      schedule_date: sanitizeString(input.scheduleDate, 50),
      notes: sanitizeString(input.notes, 1000),
    };

    // For new bookings, require at least customer name or contact info
    if (!isUpdate) {
      const hasContactInfo = validatedData.customer_name || validatedData.email || validatedData.phone_number;
      if (!hasContactInfo) {
        return new Response(
          JSON.stringify({ error: "At least customer name, email, or phone number is required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Create Supabase client with service role for server-side operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let result;
    if (isUpdate && input.id) {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(input.id)) {
        return new Response(
          JSON.stringify({ error: "Invalid booking ID format" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { data, error } = await supabase
        .from("bookings")
        .update(validatedData)
        .eq("id", input.id)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating booking:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update booking" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      result = data;
    } else {
      const { data, error } = await supabase
        .from("bookings")
        .insert(validatedData)
        .select("id")
        .single();

      if (error) {
        console.error("Error creating booking:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create booking" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      result = data;

      // Send email notification for new bookings only
      await sendEmailNotification(input);
    }

    console.log(`Booking ${isUpdate ? "updated" : "created"} successfully:`, result?.id);

    return new Response(
      JSON.stringify({ id: result?.id, success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in create-booking function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

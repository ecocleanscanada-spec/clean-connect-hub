import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

class Resend {
  private apiKey: string;
  
  constructor(apiKey: string | undefined) {
    if (!apiKey) throw new Error("RESEND_API_KEY is required");
    this.apiKey = apiKey;
  }
  
  emails = {
    send: async (options: {
      from: string;
      to: string[];
      subject: string;
      html: string;
    }) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to send email: ${error}`);
      }
      
      return response.json();
    },
  };
}

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  customerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  cleaningSize: string;
  bedrooms: number;
  bathrooms: number;
  cleaningFrequency: string;
  scheduleDate: string;
  notes: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingNotificationRequest = await req.json();
    
    console.log("Sending booking notification for:", booking.customerName);

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
              <td style="padding: 10px 0;">${booking.customerName || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 10px 0;">${booking.phoneNumber || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0;">${booking.email || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Address:</td>
              <td style="padding: 10px 0;">${booking.address || 'Not provided'}</td>
            </tr>
          </table>
          
          <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px; margin-top: 20px;">
            Cleaning Details
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; width: 40%;">Home Size:</td>
              <td style="padding: 10px 0;">${booking.cleaningSize || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Bedrooms:</td>
              <td style="padding: 10px 0;">${booking.bedrooms || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Bathrooms:</td>
              <td style="padding: 10px 0;">${booking.bathrooms || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Frequency:</td>
              <td style="padding: 10px 0;">${booking.cleaningFrequency || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Preferred Date:</td>
              <td style="padding: 10px 0;">${booking.scheduleDate || 'Not specified'}</td>
            </tr>
          </table>
          
          ${booking.notes ? `
            <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px; margin-top: 20px;">
              Additional Notes
            </h2>
            <p style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
              ${booking.notes}
            </p>
          ` : ''}
          
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

    const emailResponse = await resend.emails.send({
      from: "EcoCleans <onboarding@resend.dev>",
      to: [booking.adminEmail],
      subject: `New Booking: ${booking.customerName || 'New Customer'} - ${booking.scheduleDate || 'Date TBD'}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

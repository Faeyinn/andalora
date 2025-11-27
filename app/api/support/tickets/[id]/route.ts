import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch ticket details
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .select("*, user:users(full_name, email)")
      .eq("id", id)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { success: false, error: "Tiket tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from("support_messages")
      .select("*, sender:users(full_name)")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    if (messagesError) {
      return NextResponse.json(
        { success: false, error: "Gagal mengambil pesan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ticket,
        messages,
      },
    });
  } catch (error) {
    console.error("Get ticket details error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST: Send a reply
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Pesan wajib diisi" },
        { status: 400 }
      );
    }

    // Check if user is admin (for is_admin flag)
    // We can check the user's role from the session or DB
    // Assuming we have a helper or just query
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = userData?.role === "admin";

    // Insert message
    const { data: newMessage, error: messageError } = await supabase
      .from("support_messages")
      .insert({
        ticket_id: id,
        sender_id: user.id,
        message,
        is_admin: isAdmin,
      })
      .select()
      .single();

    if (messageError) {
      return NextResponse.json(
        { success: false, error: "Gagal mengirim pesan" },
        { status: 500 }
      );
    }

    // Update ticket status if needed (e.g. if user replies, set to open/in_progress)
    // If admin replies, maybe set to 'in_progress' or 'closed' via separate action?
    // For now, just update updated_at (handled by trigger)

    // If Admin replies, create notification for user
    if (isAdmin) {
      // Get ticket owner
      const { data: ticket } = await supabase
        .from("support_tickets")
        .select("user_id, subject")
        .eq("id", id)
        .single();

      if (ticket) {
        await supabase.from("notifications").insert({
          user_id: ticket.user_id,
          title: "Balasan Baru",
          message: `Admin membalas tiket Anda: "${ticket.subject}"`,
          type: "support",
          link: `/bantuan/${id}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Reply ticket error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

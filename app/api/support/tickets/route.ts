import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let query = supabase
      .from("support_tickets")
      .select("*")
      .order("updated_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching tickets:", error);
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data tiket" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

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
    const { subject, message, priority = "normal" } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: "Subject dan pesan wajib diisi" },
        { status: 400 }
      );
    }

    // Start transaction (Supabase doesn't support explicit transactions in HTTP API easily,
    // so we do it sequentially. If message fails, we have an empty ticket.
    // Better to use RPC but for MVP sequential is fine or delete ticket if message fails)

    // 1. Create Ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .insert({
        user_id: user.id,
        subject,
        priority,
        status: "open",
      })
      .select()
      .single();

    if (ticketError) {
      console.error("Error creating ticket:", ticketError);
      return NextResponse.json(
        { success: false, error: "Gagal membuat tiket" },
        { status: 500 }
      );
    }

    // 2. Create First Message
    const { error: messageError } = await supabase
      .from("support_messages")
      .insert({
        ticket_id: ticket.id,
        sender_id: user.id,
        message,
        is_admin: false,
      });

    if (messageError) {
      console.error("Error creating message:", messageError);
      // Cleanup ticket
      await supabase.from("support_tickets").delete().eq("id", ticket.id);
      return NextResponse.json(
        { success: false, error: "Gagal mengirim pesan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ticket,
      message: "Tiket berhasil dibuat",
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

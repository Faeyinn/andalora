import { createAdminClient } from "@/lib/supabase/admin";

export type NotificationType =
  | "product_created"
  | "product_updated"
  | "product_deleted"
  | "product_deleted_by_admin"
  | "product_favorited"
  | "transaction"
  | "support";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  relatedProductId?: string;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  relatedProductId,
}: CreateNotificationParams) {
  try {
    // Use admin client to bypass RLS, ensuring we can send notifications to any user
    const supabase = createAdminClient();

    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      type,
      title,
      message,
      related_product_id: relatedProductId,
      is_read: false,
    });

    if (error) {
      console.error("Error creating notification:", error);
    }
  } catch (err) {
    console.error("Unexpected error creating notification:", err);
  }
}

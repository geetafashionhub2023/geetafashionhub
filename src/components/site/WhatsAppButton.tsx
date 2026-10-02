import { WhatsAppIcon } from "@/components/icons";
import { whatsappHref } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/types";

export function WhatsAppButton({
  settings,
  message,
  children = "Chat with Us on WhatsApp",
  className = "",
  variant = "whatsapp",
}: {
  settings: Pick<SiteSettings, "whatsapp_number">;
  message: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "whatsapp" | "primary" | "gold" | "ghost-light" | "outline";
}) {
  return (
    <a
      href={whatsappHref(settings, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variant} ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      <span>{children}</span>
    </a>
  );
}

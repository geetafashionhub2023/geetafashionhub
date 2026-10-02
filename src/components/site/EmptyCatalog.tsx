import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { messages } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/types";

export function EmptyCatalog({ settings, label = "our latest collection" }: { settings: SiteSettings; label?: string }) {
  return (
    <div className="mx-auto max-w-md rounded-[1.5rem] bg-paper px-8 py-14 text-center ring-1 ring-line">
      <p className="font-display text-2xl text-maroon-deep">New pieces are on their way</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        We&apos;re photographing {label}. Message us on WhatsApp and we&apos;ll share what&apos;s available right now.
      </p>
      <div className="mt-6 flex justify-center">
        <WhatsAppButton settings={settings} message={messages.general(settings)}>Ask on WhatsApp</WhatsAppButton>
      </div>
    </div>
  );
}

import type { SiteSettings } from "@/lib/types";

/** "in Ahmedabad" when the owner has entered a city, otherwise nothing. */
export const inCity = (s: SiteSettings) => (s.city ? ` in ${s.city}` : "");

/**
 * Default landing-page copy for each category, written for people searching for
 * these services locally. The owner can override any of it per category in /admin.
 */
export const categoryCopy: Record<string, (s: SiteSettings) => { heading: string; intro: string }> = {
  blouses: (s) => ({
    heading: `Designer Blouses${inCity(s)}`,
    intro:
      "Ready-to-wear and made-to-measure blouses to pair with your sarees and lehengas — from simple everyday cuts to richly worked designer pieces. Ask us about necklines, sleeves and back designs on WhatsApp.",
  }),
  "antique-blouses": () => ({
    heading: "Antique & Heritage Designer Blouses",
    intro:
      "Antique zari, temple-style and heritage-finish blouses that bring an heirloom feel to silk and Kanjeevaram sarees. Most designs can be customised to your measurements.",
  }),
  "custom-blouses": (s) => ({
    heading: `Custom Blouse Stitching${inCity(s)}`,
    intro:
      "Bring your fabric or choose ours. We stitch blouses to your measurements with the neckline, sleeve, lining and finishing you want — including princess-cut, padded and bridal styles.",
  }),
  "chaniya-choli": (s) => ({
    heading: `Chaniya Choli${inCity(s)}`,
    intro:
      "Colourful, flared chaniya cholis for Navratri, garba and festive evenings — with mirror work, embroidery and traditional prints. Available for women and girls, with customisation on request.",
  }),
  "salwar-kameez": () => ({
    heading: "Salwar Kameez & Salwar Suits",
    intro:
      "Comfortable and elegant salwar kameez suits for daily wear, festivals and family functions. Choose a ready piece or have one stitched to your fit.",
  }),
  "salwar-kurta": () => ({
    heading: "Salwar Kurta Sets",
    intro: "Easy, graceful kurtas with salwar for everyday wear, work and celebrations — stitched to fit when you need it.",
  }),
  "bridal-wear": (s) => ({
    heading: `Bridal Wear & Bridal Blouses${inCity(s)}`,
    intro:
      "Bridal blouses, cholis and outfits designed around your wedding look. Share your saree or lehenga with us and we will work with you on the design, embellishment and fit.",
  }),
  "wedding-collection": () => ({
    heading: "Wedding Collection",
    intro: "Outfits for haldi, mehendi, sangeet, the wedding and the reception — for the bride's family and every guest.",
  }),
  "festive-wear": () => ({
    heading: "Festive Ethnic Wear",
    intro: "Traditional outfits for Diwali, Navratri, Eid, Raksha Bandhan and every celebration in between.",
  }),
  "womens-ethnic-wear": (s) => ({
    heading: `Women's Ethnic Wear${inCity(s)}`,
    intro: "Traditional Indian clothing for women — blouses, suits, kurtas, cholis and occasion wear, with stitching and alterations available.",
  }),
  "girls-wear": () => ({
    heading: "Girls' Ethnic Wear",
    intro: "Lehenga cholis, chaniya cholis and suits for girls — festive, comfortable and made to move in.",
  }),
  "kids-traditional-wear": (s) => ({
    heading: `Traditional Kids' Clothing${inCity(s)}`,
    intro: "Traditional outfits for children for festivals, pujas, weddings and family functions — with custom stitching for the perfect fit.",
  }),
  "custom-designs": () => ({
    heading: "Custom-Designed Outfits",
    intro: "Have a design in mind, or a photo you love? We will help you turn it into an outfit made just for you.",
  }),
  "stitching-services": (s) => ({
    heading: `Custom Stitching & Alterations${inCity(s)}`,
    intro: "Blouse stitching, suit and kurta stitching, chaniya choli customisation, kids' clothing and alterations — all to your measurements.",
  }),
};

export const stitchingServices = [
  { title: "Custom Blouse Stitching", body: "Any neckline, sleeve or back design — lined, padded or princess-cut, stitched to your measurements." },
  { title: "Bridal Blouse Stitching", body: "Detailed bridal blouses with embroidery, latkans and finishing planned around your wedding look." },
  { title: "Chaniya Choli Customisation", body: "Adjust flare, length, choli fit or add work and borders to make a chaniya choli your own." },
  { title: "Salwar & Kurta Stitching", body: "Salwar kameez, kurtas, anarkalis and suits — cut and stitched to fit you comfortably." },
  { title: "Kids' Traditional Clothing", body: "Festive and function outfits for children, sized properly and comfortable to wear." },
  { title: "Alterations", body: "Resizing, length changes, fitting fixes and refreshes for outfits you already love." },
  { title: "Custom Measurements", body: "Get measured at the store, or share your measurements and a well-fitting sample." },
  { title: "Custom Designs", body: "Bring a photo, sketch or idea — we'll help you choose fabric, design and finishing." },
];

export const collections: { slug: string; title: string; blurb: string; categories: string[] }[] = [
  { slug: "bridal-wedding", title: "Bridal & Wedding", blurb: "Bridal blouses, wedding outfits and function wear.", categories: ["bridal-wear", "wedding-collection"] },
  { slug: "blouses", title: "The Blouse Edit", blurb: "Antique, designer and custom-stitched blouses.", categories: ["blouses", "antique-blouses", "custom-blouses"] },
  { slug: "festive", title: "Festive & Navratri", blurb: "Chaniya cholis and festive ethnic wear.", categories: ["chaniya-choli", "festive-wear"] },
  { slug: "suits", title: "Suits & Kurtas", blurb: "Salwar kameez and salwar kurta sets.", categories: ["salwar-kameez", "salwar-kurta", "womens-ethnic-wear"] },
  { slug: "little-ones", title: "Girls & Kids", blurb: "Traditional wear for girls and children.", categories: ["girls-wear", "kids-traditional-wear"] },
  { slug: "made-for-you", title: "Made for You", blurb: "Custom designs and stitching services.", categories: ["custom-designs", "stitching-services"] },
];

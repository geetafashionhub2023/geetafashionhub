/** Bundled editorial imagery (Unsplash stand-ins, see public/images/lookbook/CREDITS.md). */
const img = (name: string) => `/images/lookbook/${name}.jpg`;

export const BRAND_IMAGES = {
  hero: img("hero-bride-arch"),
  bridal: img("maharani-velvet-bridal"),
  blouseBack: img("red-silk-blouse-back"),
  zari: img("zari-detail"),
  zari2: img("zari-detail-2"),
  zari3: img("zari-detail-3"),
  about: img("bridal-mirror"),
  stitching: img("red-silk-blouse-detail"),
};

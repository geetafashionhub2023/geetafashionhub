-- Default catalogue categories. Products, prices, hours and contact details are
-- intentionally NOT seeded — the owner enters real data in /admin.

insert into public.categories (name, slug, sort_order, description) values
  ('Blouses',               'blouses',               10,  'Ready and made-to-measure blouses for sarees and lehengas.'),
  ('Antique Blouses',       'antique-blouses',       20,  'Antique zari, temple and heritage-finish designer blouses.'),
  ('Custom Blouses',        'custom-blouses',        30,  'Blouses stitched to your measurements and design.'),
  ('Chaniya Choli',         'chaniya-choli',         40,  'Traditional and festive chaniya cholis for Navratri, garba and celebrations.'),
  ('Salwar Kameez',         'salwar-kameez',         50,  'Classic and contemporary salwar kameez suits.'),
  ('Salwar Kurta',          'salwar-kurta',          60,  'Everyday and occasion kurtas with salwar.'),
  ('Bridal Wear',           'bridal-wear',           70,  'Bridal blouses, cholis and outfits for the big day.'),
  ('Wedding Collection',    'wedding-collection',    80,  'Outfits for weddings, receptions, haldi and sangeet.'),
  ('Festive Wear',          'festive-wear',          90,  'Ethnic wear for Diwali, Navratri, Eid and every festival.'),
  ('Women''s Ethnic Wear',  'womens-ethnic-wear',    100, 'Traditional Indian clothing for women.'),
  ('Girls'' Wear',          'girls-wear',            110, 'Ethnic wear for girls — cholis, lehengas and suits.'),
  ('Kids'' Traditional Wear','kids-traditional-wear',120, 'Traditional outfits for children for festivals and functions.'),
  ('Custom Designs',        'custom-designs',        130, 'One-of-a-kind outfits designed with you.'),
  ('Stitching Services',    'stitching-services',    140, 'Custom stitching, fittings and alterations.')
on conflict (slug) do nothing;

-- After creating your first user in Supabase Auth, make them an admin:
--   insert into public.staff (user_id, role)
--   select id, 'admin' from auth.users where email = 'owner@example.com';

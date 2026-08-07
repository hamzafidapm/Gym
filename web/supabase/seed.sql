-- Seed data mirroring the current static content in lib/data.ts, so the
-- database starts in sync with what's already live on the site.

insert into public.trainers (id, name, first_name, specialty, certs, short_bio, bio, image_path) values
('mara', 'Mara Vance', 'MARA', 'STRENGTH / POWERLIFTING', 'NSCA-CSCS, USAW L2, Precision Nutrition L1',
  'Ten years under a bar. Programs the Heavy Metal block.',
  'Mara ran collegiate strength and conditioning for six years before opening the IRONHAUS barbell program. She coaches the squat like a craft: slow accessories, honest loads, and a logbook you actually fill in.',
  '/img/strength.png'),
('dez', 'Dez Okafor', 'DEZ', 'BOXING / CONDITIONING', 'USA Boxing L2, NASM-CPT',
  'Amateur record 18-3. Teaches footwork before fists.',
  'Dez spent nine years in the amateur ranks and now runs our boxing floor. Expect long rounds on the bag, real defensive drills, and zero cardio-kickboxing choreography.',
  '/img/boxing.png'),
('iris', 'Iris Lund', 'IRIS', 'YOGA / MOBILITY', 'RYT-500, FRCms, Yin 100hr',
  'Recovery is training. She makes sure you believe it.',
  'Iris builds the mobility work that keeps heavy lifters lifting. Her sessions are quiet, precise, and unexpectedly hard — end range strength, not stretching for its own sake.',
  '/img/yoga.png'),
('cole', 'Cole Rivas', 'COLE', 'HIIT / METCON', 'CF-L3, NSCA-CSCS',
  'Built the 34-minute engine block. Sorry in advance.',
  'Cole designs our conditioning: intervals with a purpose, scaled three ways, tracked week over week so you can see the engine getting bigger.',
  '/img/hiit.png'),
('nia', 'Nia Brooks', 'NIA', 'CYCLE / ENDURANCE', 'Schwinn Certified, ACE-CPT, Power-based training',
  'Power-based rides. Watts, not vibes.',
  'Nia rides with numbers. Every bike is power-metered and every ride has a target — threshold work, sweet spot, or a genuinely fun sprint night on Fridays.',
  '/img/hiit.png'),
('tomas', 'Tomas Ehle', 'TOMAS', 'PERSONAL TRAINING / REHAB', 'DPT, NSCA-CSCS, FMS L2',
  'Physio background. The one you see after the tweak.',
  'Tomas is a licensed physical therapist who works one-on-one with members returning from injury, bridging the gap between the clinic and the platform.',
  '/img/coaching.png');

insert into public.class_categories (id, name, blurb, image_path, weekly_count, sort_order) values
('Strength', 'STRENGTH', 'Barbell blocks, real loads, a logbook that fills up.', '/img/strength.png', 6, 1),
('HIIT', 'HIIT', 'Measured intervals. Rower, bike, sled, carry, repeat.', '/img/hiit.png', 4, 2),
('Boxing', 'BOXING', 'Footwork before fists. Contact always optional.', '/img/boxing.png', 4, 3),
('Yoga', 'YOGA', 'Warm, slow, built for people who lift heavy.', '/img/yoga.png', 3, 4),
('Cycle', 'CYCLE', 'Power-metered rides with a written target.', '/img/hiit.png', 4, 5),
('Mobility', 'MOBILITY', 'End-range strength. Assessed and re-tested.', '/img/coaching.png', 3, 6);

insert into public.classes (name, type, day, start_time, duration_min, trainer_id, spots_available, level, room) values
('Heavy Metal', 'Strength', 'Mon', '06:00', 60, 'mara', 4, 'L2', 'A'),
('Engine Room', 'HIIT', 'Mon', '12:15', 45, 'cole', 9, 'L2', 'B'),
('Mobility Reset', 'Mobility', 'Mon', '18:30', 45, 'iris', 12, 'L1', 'C'),
('Bag Work 101', 'Boxing', 'Mon', '19:30', 60, 'dez', 6, 'L1', 'B'),
('Squat Club', 'Strength', 'Tue', '06:30', 75, 'mara', 2, 'L3', 'A'),
('Threshold Ride', 'Cycle', 'Tue', '07:00', 45, 'nia', 5, 'L2', 'D'),
('Slow Flow', 'Yoga', 'Tue', '17:30', 60, 'iris', 14, 'L1', 'C'),
('Metcon 34', 'HIIT', 'Tue', '18:45', 35, 'cole', 0, 'L3', 'B'),
('Press Day', 'Strength', 'Wed', '06:00', 60, 'mara', 7, 'L2', 'A'),
('Sparring Skills', 'Boxing', 'Wed', '12:00', 60, 'dez', 3, 'L2', 'B'),
('Power Hour', 'Cycle', 'Wed', '18:00', 60, 'nia', 8, 'L2', 'D'),
('Yin & Breath', 'Yoga', 'Wed', '20:00', 60, 'iris', 11, 'L1', 'C'),
('Pull Day', 'Strength', 'Thu', '06:30', 60, 'mara', 6, 'L2', 'A'),
('Engine Room', 'HIIT', 'Thu', '12:15', 45, 'cole', 4, 'L2', 'B'),
('Footwork Lab', 'Boxing', 'Thu', '18:30', 45, 'dez', 9, 'L1', 'B'),
('Deep Mobility', 'Mobility', 'Thu', '19:30', 45, 'iris', 13, 'L1', 'C'),
('Total Body', 'Strength', 'Fri', '06:00', 60, 'mara', 5, 'L1', 'A'),
('Sprint Night', 'Cycle', 'Fri', '17:30', 45, 'nia', 1, 'L3', 'D'),
('Fight Fit', 'Boxing', 'Fri', '18:30', 60, 'dez', 7, 'L2', 'B'),
('Saturday Grind', 'HIIT', 'Sat', '09:00', 60, 'cole', 10, 'L2', 'B'),
('Barbell Basics', 'Strength', 'Sat', '10:30', 75, 'mara', 8, 'L1', 'A'),
('Long Ride', 'Cycle', 'Sat', '08:00', 75, 'nia', 6, 'L2', 'D'),
('Recovery Flow', 'Yoga', 'Sun', '09:30', 60, 'iris', 15, 'L1', 'C'),
('Sunday Reset', 'Mobility', 'Sun', '11:00', 45, 'tomas', 12, 'L1', 'C');

insert into public.plans (id, tag, monthly_price, summary, features, sort_order) values
('BASIC', 'GET STARTED', 39, 'Open gym + 4 classes a month',
  '["24/7 open gym access", "4 group classes per month", "Full locker room + towel service", "Free InBody scan every quarter"]'::jsonb, 1),
('PREMIUM', 'MOST POPULAR', 79, 'Unlimited classes, everything open',
  '["Everything in Basic", "Unlimited group classes", "Priority booking 14 days out", "1 personal training session / month", "Recovery room + sauna access"]'::jsonb, 2),
('ELITE', 'FULL SUPPORT', 129, 'Coached, programmed, tracked',
  '["Everything in Premium", "4 personal training sessions / month", "Custom 8-week written program", "Nutrition check-in every 2 weeks", "Guest passes ×2 per month"]'::jsonb, 3);

insert into public.testimonials (quote, member_name, meta, sort_order) values
('I came in to lose weight and left with a 245 lb deadlift I didn’t know I wanted. Fourteen months, three blocks, zero missed check-ins.', 'Priya R.', 'Member since 2024 · Premium', 1),
('Every other gym sold me a year. IRONHAUS gave me a program and a coach who noticed when I stopped showing up.', 'Marcus T.', 'Member since 2022 · Elite', 2),
('Post-surgery I thought heavy training was over. Tomas rebuilt my shoulder in eight weeks of boring, careful work. I press again.', 'Elena D.', 'Member since 2023 · Elite', 3),
('The 06:00 crew is the only reason I get out of bed. Nobody performs. Everybody works.', 'Jae Kim', 'Member since 2021 · Premium', 4);

insert into public.gallery_items (alt_text, label, image_path, object_position, sort_order) values
('Member locking out a heavy deadlift on the platform', 'PLATFORM / 06:00', '/img/strength.png', 'center 35%', 1),
('Coach cueing a dumbbell row during a personal training session', 'SPOT / 1-ON-1', '/img/coaching.png', 'center 30%', 2),
('Fighter wrapping his hands before bag work', 'WRAPS / BAG ROW', '/img/boxing.png', 'center 45%', 3),
('Group class moving through a squat interval', 'ENGINE ROOM', '/img/hiit.png', 'center 40%', 4),
('Sunset yoga class in Studio C', 'STUDIO C / 20:00', '/img/yoga.png', 'center 45%', 5),
('Barbell set up for a strength block', 'STRENGTH BLOCK', '/img/strength.png', 'left 40%', 6),
('Coach leading the Saturday group session', 'SATURDAY CREW', '/img/hiit.png', 'right 45%', 7),
('Boxing gloves and wraps on the conditioning floor', 'GLOVES', '/img/boxing.png', 'left 55%', 8);

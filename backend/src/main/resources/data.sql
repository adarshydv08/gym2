-- Roles
INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_OWNER');
INSERT IGNORE INTO roles (id, name) VALUES (2, 'ROLE_MANAGER');
INSERT IGNORE INTO roles (id, name) VALUES (3, 'ROLE_MEMBER');

-- BCrypt password for 'Password@123' is $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVym50CR73g005j81oJzU0i6
-- Users
INSERT INTO users (id, name, email, phone, password, status) VALUES 
(1, 'Aditya Sharma', 'owner@ironfit.in', '+91 98765 43210', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(2, 'Rahul Verma', 'rahul@ironfit.in', '+91 98765 43211', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(3, 'Priya Singh', 'priya@ironfit.in', '+91 98765 43212', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(4, 'Arjun Mehta', 'arjun@ironfit.in', '+91 98765 43213', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(5, 'Pooja Sharma', 'pooja@ironfit.in', '+91 98765 43214', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(6, 'Vikram Singh', 'vikram@ironfit.in', '+91 98765 43215', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(7, 'Neha Kapoor', 'neha@ironfit.in', '+91 98765 43216', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(8, 'Rohan Kumar', 'rohan@ironfit.in', '+91 98765 43217', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(9, 'Ananya Gupta', 'ananya@ironfit.in', '+91 98765 43218', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(10, 'Neha Joshi', 'nehaj@ironfit.in', '+91 98765 43219', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- User Roles
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES 
(1, 1), -- Owner
(2, 2), -- Manager 1
(3, 2), -- Manager 2
(4, 2), -- Trainer 1 (has staff access)
(5, 2), -- Trainer 2
(6, 2), -- Trainer 3
(7, 2), -- Trainer 4
(8, 3), -- Member 1
(9, 3), -- Member 2
(10, 3); -- Member 3

-- Managers
INSERT IGNORE INTO managers (id, user_id, department) VALUES 
(1, 2, 'Operations & Member Services'),
(2, 3, 'Fitness & Facility Management');

-- Trainers
INSERT IGNORE INTO trainers (id, user_id, specialization, experience_years, certifications, rating, bio, monthly_rate) VALUES 
(1, 4, 'Strength & Conditioning', 6, 'ACE Certified Personal Trainer, CSCS', 4.9, 'Expert in heavy compound lifts, hypertrophy, and athletic conditioning.', 4999.00),
(2, 5, 'Yoga & Mobility', 5, 'RYT 500 Certified Yoga Master', 4.8, 'Specializes in Hatha Yoga, posture recovery, flexibility, and mind-body flow.', 3999.00),
(3, 6, 'Weight Training & Bodybuilding', 8, 'IFBB Pro Prep Coach, K11 Certified', 4.9, 'Dedicated coach for muscle transformation, contest prep, and fat loss.', 5999.00),
(4, 7, 'Women Fitness & Functional Training', 4, 'CrossFit Level 1, NASM Certified', 4.7, 'Empowering women through functional strength, HIIT, and endurance.', 3499.00);

-- Members
INSERT IGNORE INTO members (id, user_id, membership_number, emergency_contact, gender, date_of_birth, address) VALUES 
(1, 8, 'IF-2026-001', '+91 98111 22233', 'Male', '1998-05-14', 'Civil Lines, Roorkee, Uttarakhand'),
(2, 9, 'IF-2026-002', '+91 98222 33344', 'Female', '2001-09-21', 'IIT Roorkee Campus, Roorkee, Uttarakhand'),
(3, 10, 'IF-2026-003', '+91 98333 44455', 'Female', '1996-03-10', 'Ramnagar, Roorkee, Uttarakhand');

-- Membership Plans
INSERT IGNORE INTO membership_plans (id, title, description, duration_months, price_inr, benefits, is_popular) VALUES 
(1, 'Monthly Pass', 'Basic monthly access to all gym equipment and cardio zones.', 1, 1499.00, 'Full Gym Access, Locker Access, Free Diet Chart', FALSE),
(2, 'Quarterly Fitness', '3-month comprehensive fitness pass with trainer guidance.', 3, 3999.00, 'Full Gym Access, 2 Personal Trainer Sessions, Group Classes', FALSE),
(3, 'Half-Yearly Pro', '6-month total fitness transformation plan with max value.', 6, 6999.00, 'Full Access, Unlimited Group Classes, Steam Bath, Sauna', TRUE),
(4, 'Yearly Champion', '12-month elite membership with priority perks and PT discounts.', 12, 11999.00, 'All Access, Free PT 4 Sessions/mo, Guest Pass, Merchandise', FALSE),
(5, 'Student Special', 'Discounted 3-month plan for students with valid ID.', 3, 2999.00, 'Off-peak Gym Access (6 AM - 4 PM), Free WiFi, Group Fitness', FALSE);

-- Memberships
INSERT IGNORE INTO memberships (id, member_id, plan_id, start_date, end_date, status, amount_paid) VALUES 
(1, 1, 3, '2026-06-01', '2026-12-01', 'ACTIVE', 6999.00),
(2, 2, 4, '2026-01-15', '2027-01-15', 'ACTIVE', 11999.00),
(3, 3, 1, '2026-07-01', '2026-08-01', 'EXPIRING_SOON', 1499.00);

-- Classes
INSERT IGNORE INTO classes (id, trainer_id, title, description, category, day_of_week, start_time, end_time, capacity, location) VALUES 
(1, 1, 'High-Intensity Power HIIT', 'Full body calorie burner combining kettlebells and plyometrics.', 'HIIT', 'Monday', '07:00 AM', '08:00 AM', 20, 'Studio 1'),
(2, 2, 'Sunrise Yoga & Meditation', 'Restorative morning yoga flow for mental focus and joint mobility.', 'Yoga', 'Wednesday', '06:30 AM', '07:30 AM', 25, 'Mindfulness Zone'),
(3, 3, 'Heavy Duty CrossFit Circuit', 'Challenging Olympic lifting & conditioning circuit for peak performance.', 'CrossFit', 'Friday', '06:00 PM', '07:00 PM', 15, 'CrossFit Box'),
(4, 4, 'Women Strength & Cardio Sculpt', 'Targeted toning, core stability, and cardio rhythm training.', 'Women Fitness', 'Tuesday', '05:00 PM', '06:00 PM', 20, 'Studio 2');

-- Class Bookings
INSERT IGNORE INTO class_bookings (id, class_id, member_id, booking_date, status) VALUES 
(1, 1, 1, '2026-08-03', 'CONFIRMED'),
(2, 2, 2, '2026-08-05', 'CONFIRMED'),
(3, 4, 3, '2026-08-04', 'CONFIRMED');

-- Attendance
INSERT IGNORE INTO attendance (id, member_id, date, check_in_time, check_out_time, gym_branch) VALUES 
(1, 1, '2026-07-30', '2026-07-30 07:15:00', '2026-07-30 08:45:00', 'Roorkee Main Branch'),
(2, 2, '2026-07-30', '2026-07-30 08:00:00', '2026-07-30 09:30:00', 'Roorkee Main Branch'),
(3, 3, '2026-07-29', '2026-07-29 17:30:00', '2026-07-29 19:00:00', 'Roorkee Main Branch');

-- Workout Plans
INSERT IGNORE INTO workout_plans (id, member_id, trainer_id, title, goal, notes) VALUES 
(1, 1, 1, 'Hypertrophy & Strength Split', 'Muscle Gain', 'Focus on 8-12 rep range with progressive overload.'),
(2, 2, 4, 'Fat Loss & Core Sculpt', 'Tone & Endurance', 'Keep rest periods under 45s between supersets.');

-- Workout Exercises
INSERT IGNORE INTO workout_exercises (id, workout_plan_id, exercise_name, sets, reps, weight_kg, rest_seconds, day_name) VALUES 
(1, 1, 'Barbell Back Squats', 4, 8, 80.0, 90, 'Day 1 - Legs & Core'),
(2, 1, 'Bench Press', 4, 10, 70.0, 75, 'Day 2 - Chest & Triceps'),
(3, 1, 'Barbell Deadlifts', 3, 6, 100.0, 120, 'Day 3 - Back & Biceps'),
(4, 2, 'Dumbbell Walking Lunges', 3, 15, 12.0, 45, 'Day 1 - Lower Body'),
(5, 2, 'Plank to Pushup', 4, 12, 0.0, 30, 'Day 2 - Core & Upper Body');

-- Payments
INSERT IGNORE INTO payments (id, member_id, membership_id, amount_inr, payment_method, payment_status, transaction_id) VALUES 
(1, 1, 1, 6999.00, 'UPI', 'SUCCESSFUL', 'TXN-UPI-20260601-9988'),
(2, 2, 2, 11999.00, 'Credit Card', 'SUCCESSFUL', 'TXN-CC-20260115-4433'),
(3, 3, 3, 1499.00, 'UPI', 'SUCCESSFUL', 'TXN-UPI-20260701-1122');

-- Invoices
INSERT IGNORE INTO invoices (id, payment_id, invoice_number, pdf_url) VALUES 
(1, 1, 'INV-2026-0001', '/invoices/INV-2026-0001.pdf'),
(2, 2, 'INV-2026-0002', '/invoices/INV-2026-0002.pdf'),
(3, 3, 'INV-2026-0003', '/invoices/INV-2026-0003.pdf');

-- Complaints
INSERT IGNORE INTO complaints (id, member_id, assigned_manager_id, subject, description, category, priority, status) VALUES 
(1, 1, 1, 'Treadmill #4 Display Flicker', 'The touch display on Treadmill #4 near the window flickers during high speed running.', 'Equipment', 'MEDIUM', 'IN_PROGRESS'),
(2, 3, 2, 'Locker Room Water Temperature', 'Hot water supply in shower stall #2 was lukewarm around 8:00 AM today.', 'Cleanliness', 'LOW', 'OPEN');

-- Complaint Messages
INSERT IGNORE INTO complaint_messages (id, complaint_id, sender_user_id, message) VALUES 
(1, 1, 8, 'Hi team, noticed the treadmill display flickering during my morning session.'),
(2, 1, 2, 'Thanks Rohan! We have notified the maintenance team. Technician visiting today at 2 PM.');

-- Announcements
INSERT IGNORE INTO announcements (id, title, content, target_role, created_by_user_id) VALUES 
(1, 'Independence Day Special Fitness Challenge!', 'Join our 15-day transformation challenge starting August 1st. Exciting prizes & vouchers for top achievers!', 'ALL', 1),
(2, 'Maintenance Notice - Steam Room', 'Steam room will be closed for routine deep cleaning on Sunday, August 3rd from 12 PM to 4 PM.', 'ALL', 2);

-- Notifications
INSERT IGNORE INTO notifications (id, user_id, title, message, type) VALUES 
(1, 8, 'Class Reminder', 'Your High-Intensity Power HIIT class is scheduled for Monday at 07:00 AM.', 'CLASS_REMINDER'),
(2, 10, 'Membership Renewal Alert', 'Your Monthly Pass expires in 3 days. Renew now to maintain uninterrupted access.', 'MEMBERSHIP_EXPIRY');

-- Gym Settings
INSERT IGNORE INTO gym_settings (id, gym_name, logo_url, address, phone, email, opening_hours, holidays, upi_id) VALUES 
(1, 'IRONFIT FITNESS CLUB', '/assets/logo.png', 'Civil Lines, Roorkee, Uttarakhand - 247667', '+91 98765 43210', 'support@ironfit.in', '5:00 AM - 10:00 PM (Mon-Sat), 6:00 AM - 1:00 PM (Sun)', 'Diwali, Holi, Independence Day', 'ironfit@upi');

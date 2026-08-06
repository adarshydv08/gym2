SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM complaint_messages;
DELETE FROM complaints;
DELETE FROM invoices;
DELETE FROM payments;
DELETE FROM workout_exercises;
DELETE FROM workout_plans;
DELETE FROM attendance;
DELETE FROM class_bookings;
DELETE FROM classes;
DELETE FROM memberships;
DELETE FROM members;
DELETE FROM trainers;
DELETE FROM managers;
DELETE FROM user_roles;
DELETE FROM users;
DELETE FROM announcements;
DELETE FROM gym_settings;
DELETE FROM membership_plans;
DELETE FROM roles;
SET FOREIGN_KEY_CHECKS = 1;

-- Roles
INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_OWNER');
INSERT IGNORE INTO roles (id, name) VALUES (2, 'ROLE_MANAGER');
INSERT IGNORE INTO roles (id, name) VALUES (3, 'ROLE_MEMBER');
INSERT IGNORE INTO roles (id, name) VALUES (4, 'ROLE_TRAINER');

-- BCrypt password for 'Password@123' is $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVym50CR73g005j81oJzU0i6
-- Users
INSERT INTO users (id, name, email, phone, password, status) VALUES 
(1, 'Aditya Sharma', 'owner@ironfit.in', '+91 98765 43210', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(2, 'Sonal Mehta', 'manager1@ironfit.in', '+91 98765 43211', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(3, 'Ritik Joshi', 'trainer1@ironfit.in', '+91 98765 43212', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE'),
(4, 'Tinku Singh', 'tinku@ironfit.in', '+91 98765 43213', '$2a$10$xCuVfWRZb6Up7lNP9qmq3uDcwP5B9OvlPNpkGls2iy0Eny6ASH8uG', 'ACTIVE')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- User Roles
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES 
(1, 1), -- Owner
(2, 2), -- Manager 1
(3, 4), -- Trainer 1
(4, 3); -- Member 1

-- Managers
INSERT IGNORE INTO managers (id, user_id, department) VALUES 
(1, 2, 'Operations & Member Services');

-- Trainers
INSERT IGNORE INTO trainers (id, user_id, specialization, experience_years, certifications, rating, bio, monthly_rate) VALUES 
(1, 3, 'Strength & Conditioning', 6, 'ACE Certified Personal Trainer, CSCS', 4.9, 'Expert in heavy compound lifts, hypertrophy, and athletic conditioning.', 4999.00);

-- Members
INSERT IGNORE INTO members (id, user_id, membership_number, emergency_contact, gender, date_of_birth, address) VALUES 
(1, 4, 'IF-2026-001', '+91 98111 22233', 'Male', '1998-05-14', 'Civil Lines, Roorkee, Uttarakhand');

-- Membership Plans
INSERT IGNORE INTO membership_plans (id, title, description, duration_months, price_inr, benefits, is_popular) VALUES 
(1, 'Monthly Pass', 'Basic monthly access to all gym equipment and cardio zones.', 1, 1499.00, 'Full Gym Access, Locker Access, Free Diet Chart', FALSE),
(2, 'Quarterly Fitness', '3-month comprehensive fitness pass with trainer guidance.', 3, 3999.00, 'Full Gym Access, 2 Personal Trainer Sessions, Group Classes', FALSE),
(3, 'Half-Yearly Pro', '6-month total fitness transformation plan with max value.', 6, 6999.00, 'Full Access, Unlimited Group Classes, Steam Bath, Sauna', TRUE),
(4, 'Yearly Champion', '12-month elite membership with priority perks and PT discounts.', 12, 11999.00, 'All Access, Free PT 4 Sessions/mo, Guest Pass, Merchandise', FALSE),
(5, 'Student Special', 'Discounted 3-month plan for students with valid ID.', 3, 2999.00, 'Off-peak Gym Access (6 AM - 4 PM), Free WiFi, Group Fitness', FALSE);

-- Memberships
INSERT IGNORE INTO memberships (id, member_id, plan_id, start_date, end_date, status, amount_paid) VALUES 
(1, 1, 3, '2026-06-01', '2026-12-01', 'ACTIVE', 6999.00);

-- Classes
INSERT IGNORE INTO classes (id, trainer_id, title, description, category, day_of_week, start_time, end_time, capacity, location) VALUES 
(1, 1, 'High-Intensity Power HIIT', 'Full body calorie burner combining kettlebells and plyometrics.', 'HIIT', 'Monday', '07:00 AM', '08:00 AM', 20, 'Studio 1'),
(2, 1, 'Sunrise Yoga & Meditation', 'Restorative morning yoga flow for mental focus and joint mobility.', 'Yoga', 'Wednesday', '06:30 AM', '07:30 AM', 25, 'Mindfulness Zone');

-- Class Bookings
INSERT IGNORE INTO class_bookings (id, class_id, member_id, booking_date, status) VALUES 
(1, 1, 1, '2026-08-03', 'CONFIRMED');

-- Attendance
INSERT IGNORE INTO attendance (id, member_id, date, check_in_time, check_out_time, gym_branch) VALUES 
(1, 1, '2026-07-30', '2026-07-30 07:15:00', '2026-07-30 08:45:00', 'Roorkee Main Branch');

-- Workout Plans
INSERT IGNORE INTO workout_plans (id, member_id, trainer_id, title, goal, notes) VALUES 
(1, 1, 1, 'Hypertrophy & Strength Split', 'Muscle Gain', 'Focus on 8-12 rep range with progressive overload.');

-- Workout Exercises
INSERT IGNORE INTO workout_exercises (id, workout_plan_id, exercise_name, sets, reps, weight_kg, rest_seconds, day_name) VALUES 
(1, 1, 'Barbell Back Squats', 4, 8, 80.0, 90, 'Day 1 - Legs & Core'),
(2, 1, 'Bench Press', 4, 10, 70.0, 75, 'Day 2 - Chest & Triceps'),
(3, 1, 'Barbell Deadlifts', 3, 6, 100.0, 120, 'Day 3 - Back & Biceps');

-- Payments
INSERT IGNORE INTO payments (id, member_id, membership_id, amount_inr, payment_method, payment_status, transaction_id) VALUES 
(1, 1, 1, 6999.00, 'UPI', 'SUCCESSFUL', 'TXN-UPI-20260601-9988');

-- Invoices
INSERT IGNORE INTO invoices (id, payment_id, invoice_number, pdf_url) VALUES 
(1, 1, 'INV-2026-0001', '/invoices/INV-2026-0001.pdf');

-- Complaints
INSERT IGNORE INTO complaints (id, member_id, assigned_manager_id, subject, description, category, priority, status) VALUES 
(1, 1, 1, 'Treadmill #4 Display Flicker', 'The touch display on Treadmill #4 near the window flickers during high speed running.', 'Equipment', 'MEDIUM', 'IN_PROGRESS');

-- Complaint Messages
INSERT IGNORE INTO complaint_messages (id, complaint_id, sender_user_id, message) VALUES 
(1, 1, 4, 'Hi team, noticed the treadmill display flickering during my morning session.'),
(2, 1, 2, 'Thanks! We have notified the maintenance team. Technician visiting today at 2 PM.');

-- Announcements
INSERT IGNORE INTO announcements (id, title, content, target_role, created_by_user_id) VALUES 
(1, 'Independence Day Special Fitness Challenge!', 'Join our 15-day transformation challenge starting August 1st. Exciting prizes & vouchers for top achievers!', 'ALL', 1),
(2, 'Maintenance Notice - Steam Room', 'Steam room will be closed for routine deep cleaning on Sunday, August 3rd from 12 PM to 4 PM.', 'ALL', 2);

-- Notifications
INSERT IGNORE INTO notifications (id, user_id, title, message, type) VALUES 
(1, 4, 'Class Reminder', 'Your High-Intensity Power HIIT class is scheduled for Monday at 07:00 AM.', 'CLASS_REMINDER');

-- Gym Settings
INSERT IGNORE INTO gym_settings (id, gym_name, logo_url, address, phone, email, opening_hours, holidays, upi_id) VALUES 
(1, 'IRONFIT FITNESS CLUB', '/assets/logo.png', 'Civil Lines, Roorkee, Uttarakhand - 247667', '+91 98765 43210', 'support@ironfit.in', '5:00 AM - 10:00 PM (Mon-Sat), 6:00 AM - 1:00 PM (Sun)', 'Diwali, Holi, Independence Day', 'ironfit@upi');

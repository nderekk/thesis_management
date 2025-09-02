use diplomatiki_sys;


-- Insert users (professors)
INSERT INTO users (id, email, password, role) VALUES 
(1, 'dkollias@ceid.upatras.gr', 'hashed_password_1', 'professor'),
(2, 'mpapado@ceid.upatras.gr', 'hashed_password_2', 'professor'),
(3, 'inikolaou@ceid.upatras.gr', 'hashed_password_3', 'professor'),
(11, 'smasko@ceid.upatras.gr', 'hashed_password_11', 'professor'),
(12, 'pkats@ceid.upatras.gr', 'hashed_password_12', 'professor'),

-- Insert users (students)
(4, 'andpet@upatras.gr', 'hashed_password_4', 'student'),
(5, 'elmakri@upatras.gr', 'hashed_password_5', 'student'),
(6, 'nikchar@upatras.gr', 'hashed_password_6', 'student'),
(9, 'mpampis@upatras.gr', 'hashed_password_9', 'student'),
(10, 'klamprou@upatras.gr', 'hashed_password_10', 'student'),
	
-- Insert users (secretaries)
(7, 'gspanou@ceid.upatras.gr', 'hashed_password_7', 'secretary'),
(8, 'kvlachou@ceid.upatras.gr', 'hashed_password_8', 'secretary');

-- Insert professors
INSERT INTO professor (am, first_name, last_name, email, phone_number, field_of_expertise, prof_userid) VALUES 
(1, 'Dimitris', 'Kollias', 'dkollias@ceid.upatras.gr', '2610960001', 'Computer Architecture', 1),
(2, 'Maria', 'Papadopoulou', 'mpapado@ceid.upatras.gr', '2610960002', 'Machine Learning', 2),
(3, 'Ilias', 'Nikolaou', 'inikolaou@ceid.upatras.gr', '2610960003', 'Cybersecurity', 3),
(4, 'Spiros', 'Maskoulis', 'smasko@ceid.upatras.gr', '2650960001', 'Theoritical Computer Science', 11),
(5, 'Prodromos', 'Katsikis', 'pkats@ceid.upatras.gr', '2660960001', 'Artificial Intelligence', 12);

-- Insert students
INSERT INTO student (am, first_name, last_name, father_name, semester, email, phone_number, mobile_number, address, city, post_code, student_userid) VALUES 
(1, 'Andreas', 'Petrou', 'Giorgos', 8, 'andpet@upatras.gr', '2610991101', '6944111111', 'Οδός Παπαδιαμάντη 12', 'Patras', 26223, 4),
(2, 'Eleni', 'Makri', 'Nikos', 7, 'elmakri@upatras.gr', '2610991102', '6944222222', 'Οδός Καποδιστρίου 25', 'Patras', 26224, 5),
(4, 'Mpampis', 'Kuriakos', 'Nikos', 7, 'mpampis@upatras.gr', '2610991102', '6944222222', 'Οδός poutsas 25', 'Patras', 26224, 9),
(3, 'Nikos', 'Charalampous', 'Dimitris', 9, 'nikchar@upatras.gr', '2610991103', '6944333333', 'Οδός Ερμού 88', 'Patras', 26225, 6),
(5, 'Kostis', 'Lamprou', 'Iosif', 9, 'klamprou@upatras.gr', '2610992202', '6944222222', 'Οδός Ηρακλείτου 18', 'Patras', 26223, 10);

-- Insert secretaries
INSERT INTO secretary (am, first_name, last_name, phone_number, address, email, secretary_userid) VALUES 
(1, 'Georgia', 'Spanou', '2610960010', 'Λεωφ. Γούναρη 85', 'gspanou@ceid.upatras.gr', 7),
(2, 'Katerina', 'Vlachou', '2610960011', 'Οδός Αγ. Ανδρέα 30', 'kvlachou@ceid.upatras.gr', 8);

-- Insert thesis topics
INSERT INTO thesis_topics (id, prof_am, title, description, attached_discription_file, topic_status, student_am, createdAt, updatedAt) VALUES
(1, 1, 'RISC-V CPU', 'Designing a custom RISC-V CPU in Verilog', 'riscv_description.pdf', 'assigned', 1, "2025-01-15", "2025-01-15"),
(2, 2, 'AI Tutor', 'Creating an adaptive learning system using ML', 'ai_tutor_description.pdf', 'assigned', 2, "2025-01-15", "2025-01-15"),
(3, 3, 'Secure App', 'Developing a secure messaging app for Android', 'secure_app_description.pdf', 'temp_assigned', 3, "2025-01-15", "2025-01-15"),
(4, 1, 'FPGA Vision', 'Using FPGAs for real-time image processing', 'fpga_vision.pdf', 'unassigned', NULL, "2025-01-15", "2025-01-15"),
(5, 2, 'ML Compiler', 'AutoML for optimizing compiler pipelines', 'ml_compiler.pdf', 'unassigned', NULL, "2025-01-15", "2025-01-15"),
(25, 1, 'The Divine Feats of Chunkus Maximus', 'he fat asf fasdfasdf', '1753440448217-668114698.pdf', 'unassigned', NULL, '2025-07-25', '2025-07-25');

-- Insert thesis
INSERT INTO thesis (id, topic_id, student_am, supervisor_am, prof2_am, prof3_am, thesis_status, assignment_date, thesis_content_file, nemertes_link, ap_from_gs, completion_date) VALUES 
(1, 1, 1, 1, 2, 3, 'Completed', '2025-01-15', 'thesis1.pdf', 'https://nemertes.upatras.gr/thesis1', 1001, '2025-07-25'),
(2, 2, 2, 2, 1, 3, 'Active', '2025-01-20', 'thesis2.pdf', 'https://nemertes.upatras.gr/thesis2', 1002, NULL),
(3, 3, 3, 3, 1, 2, 'Pending', '2025-01-25', 'thesis3.pdf', 'https://nemertes.upatras.gr/thesis3', 1003, NULL);

-- Insert grade
INSERT INTO thesis_grade (id, thesis_id, final_grade) VALUES 
(1, 1, 8.5);

INSERT INTO thesis_presentation (thesis_id, date_time, presentation_type, venue) VALUES
('1', '2025-5-5', 'in-person', 'αίθουσα Γ');


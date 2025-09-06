use diplomatiki_sys;


-- Insert users (professors)
INSERT INTO users (email, password, role) VALUES 
('dkollias@ceid.upatras.gr', 'hashed_password_1', 'professor'),
('mpapado@ceid.upatras.gr', 'hashed_password_2', 'professor'),
('inikolaou@ceid.upatras.gr', 'hashed_password_3', 'professor'),
('smasko@ceid.upatras.gr', 'hashed_password_11', 'professor'),
('pkats@ceid.upatras.gr', 'hashed_password_12', 'professor'),

-- Insert users (students)
('andpet@upatras.gr', 'hashed_password_4', 'student'),
('elmakri@upatras.gr', 'hashed_password_5', 'student'),
('nikchar@upatras.gr', 'hashed_password_6', 'student'),
('mpampis@upatras.gr', 'hashed_password_9', 'student'),
('klamprou@upatras.gr', 'hashed_password_10', 'student'),
('giokay@upatras.gr', '123', 'student'),
('snik@upatras.gr', '123', 'student'),
('light@upatras.gr', '123', 'student'),
('ivan@upatras.gr', '123', 'student'),
('arab@upatras.gr', '123', 'student'),
	
-- Insert users (secretaries)
('gspanou@ceid.upatras.gr', 'hashed_password_7', 'secretary'),
('kvlachou@ceid.upatras.gr', 'hashed_password_8', 'secretary');

-- Insert professors
INSERT INTO professor (first_name, last_name, email, phone_number, field_of_expertise, prof_userid) VALUES 
('Dimitris', 'Kollias', 'dkollias@ceid.upatras.gr', '2610960001', 'Computer Architecture', 1),
('Maria', 'Papadopoulou', 'mpapado@ceid.upatras.gr', '2610960002', 'Machine Learning', 2),
('Ilias', 'Nikolaou', 'inikolaou@ceid.upatras.gr', '2610960003', 'Cybersecurity', 3),
('Spiros', 'Maskoulis', 'smasko@ceid.upatras.gr', '2650960001', 'Theoritical Computer Science', 4),
('Prodromos', 'Katsikis', 'pkats@ceid.upatras.gr', '2660960001', 'Artificial Intelligence', 5);

-- Insert students
INSERT INTO student (first_name, last_name, father_name, semester, email, phone_number, mobile_number, address, city, post_code, student_userid) VALUES 
('Andreas', 'Petrou', 'Giorgos', 8, 'andpet@upatras.gr', '2610991101', '6944111111', 'Οδός Παπαδιαμάντη 12', 'Patras', 26223, 6),
('Eleni', 'Makri', 'Nikos', 7, 'elmakri@upatras.gr', '2610991234', '6944222222', 'Οδός Καποδιστρίου 25', 'Patras', 26224, 7),
('Mpampis', 'Kuriakos', 'Nikos', 7, 'mpampis@upatras.gr', '2610994312', '6944222444', 'Οδός Βραχνονησίδας 21', 'Patras', 26224, 8),
('Nikos', 'Charalampous', 'Dimitris', 9, 'nikchar@upatras.gr', '2610995678', '6944333333', 'Οδός Ερμού 88', 'Patras', 26225, 9),
('Kostis', 'Lamprou', 'Iosif', 9, 'klamprou@upatras.gr', '2610990968', '6944222555', 'Οδός Ηρακλείτου 18', 'Patras', 26223, 10),
('Giorgos', 'Kay', 'Giorgos', 8, 'giokay@upatras.gr', '2610996425', '6944111666', 'Κανακαρη 12', 'Patras', 26223, 11),
('Sotiris', 'Snikopoulos', 'Nikos', 7, 'snik@upatras.gr', '2610991562', '6944222777', 'Βονίτσης 112', 'Αθηνα', 26224, 12),
('Giannis', 'Damianidis', 'Orsalios', 7, 'light@upatras.gr', '2610995666', '6944222888', 'Οδός Αμπελοκηπως 12', 'Patras', 26224, 13),
('Iraklis', 'Ivanidis', 'Dimitris', 9, 'ivan@upatras.gr', '2610991333', '69443333999', 'Οδός Ερμού 2', 'Patras', 26225, 14),
('Damianos', 'Arabopoulos', 'Spiros', 9, 'arab@upatras.gr', '2610992888', '6944233333', 'Οδός Μενιδιου 18', 'Athens', 26223, 15);

-- Insert secretaries
INSERT INTO secretary (first_name, last_name, phone_number, address, email, secretary_userid) VALUES 
('Georgia', 'Spanou', '2610960010', 'Λεωφ. Γούναρη 85', 'gspanou@ceid.upatras.gr', 16),
('Katerina', 'Vlachou', '2610960011', 'Οδός Αγ. Ανδρέα 30', 'kvlachou@ceid.upatras.gr', 17);

-- Insert thesis topics
INSERT INTO thesis_topics (prof_am, title, description, attached_discription_file, topic_status, student_am, createdAt, updatedAt) VALUES
(1, 'RISC-V CPU', 'Designing a custom RISC-V CPU in Verilog', 'riscv_description.pdf', 'assigned', 1, "2025-01-15", "2025-01-15"),
(2, 'AI Tutor', 'Creating an adaptive learning system using ML', 'ai_tutor_description.pdf', 'assigned', 2, "2025-01-15", "2025-01-15"),
(3, 'Secure App', 'Developing a secure messaging app for Android', 'secure_app_description.pdf', 'temp_assigned', 3, "2025-01-15", "2025-01-15"),
(1, 'FPGA Vision', 'Using FPGAs for real-time image processing', 'fpga_vision.pdf', 'unassigned', NULL, "2025-01-15", "2025-01-15"),
(2, 'ML Compiler', 'AutoML for optimizing compiler pipelines', 'ml_compiler.pdf', 'unassigned', NULL, "2025-01-15", "2025-01-15"),
(4, 'Cyber Security in Embedded Systems', 'lorem ipsum', '1753440448217-668114698.pdf', 'unassigned', NULL, '2025-07-25', '2025-07-25'),
(5, 'Optimization Algorithms', 'so they can be very very fast', 'ml_compiler.pdf', 'unassigned', NULL, "2025-01-15", "2025-01-15"),
(5, 'Computer Vision', 'make computers see', '1753440448217-668114698.pdf', 'unassigned', NULL, '2025-07-25', '2025-07-25');

-- Insert thesis
INSERT INTO thesis (topic_id, student_am, supervisor_am, prof2_am, prof3_am, thesis_status, assignment_date, thesis_content_file, nemertes_link, ap_from_gs, completion_date) VALUES 
(1, 1, 1, 2, 3, 'Completed', '2025-01-15', 'thesis1.pdf', 'https://nemertes.upatras.gr/thesis1', 1001, '2025-07-25'),
(2, 2, 2, 1, 3, 'Active', '2025-01-20', 'thesis2.pdf', 'https://nemertes.upatras.gr/thesis2', 1002, NULL),
(3, 3, 3, 1, 2, 'Pending', '2025-01-25', 'thesis3.pdf', 'https://nemertes.upatras.gr/thesis3', 1003, NULL);

-- Insert grade
INSERT INTO thesis_grade VALUES 
(null, 1, 9, 1, 10, 10, 10, 10, 2, 9, 9, 9, 9, 3, 8, 8, 8, 8);

INSERT INTO thesis_presentation (thesis_id, date_time, presentation_type, venue) VALUES
('1', '2025-5-5', 'in-person', 'αίθουσα Γ');

-- ==========================================
USE diplomatiki_sys;

-- Insert thesis topics for students 4,5,7,8,9
INSERT INTO thesis_topics (prof_am, title, description, attached_discription_file, topic_status, student_am, createdAt, updatedAt) VALUES
(1, 'Distributed Systems Optimization', 'Optimizing distributed consensus protocols', 'dist_sys.pdf', 'assigned', 4, "2025-02-01", "2025-02-01"),
(2, 'Deep Reinforcement Learning', 'Exploring reinforcement learning for robotics', 'drl.pdf', 'assigned', 5, "2025-02-01", "2025-02-01"),
(3, 'Blockchain Security', 'Analyzing vulnerabilities in blockchain protocols', 'blockchain_sec.pdf', 'assigned', 7, "2025-02-01", "2025-02-01"),
(4, 'Graph Algorithms in Big Data', 'Scalable graph processing techniques', 'graph_bigdata.pdf', 'assigned', 8, "2025-02-01", "2025-02-01"),
(5, 'Neural Machine Translation', 'Developing an NMT model for Greek-English translation', 'nmt.pdf', 'assigned', 9, "2025-02-01", "2025-02-01");

-- Insert theses for students 4,5,7,8,9
INSERT INTO thesis (topic_id, student_am, supervisor_am, prof2_am, prof3_am, thesis_status, assignment_date, thesis_content_file, nemertes_link, ap_from_gs, completion_date) VALUES 
-- Completed theses (~60%)
(11, 4, 1, 2, 3, 'Completed', '2025-02-10', 'thesis4.pdf', 'https://nemertes.upatras.gr/thesis4', 1004, '2025-07-10'),
(12, 5, 2, 1, 3, 'Completed', '2025-02-12', 'thesis5.pdf', 'https://nemertes.upatras.gr/thesis5', 1005, '2025-07-15'),
(13, 7, 3, 1, 2, 'Completed', '2025-02-15', 'thesis7.pdf', 'https://nemertes.upatras.gr/thesis7', 1007, '2025-07-20'),

-- Active thesis
(14, 8, 4, 2, 5, 'Active', '2025-02-20', 'thesis8.pdf', 'https://nemertes.upatras.gr/thesis8', 1008, NULL),

-- Canceled thesis
(15, 9, 5, 3, 4, 'Cancelled', '2025-02-25', 'thesis9.pdf', 'https://nemertes.upatras.gr/thesis9', 1009, NULL);

-- Insert grades only for Completed theses (4,5,7)
INSERT INTO thesis_grade VALUES
(NULL, 25, 8, 1, 9, 9, 9, 9, 2, 8, 8, 8, 8, 3, 9, 9, 9, 9),
(NULL, 26, 9, 1, 10, 10, 10, 9, 2, 9, 9, 9, 9, 3, 8, 8, 8, 8),
(NULL, 27, 7, 1, 7, 7, 7, 7, 2, 8, 8, 8, 8, 3, 7, 7, 7, 7);

-- Insert presentations (only for completed ones)
INSERT INTO thesis_presentation (thesis_id, date_time, presentation_type, venue) VALUES
(25, '2025-07-20 10:00:00', 'in-person', 'Αίθουσα 201'),
(26, '2025-07-22 11:00:00', 'online', 'https://zoom.us/j/123456789'),
(27, '2025-07-25 09:30:00', 'in-person', 'Αίθουσα 305');


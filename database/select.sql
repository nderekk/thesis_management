use diplomatiki_sys;

SHOW TRIGGERS FROM diplomatiki_sys;
-- select * from student;
-- select * from users;
-- update student set email = 'andpet@upatras.gr' where am= 1;
-- drop trigger thesisLogs;
select * from trimelis_requests;
select * from professor;
select * from users;
select * from thesis_topics;
select * from thesis_presentation;
select * from announcements;
select * from thesis_grade;
select * from thesis_logs;
select * from thesis;
select * from thesis_cancellation;

SELECT AVG(final_grade) FROM thesis_grade as grade INNER JOIN thesis 
	on thesis_id = thesis.id 
    AND (thesis.supervisor_am = 1);

	-- INSERT INTO professor (am, first_name, last_name, email, phone_number, field_of_expertise, prof_userid) VALUES 
-- (10, 'kapoios', 'kurios', 'outos@ceid.upatras.gr', '2610960001', 'full expert', 10);

-- SELECT AVG(final_grade) FROM thesis_grade as grade INNER JOIN thesis 
-- 	on thesis_id = thesis.id 
--     AND (thesis.supervisor_am = 1);

select * from thesis_logs;
select * from links;
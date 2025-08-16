use diplomatiki_sys;

DELIMITER $

CREATE TRIGGER email_update
AFTER UPDATE ON student
FOR EACH ROW
BEGIN
UPDATE users SET email = new.email WHERE id = new.student_userid;
END$

DELIMITER ;

 ----------------------------------------------------------------------- 

DELIMITER $

-- DROP TRIGGER update_committee$
CREATE TRIGGER update_committee
AFTER UPDATE ON trimelis_requests
FOR EACH ROW
BEGIN

DECLARE current_prof2_am VARCHAR(255);
DECLARE topic INT;
 
IF new.answer = "accepted" THEN 
	 
    SELECT prof2_am, topic_id INTO current_prof2_am, topic
    FROM thesis
    WHERE id = NEW.thesis_id;
    
	IF current_prof2_am IS NULL THEN 
		UPDATE thesis SET thesis.prof2_am = new.prof_am WHERE thesis.id = new.thesis_id;
	ELSE
		UPDATE thesis SET thesis.prof3_am = new.prof_am WHERE thesis.id = new.thesis_id;
        UPDATE thesis SET thesis.thesis_status = 'Active' WHERE thesis.id = new.thesis_id;
        UPDATE thesis_topics SET thesis_topics.topic_status = 'assigned' WHERE thesis_topics.id = topic;
	END IF;
END IF;
END$

DELIMITER ;

----------------------------------------------------------------------- 

DELIMITER $

CREATE TRIGGER mark_completion_date
BEFORE UPDATE ON thesis
FOR EACH ROW
BEGIN
	IF new.thesis_status = "Completed" THEN 
		SET new.completion_date = CURDATE();
	END IF;
END$

DELIMITER ;

----------------------------------------------------------------------- 

DELIMITER $

-- DROP TRIGGER delete_temp_thesis$
CREATE TRIGGER delete_temp_thesis
BEFORE UPDATE ON thesis_topics
FOR EACH ROW
BEGIN
	IF new.topic_status = "unassigned" THEN 
		DELETE FROM thesis WHERE new.id = thesis.topic_Id;
	END IF;
END$

DELIMITER ;

----------------------------------------------------------------------- 

DELIMITER $

-- DROP TRIGGER delete_temp_thesis$
CREATE TRIGGER create_pending_thesis
AFTER UPDATE ON thesis_topics
FOR EACH ROW
BEGIN
	IF new.topic_status = "temp_assigned" THEN 
		INSERT INTO thesis (topic_id, student_am, supervisor_am, prof2_am, prof3_am, thesis_status, assignment_date) VALUES 
		(new.id, new.student_am, new.prof_am, null, null, 'Pending', CURDATE());
	END IF;
END$

DELIMITER ;

----------------------------------------------------------------------- 

DELIMITER $

CREATE TRIGGER cancelThesis
AFTER INSERT ON thesis_cancellation
FOR EACH ROW
BEGIN
	UPDATE thesis SET thesis.thesis_status = 'Cancelled' WHERE thesis.id = new.thesis_id;
END$

DELIMITER ;

----------------------------------------------------------------------- 

DELIMITER $

CREATE TRIGGER createThesisGrade
AFTER UPDATE ON thesis
FOR EACH ROW
BEGIN
	IF old.enableGrading = 0 AND new.enableGrading = 1 THEN
		INSERT INTO thesis_grade(thesis_id, prof1am , prof2am , prof3am) VALUES (new.id, new.supervisor_am, new.prof2_am, new.prof3_am);
	END IF;
END$

DELIMITER ;

----------------------------------------------------------------------- 

DELIMITER $

CREATE TRIGGER enableAnnouncements
AFTER INSERT ON thesis_presentation
FOR EACH ROW
BEGIN
	UPDATE thesis SET enableAnnounce = 1 WHERE new.thesis_id = id;
END$

DELIMITER ;




SHOW TRIGGERS FROM diplomatiki_sys;
-- select * from student;
-- select * from users;
-- update student set email = 'andpet@upatras.gr' where am= 1;
-- drop trigger cancelThesis;
-- select * from trimelis_requests;
select * from student;
select * from users;
select * from thesis_topics;
select * from thesis;
select * from thesis_presentation;
select * from announcements;

SELECT AVG(final_grade) FROM thesis_grade as grade INNER JOIN thesis 
	on thesis_id = thesis.id 
    AND (thesis.supervisor_am = 1);

	-- INSERT INTO professor (am, first_name, last_name, email, phone_number, field_of_expertise, prof_userid) VALUES 
-- (10, 'kapoios', 'kurios', 'outos@ceid.upatras.gr', '2610960001', 'full expert', 10);

-- SELECT AVG(final_grade) FROM thesis_grade as grade INNER JOIN thesis 
-- 	on thesis_id = thesis.id 
--     AND (thesis.supervisor_am = 1);




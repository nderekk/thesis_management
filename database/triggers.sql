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

----------------------------------------------------------------------- 

DELIMITER $

CREATE TRIGGER thesisLogs
AFTER UPDATE ON thesis
FOR EACH ROW
BEGIN
	IF new.thesis_status = 'Active' AND old.thesis_status = 'Pending' THEN
		INSERT INTO thesis_logs VALUES (null, new.id, NOW(), old.thesis_status, new.thesis_status);
    ELSEIF new.thesis_status = 'Review' AND old.thesis_status = 'Active' THEN
		INSERT INTO thesis_logs VALUES (null, new.id, NOW(), old.thesis_status, new.thesis_status);
	ELSEIF new.thesis_status = 'Completed' AND old.thesis_status = 'Review' THEN
		INSERT INTO thesis_logs VALUES (null, new.id, NOW(), old.thesis_status, new.thesis_status);
	ELSEIF new.thesis_status = 'Cancelled' AND (old.thesis_status = 'Pending' OR old.thesis_status = 'Active') THEN
		INSERT INTO thesis_logs VALUES (null, new.id, NOW(), old.thesis_status, new.thesis_status);
	END IF;
END$

DELIMITER ;

----------------------------------------------------------------------- 

DELIMITER $

CREATE TRIGGER finalGrade
BEFORE UPDATE ON thesis_grade
FOR EACH ROW
BEGIN
	IF new.prof1_grade1 IS NOT NULL AND new.prof2_grade1 IS NOT NULL AND new.prof3_grade1 IS NOT NULL THEN
		SET new.final_grade = ((0.6*new.prof1_grade1 + 0.15*new.prof1_grade2 + 0.15*new.prof1_grade3 + 0.1*new.prof1_grade4) + 
        (0.6*new.prof2_grade1 + 0.15*new.prof2_grade2 + 0.15*new.prof2_grade3 + 0.1*new.prof2_grade4) + (0.6*new.prof3_grade1 + 0.15*new.prof3_grade2 + 0.15*new.prof3_grade3 + 0.1*new.prof3_grade4))/3;
	END IF;
END$

DELIMITER ;



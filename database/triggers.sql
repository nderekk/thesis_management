-- use diplomatiki_sys;

DELIMITER $

CREATE TRIGGER email_update
AFTER UPDATE ON student
FOR EACH ROW
BEGIN
UPDATE users SET email = new.email WHERE id = new.student_userid;
END$

DELIMITER ;
 -- -------------------------------------------------------------------- 

DELIMITER $

CREATE TRIGGER update_committee
AFTER UPDATE ON trimelis_requests
FOR EACH ROW
BEGIN

DECLARE current_prof2_am VARCHAR(255);
 
IF new.answer = "accepted" THEN 
	 
    SELECT prof2_am INTO current_prof2_am
    FROM thesis
    WHERE id = NEW.thesis_id;
    
	IF current_prof2_am IS NULL THEN 
		UPDATE thesis SET thesis.prof2_am = new.prof_am WHERE thesis.id = new.thesis_id;
	ELSE
		UPDATE thesis SET thesis.prof3_am = new.prof_am WHERE thesis.id = new.thesis_id;
        UPDATE thesis SET thesis.thesis_status = 'Review' WHERE thesis.id = new.thesis_id;
	END IF;
END IF;
END$

DELIMITER ;




--  SHOW TRIGGERS FROM diplomatiki_sys;
-- select * from student;
-- select * from users;
-- update student set email = 'andpet@upatras.gr' where am= 1;
-- drop trigger update_committee;
-- select * from trimelis_requests;
-- select * from thesis;





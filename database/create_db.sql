drop database if exists diplomatiki_sys;
create database diplomatiki_sys;
show tables;
use diplomatiki_sys;
describe student;
select * from users;

drop table if exists users;
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('professor', 'student', 'secretary') NOT NULL,
  PRIMARY KEY (id)
);

drop table if exists professor;
create table professor(
	am int not null auto_increment,
    first_name varchar(30) not null,
    last_name varchar(50) not null,
    email varchar(50) not null,
    phone_number varchar(50) not null,
    field_of_expertise varchar(150) not null,
    prof_userid integer not null,
    primary key(am)
);

drop table if exists student;
create table student(
	am int not null auto_increment,
    first_name varchar(30) not null,
    last_name varchar(50) not null,
    father_name varchar(50) not null,
    semester smallint not null,
    email varchar(50) not null,
	phone_number varchar(50) not null,
    mobile_number varchar(50) not null,
    address varchar(255) not null,
    city varchar(30) not null,
    post_code int not null,
	student_userid integer not null,
    primary key(am)
);

drop table if exists secretary;
create table secretary(
	am int not null auto_increment,
    first_name varchar(30) not null,
    last_name varchar(50) not null,
	phone_number varchar(50) not null,
    address varchar(255) not null,
    email varchar(50) not null,
	secretary_userid integer not null,
    primary key(am)
);

drop table if exists thesis_topics;
create table thesis_topics (
	id int not null auto_increment,
    prof_am int not null,
    title varchar(15) not null,
    description varchar(255) not null,
    attached_discription_file varchar(255),
    original_file_name varchar(255),
    topic_status enum ("assigned","temp_assigned","unassigned") not null,
    student_am int,
    primary key (id),
    foreign key (prof_am) references professor(am)
    on update cascade on delete cascade,
    foreign key (student_am) references student(am)
    on update cascade on delete cascade
);

drop table if exists thesis;
create table thesis(
	id int not null auto_increment,
    topic_id int not null,
    student_am int not null,
    supervisor_am int not null,
    prof2_am int,
    prof3_am int,
    thesis_status enum("Pending", "Active", "Completed", "Cancelled", "Review"),
    assignment_date date,
    completion_date date,
    thesis_content_file varchar(255),
    nemertes_link varchar(255),
    ap_from_gs int,
    enableGrading BOOLEAN DEFAULT FALSE,
    -- praktiko
    primary key(id),
    constraint topic_link foreign key (topic_id) references thesis_topics(id)
    on update cascade on delete cascade,
	constraint student_link foreign key (student_am) references student(am)
    on update cascade on delete cascade,
	constraint supervisor_link foreign key (supervisor_am) references professor(am)
    on update cascade on delete cascade,
    constraint prof2_link foreign key (prof2_am) references professor(am)
    on update cascade on delete cascade,
    constraint prof3_link foreign key (prof3_am) references professor(am)
    on update cascade on delete cascade
);

drop table if exists thesis_presentation;
create table thesis_presentation(
	id int not null auto_increment,
    thesis_id int not null, 
    date_time datetime , 
    presentation_type enum("In Person", "Online"),
    venue varchar(15),
    primary key (id),
    foreign key (thesis_id) references thesis(id)
    on update cascade on delete cascade
);

drop table if exists links;
create table links(
	id int not null auto_increment,
	thesis_id int not null,
    url varchar(255) not null,
    primary key (id),
    foreign key (thesis_id) references thesis(id)
    on update cascade on delete cascade
);

drop table if exists thesis_cancellation;
create table thesis_cancellation(
	id int not null auto_increment,
    thesis_id int not null,
    reason enum("By Professor", "By Secretary") not null,
    assembly_year int,
    assembly_number int,
    primary key (id),
    foreign key (thesis_id) references thesis(id)
    on update cascade on delete cascade
);

drop table if exists thesis_comments;
create table thesis_comments(
	id int not null auto_increment,
    prof_am int not null,
	thesis_id int not null,
    comments varchar(300) not null,
    comment_date date not null,
    primary key (id),
    foreign key (thesis_id) references thesis(id)
    on update cascade on delete cascade,
    foreign key (prof_am) references professor(am)
    on update cascade on delete cascade
);

drop table if exists thesis_logs;
CREATE TABLE thesis_logs (
    id INT NOT NULL AUTO_INCREMENT,
    thesis_id INT NOT NULL,
    timedate DATETIME NOT NULL,
    prev_status ENUM('Pending', 'Active', 'Completed', 'Cancelled') NOT NULL,
    new_status ENUM('Pending', 'Active', 'Completed', 'Cancelled') NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (thesis_id) REFERENCES thesis(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

drop table if exists thesis_grade;
CREATE TABLE thesis_grade (
    id INT NOT NULL AUTO_INCREMENT,
    thesis_id INT NOT NULL,
    final_grade DECIMAL(4,2),
    prof1_grade1 DECIMAL(4,2),
    prof1_grade2 DECIMAL(4,2),
    prof1_grade3 DECIMAL(4,2),
    prof1_grade4 DECIMAL(4,2),
    prof2_grade1 DECIMAL(4,2),
    prof2_grade2 DECIMAL(4,2),
    prof2_grade3 DECIMAL(4,2),
    prof2_grade4 DECIMAL(4,2),
    prof3_grade1 DECIMAL(4,2),
    prof3_grade2 DECIMAL(4,2),
    prof3_grade3 DECIMAL(4,2),
    prof3_grade4 DECIMAL(4,2),
    PRIMARY KEY (id),
    FOREIGN KEY (thesis_id) REFERENCES thesis(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

drop table if exists trimelis_requests;
CREATE TABLE trimelis_requests (
    id INT NOT NULL AUTO_INCREMENT,
    thesis_id INT NOT NULL,
    prof_am INT NOT NULL,
    answer ENUM('pending', 'accepted', 'declined') NOT NULL,
    invite_date DATE NOT NULL,
    answer_date DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (thesis_id) REFERENCES thesis(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (prof_am) REFERENCES professor(am)
    ON DELETE CASCADE ON UPDATE CASCADE
);

drop table if exists announcements;
CREATE TABLE announcements (
    id INT NOT NULL AUTO_INCREMENT,
    thesis_id INT NOT NULL,
    announcement_datetime DATETIME NOT NULL,
    announcement_content TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (thesis_id) REFERENCES thesis(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE blacklist (
  id INT NOT NULL AUTO_INCREMENT,
  token VARCHAR(512) NOT NULL,
  PRIMARY KEY (id),
  INDEX token_idx (token)
);

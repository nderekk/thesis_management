var DataTypes = require("sequelize").DataTypes;
var _announcements = require("./announcements");
var _links = require("./links");
var _professor = require("./professor");
var _secretary = require("./secretary");
var _student = require("./student");
var _thesis = require("./thesis");
var _thesis_cancellation = require("./thesis_cancellation");
var _thesis_comments = require("./thesis_comments");
var _thesis_grade = require("./thesis_grade");
var _thesis_logs = require("./thesis_logs");
var _thesis_presentation = require("./thesis_presentation");
var _thesis_topics = require("./thesis_topics");
var _trimelis_requests = require("./trimelis_requests");
var _user = require("./user");

function initModels(sequelize) {
  var announcements = _announcements(sequelize, DataTypes);
  var links = _links(sequelize, DataTypes);
  var professor = _professor(sequelize, DataTypes);
  var secretary = _secretary(sequelize, DataTypes);
  var student = _student(sequelize, DataTypes);
  var thesis = _thesis(sequelize, DataTypes);
  var thesis_cancellation = _thesis_cancellation(sequelize, DataTypes);
  var thesis_comments = _thesis_comments(sequelize, DataTypes);
  var thesis_grade = _thesis_grade(sequelize, DataTypes);
  var thesis_logs = _thesis_logs(sequelize, DataTypes);
  var thesis_presentation = _thesis_presentation(sequelize, DataTypes);
  var thesis_topics = _thesis_topics(sequelize, DataTypes);
  var trimelis_requests = _trimelis_requests(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  thesis.belongsTo(professor, { as: "prof2_am_professor", foreignKey: "prof2_am"});
  professor.hasMany(thesis, { as: "theses", foreignKey: "prof2_am"});
  thesis.belongsTo(professor, { as: "prof3_am_professor", foreignKey: "prof3_am"});
  professor.hasMany(thesis, { as: "prof3_am_theses", foreignKey: "prof3_am"});
  thesis.belongsTo(professor, { as: "supervisor_am_professor", foreignKey: "supervisor_am"});
  professor.hasMany(thesis, { as: "supervisor_am_theses", foreignKey: "supervisor_am"});
  thesis_topics.belongsTo(professor, { as: "prof_am_professor", foreignKey: "prof_am"});
  professor.hasMany(thesis_topics, { as: "thesis_topics", foreignKey: "prof_am"});
  trimelis_requests.belongsTo(professor, { as: "prof_am_professor", foreignKey: "prof_am"});
  professor.hasMany(trimelis_requests, { as: "trimelis_requests", foreignKey: "prof_am"});
  thesis.belongsTo(student, { as: "student_am_student", foreignKey: "student_am"});
  student.hasMany(thesis, { as: "theses", foreignKey: "student_am"});
  thesis_topics.belongsTo(student, { as: "student_am_student", foreignKey: "student_am"});
  student.hasMany(thesis_topics, { as: "thesis_topics", foreignKey: "student_am"});
  announcements.belongsTo(thesis, { as: "thesis", foreignKey: "thesis_id"});
  thesis.hasMany(announcements, { as: "announcements", foreignKey: "thesis_id"});
  links.belongsTo(thesis, { as: "thesis", foreignKey: "thesis_id"});
  thesis.hasMany(links, { as: "links", foreignKey: "thesis_id"});
  thesis_cancellation.belongsTo(thesis, { as: "thesis", foreignKey: "thesis_id"});
  thesis.hasMany(thesis_cancellation, { as: "thesis_cancellations", foreignKey: "thesis_id"});
  thesis_comments.belongsTo(thesis, { as: "thesis", foreignKey: "thesis_id"});
  thesis.hasMany(thesis_comments, { as: "thesis_comments", foreignKey: "thesis_id"});
  thesis_grade.belongsTo(thesis, { as: "thesis", foreignKey: "thesis_id"});
  thesis.hasMany(thesis_grade, { as: "thesis_grades", foreignKey: "thesis_id"});
  thesis_logs.belongsTo(thesis, { as: "thesis", foreignKey: "thesis_id"});
  thesis.hasMany(thesis_logs, { as: "thesis_logs", foreignKey: "thesis_id"});
  thesis_presentation.belongsTo(thesis, { as: "thesis", foreignKey: "thesis_id"});
  thesis.hasMany(thesis_presentation, { as: "thesis_presentations", foreignKey: "thesis_id"});
  trimelis_requests.belongsTo(thesis, { as: "thesis", foreignKey: "thesis_id"});
  thesis.hasMany(trimelis_requests, { as: "trimelis_requests", foreignKey: "thesis_id"});
  thesis.belongsTo(thesis_topics, { as: "topic", foreignKey: "topic_id"});
  thesis_topics.hasMany(thesis, { as: "theses", foreignKey: "topic_id"});

  return {
    announcements,
    links,
    professor,
    secretary,
    student,
    thesis,
    thesis_cancellation,
    thesis_comments,
    thesis_grade,
    thesis_logs,
    thesis_presentation,
    thesis_topics,
    trimelis_requests,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

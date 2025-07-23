const asyncHandler = require("express-async-handler");
const {sequelize, professor, thesis_topics} = require("../config/dbConnection");

//@desc Get current professor
//@route Get /api/professor
//@access Private
const getProfessorInfo = asyncHandler(async (req, res) => {
  if ( req.user.role !== "professor") {
    return res.status(401).json({ error: "Error - Not Authorized" });
  }
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  res.status(200).json(loggedProfessor);
});

//@desc Get professor's topics
//@route Get /api/professor/topics
//@access Private
const getTopics = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const professorThesisTopics = await thesis_topics.findAll({where: {prof_am: loggedProfessor.am} })
  res.status(200).json({
    data: professorThesisTopics.map(topic => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      status: topic.topic_status,
      createdDate: topic.createdAt.toISOString().split("T")[0]
    })),
  });
});

//@desc create professor topic
//@route Post /api/professor/topic
//@access Private
const createTopic = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const filePath = `/uploads/${req.file.filename}`;

  const topic = await thesis_topics.create({
    title: req.body.title, 
    description: req.body.description,
    attached_discription_file: filePath,
    prof_am: loggedProfessor.am,
    topic_status: "unassigned"
  });
  res.status(200).json(topic);
});

//@desc edit professor topic
//@route PUT /api/professor/topic
//@access Private
const editTopic = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const targetTopic = await thesis_topics.findOne({where: {prof_am: loggedProfessor.am, id:req.body.id} });
  const filePath = `/uploads/${req.file.filename}`;

  if (!targetTopic) {
    res.status(404)
    throw new Error("Topic not Found");
  }
  else {
    const {
      title,
      description,
      topic_status
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (topic_status !== undefined) updateData.topic_status = topic_status;

    if (Object.keys(updateData).length === 0) {
        res.status(400);
        throw new Error('No fields provided for update');
    }  

    await targetTopic.update({
      title: title,
      description: description,
      attached_discription_file: filePath,
      prof_am: loggedProfessor.am,
      topic_status: topic_status
    });

    res.status(200).json(targetTopic);
  }
});

//@desc delete professor topic
//@route DELETE /api/professor/topic
//@access Private
const deleteTopic = asyncHandler(async (req, res) => {
  const loggedProfessor = await professor.findOne({ where: {prof_userid: req.user.id} });
  const targetTopic = await thesis_topics.findOne({where: {prof_am: loggedProfessor.am, id:req.body.id} })

  await targetTopic.destroy();
  res.status(200).json(`Topic ${req.body.id} deleted`);
});

module.exports = {getProfessorInfo, getTopics, createTopic, editTopic, deleteTopic};
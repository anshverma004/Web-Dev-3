const express = require("express");
const router = express.Router();
let students = require("../data/students");

router.get("/", (req, res) => {
  res.status(200).json(students);
});

router.get("/:id", (req, res) => {
  let id = Number(req.params.id);
  let student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(student);
});

router.post("/", (req, res) => {
  let name = req.body.name;
  let course = req.body.course;

  if (!name || !course) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let newStudent = {
    id: students.length + 1,
    name: name,
    course: course,
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

router.put("/:id", (req, res) => {
  let id = Number(req.params.id);
  let student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  if (req.body.name) {
    student.name = req.body.name;
  }
  if (req.body.course) {
    student.course = req.body.course;
  }

  res.status(200).json(student);
});

router.delete("/:id", (req, res) => {
  let id = Number(req.params.id);
  let index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  let deleted = students.splice(index, 1);
  res.status(200).json({ message: "Student deleted successfully" });
});

module.exports = router;

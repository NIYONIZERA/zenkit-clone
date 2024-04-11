import TaskModel from "../models/task.model.js";
import moment from "moment"
export const test = (req, res, next) => {
  res.send("Hello World!");
};
// set time and date
export const setTime = async (req, res, next) => {
  var startDate=new Date(req.body.startDate).toLocaleDateString();
  var endDate=new Date(req.body.endDate).toLocaleDateString();
  var startTime = new Date(req.body.startDate).toLocaleTimeString();
  var endTime =new Date(req.body.endDate).toLocaleTimeString() ;
  if (req.body.startDate) {
    req.body.startTime = startTime;
    req.body.startDate = startDate;
  }
  if (req.body.endDate) {
    req.body.endTime = endTime;
    req.body.endDate = endDate;
  };
  // Calculate duration and duration type based on start date, end date, start time, and end time
  var startDate = moment(req.body.startDate)
  var endDate = moment(req.body.endDate)
  const differenceInMilliseconds = endDate.diff(startDate);
  var differenceInSeconds =Math.round(differenceInMilliseconds / 1000);
  var minutes = Math.round(differenceInSeconds / 60);
  var hours = Math.round(minutes / 60);
  var days = Math.round(hours / 24);
  var weeks=Math.round(days/7);
  var months=Math.round(weeks/12);
  var years=Math.round(months)
  if (differenceInSeconds < 60) {
      req.body.duration = differenceInSeconds
      req.body.durationType = "seconds"
  }
  else if (differenceInSeconds >= 60 && differenceInSeconds < 3600) {
      req.body.duration = minutes
      req.body.durationType = "Minutes"
  }
  else if (differenceInSeconds >= 3600 && differenceInSeconds < 86400) {
      req.body.duration = hours
      req.body.durationType = "Hours"
  }
  else if(differenceInSeconds >= 86400) {
      req.body.duration = days
      req.body.durationType = "Days"
  }

  next()
  };

 


export const addTask = async (req, res, next) => {
  try {
    const newTask = await TaskModel.create(req.body);
    return res.status(201).json(newTask);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message.split(":")[2].trim() });
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await TaskModel.find({});
    if (tasks) {
      return res.status(200).json(tasks);
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req, res, next) => {
  const taskId = req.query.id;
  const updates = req.body;

  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updates, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const findById = async (req, res, next) => {
  const taskId = req.query.id;

  try {
    const foundTask = await TaskModel.findById(taskId);
    if (!foundTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json(foundTask);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await TaskModel.findByIdAndDelete(req.query.id);
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

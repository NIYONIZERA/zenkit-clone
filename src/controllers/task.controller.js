import TaskModel from "../models/task.model.js";

export const test = (req, res, next) => {
  res.send("Hello World!");
};
export const setTime = async (req, res, next) => {
  console.log(req.body.dueDate);
  var startTime = "";
  var endTime = "";
  if (req.body.dueDate.startDate) {
    startTime = new Date(req.body.dueDate.startDate).toLocaleTimeString();
  }
  if (req.body.dueDate.endDate) {
    endTime = new Date(req.body.dueDate.endDate).toLocaleTimeString();
  }
  req.body.dueDate.startTime = startTime;
  req.body.dueDate.endTime = endTime;

  console.log(req.body.dueDate);
  // Your task.
  // Calculate the duration of the task by using the startDate and endDate.
  // Determine wether the duration is in min, hours, days.
  const parseTime = (timeString) => {
    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    return { hours, minutes };
  };
  // Calculate duration and duration type based on start date, end date, start time, and end time
  console.log("Calculating duration...");
  if (taskData.dueDate.startDate && taskData.dueDate.endDate && taskData.dueDate.startTime && taskData.dueDate.endTime) {
    const startDate = new Date(taskData.dueDate.startDate);
    const endDate = new Date(taskData.dueDate.endDate);
    const startTime = parseTime(taskData.dueDate.startTime);
    const endTime = parseTime(taskData.dueDate.endTime);
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.hours, startTime.minutes);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.hours, endTime.minutes);
    const durationMs = endDateTime - startDateTime;
    // Convert duration to hours
    const durationHours = durationMs / (1000 * 60 * 60);
    // Determine duration type based on duration
    let durationType;
    if (durationHours < 1) {
      durationType = "Minutes";
      taskData.dueDate.duration = durationMs / (1000 * 60); // Duration in minutes
    } else if (durationHours >= 1 && durationHours < 24) {
      durationType = "Hours";
      taskData.dueDate.duration = durationHours; // Duration in hours
    } else if (durationHours >= 24 && durationHours < (24 * 7)) {
      durationType = "Days";
      taskData.dueDate.duration = durationHours / 24; // Duration in days
    } else if (durationHours >= (24 * 7) && durationHours < (24 * 30)) {
      durationType = "Weeks";
      taskData.dueDate.duration = durationHours / (24 * 7); // Duration in weeks
    } else {
      durationType = "Months";
      taskData.dueDate.duration = durationHours / (24 * 30); // Duration in months
    }
    taskData.dueDate.durationType = durationType;
  }
  next();
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

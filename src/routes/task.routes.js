import express from 'express';
const taskRouter = express.Router();
import { test,setTime, addTask, deleteTask, getTasks, findById, updateTask } from '../controllers/task.controller.js';

taskRouter.get('/test', test);
taskRouter.post('/add', addTask);
taskRouter.get('/list', getTasks);
taskRouter.put('/update', updateTask);
taskRouter.get('/findById', findById);
taskRouter.delete('/delete', deleteTask);
taskRouter.get('/setTime', setTime);
export default taskRouter;
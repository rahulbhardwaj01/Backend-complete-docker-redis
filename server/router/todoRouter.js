import express from 'express';
import { deleteTodo, getTodos, todo, updateTodo } from "../controller/todoController.js";
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/create").post(isAuthenticated, todo);
router.route("/todos").get(getTodos);
router.route("/update").put(isAuthenticated, updateTodo);
router.route("/delete").delete(isAuthenticated, deleteTodo);


export default router;
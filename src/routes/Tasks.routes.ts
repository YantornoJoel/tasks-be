import express from "express";
import {
  create,
  deleteTask,
  getAll,
  order,
  searchByName,
  searchByState,
  searchTask,
  updateTask,
} from "../controllers";

const router = express.Router();

router.get("/", getAll);
router.get("/search", searchTask);
router.get("/name", searchByName);
router.get("/state", searchByState);
router.get("/order", order);

router.post("/new", create);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;

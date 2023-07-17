import { Request, Response } from "express";
import TaskModel, { ITask } from "../models/task";
import { SortOrder } from "mongoose";

export const create = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      state,
    }: { name: string; description: string; state: string } = req.body;

    if (name.length < 3 || description.length < 3) {
      return res.status(400).json({
        ok: false,
        message:
          "El nombre y la descripción de la tarea deben tener al menos 3 caracteres.",
      });
    }

    if (!["Por hacer", "En progreso", "Hecho"].includes(state)) {
      return res.status(400).json({
        ok: false,
        message:
          "El estado de la tarea solo debe ser: Por hacer, En progreso o Hecho.",
      });
    }

    await TaskModel.create(req.body);
    res.status(200).json({ ok: true, message: "Tarea creada correctamente" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ ok: false, message: "Ocurrió un error al guardar la tarea." });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const data: ITask[] = await TaskModel.find();
    return res.status(200).json({ ok: true, data: data });
  } catch (error) {
    console.log("Error :", error);
    return res
      .status(500)
      .json({ ok: false, message: "Error al traer el listado de tareas" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId: string = req.params.id;
    const { state }: { state: string } = req.body;

    if (!["Por hacer", "En progreso", "Hecho"].includes(state)) {
      return res.status(400).json({
        ok: false,
        message:
          "El estado de la tarea solo debe ser: Por hacer, En progreso o Hecho.",
        state: `El estado es: ${state}`,
      });
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { state },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ ok: false, message: "No se encontró la tarea." });
    }

    return res
      .status(200)
      .json({ ok: true, message: "Tarea actualizada correctamente" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      ok: false,
      message: "Ocurrió un error al actualizar el estado de la tarea.",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId: string = req.params.id;

    const deletedTask: ITask | null = await TaskModel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ ok: false, message: "No se encontró la tarea." });
    }

    return res
      .status(200)
      .json({ ok: true, message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      ok: false,
      message: "Ocurrió un error al eliminar la tarea.",
    });
  }
};

export const searchByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (typeof name !== "string") {
      return res.status(400).json({
        ok: false,
        message:
          "El parámetro 'name' es requerido y debe ser una cadena de texto.",
      });
    }

    const tasks: ITask[] = await TaskModel.find({
      name: { $regex: name, $options: "i" },
    });

    if (tasks.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No se encontraron tareas con ese nombre.",
      });
    }

    return res.status(200).json({ ok: true, data: tasks });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      ok: false,
      message: "Ocurrió un error al buscar las tareas por nombre.",
    });
  }
};

export const searchByState = async (req: Request, res: Response) => {
  try {
    const { state } = req.query;

    if (!state || typeof state !== "string") {
      return res.status(400).json({
        ok: false,
        message:
          "El parámetro 'state' es requerido y debe ser una cadena de texto.",
      });
    }

    if (!["Por hacer", "En progreso", "Hecho"].includes(state)) {
      return res.status(400).json({
        ok: false,
        message:
          "El estado de la tarea solo debe ser: Por hacer, En progreso o Hecho.",
      });
    }

    const tasks = await TaskModel.find({ state });

    if (tasks.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No se encontraron tareas con ese estado.",
      });
    }

    return res.status(200).json({ ok: true, data: tasks });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      ok: false,
      message: "Ocurrió un error al buscar las tareas por estado.",
    });
  }
};

export const searchTask = async (req: Request, res: Response) => {
  try {
    const { param } = req.query;

    if (typeof param !== "string") {
      return res.status(400).json({
        ok: false,
        message:
          "El parámetro 'param' es requerido y debe ser una cadena de texto.",
      });
    }

    if (["Por hacer", "En progreso", "Hecho"].includes(param)) {
      const tasks = await TaskModel.find({ state: param });
      return res.status(200).json({ ok: true, data: tasks });
    }

    const tasks: ITask[] = await TaskModel.find({
      name: { $regex: param, $options: "i" },
    });

    if (tasks.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No se encontraron tareas.",
      });
    }

    return res.status(200).json({ ok: true, data: tasks });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      ok: false,
      message: "Ocurrió un error al buscar las tareas.",
    });
  }
};

export const order = async (req: Request, res: Response) => {
  try {
    const { order, option } = req.query;
    let sortOrder: SortOrder;

    if (order && typeof order === "string" && order.toLowerCase() === "desc") {
      sortOrder = -1;
    } else {
      sortOrder = 1;
    }

    if (option !== "createdAt" && option !== "name") {
      return res.status(400).json({
        ok: false,
        message: "La propiedad option debe ser name o createdAt.",
      });
    }

    const tasks = await TaskModel.find().sort({ [option]: sortOrder });
    return res.status(200).json({ ok: true, data: tasks });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      ok: false,
      message: "Ocurrió un error al obtener las tareas ordenadas por nombre.",
    });
  }
};

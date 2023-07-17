import mongoose, { Schema } from "mongoose";

export interface ITask {
  name: string;
  description: string;
  state: "Por hacer" | "En progreso" | "Hecho";
  createdAt: Date;
}

const TaskSchema: Schema<ITask> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  state: {
    type: String,
    enum: ["Por hacer", "En progreso", "Hecho"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Opción para ocultar '__v' y 'id'
TaskSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret.id;
    delete ret.__v;
  }
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;

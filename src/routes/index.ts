import express from "express"
import tasksRoutes from './Tasks.routes'

const router = express.Router()

router.use("/task", tasksRoutes)

export default router

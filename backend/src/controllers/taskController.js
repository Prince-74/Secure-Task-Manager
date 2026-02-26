import { Task } from "../models/Task.js";
import { encryptText, decryptText } from "../utils/encryption.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const encryptedDescription = encryptText(description);

    const task = await Task.create({
      title,
      description: encryptedDescription,
      status: status || "Pending",
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: {
        id: task._id,
        title: task.title,
        description: decryptText(task.description),
        status: task.status,
        createdAt: task.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const { status, search } = req.query;

    const filter = { userId: req.user.id };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter),
    ]);

    const decryptedTasks = tasks.map((task) => ({
      id: task._id,
      title: task.title,
      description: decryptText(task.description),
      status: task.status,
      createdAt: task.createdAt,
    }));

    return res.status(200).json({
      success: true,
      tasks: decryptedTasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task: {
        id: task._id,
        title: task.title,
        description: decryptText(task.description),
        status: task.status,
        createdAt: task.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOne({ _id: id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (title !== undefined) {
      task.title = title;
    }
    if (description !== undefined) {
      task.description = encryptText(description);
    }
    if (status !== undefined) {
      task.status = status;
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: {
        id: task._id,
        title: task.title,
        description: decryptText(task.description),
        status: task.status,
        createdAt: task.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


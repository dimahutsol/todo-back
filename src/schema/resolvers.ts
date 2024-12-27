import { v4 as uuidv4 } from 'uuid';

import { tasks } from '../db/tasks';
import { Task } from '../models/Task';
import { validateTaskInput } from '../utils/validation';

type TaskInput = {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate: string;
};

export const resolvers = {
  Query: {
    tasks: (
      _: any,
      args: {
        completed?: boolean;
        startDate?: string;
        endDate?: string;
        limit?: number;
        skip?: number;
      }
    ) => {
      let filteredTasks = tasks;

      // Filter by completed
      if (args.completed !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.completed === args.completed);
      }

      // Filter by date
      if (args.startDate || args.endDate) {
        filteredTasks = filteredTasks.filter(task => {
          const isAfterStartDate = args.startDate ? task.dueDate >= args.startDate : true;
          const isBeforeEndDate = args.endDate ? task.dueDate <= args.endDate : true;
          return isAfterStartDate && isBeforeEndDate;
        });
      }

      // Pagination
      const startIndex = args.skip && args.skip > 0 ? args.skip : 0;
      const endIndex = args.limit ? startIndex + args.limit : filteredTasks.length;

      filteredTasks = filteredTasks.slice(startIndex, endIndex);

      return filteredTasks;
    },

    task: (_: any, { id }: { id: string }) => {
      const task = tasks.find(task => task.id === id);
      if (!task) throw new Error(`Task with id: ${id} not found`);
      return task;
    },
  },

  Mutation: {
    createTask: (_: any, { input }: { input: TaskInput }) => {
      validateTaskInput(input);

      const newTask: Task = {
        id: uuidv4(),
        title: input.title,
        description: input.description,
        completed: input.completed ?? false,
        dueDate: input.dueDate,
      };

      tasks.push(newTask);
      return newTask;
    },

    updateTask: (_: any, { id, input }: { id: string; input: TaskInput }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) throw new Error('Task not found');

      const updatedTask = {
        ...tasks[taskIndex],
        ...input,
      };

      tasks[taskIndex] = updatedTask;
      return updatedTask;
    },

    deleteTask: (_: any, { id }: { id: string }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) throw new Error(`Task with id: ${id} not found`);

      const deletedTask = tasks.splice(taskIndex, 1);
      return deletedTask[0];
    },
  },
};

import { resolvers } from '../schema/resolvers';
import { tasks } from '../db/tasks';

test('createTask should add a new task', () => {
  const input = {
    title: 'Test Task',
    dueDate: '2024-12-31',
  };

  const result = resolvers.Mutation.createTask(null, { input });

  expect(result).toHaveProperty('id');
  expect(result.title).toBe('Test Task');
  expect(result.dueDate).toBe('2024-12-31');
  expect(tasks.length).toBe(1);
});

test('updateTask should update the task', () => {
  const input = { title: 'Updated Task', dueDate: '2024-12-31' };
  const newTask = resolvers.Mutation.createTask(null, { input });

  const updatedTask = resolvers.Mutation.updateTask(null, {
    id: newTask.id,
    input: { title: 'Updated Again', dueDate: '2024-12-31' },
  });

  expect(updatedTask.title).toBe('Updated Again');
  expect(updatedTask.dueDate).toBe('2024-12-31');
});

test('deleteTask should remove a task', () => {
  const input = { title: 'Task to Delete', dueDate: '2024-12-31' };
  const newTask = resolvers.Mutation.createTask(null, { input });
  const deletedTask = resolvers.Mutation.deleteTask(null, { id: newTask.id });

  expect(deletedTask).toHaveProperty('id');
  expect(tasks.length).toBe(0);
});

test('tasks query should return tasks with pagination', () => {
  const input1 = { title: 'Task 1', dueDate: '2024-12-31' };
  const input2 = { title: 'Task 2', dueDate: '2024-12-31' };
  resolvers.Mutation.createTask(null, { input: input1 });
  resolvers.Mutation.createTask(null, { input: input2 });

  const result = resolvers.Query.tasks(null, { limit: 1, skip: 0 });

  expect(result.length).toBe(1);
  expect(result[0].title).toBe('Task 1');
});

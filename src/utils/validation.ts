export const validateTaskInput = (input: {
  title: string;
  description?: string;
  dueDate: string;
}) => {
  if (!input.title || input.title.length === 0) {
    throw new Error('Title is required');
  }

  if (input.title.length > 100) {
    throw new Error('Title is too long. Max length is 100');
  }

  if (input.description && input.description.length > 500) {
    throw new Error('Description is too long. Max length is 500');
  }

  if (isNaN(Date.parse(input.dueDate))) {
    throw new Error('Invalid dueDate format. Use ISO format');
  }

  const dueDate = new Date(input.dueDate);
  const currentDate = new Date();

  if (dueDate < currentDate) {
    throw new Error('Due date cannot be in the past');
  }
};

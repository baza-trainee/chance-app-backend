export type QueueTask = {
  task_id: string;
  task_type: 'pill' | 'task';
  user_id: string;
  message: string;
};

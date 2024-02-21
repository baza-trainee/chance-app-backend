export const FirebaseMessageEnum = {
  TASK_INCOMING: 'task',
  PILL_REMINDER_INCOMING: 'pill',
} as const;

export type FirebaseMessageEnumType =
  (typeof FirebaseMessageEnum)[keyof typeof FirebaseMessageEnum];

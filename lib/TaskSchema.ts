import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().nonempty(),
  title: z.string(),
  date: z.string(),
  description: z.string(),
  location: z.string(),
  status: z.union([
    z.literal("In Progress"),
    z.literal("Completed"),
    z.literal("Cancelled"),
  ]),
});

export type TaskInputType = z.input<typeof TaskSchema>;
export type TaskOutputType = z.output<typeof TaskSchema>;

import { create } from "zustand";
import { TaskInputType, TaskOutputType } from "@/lib/TaskSchema";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  task: null,
  /* The `addTasks` function in the `useTaskStore` zustand store is responsible for adding a new task
  to the list of tasks. Here's a breakdown of what it does: */
  addTasks: (task) =>
    set((state) => {
      const newTasks = [
        ...state.tasks,
        {
          id: uuid.v4() as string,
          title: task.title,
          description: task.description,
          location: task.location,
          status: task.status,
          date: new Date().toISOString(),
        },
      ];
      AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
      return { tasks: newTasks };
    }),
  /* The `loadTasks` function in the `useTaskStore` zustand store is responsible for loading tasks from
  AsyncStorage. Here's a breakdown of what it does: */
  loadTasks: async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        const parsedTasks: TaskInputType[] = JSON.parse(storedTasks);
        set({ tasks: parsedTasks });
      }
    } catch (error) {
      console.error("Error lead Tasks", error);
    }
  },
  /* The `deleteTask` function in the `useTaskStore` zustand store is responsible for deleting a task
  with a specific `id`. Here's a breakdown of what it does: */
  deleteTask: (id) =>
    set((state) => {
      try {
        const deleteTask = state.tasks.filter((task) => task.id !== id);
        AsyncStorage.setItem("tasks", JSON.stringify(deleteTask));
        return { tasks: deleteTask };
      } catch (e) {
        console.log("Error deleting task:", e);
        return state;
      }
    }),
  /* The `updateTask` function in the `useTaskStore` zustand store is responsible for updating a
  specific task based on the provided `id`, `field`, and `value`. Here's a breakdown of what it
  does: */
  updateTask: (id, field, value) =>
    set((state) => {
      try {
        const taskToUpdate = state.tasks.find((task) => task.id === id);
        debugger;
        if (taskToUpdate) {
          const updatedTasks = state.tasks.map((task) =>
            task.id === id ? { ...task, [field]: value } : task
          );
          AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
          return { tasks: updatedTasks };
        }
        return state;
      } catch (e) {
        console.log("Error updating task:", e);
        return state;
      }
    }),
  /* The `editTask` function in the `useTaskStore` zustand store is responsible for retrieving a
  specific task based on the provided `id`. */
  editTask: (id) =>
    set((state) => {
      const taskToUpdate = state.tasks.find((task) => task.id === id);

      return { task: taskToUpdate || null };
    }),
  /* The `sortTasks` function in the `useTaskStore` zustand store is responsible for sorting the tasks
  based on the specified order. It takes an `order` parameter which can be either "date" or
  "status". */
  sortTasks: (order) =>
    set((state) => {
      const sortedTasks = [...state.tasks];
      const compareFunctions = {
        date: (a: TaskOutputType, b: TaskOutputType) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
        status: (a: TaskOutputType, b: TaskOutputType) =>
          a.status.localeCompare(b.status),
      };

      if (compareFunctions[order]) {
        sortedTasks.sort(compareFunctions[order]);
      }

      return { tasks: sortedTasks };
    }),
}));

export default useTaskStore;

//Type

type TaskStore = {
  tasks: TaskOutputType[];
  task: TaskOutputType | null;
  addTasks: (task: Omit<TaskInputType, "id" | "date">) => void;
  loadTasks: () => Promise<void>;
  deleteTask: (id: string) => void;
  updateTask: (id: string, field: string, value: string) => void;
  editTask: (id: string) => void;
  sortTasks: (order: "date" | "status") => void;
};

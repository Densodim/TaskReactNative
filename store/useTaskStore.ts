import { create } from "zustand";
import {
  TaskInputType,
  TaskOutputType,
  TaskSchema,
} from "@/hooks/useFetchStoredTask";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  task: null,
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
  editTask: (id) =>
    set((state) => {
      const taskToUpdate = state.tasks.find((task) => task.id === id);

      return { task: taskToUpdate || null };
    }),
}));

export default useTaskStore;

//Type

type TaskStore = {
  tasks: TaskInputType[];
  task: TaskInputType | null;
  addTasks: (task: Omit<TaskInputType, "id" | "date">) => void;
  loadTasks: () => Promise<void>;
  deleteTask: (id: string) => void;
  updateTask: (id: string, field: string, value: string) => void;
  editTask: (id: string) => void;
};

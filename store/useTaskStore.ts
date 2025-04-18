import { create } from "zustand";
import { TaskInputType, TaskSchema } from "@/hooks/useFetchStoredTask";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTasks: (task) =>
    set((state) => {
      const updateTasks = [
        ...state.tasks,
        {
          id: uuid.v4() as string,
          title: task.title,
          description: task.description,
          location: task.location,
          status: task.status,
          date: new Date(),
        },
      ];
      AsyncStorage.setItem("tasks", JSON.stringify(updateTasks));
      return { tasks: updateTasks };
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
        const updatedTask = state.tasks.filter((task) => task.id !== id);
        AsyncStorage.setItem("tasks", JSON.stringify(updatedTask));
        return { tasks: updatedTask };
      } catch (e) {
        console.log("Error deleting task:", e);
        return state;
      }
    }),
}));

export default useTaskStore;

//Type

type TaskStore = {
  tasks: TaskInputType[];
  addTasks: (task: Omit<TaskInputType, "id" | "date">) => void;
  loadTasks: () => Promise<void>;
  deleteTask: (id: string) => void;
};

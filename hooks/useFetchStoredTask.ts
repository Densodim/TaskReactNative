import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "@/app/tasks";

export function useFetchStoredTask(taskId?: string | null) {
    const [taskView, setTaskView] = useState<Task[]>([]);
    const [editedTask, setEditedTask] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStoredTask = async () => {
            try {
                const storedTask = await AsyncStorage.getItem("tasks");
                if (storedTask != null) {
                    const taskParse = JSON.parse(storedTask);
                    const task = taskParse.find((task: { id: string }) => task.id === taskId);
                    if (task) {
                        setTaskView([task]);
                        setEditedTask(task);
                    }
                } else {
                    setTaskView([]);
                }
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
                setError("Failed to fetch task");
            }
        };

        fetchStoredTask();
    }, [taskId]);

    return { taskView, editedTask, setTaskView, setEditedTask, error };
}

import {Animated, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateTask, {Status} from "@/components/create";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import ScrollView = Animated.ScrollView;
import ViewTask from "@/components/ViewTask";


export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<"date" | "status">("date");
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    useEffect(() => {
        const fetchStoredTask = async () => {
            try {
                const storedTask = await AsyncStorage.getItem('tasks')
                if (storedTask != null) {
                    setTasks(JSON.parse(storedTask));
                } else {
                    setTasks([]);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchStoredTask()
    }, []);


    const updateTasks = async () => {
        const storedTasks = await AsyncStorage.getItem('tasks');
        setTasks(storedTasks ? JSON.parse(storedTasks) : []);
    };
    const onExpanded = () => {
        setExpanded(prevState => !prevState);
    }

    const sortTasks = (tasks: Task[], order: "date" | "status"): Task[] => {
        if (order === "date") {
            return tasks.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
        } else if (order === "status") {
            return tasks.sort((a, b) => a.status.localeCompare(b.status));
        }
        return tasks;
    };

    const handleSortChange = (order: "date" | "status") => {
        setSortOrder(order);
        setTasks(prevTasks => sortTasks(prevTasks, order));
    };

    const deleteTask = async (taskID: string) => {
        try {
            const updatedTask = tasks.filter((task) => task.id !== taskID);
            setTasks(updatedTask)
            await AsyncStorage.setItem("tasks", JSON.stringify(updatedTask));
        } catch (e) {
            console.log("Error deleting task:", e)
        }

    }
    if (selectedTaskId) {
        return (
            <ViewTask
                taskId={selectedTaskId}
                onBack={() => setSelectedTaskId(null)}
                updateTasks={updateTasks}
            />
        );
    }

    return (
        // <KeyboardAvoidingView style={styles.container} behavior="height">
        <TouchableWithoutFeedback
            // onPress={() => Keyboard.dismiss()}
        >
            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.innerContainer}>
                    {!expanded && <View>
                        <Text style={styles.title}>Your Tasks</Text>
                        <Text onPress={onExpanded}>Create a New Task</Text>
                    </View>}

                    {expanded && <CreateTask updateTasks={updateTasks} setExpanded={setExpanded}/>}


                    <View style={styles.tasklist}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="sort-numeric-variant" size={24} color="black"
                                                    onPress={() => handleSortChange("date")}/>
                            <MaterialCommunityIcons name="sort-alphabetical-ascending" size={24} color="black"
                                                    onPress={() => handleSortChange("status")}/>
                        </View>
                        {
                            Array.isArray(tasks) && tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TouchableOpacity key={task.id} onPress={()=>setSelectedTaskId(task.id)}>
                                    <View style={styles.taskConteiner} >
                                        <View key={task.id} style={styles.task}>
                                            <Text style={styles.taskTitle}>{task.title}</Text>
                                            <Text>Created: {task.date}</Text>
                                            <Text>Status: {task.status}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => deleteTask(task.id)}>
                                            <AntDesign name="delete" size={24} color="black"/>
                                        </TouchableOpacity>
                                    </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text>
                                    Not found task
                                </Text>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
        // </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 16,
    },
    innerContainer: {
        padding: 16,
    },
    tasklist: {
        marginTop: 20,
    },
    taskConteiner: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    task: {
        flex: 1,
        marginRight: 10,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 16,
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
});

//type
export type Task = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    status: Status
}

import {StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import {Task} from "@/app/tasks";
import {EditableTaskField} from "@/components/EditableTaskField";
import {Status} from "@/components/create";
import uuid from "react-native-uuid";
import validateField, {VALIDATION_RULES} from "@/lib/validateField";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {useFetchStoredTask} from "@/hooks/useFetchStoredTask";


const OPTIONS = [
    {id: uuid.v4(), label: 'Progress', value: Status.progres},
    {id: uuid.v4(), label: 'Completed', value: Status.complete},
    {id: uuid.v4(), label: 'Cancelled', value: Status.cancelled}
]

export default function ViewTask({taskId, onBack, updateTasks}: Props) {

    const {editedTask, setTaskView, taskView, setEditedTask} = useFetchStoredTask(taskId);
    const [editingField, setEditingField] = useState<string | null>(null);

    const deleteTask = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem("tasks");
            if (storedTasks) {
                const parsedTasks = JSON.parse(storedTasks);
                const newTasks = parsedTasks.filter((t: Task) => t.id !== taskId);

                await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
                setTaskView([]);
                updateTasks();
                onBack();
            }
        } catch (e) {
            console.log("Error deleting task:", e);
        }

    }

    const handleDoubleClick = (field: string) => {
        setEditingField(field);
    };

    const handleEditChange = (field: string, value: string) => {
        if (editedTask) {
            setEditedTask((prevTask) => ({
                ...prevTask!,
                [field]: value,
            }));
        }
    };

    const handleSaveChanges = async () => {
        if (editedTask) {
            try {
                const error = validateField(editedTask)
                if (error) {
                    ToastAndroid.showWithGravity(error, ToastAndroid.SHORT, ToastAndroid.TOP);
                    return;
                }

                const storedTasks = await AsyncStorage.getItem('tasks');
                if (storedTasks) {
                    const parsedTasks = JSON.parse(storedTasks);
                    const updatedTasks = parsedTasks.map((t: Task) =>
                        t.id === editedTask.id ? editedTask : t
                    );
                    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    setTaskView([editedTask]);
                    setEditingField(null);
                    updateTasks();
                }
            } catch (e) {
                console.log('Error saving task:', e);
            }
        }
    };


    return (
        <View>
            <TouchableOpacity onPress={onBack}>
                <MaterialCommunityIcons name="backburger" size={24} color="black"/>
                <Text>Back to Task List</Text>
            </TouchableOpacity>
            {Array.isArray(taskView) && taskView.length > 0 ? (
                taskView.map((task) => (
                    <View key={task.id} style={styles.task}>
                        <EditableTaskField
                            fieldName={task.title}
                            value={editedTask?.title || ''}
                            isEditing={editingField === 'title'}
                            onChange={(text) => handleEditChange('title', text)}
                            onDoubleClick={() => handleDoubleClick('title')}
                            style={styles.taskTitle}
                            validation={VALIDATION_RULES.title}
                        />
                        <EditableTaskField
                            fieldName={task.date}
                            value={editedTask?.date || ''}
                            isEditing={editingField === 'date'}
                            onChange={(text) => handleEditChange('date', text)}
                            onDoubleClick={() => handleDoubleClick('date')}
                            type={'date'}
                            text={'Created'}
                        />
                        <EditableTaskField
                            fieldName={task.status}
                            value={editedTask?.status || ''}
                            isEditing={editingField === 'status'}
                            onChange={(text) => handleEditChange('status', text)}
                            onDoubleClick={() => handleDoubleClick('status')}
                            type={'select'}
                            text={'Status'}
                            options={OPTIONS}
                        />
                        <EditableTaskField
                            fieldName={task.location}
                            value={editedTask?.location || ''}
                            isEditing={editingField === 'location'}
                            onChange={(text) => handleEditChange('location', text)}
                            onDoubleClick={() => handleDoubleClick('location')}
                            text={'Location'}
                            validation={VALIDATION_RULES.location}
                        />
                        <EditableTaskField
                            fieldName={task.description}
                            value={editedTask?.description || ''}
                            isEditing={editingField === 'description'}
                            onChange={(text) => handleEditChange('description', text)}
                            onDoubleClick={() => handleDoubleClick('description')}
                            text={'Description'}
                            validation={VALIDATION_RULES.description}
                        />
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteTask()}
                        >
                            <AntDesign name="delete" size={24} color="red"/>
                        </TouchableOpacity>
                        {editingField && (
                            <TouchableOpacity onPress={handleSaveChanges}>
                                <AntDesign name="save" size={26} color="red"/>
                            </TouchableOpacity>
                        )}
                    </View>
                ))
            ) : (
                <Text style={{textAlign: "center", marginTop: 20}}>
                    Task not found. Please check the task ID.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    task: {
        backgroundColor: "#f9f9f9",
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginVertical: 10,
        gap: 5,
        fontSize: 16,
        fontWeight: "600",
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    deleteButton: {
        marginTop: 8,
        alignSelf: "flex-end",
    },
});

// Props
type Props = {
    taskId: string,
    onBack: () => void,
    updateTasks: () => void,
}

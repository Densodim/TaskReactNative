import {Dispatch, SetStateAction, useState} from "react";
import {StyleSheet, Text, ToastAndroid, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';
import Fontisto from '@expo/vector-icons/Fontisto';
import BasicInput from "@/components/BasicInput";
import validateField, {VALIDATION_RULES} from "@/lib/validateField";

export enum Status {
    progres = 'In Progress',
    complete = 'Completed',
    cancelled = 'Cancelled'
}

export default function CreateTask({updateTasks, setExpanded}: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");


    const saveTask = async () => {
        try {
            const newTask = {id: uuid.v4(), title, description, date:Date(), location, status: Status.progres};
            const error = validateField(newTask)
            if (error) {
                ToastAndroid.showWithGravity(error, ToastAndroid.SHORT, ToastAndroid.TOP);
                return;
            }

            const storedTasks = await AsyncStorage.getItem("tasks");
            const tasks = storedTasks ? JSON.parse(storedTasks) : [];
            tasks.push(newTask);
            await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
            updateTasks();
            setExpanded(prevState => !prevState);
        } catch (error) {
            console.log('Error saving task:', error);
        }

    };

    return (
        <>
            <View>
                <Text style={styles.title}>Create a Task</Text>
                <BasicInput text={'Task Title'} style={styles.input} value={title} onChangeText={setTitle}
                            placeholder={'Task Title'} validation={VALIDATION_RULES.title}/>
                <BasicInput value={description} text={'Description'} style={styles.input} onChangeText={setDescription}
                            multiline={true} placeholder={'Description'} validation={VALIDATION_RULES.description}/>
                <BasicInput value={date} text={'Date'} style={styles.input} onChangeText={setDate} placeholder={'Date'}
                            type={'date'}/>
                <BasicInput value={location} text={'Location'} style={styles.input} onChangeText={setLocation}
                            placeholder={'Location'} validation={VALIDATION_RULES.location}/>
                <Fontisto name="save" size={24} color="black" onPress={saveTask}/>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        marginBottom: 20,
    },

});

//type

type Props = {
    updateTasks: () => void
    setExpanded: Dispatch<SetStateAction<boolean>>
}

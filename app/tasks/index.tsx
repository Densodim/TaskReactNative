import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import CreateTask, { Status } from "@/components/CreateTask";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import getBorderColorByStatus from "@/lib/getBorderColorByStatus";
import CircleButton from "@/components/CircleButton";
import ScrollView = Animated.ScrollView;
import useTaskStore from "@/store/useTaskStore";
import ViewTask from "@/components/ViewTask";

export default function TaskList() {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { tasks, loadTasks, deleteTask, sortTasks } = useTaskStore();

  useEffect(() => {
    const fetchTasks = async () => {
      await loadTasks(); // Вызовите loadTasks для загрузки задач
    };
    fetchTasks();
  }, [loadTasks]);

  const onExpanded = () => {
    setExpanded((prevState) => !prevState);
  };

  const handleSortChange = (order: "date" | "status") => {
    sortTasks(order);
  };

  if (selectedTaskId) {
    return (
      <ViewTask
        taskId={selectedTaskId}
        onBack={() => setSelectedTaskId(null)}
      />
    );
  }

  return (
    // <KeyboardAvoidingView style={styles.container} behavior="height">
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
          <View style={styles.optionsContainer}>
            {!expanded && (
              <View>
                <Text style={styles.title}>Your Tasks</Text>
                <CircleButton onPress={onExpanded} />
              </View>
            )}
          </View>

          {expanded && <CreateTask setExpanded={setExpanded} />}

          <View style={styles.tasklist}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="sort-numeric-variant"
                size={24}
                color="black"
                onPress={() => handleSortChange("date")}
              />
              <MaterialCommunityIcons
                name="sort-alphabetical-ascending"
                size={24}
                color="black"
                onPress={() => handleSortChange("status")}
              />
            </View>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => setSelectedTaskId(task.id)}
                >
                  <View
                    style={[
                      styles.taskConteiner,
                      {
                        borderColor: getBorderColorByStatus(
                          task.status as Status
                        ),
                      },
                    ]}
                  >
                    <View key={task.id} style={styles.task}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <Text>
                        Created: {new Date(task.date).toLocaleString()}
                      </Text>
                      <Text>Status: {task.status}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteTask(task.id)}>
                      <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Not found task</Text>
            )}
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
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#302e2e",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
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
  optionsContainer: {
    position: "static",
    alignItems: "center",
    bottom: 80,
  },
});

//type
export type Task = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: Status;
};

import React, {useState} from "react";
import {
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
} from "react-native";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {TypeTask} from "@/components/EditableTaskField";

export default function BasicInput({
                                       text,
                                       style,
                                       value,
                                       type = "text",
                                       size = "medium",
                                       placeholder = "",
                                       isError = false,
                                       onChangeText,
                                       ...props
                                   }: Props) {

    const [showDatePicker, setShowDatePicker] = useState(false);

    const inputStyles = [
        styles.input,
        isError && styles.error,
        sizeStyles[size],
        style,
    ];

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            onChangeText?.(selectedDate.toISOString());
        }
    };

    const renderInput = () => {
        if (type === "date") {
            return (
                <>
                    <TouchableOpacity
                        style={[styles.input, isError && styles.error]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text>
                            {value
                                ? new Date(value).toLocaleDateString()
                                : placeholder || "Select a date"}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            mode="date"
                            value={value ? new Date(value) : new Date()}
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={handleDateChange}
                        />
                    )}
                </>
            );
        } else {
            return (
                <TextInput
                    placeholder={placeholder}
                    style={inputStyles}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={type === "number" ? "numeric" : "default"}
                    {...props}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            {text && <Text style={styles.label}>{text}</Text>}
            {renderInput()}
        </View>
    );
}

// Type
type Props = {
    text?: string;
    style?: StyleProp<TextStyle>;
    value: string;
    type?: TypeTask;
    size?: "small" | "medium" | "large";
    placeholder?: string;
    isError?: boolean;
    onChangeText?: (text: string) => void;
} & TextInputProps;



// Style
const styles = StyleSheet.create({
    container: {
        marginVertical: 2,
    },
    label: {
        marginBottom: 1,
        fontSize: 14,
        color: "#333",
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        fontSize: 16,
    },
    error: {
        borderColor: "red",
    },
});


const sizeStyles = StyleSheet.create({
    small: {
        height: 30,
        fontSize: 14,
    },
    medium: {
        height: 40,
        fontSize: 16,
    },
    large: {
        height: 50,
        fontSize: 18,
    },
});

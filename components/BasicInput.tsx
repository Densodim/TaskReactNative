import React, {useEffect, useState} from "react";
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
import {useValidation, Validation} from "@/hooks/useValidation";

export default function BasicInput({
                                       text,
                                       style,
                                       value,
                                       type = "text",
                                       size = "medium",
                                       placeholder = "",
                                       isError = false,
                                       onChangeText,
                                       validation,
                                       ...props
                                   }: Props) {

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [tempValue, setTempValue] = useState(value);
    const error = useValidation(tempValue, validation);

    useEffect(() => {
        if (isError) {
            setTempValue(value);
        }
    }, [isError, value]);

    const inputStyles = [
        styles.input,
        isError && styles.error,
        sizeStyles[size],
        style,
    ];

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString();
            setTempValue(formattedDate);
            onChangeText?.(formattedDate);
        }
    };

    const handleTextChange = (value: string) => {
        setTempValue(value)
        onChangeText?.(value);
    }

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
                <View>
                    <TextInput
                        placeholder={placeholder}
                        style={inputStyles}
                        value={tempValue}
                        onChangeText={handleTextChange}
                        keyboardType={type === "number" ? "numeric" : "default"}
                        {...props}
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
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
    validation?: Validation
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
    errorText: {
        color: "red",
        marginTop: 4,
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

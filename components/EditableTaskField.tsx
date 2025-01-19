import React, {useEffect, useState} from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View} from 'react-native';
import BasicInput from "@/components/BasicInput";
import ModalSelector from "react-native-modal-selector";
import {useValidation, Validation} from "@/hooks/useValidation";


export const EditableTaskField = ({
                                      fieldName,
                                      value,
                                      isEditing,
                                      onChange,
                                      onDoubleClick,
                                      style,
                                      type,
                                      text,
                                      options,
                                      validation
                                  }: EditableTaskFieldProps) => {

    const [tempValue, setTempValue] = useState(value);
    const error = useValidation(tempValue, validation);

    // Синхронизация tempValue с родительским значением value при изменении isEditing
    useEffect(() => {
        if (isEditing) {
            setTempValue(value);
        }
    }, [isEditing, value]);


    if (type === 'select') {
        return (
            <TouchableOpacity onPress={onDoubleClick}>
                <Text style={style}>
                    {text}:
                    {isEditing ? (
                        <View>
                            <ModalSelector
                                data={options?.map((option) => ({
                                    ...option,
                                    key: option.id
                                })) || []}
                                initValue={value}
                                onChange={(option) => onChange(option.value)}
                            />
                        </View>

                    ) : (
                        value
                    )}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onDoubleClick}>
            <Text style={style}>
                {text}:
                {isEditing ? (
                    <View>
                        <BasicInput
                            value={tempValue}
                            onChangeText={onChange}
                            style={style}
                            type={type}
                        />
                    </View>
                ) : (
                    value
                )}
            </Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    errorText: {
        color: "red",
        marginTop: 4,
    },
})

//type
type EditableTaskFieldProps = {
    fieldName: string;
    value: string;
    isEditing: boolean;
    onChange: (value: string) => void;
    onDoubleClick: () => void;
    style?: StyleProp<TextStyle>;
    type?: TypeTask;
    text?: string;
    options?: Options;
    validation?: Validation
};

export type TypeTask = "text" | "number" | "date" | "select"

type Options = {
    id: string;
    label: string;
    value: string;
}[]



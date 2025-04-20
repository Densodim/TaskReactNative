import React from "react";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import BasicInput from "@/components/BasicInput";
import ModalSelector from "react-native-modal-selector";
import { Validation } from "@/hooks/useValidation";

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
  validation,
}: EditableTaskFieldProps) => {
  if (type === "select") {
    return (
      <TouchableOpacity onPress={onDoubleClick}>
        <Text style={style}>
          {text}:
          {isEditing ? (
            <View>
              <ModalSelector
                data={
                  options?.map((option) => ({
                    ...option,
                    key: option.id,
                  })) || []
                }
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
              value={value}
              onChangeText={onChange}
              style={style}
              type={type}
              validation={validation}
            />
          </View>
        ) : (
          value
        )}
      </Text>
    </TouchableOpacity>
  );
};

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
  validation?: Validation;
};

export type TypeTask = "text" | "number" | "date" | "select";

type Options = {
  id: string;
  label: string;
  value: string;
}[];

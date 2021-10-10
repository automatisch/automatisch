import React from "react";
import { Controller, Control, FieldValues } from "react-hook-form";
import MuiTextField from "@mui/material/TextField";

type TextFieldProps = {
  control: Control<FieldValues>;
  name: string;
}

export default function TextField({ control, name }: TextFieldProps) {
  return (
    <Controller
      name="MyCheckbox"
      control={control}
      defaultValue={false}
      rules={{ required: true }}
      render={({ field }) => <MuiTextField {...field} />}
    />
  );
};

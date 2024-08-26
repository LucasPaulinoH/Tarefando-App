import * as yup from "yup";
import { REQUIRED_FIELD_MSG } from "./constants";

export const taskValidationSchema = yup.object().shape({
    title: yup.string().required(REQUIRED_FIELD_MSG),
    description: yup.string().required(REQUIRED_FIELD_MSG),
  });
  
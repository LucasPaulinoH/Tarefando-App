import * as yup from "yup";
import { REQUIRED_FIELD_MSG } from "./constants";

export const studentValidationSchema = yup.object().shape({
  firstName: yup.string().required(REQUIRED_FIELD_MSG),
  lastName: yup.string().required(REQUIRED_FIELD_MSG),
  grade: yup.string().required(REQUIRED_FIELD_MSG),
});

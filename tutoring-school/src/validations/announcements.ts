import { REQUIRED_FIELD_MSG } from "./constants";
import * as yup from "yup";

export const announcementValidationSchema = yup.object().shape({
  title: yup.string().required(REQUIRED_FIELD_MSG),
  description: yup.string().required(REQUIRED_FIELD_MSG),
});

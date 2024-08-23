import * as yup from "yup";
import {
  INVALID_EMAIL_MSG,
  MIN_PASSWORD_CHAR,
  REQUIRED_FIELD_MSG,
  SHORT_PASSWORD_MSG,
} from "./constants";

export const loginValidationSchema = yup.object().shape({
  email: yup.string().required(REQUIRED_FIELD_MSG).email(INVALID_EMAIL_MSG),
  password: yup
    .string()
    .required(REQUIRED_FIELD_MSG)
    .min(MIN_PASSWORD_CHAR, SHORT_PASSWORD_MSG),
});

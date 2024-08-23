import * as yup from "yup";
import {
  INVALID_EMAIL_MSG,
  MIN_PASSWORD_CHAR,
  PASSWORDS_MUST_BE_EQUAL_MSG,
  REQUIRED_FIELD_MSG,
  SHORT_PASSWORD_MSG,
} from "./constants";

export const registerValidationSchema = yup.object().shape({
  firstName: yup.string().required(REQUIRED_FIELD_MSG),
  lastName: yup.string().required(REQUIRED_FIELD_MSG),
  email: yup.string().required(REQUIRED_FIELD_MSG).email(INVALID_EMAIL_MSG),
  phone: yup.string().required(REQUIRED_FIELD_MSG),
  password: yup
    .string()
    .required(REQUIRED_FIELD_MSG)
    .min(MIN_PASSWORD_CHAR, SHORT_PASSWORD_MSG),
  confirmPassword: yup
    .string()
    .required(REQUIRED_FIELD_MSG)
    .oneOf([yup.ref("password")], PASSWORDS_MUST_BE_EQUAL_MSG),
});

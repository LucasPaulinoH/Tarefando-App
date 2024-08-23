import * as yup from "yup";
import {
  MIN_PASSWORD_CHAR,
  PASSWORDS_MUST_BE_EQUAL_MSG,
  REQUIRED_FIELD_MSG,
  SHORT_PASSWORD_MSG,
} from "./constants";

export const userDataValidationSchema = yup.object().shape({
  firstName: yup.string().required(REQUIRED_FIELD_MSG),
  lastName: yup.string().required(REQUIRED_FIELD_MSG),
  phone: yup.string().required(REQUIRED_FIELD_MSG),
});

export const passwordUpdateValidationSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required(REQUIRED_FIELD_MSG)
    .min(MIN_PASSWORD_CHAR, SHORT_PASSWORD_MSG),
  newPassword: yup
    .string()
    .required(REQUIRED_FIELD_MSG)
    .min(MIN_PASSWORD_CHAR, SHORT_PASSWORD_MSG),
  confirmNewPassword: yup
    .string()
    .required(REQUIRED_FIELD_MSG)
    .oneOf([yup.ref("newPassword")], PASSWORDS_MUST_BE_EQUAL_MSG),
});

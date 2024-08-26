import * as yup from "yup";
import { INVALID_EMAIL_MSG, REQUIRED_FIELD_MSG } from "./constants";

export const schoolValidationSchema = yup.object().shape({
  name: yup.string().required(REQUIRED_FIELD_MSG),
  email: yup.string().required(REQUIRED_FIELD_MSG).email(INVALID_EMAIL_MSG),
  phone: yup.string().required(REQUIRED_FIELD_MSG),
});

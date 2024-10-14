import { View } from "react-native";
import { Button, Input, Text, useTheme } from "@ui-kitten/components";
import { useAuth } from "../../../context/AuthContext";
import { LoginIcon } from "../../../theme/Icons";
import { StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { loginValidationSchema } from "../../../validations/login";
import { yupResolver } from "@hookform/resolvers/yup";
import { APP_NAME } from "../../../utils/stringUtils";

const Login = ({ navigation }: any) => {
  const { onLogin } = useAuth();

  const theme = useTheme();

  const handleLogin = async (formData: any) => {
    try {
      await onLogin!(formData.email, formData.password);
    } catch (error) {
      console.error("Error during login:   ", error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <View
      style={{
        ...styles.mainContainer,
        backgroundColor: theme["color-primary-100"],
      }}
    >
      <View style={styles.innerContainer}>
        <Text category="h3">{APP_NAME}</Text>
        <Text category="h5">Acesse sua conta</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Email *"
              value={value}
              onChangeText={onChange}
              status={errors.email ? "danger" : "basic"}
              caption={errors.email ? errors.email.message : ""}
            />
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Senha *"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              status={errors.password ? "danger" : "basic"}
              caption={errors.password ? errors.password.message : ""}
            />
          )}
          name="password"
        />
        <Button
          onPress={handleSubmit(handleLogin)}
          style={styles.loginButton}
          accessoryLeft={LoginIcon}
        >
          Conectar-se
        </Button>

        <View style={styles.notRegisteredYetRow}>
          <Text category="s1">
            Ainda não possui uma conta?{" "}
            <Text
              category="s1"
              style={{
                ...styles.newAccountText,
                color: theme["color-primary-500"],
              }}
              onPress={() => navigation.navigate("Register")}
            >
              Crie uma
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  innerContainer: {
    width: "70%",
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  loginButton: {
    width: "100%",
  },
  notRegisteredYetRow: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
  newAccountText: {
    fontWeight: "bold",
  },
});

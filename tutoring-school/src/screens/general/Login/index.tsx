import { useState } from "react";
import { View } from "react-native";
import { Button, Input, Text } from "@ui-kitten/components";
import styles from "./styles";
import { useAuth } from "../../../context/AuthContext";
import { LoginIcon } from "../../../theme/Icons";

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useAuth();

  const handleLogin = async () => {
    try {
      await auth.onLogin!(email, password);
    } catch (error) {
      console.error("Error during login: ", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <Text category="h3">Tia Lady Ajuda</Text>
        <Text category="h5">Acesse sua conta</Text>
        <Input
          placeholder="Email *"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <Input
          placeholder="Senha *"
          value={password}
          onChangeText={(password) => setPassword(password)}
          secureTextEntry
        />
        <Button onPress={handleLogin} style={styles.loginButton} accessoryLeft={LoginIcon}>
          Conectar-se
        </Button>

        <View style={styles.notRegisteredYetRow}>
          <Text category="s1">
            Ainda não possui uma conta?{" "}
            <Text
              category="s1"
              style={styles.newAccountText}
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

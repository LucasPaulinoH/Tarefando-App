import { useState } from "react";
import { TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "@ui-kitten/components";

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useAuth();

  const handleLogin = async () => {
    try {
      const loginResult = await auth.onLogin!(email, password);
      console.log("Login result: ", loginResult);
    } catch (error) {
      console.error("Error during login: ", error);
    }
  };

  return (
    <View>
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
      <Button onPress={handleLogin}>Conectar-se</Button>
      <Button onPress={() => navigation.navigate("Register")} />
    </View>
  );
};

export default Login;

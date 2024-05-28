import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
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
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default Login;

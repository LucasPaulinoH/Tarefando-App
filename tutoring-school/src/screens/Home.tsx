import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const auth = useAuth();
  return (
    <View>
      <Text>User has been authenticated</Text>
      <Button title="Deslogar" onPress={auth.onLogout} />
    </View>
  );
};

export default Home;

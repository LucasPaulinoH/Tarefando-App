import { View, Text, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const auth = useAuth();
  return (
    <View>
      <Text>{`Olá ${auth.authState?.user?.name}, ROLE: ${auth.authState?.user?.role}`}</Text>
      <Button title="Deslogar" onPress={auth.onLogout} />
    </View>
  );
};

export default Home;

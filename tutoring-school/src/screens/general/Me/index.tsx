import { View } from "react-native";
import { LogoutIcon } from "../../../theme/Icons";
import { useAuth } from "../../../context/AuthContext";

const Me = () => {
  const { onLogout } = useAuth();
  return (
    <View>
      <LogoutIcon onPress={onLogout} style={{ width: 30, height: 30 }} />
    </View>
  );
};

export default Me;

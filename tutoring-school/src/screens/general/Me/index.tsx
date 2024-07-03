import { View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { Avatar, Button, Input, Text } from "@ui-kitten/components";
import { useState } from "react";
import { UserRole } from "../../../types/Types";
import {
  EmailIcon,
  LogoutIcon,
  PersonIcon,
  PhoneIcon,
} from "../../../theme/Icons";
import GuardianIcon from "../../../../assets/svg/guardian-card-icon.svg";
import TutorIcon from "../../../../assets/svg/tutor-card-icon.svg";

const ROLE_ICON_SIZE = 24;

const Me = () => {
  const { onLogout, authState } = useAuth();

  const [profileImage, setProfileImage] = useState(
    authState?.user?.profileImage
  );
  const [name, setName] = useState(authState?.user?.name);
  const [email, setEmail] = useState(authState?.user?.email);
  const [phone, setPhone] = useState(authState?.user?.phone);
  const role = authState?.user?.role as UserRole;

  return (
    <View>
      <Text category="h6">Dados do perfil</Text>
      <Avatar
        style={{ width: 150, height: 150 }}
        size="giant"
        source={{ uri: profileImage }}
      />
      <Input
        placeholder="Nome de usuário *"
        value={name}
        onChangeText={(name) => setName(name)}
        accessoryLeft={PersonIcon}
      />
      <Input
        placeholder="Tipo de conta *"
        value={role === UserRole.GUARDIAN ? "Responsável" : "Professor(a)"}
        accessoryLeft={
          role === UserRole.GUARDIAN ? (
            <GuardianIcon
              width={ROLE_ICON_SIZE}
              height={ROLE_ICON_SIZE}
              color="#c4c8d1"
            />
          ) : (
            <TutorIcon
              width={ROLE_ICON_SIZE}
              height={ROLE_ICON_SIZE}
              color="#c4c8d1"
            />
          )
        }
        disabled
      />
      <Input
        placeholder="Email *"
        value={email}
        onChangeText={(email) => setEmail(email)}
        accessoryLeft={EmailIcon}
      />
      <Input
        placeholder="Telefone *"
        value={phone}
        onChangeText={(phone) => setPhone(phone)}
        accessoryLeft={PhoneIcon}
      />
      <Button
        appearance="outline"
        onPress={onLogout}
        accessoryLeft={LogoutIcon}
      >
        <Text>Sair</Text>
      </Button>
    </View>
  );
};

export default Me;

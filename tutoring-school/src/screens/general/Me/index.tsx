import { View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { Avatar, Button, Input, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { UserRole } from "../../../types/Types";
import {
  EmailIcon,
  LogoutIcon,
  PersonIcon,
  PhoneIcon,
} from "../../../theme/Icons";
import GuardianIcon from "../../../../assets/svg/guardian-card-icon.svg";
import TutorIcon from "../../../../assets/svg/tutor-card-icon.svg";
import {
  handleSetSingleSelectImageState,
  uploadImage,
} from "../../../utils/imageFunctions";
import userApi from "../../../services/User";
import { User } from "../../../services/User/type";

const ICON_SIZE = 24;

const Me = () => {
  const { onLogout, authState } = useAuth();

  const [editModeEnabled, setEditModeEnabled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [profileImage, setProfileImage] = useState<string | null>(
    authState?.user?.profileImage!
  );
  const [name, setName] = useState(authState?.user?.name);
  const [email, setEmail] = useState(authState?.user?.email);
  const [phone, setPhone] = useState(authState?.user?.phone);
  const role = authState?.user?.role as UserRole;

  const handleUserUpdateClick = async () => {
    try {
      if (wasUserEdited()) {
        const user = authState?.user;

        await userApi.updateUser(user?.id!, {
          name,
          email,
          phone,
          role,
        });

        if (user?.profileImage !== profileImage) {
          const newUpdatedImageUrl = await uploadImage(
            profileImage!,
            `users/${user?.id}`
          );

          await userApi.updateUserProfileImage(user?.id!, newUpdatedImageUrl);
        }

        fetchUser();
      }
      setEditModeEnabled(false);
    } catch (error: any) {
      console.log("Error updating user: ", error?.response);
    }
  };

  const fetchUser = async () => {
    try {
      const userResponse = await userApi.getUser(authState?.user?.id!);
      setUser(userResponse);
    } catch (error: any) {
      console.log("Error fetching user: ", error?.response);
    }
  };

  const wasUserEdited = () => {
    return (
      user?.name !== name ||
      user?.email !== email ||
      user?.phone !== phone ||
      user?.profileImage !== profileImage
    );
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <View>
      <Text category="h6">Dados do perfil</Text>
      {!editModeEnabled ? (
        <Button onPress={() => setEditModeEnabled(!editModeEnabled)}>
          <Text>Editar informações do perfil</Text>
        </Button>
      ) : null}
      <Avatar
        style={{ width: 150, height: 150 }}
        size="giant"
        source={{ uri: profileImage ?? "" }}
      />
      {editModeEnabled ? (
        <>
          <View>
            <Button
              onPress={() => handleSetSingleSelectImageState(setProfileImage)}
            >
              <Text>Alterar foto de perfil</Text>
            </Button>
            {profileImage !== user?.profileImage ? (
              <Button
                onPress={() => setProfileImage(authState?.user?.profileImage!)}
                appearance="outline"
              >
                <Text>Cancelar</Text>
              </Button>
            ) : null}
          </View>
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
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  color="#c4c8d1"
                />
              ) : (
                <TutorIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                  color="#c4c8d1"
                />
              )
            }
            disabled
          />
          <Input
            placeholder="Email *"
            value={email}
            disabled
            accessoryLeft={EmailIcon}
          />
          <Input
            placeholder="Telefone *"
            value={phone}
            onChangeText={(phone) => setPhone(phone)}
            accessoryLeft={PhoneIcon}
          />

          <Button onPress={handleUserUpdateClick}>
            <Text>Confirmar alterações</Text>
          </Button>
        </>
      ) : (
        <>
          <View>
            <PersonIcon style={{ width: ICON_SIZE, height: ICON_SIZE }} />
            <Text>{`${user?.name} (${
              user?.role === UserRole.GUARDIAN ? "Responsável" : "Professor(a)"
            })`}</Text>
          </View>
          <View>
            <EmailIcon style={{ width: ICON_SIZE, height: ICON_SIZE }} />
            <Text>{user?.email}</Text>
          </View>
          <View>
            <PhoneIcon style={{ width: ICON_SIZE, height: ICON_SIZE }} />
            <Text>{user?.phone}</Text>
          </View>
        </>
      )}

      <Button
        appearance="outline"
        onPress={onLogout}
        accessoryLeft={LogoutIcon}
      >
        <Text>Sair do app</Text>
      </Button>
    </View>
  );
};

export default Me;

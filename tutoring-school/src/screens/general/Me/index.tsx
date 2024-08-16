import { ScrollView, View } from "react-native";
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
  deleteImageFromFirebase,
  handleSetSingleSelectedImageState,
  uploadImageToFirebase,
} from "../../../utils/imageFunctions";
import userApi from "../../../services/User";
import { User } from "../../../services/User/type";
import MaskInput from "react-native-mask-input";
import { PHONE_MASK } from "../../../utils/masks";

const ICON_SIZE = 24;

const Me = ({ navigation }: any) => {
  const { onLogout, authState } = useAuth();

  const [tabIndex, setTabIndex] = useState(0);
  const [editModeEnabled, setEditModeEnabled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [profileImage, setProfileImage] = useState<string | null>(
    authState?.user?.profileImage!
  );
  const [name, setName] = useState(authState?.user?.name);
  const [email, setEmail] = useState(authState?.user?.email);
  const [phone, setPhone] = useState(authState?.user?.phone);
  const role = authState?.user?.role as UserRole;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

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
          const newUpdatedImageUrl = await uploadImageToFirebase(
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

  const handleDeleteUserClick = async (
    userId: string,
    profileImage: string
  ) => {
    try {
      if (profileImage) {
        await deleteImageFromFirebase(profileImage);
        console.log(`${profileImage} successfully deleted from firebase`);
      }

      await userApi.deleteUser(userId);
      onLogout;
    } catch (error) {
      console.error("Error deleting school: ", error);
    }
  };

  const handleUpdatePasswordClick = async () => {
    try {
      if (newPassword === newPasswordConfirm) {
        const updatePasswordDTO = {
          id: authState?.user?.id!,
          currentPassword,
          newPassword,
        };
        

        const updatedPasswordResponse = await userApi.updateUserPassword(
          updatePasswordDTO
        );
        console.log(updatedPasswordResponse);
      }
    } catch (error) {
      console.error("Error updating user password: ", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <ScrollView>
      <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
        <Button onPress={() => setTabIndex(0)}>
          <Text>Meu perfil</Text>
        </Button>
        <Button onPress={() => setTabIndex(1)}>
          <Text>Alterar senha</Text>
        </Button>
      </View>
      {tabIndex === 0 ? (
        <>
          <Text category="h6">Dados do perfil</Text>
          {!editModeEnabled ? (
            <Button onPress={() => setEditModeEnabled(!editModeEnabled)}>
              <Text>Editar informações do perfil</Text>
            </Button>
          ) : null}
          <Avatar
            style={{ width: 150, height: 150 }}
            size="giant"
            source={{ uri: profileImage! }}
          />
          {editModeEnabled ? (
            <>
              <View>
                <Button
                  onPress={() =>
                    handleSetSingleSelectedImageState(setProfileImage)
                  }
                >
                  <Text>Alterar foto de perfil</Text>
                </Button>
                {profileImage !== user?.profileImage ? (
                  <Button
                    onPress={() =>
                      setProfileImage(authState?.user?.profileImage!)
                    }
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
                value={
                  role === UserRole.GUARDIAN ? "Responsável" : "Professor(a)"
                }
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
              <MaskInput
                mask={PHONE_MASK}
                value={phone}
                onChangeText={(phone) => setPhone(phone)}
                placeholder="Telefone (contato) *"
                keyboardType="numeric"
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
                  user?.role === UserRole.GUARDIAN
                    ? "Responsável"
                    : "Professor(a)"
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
          <Button
            appearance="outline"
            onPress={() =>
              handleDeleteUserClick(user?.id!, user?.profileImage!)
            }
          >
            <Text>Excluir conta</Text>
          </Button>
        </>
      ) : (
        <>
          <Text category="h6">Alterar senha</Text>
          <Input
            placeholder="Senha atual *"
            value={currentPassword}
            onChangeText={(currentPassword) =>
              setCurrentPassword(currentPassword)
            }
          />
          <Input
            placeholder="Nova senha *"
            value={newPassword}
            onChangeText={(newPassword) => setNewPassword(newPassword)}
          />
          <Input
            placeholder="Confirme a nova senha *"
            value={newPasswordConfirm}
            onChangeText={(newPasswordConfirm) =>
              setNewPasswordConfirm(newPasswordConfirm)
            }
          />
          <Button onPress={handleUpdatePasswordClick}>
            <Text>Alterar senha</Text>
          </Button>
        </>
      )}
    </ScrollView>
  );
};

export default Me;

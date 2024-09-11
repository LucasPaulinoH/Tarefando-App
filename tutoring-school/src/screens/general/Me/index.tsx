import { ScrollView, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import {
  Avatar,
  Button,
  Card,
  Input,
  Tab,
  TabBar,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { UserRole } from "../../../types/Types";
import {
  ConfirmIcon,
  EditIcon,
  EmailIcon,
  LogoutIcon,
  PersonIcon,
  PhoneIcon,
  UnlinkSchoolIcon,
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
import GenericModal from "../../../components/GenericModal";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  passwordUpdateValidationSchema,
  userDataValidationSchema,
} from "../../../validations/me";
import userIcon from "../../../../assets/user.png";
import { StyleSheet } from "react-native";

const ICON_SIZE = 24;

/* CORRIGIR EDIÇÃO DE IMAGENS */
const Me = ({ navigation }: any) => {
  const { onLogout, authState } = useAuth();

  const theme = useTheme();

  const [tabIndex, setTabIndex] = useState(0);
  const [editModeEnabled, setEditModeEnabled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [profileImage, setProfileImage] = useState<string | null>(
    authState?.user?.profileImage!
  );
  const [name, setName] = useState(authState?.user?.name);
  const email = authState?.user?.email;
  const role = authState?.user?.role as UserRole;

  const [isConfirmQuitVisible, setIsConfirmQuitVisible] = useState(false);
  const [isDeleteAccountVisible, setIsDeleteAccountVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      tabIndex === 0 ? userDataValidationSchema : passwordUpdateValidationSchema
    ),
    defaultValues:
      tabIndex === 0
        ? {
            firstName: authState?.user?.name.split(" ")[0],
            lastName: authState?.user?.name.split(" ")[1],
            phone: authState?.user?.phone,
          }
        : { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const handleUserUpdateClick = async (formData: any) => {
    try {
      if (wasUserEdited()) {
        const user = authState?.user;

        await userApi.updateUser(user?.id!, {
          name: `${formData.firstName} ${formData.lastName}`,
          email,
          phone: formData.phone,
          role,
        });

        let newUpdatedImageUrl = null;

        if (user?.profileImage && profileImage)
          newUpdatedImageUrl = await uploadImageToFirebase(
            profileImage,
            `users/${user?.id}`
          );

        if (
          profileImage &&
          user?.profileImage &&
          user?.profileImage !== profileImage
        )
          await deleteImageFromFirebase(user?.profileImage!);

        await userApi.updateUserProfileImage(user?.id!, newUpdatedImageUrl);
      }
      setEditModeEnabled(false);
    } catch (error: any) {
      console.log("Error updating user: ", error?.response);
    }
    fetchUser();
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
      user?.phone !== "" ||
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
      setIsDeleteAccountVisible(false);

      onLogout;
    } catch (error) {
      console.error("Error deleting school: ", error);
    }
  };

  const handleUpdatePasswordClick = async (formData: any) => {
    try {
      if (formData.newPassword === formData.newPasswordConfirm) {
        const updatePasswordDTO = {
          id: authState?.user?.id!,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
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

  useEffect(() => {
    if (tabIndex === 0) {
      setProfileImage(null);
      fetchUser();
    }
  }, [tabIndex]);

  const confirmExitModal = (
    <GenericModal
      isVisible={isConfirmQuitVisible}
      setIsVisible={setIsConfirmQuitVisible}
    >
      <Card disabled={true}>
        <View style={styles.exitModal}>
          <Button
            style={styles.exitModalCloseButton}
            accessoryLeft={UnlinkSchoolIcon}
            onPress={() => setIsConfirmQuitVisible(false)}
            appearance="ghost"
          />
          <Text>Tem certeza que deseja sair?</Text>
          <View style={styles.exitModalOptionsContainer}>
            <Button onPress={onLogout}>Sim</Button>
            <Button
              appearance="ghost"
              onPress={() => setIsConfirmQuitVisible(false)}
            >
              Não
            </Button>
          </View>
        </View>
      </Card>
    </GenericModal>
  );

  const deleteAccountModal = (
    <GenericModal
      isVisible={isDeleteAccountVisible}
      setIsVisible={setIsDeleteAccountVisible}
    >
      <Card disabled={true}>
        {/* <Button
          accessoryLeft={UnlinkSchoolIcon}
          onPress={() => setIsDeleteAccountVisible(false)}
          appearance="ghost"
        />
        <Text>Tem certeza que deseja exluir sua conta?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <Button
            onPress={() =>
              handleDeleteUserClick(user?.id!, user?.profileImage!)
            }
          >
            Sim
          </Button>
          <Button
            appearance="outline"
            onPress={() => setIsDeleteAccountVisible(false)}
          >
            Não
          </Button>
        </View> */}
      </Card>
    </GenericModal>
  );

  return (
    <ScrollView style={styles.mainContainer}>
      {confirmExitModal}
      {deleteAccountModal}
      <TabBar
        selectedIndex={tabIndex}
        onSelect={(index) => {
          setTabIndex(index);
          if (index === 1) setEditModeEnabled(false);
        }}
      >
        <Tab title="Meu perfil" />
        <Tab title="Alterar senha" />
      </TabBar>
      {tabIndex === 0 ? (
        <View style={styles.tabContentContainer}>
          <View style={styles.editUserDataHeader}>
            <Text category="h6">Dados do perfil</Text>
            {!editModeEnabled ? (
              <Button
                onPress={() => setEditModeEnabled(!editModeEnabled)}
                accessoryLeft={EditIcon}
                appearance="ghost"
              />
            ) : null}
          </View>
          <Avatar
            style={styles.userAvatar}
            size="giant"
            source={profileImage ? { uri: profileImage } : userIcon}
          />

          {editModeEnabled ? (
            <>
              <View>
                <Button
                  onPress={() =>
                    handleSetSingleSelectedImageState(setProfileImage)
                  }
                  accessoryLeft={EditIcon}
                  style={styles.editImageButton}
                />
              </View>
              <View style={styles.clearImageButton}>
                {profileImage ? (
                  <Button
                    onPress={() => setProfileImage(null)}
                    appearance="ghost"
                  >
                    <Text>Limpar imagem</Text>
                  </Button>
                ) : null}
                {profileImage !== user?.profileImage ? (
                  <Button
                    onPress={() =>
                      setProfileImage(authState?.user?.profileImage!)
                    }
                    appearance="ghost"
                  >
                    <Text>Cancelar</Text>
                  </Button>
                ) : null}
              </View>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Nome *"
                    value={value}
                    onChangeText={onChange}
                    status={errors.firstName ? "danger" : "basic"}
                    caption={errors.firstName ? errors.firstName.message : ""}
                  />
                )}
                name="firstName"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Sobrenome *"
                    value={value}
                    onChangeText={onChange}
                    status={errors.lastName ? "danger" : "basic"}
                    caption={errors.lastName ? errors.lastName.message : ""}
                  />
                )}
                name="lastName"
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
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Telefone (contato) *"
                    value={value}
                    onChangeText={onChange}
                    status={errors.phone ? "danger" : "basic"}
                    caption={errors.phone ? errors.phone.message : ""}
                  />
                )}
                name="phone"
              />

              <View>
                <Button
                  onPress={handleSubmit(handleUserUpdateClick)}
                  accessoryLeft={ConfirmIcon}
                >
                  <Text>Confirmar alterações</Text>
                </Button>
                <Button
                  onPress={() => setEditModeEnabled(false)}
                  appearance="ghost"
                >
                  <Text>Cancelar</Text>
                </Button>
              </View>
            </>
          ) : (
            <>
              <View style={styles.userInfoContainer}>
                <PersonIcon
                  style={styles.userInfoIcon}
                  fill={theme["color-primary-900"]}
                />
                <Text>{`${user?.name} (${
                  user?.role === UserRole.GUARDIAN
                    ? "Responsável"
                    : "Professor(a)"
                })`}</Text>
              </View>
              <View style={styles.userInfoContainer}>
                <EmailIcon
                  style={styles.userInfoIcon}
                  fill={theme["color-primary-900"]}
                />
                <Text>{user?.email}</Text>
              </View>
              <View style={styles.userInfoContainer}>
                <PhoneIcon
                  style={styles.userInfoIcon}
                  fill={theme["color-primary-900"]}
                />
                <Text>{user?.phone}</Text>
              </View>
            </>
          )}

          {!editModeEnabled ? (
            <Button
              onPress={() => setIsConfirmQuitVisible(true)}
              accessoryLeft={LogoutIcon}
            >
              <Text>Sair do app</Text>
            </Button>
          ) : null}

          {/* <Button
            appearance="outline"
            onPress={() => setIsDeleteAccountVisible(true)}
          >
            <Text>Excluir conta</Text>
          </Button> */}
        </View>
      ) : (
        <View style={styles.tabContentContainer}>
          <Text category="h6">Alterar senha</Text>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha atual *"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                status={errors.currentPassword ? "danger" : "basic"}
                caption={
                  errors.currentPassword ? errors.currentPassword.message : ""
                }
              />
            )}
            name="currentPassword"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nova senha *"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                status={errors.newPassword ? "danger" : "basic"}
                caption={errors.newPassword ? errors.newPassword.message : ""}
              />
            )}
            name="newPassword"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a nova senha *"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                status={errors.confirmNewPassword ? "danger" : "basic"}
                caption={
                  errors.confirmNewPassword
                    ? errors.confirmNewPassword.message
                    : ""
                }
              />
            )}
            name="confirmNewPassword"
          />
          <Button
            onPress={handleSubmit(handleUpdatePasswordClick)}
            accessoryLeft={ConfirmIcon}
          >
            <Text>Alterar senha</Text>
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default Me;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FEECE8",
  },

  exitModal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  exitModalCloseButton: {
    marginTop: -22,
    marginRight: -40,
    alignSelf: "flex-end",
  },

  exitModalOptionsContainer: {
    width: "100%",
    marginTop: 20,
  },

  editUserDataHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userInfoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  userInfoIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },

  tabContentContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    width: "100%",
    padding: 20,
  },

  userAvatar: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#F7A8B0",
    alignSelf: "center",
  },

  clearImageButton: {
    marginTop: -30,
  },

  editImageButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginTop: -60,
    marginLeft: 200,
  },
});

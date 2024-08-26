import { useState } from "react";
import { ScrollView, View } from "react-native";
import styles from "./styles";
import { Avatar, Button, Input, Text } from "@ui-kitten/components";
import RoleSelectCard from "../../../components/RoleSelectCard";
import { useAuth } from "../../../context/AuthContext";
import { UserRole } from "../../../types/Types";
import userApi from "../../../services/User";
import {
  handleSetSingleSelectedImageState,
  uploadImageToFirebase,
} from "../../../utils/imageFunctions";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidationSchema } from "../../../validations/register";

const Register = ({ navigation }: any) => {
  const auth = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.TUTOR);

  const handleRoleClick = (role: UserRole) => {
    setRole(role);
  };

  const handleFinishFirstStep = (formData: any) => {
    setUserData({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
    setCurrentStep(1);
  };

  const handleRegistration = async () => {
    try {
      const newUserData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role,
        password: userData.password,
      };

      const createdUser = await auth.onRegister!(newUserData);

      if (createdUser && profileImage !== null) {
        const newUserProfileImageUrl = await uploadImageToFirebase(
          profileImage,
          `users/${createdUser.id}`
        );

        await userApi.updateUserProfileImage(
          createdUser.id,
          newUserProfileImageUrl!
        );
      }

      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during registration: ", error);
    }
  };

  const renderFirstStep = (
    <View style={styles.innerContainer}>
      <Text category="h3">Tia Lady Ajuda</Text>
      <Text category="h5">1. Preencha os dados de usuário</Text>
      <Avatar
        style={{ width: 150, height: 150 }}
        size="giant"
        source={{ uri: profileImage! }}
      />
      <View>
        <Button
          onPress={() => handleSetSingleSelectedImageState(setProfileImage)}
        >
          <Text>Adicionar foto de perfil</Text>
        </Button>
        <Button onPress={() => setProfileImage(null)} appearance="outline">
          <Text>Limpar</Text>
        </Button>
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

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email *"
            value={value}
            onChangeText={onChange}
            status={errors.email ? "danger" : "basic"}
            caption={errors.email ? errors.email.message : ""}
          />
        )}
        name="email"
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

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Senha *"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            status={errors.password ? "danger" : "basic"}
            caption={errors.password ? errors.password.message : ""}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Confirme a senha *"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            status={errors.confirmPassword ? "danger" : "basic"}
            caption={
              errors.confirmPassword ? errors.confirmPassword.message : ""
            }
          />
        )}
        name="confirmPassword"
      />

      <Button onPress={handleSubmit(handleFinishFirstStep)}>Confirmar</Button>
    </View>
  );

  const renderSecondStep = (
    <View style={styles.innerContainer}>
      <Text category="h3">Tia Lady Ajuda</Text>
      <Text category="h5">2. Selecione o tipo de conta</Text>
      <RoleSelectCard
        role={UserRole.TUTOR}
        selected={role === UserRole.TUTOR ? true : false}
        onPress={() => handleRoleClick(UserRole.TUTOR)}
      />
      <RoleSelectCard
        role={UserRole.GUARDIAN}
        selected={role === UserRole.GUARDIAN ? true : false}
        onPress={() => handleRoleClick(UserRole.GUARDIAN)}
      />

      <Button onPress={handleRegistration} style={styles.button}>
        Finalizar cadastro
      </Button>
      <Button
        onPress={() => setCurrentStep(0)}
        style={styles.button}
        appearance="outline"
      >
        Voltar
      </Button>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        {currentStep === 0 ? renderFirstStep : renderSecondStep}
      </View>
    </ScrollView>
  );
};

export default Register;

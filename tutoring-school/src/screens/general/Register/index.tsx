import { useState } from "react";
import { View } from "react-native";
import styles from "./styles";
import { Button, Card, Input, Text } from "@ui-kitten/components";
import RoleSelectCard from "../../../components/RoleSelectCard";
import { useAuth } from "../../../context/AuthContext";
import { UserRole } from "../../../types/Types";

const Register = ({ navigation }: any) => {
  const auth = useAuth();

  const [currentStep, setCurrentStep] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.TUTOR);
  const [password, setPassword] = useState("");

  const handleRoleClick = (role: UserRole) => {
    setRole(role);
  };

  const handleRegistration = async () => {
    try {
      const newUserData = { name, email, phone, role, password };

      const registrationResult = await auth.onRegister!(newUserData);
      console.log("Registration result: ", registrationResult);

      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during registration: ", error);
    }
  };

  const renderFirstStep = (
    <View style={styles.innerContainer}>
      <Text category="h3">Tia Lady Ajuda</Text>
      <Text category="h5">1. Preencha os dados de usuário</Text>
      <Input
        placeholder="Nome de usuário *"
        value={name}
        onChangeText={(name) => setName(name)}
      />
      <Input
        placeholder="Email *"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <Input
        placeholder="Telefone *"
        value={phone}
        onChangeText={(phone) => setPhone(phone)}
      />
      <Input
        placeholder="Senha *"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry
      />
      <Button onPress={() => setCurrentStep(1)} style={styles.button}>
        Confirmar
      </Button>
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
    <View style={styles.mainContainer}>
      {currentStep === 0 ? renderFirstStep : renderSecondStep}
    </View>
  );
};

export default Register;

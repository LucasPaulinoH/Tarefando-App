import { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { UserRole } from "../types/Types";
import { useAuth } from "../context/AuthContext";

const Register = ({ navigation }: any) => {
  const auth = useAuth();

  const [currentStep, setCurrentStep] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.GUARDIAN);
  const [password, setPassword] = useState("");

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
    <View>
      <TextInput
        placeholder="Nome de usuário *"
        value={name}
        onChangeText={(name) => setName(name)}
      />
      <TextInput
        placeholder="Email *"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        placeholder="Telefone *"
        value={phone}
        onChangeText={(phone) => setPhone(phone)}
      />
      <TextInput
        placeholder="Senha *"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry
      />
      <Button title="Confirmar" onPress={() => setCurrentStep(1)} />
    </View>
  );

  const renderSecondStep = (
    <View>
      <Button title="Responsável" onPress={() => setRole(UserRole.GUARDIAN)} />
      <Button title="Professor" onPress={() => setRole(UserRole.TUTOR)} />

      <Button title="Finalizar cadastro" onPress={handleRegistration} />
    </View>
  );
  return <View>{currentStep === 0 ? renderFirstStep : renderSecondStep}</View>;
};

export default Register;

import { View } from "react-native";
import { Text, Input, Button, IconElement, Icon } from "@ui-kitten/components";
import { useAuth } from "../../../context/AuthContext";
import MaskInput from "react-native-mask-input";
import { useEffect, useState } from "react";
import { fetchCep } from "../../../utils/cep";
import schoolApi from "../../../services/School";
import { CEP_MASK, PHONE_MASK } from "../../../utils/masks";
import { School } from "../../../services/School/type";
import { AddIcon } from "../../../theme/Icons";

const AddSchool = ({ navigation }: any) => {
  const { authState } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [isCepFilled, setIsCepFilled] = useState(false);

  const handleAddSchoolClick = async () => {
    try {
      const userId = authState?.user!.id!;

      const newSchool: School = {
        userId,
        name,
        description,
        phone,
        email,
        cep,
        address,
        addressNumber,
        district,
        city,
        state,
      };

      await schoolApi.createSchool(newSchool);
      navigation.navigate("TutorHome");
    } catch (error) {
      console.error("Error creating school: ", error);
    }
  };

  useEffect(() => {
    if (cep.replace("-", "").length === 8) {
      fetchCep(cep, setAddress, setDistrict, setCity, setState);
      setIsCepFilled(true);
    } else {
      setAddress("");
      setDistrict("");
      setCity("");
      setState("");
      setIsCepFilled(false);
    }
  }, [cep]);

  return (
    <View>
      <Text category="h6">Nova escola</Text>
      <Input
        placeholder="Nome da escola *"
        value={name}
        onChangeText={(name) => setName(name)}
      />
      <Input
        placeholder="Descrição"
        multiline={true}
        numberOfLines={5}
        value={description}
        onChangeText={(description) => setDescription(description)}
      />
      <MaskInput
        mask={PHONE_MASK}
        value={phone}
        onChangeText={(phone) => setPhone(phone)}
        placeholder="Telefone (contato) *"
        keyboardType="numeric"
      />
      <Input
        placeholder="Email (contato) *"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <MaskInput
        mask={CEP_MASK}
        value={cep}
        onChangeText={(cep) => setCep(cep)}
        placeholder="CEP"
        keyboardType="numeric"
      />
      <Input
        placeholder="Rua"
        value={address}
        onChangeText={(street) => setAddress(street)}
        disabled={isCepFilled}
      />
      <Input
        placeholder="N°"
        value={addressNumber}
        onChangeText={(number) => setAddressNumber(number)}
      />
      <Input
        placeholder="Bairro"
        value={district}
        onChangeText={(district) => setDistrict(district)}
        disabled={isCepFilled}
      />
      <Input
        placeholder="Cidade"
        value={city}
        onChangeText={(city) => setCity(city)}
        disabled={isCepFilled}
      />
      <Input
        placeholder="Estado"
        value={state}
        onChangeText={(state) => setState(state)}
        disabled={isCepFilled}
      />
      <Button accessoryLeft={AddIcon} onPress={handleAddSchoolClick}>
        Adicionar escola
      </Button>
    </View>
  );
};

export default AddSchool;

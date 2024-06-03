import { View } from "react-native";
import { Text, Input, Button, IconElement, Icon } from "@ui-kitten/components";
import { useAuth } from "../../../context/AuthContext";
import MaskInput from "react-native-mask-input";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import axios from "axios";
import { fetchCep } from "../../../utils/cep";
import schoolApi from "../../../services/School";

const AddSchoolIcon = (props: any): IconElement => (
  <Icon {...props} name="plus-square-outline" />
);

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
      const tutorId = authState?.user!.id!;

      const createdSchoolResponse = await schoolApi.createSchool({
        tutorId,
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
      });
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
        mask={[
          "(",
          /\d/,
          /\d/,
          ") ",
          /\d/,
          ".",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        value={phone}
        onChangeText={(phone) => setPhone(phone)}
        placeholder="Telefone (contato) *"
      />
      <Input
        placeholder="Email (contato) *"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <MaskInput
        mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
        value={cep}
        onChangeText={(cep) => setCep(cep)}
        placeholder="CEP"
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
      <Button accessoryLeft={AddSchoolIcon} onPress={handleAddSchoolClick}>
        Adicionar escola
      </Button>
    </View>
  );
};

export default AddSchool;

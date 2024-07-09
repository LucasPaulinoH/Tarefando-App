import * as SecureStore from "expo-secure-store";
import { School } from "../../../services/School/type";
import { View } from "react-native";
import { useState } from "react";
import { Input, Button, Text, Avatar } from "@ui-kitten/components";
import MaskInput from "react-native-mask-input";
import { CEP_MASK, PHONE_MASK } from "../../../utils/masks";
import schoolApi from "../../../services/School";
import { EditIcon } from "../../../theme/Icons";
import {
  handleSetSingleSelectedImageState,
  uploadImageToFirebase,
} from "../../../utils/imageFunctions";

const EditSchool = ({ navigation }: any) => {
  const selectedSchool: School = JSON.parse(
    SecureStore.getItem("selectedSchool")!
  );

  const [profileImage, setProfileImage] = useState<string | null>(
    selectedSchool.profileImage!
  );
  const [name, setName] = useState(selectedSchool.name);
  const [description, setDescription] = useState(selectedSchool.description);
  const [phone, setPhone] = useState(selectedSchool.phone);
  const [email, setEmail] = useState(selectedSchool.email);

  const [cep, setCep] = useState(selectedSchool.cep);
  const [address, setAddress] = useState(selectedSchool.address);
  const [addressNumber, setAddressNumber] = useState(
    selectedSchool.addressNumber
  );
  const [district, setDistrict] = useState(selectedSchool.district);
  const [city, setCity] = useState(selectedSchool.city);
  const [state, setState] = useState(selectedSchool.state);

  const handleEditSchoolClick = async () => {
    try {
      const { userId: tutorId } = selectedSchool;

      await schoolApi.updateSchool(selectedSchool.id!, {
        userId: tutorId,
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
      } as School);

      if (selectedSchool.profileImage !== profileImage) {
        const newUpdatedImageUrl = await uploadImageToFirebase(
          profileImage!,
          `schools/${selectedSchool?.id}`
        );

        await schoolApi.updateSchoolProfileImage(
          selectedSchool.id!,
          newUpdatedImageUrl
        );
      }

      navigation.navigate("TutorHome");
    } catch (error) {
      console.error("Error editing school: ", error);
    }
  };

  return (
    <View>
      <Text category="h6">Editar escola</Text>
      <View>
        <Avatar
          style={{ width: 150, height: 150 }}
          size="giant"
          source={{ uri: profileImage ?? "" }}
        />
        {profileImage !== selectedSchool?.profileImage ? (
          <Button
            onPress={() => setProfileImage(selectedSchool.profileImage!)}
            appearance="outline"
          >
            <Text>Cancelar</Text>
          </Button>
        ) : null}
        <Button
          onPress={() => handleSetSingleSelectedImageState(setProfileImage)}
        >
          <Text>Alterar foto da escola</Text>
        </Button>
      </View>
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
      />
      <Input
        placeholder="Rua"
        value={address}
        onChangeText={(street) => setAddress(street)}
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
      />
      <Input
        placeholder="Cidade"
        value={city}
        onChangeText={(city) => setCity(city)}
      />
      <Input
        placeholder="Estado"
        value={state}
        onChangeText={(state) => setState(state)}
      />
      <Button onPress={handleEditSchoolClick} accessoryLeft={EditIcon}>
        Confirmar edição
      </Button>
    </View>
  );
};

export default EditSchool;

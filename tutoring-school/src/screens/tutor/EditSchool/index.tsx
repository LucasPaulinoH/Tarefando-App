import * as SecureStore from "expo-secure-store";
import { School } from "../../../services/School/type";
import { ScrollView, View } from "react-native";
import { useState } from "react";
import { Input, Button, Text, Avatar, useTheme } from "@ui-kitten/components";
import MaskInput from "react-native-mask-input";
import { CEP_MASK } from "../../../utils/masks";
import schoolApi from "../../../services/School";
import { EditIcon } from "../../../theme/Icons";
import {
  handleSetSingleSelectedImageState,
  uploadImageToFirebase,
} from "../../../utils/imageFunctions";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schoolValidationSchema as schoolValidationSchema } from "../../../validations/school";
import noSchoolIcon from "../../../../assets/noSchool.png";
import BackPageButton from "../../../components/BackPageButton";
import { styles } from "../schoolScreenStyles";

const EditSchool = ({ navigation }: any) => {
  const selectedSchool: School = JSON.parse(
    SecureStore.getItem("selectedSchool")!
  );

  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schoolValidationSchema),
    defaultValues: {
      name: selectedSchool.name,
      phone: selectedSchool.phone,
      email: selectedSchool.email,
    },
  });

  const [profileImage, setProfileImage] = useState<string | null>(
    selectedSchool.profileImage!
  );
  const [description, setDescription] = useState(selectedSchool.description);

  const [cep, setCep] = useState(selectedSchool.cep);
  const [address, setAddress] = useState(selectedSchool.address);
  const [addressNumber, setAddressNumber] = useState(
    selectedSchool.addressNumber
  );
  const [district, setDistrict] = useState(selectedSchool.district);
  const [city, setCity] = useState(selectedSchool.city);
  const [state, setState] = useState(selectedSchool.state);

  const handleEditSchoolClick = async (formData: any) => {
    try {
      const { userId: tutorId } = selectedSchool;

      await schoolApi.updateSchool(selectedSchool.id!, {
        userId: tutorId,
        name: formData.name,
        description,
        phone: formData.phone,
        email: formData.email,
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
    <ScrollView style={{ backgroundColor: theme["color-primary-100"] }}>
      <BackPageButton onPress={() => navigation.goBack()} />
      <View style={styles.mainContent}>
        <Text category="h6">Editar escola</Text>
        <View>
          <Avatar
             style={styles.schoolAvatar}
            size="giant"
            source={profileImage ? { uri: profileImage } : noSchoolIcon}
          />
          {profileImage !== selectedSchool?.profileImage ? (
            <Button
              onPress={() => setProfileImage(selectedSchool.profileImage!)}
              appearance="ghost"
            >
              <Text>Cancelar</Text>
            </Button>
          ) : null}
          <Button
            onPress={() => handleSetSingleSelectedImageState(setProfileImage)}
            accessoryLeft={EditIcon}
          >
            <Text>Alterar foto da escola</Text>
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
              status={errors.name ? "danger" : "basic"}
              caption={errors.name ? errors.name.message : ""}
            />
          )}
          name="name"
        />
        <Input
          placeholder="Descrição"
          multiline={true}
          numberOfLines={5}
          textAlignVertical="top"
          value={description}
          onChangeText={(description) => setDescription(description)}
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
        <Input
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
        <Button
          onPress={handleSubmit(handleEditSchoolClick)}
          accessoryLeft={EditIcon}
        >
          Confirmar edição
        </Button>
      </View>
    </ScrollView>
  );
};

export default EditSchool;

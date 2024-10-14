import { ScrollView, View } from "react-native";
import { Text, Input, Button, Avatar, useTheme } from "@ui-kitten/components";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { fetchCep } from "../../../utils/cep";
import schoolApi from "../../../services/School";
import { School } from "../../../services/School/type";
import { AddIcon, ImageIcon } from "../../../theme/Icons";
import {
  handleSetSingleSelectedImageState,
  uploadImageToFirebase,
} from "../../../utils/imageFunctions";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schoolValidationSchema } from "../../../validations/school";
import BackPageButton from "../../../components/BackPageButton";
import { styles } from "../schoolScreenStyles";
import noSchoolIcon from "../../../../assets/noSchool.png";

const AddSchool = ({ navigation }: any) => {
  const { authState } = useAuth();

  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schoolValidationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [isCepFilled, setIsCepFilled] = useState(false);

  const handleAddSchoolClick = async (formData: any) => {
    try {
      const userId = authState?.user!.id!;

      const newSchool: School = {
        userId,
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
        profileImage: null,
      };

      const createdSchool = await schoolApi.createSchool(newSchool);

      if (createdSchool && profileImage !== null) {
        const newSchoolProfileImageUrl = await uploadImageToFirebase(
          profileImage,
          `schools/${createdSchool.id}`
        );

        await schoolApi.updateSchoolProfileImage(
          createdSchool.id!,
          newSchoolProfileImageUrl!
        );
      }

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
    <ScrollView style={{ backgroundColor: theme["color-primary-100"] }}>
      <BackPageButton onPress={() => navigation.goBack()} />
      <View style={styles.mainContent}>
        <Text category="h6">Nova escola</Text>
        <View>
          <Avatar
            style={styles.schoolAvatar}
            size="giant"
            source={profileImage ? { uri: profileImage } : noSchoolIcon}
          />
          {profileImage ? (
            <Button onPress={() => setProfileImage(null)} appearance="ghost">
              <Text>Limpar</Text>
            </Button>
          ) : null}
          <Button
            onPress={() => handleSetSingleSelectedImageState(setProfileImage)}
            accessoryLeft={ImageIcon}
            style={{ marginTop: 20 }}
          >
            <Text>Adicionar foto da escola</Text>
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
          multiline
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
          placeholder="CEP"
          value={cep}
          onChangeText={(cep) => setCep(cep)}
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
        <Button
          accessoryLeft={AddIcon}
          onPress={handleSubmit(handleAddSchoolClick)}
        >
          Adicionar escola
        </Button>
      </View>
    </ScrollView>
  );
};

export default AddSchool;

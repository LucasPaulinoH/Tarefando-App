import { View } from "react-native";
import { School } from "../../../services/School/type";
import * as SecureStore from "expo-secure-store";
import { Icon, Text } from "@ui-kitten/components";
import styles from "./styles";
import QRCode from "react-native-qrcode-svg";

const SchoolDetails = () => {
  const selectedSchool: School = JSON.parse(
    SecureStore.getItem("selectedSchool")!
  );

  return (
    <View>
      <Text category="h5">{selectedSchool.name}</Text>
      <Text category="s1" style={{ textAlign: "justify" }}>
        {selectedSchool.description}
      </Text>

      <View style={styles.contactInfoContainer}>
        <Icon name="phone-outline" style={styles.icons} />
        <Text>{selectedSchool.phone}</Text>
      </View>
      <View style={styles.contactInfoContainer}>
        <Icon name="email-outline" style={styles.icons} />
        <Text>{selectedSchool.email}</Text>
      </View>
      <View style={styles.contactInfoContainer}>
        <Icon name="navigation-2-outline" style={styles.icons} />
        <Text
          style={{ textAlign: "justify" }}
        >{`${selectedSchool.address}, ${selectedSchool.addressNumber} - ${selectedSchool.district}, ${selectedSchool.city} - ${selectedSchool.state}`}</Text>
      </View>
      <QRCode value={selectedSchool.id} />
    </View>
  );
};

export default SchoolDetails;

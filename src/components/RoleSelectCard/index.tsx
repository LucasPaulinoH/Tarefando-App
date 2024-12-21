import { UserRole } from "../../types/Types";
import { Card, Text } from "@ui-kitten/components";
import GuardianIcon from "../../../assets/svg/guardian-card-icon.svg";
import TutorIcon from "../../../assets/svg/tutor-card-icon.svg";
import { highlight, light } from "../../theme/palette";
import { View } from "react-native";
import styles from "./styles";

interface RoleSelectCardProps {
  role: UserRole;
  selected: boolean;
  onPress: () => void;
}

const ROLE_LABELS = ["Professor(a)", "Responsável"];

const RoleSelectCard = (props: RoleSelectCardProps) => {
  const { role, selected, onPress } = props;

  return (
    <Card
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: selected ? highlight : light },
      ]}
    >
      <View style={styles.innerCard}>
        {role === UserRole.TUTOR ? (
          <TutorIcon
            width={65}
            height={65}
            style={{ color: selected ? light : highlight }}
          />
        ) : (
          <GuardianIcon
            width={65}
            height={65}
            style={{ color: selected ? light : highlight }}
          />
        )}
        <Text
          category="s1"
          style={{ fontWeight: "bold", color: selected ? light : highlight }}
        >
          {role === UserRole.TUTOR ? ROLE_LABELS[0] : ROLE_LABELS[1]}
        </Text>
      </View>
    </Card>
  );
};

export default RoleSelectCard;

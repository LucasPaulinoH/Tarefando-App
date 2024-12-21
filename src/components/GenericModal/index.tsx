import { Button, Modal } from "@ui-kitten/components";
import { Dispatch, ReactNode } from "react";
import { UnlinkSchoolIcon } from "../../theme/Icons";

interface GenericModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

const GenericModal = (props: GenericModalProps) => {
  const { isVisible, setIsVisible, children } = props;

  return (
    <Modal
      backdropStyle={styles.backdrop}
      visible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
    >
      {children}
    </Modal>
  );
};

export default GenericModal;

const styles = {
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

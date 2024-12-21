import { TouchableOpacity } from "react-native"
import { BackIcon } from "../../theme/Icons"
import { useTheme } from "@ui-kitten/components"

interface BackPageButtonProps {
    onPress: any,
}

const BackPageButton = (props: BackPageButtonProps) => {
    const theme = useTheme();
    
    return <TouchableOpacity onPress={props.onPress}>
        <BackIcon style={{width: 30, height: 30, margin: 8}} fill={theme["color-primary-500"]}/>
    </TouchableOpacity>
}

export default BackPageButton
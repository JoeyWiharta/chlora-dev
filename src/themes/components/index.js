import MuiPaper from "./MuiPaper";
import MuiDivider from "./MuiDivider";
import MuiTextField from "./MuiTextField";
import MuiButton from "./MuiButton";
import MuiInputLabel from "./MuiInputLabel";
import MuiOutlinedInput from "./MuiOutlinedInput";
import MuiDrawer from "./MuiDrawer";
import MuiSelect from "./MuiSelect";
import TabOverrides from "./MuiTabOverrides";
import MuiSvgIcon from "./MuiSvgIcon";

const buildComponents = () => ({
    ...MuiPaper,
    ...MuiDivider,
    ...MuiTextField,
    ...MuiButton,
    ...MuiInputLabel,
    ...MuiOutlinedInput,
    ...MuiDrawer,
    ...MuiSelect,
    ...TabOverrides,
    ...MuiSvgIcon,
    
});

export default buildComponents;
import { AuthProvider } from "./src/context/AuthContext";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import Routes from "./src/routes";

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <AuthProvider>
        <ApplicationProvider {...eva} theme={eva.light}>
          <Routes />
        </ApplicationProvider>
      </AuthProvider>
    </>
  );
}

import { AuthProvider } from "./src/context/AuthContext";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import Routes from "./src/routes";
import { default as theme } from "./src/theme/theme.json";

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <IconRegistry icons={EvaIconsPack} />
      <AuthProvider>
        <Layout
          style={{
            flex: 1,
          }}
        >
          <Routes />
        </Layout>
      </AuthProvider>
    </ApplicationProvider>
  );
}

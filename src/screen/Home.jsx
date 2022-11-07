import React from "react";
import Header from "../components/Header";
import { View, Text } from "react-native";
import Button from "../components/Button";
import { AuthContext } from "../contexts/AuthContext";

function Home() {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Header />
      <Text>Home Screen</Text>
      <Button
        mode="contained"
        onPress={() => {
          signOut();
        }}
      >
        Logout
      </Button>
    </View>
  );
}

export default Home;

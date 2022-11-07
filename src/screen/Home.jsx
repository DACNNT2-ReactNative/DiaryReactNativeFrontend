import React from "react";
import Header from "../components/Header";
import { View, Text } from "react-native";
import Button from "../components/Button";
import { authenticationSelectors } from "../redux/authenticate/selector";
import { useSelector } from "react-redux";

function Home() {
  const isAuthenticated = useSelector(authenticationSelectors.isUserAuthenticated);
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

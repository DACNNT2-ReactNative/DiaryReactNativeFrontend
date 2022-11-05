import React from "react";
import Header from "../components/Header";
import { View, Text } from "react-native";

function Home() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Header />
      <Text>Home Screen</Text>
    </View>
  );
}

export default Home;

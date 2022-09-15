import * as React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PanResponderWithNestedFlatlist from "./examples/PanResponderWithNestedFlatlist";
import FlatlistWithNestedPanResponder from "./examples/FlatlistWithNestedPanResponder";
import SameDirectionNestedRN from "./examples/SameDirectionNestedRN";

const examples = [
  PanResponderWithNestedFlatlist,
  FlatlistWithNestedPanResponder,
  SameDirectionNestedRN,
];

function componentName(component: () => React.ReactNode) {
  return component.name || "?";
}

function displayName(camelCaseName: string) {
  return camelCaseName.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function ExampleScreenButton({ screenName }: { screenName: string }) {
  const navigation = useNavigation();
  return (
    <Pressable
      android_ripple={{ color: "#DCDCDC" }}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#6699cc" : "white",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 5,
        margin: 20,
        padding: 12,
      })}
      // @ts-ignore I'm too lazy to set up types for screens here
      onPress={() => navigation.navigate(screenName)}
    >
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        {displayName(screenName)}
      </Text>
    </Pressable>
  );
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 12, alignItems: "center" }}>
      {examples.map((comp, idx) => (
        <ExampleScreenButton key={idx} screenName={componentName(comp)} />
      ))}
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // to fit long title names
          headerTitleStyle: { fontSize: 14, fontWeight: "normal" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        {examples.map((comp, idx) => (
          <Stack.Screen key={idx} name={componentName(comp)} component={comp} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Mobile Frontend</Text>
        <Text style={styles.title}>Bajol Matrimony for Expo</Text>
        <Text style={styles.subtitle}>
          This mobile app starts with the current backend-connected authentication,
          registration, and profile flow from the web project.
        </Text>
      </View>

      <Card>
        <View style={styles.actions}>
          <Button label="Sign In" onPress={() => navigation.navigate("Login")} />
          <Button
            label="Create Account"
            onPress={() => navigation.navigate("Register")}
            variant="secondary"
          />
          <Button label="About Bajol" onPress={() => navigation.navigate("About")} variant="secondary" />
          <Button label="Rules" onPress={() => navigation.navigate("Rules")} variant="secondary" />
          <Button
            label="Conclusion"
            onPress={() => navigation.navigate("Conclusion")}
            variant="secondary"
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: 24,
    marginTop: 24,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
  },
});

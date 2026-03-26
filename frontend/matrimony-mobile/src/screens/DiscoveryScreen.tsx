import React, { useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useGetAllUsersQuery } from "../api/viewApi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PickerField } from "../components/PickerField";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { GENDER_OPTIONS, STATE_OPTIONS } from "../constants/profileOptions";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Discovery">;
type PickerName = "state" | "gender" | null;

const countries = ["India"];

export function DiscoveryScreen({ navigation }: Props) {
  const [activePicker, setActivePicker] = useState<PickerName>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    district: "",
    gender: "",
  });
  const payload = useMemo(
    () => ({
      page: 1,
      limit: 100,
      filter: filters,
    }),
    [filters],
  );
  const { data = [], isLoading } = useGetAllUsersQuery(payload);

  const options = activePicker === "state" ? STATE_OPTIONS : GENDER_OPTIONS;
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Profile");
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Discover Profiles</Text>
        <Text style={styles.subtitle}>Search the same `user/list` backend used by the web app.</Text>

        <TextField
          label="Country"
          value={filters.country}
          onChangeText={(value) => setFilters((prev) => ({ ...prev, country: value }))}
          placeholder={countries[0]}
        />
        <PickerField
          label="State"
          value={filters.state}
          placeholder="Select state"
          onPress={() => setActivePicker("state")}
        />
        <TextField
          label="District"
          value={filters.district}
          onChangeText={(value) => setFilters((prev) => ({ ...prev, district: value }))}
          placeholder="Enter district or N/A"
        />
        <PickerField
          label="Gender"
          value={filters.gender}
          placeholder="Select gender"
          onPress={() => setActivePicker("gender")}
        />

        <View style={styles.gap} />
        <Text style={styles.resultCount}>
          {isLoading ? "Loading matches..." : `${data.length} profiles found`}
        </Text>
      </Card>

      {data.map((user: any) => {
        const imageUrl = user?.userDetails?.imageData?.[0]?.url || user?.imageData?.[0]?.url;
        return (
          <Pressable key={String(user.id)} onPress={() => setSelectedUser(user)}>
            <Card>
              {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" /> : null}
              <Text style={styles.name}>{user?.name || "Unnamed profile"}</Text>
              <Text style={styles.meta}>
                {user?.state || "No state"} · {user?.district || "No district"} · {user?.gender || "No gender"}
              </Text>
              <Text style={styles.bio}>Phone: {user?.phone_number || "Hidden"}</Text>
              <Text style={styles.tapHint}>Tap to view full profile</Text>
            </Card>
          </Pressable>
        );
      })}

      <View style={styles.gap} />
      <Button label="Back" onPress={handleBack} variant="secondary" />

      <Modal transparent visible={!!activePicker} animationType="slide">
        <View style={styles.modalBackdrop}>
          <Card>
            <Text style={styles.modalTitle}>Select {activePicker}</Text>
            <ScrollView style={styles.optionList}>
              {options.map((option) => (
                <Pressable
                  key={option}
                  style={styles.optionItem}
                  onPress={() => {
                    const key = activePicker as Exclude<PickerName, null>;
                    setFilters((prev) => ({ ...prev, [key]: option }));
                    setActivePicker(null);
                  }}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Button label="Close" onPress={() => setActivePicker(null)} variant="secondary" />
          </Card>
        </View>
      </Modal>

      <Modal transparent visible={!!selectedUser} animationType="fade">
        <View style={styles.modalBackdrop}>
          <Card>
            <Text style={styles.modalTitle}>Profile Details</Text>
            <ScrollView style={styles.profileDetailList}>
              {(selectedUser?.userDetails?.imageData?.[0]?.url || selectedUser?.imageData?.[0]?.url) ? (
                <Image
                  source={{
                    uri:
                      selectedUser?.userDetails?.imageData?.[0]?.url ||
                      selectedUser?.imageData?.[0]?.url,
                  }}
                  style={styles.detailImage}
                  resizeMode="cover"
                />
              ) : null}
              <Text style={styles.detailItem}>Name: {selectedUser?.name || "N/A"}</Text>
              <Text style={styles.detailItem}>Age: {selectedUser?.age || "N/A"}</Text>
              <Text style={styles.detailItem}>Gender: {selectedUser?.gender || "N/A"}</Text>
              <Text style={styles.detailItem}>Caste: {selectedUser?.caste || "N/A"}</Text>
              <Text style={styles.detailItem}>Religion: {selectedUser?.religion || "N/A"}</Text>
              <Text style={styles.detailItem}>
                District: {selectedUser?.district || selectedUser?.userDetails?.district || "N/A"}
              </Text>
              <Text style={styles.detailItem}>
                State: {selectedUser?.state || selectedUser?.userDetails?.state || "N/A"}
              </Text>
              <Text style={styles.detailItem}>Country: {selectedUser?.country || "N/A"}</Text>
              <Text style={styles.detailItem}>Phone: {selectedUser?.phone_number || "N/A"}</Text>
              <Text style={styles.detailItem}>Whatsapp: {selectedUser?.whatsapp || "N/A"}</Text>
              <Text style={styles.detailItem}>Job: {selectedUser?.job || "N/A"}</Text>
              <Text style={styles.detailItem}>Monthly Salary: {selectedUser?.monthlySalary || "N/A"}</Text>
              <Text style={styles.detailItem}>
                Marriage Status: {selectedUser?.count || selectedUser?.userDetails?.count || "N/A"}
              </Text>
              <Text style={styles.detailItem}>Whose Marriage: {selectedUser?.person || "N/A"}</Text>
            </ScrollView>
            <Button label="Close" onPress={() => setSelectedUser(null)} variant="secondary" />
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  gap: {
    height: 16,
  },
  resultCount: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  image: {
    borderRadius: 16,
    height: 220,
    marginBottom: 12,
    width: "100%",
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
  },
  bio: {
    color: colors.text,
    fontSize: 15,
    marginTop: 8,
  },
  tapHint: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },
  modalBackdrop: {
    backgroundColor: "rgba(30,27,22,0.35)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  optionList: {
    maxHeight: 420,
    marginBottom: 16,
  },
  optionItem: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
  },
  profileDetailList: {
    marginBottom: 16,
    maxHeight: 520,
  },
  detailImage: {
    borderRadius: 16,
    height: 260,
    marginBottom: 16,
    width: "100%",
  },
  detailItem: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
});

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const RATE_PER_HOUR = 1500;

export default function BookDriverScreen({ navigation }) {
  const [carDetails, setCarDetails] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const totalCost = hours ? (parseFloat(hours) * RATE_PER_HOUR).toLocaleString() : "0";

  async function handleBook() {
    if (!carDetails || !location || !hours) {
      return Alert.alert("Missing info", "Fill in your car details, location, and number of hours.");
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "driverHireBookings"), {
        uid: auth.currentUser.uid,
        carDetails,
        location,
        hours: parseFloat(hours),
        ratePerHour: RATE_PER_HOUR,
        totalCost: parseFloat(hours) * RATE_PER_HOUR,
        notes,
        status: "pending",
        createdAt: new Date()
      });
      Alert.alert("Booked!", "We're finding you a driver now.");
      navigation.navigate("MyBookings");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
    setLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hire a Driver</Text>
      <Text style={styles.rate}>₦{RATE_PER_HOUR.toLocaleString()} / hour</Text>

      <TextInput style={styles.input} placeholder="Car make & plate number" value={carDetails} onChangeText={setCarDetails} />
      <TextInput style={styles.input} placeholder="Pickup location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Number of hours" value={hours} onChangeText={setHours} keyboardType="numeric" />
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Notes (optional)" value={notes} onChangeText={setNotes} multiline />

      <Text style={styles.total}>Estimated total: ₦{totalCost}</Text>

      <TouchableOpacity style={styles.button} onPress={handleBook} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Booking..." : "Book Driver"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", flexGrow: 1 },
  title: { fontSize: 26, fontWeight: "bold", color: "#222", marginBottom: 4 },
  rate: { fontSize: 15, color: "#2FA8E0", marginBottom: 20, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 15 },
  total: { fontSize: 18, fontWeight: "bold", color: "#222", marginVertical: 12 },
  button: { backgroundColor: "#2FA8E0", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});

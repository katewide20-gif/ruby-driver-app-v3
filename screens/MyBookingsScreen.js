import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Linking, Alert } from "react-native";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function MyBookingsScreen({ navigation }) {
  const [role, setRole] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);

  useEffect(() => {
    async function loadRole() {
      const riderDoc = await getDoc(doc(db, "riders", auth.currentUser.uid));
      setRole(riderDoc.exists() ? "driver" : "customer");
    }
    loadRole();
  }, []);

  useEffect(() => {
    if (role === "customer") {
      const q = query(
        collection(db, "driverHireBookings"),
        where("uid", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      return onSnapshot(q, (snap) => {
        setMyBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    }
    if (role === "driver") {
      const q = query(collection(db, "driverHireBookings"), where("status", "==", "pending"));
      const unsubAvail = onSnapshot(q, (snap) => {
        setAvailableJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
      const q2 = query(collection(db, "driverHireBookings"), where("driverUid", "==", auth.currentUser.uid));
      const unsubMine = onSnapshot(q2, (snap) => {
        setMyBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
      return () => { unsubAvail(); unsubMine(); };
    }
  }, [role]);

  async function claimJob(jobId) {
    const riderDoc = await getDoc(doc(db, "riders", auth.currentUser.uid));
    const riderData = riderDoc.data() || {};
    await updateDoc(doc(db, "driverHireBookings", jobId), {
      status: "claimed",
      driverUid: auth.currentUser.uid,
      driverName: riderData.name || "Your driver",
      driverPhone: riderData.phone || ""
    });
    Alert.alert("Job claimed!", "Check 'My Jobs' to contact the customer.");
  }

  function callPerson(phone) {
    if (!phone) return Alert.alert("No phone number on file yet.");
    Linking.openURL(`tel:${phone}`);
  }

  if (role === "driver") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Available Jobs</Text>
        <FlatList
          data={availableJobs}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No jobs waiting right now.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.carDetails}</Text>
              <Text>{item.location} - {item.hours}h - N{item.totalCost}</Text>
              <TouchableOpacity style={styles.claimBtn} onPress={() => claimJob(item.id)}>
                <Text style={styles.claimBtnText}>Claim this job</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <Text style={[styles.title, { marginTop: 20 }]}>My Jobs</Text>
        <FlatList
          data={myBookings}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No claimed jobs yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.carDetails}</Text>
              <Text>{item.location} - {item.hours}h - Status: {item.status}</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate("Chat", { bookingId: item.id })}>
                  <Text style={styles.chatBtnText}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={myBookings}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No bookings yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.carDetails}</Text>
            <Text>{item.location} - {item.hours}h - N{item.totalCost}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            {item.driverUid && (
              <View style={styles.row}>
                <TouchableOpacity style={styles.callBtn} onPress={() => callPerson(item.driverPhone)}>
                  <Text style={styles.callBtnText}>Call {item.driverName}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate("Chat", { bookingId: item.id })}>
                  <Text style={styles.chatBtnText}>Chat</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  empty: { color: "#888", marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 10, padding: 14, marginBottom: 10 },
  cardTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  status: { color: "#2FA8E0", marginTop: 4, fontWeight: "600" },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  callBtn: { backgroundColor: "#22c55e", padding: 10, borderRadius: 8 },
  callBtnText: { color: "#fff", fontWeight: "600" },
  chatBtn: { backgroundColor: "#2FA8E0", padding: 10, borderRadius: 8 },
  chatBtnText: { color: "#fff", fontWeight: "600" },
  claimBtn: { backgroundColor: "#2FA8E0", padding: 10, borderRadius: 8, marginTop: 8, alignItems: "center" },
  claimBtnText: { color: "#fff", fontWeight: "600" }
});

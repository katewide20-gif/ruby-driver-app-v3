import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { collection, query, orderBy, onSnapshot, addDoc, getDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function ChatScreen({ route }) {
  const { bookingId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [senderName, setSenderName] = useState("You");
  const listRef = useRef(null);

  useEffect(() => {
    async function loadName() {
      const uDoc = await getDoc(doc(db, "riders", auth.currentUser.uid));
      if (uDoc.exists()) return setSenderName(uDoc.data().name || "You");
      const cDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (cDoc.exists()) setSenderName(cDoc.data().name || "You");
    }
    loadName();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "driverHireBookings", bookingId, "messages"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [bookingId]);

  async function sendMessage() {
    if (!text.trim()) return;
    await addDoc(collection(db, "driverHireBookings", bookingId, "messages"), {
      senderUid: auth.currentUser.uid,
      senderName,
      text: text.trim(),
      createdAt: new Date()
    });
    setText("");
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.senderUid === auth.currentUser.uid ? styles.myBubble : styles.theirBubble]}>
            <Text style={styles.senderName}>{item.senderName}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Type a message..." value={text} onChangeText={setText} />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 10, borderRadius: 10, marginBottom: 8, maxWidth: "80%" },
  myBubble: { backgroundColor: "#2FA8E0", alignSelf: "flex-end" },
  theirBubble: { backgroundColor: "#f1f1f1", alignSelf: "flex-start" },
  senderName: { fontSize: 11, color: "#555", marginBottom: 2 },
  inputRow: { flexDirection: "row", padding: 12, borderTopWidth: 1, borderTopColor: "#eee" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  sendBtn: { backgroundColor: "#2FA8E0", borderRadius: 20, paddingHorizontal: 16, justifyContent: "center" },
  sendBtnText: { color: "#fff", fontWeight: "600" }
});

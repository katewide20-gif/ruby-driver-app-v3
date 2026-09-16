import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function LoginScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) return Alert.alert("Missing info", "Enter email and password.");
    setLoading(true);
    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const collectionName = role === "driver" ? "riders" : "users";
        await setDoc(doc(db, collectionName, cred.user.uid), {
          name, phone, email, role, createdAt: new Date()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ruby</Text>
      <Text style={styles.subtitle}>{isSignup ? "Create an account" : "Log in"}</Text>

      {isSignup && (
        <>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === "customer" && styles.roleBtnActive]}
              onPress={() => setRole("customer")}>
              <Text style={role === "customer" ? styles.roleTextActive : styles.roleText}>I own a car</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === "driver" && styles.roleBtnActive]}
              onPress={() => setRole("driver")}>
              <Text style={role === "driver" ? styles.roleTextActive : styles.roleText}>I'm a driver</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </>
      )}

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Please wait..." : isSignup ? "Sign up" : "Log in"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.switchText}>
          {isSignup ? "Already have an account? Log in" : "New here? Create an account"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 36, fontWeight: "bold", color: "#2FA8E0", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#555", textAlign: "center", marginBottom: 24 },
  roleRow: { flexDirection: "row", marginBottom: 12, gap: 8 },
  roleBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#2FA8E0", alignItems: "center" },
  roleBtnActive: { backgroundColor: "#2FA8E0" },
  roleText: { color: "#2FA8E0", fontWeight: "600" },
  roleTextActive: { color: "#fff", fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 15 },
  button: { backgroundColor: "#2FA8E0", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  switchText: { color: "#2FA8E0", textAlign: "center", marginTop: 16 }
});

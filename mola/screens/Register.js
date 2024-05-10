import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      setRegistering(true);
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const db = getFirestore();
      await addDoc(collection(db, "personList"), {
        userId: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: "user",
      });

      console.log(
        "Kullanıcı kaydı başarıyla tamamlandı ve veritabanına kaydedildi!"
      );
      setRegisterSuccess(true);

      setTimeout(() => {
        navigation.navigate("Login"); // Kayıt olduktan sonra giriş ekranına git
      }, 2000);
    } catch (error) {
      console.error(
        "Kullanıcı kaydı sırasında bir hata oluştu:",
        error.message
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Ad"
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Soyad"
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-Posta"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Parola"
        secureTextEntry
      />
      <Button
        title="Kayıt Ol"
        onPress={handleRegister}
        color={registering ? "gray" : "#3498db"}
        disabled={registering}
      />
      <Button
        title="Giriş Ekranına Dön"
        onPress={handleBackToLogin}
        color="#e74c3c"
      />
      {registerSuccess && (
        <Text style={styles.successMessage}>Hesap oluşturuldu!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  successMessage: {
    color: "green",
    marginTop: 10,
  },
});

export default Register;

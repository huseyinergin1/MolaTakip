import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

//FİREBASE
import { initializeApp } from "@firebase/app";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, query, where, getDocs } from "@firebase/firestore";

//DAHİLİ FİREBASE YAPILANDIRMASI (EMİN OLMAK İÇİN)
const firebaseConfig = {
  apiKey: "AIzaSyDbMDlmbTi4_dgDwRqb9KQgsfCK7EhV4tc",
  authDomain: "molatakipp.firebaseapp.com",
  projectId: "molatakipp",
  storageBucket: "molatakipp.appspot.com",
  messagingSenderId: "374560607072",
  appId: "1:374560607072:web:0595b9ae52c86c91b5ec05",
  measurementId: "G-38460P0F7Z",
};

initializeApp(firebaseConfig);

const AuthScreen = () => {
  //GİRİLEN VERİLERİ TUTAR
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  // GİRİLEN VERİLERİ PERSONLİST KOLEKSİYONUNDA BULUP KARŞILAŞTIRMA YAPAR
  // GİRİLEN VERİLER DOĞRUYSA ROLE KOŞULU SUNUP ADMİN İSE ADMİN PANELİNE USER İSE HOME SCREENE YÖNLENDİRİR
  const handleAuthentication = async () => {
    try {
      if (!email || !password) {
        throw new Error("Email ve şifre gereklidir");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const querySnapshot = await getDocs(
          query(collection(db, "personList"), where("email", "==", email))
        );

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          const role = userData.role;

          if (role === "admin") {
            navigation.navigate("AdminPanel");
          } else if (role === "user") {
            navigation.navigate("Home", { email, uid: userData.uid, role });
          } else {
            console.error("Geçersiz rol:", role);
          }
        } else {
          console.error("Kullanıcı verisi bulunamadı.");
        }
      } else {
        console.error("Giriş başarısız");
      }
    } catch (error) {
      console.error("Kimlik doğrulama hatası:", error.message);
    }
  };

  //KAYIT OL BUTONU İÇİN YÖNLENDİRME FONKSİYONU
  const handleRegisterNavigation = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Giriş Yap</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Şifre"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Giriş Yap"
            onPress={handleAuthentication}
            color="#3498db"
          />
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.toggleText} onPress={handleRegisterNavigation}>
            {"Hesabınız yok mu? Kayıt Ol"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: "#3498db",
    textAlign: "center",
  },
  bottomContainer: {
    marginTop: 20,
  },
});

export default AuthScreen;

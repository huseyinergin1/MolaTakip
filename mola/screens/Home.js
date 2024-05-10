import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  SimpleLineIcons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs } from "@firebase/firestore";
import { DrawerContentScrollView } from "@react-navigation/drawer";
//FİREBASE
import { getAuth, signOut } from "@firebase/auth";
import { onSnapshot } from "@firebase/firestore";
import { db } from "../config/firebase";
//SAYFALAR
import Hakkimizda from "./Hakkimizda";
import gMola from "./Gmola";
import Timer from "./Timer";
//BAŞ HARF BÜYÜTME FONKSİYONU
const capitalizeFirstLetter = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function HomeScreen() {
  const navigation = useNavigation();
  const [personeller, setPersoneller] = useState([]);
  // ANLIK OLARAK PERSONLİST KOLEKSİYONUNDAN VERİ ALIR
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "personList"), (snapshot) => {
      const personelData = snapshot.docs.map((doc) => doc.data());
      setPersoneller(personelData);
    });

    return () => unsubscribe();
  }, []);

  //VERİTABANINDAN ÇEKİLEN PERSONELLERİ GÖSTERİR
  const renderPersonelItem = ({ item }) => (
    <TouchableOpacity style={styles.personelItem}>
      <Text style={styles.personelName}>
        {capitalizeFirstLetter(item.firstName)}{" "}
        {capitalizeFirstLetter(item.lastName)}
      </Text>
      <Text style={styles.personelEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  // ÇEKİLEN PERSONELLERİ LİSTELER
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Personeller</Text>
      <FlatList
        data={personeller}
        renderItem={renderPersonelItem}
        keyExtractor={(item) => item.email}
      />
    </View>
  );
}
// SOLMENÜ
function CustomDrawerContent(props) {
  const [userProfile, setUserProfile] = useState({}); // Boş bir obje olarak başlangıç değeri
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user) {
        getUserRole(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const getUserRole = async (user) => {
    try {
      const q = query(
        collection(db, "personList"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserProfile(doc.data());
      });
    } catch (error) {
      console.error("Error getting user profile:", error);
    }
  };
  //çıkış fonksiyonu
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); // Firebase hesabından çıkış yap
      navigation.navigate("Login"); // Giriş ekranına yönlendir
    } catch (error) {
      console.error("Çıkış yaparken bir hata oluştu:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContainer}>
        <View style={styles.drawerProfileContainer}>
          <Image
            source={require("../assets/user.png")}
            style={styles.drawerProfileImage}
          />
          <Text style={styles.drawerProfileText}>
            {userProfile.firstName} {userProfile.lastName}
          </Text>
          {userProfile && (
            <Text style={styles.drawerProfileText2}>{userProfile.email}</Text>
          )}
        </View>
        <DrawerItemList {...props} />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: "white",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="HomeScreen"
        options={{
          drawerLabel: ({ focused }) => (
            <Text
              style={[
                styles.drawerItemLabel,
                { color: focused ? "#5c0501" : "#000" },
              ]}
            >
              Anasayfa
            </Text>
          ),
          title: "Anasayfa",
          drawerIcon: () => (
            <SimpleLineIcons name="home" size={25} color="#5c0501" />
          ),
        }}
        component={HomeScreen}
      />

      <Drawer.Screen
        name="Timer"
        options={{
          drawerLabel: ({ focused }) => (
            <Text
              style={[
                styles.drawerItemLabel,
                { color: focused ? "#5c0501" : "#000" },
              ]}
            >
              Mola
            </Text>
          ),
          title: "Mola",
          drawerIcon: () => (
            <MaterialIcons name="timer" size={25} color="#5c0501" />
          ),
        }}
        component={Timer}
      />

      <Drawer.Screen
        name="Geçmiş Molalarım"
        options={{
          drawerLabel: ({ focused }) => (
            <Text
              style={[
                styles.drawerItemLabel,
                { color: focused ? "#5c0501" : "#000" },
              ]}
            >
              Geçmiş Molalarım
            </Text>
          ),
          title: "Geçmiş Molalarım",
          drawerIcon: () => (
            <MaterialIcons
              name="dashboard-customize"
              size={25}
              color="#5c0501"
            />
          ),
        }}
        component={gMola}
      />

      <Drawer.Screen
        name="Hakkımızda"
        options={{
          drawerLabel: ({ focused }) => (
            <Text
              style={[
                styles.drawerItemLabel,
                { color: focused ? "#5c0501" : "#000" },
              ]}
            >
              Hakkımızda
            </Text>
          ),
          title: "Hakkımızda",
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="message-alert-outline"
              size={25}
              color="#5c0501"
            />
          ),
        }}
        component={Hakkimizda}
      />
    </Drawer.Navigator>
  );
}
// SOL MENÜ BİTİŞ

//STYLE KODLARI
const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5c0501",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20,
  },
  personelItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  personelName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#5c0501",
  },
  personelEmail: {
    fontSize: 16,
    color: "#666",
  },
  drawerContainer: {
    flex: 1,
  },
  drawerProfileContainer: {
    alignItems: "center",
    padding: 20,
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: 1,
  },
  drawerProfileImage: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  drawerProfileText: {
    fontSize: 22,
    marginVertical: 6,
    fontWeight: "bold",
    color: "#5c0501",
    textTransform: "uppercase",
  },
  drawerProfileText2: {
    fontSize: 15,
    color: "#5c0501",
    textTransform: "capitalize",
  },
  drawerItemLabel: {
    fontSize: 17,
  },
  header: {
    backgroundColor: "#5c0501",
  },
  logoutButton: {
    alignItems: "center",
    padding: 20,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  logoutText: {
    fontSize: 17,
    color: "#5c0501",
  },
});

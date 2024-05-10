import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  getDocs,
  doc,
} from "@firebase/firestore";
import { auth, db } from "../config/firebase";

const AdminScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("admin"); // Default role: admin
  const [personList, setPersonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    const pageSize = 3; // Kaç personelin her sayfada gösterileceği
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const q = query(collection(db, "personList"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const slicedData = data.slice(startIndex, endIndex);

    setPersonList(slicedData);
    setTotalPages(Math.ceil(data.length / pageSize));
  };

  const handleAddPerson = async () => {
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      firstName.trim() === "" ||
      lastName.trim() === ""
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const newPerson = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      role: role, // Use selected role
    };

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        newPerson.email,
        newPerson.password
      );
      const uid = user.uid;

      const docRef = await addDoc(collection(db, "personList"), {
        ...newPerson,
        uid,
      });
      setPersonList((prevList) => [
        ...prevList,
        { id: docRef.id, ...newPerson, uid },
      ]);

      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setRole("admin"); // Reset role to admin after adding person
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  const handleDeletePerson = async (personId) => {
    try {
      await deleteDoc(doc(db, "personList", personId));

      setPersonList((prevList) =>
        prevList.filter((person) => person.id !== personId)
      );

      const person = personList.find((person) => person.id === personId);
      if (person) {
        await auth.signInWithEmailAndPassword(person.email, person.password);
        await auth.currentUser.delete();
      }
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Çıkış hatası:", error.message);
      });
  };

  const handleViewMolas = () => {
    navigation.navigate("AdminMola");
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Ad"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Soyad"
            value={lastName}
            onChangeText={setLastName}
          />
          <View style={styles.roleContainer}>
            <Text style={styles.roleText}>Rol:</Text>
            <Button
              title="Admin"
              onPress={() => setRole("admin")}
              color={role === "admin" ? "#007bff" : "#ccc"}
            />
            <Button
              title="User"
              onPress={() => setRole("user")}
              color={role === "user" ? "#007bff" : "#ccc"}
            />
          </View>
          <Button
            title="Personel Oluştur"
            onPress={handleAddPerson}
            color="green"
            style={styles.addButton}
          />
        </View>
        <View style={styles.listContainer}>
          <Text style={styles.personTitle}>PERSONEL LİSTESİ</Text>
          <FlatList
            data={personList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.personItem}>
                <Text style={styles.personText}>Ad: {item.firstName}</Text>
                <Text style={styles.personText}>Soyad: {item.lastName}</Text>
                <Text style={styles.personText}>E-posta: {item.email}</Text>
                <Text style={styles.personText}>Rol: {item.role}</Text>
                <Button
                  title="Sil"
                  onPress={() => handleDeletePerson(item.id)}
                  color="red"
                />
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Personel bulunmamaktadır.</Text>
              </View>
            )}
          />
        </View>
      </View>
      <View style={styles.pagination}>
        <Button
          title="<"
          onPress={handlePrevPage}
          disabled={currentPage === 1}
        />
        <Text>
          Sayfa {currentPage} / {totalPages}
        </Text>
        <Button
          title=">"
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Molalar" onPress={handleViewMolas} />
        <Button title="Çıkış Yap" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  formContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  inputContainer: {
    width: "40%",
    marginTop: 50,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  roleText: {
    marginRight: 10,
  },
  addButton: {
    marginTop: 10,
  },
  listContainer: {
    width: "55%",
  },
  personItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  personText: {
    marginBottom: 5,
  },
  personTitle: {
    fontWeight: "bold",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 150,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});

export default AdminScreen;

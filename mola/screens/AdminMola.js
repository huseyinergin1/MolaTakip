import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../config/firebase";

const Molalar = () => {
  const [molalar, setMolalar] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "mola"), (querySnapshot) => {
      const updatedMolalar = [];
      querySnapshot.forEach((doc) => {
        updatedMolalar.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setMolalar(groupMolalarByDate(updatedMolalar));
    });

    return () => unsubscribe();
  }, []);

  const groupMolalarByDate = (molalar) => {
    const groupedMolalar = {};
    molalar.forEach((mola) => {
      const startDate = mola.startTime.toDate();
      const dateKey = formatDate(startDate);
      if (!groupedMolalar[dateKey]) {
        groupedMolalar[dateKey] = {};
      }
      if (!groupedMolalar[dateKey][mola.email]) {
        groupedMolalar[dateKey][mola.email] = [];
      }
      groupedMolalar[dateKey][mola.email].push(mola);
    });
    return groupedMolalar;
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("tr-TR", options);
  };

  const renderMolaItem = ({ item }) => (
    <View style={styles.molaItem}>
      <Text style={styles.date}>{item.date}</Text>
      {Object.keys(item.molalar).map((email) => (
        <View key={email}>
          <Text style={styles.email}>{email}</Text>
          {item.molalar[email].map((mola, index) => (
            <View key={index} style={styles.innerMolaItem}>
              <Text style={styles.molaText}>
                Başlangıç Zamanı: {mola.startTime.toDate().toLocaleTimeString()}
              </Text>
              <Text style={styles.molaText}>
                Mola Süresi: {mola.duration.seconds} saniye
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(molalar).map((date) => ({
          date,
          molalar: molalar[date],
        }))}
        keyExtractor={(item) => item.date}
        renderItem={renderMolaItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Mola bilgisi bulunmamaktadır.</Text>
        }
      />
      <Button
        title="Geri Dön"
        onPress={() => navigation.navigate("AdminPanel")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  molaItem: {
    marginBottom: 20,
  },
  innerMolaItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  molaText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});

export default Molalar;

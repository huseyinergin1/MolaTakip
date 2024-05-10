import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { db, auth } from "../config/firebase";
import { format } from "date-fns";

const MolalarScreen = () => {
  //SAYFALAMA
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchMolalar(user ? user.uid : null);
  }, [user]);

  useEffect(() => {
    const unsubscribe = db.collection("mola").onSnapshot((snapshot) => {
      const molalarData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      paginateMolalar(molalarData);
    });

    return () => unsubscribe();
  }, []);

  //UID İLE GİRİŞ YAPILAN HESABI SORGULAYIP KULLANICININ MOLA GEÇMİŞİNİ GÖSTERİR
  const fetchMolalar = async (userId) => {
    try {
      if (!userId) return; // USER KONTROL

      const molaRef = db
        .collection("mola")
        .where("userId", "==", userId) // USERID KARŞILAŞTIRMA
        .orderBy("startTime", "desc"); // BAŞLANGIÇ TARİHİNE GÖRE SIRALA
      const snapshot = await molaRef.get();
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      paginateMolalar(data);
    } catch (error) {
      console.error("Error fetching molalar:", error);
    }
  };
  //SAYFALAMA
  const paginateMolalar = (molalar) => {
    const pageSize = 5; // MOLA SAYISI 5.GEÇERSE ÖBÜR SAYFADA GÖSTER
    const pages = [];
    for (let i = 0; i < molalar.length; i += pageSize) {
      pages.push(molalar.slice(i, i + pageSize));
    }
    setPages(pages);
  };

  const renderMolaItem = ({ item }) => (
    <View style={styles.molaItem}>
      <Text style={styles.dateTitle}>
        {format(item.startTime.toDate(), "dd/MM/yyyy")}
      </Text>
      <Text style={styles.molaText}>
        Başlangıç Zamanı: {format(item.startTime.toDate(), "HH:mm")}
      </Text>
      <Text style={styles.molaText}>Email: {item.email}</Text>
      <Text style={styles.boldMolaText}>
        Süre: {item.duration.hours} saat {item.duration.minutes} dakika{" "}
        {item.duration.seconds} saniye
      </Text>
    </View>
  );
  //SAYFALAMA
  const renderPage = () => (
    <FlatList
      data={pages[currentPage - 1]}
      renderItem={renderMolaItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.molaListContainer}
    />
  );
  //SAYFALAMA
  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };
  //SAYFALAMA
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geçmiş Molalar</Text>
      {renderPage()}
      <View style={styles.pagination}>
        <Button
          title="<"
          onPress={handlePrevPage}
          disabled={currentPage === 1}
        />
        <Text style={styles.pageNumber}>{currentPage}</Text>
        <Button
          title=">"
          onPress={handleNextPage}
          disabled={currentPage === pages.length}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20, // Container'ın sol ve sağında boşluk ekleyelim
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  molaItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  molaText: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldMolaText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold", // Kalınlaştırma
  },
  molaListContainer: {
    flexGrow: 1,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  pageNumber: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MolalarScreen;

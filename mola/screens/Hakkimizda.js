import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AboutScreen = () => {
  // Sosyal medya platformlarının URL'leri
  const facebookURL = "https://www.facebook.com/example";
  const githubURL = "https://github.com/huseyinergin1/Mola-takip";
  const instagramURL = "https://www.instagram.com/huseyin.ai/";

  // Yönlendirme fonksiyonu
  const handleSocialMediaPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hakkımızda</Text>
      <Text style={styles.description}>
        Bu uygulama, personellerin mola zamanlarını takip etmelerine yardımcı
        olmak için tasarlanmıştır. molaTakip, personellerin mola sürelerini
        planlamalarına ve izlemelerine olanak tanır. Bu uygulama, personellerin
        çalışma yaşamlarını düzenli bir şekilde yönetmelerine yardımcı olmak
        için geliştirilmiştir.
      </Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() => handleSocialMediaPress(facebookURL)}
        >
          <Ionicons name="logo-facebook" size={30} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() => handleSocialMediaPress(githubURL)}
        >
          <Ionicons name="logo-github" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() => handleSocialMediaPress(instagramURL)}
        >
          <Ionicons name="logo-instagram" size={30} color="#E4405F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default AboutScreen;

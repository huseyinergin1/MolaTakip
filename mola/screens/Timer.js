import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { auth, db } from "../config/firebase";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  //BAŞLAT BUTONUNA TIKLAYINCA 1SN SAYAÇ BAŞLATIR
  const startTimer = () => {
    setTimerInterval(setInterval(updateTime, 1000));
  };

  // SAYACI DURDURUR
  const stopTimer = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
  };

  //SAYAÇ DEĞERLERİNİ SIFIRLAR
  const resetTimer = () => {
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    stopTimer();
  };

  // SANİYE DAKİKA SAAT HESABI
  const updateTime = () => {
    setSeconds((prevSeconds) => {
      if (prevSeconds < 59) return prevSeconds + 1;
      else {
        setMinutes((prevMinutes) => {
          if (prevMinutes < 59) return prevMinutes + 1;
          else {
            setHours((prevHours) => prevHours + 1);
            return 0;
          }
        });
        return 0;
      }
    });
  };

  //BİTİR BUTONUNA TIKLANDIĞI ZAMAN MOLA KOLEKSİYONUNA VERİLERİ KAYDEDER
  const endMola = async () => {
    if (timerInterval) stopTimer();

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Kullanıcı oturumu yok.");
        return;
      }

      const userId = user.uid;
      const email = user.email;

      await db.collection("mola").add({
        userId: userId,
        email: email,
        startTime: new Date(),
        duration: {
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        },
      });

      console.log("Mola süresi Firestore'a başarıyla eklendi!");
      resetTimer();
    } catch (error) {
      console.error("Mola süresi eklenirken bir hata oluştu: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>MOLA</Text>
      <Text style={styles.timerText}>
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startTimer}>
          <Text style={styles.buttonText}>Başlat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stopTimer}>
          <Text style={styles.buttonText}>Durdur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={endMola}>
          <Text style={styles.buttonText}>Bitir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

//STYLE KODLARI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 80,
    color: "#5c0501",
  },
  buttonContainer: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  text: {
    fontSize: 30,
    color: "#5c0501",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#5c0501",
  },
  buttonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
});

export default Timer;

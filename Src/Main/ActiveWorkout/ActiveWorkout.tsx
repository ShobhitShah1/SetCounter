import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import {
  addStepChangedListener,
  startSendingData,
  stopSendingData,
} from "expo-sample-pedometer";

import db from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { LeaderboardEntry } from "../../Types/LeaderboardEntry";

const Steps = ({
  submitForCompletion,
}: {
  submitForCompletion: (steps: number) => void;
}) => {
  const [numOfSteps, setNumOfSteps] = useState(0);

  useEffect(() => {
    const sub = addStepChangedListener(({ step }) => {
      console.log("Step:", step);
      setNumOfSteps(step);
    });
    return () => {
      stopSendingData();
      sub.remove();
    };
  }, []);

  const submit = async () => {
    submitForCompletion(numOfSteps);
  };

  return (
    <>
      <View style={styles.bottomTimer}>
        <Text style={styles.timerLabel}>Steps</Text>
        <Text style={styles.timerFont}>{numOfSteps}</Text>
      </View>
      <TouchableOpacity style={styles.buttonStyle} onPress={submit}>
        <Text style={styles.buttonText}>DONE</Text>
      </TouchableOpacity>
    </>
  );
};

export const ActiveWorkout = () => {
  const nav = useNavigation<NativeStackNavigationProp<any>>();
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });

  useEffect(() => {
    startSendingData();
  }, []);

  const saveWorkout = async (steps: number, currentUser: string) => {
    const sessionId = Date.now();

    await db().ref(`/users/${currentUser}/sessions/${sessionId}`).set({
      steps,
      time,
      date: sessionId,
    });
  };

  const updateLeaderboard = async (steps: number, currentUser: string) => {
    const user = await db().ref(`/users/${currentUser}`).once("value");
    const userName = user.val().name as string;

    const totalStepsPath = `/users/${currentUser}/leaderboard/`;
    const stepSnapshot = await db().ref(totalStepsPath).once("value");
    const totalSteps = stepSnapshot.val()?.totalSteps || 0;
    const totalStepsSum = steps + totalSteps; // Update this line

    await db().ref(totalStepsPath).update({ totalStepsSum });

    const leaderboard = await db().ref(`/leaderboard`).once("value");
    let leaderboardCopy = { ...leaderboard.val() };
    let allValues: LeaderboardEntry[] = Object.values(leaderboardCopy);

    const leaderboardIndex = allValues.findIndex(
      (value) => value.name === userName
    );

    if (leaderboardIndex > -1) {
      allValues[leaderboardIndex] = {
        steps: totalStepsSum,
        name: userName,
      };
      storeAndSave(allValues);
    } else {
      allValues.push({
        steps: totalStepsSum,
        name: userName,
      });
      storeAndSave(allValues);
    }
  };

  const storeAndSave = async (allValue: LeaderboardEntry[]) => {
    allValue.sort((a, b) => b.steps - a.steps);
    if (allValue.length > 3) {
      allValue.pop();
    }

    const newleaderboard = allValue.reduce((acc, cur, index) => {
      acc.set(index, cur);
      return acc; //cur
    }, new Map<number, LeaderboardEntry>());

    await db()
      .ref(`/`)
      .update({ leaderboard: Object.fromEntries(newleaderboard) });
  };

  const submitForCompletion = async (steps: number) => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      await saveWorkout(steps, currentUser.uid);
      await updateLeaderboard(steps, currentUser.uid);
    }
    nav.goBack();
  };

  const formatTimeString = (rawSeconds: number) => {
    const seconds = rawSeconds % 60;
    const minutes = Math.floor(rawSeconds / 60) % 60;
    const hours = Math.floor(minutes / 60) % 60;

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" />
      <View style={styles.topTimer}>
        <Text style={styles.timerLabel}>Time</Text>
        <Text style={styles.timerFont}>{formatTimeString(time)}</Text>
      </View>
      <Steps submitForCompletion={submitForCompletion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  topTimer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 10,
  },
  bottomTimer: {
    flex: 1.2,
    justifyContent: "center",
    borderTopWidth: 1,
  },
  timerFont: {
    fontSize: 70,
    textAlign: "center",
    fontWeight: "100",
  },
  timerLabel: {
    textAlign: "center",
    fontSize: 50,
    marginBottom: 10,
  },
  buttonStyle: {
    position: "absolute",
    bottom: 30,
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "purple",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

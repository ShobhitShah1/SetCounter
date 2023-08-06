import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Image,
} from "react-native";

import { FeedWorkout } from "../../Types/FeedWorkout";
// import { CTAButton } from "../../Components/CTAButton/CTAButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ListItem } from "../../Components/ListItem/ListItem";
import { StatusBar } from "expo-status-bar";
import { CTAButton } from "../../Components/CTAButton/CTAButton";
import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";
import { formatTime } from "../../Components/TimeFormat/formatTime";
import CircularProgress from "../../Components/CircularProgress";

export const Feed = () => {
  const nav = useNavigation<NativeStackNavigationProp<any>>();

  const [feed, setFeed] = useState<FeedWorkout[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [TotalSteps, setTotalSteps] = useState(0);
  const [TotalTime, setTotalTime] = useState<string>("");

  const [limit, setLimit] = useState(5);

  const onWorkoutChange = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    if (snapshot.val()) {
      const workouts: FeedWorkout[] = Object.values(snapshot.val());
      workouts.sort((a, b) => b.date - a.date);
      setFeed(workouts);
      let totalSteps = 0;
      let totalTime = 0;

      workouts.forEach((workout) => {
        totalSteps += workout.steps || 0;
        totalTime += workout.time || 0;
      });
      const formattedTime: string = formatTime(totalTime);

      console.log("Total Steps:", totalSteps);
      setTotalSteps(totalSteps);
      setTotalTime(formattedTime);
      console.log("Total Time Spent:", totalTime);
    }
  };

  useEffect(() => {
    const currentUser = auth().currentUser!;
    const refPath = `/users/${currentUser?.uid}/sessions`;
    db()
      .ref(refPath)
      .orderByKey()
      .limitToLast(limit)
      .on("value", onWorkoutChange);

    return () => db().ref(refPath).off("value", onWorkoutChange);
  }, [limit]);

  const goToWorkout = () => {
    nav.push("ActiveWorkout");
  };
 
  const onPress = async (id: number) => {
    // const currentUser = auth().currentUser!;
    // db().ref(`/users/${currentUser?.uid}/sessions/${id}`).set(null);
  };

  const renderItem = (listData: ListRenderItemInfo<FeedWorkout>) => {
    return <ListItem {...listData} onPress={onPress} />;
  };

  
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}> 
      <StatusBar backgroundColor="purple" /> 
      <FlatList
        data={feed}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />
      <View style={styles.buttonContainer}>
        <CTAButton variant="primary" title="START WALK" onPress={goToWorkout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

import React from "react";
import {
  Text,
  Animated,
  View,
  StyleSheet,
  PanResponder,
  FlatList,
} from "react-native";

function RNHorizontalPanResponderTest({
  children,
}: {
  children?: React.ReactNode;
}) {
  const panX = React.useRef(new Animated.Value(1)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log("shouldsetpanresponder dx:", gestureState.dx);
        const should =
          gestureState.dx > 40 || gestureState.dx < -40 ? true : false;
        console.log("should? ", should);
        return should;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        console.log("shouldsetpanresponder dx:", gestureState.dx);
        const should =
          gestureState.dx > 40 || gestureState.dx < -40 ? true : false;
        console.log("should? ", should);
        return should;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderRelease: () => {
        console.log("RELEASED");
      },
      onPanResponderMove: Animated.event([null, { dx: panX }], {
        useNativeDriver: false,
        listener: (event) => {
          // console.log(
          //   'event:',
          //   event.nativeEvent.identifier,
          //   event.nativeEvent.target,
          //   event.nativeEvent.timestamp,
          //   event.nativeEvent.locationX,
          //   event.nativeEvent.pageX,
          //   event.nativeEvent.changedTouches[0].pageX,
          //   event.nativeEvent.touches[0].pageX
          // )
        },
      }),
    })
  ).current;

  return (
    <Animated.View
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "blue",
        opacity: panX.interpolate({
          inputRange: [-1000, -50, 50, 1000],
          outputRange: [0, 0, 1, 1],
        }),
      }}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}

const data = [...Array(30).keys()];

function ListItem({ item }: { item: number }) {
  return (
    <View
      style={{
        margin: 12,
        backgroundColor: "white",
        padding: 12,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: "black" }}>{item}</Text>
    </View>
  );
}

export default function PanResponderWithNestedFlatlist() {
  return (
    <View style={{ flex: 1 }}>
      <RNHorizontalPanResponderTest>
        <FlatList data={data} renderItem={ListItem} />
      </RNHorizontalPanResponderTest>
    </View>
  );
}

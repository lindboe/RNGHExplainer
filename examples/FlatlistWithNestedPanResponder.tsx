import React from "react";
import { Text, Animated, View, PanResponder, FlatList } from "react-native";

const MINIMUM_DISTANCE_FOR_HORIZONTAL_PAN = 40;

function horizontalPanShouldActivate(dx: number) {
  return dx > MINIMUM_DISTANCE_FOR_HORIZONTAL_PAN ||
    dx < -MINIMUM_DISTANCE_FOR_HORIZONTAL_PAN
    ? true
    : false;
}

// Works, but horizontal panning doesn't activate super reliably, have to gesture pretty carefully

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
        return horizontalPanShouldActivate(gestureState.dx);
      },
      // can also use *Capture, doesn't matter here
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      //   console.log("shouldsetpanrespondercapture dx:", gestureState.dx);
      //   return horizontalPanShouldActivate(gestureState.dx);
      // },

      // only supported on Android
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

function ListItem({ item }: { item: { color: string } }) {
  return (
    <RNHorizontalPanResponderTest>
      <View
        style={{ flex: 1, backgroundColor: item.color, height: 200 }}
      ></View>
    </RNHorizontalPanResponderTest>
  );
}

const data = [
  { color: "blue" },
  { color: "purple" },
  { color: "red" },
  { color: "green" },
];

export default function FlatlistWithNestedPanResponder() {
  return (
    <View style={{ flex: 1, height: "100%" }}>
      <FlatList style={{ flex: 1 }} data={data} renderItem={ListItem} />
    </View>
  );
}

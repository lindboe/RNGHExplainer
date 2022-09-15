import React, { useState } from "react";
import {
  Animated,
  View,
  PanResponder,
  useWindowDimensions,
} from "react-native";

function List() {
  return (
    <View
      style={{
        marginVertical: LOWEST_SHEET_POINT,
        backgroundColor: "blue",
        height: 200,
      }}
    ></View>
  );
}

const LOWEST_SHEET_POINT = 60;
const SHEET_HEIGHT = 400;

function Sheet({ screenHeight }: { screenHeight: null | number }) {
  const panY = React.useRef(new Animated.Value(0)).current;
  const dist = screenHeight ? screenHeight - LOWEST_SHEET_POINT : 0;
  let offset = React.useRef(0).current;

  React.useEffect(() => {
    panY.addListener(({ value }) => console.log("value: ", value));
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => {
        console.log("MOVING");
        return true;
      },
      // several sources recommend this __value way of setting offset, but it
      // causes crashes for me
      // https://reactnative.dev/docs/0.68/panresponder
      // https://stackoverflow.com/questions/42014379/panresponder-snaps-animated-view-back-to-original-position-on-second-drag
      onPanResponderGrant: (event, gestureState) => {
        // panY.setOffset(panY._value);
        // prettier-ignore

        // This doesn't work because dist is always 0 when initializing; could
        // delay until we have a value?
        // console.log("Y0: ", gestureState.y0);
        // console.log(dist - gestureState.y0);
        // panY.setOffset(dist - gestureState.y0);

        console.log("animated value: ", panY._value);
        panY.setOffset(offset);
      },
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
        listener: (event) => {
          console.log("position relative to parent: ", event.nativeEvent.pageY);
          console.log(
            "position relative to gesture handler: ",
            event.nativeEvent.locationY
          );
        },
      }),
      onPanResponderRelease: (event, gestureState) => {
        console.log("PanResponder Released");
        console.log("OFFSET BEFORE: ", offset);
        offset = offset + gestureState.dy;
        console.log("OFFSET AFTER: ", offset);
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#DCDCDC",
          backgroundColor: "white",
          top: dist,
          width: "100%",
          left: 0,
          height: SHEET_HEIGHT,
          minHeight: SHEET_HEIGHT,
          maxHeight: SHEET_HEIGHT,
          flex: 0,
        },
        { transform: [{ translateY: panY }] },
      ]}
      {...panResponder.panHandlers}
    >
      <List />
    </Animated.View>
  );
}

// Pan sheet with scrolling
export default function SameDirectionNestedRN() {
  const [screenHeight, setScreenHeight] = useState<null | number>(null);
  return (
    <View
      style={{ backgroundColor: "lightGray", flex: 1, height: "100%" }}
      onLayout={(event) => setScreenHeight(event.nativeEvent.layout.height)}
    >
      <Sheet screenHeight={screenHeight} />
    </View>
  );
}

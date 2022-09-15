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
const MAX_SHEET_TRAVEL_DIST = SHEET_HEIGHT - LOWEST_SHEET_POINT;

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
      // panY.setOffset(panY._value);
      onPanResponderGrant: (event, gestureState) => {
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
        // Since gestureState.dy just tracks the touch movement, offset could
        // become larger than the maximum movement for the sheet. Check if so
        // and use maximum offset in that case.
        const newPotentialOffset = offset + gestureState.dy;
        if (newPotentialOffset > MAX_SHEET_TRAVEL_DIST) {
          offset = MAX_SHEET_TRAVEL_DIST;
        } else if (newPotentialOffset < -MAX_SHEET_TRAVEL_DIST) {
          offset = -MAX_SHEET_TRAVEL_DIST;
        } else {
          offset = offset + gestureState.dy;
        }
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
        {
          transform: [
            {
              translateY: panY.interpolate({
                inputRange: [-MAX_SHEET_TRAVEL_DIST, 0, MAX_SHEET_TRAVEL_DIST],
                outputRange: [-MAX_SHEET_TRAVEL_DIST, 0, MAX_SHEET_TRAVEL_DIST],
                extrapolate: "clamp",
              }),
            },
          ],
        },
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

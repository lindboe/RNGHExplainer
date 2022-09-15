import React, { useState } from "react";
import { Animated, View, FlatList, Text, PanResponder } from "react-native";

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
function List() {
  return (
    <FlatList
      style={{
        marginVertical: LIST_MARGIN,
        backgroundColor: "blue",
        flex: 1,
      }}
      data={data}
      renderItem={ListItem}
    ></FlatList>
  );
}

const LOWEST_SHEET_POINT = 60;
const SHEET_HEIGHT = 400;
const MAX_SHEET_TRAVEL_DIST = SHEET_HEIGHT - LOWEST_SHEET_POINT;
const LIST_MARGIN = LOWEST_SHEET_POINT;

function Sheet({ screenHeight }: { screenHeight: null | number }) {
  const panY = React.useRef(new Animated.Value(0)).current;
  const dist = screenHeight ? screenHeight - LOWEST_SHEET_POINT : 0;
  let offset = React.useRef(0).current;
  let topMarginTopCoordinate = React.useRef(0).current;
  let topMarginBottomCoordinate = React.useRef(0).current;
  let bottomMarginTopCoordinate = React.useRef(0).current;
  let bottomMarginBottomCoordinate = React.useRef(0).current;

  React.useEffect(() => {
    panY.addListener(({ value }) => console.log("value: ", value));
  }, []);

  React.useEffect(() => {
    console.log("DIST: ", dist);
    topMarginTopCoordinate = dist;
    topMarginBottomCoordinate = dist + LIST_MARGIN;
    bottomMarginBottomCoordinate = dist + SHEET_HEIGHT;
    bottomMarginTopCoordinate = dist + SHEET_HEIGHT - LIST_MARGIN;
    console.log(topMarginTopCoordinate);
  }, [screenHeight]);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => {
        console.log("MOVING", event.nativeEvent.locationY);
        // What criteria can we use to decide to pass on responder?
        // A. Bottom Sheet fully open
        // if (offset === -MAX_SHEET_TRAVEL_DIST) {
        //   console.log("BOTTOM SHEET OPEN, IGNORING");
        //   return false;
        // } else {
        //   return true;
        // }
        // Well... that lets us scroll once it's open, but we can't close the
        // sheet again!
        //
        // B. Bottom sheet fully open and touch is _not_ within component margin
        // (where scrollview is not)
        // note: pageY doesn't seem to consistenly indicate a location as far as
        // I can tell? sometimes it looks like just relative to the
        // Animated.View, but other times it doesn't match that pattern.
        // const touchLocation = event.nativeEvent.locationY;
        // const touchWithinMargins =
        //   (touchLocation < topMarginTopCoordinate - offset &&
        //     touchLocation > topMarginBottomCoordinate - offset) ||
        //   (touchLocation < bottomMarginTopCoordinate - offset &&
        //     touchLocation > bottomMarginBottomCoordinate - offset);
        // console.log(
        //   "Touch within margins? ",
        //   touchWithinMargins,
        //   touchLocation,
        //   offset,
        //   topMarginTopCoordinate,
        //   topMarginBottomCoordinate,
        //   bottomMarginTopCoordinate,
        //   bottomMarginBottomCoordinate
        // );
        // if (offset === -MAX_SHEET_TRAVEL_DIST || touchWithinMargins) {
        //   console.log("BOTTOM SHEET OPEN, IGNORING");
        //   return false;
        // } else {
        //   return true;
        // }
        // Not sure: Why can I successfully reference a new value for offset in
        // onPanResponderRelease, but referencing values here always sticks with
        // pre-screen height knowledge?

        // C. Can pan down again when scrollView is at top

        // Z. Always -- not going to work with nested gesture handlers
        // return true;
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
        console.log("NEW OFFSET: ", offset);
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

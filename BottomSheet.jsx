import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  View,
} from "react-native"

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = Dimensions.get("window")

const getMenuOffset = () => {
  if (DEVICE_HEIGHT < 750) {
    return (DEVICE_HEIGHT * 35) / 100
  }
  return (DEVICE_HEIGHT * 30) / 100
}

const getMenuHeight = () => {
  if (DEVICE_HEIGHT < 750) {
    return DEVICE_HEIGHT / 2
  }
  return DEVICE_HEIGHT / 2.3
}

export const SHEET_OFFSET = getMenuOffset()
export const SHEET_HEIGHT = getMenuHeight()

const BottomSheet = forwardRef(
  (
    {
      children,
      animation,
      handleComponent,
      indexStart = 0,
      enablePanDownToClose,
      style,
      disablePanDownChildren,
      bottomInsets = 0,
      handleStyle,
    },
    ref
  ) => {
    const finalValue = useRef(SHEET_OFFSET)

    useImperativeHandle(
      ref,
      () => {
        return {
          firstPosition: () => {
            executeAnimationTiming(SHEET_OFFSET)
            finalValue.current = SHEET_OFFSET
          },
          secondPosition: (validate) => {
            if (finalValue.current === 0 && validate) {
              executeAnimationTiming(DEVICE_HEIGHT)
              finalValue.current = DEVICE_HEIGHT
              return
            }
            executeAnimationTiming(0)
            finalValue.current = 0
          },
          close: (validate) => {
            if (finalValue.current === DEVICE_HEIGHT && validate) {
              executeAnimationTiming(SHEET_OFFSET)
              finalValue.current = 0
              return
            }
            executeAnimationTiming(DEVICE_HEIGHT)
            finalValue.current = DEVICE_HEIGHT
          },
        }
      },
      [finalValue.current]
    )

    const executeAnimationTiming = useCallback(
      (value) => {
        Animated.timing(animation, {
          toValue: value,
          useNativeDriver: true,
        }).start()
      },
      [animation]
    )

    const executeAnimationSpring = useCallback(
      (value) => {
        Animated.spring(animation, {
          toValue: value,
          friction: 6,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }).start()
      },
      [animation]
    )

    const panResponder = useMemo(() => {
      return PanResponder.create({
        onPanResponderMove: (e, gesture) => {
          if (finalValue.current === 0 && gesture.dy < 0) return
          if (finalValue.current === SHEET_OFFSET && gesture.dy > 0) return
          if (gesture.dy + SHEET_OFFSET <= 0) return

          if (gesture.dy < 0) {
            animation.setValue(gesture.dy + SHEET_OFFSET)
            return
          }

          animation.setValue(gesture.dy)
        },
        onPanResponderRelease: (e, gesture) => {
          if (gesture.dy < 0) {
            executeAnimationSpring(0)
            finalValue.current = 0
            return
          }
          if (enablePanDownToClose) {
            executeAnimationSpring(DEVICE_HEIGHT)
            finalValue.current = DEVICE_HEIGHT
            return
          }
          executeAnimationSpring(SHEET_OFFSET)
          finalValue.current = SHEET_OFFSET
        },
        onMoveShouldSetPanResponder: (e, { dx, dy }) => {
          if (Math.abs(dx) > 10) {
            return false
          }
          return Math.abs(dy) > 5
        },
      })
    }, [finalValue.current, animation])

    const sheetProps = disablePanDownChildren ? {} : panResponder.panHandlers

    useEffect(() => {
      if (indexStart < 0) {
        finalValue.current = DEVICE_HEIGHT
        return
      }
      if (indexStart === 0) {
        finalValue.current = SHEET_OFFSET
        executeAnimationSpring(SHEET_OFFSET)
        return
      }
      finalValue.current = 0
      executeAnimationSpring(0)
    }, [])

    const renderHandleComponent = () => {
      const props =
        enablePanDownToClose || !handleComponent ? panResponder.panHandlers : {}
      if (handleComponent) {
        return (
          <Animated.View
            {...props}
            style={[
              styles.sheetHandleContainer,
              {
                bottom: SHEET_HEIGHT - 15,
                transform: [{ translateY: animation }],
              },
              handleStyle,
            ]}
          >
            {handleComponent()}
          </Animated.View>
        )
      }

      return (
        <Animated.View
          {...props}
          style={[
            styles.sheetHandle,
            {
              bottom: SHEET_HEIGHT - 15,
              transform: [{ translateY: animation }],
            },
            handleStyle,
          ]}
        >
          <View style={styles.sheet} />
        </Animated.View>
      )
    }

    return (
      <View
        style={[styles.container, { marginBottom: bottomInsets }]}
        pointerEvents='box-none'
      >
        {renderHandleComponent()}
        <Animated.View
          {...sheetProps}
          style={[
            styles.content,
            { transform: [{ translateY: animation }] },
            style,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    )
  }
)
BottomSheet.displayName = "BottomSheet"

export default memo(BottomSheet)

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    bottom: 0,
    height: DEVICE_HEIGHT,
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "absolute",
    width: DEVICE_WIDTH,
    zIndex: 1,
  },
  content: {
    backgroundColor: "white",
    borderColor: "gray",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    height: SHEET_HEIGHT,
    overflow: "hidden",
    paddingTop: 15,
    paddingVertical: 15,
    width: DEVICE_WIDTH - 30,
  },
  sheet: {
    backgroundColor: "gray",
    borderRadius: 20,
    height: 5,
    width: 35,
  },
  sheetHandle: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "gray",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopWidth: 1,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    width: DEVICE_WIDTH - 30,
    zIndex: 1,
  },
  sheetHandleContainer: {
    position: "absolute",
    zIndex: 4,
  },
})

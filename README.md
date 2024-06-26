# BottomSheet

BottomSheet created for React Native.

# Compatibility

`expo-bottom-sheet` requires `react-native >= 0.73.6`

# Usage

```jsx
import BottomSheet from "expo-bottom-sheet"
import { useRef } from "react"
import {
  Animated,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native"

const { height: DEVICE_HEIGHT } = Dimensions.get("window")

export default function App() {
  const sheetRef = useRef()
  return (
    <View style={styles.container}>
      <Button
        title='firstPosition()'
        onPress={() => sheetRef.current.firstPosition()}
      />
      <Button
        title='secondPosition()'
        onPress={() => sheetRef.current.secondPosition()}
      />
      <Button title='close()' onPress={() => sheetRef.current.close()} />
      <BottomSheet
        ref={sheetRef}
        indexStart={-1}
        animation={new Animated.Value(DEVICE_HEIGHT)}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Hello World!</Text>
        </View>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
```

![Bottom Sheet](./preview.gif)

## Props

| Name | Type | Default | Note |
|------------------------------|-------------------------------|---------|---------------------------------------------------------------|
| `animation`                  | `Animated.Value()`            |         | Use the `Animated Value` of react native, the recommended value that it has to start should be the device height as shown in the example
| `children`                   | `Component`                   |         | Component to render inside the Bottom Sheet
| `handleComponent`            | `Function`                    |         | Has to return a component for it to replace the default handle component
| `indexStart`                 | `Int`                         | 0       | Number to identify in which position it will start. If you want it to start in a closed state you should assign it to -1
| `enablePanDownToClose`       | `Boolean`                     | False   | It allows to close completely the Bottom Sheet
| `style`                      | `StyleSheet`                  |         | Style for the content of the Bottom Sheet
| `handleStyle`                | `StyleSheet`                  |         | Style for the handle component
| `disablePanDownChildren`     | `Boolean`                     | False   | It disables the pan down responder for the children and it only works for the handle component, it's useful when you have to render a `FlatList` `SectionList` `ScrollView`
| `bottomInsets`               | `Int`                         | 0       | Bottom inset to be added to the bottom sheet container, usually it comes from from react-native-safe-area-context hook useSafeAreaInsets.

## Methods

| Method Name | Arguments | Note |
|------------------------------|-------------------------------|---------------------------------------------------------------|
| `firstPosition`              |                               | Opens the sheet to the first position
| `secondPosition`             | `validate: Boolean`           | Opens the sheet to the second position. Validate argument is so it validates or not to close completly the sheet if it's get executed again
| `close`                      | `validate: Boolean`           | Closes completly the sheet. Validate argument is so it validates or not to close to firstPosition if it's get executed again


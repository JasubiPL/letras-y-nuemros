import { View } from "@components/Themed";
import { useChildThemeStore } from "@stores/useChildThemeStore";
import { ImageBackground, StyleSheet, Text } from "react-native";
export default function MenuScreen() {
  const childType = useChildThemeStore((state) => state.childType);
  const bg = childType === 'girl'
    ? require(`@assets/images/backgrounds/bg-menu-girl.webp`)
    : require(`@assets/images/backgrounds/bg-menu-boy.webp`);

  return (
    <ImageBackground
      source={bg}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Menú</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
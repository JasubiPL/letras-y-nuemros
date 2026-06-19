import { OutlinedRainbowText } from "@shared/ui/OutlinedRainbowText";
import { useChildThemeStore } from "@stores/useChildThemeStore";
import { ImageBackground, View } from "react-native";


export default function LetterMenuScreen() {
  const childType = useChildThemeStore((state) => state.childType);
  const background = childType ==='girl'
    ? require("@assets/images/backgrounds/bg-letters-menu-girl.webp")
    : require("@assets/images/backgrounds/bg-letters-menu-boy.webp");

  return (
    <ImageBackground
      source={background}
      style={{ flex: 1 }}
    >
      <View>
        <OutlinedRainbowText
          text="Menú de Letras"
          accent={childType === 'boy'}
        />
      </View>
    </ImageBackground>
  );
}
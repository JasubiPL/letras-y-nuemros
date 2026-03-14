import { CARTOON_BUTTON_THEMES } from "@constants/Colors";
import React, { useCallback } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { CartoonButtonProps } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CartoonButton({
  label,
  icon,
  iconAbsolute = false,
  iconContainerStyle,
  onPress,
  color = "green",
  width = 280,
  height = 64,
  disabled = false,
  style,
}: CartoonButtonProps) {
  const theme = CARTOON_BUTTON_THEMES[color];
  const isImageIcon = React.isValidElement(icon) && icon.type === Image;
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowHeight = useSharedValue(7);

  const BORDER_W = 3;
  const RADIUS = height * 0.35;

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    scale.value = withTiming(0.97, { duration: 80 });
    translateY.value = withTiming(5, { duration: 80 });
    shadowHeight.value = withTiming(2, { duration: 80 });
  }, [disabled]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    scale.value = withSequence(
      withSpring(1.05, { damping: 5, stiffness: 350 }),
      withSpring(1, { damping: 8 })
    );
    translateY.value = withSpring(0, { damping: 8 });
    shadowHeight.value = withSpring(7, { damping: 8 });
    onPress?.();
  }, [disabled, onPress]);

  const buttonAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const shadowAnim = useAnimatedStyle(() => ({
    height: shadowHeight.value,
  }));

  return (
    <View style={[{ width, opacity: disabled ? 0.5 : 1 }, style]}>
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          {
            width,
            height,
            borderRadius: RADIUS,
            backgroundColor: theme.bg,
            borderWidth: BORDER_W,
            borderColor: theme.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            position: "relative",
            overflow: isImageIcon ? "visible" : "hidden",
          },
          buttonAnim,
        ]}
      >
        {/* Top highlight — cartoon shine */}
        <View
          style={{
            position: "absolute",
            top: 5,
            left: "12%",
            right: "12%",
            height: height * 0.18,
            borderRadius: height * 0.12,
            backgroundColor: theme.highlight,
            opacity: 0.6,
          }}
        />

        {/* Bottom inner edge */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: height * 0.18,
            backgroundColor: theme.shadow,
            opacity: 0.25,
            borderBottomLeftRadius: RADIUS - BORDER_W,
            borderBottomRightRadius: RADIUS - BORDER_W,
          }}
        />

        {icon && (
          <View
            style={[
              {
                alignItems: "center",
                justifyContent: "center",
                marginRight: iconAbsolute ? 0 : 10,
                position: iconAbsolute ? "absolute" : "relative",
              },
              iconContainerStyle,
            ]}
          >
            {typeof icon === "string" ? (
              <Text style={{ fontSize: height * 0.4, lineHeight: height * 0.5 }}>
                {icon}
              </Text>
            ) : (
              icon
            )}
          </View>
        )}

        <Text
          style={{
            fontSize: height * 0.32,
            fontWeight: "900",
            color: theme.text,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            textShadowColor: theme.border,
            textShadowOffset: { width: 1.5, height: 1.5 },
            textShadowRadius: 0,
          }}
        >
          {label}
        </Text>
      </AnimatedPressable>

      {/* Flat cartoon shadow */}
      <Animated.View
        style={[
          {
            width: width - 8,
            alignSelf: "center",
            borderRadius: RADIUS,
            backgroundColor: theme.shadow,
            borderWidth: BORDER_W,
            borderColor: theme.border,
            borderTopWidth: 0,
            marginTop: -BORDER_W,
            zIndex: -1,
          },
          shadowAnim,
        ]}
      />
    </View>
  );
}

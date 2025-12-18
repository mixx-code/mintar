// import { Colors } from '@/constans/Colors';
import { Colors } from '@/constants/theme';
import { getAccordionStyles } from '@/styles/AccordionStyle';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  // Platform,
  TouchableOpacity,
  // UIManager,
  useColorScheme,
  View
} from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

// Enable LayoutAnimation for Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

interface AccordionSectionProps {
  title?: string;
  children?: ReactNode;
  defaultExpanded?: boolean;
  animationDuration?: number;
}

export default function AccordionSection({
  title = "Rangkuman Penting",
  children,
  defaultExpanded = false,
  animationDuration = 500
}: AccordionSectionProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'dark'];
  const styles = getAccordionStyles(colors);



  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;
  const animatedOpacity = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;
  const animatedRotation = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  const toggleAccordion = () => {
    // Configure animation
    LayoutAnimation.configureNext({
      duration: animationDuration,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    // Animate values
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isExpanded ? 0 : 1,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: isExpanded ? 0 : 1,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotation, {
        toValue: isExpanded ? 0 : 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  // Handle content height measurement
  const onContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  // Set initial animated values based on defaultExpanded
  useEffect(() => {
    animatedHeight.setValue(defaultExpanded ? 1 : 0);
    animatedOpacity.setValue(defaultExpanded ? 1 : 0);
    animatedRotation.setValue(defaultExpanded ? 1 : 0);
  }, [animatedHeight, animatedOpacity, animatedRotation, defaultExpanded]);

  // Interpolate values for animations
  const heightInterpolation = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const rotationInterpolation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        onPress={toggleAccordion}
        style={styles.header}
        activeOpacity={0.7}
      >
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>

        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ rotate: rotationInterpolation }] }
          ]}
        >
          <ThemedText style={styles.icon}>▼</ThemedText>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.animatedContent,
          {
            height: heightInterpolation,
            opacity: animatedOpacity,
          }
        ]}
        pointerEvents={isExpanded ? 'auto' : 'none'}
      >
        <View
          style={styles.content}
          onLayout={onContentLayout}
        >
          {children}
        </View>
      </Animated.View>
    </ThemedView>
  );
}

import { Colors } from '@/constants/theme';
import { getAccordionStyles } from '@/styles/AccordionStyle';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { ThemedText } from './themed-text';

interface AccordionSectionProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  defaultExpanded?: boolean;
  animationDuration?: number;
  iconName?: string;
  variant?: 'default' | 'important' | 'tip' | 'exercise' | 'summary';
  showProgressIndicator?: boolean;
  progressPercentage?: number;
}

export default function AccordionSection({
  title = "Rangkuman Penting",
  subtitle,
  children,
  defaultExpanded = false,
  animationDuration = 400,
  iconName,
  variant = 'default',
  showProgressIndicator = false,
  progressPercentage = 0,
}: AccordionSectionProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'dark'];
  const styles = getAccordionStyles(colors, variant);

  // Penentuan warna ikon dan aksen berdasarkan variant dan tema baru
  const getVariantColor = () => {
    switch (variant) {
      case 'important': return colors.status.error;
      case 'tip': return colors.status.warning;
      case 'exercise': return colors.gradientPrimaryStart; // Electric Purple/Pink
      case 'summary': return colors.gradientTertiaryStart; // Cyber Teal
      default: return colors.tint;
    }
  };

  const accentColor = getVariantColor();

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);

  const animatedHeight = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;
  const animatedOpacity = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;
  const animatedRotation = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;

  const triggerHaptic = async () => {
    if (Platform.OS === 'ios') {
      try {
        const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
        ReactNativeHapticFeedback.default?.trigger?.('impactLight');
      } catch (error) {
        console.log('Haptic feedback tidak tersedia');
      }
    }
  };

  const toggleAccordion = () => {
    triggerHaptic();

    Animated.sequence([
      Animated.timing(animatedScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start();

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

    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isExpanded ? 0 : 1,
        duration: animationDuration,
        useNativeDriver: false,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }),
      Animated.timing(animatedOpacity, {
        toValue: isExpanded ? 0 : 1,
        duration: animationDuration - 100,
        useNativeDriver: false,
        easing: Easing.ease,
      }),
      Animated.spring(animatedRotation, {
        toValue: isExpanded ? 0 : 1,
        useNativeDriver: true,
        tension: 60,
        friction: 7,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  const onContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  useEffect(() => {
    animatedHeight.setValue(defaultExpanded ? 1 : 0);
    animatedOpacity.setValue(defaultExpanded ? 1 : 0);
    animatedRotation.setValue(defaultExpanded ? 1 : 0);
  }, [defaultExpanded]);

  const heightInterpolation = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const rotationInterpolation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const getVariantIcon = () => {
    const iconSize = 20;
    switch (variant) {
      case 'important':
        return <Feather name="alert-triangle" size={iconSize} color={accentColor} />;
      case 'tip':
        return <MaterialIcons name="lightbulb" size={iconSize} color={accentColor} />;
      case 'exercise':
        return <Feather name="edit-3" size={iconSize} color={accentColor} />;
      case 'summary':
        return <Feather name="book-open" size={iconSize} color={accentColor} />;
      default:
        return iconName ?
          <MaterialIcons name={iconName as any} size={iconSize} color={accentColor} /> :
          <Feather name="layers" size={iconSize} color={accentColor} />;
    }
  };

  const getVariantLabel = () => {
    switch (variant) {
      case 'important': return 'Penting';
      case 'tip': return 'Tips';
      case 'exercise': return 'Latihan';
      case 'summary': return 'Rangkuman';
      default: return '';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: animatedScale }],
          backgroundColor: colors.cardBackground, // Mengikuti tema
          borderColor: isExpanded ? accentColor : 'transparent', // Highlight saat terbuka
          borderWidth: 1,
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 12,
        }
      ]}
    >
      <TouchableOpacity
        onPress={toggleAccordion}
        style={[styles.header, { paddingVertical: 16, paddingHorizontal: 16 }]}
        activeOpacity={0.8}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View style={[styles.iconLabelContainer, { marginBottom: 6 }]}>
              {getVariantIcon()}
              {getVariantLabel() !== '' && (
                <View style={[
                  styles.variantLabel,
                  { backgroundColor: `${accentColor}20`, borderRadius: 6, paddingHorizontal: 8 }
                ]}>
                  <ThemedText style={[styles.variantLabelText, { color: accentColor, fontWeight: '700', fontSize: 11 }]}>
                    {getVariantLabel().toUpperCase()}
                  </ThemedText>
                </View>
              )}
            </View>

            <ThemedText
              type="subtitle"
              style={[styles.title, { color: colors.text, fontWeight: '800' }]}
              numberOfLines={2}
            >
              {title}
            </ThemedText>

            {subtitle && (
              <ThemedText
                style={[styles.subtitle, { color: colors.icon, fontSize: 13, marginTop: 2 }]}
                numberOfLines={1}
              >
                {subtitle}
              </ThemedText>
            )}
          </View>

          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ rotate: rotationInterpolation }] }
            ]}
          >
            <Feather name="chevron-down" size={22} color={colors.icon} />
          </Animated.View>
        </View>

        {showProgressIndicator && (
          <View style={[styles.progressContainer, { marginTop: 12 }]}>
            <View style={[styles.progressBackground, { backgroundColor: scheme === 'dark' ? '#334155' : '#E2E8F0', height: 6, borderRadius: 3 }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: accentColor, // Warna progress mengikuti variant
                    height: '100%',
                    borderRadius: 3
                  }
                ]}
              />
            </View>
            <ThemedText style={[styles.progressText, { color: colors.icon, fontSize: 11, marginTop: 4 }]}>
              {progressPercentage}% selesai
            </ThemedText>
          </View>
        )}
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
          style={[styles.content, { paddingHorizontal: 16, paddingBottom: 16 }]}
          onLayout={onContentLayout}
        >
          <View style={[styles.contentDivider, { height: 1, backgroundColor: colors.icon, opacity: 0.1, marginVertical: 8 }]} />
          {children}
        </View>
      </Animated.View>
    </Animated.View>
  );
}
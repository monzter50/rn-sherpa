/**
 * Sherpa Demo App
 * Demonstrates the usage of Sherpa tour library
 *
 * @format
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ScrollView,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  TourProvider,
  TourOverlay,
  useTour,
  useStepRef,
  type TourConfig,
} from '@sherpa/core';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Define tour configuration
  const tourConfig: TourConfig = {
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Sherpa! 🧭',
        text: 'Let me show you around this app. Tap "Next" to continue.',
        popoverPosition: 'center',
      },
      {
        id: 'header',
        title: 'App Header',
        text: 'This is your main navigation area where you can find important actions.',
        popoverPosition: 'bottom',
      },
      {
        id: 'feature1',
        title: 'Feature Cards',
        text: 'These cards represent different features of your app. Tap them to explore!',
        popoverPosition: 'bottom',
        padding: 12,
        borderRadius: 12,
      },
      {
        id: 'settings',
        title: 'Settings',
        text: 'Access your app settings and preferences here.',
        popoverPosition: 'top',
        padding: 8,
        borderRadius: 8,
      },
    ],
    showButtons: true,
    showProgress: true,
    allowClose: true,
    animate: true,
    overlayColor: 'rgba(0, 0, 0, 0.75)',
    onStart: () => console.log('Tour started'),
    onComplete: () => console.log('Tour completed'),
    onSkip: () => console.log('Tour skipped'),
  };

  return (
    <TourProvider config={tourConfig}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
        <TourOverlay config={tourConfig} />
      </SafeAreaProvider>
    </TourProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const tour = useTour();

  // Create refs for tour steps
  const headerRef = useStepRef<View>();
  const feature1Ref = useStepRef<View>();
  const settingsRef = useStepRef<View>();

  // Assign refs to tour steps
  React.useEffect(() => {
    if (tour.currentStep) {
      switch (tour.currentStep.id) {
        case 'header':
          tour.currentStep.ref = headerRef;
          break;
        case 'feature1':
          tour.currentStep.ref = feature1Ref;
          break;
        case 'settings':
          tour.currentStep.ref = settingsRef;
          break;
      }
    }
  }, [tour.currentStep, headerRef, feature1Ref, settingsRef]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: safeAreaInsets.top },
        ]}
      >
        {/* Header */}
        <View ref={headerRef} style={styles.header}>
          <Text style={styles.headerTitle}>Sherpa Demo</Text>
          <Text style={styles.headerSubtitle}>Interactive Product Tours</Text>
        </View>

        {/* Start Tour Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={tour.start}
          disabled={tour.isActive}
        >
          <Text style={styles.startButtonText}>
            {tour.isActive ? 'Tour in Progress...' : '🧭 Start Tour'}
          </Text>
        </TouchableOpacity>

        {/* Feature Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View ref={feature1Ref} style={styles.card}>
            <Text style={styles.cardIcon}>🎯</Text>
            <Text style={styles.cardTitle}>Precise Targeting</Text>
            <Text style={styles.cardDescription}>
              Highlight any component in your app with pixel-perfect precision
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>🎨</Text>
            <Text style={styles.cardTitle}>Fully Customizable</Text>
            <Text style={styles.cardDescription}>
              Customize colors, positions, and styles to match your brand
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>⚡</Text>
            <Text style={styles.cardTitle}>Lightweight</Text>
            <Text style={styles.cardDescription}>
              Zero dependencies, pure React Native implementation
            </Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity ref={settingsRef} style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  startButton: {
    backgroundColor: '#28a745',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  settingsButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default App;

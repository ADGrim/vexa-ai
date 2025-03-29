import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ProfileDropdown } from '../index';

/**
 * Example component demonstrating the ProfileDropdown usage
 */
export default function ProfileDropdownExample() {
  const [voiceMode, setVoiceMode] = useState(false);
  
  const handleSettingsPress = () => {
    Alert.alert('Settings', 'Settings panel would open here');
  };
  
  const handleVoiceModePress = () => {
    setVoiceMode(!voiceMode);
    Alert.alert('Voice Mode', `Voice mode ${!voiceMode ? 'enabled' : 'disabled'}`);
  };
  
  const handleLogoutPress = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => Alert.alert('Logged Out', 'User logged out successfully') }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vexa Mobile Interface</Text>
      
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Voice Mode: {voiceMode ? 'ON' : 'OFF'}
        </Text>
      </View>
      
      <ProfileDropdown 
        userName="John Doe"
        onSettingsPress={handleSettingsPress}
        onVoiceModePress={handleVoiceModePress}
        onLogoutPress={handleLogoutPress}
      />
      
      <View style={styles.content}>
        <Text style={styles.contentText}>
          This example demonstrates how to use the ProfileDropdown component 
          with custom handlers for settings, voice mode, and logout actions.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  title: {
    color: '#a855f7',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 120,
    marginBottom: 20,
  },
  statusBar: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  statusText: {
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
});
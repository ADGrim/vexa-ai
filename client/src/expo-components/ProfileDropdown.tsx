import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';

interface ProfileDropdownProps {
  userName?: string;
  onSettingsPress?: () => void;
  onVoiceModePress?: () => void;
  onLogoutPress?: () => void;
  profileImage?: any; // Can be require('../assets/profile.png') or { uri: 'https://...' }
}

/**
 * A dropdown profile menu component for the Vexa mobile interface
 * Displays user profile image and provides access to settings, voice mode, and logout
 */
export default function ProfileDropdown({
  userName = "Vexa AI",
  onSettingsPress = () => {},
  onVoiceModePress = () => {},
  onLogoutPress = () => {},
  profileImage
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const defaultImage = require('./assets/profile-placeholder.png');

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.avatar}>
        <Image source={profileImage || defaultImage} style={styles.img} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={() => setOpen(false)}
          activeOpacity={1} // This ensures the opacity doesn't change on press
        >
          <View style={styles.panel}>
            <Text style={styles.name}>{userName}</Text>
            
            <TouchableOpacity 
              onPress={() => {
                onSettingsPress();
                setOpen(false);
              }}
            >
              <Text style={styles.option}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                onVoiceModePress();
                setOpen(false);
              }}
            >
              <Text style={styles.option}>Voice Mode</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                onLogoutPress();
                setOpen(false);
              }}
            >
              <Text style={styles.option}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 99,
    elevation: 5, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  img: { 
    width: 40, 
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'flex-start',
    paddingTop: 90,
  },
  panel: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  name: { 
    color: '#fff', 
    fontSize: 18, 
    marginBottom: 12,
    fontWeight: 'bold',
  },
  option: { 
    color: '#a855f7', 
    fontSize: 16, 
    marginVertical: 8,
    paddingVertical: 4,
  },
});
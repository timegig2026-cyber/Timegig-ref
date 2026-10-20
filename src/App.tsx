import React, { useState, useCallback, useEffect } from 'react';
import { AuthModal } from './components/AuthModal';
import { MapView } from './components/MapView';
import { BottomNavBar } from './components/BottomNavBar';
import { TopFloatingHeader } from './components/TopFloatingHeader';
import { GigsModal } from './components/GigsModal';
import { ProfileModal } from './components/ProfileModal';
import { ActivationModal } from './components/ActivationModal';
import { TenantPortalModal } from './components/TenantPortalModal';
import { SeekersModal } from './components/SeekersModal';
import { MapTileStyle, UserLocation, UserProfileData } from './types';
import { reverseGeocodeLocation } from './utils/geo';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function App() {
  const [tileStyle, setTileStyle] = useState<MapTileStyle>('standard');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const [isTenantUnlocked, setIsTenantUnlocked] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    firstName: '',
    lastName: '',
    selfieUrl: null,
    location: '',
    phone: '',
    email: '',
    trades: [],
    socialLinks: [],
    isLocked: false,
  });

  const [isGigsModalOpen, setIsGigsModalOpen] = useState(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [isSeekersModalOpen, setIsSeekersModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Default to false, handle via auth state

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      sessionStorage.setItem('referralCode', refCode);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthModalOpen(false);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            selfieUrl: data.selfieUrl || null,
            location: data.location || '',
            phone: data.phone || '',
            email: data.email || '',
            trades: data.trades || [],
            socialLinks: data.socialLinks || [],
            isLocked: data.isLocked || false,
          });
        }
      } else {
        setIsAuthModalOpen(true);
      }
    });
    return unsubscribe;
  }, []);

  // Request live device GPS location and reverse geocode on startup
  const requestDeviceLocation = useCallback((isUserInitiated = false) => {
    if (!('geolocation' in navigator)) {
      if (isUserInitiated) alert('Geolocation is not supported by your browser');
      setUserLocation({
        lat: 37.7749,
        lng: -122.4194,
        accuracy: 30,
        heading: null,
        speed: null,
        timestamp: Date.now(),
        isSimulated: true,
        address: 'Default Map Location',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        let placeName = 'Your Live Location';
        try {
          placeName = await reverseGeocodeLocation(latitude, longitude);
        } catch {
          // fallback
        }
        const newLocation: UserLocation = {
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 20,
          heading: null,
          speed: null,
          timestamp: position.timestamp,
          isSimulated: false,
          address: placeName,
        };
        setUserLocation(newLocation);
        setLocationError(null);
        setIsLocating(false);
        setRecenterTrigger((prev) => prev + 1);

        // Pre-fill profile location if empty
        setUserProfile((prev) => {
          if (!prev.location && placeName) {
            return { ...prev, location: placeName };
          }
          return prev;
        });
      },
      () => {
        setIsLocating(false);
        if (isUserInitiated) {
          alert('Unable to retrieve your live GPS location. Please check browser permissions.');
        } else {
          setUserLocation({
            lat: 37.7749,
            lng: -122.4194,
            accuracy: 30,
            heading: null,
            speed: null,
            timestamp: Date.now(),
            isSimulated: true,
            address: 'Default Map Location',
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    requestDeviceLocation(false);
  }, [requestDeviceLocation]);

  // Handle selecting search coordinate from top search bar
  const handleSelectSearchCoordinate = (lat: number, lng: number, label: string) => {
    const updatedLocation: UserLocation = {
      lat,
      lng,
      accuracy: 30,
      heading: null,
      speed: null,
      timestamp: Date.now(),
      isSimulated: true,
      address: label,
    };
    setUserLocation(updatedLocation);
    setLocationError(null);
    setRecenterTrigger((prev) => prev + 1);
  };

  const handleOpenTenant = () => {
    if (!isTenantUnlocked) {
      alert("🔒 The Tenant Portal is locked. Please activate the 'Become a Tenant' subscription (R299.99/mo) to unlock passive income & full portal access.");
      setIsActivationModalOpen(true);
    } else {
      setIsTenantModalOpen(true);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* 1. Map View */}
      <MapView
        userLocation={userLocation}
        gigs={[]}
        selectedGig={null}
        onSelectGig={() => {}}
        tileStyle={tileStyle}
        recenterTrigger={recenterTrigger}
        hasUserCreatedGig={false}
        selfieUrl={userProfile.selfieUrl}
      />

      {/* 2. Top Floating Header with Search Bar & Satellite Toggle */}
      <TopFloatingHeader
        userLocation={userLocation}
        locationError={locationError}
        isLocating={isLocating}
        onRequestLocation={() => requestDeviceLocation(true)}
        onRecenter={() => requestDeviceLocation(true)}
        tileStyle={tileStyle}
        onChangeTileStyle={setTileStyle}
        onSelectSearchCoordinate={handleSelectSearchCoordinate}
        onOpenPresetModal={() => {}}
      />

      {/* 3. Docked 3D Bottom Menu Bar with Activation, Seekers, GiGs, Tenant (Locked/Unlocked), Profile */}
      <BottomNavBar
        onOpenActivation={() => setIsActivationModalOpen(true)}
        onOpenSeekers={() => setIsSeekersModalOpen(true)}
        onOpenGigs={() => setIsGigsModalOpen(true)}
        onOpenTenant={handleOpenTenant}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isTenantUnlocked={isTenantUnlocked}
        selfieUrl={userProfile.selfieUrl}
      />

      {/* 4. Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => setIsAuthModalOpen(false)}
      />

      <GigsModal
        isOpen={isGigsModalOpen}
        onClose={() => setIsGigsModalOpen(false)}
      />

      <ActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        onSelfieUploaded={(selfieUrl) => setUserProfile((prev) => ({ ...prev, selfieUrl }))}
        onActivateSubscription={(plan) => {
          if (plan === 'tenant') {
            setIsTenantUnlocked(true);
            setIsTenantModalOpen(true);
          }
        }}
      />

      <SeekersModal
        isOpen={isSeekersModalOpen}
        onClose={() => setIsSeekersModalOpen(false)}
      />

      {/* 5. Full-Screen Tenant Feature with Dedicated Bottom Menu Bar */}
      <TenantPortalModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        userLocation={userLocation}
        selfieUrl={userProfile.selfieUrl}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userLocation={userLocation}
        profile={userProfile}
        onSaveProfile={async (updated) => {
          if (auth.currentUser) {
            await setDoc(doc(db, 'users', auth.currentUser.uid), updated);
            setUserProfile(updated);
          }
        }}
        onAutoSetLocation={() => requestDeviceLocation(true)}
      />
    </main>
  );
}

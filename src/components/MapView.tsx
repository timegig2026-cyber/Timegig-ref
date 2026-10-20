import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Plus, Minus } from 'lucide-react';
import { Gig, MapTileStyle, UserLocation, ActiveNavigation } from '../types';

interface MapViewProps {
  userLocation: UserLocation | null;
  gigs: Gig[];
  selectedGig: Gig | null;
  onSelectGig: (gig: Gig) => void;
  tileStyle: MapTileStyle;
  onMapClick?: (lat: number, lng: number) => void;
  recenterTrigger: number;
  hasUserCreatedGig?: boolean;
  onUserMarkerClick?: () => void;
  activeNavigation?: ActiveNavigation | null;
  selfieUrl?: string | null;
}

const TILE_URLS: Record<MapTileStyle, { url: string; subdomains?: string[] }> = {
  standard: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
};

export const MapView: React.FC<MapViewProps> = ({
  userLocation,
  gigs,
  selectedGig,
  onSelectGig,
  tileStyle,
  onMapClick,
  recenterTrigger,
  hasUserCreatedGig = false,
  onUserMarkerClick,
  activeNavigation,
  selfieUrl,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const gigMarkersGroupRef = useRef<L.LayerGroup | null>(null);
  const navigationRouteRef = useRef<L.Polyline | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = userLocation?.lat ?? 37.7749;
    const initialLng = userLocation?.lng ?? -122.4194;
    const initialZoom = 14;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
      tapTolerance: 15,
    });

    const tileConfig = TILE_URLS[tileStyle];
    const tiles = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      subdomains: tileConfig.subdomains ?? 'abc',
      attribution: '',
    }).addTo(map);

    tileLayerRef.current = tiles;

    const gigLayerGroup = L.layerGroup().addTo(map);
    gigMarkersGroupRef.current = gigLayerGroup;

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile style when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = TILE_URLS[tileStyle];
    const newTiles = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      subdomains: tileConfig.subdomains ?? 'abc',
      attribution: '',
    }).addTo(map);

    tileLayerRef.current = newTiles;
  }, [tileStyle]);

  // Handle User Profile Picture Logo Marker (turns GREEN when a gig is created)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    const latLng = L.latLng(userLocation.lat, userLocation.lng);

    // Dynamic styling: Turns Green when gig is created, Blue otherwise
    const ringColor = hasUserCreatedGig ? '#10b981' : '#3b82f6';
    const glowClass = hasUserCreatedGig
      ? 'border-emerald-400 bg-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.9)] ring-4 ring-emerald-300/50'
      : 'border-white bg-blue-600 shadow-xl ring-2 ring-blue-500/40';

    const statusBadge = hasUserCreatedGig
      ? `<span style="background: #10b981; color: #ffffff;" class="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">GiG Active</span>`
      : `<span style="background: #0f172a; color: #ffffff;" class="px-1.5 py-0.2 rounded-full text-[9px] font-bold shadow-md">You</span>`;

    const avatarContent = selfieUrl
      ? `<img src="${selfieUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="Selfie" />`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="${ringColor}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
           <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
           <circle cx="12" cy="7" r="4"/>
         </svg>`;

    const userProfileIcon = L.divIcon({
      className: 'user-profile-logo-marker',
      html: `
        <div style="cursor: pointer; transform: translate(-50%, -50%);" class="flex flex-col items-center group">
          <div style="width: 44px; height: 44px; border-radius: 50%;" class="border-3 flex items-center justify-center transition-all duration-300 relative ${glowClass}">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: #ffffff;" class="flex items-center justify-center text-slate-900 shadow-inner overflow-hidden">
              ${avatarContent}
            </div>
            ${hasUserCreatedGig ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full border-2 border-white animate-ping"></span>' : ''}
          </div>
          <div class="mt-1">${statusBadge}</div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    if (!userMarkerRef.current) {
      const marker = L.marker(latLng, {
        icon: userProfileIcon,
        zIndexOffset: 1200,
      }).addTo(map);

      marker.on('click', () => {
        if (onUserMarkerClick) {
          onUserMarkerClick();
        }
      });

      userMarkerRef.current = marker;
    } else {
      userMarkerRef.current.setLatLng(latLng);
      userMarkerRef.current.setIcon(userProfileIcon);
    }
  }, [userLocation, hasUserCreatedGig, onUserMarkerClick, selfieUrl]);

  // Handle active navigation route drawing on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing navigation layers if navigation was cancelled/completed
    if (!activeNavigation) {
      if (navigationRouteRef.current) {
        map.removeLayer(navigationRouteRef.current);
        navigationRouteRef.current = null;
      }
      if (destinationMarkerRef.current) {
        map.removeLayer(destinationMarkerRef.current);
        destinationMarkerRef.current = null;
      }
      return;
    }

    const start: L.LatLngTuple = [activeNavigation.startLat, activeNavigation.startLng];
    const end: L.LatLngTuple = [activeNavigation.destinationLat, activeNavigation.destinationLng];

    // Create a realistic curved route midpoint
    const midLat = (start[0] + end[0]) / 2 + 0.0015;
    const midLng = (start[1] + end[1]) / 2 - 0.0015;
    const latlngs: L.LatLngTuple[] = [start, [midLat, midLng], end];

    if (!navigationRouteRef.current) {
      const routePolyline = L.polyline(latlngs, {
        color: '#10b981',
        weight: 6,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round',
      }).addTo(map);
      navigationRouteRef.current = routePolyline;
    } else {
      navigationRouteRef.current.setLatLngs(latlngs);
    }

    // Destination Pin marker
    if (!destinationMarkerRef.current) {
      const destIcon = L.divIcon({
        className: 'destination-flag-marker',
        html: `
          <div style="transform: translate(-50%, -100%);" class="flex flex-col items-center">
            <div style="background-color: #ef4444; border: 3px solid #ffffff; width: 34px; height: 34px; border-radius: 50%; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.7); display: flex; align-items: center; justify-content: center; color: white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" x2="4" y1="22" y2="15"/>
              </svg>
            </div>
            <div class="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold shadow-md mt-1 whitespace-nowrap">
              ${activeNavigation.destinationName}
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const destMarker = L.marker(end, {
        icon: destIcon,
        zIndexOffset: 1500,
      }).addTo(map);

      destinationMarkerRef.current = destMarker;
    } else {
      destinationMarkerRef.current.setLatLng(end);
    }

    // Zoom and pan to fit the entire route
    const bounds = L.latLngBounds([start, end]);
    map.fitBounds(bounds, { padding: [100, 100], maxZoom: 16 });
  }, [activeNavigation]);

  // Handle manual recenter or initial location fix request
  useEffect(() => {
    if (!userLocation || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 16, {
      duration: 1.5,
    });
  }, [recenterTrigger, userLocation?.lat, userLocation?.lng]);

  // Focus on selected gig
  useEffect(() => {
    if (!selectedGig || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedGig.lat, selectedGig.lng], 16, {
      duration: 1,
    });
  }, [selectedGig]);

  // Render Gig Markers on Map
  useEffect(() => {
    const layerGroup = gigMarkersGroupRef.current;
    if (!layerGroup || !mapInstanceRef.current) return;

    layerGroup.clearLayers();

    gigs.forEach((gig) => {
      const isSelected = selectedGig?.id === gig.id;
      const rateLabel = gig.payType === 'hourly' ? `R${gig.payRate}/h` : `R${gig.payRate}`;

      const categoryColor =
        gig.category === 'errands'
          ? '#f59e0b'
          : gig.category === 'cleaning'
          ? '#06b6d4'
          : gig.category === 'yard_work'
          ? '#10b981'
          : gig.category === 'pet_care'
          ? '#a855f7'
          : gig.category === 'delivery'
          ? '#f97316'
          : '#3b82f6';

      const customIcon = L.divIcon({
        className: 'gig-map-pin',
        html: `
          <div style="cursor: pointer; transform: translate(-50%, -100%);" class="flex flex-col items-center">
            <div style="background-color: ${isSelected ? '#ffffff' : '#0f172a'}; border: 2.5px solid ${categoryColor}; color: ${isSelected ? '#0f172a' : '#f8fafc'};" 
                 class="px-2.5 py-1 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5 whitespace-nowrap transition-transform duration-200 hover:scale-105">
              <span style="background-color: ${categoryColor};" class="w-2 h-2 rounded-full inline-block"></span>
              <span>${rateLabel}</span>
              ${gig.isUrgent ? '<span class="text-[9px] bg-red-500/20 text-red-400 px-1 rounded uppercase tracking-wider font-extrabold">Hot</span>' : ''}
            </div>
            <div style="border-top-color: ${categoryColor};" class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] -mt-[1px]"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([gig.lat, gig.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 500 : 100,
      });

      marker.on('click', () => {
        onSelectGig(gig);
      });

      layerGroup.addLayer(marker);
    });
  }, [gigs, selectedGig, onSelectGig]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" tabIndex={0} />

      {/* Floating Map Zoom Feature Controls */}
      <div 
        aria-label="Map Zoom Controls"
        className="absolute right-4 bottom-40 z-20 flex flex-col gap-2 pointer-events-auto shadow-2xl"
      >
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          aria-label="Zoom In"
          title="Zoom In"
          className="w-11 h-11 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          aria-label="Zoom Out"
          title="Zoom Out"
          className="w-11 h-11 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

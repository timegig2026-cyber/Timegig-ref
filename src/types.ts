export type GigCategory = 
  | 'errands'
  | 'cleaning'
  | 'yard_work'
  | 'pet_care'
  | 'delivery'
  | 'labor'
  | 'creative'
  | 'tech'
  | 'events'
  | 'education';

export interface Gig {
  id: string;
  title: string;
  category: GigCategory;
  categoryLabel: string;
  payRate: number;
  payType: 'hourly' | 'fixed';
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  posterName: string;
  posterAvatar?: string;
  posterRating: number;
  isUrgent?: boolean;
  isImmediate?: boolean;
  scheduledTime?: string;
  timeEstimate?: string;
  postedAgo: string;
  tags: string[];
  isOwner?: boolean;
  status?: 'open' | 'pending' | 'in_progress' | 'completed';
}

export interface ActiveNavigation {
  gigId: string;
  gigTitle: string;
  payRate: number;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  startLat: number;
  startLng: number;
  distanceKm: number;
  etaMinutes: number;
  isOwner: boolean;
  status: 'navigating' | 'completed';
  steps: string[];
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
  isSimulated?: boolean;
  address?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface UserProfileData {
  firstName: string;
  lastName: string;
  selfieUrl: string | null;
  location: string;
  phone: string;
  email: string;
  trades: string[];
  socialLinks: SocialLink[];
  isLocked: boolean;
  subscriptionStatus?: 'active' | 'overdue' | 'inactive';
  subscriptionExpiry?: string;
}

export type NavigationTab = 'map' | 'saved' | 'gigs' | 'messages' | 'profile';

export type MapTileStyle = 'standard' | 'satellite';

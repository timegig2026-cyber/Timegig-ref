import { Gig } from '../types';

export const BASE_GIG_TEMPLATES = [
  {
    title: 'Queue Standing & Spot Saving at Home Affairs',
    category: 'errands' as const,
    categoryLabel: 'Errands & Queues',
    payRate: 150,
    payType: 'fixed' as const,
    description: 'Need someone to stand in the queue at Home Affairs from 7:00 AM to hold my spot until I arrive at 9:00 AM.',
    locationName: 'Home Affairs Branch',
    offsetKm: [0.003, 0.004],
    posterName: 'Thabo Mokoena',
    posterRating: 4.9,
    isUrgent: true,
    isImmediate: true,
    scheduledTime: 'Immediate (ASAP)',
    timeEstimate: '2 hours',
    postedAgo: '10m ago',
    tags: ['Queue Standing', 'Errands', 'ASAP']
  },
  {
    title: 'Grocery Run & Delivery from Woolworths',
    category: 'delivery' as const,
    categoryLabel: 'Shopping & Delivery',
    payRate: 120,
    payType: 'fixed' as const,
    description: 'Pick up a small bag of groceries (bread, milk, fresh fruit) from Woolworths and deliver to apartment building on 4th floor.',
    locationName: 'Local Shopping Centre',
    offsetKm: [-0.005, 0.006],
    posterName: 'Chantal van der Merwe',
    posterRating: 5.0,
    isUrgent: false,
    isImmediate: false,
    scheduledTime: 'Tomorrow at 10:00 AM',
    timeEstimate: '45 mins',
    postedAgo: '30m ago',
    tags: ['Shopping', 'Grocery', 'Delivery']
  },
  {
    title: 'Lawn Mowing & Garden Refuse Cleanup',
    category: 'yard_work' as const,
    categoryLabel: 'Yard & Garden',
    payRate: 350,
    payType: 'fixed' as const,
    description: 'Mow front and back lawn and rake up autumn leaves into bags. Mower and rake provided on site.',
    locationName: 'Suburban Residential House',
    offsetKm: [0.007, -0.005],
    posterName: 'Pieter Botha',
    posterRating: 4.8,
    isUrgent: false,
    isImmediate: false,
    scheduledTime: 'Saturday at 9:00 AM',
    timeEstimate: '3 hours',
    postedAgo: '1h ago',
    tags: ['Gardening', 'Lawn Mowing', 'Outdoor']
  },
  {
    title: 'Friendly Dog Walking - Boab & Luna',
    category: 'pet_care' as const,
    categoryLabel: 'Pet Care',
    payRate: 90,
    payType: 'hourly' as const,
    description: 'Walk two energetic rescue dogs around the neighborhood park for 45 minutes.',
    locationName: 'Park Entrance Gate',
    offsetKm: [-0.006, -0.007],
    posterName: 'Naledi Khumalo',
    posterRating: 4.9,
    isUrgent: true,
    isImmediate: true,
    scheduledTime: 'Immediate (ASAP)',
    timeEstimate: '45 mins',
    postedAgo: '20m ago',
    tags: ['Dog Walking', 'Pets', 'ASAP']
  },
  {
    title: 'Deep House Cleaning - 2 Bedroom Apartment',
    category: 'cleaning' as const,
    categoryLabel: 'House Cleaning',
    payRate: 450,
    payType: 'fixed' as const,
    description: 'General house cleaning including floors, dusting, kitchen counters, and bathroom sanitizing.',
    locationName: 'City Centre Apartments',
    offsetKm: [0.008, 0.009],
    posterName: 'Zola Dlamini',
    posterRating: 4.7,
    isUrgent: false,
    isImmediate: false,
    scheduledTime: 'Friday at 8:30 AM',
    timeEstimate: '4 hours',
    postedAgo: '3h ago',
    tags: ['Cleaning', 'Housekeeping']
  },
  {
    title: 'Help Unpack Furniture & Assemble Bookshelf',
    category: 'labor' as const,
    categoryLabel: 'Labor & Assembly',
    payRate: 200,
    payType: 'hourly' as const,
    description: 'Unbox flatpack wooden bookshelf and assemble using provided Allen wrench and screwdriver.',
    locationName: 'Residential Estate',
    offsetKm: [-0.009, 0.003],
    posterName: 'Liam Smith',
    posterRating: 4.6,
    isUrgent: false,
    isImmediate: true,
    scheduledTime: 'Immediate (ASAP)',
    timeEstimate: '2 hours',
    postedAgo: '45m ago',
    tags: ['Assembly', 'Furniture', 'Handyman']
  }
];

export function generateGigsAroundLocation(centerLat: number, centerLng: number): Gig[] {
  return BASE_GIG_TEMPLATES.map((tmpl, idx) => {
    const lat = centerLat + tmpl.offsetKm[0];
    const lng = centerLng + tmpl.offsetKm[1];

    return {
      id: `gig-casual-${idx + 1}-${Math.round(centerLat * 100)}`,
      title: tmpl.title,
      category: tmpl.category,
      categoryLabel: tmpl.categoryLabel,
      payRate: tmpl.payRate,
      payType: tmpl.payType,
      description: tmpl.description,
      locationName: tmpl.locationName,
      lat,
      lng,
      posterName: tmpl.posterName,
      posterRating: tmpl.posterRating,
      isUrgent: tmpl.isUrgent,
      isImmediate: tmpl.isImmediate,
      scheduledTime: tmpl.scheduledTime,
      timeEstimate: tmpl.timeEstimate,
      postedAgo: tmpl.postedAgo,
      tags: tmpl.tags
    };
  });
}

export type Location = {
  address: string
  categoryId: string
  coordinates: {
    lat: number
    lng: number
  }
  createdAt: string
  description: string
  id: string
  isFavorite: boolean
  lastVisited?: string
  name: string
  rating: number
  tags: string[]
  visitCount: number
}

export type LocationCategory = {
  color: string
  icon: string
  id: string
  name: string
}

export const categories: LocationCategory[] = [
  {
    color: '#862533', // chart-2
    icon: 'utensils',
    id: 'restaurants',
    name: 'Restaurants',
  },
  { color: '#FE5000', icon: 'coffee', id: 'cafes', name: 'Cafés' }, // primary
  { color: '#262626', icon: 'wine', id: 'bars', name: 'Bars' }, // chart-1
  { color: '#00B7A1', icon: 'trees', id: 'parks', name: 'Parks' }, // chart-4
  { color: '#036870', icon: 'landmark', id: 'museums', name: 'Museums' }, // chart-5
  { color: '#FFC107', icon: 'shopping-bag', id: 'shops', name: 'Shopping' }, // chart-3
  { color: '#06b6d4', icon: 'bed', id: 'hotels', name: 'Hotels' },
  { color: '#eab308', icon: 'dumbbell', id: 'gyms', name: 'Fitness' },
]

export const tags = [
  { id: 'family-friendly', name: 'Family Friendly' },
  { id: 'pet-friendly', name: 'Pet Friendly' },
  { id: 'outdoor', name: 'Outdoor' },
  { id: 'wifi', name: 'Free WiFi' },
  { id: 'parking', name: 'Parking' },
  { id: 'accessible', name: 'Accessible' },
  { id: 'romantic', name: 'Romantic' },
  { id: 'budget', name: 'Budget Friendly' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'vegan', name: 'Vegan Options' },
]

const allTags = tags.map((t) => t.id)

// Deterministic pseudo-random number generator based on seed
function createSeededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

// Deterministic date generation based on location index
function getDeterministicDate(index: number) {
  const month = String((index % 12) + 1).padStart(2, '0')
  const day = String((index % 28) + 1).padStart(2, '0')

  return `2024-${month}-${day}`
}

// Deterministic last visited date based on location index
function getDeterministicLastVisited(index: number): string | undefined {
  const seededRandom = createSeededRandom(index * 293)

  if (seededRandom() > 0.3) {
    const day = String((index % 28) + 1).padStart(2, '0')
    return `2024-12-${day}`
  }

  return undefined
}

// Deterministic tag selection based on location index
function getDeterministicTags(index: number) {
  const seededRandom = createSeededRandom(index * 137)
  const count = Math.floor(seededRandom() * 4) + 1
  const startIdx = index % allTags.length

  return Array.from(
    { length: count },
    (_, i) => allTags[(startIdx + i) % allTags.length]
  )
}

// Deterministic visit count based on location index
function getDeterministicVisitCount(index: number) {
  return ((index * 137) % 1000) + 1
}

let locationIndex = 0

function createLocation(
  id: string,
  name: string,
  description: string,
  address: string,
  categoryId: string,
  lat: number,
  lng: number,
  rating: number,
  isFavorite: boolean = false
): Location {
  const index = locationIndex++

  return {
    address,
    categoryId,
    coordinates: { lat, lng },
    createdAt: getDeterministicDate(index),
    description,
    id,
    isFavorite,
    lastVisited: getDeterministicLastVisited(index),
    name,
    rating,
    tags: getDeterministicTags(index),
    visitCount: getDeterministicVisitCount(index),
  }
}

export const locations: Location[] = [
  // ===== RESTAURANTS =====
  createLocation(
    'rest-1',
    'Jay Fai',
    'Legendary crab omelette',
    '327 Maha Chai Rd, Samran Rat, Phra Nakhon, Bangkok 10200',
    'restaurants',
    13.7525,
    100.5048,
    4.6,
    true
  ),
  createLocation(
    'rest-2',
    'Gaggan Anand',
    'Progressive Indian cuisine',
    '68 Sukhumvit 31, Bangkok 10110',
    'restaurants',
    13.738,
    100.5665,
    4.8,
    true
  ),
  createLocation(
    'rest-3',
    'Sorn',
    'Fine Southern Thai dining',
    '56, Sukhumvit 26, Bangkok 10110',
    'restaurants',
    13.7292,
    100.5702,
    4.9
  ),
  createLocation(
    'rest-4',
    'Bo.lan',
    'Sustainable Thai fine dining',
    '24 Sukhumvit 53 Alley, Bangkok 10110',
    'restaurants',
    13.7311,
    100.5802,
    4.7
  ),
  createLocation(
    'rest-5',
    'Le Du',
    'Modern Thai-inspired cuisine',
    '399/3 Silom 7 Alley, Bang Rak, Bangkok 10500',
    'restaurants',
    13.7237,
    100.5293,
    4.7
  ),
  createLocation(
    'rest-6',
    'Sühring',
    'Contemporary German tasting menu',
    '10 Yen Akat Soi 3, Bangkok 10120',
    'restaurants',
    13.7042,
    100.5476,
    4.8
  ),
  createLocation(
    'rest-7',
    'Raan Jay Fai',
    'Street food icon',
    '327 Mahachai Road, Bangkok',
    'restaurants',
    13.7526,
    100.5048,
    4.5
  ),
  createLocation(
    'rest-8',
    'Thip Samai Pad Thai',
    'Famous Pad Thai',
    '313 Maha Chai Rd, Samran Rat, Bangkok 10200',
    'restaurants',
    13.7529,
    100.5046,
    4.4
  ),
  createLocation(
    'rest-9',
    'Somtum Der',
    'Isan cuisine specialist',
    '5/5 Saladaeng Rd, Silom, Bangkok 10500',
    'restaurants',
    13.7285,
    100.5367,
    4.5
  ),
  createLocation(
    'rest-10',
    'Blue Elephant',
    'Royal Thai cuisine',
    '233 S Sathorn Rd, Yan Nawa, Bangkok 10120',
    'restaurants',
    13.7196,
    100.5182,
    4.6
  ),
  createLocation(
    'rest-11',
    'Dash! Restaurant and Bar',
    'Wooden house serving Thai food',
    '38/2 Moon Muang Rd Soi 2, Chiang Mai 50200',
    'restaurants',
    18.785,
    98.9912,
    4.7
  ),
  createLocation(
    'rest-12',
    'Ginger & Kafe',
    'Eclectic bistro',
    'The House by Ginger, Chiang Mai',
    'restaurants',
    18.7915,
    98.9934,
    4.6
  ),
  createLocation(
    'rest-13',
    'Raya Restaurant',
    'Phuket heritage cuisine',
    '48 New Dibuk Road, Phuket Town',
    'restaurants',
    7.886,
    98.39,
    4.7
  ),
  createLocation(
    'rest-14',
    'Blue Elephant Phuket',
    'Historic mansion dining',
    '96 Krabi Road, Phuket Town',
    'restaurants',
    7.8845,
    98.3888,
    4.6
  ),
  createLocation(
    'rest-15',
    'Acqua Restaurant',
    'Modern Italian',
    '324/15 Prabaramee Road, Kalim Bay, Phuket',
    'restaurants',
    7.915,
    98.295,
    4.8
  ),

  // ===== CAFÉS =====
  createLocation(
    'cafe-1',
    'Roots Coffee Roaster',
    'Specialty coffee roaster',
    'The Commons, Thong Lo 17, Bangkok',
    'cafes',
    13.7348,
    100.5823,
    4.7,
    true
  ),
  createLocation(
    'cafe-2',
    'Factory Coffee',
    'Award-winning baristas',
    '49 Phaya Thai Rd, Bangkok',
    'cafes',
    13.7588,
    100.5345,
    4.8
  ),
  createLocation(
    'cafe-3',
    'Kaizen Coffee Co.',
    'Melbourne style coffee',
    'Tai Ping Tower, Ekkamai, Bangkok',
    'cafes',
    13.735,
    100.59,
    4.6
  ),
  createLocation(
    'cafe-4',
    'Rocket Coffeebar',
    'Nordic style cafe',
    '149 Sathon Soi 12, Bangkok',
    'cafes',
    13.7225,
    100.5284,
    4.5
  ),
  createLocation(
    'cafe-5',
    'Ink & Lion Café',
    'Micro-roaster and gallery',
    '1/7 Ekkamai Soi 2, Bangkok',
    'cafes',
    13.7208,
    100.5855,
    4.6
  ),
  createLocation(
    'cafe-6',
    'Akha Ama Coffee',
    'Sustainable hilltop coffee',
    '175/1 Ratchadamnoen Rd, Chiang Mai',
    'cafes',
    18.79,
    98.985,
    4.8
  ),
  createLocation(
    'cafe-7',
    'Ristr8to Lab',
    'Latte art champions',
    '14 Nimmanhaemin Rd Soi 3, Chiang Mai',
    'cafes',
    18.7984,
    98.9685,
    4.7
  ),
  createLocation(
    'cafe-8',
    'Graph Café',
    'Creative coffee drinks',
    'Ratvithi Lane 1, Chiang Mai',
    'cafes',
    18.7935,
    98.9912,
    4.6
  ),
  createLocation(
    'cafe-9',
    'Dou Brew Coffee',
    'Minimalist Chinese style',
    '78 Thalang Rd, Phuket Town',
    'cafes',
    7.8856,
    98.3895,
    4.5
  ),
  createLocation(
    'cafe-10',
    'The Barn Eatery Design',
    'Rustic cozy cafe',
    '14 Srivichai Rd, Chiang Mai',
    'cafes',
    18.793,
    98.959,
    4.5
  ),

  // ===== BARS =====
  createLocation(
    'bar-1',
    'Sky Bar',
    'Hangover movie fame',
    'Lebua at State Tower, Bangkok',
    'bars',
    13.7214,
    100.5168,
    4.6,
    true
  ),
  createLocation(
    'bar-2',
    'Bamboo Bar',
    'Live jazz institution',
    'Mandarin Oriental, Bangkok',
    'bars',
    13.7234,
    100.514,
    4.7
  ),
  createLocation(
    'bar-3',
    'Tep Bar',
    'Thai cultural bar',
    '69-71 Soi Yi Sip Song Karakadakhom 4, Bangkok',
    'bars',
    13.7405,
    100.5145,
    4.6
  ),
  createLocation(
    'bar-4',
    'Rabbit Hole',
    'Speakeasy vibes',
    '125 Thong Lo Rd, Bangkok',
    'bars',
    13.7315,
    100.5822,
    4.5
  ),
  createLocation(
    'bar-5',
    "Maggie Choo's",
    'Underground cabaret',
    '320 Silom Rd, Bangkok',
    'bars',
    13.725,
    100.526,
    4.5
  ),
  createLocation(
    'bar-6',
    'Zoe in Yellow',
    'Chiang Mai nightlife hub',
    'Ratvithi Rd, Chiang Mai',
    'bars',
    18.7918,
    98.9922,
    4.3
  ),
  createLocation(
    'bar-7',
    'North Gate Jazz Co-Op',
    'Live jazz jams',
    '91/1-2 Sri Poom Rd, Chiang Mai',
    'bars',
    18.7955,
    98.9868,
    4.7
  ),
  createLocation(
    'bar-8',
    'Baba Nest',
    'Rooftop deck',
    'Sri Panwa, Phuket',
    'bars',
    7.8078,
    98.408,
    4.8
  ),
  createLocation(
    'bar-9',
    'Catch Beach Club',
    'Beachside party',
    'Cherng Talay, Phuket',
    'bars',
    7.986,
    98.283,
    4.5
  ),
  createLocation(
    'bar-10',
    'Havana Bar',
    'Pattaya favorite',
    'Holiday Inn, Pattaya',
    'bars',
    12.9425,
    100.887,
    4.4
  ),

  // ===== PARKS =====
  createLocation(
    'park-1',
    'Lumpini Park',
    "Bangkok's green lung",
    'Rama IV Rd, Pathum Wan, Bangkok',
    'parks',
    13.7314,
    100.5414,
    4.7,
    true
  ),
  createLocation(
    'park-2',
    'Benjakitti Park',
    'Forest park in city',
    'Ratchadaphisek Rd, Khlong Toei, Bangkok',
    'parks',
    13.7303,
    100.559,
    4.8
  ),
  createLocation(
    'park-3',
    'Chatuchak Park',
    'Near the market',
    'Kamphaeng Phet 3 Rd, Chatuchak, Bangkok',
    'parks',
    13.8055,
    100.555,
    4.5
  ),
  createLocation(
    'park-4',
    'Rama IX Park',
    'Largest green space',
    'Chaloem Phrakiat Ratchakan Thi 9 Rd, Prawet, Bangkok',
    'parks',
    13.6873,
    100.6631,
    4.6
  ),
  createLocation(
    'park-5',
    'Doi Inthanon National Park',
    'Highest peak in Thailand',
    'Chiang Mai',
    'parks',
    18.5886,
    98.4862,
    4.9
  ),
  createLocation(
    'park-6',
    'Khao Sok National Park',
    'Rainforest and lake',
    'Surat Thani',
    'parks',
    8.9172,
    98.5284,
    4.9
  ),
  createLocation(
    'park-7',
    'Erawan National Park',
    'Waterfalls',
    'Kanchanaburi',
    'parks',
    14.3683,
    99.1439,
    4.8
  ),
  createLocation(
    'park-8',
    'Ao Phang Nga National Park',
    'Limestone karsts',
    'Phang Nga',
    'parks',
    8.2747,
    98.5028,
    4.9
  ),
  createLocation(
    'park-9',
    'Mu Ko Ang Thong',
    'Marine park',
    'Surat Thani',
    'parks',
    9.619,
    99.664,
    4.8
  ),
  createLocation(
    'park-10',
    'Doi Suthep-Pui',
    'Mountain overlooking city',
    'Chiang Mai',
    'parks',
    18.8045,
    98.9213,
    4.7
  ),

  // ===== MUSEUMS =====
  createLocation(
    'mus-1',
    'Bangkok National Museum',
    'Thai art and history',
    'Na Phra That Alley, Phra Nakhon, Bangkok',
    'museums',
    13.7591,
    100.4925,
    4.6
  ),
  createLocation(
    'mus-2',
    'MOCA Bangkok',
    'Modern art',
    '499 Kamphaeng Phet 6 Rd, Chatuchak, Bangkok',
    'museums',
    13.8447,
    100.563,
    4.7,
    true
  ),
  createLocation(
    'mus-3',
    'Jim Thompson House',
    'Silk museum',
    '6 Soi Kasemsan 2, Rama 1 Rd, Bangkok',
    'museums',
    13.7495,
    100.5283,
    4.6
  ),
  createLocation(
    'mus-4',
    'Museum of Siam',
    'Interactive history',
    '4 Sanam Chai Rd, Phra Nakhon, Bangkok',
    'museums',
    13.7445,
    100.4941,
    4.7
  ),
  createLocation(
    'mus-5',
    'Erawan Museum',
    'Three-headed elephant',
    '99/9 Moo 1, Samut Prakan',
    'museums',
    13.6288,
    100.5891,
    4.5
  ),
  createLocation(
    'mus-6',
    'Chiang Mai National Museum',
    'Lanna history',
    'Super Highway, Chiang Mai',
    'museums',
    18.8105,
    98.9725,
    4.4
  ),
  createLocation(
    'mus-7',
    'MAIIAM Contemporary Art Museum',
    'Modern art warehouse',
    'San Kamphaeng, Chiang Mai',
    'museums',
    18.775,
    99.088,
    4.7
  ),
  createLocation(
    'mus-8',
    'Phuket Trickeye Museum',
    '3D art',
    'Phang Nga Rd, Phuket Town',
    'museums',
    7.8835,
    98.391,
    4.4
  ),
  createLocation(
    'mus-9',
    'Hall of Opium',
    'Golden Triangle history',
    'Chiang Saen, Chiang Rai',
    'museums',
    20.363,
    100.076,
    4.6
  ),
  createLocation(
    'mus-10',
    'Hellfire Pass Interpretive Centre',
    'WWII history',
    'Sai Yok, Kanchanaburi',
    'museums',
    14.3525,
    98.954,
    4.8
  ),

  // ===== SHOPS =====
  createLocation(
    'shop-1',
    'Siam Paragon',
    'Luxury mall',
    '991 Rama I Rd, Pathum Wan, Bangkok',
    'shops',
    13.7469,
    100.5349,
    4.7
  ),
  createLocation(
    'shop-2',
    'Chatuchak Weekend Market',
    'Massive market',
    'Kamphaeng Phet 2 Rd, Chatuchak, Bangkok',
    'shops',
    13.8,
    100.551,
    4.8,
    true
  ),
  createLocation(
    'shop-3',
    'ICONSIAM',
    'Riverside luxury',
    '299 Charoen Nakhon Rd, Khlong San, Bangkok',
    'shops',
    13.7266,
    100.5108,
    4.8
  ),
  createLocation(
    'shop-4',
    'CentralWorld',
    'Shopping complex',
    '999/9 Rama I Rd, Pathum Wan, Bangkok',
    'shops',
    13.746,
    100.5398,
    4.7
  ),
  createLocation(
    'shop-5',
    'Asiatique The Riverfront',
    'Night market',
    '2194 Charoen Krung Rd, Bangkok',
    'shops',
    13.7042,
    100.5032,
    4.5
  ),
  createLocation(
    'shop-6',
    'Terminal 21',
    'Airport themed mall',
    '88 Soi Sukhumvit 19, Bangkok',
    'shops',
    13.7375,
    100.5603,
    4.6
  ),
  createLocation(
    'shop-7',
    'Warorot Market',
    'Local Chiang Mai market',
    'Wichayanon Rd, Chiang Mai',
    'shops',
    18.79,
    99.001,
    4.5
  ),
  createLocation(
    'shop-8',
    'Cicada Market',
    'Art market',
    'Nong Kae, Hua Hin',
    'shops',
    12.5345,
    99.9658,
    4.6
  ),
  createLocation(
    'shop-9',
    'Jungceylon',
    'Phuket mall',
    'Rat-U-Thit 200 Pee Road, Patong',
    'shops',
    7.892,
    98.2985,
    4.4
  ),
  createLocation(
    'shop-10',
    'Maya Lifestyle Shopping Center',
    'Modern Chiang Mai mall',
    'Huay Kaew Rd, Chiang Mai',
    'shops',
    18.802,
    98.967,
    4.5
  ),

  // ===== HOTELS =====
  createLocation(
    'hotel-1',
    'Mandarin Oriental Bangkok',
    'Legendary riverside',
    '48 Oriental Ave, Bangkok',
    'hotels',
    13.7237,
    100.514,
    4.9,
    true
  ),
  createLocation(
    'hotel-2',
    'The Siam',
    'Art deco riverside luxury',
    'Khao Rd, Dusit, Bangkok',
    'hotels',
    13.778,
    100.505,
    4.9
  ),
  createLocation(
    'hotel-3',
    "Bangkok Marriott Marquis Queen's Park",
    'Modern luxury',
    'Sukhumvit Soi 22, Bangkok',
    'hotels',
    13.731,
    100.567,
    4.6
  ),
  createLocation(
    'hotel-4',
    'Four Seasons Resort Chiang Mai',
    'Rice paddy luxury',
    'Mae Rim, Chiang Mai',
    'hotels',
    18.918,
    98.922,
    4.9
  ),
  createLocation(
    'hotel-5',
    'Rachamankha',
    'Lanna boutique',
    '6 Rachamankha 9, Chiang Mai',
    'hotels',
    18.7865,
    98.983,
    4.7
  ),
  createLocation(
    'hotel-6',
    'Sri Panwa Phuket',
    'Cape Panwa luxury',
    '88 Sakdidej Rd, Phuket',
    'hotels',
    7.8078,
    98.408,
    4.8
  ),
  createLocation(
    'hotel-7',
    'Amanpuri',
    'Exclusive resort',
    'Pansea Beach, Phuket',
    'hotels',
    7.985,
    98.278,
    4.9
  ),
  createLocation(
    'hotel-8',
    'Rayavadee',
    'Krabi limestone cliffs',
    'Railay Beach, Krabi',
    'hotels',
    8.01,
    98.835,
    4.8
  ),
  createLocation(
    'hotel-9',
    'Six Senses Samui',
    'Koh Samui luxury',
    'Bo Phut, Koh Samui',
    'hotels',
    9.589,
    100.068,
    4.8
  ),
  createLocation(
    'hotel-10',
    'Centara Grand Beach Resort',
    'Colonial style',
    '1 Damnernkasem Rd, Hua Hin',
    'hotels',
    12.5645,
    99.9615,
    4.7
  ),

  // ===== GYMS =====
  createLocation(
    'gym-1',
    'Base Bangkok',
    'Functional training',
    'Noble Remix, Sukhumvit 36, Bangkok',
    'gyms',
    13.7258,
    100.5765,
    4.7
  ),
  createLocation(
    'gym-2',
    'Virgin Active EmQuartier',
    'Premium fitness',
    'The EmQuartier, Bangkok',
    'gyms',
    13.7318,
    100.5695,
    4.6
  ),
  createLocation(
    'gym-3',
    'Absolute You',
    'Yoga and pilates',
    'Amarin Plaza, Bangkok',
    'gyms',
    13.7436,
    100.5414,
    4.5
  ),
  createLocation(
    'gym-4',
    'Training Ground',
    'CrossFit box',
    'Sukhumvit 69, Bangkok',
    'gyms',
    13.7145,
    100.593,
    4.6
  ),
  createLocation(
    'gym-5',
    'Fitness First Platinum',
    'Siam Paragon gym',
    'Siam Paragon, Bangkok',
    'gyms',
    13.7469,
    100.5349,
    4.4
  ),
  createLocation(
    'gym-6',
    'Go Gym Chiang Mai',
    'Large budget gym',
    'Mahidol Rd, Chiang Mai',
    'gyms',
    18.766,
    98.975,
    4.3
  ),
  createLocation(
    'gym-7',
    'Maximum Fitness Phuket',
    'Muay Thai and fitness',
    'Patong, Phuket',
    'gyms',
    7.896,
    98.303,
    4.5
  ),
  createLocation(
    'gym-8',
    'Unit 27',
    'Total conditioning',
    'Soi Ta-iad, Chalong, Phuket',
    'gyms',
    7.848,
    98.349,
    4.7
  ),
  createLocation(
    'gym-9',
    'Fairtex Training Center',
    'Muay Thai famous',
    'North Pattaya Rd, Pattaya',
    'gyms',
    12.949,
    100.89,
    4.6
  ),
  createLocation(
    'gym-10',
    'Tiger Muay Thai',
    'World famous camp',
    'Soi Ta-iad, Chalong, Phuket',
    'gyms',
    7.85,
    98.348,
    4.8
  ),
]

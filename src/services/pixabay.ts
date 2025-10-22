// src/services/pixabay.ts

const PIXABAY_API_KEY = '40924902-a978992cc18cb9f4ba1b78d46';
const PIXABAY_BASE_URL = "https://pixabay.com/api/";

// Wallpaper categories
export const CATEGORIES = [
  "backgrounds", "fashion", "nature", "science", "education",
  "feelings", "health", "people", "religion", "places", "animals",
  "industry", "computer", "food", "sports", "transportation",
  "travel", "buildings", "business", "music",
];

// Color filters
export const COLOR_FILTERS = [
  "grayscale", "red", "orange", "yellow", "green", "turquoise",
  "blue", "lilac", "pink", "white", "gray", "black", "brown",
];

// --- Types ---
export type PixabayImage = {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  views: number;
  downloads: number;
  likes: number;
  user: string;
  user_id: number;
  userImageURL: string;
};

export type PixabayResponse = {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
};

export type FetchWallpapersParams = {
  page?: number;
  per_page?: number;
  q?: string;
  category?: string;
  colors?: string;
  editors_choice?: boolean;
  order?: "popular" | "latest";
};

// --- API Functions ---

// Get wallpapers from Pixabay
export const fetchWallpapers = async (
  params: FetchWallpapersParams = {}
): Promise<PixabayResponse> => {
  const defaultParams = {
    key: PIXABAY_API_KEY,
    orientation: "vertical",
    image_type: "photo",
    safesearch: true,
    per_page: params.per_page || 20,
    page: params.page || 1,
    order: params.order || "popular",
  };

  const queryParams = { ...defaultParams, ...params };
  const queryString = new URLSearchParams(queryParams as any).toString();
  const url = `${PIXABAY_BASE_URL}?${queryString}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Try again later.");
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch wallpapers:", error);
    throw error;
  }
};

export const fetchCategoryPreview = async (
  category: string
): Promise<PixabayImage | null> => {
  try {
    // Fetch up to 10 popular images for the category
    const response = await fetchWallpapers({
      category: category, 
      per_page: 10,
      order: "popular",
    });

    // If we have results, pick a random one from the list
    if (response && response.hits.length > 0) {
      const randomIndex = Math.floor(Math.random() * response.hits.length);
      return response.hits[randomIndex];
    }

    // Return null if no images were found
    return null;
  } catch (error) {
    console.error("Failed to fetch category preview:", error);
    return null;
  }
};
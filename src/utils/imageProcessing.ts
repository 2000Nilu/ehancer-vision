export const constructImageUrl = (baseUrl: string, imageType: string, enhancements: string[]) => {
  // Create a memoized params object to reduce processing time
  const params = new URLSearchParams();
  
  // Optimize image loading with lower initial quality and progressive loading
  params.set("q", "60"); // Lower quality for faster initial load
  params.set("auto", "format,compress"); // Add compression
  params.set("fm", "webp"); // Use WebP format for better compression
  
  // Set optimal width based on device width
  const width = window.innerWidth < 768 ? "600" : "800";
  params.set("w", width);
  
  // Apply optimized enhancements based on image type
  if (enhancements.includes("face-enhance")) {
    params.append("sharpen", imageType === "portrait" ? "20" : "15");
    params.append("brightness", "101");
    params.append("contrast", "101");
  }

  if (enhancements.includes("face-glow")) {
    params.append("brightness", "103");
    params.append("contrast", "101");
    params.append("saturation", "103");
  }

  if (enhancements.includes("auto-color")) {
    params.append("saturation", "105");
    params.append("vibrance", "105");
    if (imageType === "oldphoto") {
      params.append("sepia", "30");
      params.append("contrast", "103");
    }
  }

  if (enhancements.includes("background-enhance")) {
    params.append("clarity", "5");
    if (imageType === "landscape") {
      params.append("contrast", "103");
      params.append("saturation", "105");
    }
  }

  // Handle custom uploaded images differently
  if (baseUrl.startsWith('data:')) {
    return baseUrl;
  }

  return `${baseUrl}?${params.toString()}`;
};

const defaultImageMap = {
  portrait: {
    before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=60&auto=format,compress&fm=webp",
    after: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?original=true",
  },
  landscape: {
    before: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=60&auto=format,compress&fm=webp",
    after: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?original=true",
  },
  oldphoto: {
    before: "https://images.unsplash.com/photo-1552168324-d612d77725e3?w=800&q=60&auto=format,compress&fm=webp",
    after: "https://images.unsplash.com/photo-1552168324-d612d77725e3?original=true",
  },
};

export const getDefaultImages = (type: string) => {
  return defaultImageMap[type as keyof typeof defaultImageMap] || defaultImageMap.portrait;
};
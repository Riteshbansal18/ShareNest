import { useEffect } from 'react';

const KEY = 'sharenest_recently_viewed';
const MAX = 6;

export const addRecentlyViewed = (property) => {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || '[]');
    const filtered = stored.filter(p => p._id !== property._id);
    const updated = [
      { _id: property._id, title: property.title, price: property.price, city: property.city, images: property.images, verified: property.verified },
      ...filtered
    ].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch (e) { /* silent */ }
};

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch { return []; }
};

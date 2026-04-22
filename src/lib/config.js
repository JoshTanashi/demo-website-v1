export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
export const MAP_STYLE   = "mapbox://styles/mapbox/dark-v11";
export const MAP_CENTER  = [28.047, -26.12];
export const MAP_ZOOM    = 11;

export const DIMENSIONS = [
  { col: "safety_security",           label: "Safety & Security",    help: "Security measures, incidents, and breaches in and around the complex." },
  { col: "cleanliness_upkeep",        label: "Cleanliness & Upkeep", help: "Cleanliness and maintenance of common areas and buildings." },
  { col: "newness_modernity",         label: "Newness & Modernity",  help: "Condition and modern feel of units inside and outside." },
  { col: "utilities_reliability",     label: "Water & Electricity",  help: "Reliability of utilities — outages, faults, pressure issues." },
  { col: "body_corporate_financials", label: "Body Corporate",       help: "Levies, arrears, special levies, and financial stability." },
  { col: "value_for_money",           label: "Value for Money",      help: "Do costs match the quality and overall living experience?" },
];

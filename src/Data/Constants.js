import {
  FaBook,
  FaLandmark,
  FaTree,
  FaWheelchair,
  FaParking,
  FaShoppingBasket,
  FaUtensils,
  FaWifi,
  FaUsers,
  FaCampground,
  FaPaw,
} from "react-icons/fa";

export const SITE_TAGS = [
  { name: "Library", icon: <FaBook /> },
  { name: "Museum", icon: <FaLandmark /> },
  { name: "Natural Park", icon: <FaTree /> },
  { name: "Wheelchair Accessible", icon: <FaWheelchair /> },
  { name: "Pet-Friendly", icon: <FaPaw /> },
  { name: "RV Parking", icon: <FaParking /> },
  { name: "Picnic Area", icon: <FaShoppingBasket /> },
  { name: "Large Group Friendly", icon: <FaUsers /> },
  { name: "Native American Centric", icon: <FaCampground /> },
  { name: "Guest WiFi", icon: <FaWifi /> },
  { name: "Restaurants Nearby", icon: <FaUtensils /> },
];

export const REGIONS_MAP = {
  name: "nebraska-regions",
  areas: [
    {
      name: "Panhandle",
      shape: "circle",
      coords: [124, 48, 20],
      preFillColor: "clear",
    },
    {
      name: "Sandhills",
      shape: "circle",
      coords: [254, 62, 20],
      preFillColor: "clear",
    },
    {
      name: "South West",
      shape: "circle",
      coords: [224, 198, 20],
      preFillColor: "clear",
    },
    {
      name: "South Central",
      shape: "circle",
      coords: [374, 238, 20],
      preFillColor: "clear",
    },
    {
      name: "North East",
      shape: "circle",
      coords: [454, 68, 20],
      preFillColor: "clear",
    },
    {
      name: "South East",
      shape: "circle",
      coords: [544, 204, 20],
      preFillColor: "clear",
    },
    {
      name: "Metro",
      shape: "circle",
      coords: [610, 175, 20],
      preFillColor: "clear",
    },
  ],
};

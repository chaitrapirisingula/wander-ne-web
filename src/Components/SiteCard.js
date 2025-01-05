import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WanderDefaultImage from "../Images/WanderDefaultImage.png";
import { SITE_TAGS } from "../Data/Constants";

function SiteCard({ props }) {
  const [imgError, setImgError] = useState(false);
  let navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate("/explore/" + props.name, { state: props });
        window.scrollTo(0, 0);
      }}
      className="cursor-pointer rounded-lg shadow-md bg-white w-full max-w-xs mx-auto flex flex-col transition-transform transform hover:scale-105 hover:shadow-lg"
    >
      {/* Image */}
      <div className="h-40 w-full overflow-hidden rounded-t-lg">
        <img
          src={!imgError && props.image ? props.image : WanderDefaultImage}
          alt={props.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-blue-700 break-words">
          {props.name}
        </h2>
        <p className="text-gray-500 mt-1">
          {props.city}, {props.state}
        </p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3 font-light">
          {props.description || "No description available."}
        </p>

        {/* Feature Icons */}
        {props.features && props.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {SITE_TAGS.filter((feature) =>
              props.features.includes(feature.name)
            ).map((feature, index) => (
              <div
                key={index}
                className="bg-gray-200 p-2 rounded-md flex items-center justify-center text-blue-700 relative group"
              >
                <span className="group-hover:opacity-100 opacity-0 absolute bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2 transition-opacity">
                  {feature.name}
                </span>
                {feature.icon}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Button */}
      <div className="flex justify-center py-3">
        <button
          className="px-4 py-2 text-blue-600 font-medium hover:text-blue-500 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation(); // Prevents parent div click event
            navigate("/explore/" + props.name, { state: props });
            window.scrollTo(0, 0);
          }}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}

export default SiteCard;

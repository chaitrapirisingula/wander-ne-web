const SearchBar = ({ setSearchQuery }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-full max-w-md">
        {/* Search Input */}
        <input
          type="text"
          id="search-bar"
          className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search..."
          onInput={(e) => setSearchQuery(e.target.value)}
        />
        {/* Search Icon */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M18.35 10.35a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

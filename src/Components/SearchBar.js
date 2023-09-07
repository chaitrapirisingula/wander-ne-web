import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { OutlinedInput, InputAdornment } from "@mui/material";

const SearchBar = ( { setSearchQuery } ) => {
    return (
        <div>
          <OutlinedInput
            id="search-bar"
            className="text"
            onInput={(e) => {
              setSearchQuery(e.target.value);
            }}
            variant="outlined"
            placeholder="Search..."
            sx={{ mt: 1, mb: 1 }}
            endAdornment={<InputAdornment position="end">
              <SearchIcon sx={{ mt: 1, mb: 1 }} fontSize="large"/>
            </InputAdornment>}
          />
        </div>
    );
};

export default SearchBar;

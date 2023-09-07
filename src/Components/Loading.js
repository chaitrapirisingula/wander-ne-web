import React from "react";
import ReactLoading from "react-loading";
import "../Design/App.css";

const Loading = () => {

  return (
    <div className="loading_wrapper">
        <div className="loading">
            <ReactLoading color="#000080" height={100} width={100} />
        </div>
    </div>
  );
  
};

export default Loading;

import React from "react";
import { ColorRing } from "react-loader-spinner";

const LoadingScreen = ({ subtitle }) => {
  return (
    <div className="h-screen flex justify-center items-center bg-dawn">
      <div>
        <ColorRing
          visible={true}
          height="120"
          width="120"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
        <p className="-translate-x-2">{subtitle}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

import React from "react";
import { Triangle } from "react-loader-spinner";

const LoadingScreen = ({ subtitle }) => {
  return (
    <div className="flex justify-center items-center">
      <div>
        <div className="flex justify-center items-center">
          <Triangle
            visible={true}
            height="100"
            width="100"
            color="#74dafe"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
        <p className="translate-x-2 mt-8 w-[30vw] text-center">{subtitle}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

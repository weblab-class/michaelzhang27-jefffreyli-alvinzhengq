import React from "react";

const Details = ({ name, duration, type, isFlexible } : {
  name: string,
  duration: string,
  type: string,
  isFlexible: boolean
}) => {
  const details = [
    { label: "Name", value: name },
    { label: "Duration", value: duration },
    { label: "Type", value: type },
    { label: "Flexible", value: isFlexible ? "Yes" : "No" }, // Assuming isFlexible is a boolean
  ];

  return (
    <div className="bg-dawn w-1/4 h-[30rem] p-4 rounded-sm">
      <h1 className="text-left mb-4">Details</h1>
      {details.map((detail, index) => (
        <div key={index} className="flex justify-between mt-2">
          <h2 className="text-sm text-gray-400">{detail.label}</h2>
          <p className="text-xs">{detail.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Details;

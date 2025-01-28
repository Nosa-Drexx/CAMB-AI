"use client";
import { useState } from "react";

const CustomVerticalRange = ({
  children,
  value = 0,
  onRangeUpdate = () => {},
}) => {
  const [showRange, setShowRange] = useState(false);

  const updateRange = () => {
    const rangeValue = event.target.valueAsNumber;

    onRangeUpdate(rangeValue);
  };

  return (
    <div className="relative">
      <div
        onMouseLeave={() => setShowRange(false)}
        onMouseEnter={() => setShowRange(true)}
      >
        {children}
      </div>
      {showRange ? (
        <div
          className="flex p-2 transform -rotate-90 rounded bg-black absolute"
          style={{ left: "-220%", top: "-200%" }}
          onMouseOver={() => setShowRange(true)}
          onMouseOut={() => setShowRange(false)}
        >
          <input
            type={"range"}
            min="0"
            max="100"
            value={value}
            onChange={updateRange}
            className="accent-[#5b33ab] cursor-pointer w-[100px] m-auto"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomVerticalRange;

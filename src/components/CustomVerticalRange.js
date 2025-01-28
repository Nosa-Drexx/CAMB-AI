"use client";
import { useState } from "react";

const CustomVerticalRange = ({
  children,
  value = 0,
  onRangeUpdate = () => {},
  disabled = false,
  ...props
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
          style={{
            left: "-220%",
            top: "-200%",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          onMouseOver={() => setShowRange(true)}
          onMouseOut={() => setShowRange(false)}
        >
          <input
            type={"range"}
            min="0"
            max="100"
            value={value}
            onChange={updateRange}
            className={`accent-[#5b33ab] ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            } w-[100px] m-auto`}
            disabled={disabled}
            {...props}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomVerticalRange;

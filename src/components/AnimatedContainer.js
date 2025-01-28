import { colors } from "@/data/colors";
import { useMultitrackContext } from "@/hooks/multitrack-hook";
import { useEffect, useState } from "react";

function changeColor(currentColor = "none", allColors = colors) {
  const AllColorsExceptCurrentColor = allColors.filter(
    (color) => color.gradient !== currentColor.gradient
  );

  //Randomly select an index
  const RandomSelection = Math.floor(
    Math.random() * AllColorsExceptCurrentColor.length
  );

  return AllColorsExceptCurrentColor[RandomSelection];
}

const AnimatedContainer = ({ children }) => {
  const { state } = useMultitrackContext();
  const [background, setBackground] = useState(changeColor());

  const multitrack = state.multitrack;

  useEffect(() => {
    if (multitrack) {
      const randomBG = changeColor();
      setBackground(randomBG);
    }
  }, [multitrack]);

  return (
    <div
      className="animated-bg-container w-full h-full"
      style={{
        backgroundColor: background.color,
        backgroundImage: background.gradient,
        backgroundSize: "400% 400%", //For animation of background gradients.
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;

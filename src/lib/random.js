export function getRandomSolidColor() {
  const solidColors = [
    "hsl(0, 100%, 50%)", // Red
    "hsl(120, 100%, 50%)", // Green
    "hsl(240, 100%, 50%)", // Blue
    "hsl(60, 100%, 50%)", // Yellow
    "hsl(39, 100%, 50%)", // Orange
    "hsl(300, 100%, 50%)", // Purple
    "hsl(350, 100%, 88%)", // Pink
    "hsl(30, 100%, 50%)", // Brown (adjusted for HSL)
    "hsl(180, 100%, 50%)", // Teal
    "hsl(240, 100%, 25%)", // Navy
  ];

  const randomIndex = Math.floor(Math.random() * solidColors.length);
  const mainColor = solidColors[randomIndex];

  const [hue, saturation, lightness] = mainColor.match(/\d+/g).map(Number);

  // Create a lighter version of the color by increasing lightness
  const lightColor = `hsl(${hue}, ${saturation}%, ${lightness - 30}%)`;

  return { mainColor, lightColor };
}

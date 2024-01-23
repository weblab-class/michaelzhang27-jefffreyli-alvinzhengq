export default function HoverLine({ linePosition }) {
  return (
    <div
      className="absolute h-full w-px bg-black"
      style={{ left: `${linePosition}px` }}
    />
  );
}

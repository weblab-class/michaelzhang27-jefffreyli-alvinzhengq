export default function HoverLine({ linePosition }) {
  return (
    <div
      className="absolute h-full w-px bg-black z-50 pointer-events-none"
      style={{ left: `${linePosition}px` }}
    />
  );
}

export default function HoverLine({ linePosition }) {
  return (
    <div
      className="absolute h-[70%] w-px bg-black z-50 pointer-events-none"
      style={{ left: `${linePosition}px` }}
    />
  );
}

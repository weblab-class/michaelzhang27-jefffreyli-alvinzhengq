export default function HoverLine({ linePosition }) {
  return (
    <div
      className="absolute h-[23vh] top-[5.6rem] w-[2px] bg-black z-50 pointer-events-none"
      style={{ left: `${linePosition}px` }}
    />
  );
}

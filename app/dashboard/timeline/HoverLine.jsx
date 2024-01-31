import { TbTriangleInvertedFilled } from "react-icons/tb";

export default function HoverLine({ linePosition }) {
  return (
    <div
      className="absolute h-[25vh] top-0 rounded-lg border-2 border-primary shadow-2xl shadow-primary/80 z-50 pointer-events-none"
      style={{ left: `${linePosition-53}px` }}
    >
      <TbTriangleInvertedFilled className="absolute -top-[4px] -left-[8px] fill-primary text-primary" />
    </div>
  );
}

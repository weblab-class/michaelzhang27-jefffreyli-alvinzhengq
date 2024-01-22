export default function MarkerBlock({ onAddMarker, markers }) {
  const handleAddMarker = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onAddMarker({ x, y });
  };

  return (
    <div className="relative w-full h-64 bg-gray-200" onClick={handleAddMarker}>
      {markers.map((marker, index) => (
        <div
          key={index}
          className="absolute bg-darkGrey rounded-md w-[3px] h-8"
          style={{
            top: marker.y,
            left: marker.x,
          }}
        />
      ))}
    </div>
  );
}

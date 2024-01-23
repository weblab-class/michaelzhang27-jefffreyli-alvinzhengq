export default function MarkerBlock({ onAddMarker, markers }) {
  const handleAddMarker = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onAddMarker({ x, y });
    console.log((x / rect.width) * 100);
  };

  return (
    <div className="relative w-full h-64 bg-gray-200" onClick={handleAddMarker}>
      {markers.map((marker, index) => (
        <div
          key={index}
          className="absolute bg-darkGrey rounded-md h-full w-[2px]"
          style={{
            top: 0,
            left: marker.x,
          }}
        />
      ))}
    </div>
  );
}

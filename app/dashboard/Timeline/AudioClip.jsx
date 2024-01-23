export default function AudioClip(params) {
  return (
    <div
      style={{
        height: 50,
        minWidth: params.size * 50 * (params.scalar / 50),
        backgroundColor: "#ff9a3c",
        boxShadow: "1px 1px 1px #F6C7B3",
        marginRight: 10,
        borderRadius: 5,
      }}
    >
      <div
        style={{
          margin: 5,
        }}
      >
        <text>{params.id}</text>
      </div>
    </div>
  );
}

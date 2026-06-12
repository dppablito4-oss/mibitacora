export default function SpaceBackground() {
  return (
    <div
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
      style={{
        backgroundImage: "url('/fondo2.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "2000px auto",
        backgroundColor: "#030712",
      }}
    />
  );
}

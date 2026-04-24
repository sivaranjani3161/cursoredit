import Image from "next/image";

export default function BlogHero() {
  return (
    <div
      className="hidden md:block"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 0" }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(260px, 32vw, 380px)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Image
          src="/bloghero.png"
          alt="Finest Coder Blogs"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </div>
  );
}

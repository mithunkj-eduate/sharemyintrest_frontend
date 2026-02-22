import { useState } from "react";

export function SafeImage({ src, width, height, alt, className, onClick }) {
  const [imgSrc, setImgSrc] = useState(src);
  if (!src) return <div>Loading ...</div>;

  console.log(src, imgSrc, "SafeImage");
  return (
    <img
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      onClick={onClick ? onClick : () => {}}
      unoptimized
      onError={() => {
        setImgSrc("/placeholder.jpg"); // must exist in frontend /public
      }}
    />
  );
}

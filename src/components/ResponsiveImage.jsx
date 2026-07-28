import React from "react";

export default function ResponsiveImage({
  src,
  mobileSrc = undefined,
  alt,
  width,
  height,
  className = undefined,
  loading = "lazy",
  decoding = "async",
  fetchPriority = undefined,
  sizes = "(max-width: 720px) calc(100vw - 24px), 50vw",
  ...props
}) {
  const desktopWidth = Number.parseInt(String(width), 10) || 1440;
  const srcSet = mobileSrc ? `${mobileSrc} 720w, ${src} ${desktopWidth}w` : undefined;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      {...props}
    />
  );
}

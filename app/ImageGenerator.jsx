/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

const MAX_WIDTH = 800;

export const ImageGenerator = ({ image, settings, maxWidth = MAX_WIDTH }) => {
  if (!image || !image.src) {
    return (
      <div role="alert" className="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Warning: Upload image first!</span>
      </div>
    );
  }

  const coef =
    ((image.width > maxWidth ? maxWidth / image.width : 1) * settings.size) /
    100;
  const imageWidth = image.width * coef;

  return (
    <div
      style={{
        display: "flex",
        padding: settings.padding,
        maxWidth: 400,
        width: imageWidth + 2 * settings.padding,
      }}
    >
      <img
        src={image.src}
        alt="Generated Image"
        style={{
          width: imageWidth,
          boxShadow: `0 0 ${settings.shadow}px rgba(0,0,0,.${settings.shadow})`,
          borderRadius: settings.radius,
          display: "flex",
        }}
        // width={image.width}
        // height={image.height}
      />
    </div>
  );
};

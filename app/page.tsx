"use client";

import { useState } from "react";
import clsx from "clsx";
import { renderPNG } from "./render-png";
import { ImageGenerator } from "./ImageGenerator";

const MAX_WIDTH = 400;

const fields = [
  { name: "padding", type: "range", min: 0, max: 99 },
  { name: "shadow", type: "range", min: 0, max: 99 },
  { name: "radius", type: "range", min: 0, max: 99 },
  {
    name: "size",
    type: "range",
    min: 10,
    max: 100,
    defaultValue: 100,
    step: 2,
  },
];
type Params = {
  padding?: number;
  shadow?: number;
  radius?: number;
  size?: number;
};

type ImageInfo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

type ShowImageProps = {
  image: ImageInfo;
  param: Params;
};

const ShowImage: React.FC<ShowImageProps> = ({ image, param }) => {
  const [loading, setLoading] = useState("idle");

  const handleDownload = async (isCopy: boolean) => {
    setLoading(isCopy ? "copy" : "download");

    const { blob } = await renderPNG({
      image: image,
      settings: param,
      maxWidth: MAX_WIDTH,
    });
    if (isCopy) {
      navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      setLoading("idle");
      return;
    }

    const url = URL.createObjectURL(blob);

    let imageName = image.name.toLowerCase();
    if (imageName.includes(".jpg")) {
      imageName = imageName.replace(".jpg", ".png");
    }
    imageName = imageName.replace(".", "-elevation.");

    // Le code pour download
    const a = document.createElement("a");
    a.href = url;
    a.download = imageName;
    a.click();
    setLoading("idle");
  };

  return (
    <div className="flex-1 flex flex-col gap-3 bg-stone-200 p-4">
      <div className=" border border-gray-300 bg-white flex h-fit w-fit overflow-hidden">
        <ImageGenerator settings={param} image={image} maxWidth={MAX_WIDTH} />
      </div>
      <div className="flex flex-row gap-2 w-full">
        <button
          className="btn w-1/2 btn-primary"
          disabled={loading !== "idle"}
          onClick={() => handleDownload(false)}
        >
          Download{" "}
          {loading === "download" && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
        </button>
        <button
          className="btn w-1/2 btn-secondary"
          disabled={loading !== "idle"}
          onClick={() => handleDownload(true)}
        >
          Copy{" "}
          {loading === "copy" && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [param, setParams] = useState({
    padding: 10,
    radius: 5,
    shadow: 15,
    size: 100,
  } as Params);
  const [image, setImage] = useState<ImageInfo>({} as ImageInfo);

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isPng = file.type.includes("png") ? true : false;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (isPng) {
          setImage({
            name: file.name,
            src: img.src,
            width: img.width,
            height: img.height,
          });
          return;
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const ratio = img.width / img.height;
        const newWidth = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        const newHeight = newWidth / ratio;

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            var url = URL.createObjectURL(blob);

            // console.log(blob, url, `size ${newWidth}x${newHeight}`);

            setImage({
              name: file.name,
              src: url,
              width: newWidth,
              height: newHeight,
            });
          }
        }, "image/png");
      };
      img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <div className="z-10 w-full h-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col border border-purple-500 rounded shadow-lg gap-4 py-4">
        <h1 className="text-lg font-bold">Image elevation</h1>

        <div className="flex flex-col items-center justify-center w-full h-full">
          <form className="flex flex-col gap-2 text-lg bg-gray-100 round-xl shadow-2xl p-4 m-0">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Pick a file</span>
              </div>
              <input
                type="file"
                onChange={(e) => uploadFile(e)}
                className="file-input file-input-bordered w-full file-input-primary max-w-xs"
              />
            </label>
            {fields.map((field) => (
              <label key={field.name} className="flex flex-col capitalize">
                {field.name}
                <input
                  className="range range-primary range-sm"
                  type={field.type}
                  name={field.name}
                  min={field.min}
                  max={field.max}
                  step={field.step ?? 5}
                  onChange={(e) =>
                    setParams({
                      ...param,
                      [field.name]: Number(e.target.value ?? 0),
                    })
                  }
                  value={
                    (param[field.name] ?? field.defaultValue ?? "0") as string
                  }
                />
              </label>
            ))}
          </form>
        </div>
        <ShowImage image={image} param={param} />
      </div>
    </main>
  );
}

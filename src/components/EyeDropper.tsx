import React, { ForwardedRef, forwardRef, MutableRefObject, useEffect, useRef, useState } from "react";
import { EyeDropperProps, MagnifierProps, TargetRef } from "../types";
import Magnifier from "./Magnifier";
import "./EyeDropper.scss";
import html2canvas from "html2canvas";

const EyeDropper = forwardRef((props: EyeDropperProps, ref: ForwardedRef<Function>) => {
  const {
    areaSelector = "body",
    magnifierSize = 150,
    pixelateValue = 6,
    setColor,
    zoom = 5,
  } = props;

  const eyeDropperRef = useRef(document.createElement("div"));

  const target = useRef<TargetRef>({} as TargetRef);
  const [active, setActive] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isCanvasAvailable, setIsCanvasAvailable] = useState(false);
  (ref as MutableRefObject<Function>).current = setIsCanvasAvailable;

  const handleOnClick = () => {
    setActive(!active);
  };

  const setColorCallback = (hex: string) => {
    const promise = Promise.resolve();
    setColor(hex);
    setCanvas(null);

    promise.then(() => {
      setIsCanvasAvailable(false);
    });
  };

  const magnifierProps: MagnifierProps = {
    active,
    canvas,
    zoom,
    pixelateValue,
    magnifierSize,
    setColorCallback,
    target,
  };

  useEffect(() => {
    if (!isCanvasAvailable) {
      const targetEle = eyeDropperRef.current?.ownerDocument.querySelector(
        areaSelector
      ) as HTMLElement;
      if (targetEle) {
        target.current = {
          element: targetEle,
          rect: targetEle.getBoundingClientRect(),
        };
      }
      html2canvas(target.current.element).then((generatedCanvas) => {
        setCanvas(generatedCanvas);
        setIsCanvasAvailable(true);
      });
    }
  }, [isCanvasAvailable]);

  return (
    <div
      className={`eye-dropper ${active ? "active" : ""} ${
        isCanvasAvailable ? "" : "loading-canvas"
      }`}
      onClick={handleOnClick}
      ref={eyeDropperRef}
    >
      {isCanvasAvailable ? 
        /* This will help rendering custom button values like text or icon */
          props.children
        : props.loader || props.children}
      {<Magnifier {...magnifierProps} />}
    </div>
  );
});

export default EyeDropper;

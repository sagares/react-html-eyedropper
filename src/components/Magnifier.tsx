import React, { useEffect, useRef, useState } from "react";
import { MagnifierProps } from "../types";

interface CanvasContext extends CanvasRenderingContext2D {
  mozImageSmoothingEnabled: boolean;
  msImageSmoothingEnabled: boolean;
  webkitImageSmoothingEnabled: boolean;
};

const Magnifier = (props: MagnifierProps) => {
  const { active, canvas, magnifierSize:size=150, setColorCallback, target} = props;
  let {pixelateValue=6, zoom=5} = props;
  zoom = zoom>10 ? 10 : zoom;
  pixelateValue = pixelateValue > 20 ? 20: pixelateValue;
  const pixelBoxSize = 2*pixelateValue + 3;
  const initialPosition = {
    top:-1 * size, 
    left: -1 * size 
  }

  const magnifierRef = useRef<HTMLDivElement>(document.createElement("div"));
  const magnifierContentRef = useRef<HTMLDivElement>(document.createElement("div"));

  const [magnifierPos, setMagnifierPos] = useState({...initialPosition});
  const [magnifierContentPos, setMagnifierContentPos] = useState({top: 0, left: 0});
  const [magnifierContentDimension, setMagnifierContentDimension] = useState({width: 0, height: 0});
  const [magnifierDisplay, setMagnifierDisplay] = useState("none");

  const prepareContent = () => {
    const magnifier = magnifierRef.current;
    const magnifierContent = magnifierContentRef.current;

    if(!magnifier || !magnifierContent) {
      return;
    }

    magnifierContent.innerHTML = '';
    const { ownerDocument } = magnifierRef.current;
    const bodyOriginal = ownerDocument.body;
    const color = bodyOriginal.style.backgroundColor;

    if (color) {
        magnifier.style.backgroundColor =  color;
    }

    const {rect: {height, width }} = target.current;
    setMagnifierContentDimension(({width, height}));
    canvas && magnifierContent.appendChild(canvas);

    if(canvas) {
      const image = new Image();
      image.src = canvas.toDataURL();
      image.onload = pixelate.bind(null, image, canvas);
    }
  }

  const pixelate = (image: HTMLImageElement, canvas: HTMLCanvasElement) => {
    canvas.height = image.height;
    canvas.width = image.width;
    const ctx = canvas.getContext('2d') as CanvasContext;

    const fw = Math.floor(image.width / pixelateValue);
    const fh = Math.floor(image.height / pixelateValue);

    if(ctx && image) {
      ctx.imageSmoothingEnabled =
      ctx.mozImageSmoothingEnabled =
      ctx.msImageSmoothingEnabled =
      ctx.webkitImageSmoothingEnabled = false;

      ctx.drawImage(image, 0, 0, fw, fh);
      ctx.drawImage(canvas, 0, 0, fw, fh, 0, 0, image.width, image.height);
    }
  }

  const syncViewport = () => {
    const {rect: { left, top }} = target.current;
    const x1 = magnifierRef.current.offsetLeft - left + size/4 + zoom*4;
    const y1 = magnifierRef.current.offsetTop - top + size/4 + zoom*4;
    const currentWindow = magnifierRef.current.ownerDocument.defaultView || window;

    const x2 = currentWindow.pageXOffset;
    const y2 = currentWindow.pageYOffset;
    const left1 = -x1 * zoom - x2 * zoom;
    const top1 = -y1 * zoom - y2 * zoom;
    setMagnifierContentPos({
      top: top1,
      left: left1
    });
  }

  const syncScrollBars = (e: any) => {  
    const ownerDocument = magnifierRef.current.ownerDocument;
    if (e && e.target) {
      syncScroll(e.target);
    } else {
      let scrolled = [];
      let elements = ownerDocument && ownerDocument.querySelectorAll('div');
      for(let i = 0; i < elements.length; i++) {
        if (elements[i].scrollTop > 0) {
          scrolled.push(elements[i]);
        }
      }
      for(let i = 0; i < scrolled.length; i++) {
        if (!isDescendant(magnifierRef.current, scrolled[i])) {
          syncScroll(scrolled[i]);
        }
      }
    }
  }

  const syncScroll = (ctrl: any) => {
    const selectors = [];
    if (ctrl.getAttribute) {
      if (ctrl.getAttribute('id')) {
        selectors.push('#' + ctrl.getAttribute('id'));
      }
      if (ctrl.className) {
        selectors.push('.' + ctrl.className.split(' ').join('.'));
      }
      for(let i = 0; i < selectors.length; i++) {
        let t = ctrl.ownerDocument.body.querySelectorAll(selectors[i]);
        if (t.length === 1) {
          t[0].scrollTop  = ctrl.scrollTop;
          t[0].scrollLeft = ctrl.scrollLeft;
          return true;
        }
      }
    } else if (ctrl === document) {
      syncViewport();
    }
    return false;
  }

  const isDescendant = (parent: any, child: any) => {
    let node = child;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  const syncContent = () => {
    if (active) {
      prepareContent();
      syncViewport();
      syncScrollBars({});
    }
  }

  const moveHandler = (e: MouseEvent) => {
    const {clientX, clientY} = e;
    const { rect: { top, left, width, height }} = target.current;
    if(clientX <= left || clientY <= top || clientX >= left + width || clientY >= top + height) {
      return;
    }
    const left1 = clientX - size/2;
    const top1 = clientY - size/2;

    setMagnifierPos({
      top: top1, 
      left: left1
    });
    syncViewport();
  }

  const makeDraggable = () => {
    const dragHandler = magnifierRef.current as HTMLElement;
    const currentWindow = dragHandler?.ownerDocument.defaultView || window;
    
    currentWindow.addEventListener("mousemove", moveHandler);
    currentWindow.addEventListener('resize', syncContent, false);
    currentWindow.addEventListener('scroll', syncScrollBars, true);
  }

  const getColorFromCanvas = (e: any) => {
    const { clientX, clientY } = e;
    const magnifier = magnifierRef.current;
    const {scrollX, scrollY} = magnifier.ownerDocument.defaultView || window;

    const canvas = magnifier.querySelector("canvas");
    const context = canvas?.getContext('2d');
    const {rect: {left, top}} = target.current;

    const x = (clientX + scrollX - left) * 2 - zoom;
		const y = (clientY + scrollY - top) * 2 - zoom;
    const pixels = context && context.getImageData(x, y, 1, 1).data;
    const hex = pixels && "#" + ("000000" + rgbToHex(pixels[0], pixels[1], pixels[2])).slice(-6);
    
    setColorCallback && setColorCallback(hex);
    setMagnifierPos({...initialPosition});
  }

  useEffect(() => {
    const currentWindow = magnifierRef?.current?.ownerDocument?.defaultView || window;
    if(active) {
      prepareContent();
      setMagnifierDisplay("block");
      makeDraggable();
      syncViewport();
      syncScrollBars({});
    } else {
      setMagnifierPos({...initialPosition});
      setMagnifierDisplay("none");
    }
    return () => currentWindow.removeEventListener("mousemove", moveHandler);
  }, [active]);

  const rgbToHex = (r:number, g:number, b:number) => {
    const componentToHex =  (c: number) => {
        const hex = (+c).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  return active ? (
    <div
      ref={magnifierRef}
      className="magnifier"
      style={{
        display: magnifierDisplay,
        height: `${size}px`,
        left: `${magnifierPos.left}px`,
        top: `${magnifierPos.top}px`,
        width: `${size}px`
      }}
    >
      <div
        ref={magnifierContentRef}
        className="magnifier-content"
        style={{
          height: `${magnifierContentDimension.height}px`,
          left: `${magnifierContentPos.left}px`,
          top: `${magnifierContentPos.top}px`,
          transform: `scale(${zoom})`,
          width: `${magnifierContentDimension.width}px`,
        }}
      ></div>
      <div onClick={getColorFromCanvas}
        className="magnifier-glass"
        style={{
          backgroundSize: `${pixelBoxSize}px ${pixelBoxSize}px`
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 12 12" 
          width={pixelBoxSize} 
          height={pixelBoxSize}
          className="cursor-svg">
          </svg>
      </div>
    </div>
  ) : (
    <div ref={magnifierRef}></div>
  );
};

export default Magnifier;
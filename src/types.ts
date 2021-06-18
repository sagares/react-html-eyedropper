import { MutableRefObject, ReactNode } from "react";

export type TargetRef = {
    element: HTMLElement;
    rect: DOMRect;
};
export interface CommonProps {
    areaSelector?: string;
    pixelateValue?: number;
    magnifierSize?: number;
    zoom?: number;
};

export interface EyeDropperProps extends CommonProps {
    children: ReactNode;
    loader?: ReactNode;
    setColor: Function;
};
export interface MagnifierProps extends CommonProps{
    active: boolean;
    canvas: HTMLCanvasElement | null;
    setColorCallback: Function;
    target: MutableRefObject<TargetRef>;
};
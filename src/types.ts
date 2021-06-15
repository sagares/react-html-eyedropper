export interface EyeDropperProps {
    areaSelector?: string;
    pixelateValue?: number;
    magnifierSize?: number;
    zoom?: number;
};

export interface MagnifierProps extends EyeDropperProps{
    active: boolean;
    setColorCallback: Function;
};
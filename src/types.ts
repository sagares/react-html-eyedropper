export interface EyeDropperProps {
    pixelateValue: number;
    magnifierSize: number;
    zoom: number;
};

export interface MagnifierProps extends EyeDropperProps{
    active: boolean;
    setColorCallback: Function;
};
import React, {ReactNode, useState} from  "react";
import {EyeDropperProps, MagnifierProps} from "../types";
import Magnifier from "./Magnifier";
import './EyeDropper.scss';

interface Props extends EyeDropperProps {
    children: ReactNode;
    setColor: Function;
}

const EyeDropper = (props: Props) => {
    const {magnifierSize=150, pixelateValue = 6, setColor, zoom = 5} = props;

    const [active, setActive] = useState(false);

    const handleOnClick = () => {
        setActive(!active);
    }

    const setColorCallback = (hex: string) => {
        setColor(hex);
        setActive(false);
    }

    const magnifierProps: MagnifierProps = {
        active,
        zoom,
        pixelateValue,
        magnifierSize,
        setColorCallback
    };

    return (
        <div className="eye-dropper">
            <button className={`btn ${active ? "active" : ""}`} onClick={handleOnClick}> 
                {props.children} {/* This will help rendering custom button values like text or icon */}
            </button>
            <Magnifier {...magnifierProps}/>
        </div>
    )
};

export default EyeDropper;
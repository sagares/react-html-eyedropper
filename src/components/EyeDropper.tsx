import React, {ReactNode, useState} from  "react";
import {EyeDropperProps, MagnifierProps} from "../types";
import Magnifier from "./Magnifier";
import './EyeDropper.scss';

interface Props extends EyeDropperProps {
    children: ReactNode;
    setColor: Function;
}

const EyeDropper = (props: Props) => {
    const {pixelateValue, setColor} = props;

    const [active, setActive] = useState(false);

    const handleOnClick = (e: any) => {
        setActive(!active);
    }

    const setColorCallback = (hex: string) => {
        setColor(hex);
        setActive(false);
    }

    const magnifierProps: MagnifierProps = {
        active,
        zoom: 5,
        pixelateValue,
        magnifierSize: 150,
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
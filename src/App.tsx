import React, { useRef, useState } from "react";
import "./App.scss";
import EyeDropper from "./components/EyeDropper";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import Colorize from "@material-ui/icons/Colorize";
import RefreshIcon from "@material-ui/icons/Refresh";

function App() {
  const [hexValue, setHexValue] = useState("#000000");
  const [pixelateValue, setPixelateValue] = useState(6);
  const setIsCanvasAvailableRef = useRef(null);

  const setColor = (hex: string) => {
    setHexValue(hex);
    /** 
     * call setIsCanvasAvaialableRef.current(false) if the color is being applied from another source.
     * */
  };

  const handleMouseEnter = (e: any) => {
    const target = e.target as Element;
    target.classList.add("z-index-10");
  };

  const handleMouseLeave = (e: any) => {
    const target = e.target as Element;
    target.classList.remove("z-index-10");
  };

  const handleSliderChange = (event: any, newValue: any) => {
    setPixelateValue(newValue);
  };

  const divElements = () => {
    const divElements: any = [];

    for (let i = 0; i < 9; i++) {
      divElements.push(
        <div
          className={`box box-${i + 1}`}
          key={`box-${i + 1}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >{`box-${i + 1}`}</div>
      );
    }
    return divElements;
  };

  const style = {
    backgroundColor: hexValue,
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "2px solid #666666",
  };

  const getLoaderIcon = () => (
    <button className="btn loading-btn">
      <RefreshIcon />
    </button>
  );

  return (
    <div className="App">
      <div className="color-form">
        <EyeDropper
          areaSelector=".grid-wrapper"
          setColor={setColor}
          pixelateValue={pixelateValue}
          zoom={5}
          magnifierSize={150}
          loader={getLoaderIcon()}
          ref={setIsCanvasAvailableRef}
        >
          <button className="btn">
            <Colorize />
          </button>
        </EyeDropper>
        <TextField
          id="outlined-read-only-input"
          label="HEX Code"
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          value={hexValue}
        />
        <div className="color-swatch" style={style}></div>
        <Slider
          value={pixelateValue}
          onChange={handleSliderChange}
          getAriaValueText={() => `${pixelateValue}`}
          valueLabelDisplay="auto"
        />
      </div>
      <div className="grid-wrapper">
        {divElements()}
        <div className="box box-nested">
          <div className="nested-box">Button 1</div>
          <div className="nested-box">Button 2</div>
          <div className="nested-box">Button 3</div>
          <div className="nested-box">Button 4</div>
        </div>
      </div>
    </div>
  );
}

export default App;

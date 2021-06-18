# react-html-eydropper
## An eye dropper color picker built using react.

This eyedropper does not just pick color from an image, but it helps picking color from whole web page. It provides a magnifier which on hover of webpage elements, shows the elements in pixelated form inside it. On clicking on a pixelated block it the color is picked.

This eye dropper exposes an EyeDropper component which takes following props:
1. **pixelateValue** - (Optional) A number which decides the mount of pixelation. Higher the number, bigger pixelated blocks. By default it is set to 6.
2. **magnifierSize** - (Optional) Height and width of magnifier. Default magnifier size is 150.
3. **setColor** - (Required) A callback whose argument is picked color.
4. **zoom** - (Optional) Amount of zoom applied on webpage when magnifier is hovered. By default it is set to 5.
5. **areaSelector** - (Optional) CSS selector of the element, only on which eydropper will be visible. By default this is `body`.
6. **loader** - (Optional) Since the canvas generation may take sometime, a loader element can be shown in place of actual eye dropper.

###Example
```
<EyeDropper setColor={(hex:string) => console.log(hex)}>
     <button className="btn">Eye Dropper</button>
</EyeDropper>

```

<img width="1068" alt="Screenshot 2021-05-31 at 1 42 28 PM" src="https://user-images.githubusercontent.com/31887015/120173049-4870e680-c221-11eb-9f99-faec1830563e.png">

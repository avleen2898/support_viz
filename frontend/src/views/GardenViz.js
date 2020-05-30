import React from 'react';
import p5 from 'p5';

class GardenViz extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  Sketch = (p) => {
    // Ignore the friendly errors that come from the copy function
    p.disableFriendlyErrors = true;
    // Array to store all supporters from json file
    let allSupporters = [];
    // Set a limit for the maximum number of flowers on the screen -- to be used in future implementations
    let flowersOnScreen = 15;
    // Indices for starting and ending supporter index from the supporter array -- to be used in future implementations
    let startingFlowerIndex = 0;
    let endingFlowerIndex = 0;
    // Variable to store backdrop
    let bgImg;
    // Variable to read in json data
    let data;
    // Variables to set the color theme of the garden
    let colorTheme;
    let colorThemePurple = ['#990099', '#ad33ad', '#b84db8', '#c671c6', '#d494d4', '#dca6dc'];
    let colorThemeOrange = ['#ff6633', '#ff7359', '#ff7359', '#ff826c', '#ff927e', '#ffa898'];
    // Variables to set the stroke theme of the garden
    let strokeTheme;
    let strokeThemePurple = '#A9A9A9';
    let strokeThemeOrange = '#FFD500';
    // Variables to store the current color and stroke themes
    let currentColorTheme;
    let currentStrokeTheme;
    // Store all x and y coordinates of flowers on screen to change cursor on mouse over
    let allCoordinates = [];
    // Store all start locations
    let allStartLocations = [];

    p.preload = () => {
      // data = loadJSON("data.json");
      bgImg = p.loadImage(require("../images/background.jpg"));
    };

    p.setup = () => {
      let network = p.createCanvas(p.windowWidth, p.windowHeight);
      network.id("supportViz");
      // Attach mouse moved event to the canvas to change cursor for viewing supporter details
      // network.mouseMoved(changeCursor);

      // for (let i = 0; i < Object.keys(data).length; i++) {
      //   // Load supporter image before pushing them to the array
      //   loadImage("images/"+ data[i].face, img => {
      //     imageDoneLoading(i, img)
      //   });
      // }

      // Set default color and stroke themes
      currentColorTheme = colorThemePurple;
      currentStrokeTheme = strokeThemePurple;
    };

    p.draw = () => {
      // Set current color and stroke themes
      colorTheme = currentColorTheme;
      strokeTheme = currentStrokeTheme;
      allCoordinates = [];
      p.background(bgImg);
      // Loop to draw each flower on the canvas
      // for (let i = 0; i < allSupporters.length; i++) {
      //   push();
      //   let f = allSupporters[i];
      //   f.flowerColor = f.calculateColor();
      //   translate(f.startLocation, height);
      //   // New x and y coordinates based on translation
      //   f.x = f.startLocation;
      //   f.y = height;
      //   rotate(radians(f.startAngle));
      //   let rot_x = (f.x * cos(radians(f.startAngle))) - (f.y * sin(radians(f.startAngle)));
      //   let rot_y = (f.x * sin(radians(f.startAngle))) + (f.y * cos(radians(f.startAngle)));
      //   // New x and y coordinates based on rotation
      //   f.x = rot_x;
      //   f.y = rot_y;
      //   f.flowerBranch(f.segmentsLength);
      //   allCoordinates.push({x: f.x, y: f.y});
      //   pop();
      // }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  render() {
    return (
      <div ref={this.myRef}>
      </div>
    )
  }
}

export default GardenViz;
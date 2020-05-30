import React from 'react';
import Sketch from 'react-p5';
import Flower from 'Flower';

class GardenViz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bgImg: '',
      allSupporters: [],
      flowersOnScreen: 15,
      startingFlowerIndex: 0,
      endingFlowerIndex: 0,
      data: [],
      colorTheme: '',
      colorThemePurple: ['#990099', '#ad33ad', '#b84db8', '#c671c6', '#d494d4', '#dca6dc'],
      colorThemeOrange: ['#ff6633', '#ff7359', '#ff7359', '#ff826c', '#ff927e', '#ffa898'],
      strokeTheme: '',
      strokeThemePurple: '#A9A9A9',
      strokeThemeOrange: '#FFD500',
      currentColorTheme: '',
      currentStrokeTheme: '',
      allCoordinates: [],
      allStartLocations: []
    };
  }

  updateTheme() {
    this.setState({currentColorTheme: this.state.colorThemePurple, currentStrokeTheme: this.state.strokeThemePurple});
  }

  updateCanvas(p5) {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  }

  preload = (p5) => {
    console.log("Preload is being called");
    // Server needs to return the image
    let img = p5.loadImage(require("../images/background.jpg"));
    this.setState({bgImg: img});
  };

  setup = (p5, canvasParentRef) => {
    p5.disableFriendlyErrors = true;
    let network = p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    network.id("supportViz");
    this.updateTheme();
  };

  draw = (p5) => {
    p5.background(this.state.bgImg);
  };

  render() {
    return (
      <div>
        <Flower communityType={1} prayers={[6, 5, 4, 3, 2, 1]}/>
        <Sketch preload={this.preload} setup={this.setup} draw={this.draw} windowResized={this.updateCanvas}/>
      </div>
      );
  }
}

export default GardenViz;
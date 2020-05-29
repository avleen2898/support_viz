import React from 'react';
import Sketch from 'react-p5';

class GardenViz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
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
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  updateWindowDimensions() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
    // let img = p5.loadImage(require("../images/background.jpg"));
    // this.setState({bgImg: img});
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateTheme() {
    this.setState({currentColorTheme: this.state.colorThemePurple, currentStrokeTheme: this.state.strokeThemePurple});
  }

  preload = (p5) => {
    console.log("Preload is being called");
    // Server needs to return the image
    let img = p5.loadImage(require("../images/background.jpg"));
    this.setState({bgImg: img});
  };

  setup = (p5, canvasParentRef) => {
    p5.disableFriendlyErrors = true;
    p5.createCanvas(this.state.width, this.state.height).parent(canvasParentRef);
    this.updateTheme();
  };

  draw = (p5) => {
    p5.background(this.state.bgImg);
    p5.ellipse(100, 100, 70, 70);
  };

  render() {
    return <Sketch preload={this.preload} setup={this.setup} draw={this.draw} />;
  }
}

export default GardenViz;
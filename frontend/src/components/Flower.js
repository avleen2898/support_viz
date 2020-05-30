import React from 'react';

class Flower extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flowerColor: this.calculateColor(),
      startLocation: this.calculateStartLocation(props.communityType),
      segmentsLength: this.calculateSegmentsLength(),
      flowerPetalNum: this.calculatePetals(props.prayers),
    };
  }

  calculateColor() {
    console.log("Calculating flower color");
  }

  calculateStartLocation() {
    console.log("Calculating start location");
  }

  calculateSegmentsLength() {
    console.log("Calculating segment length");
  }

  calculatePetals() {
    console.log("Calculating petal numbers");
  }

  render() {
    return (
      null
    );
  }
}

export default Flower;
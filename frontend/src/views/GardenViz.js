import React from 'react';
import p5 from 'p5';

class GardenViz extends React.Component {
  // props can be the original data; receives news props when data is updated, use componentDidUpdate to render visualization again
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
    // Storing for experimentation
    let brunoImg;
    // Variable to read in json data
    let data = [{
      "prayers": [6, 6, 5, 4, 1, 1],
      "communityType": 3,
      "relationshipLength": 2,
      "face": "bruno.jpg",
      "signUpTime": 1020303,
      "name": "Bruno"
    }];
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
      bgImg = p.loadImage(require("../images/background.jpg"));
      brunoImg = p.loadImage(require("../images/bruno.jpg"));
    };

    p.setup = () => {
      let network = p.createCanvas(p.windowWidth, p.windowHeight);
      network.id("supportViz");
      // Attach mouse moved event to the canvas to change cursor for viewing supporter details
      network.mouseMoved(p.changeCursor);

      // for (let i = 0; i < Object.keys(data).length; i++) {
      //   // Load supporter image before pushing them to the array
      //   loadImage("images/"+ data[i].face, img => {
      //     imageDoneLoading(i, img)
      //   });
      // }
      // let imgPath = require("../images/bruno.jpg");
      // p.loadImage(imgPath, img => {
      //   imageDoneLoading(0, img);
      // });

      // Set default color and stroke themes
      currentColorTheme = colorThemePurple;
      currentStrokeTheme = strokeThemePurple;
    };

    // Create flower objects out of supporter data in json file
    function imageDoneLoading(supporter, face) {
      allSupporters.push(new Flower(data[supporter].prayers, data[supporter].communityType, data[supporter].relationshipLength, data[supporter].face,
        data[supporter].name, face));
    }

    p.draw = () => {
      // Set current color and stroke themes
      colorTheme = currentColorTheme;
      strokeTheme = currentStrokeTheme;
      allCoordinates = [];
      p.background(bgImg);
      // Loop to draw each flower on the canvas
      // for (let i = 0; i <= allSupporters.length; i++) {
      imageDoneLoading(0, brunoImg);
      let i = 0;
        p.push();
        let f = allSupporters[i];
        f.flowerColor = f.calculateColor();
        p.translate(f.startLocation, p.height);
        // New x and y coordinates based on translation
        f.x = f.startLocation;
        f.y = p.height;
        p.rotate(p.radians(f.startAngle));
        let rot_x = (f.x * p.cos(p.radians(f.startAngle))) - (f.y * p.sin(p.radians(f.startAngle)));
        let rot_y = (f.x * p.sin(p.radians(f.startAngle))) + (f.y * p.cos(p.radians(f.startAngle)));
        // New x and y coordinates based on rotation
        f.x = rot_x;
        f.y = rot_y;
        f.flowerBranch(f.segmentsLength);
        allCoordinates.push({x: f.x, y: f.y});
        p.pop();
      // }
    };

    class Flower {
      constructor(prayers, communityType, relationshipLength, faceImageName, name, face) {
        this.prayers = prayers;
        this.communityType = communityType;
        this.relationshipLength = relationshipLength;
        this.faceImageName = faceImageName;
        this.name = name;
        this.face = face;

        this.flowerColor = this.calculateColor();
        this.startLocation = this.calculateStartLocation(this.communityType);
        this.segmentsLength = this.calculateSegmentLength(this.relationshipLength);
        this.flowerRadius = p.map(this.segmentsLength, 50, 80, 40, 60);
        this.flowerPetalNum = this.calculatePetals(this.prayers);
        this.startAngle = p.random(-10, 10);
        this.angle = p.map(this.startAngle, -10, 10, -10, 10);
        // The changes in num and theta drive the swaying motion of the flower
        this.num = 0;
        this.theta = 0;
        // x and y coordinates of the center of a flower
        this.x = 0;
        this.y = 0;
        // Supporter details to be shown on click
        this.showSupporterDetails = false;
        this.recentSupporter = false;
        this.div = p.createDiv("");
        this.initializeSupporterDetails();
      }

      flowerBranch(len) {
        // Draws the little ellipses on the flower stem
        p.stroke('#008000');
        // stroke(69, 139, 0, 150);
        len *= 0.8;
        let t = p.map(len, 1, 70, 1, 10);
        p.ellipse(0, 0, t/3, t/3);
        p.strokeWeight(t);
        this.theta = this.angle + p.sin(len + this.num)*5;
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        // Update y coordinate based on translations
        this.y = this.y + (-len);
        if (len > 5) {
          p.push();
          p.rotate(p.radians(-this.theta));
          this.flowerBranch(len);
          p.pop();
        }
        else {
          this.flower();
        }
        // Modify this number to decide amount of swaying
        this.num += 0.007;
      }

      flower() {
        if (this.recentSupporter) {
          p.stroke('#D2691E');
          p.fill('#FFDF00');
        } else {
          p.stroke(p.color(strokeTheme));
          p.fill(this.flowerColor);
        }
        // Rhodonea curve needs different drawing equations for even and odd petal numbers
        if (this.flowerPetalNum % 2 === 0) {
          let k = this.flowerPetalNum/2;
          p.beginShape();
          for (let i=0; i<p.TWO_PI; i+=0.01) {
            let x = this.flowerRadius * p.sin(k*i) * p.sin(k*i) * p.cos(i);
            let y = this.flowerRadius * p.sin(k*i) * p.sin(k*i) * p.sin(i);
            p.vertex(x, y);
          }
          p.endShape();
        } else {
          p.beginShape();
          for (let i=0; i<p.TWO_PI; i+=0.01) {
            let x = this.flowerRadius* p.sin(this.flowerPetalNum*i) * p.cos(i);
            let y = this.flowerRadius * p.sin(this.flowerPetalNum*i) * p.sin(i);
            p.vertex(x, y);
          }
          p.endShape();
        }

        // Make a circular mask for the image
        let cmask = p.createGraphics(this.flowerRadius, this.flowerRadius);
        cmask.beginShape();
        cmask.circle(this.flowerRadius/2, this.flowerRadius/2, this.flowerRadius);
        cmask.endShape();
        this.face.mask(cmask);
        p.image(this.face, 0 - (this.flowerRadius/2), 0 - (this.flowerRadius/2), this.flowerRadius, this.flowerRadius);
      }

      // Calculates the number of petals for the flower (min: 3, max: 15)
      calculatePetals(prayers) {
        if (prayers.length < 3) return 3;
        if (prayers.length > 15) return 15;
        return prayers.length;
      }

      // Calculates the color of the flower based on most recent prayer
      calculateColor() {
        let lastPrayer = this.prayers[this.prayers.length - 1];
        if (lastPrayer === 1) {
          return p.color(colorTheme[0]);
        } else if (lastPrayer === 2) {
          return p.color(colorTheme[1]);
        } else if (lastPrayer === 3) {
          return p.color(colorTheme[2]);
        } else if (lastPrayer === 4) {
          return p.color(colorTheme[3]);
        } else if (lastPrayer === 5) {
          return p.color(colorTheme[4]);
        } else {
          return p.color(colorTheme[5]);
        }
      }

      // Mapping length of flower stem based on relationship length
      calculateSegmentLength(relationshipLength) {
        let len;
        if (relationshipLength === 0) {
          len = p.random(p.height/4, p.height/3);
        } else if (relationshipLength === 1) {
          len = p.random(p.height/3, p.height/2);
        } else {
          len = p.random(p.height/2, p.height);
        }
        return p.map(len, p.height/4, p.height, 60, 160);
      }

      // Calculating start location for the flower based on community type
      calculateStartLocation(communityType) {
        let segment = (p.width - 200)/3;
        let location, lowerBound, upperBound, locationValid;
        locationValid = false;
        while (!locationValid) {
          if (communityType === 1) {
            lowerBound = 100;
            upperBound = 100 + segment;
            location = p.random(lowerBound, upperBound);
          } else if (communityType === 2) {
            lowerBound = 100 + segment;
            upperBound = 100 + (2 * segment);
            location = p.random(lowerBound, upperBound);
          } else if (communityType === 3) {
            lowerBound = 100 + (2 * segment);
            upperBound = p.width - 100;
            location = p.random(lowerBound, upperBound);
          }
          // Check if the location is available and not already taken by another flower
          locationValid = checkLocationValid(location);
        }
        return location;
      }

      // Function to populate the div for a supporter with all their details
      initializeSupporterDetails() {
        this.div.addClass('supporterDetailDiv');
        let img = p.createImg("images/" + this.faceImageName, 'Supporter Image');
        let name = p.createP(this.name);
        let lastActive = p.createP("Last Active: " + this.getLastActive());
        let community = p.createP("Community: " + this.getCommunity());
        this.div.child(img);
        this.div.child(name);
        this.div.child(lastActive);
        this.div.child(community);
        this.div.hide();
      }

      // Handle click events on the flower to show supporter information
      handleClick() {
        this.showSupporterDetails = !this.showSupporterDetails;
        let d = p.dist(p.mouseX, p.mouseY, this.x, this.y);
        if (d < this.flowerRadius && this.showSupporterDetails) {
          this.div.position(this.x, this.y);
          this.div.show();
          document.getElementById('supportViz').classList.add('blurCanvas');
        } else {
          this.div.hide();
          p.cursor("default");
        }
      }

      // Returns a string that tells when the supporter was last active
      getLastActive() {
        let lastPrayer = this.prayers[this.prayers.length - 1];
        switch(lastPrayer) {
          case 1: return "Last hour";
            break
          case 2: return "Last day";
            break
          case 3: return "Last 3 days";
            break
          case 4: return "Last week";
            break
          case 5: return "Last month";
            break
          case 6: return "Last year";
            break
          default: return "Last year";
        }
      }

      // Returns a string that tells the community of the supporter
      getCommunity() {
        switch(this.communityType) {
          case 1: return "Church";
            break
          case 2: return "Gym";
            break
          case 3: return "Family";
            break
          default: return "Unknown";
        }
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    // Mouse pressed event for handling click events on flowers
    p.mousePressed = () => {
      // document.getElementById('supportViz').classList.remove('blurCanvas');
      for (let i = 0; i < allSupporters.length; i++) {
        allSupporters[i].handleClick();
      }
    };

    // Function to change cursor when user hovers over a flower
    p.changeCursor = () => {
      for (let i = 0; i < allCoordinates.length; i++) {
        if (p.mouseX >= (allCoordinates[i].x - 50) && p.mouseX <= (allCoordinates[i].x + 50) &&
          p.mouseY >= (allCoordinates[i].y - 50) && p.mouseY <= (allCoordinates[i].y + 50)) {
          p.cursor("zoom-in");
        }
      }
    };

    // Function to check that start location is spaced enough based on other flowers already present on the screen
    function checkLocationValid(location) {
      for (let i = 0; i < allStartLocations.length; i++) {
        if ((location >= allStartLocations[i] && location <= (allStartLocations[i] + 30)) ||
          (location >= (allStartLocations[i] - 30) && location <= allStartLocations[i])) {
          return false;
        }
      }
      allStartLocations.push(location);
      return true;
    }

  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
    console.log(this.myP5);
  }

  // Whenever there is a change in data
  componentDidUpdate(prevProps) {
    // this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  // Cleanup code would go here
  componentWillUnmount() {

  }

  render() {
    return (
      <div ref={this.myRef}>
      </div>
    )
  }
}

export default GardenViz;
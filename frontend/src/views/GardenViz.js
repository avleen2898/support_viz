import React from 'react';
import Axios from 'axios';
import p5 from 'p5';
import '../styles/gardenStyles.css';

let data;

class GardenViz extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {};
    }

    componentDidMount() {
        Axios.get('/api/garden/view/1234').then(res => {
            console.log(res.data);
            data = res.data.data;
            new p5(this.Sketch, this.myRef.current);
        }).catch(err => {
            console.log(err);
        });
    }

    // TODO: props should change based on change in data from backend
    componentDidUpdate(prevProps) {
    }

    // Cleanup code would go here
    componentWillUnmount() {

    }

    Sketch = (p) => {
        // Ignore the friendly errors that come from the copy function
        p.disableFriendlyErrors = true;
        // An array that stores all the flower objects created from supporter data
        let allSupporters = [];
        // Set a limit for the maximum number of flowers on the screen
        let flowersOnScreen = 15;
        // Indices for starting and ending supporter index from the supporter array -- to be used in future implementations
        let startingFlowerIndex = 0;
        let endingFlowerIndex = 0;
        // Variable to store backdrop
        let bgImg;
        // Variables to set the color theme of the garden
        let colorTheme;
        let colorThemePurple = ['#990099', '#ad33ad', '#b84db8', '#c671c6', '#d494d4', '#dca6dc'];
        let colorThemeOrange = ['#ff6633', '#ff7359', '#ff7359', '#ff826c', '#ff927e', '#ffa898'];
        // Variables to set the stroke theme of the garden
        let strokeTheme;
        let strokeThemePurple = '#A9A9A9';
        let strokeThemeOrange = '#FFD500';
        // Store all x and y coordinates of flowers on screen to change cursor on mouse over
        let allCoordinates = [];
        // Store all start locations
        let allStartLocations = [];
        // Variable to check for updates to flower locations on window resized events
        let windowResized = false;

        p.preload = () => {
            bgImg = p.loadImage(require("../images/background.jpg"));
        };

        p.setup = () => {
            let network = p.createCanvas(p.windowWidth, p.windowHeight);
            network.id("supportViz");
            // Attach mouse moved event to the canvas to change cursor for viewing supporter details
            network.mouseMoved(p.changeCursor);

            // Set default color and stroke themes
            colorTheme = colorThemeOrange;
            strokeTheme = strokeThemeOrange;

            for (let i = 0; i < Object.keys(data).length; i++) {
                // Load supporter image before pushing them to the array
                let imgPath = require("../images/" + data[i].face);
                p.loadImage(imgPath, img => {
                    imageDoneLoading(i, img)
                });
            }
        };

        // Create flower objects out of supporter data in json file
        function imageDoneLoading(supporter, face) {
            let firstLoad = true;
            allSupporters.push(new Flower(data[supporter].prayers, data[supporter].communityType, data[supporter].face, data[supporter].name, face, firstLoad));
        }

        p.draw = () => {
            allCoordinates = [];
            p.background(bgImg);
            // Loop to draw each flower on the canvas
            for (let i = 0; i < allSupporters.length; i++) {
                p.push();
                let f = allSupporters[i];
                // Check for window resized events
                if (windowResized) {
                    f.startLocation = f.calculateStartLocation(f.communityType);
                }
                if (f.segmentsLength < f.maxSegmentsLength) {
                    f.segmentsLength += 0.5;
                    f.flowerRadius = f.calculateFlowerRadius(f.segmentsLength);
                }
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
            }
            windowResized = false;
        };

        class Flower {
            constructor(prayers, communityType, faceImageName, name, face, firstLoad) {
                this.prayers = prayers;
                this.communityType = communityType;
                this.faceImageName = faceImageName;
                this.name = name;
                this.face = face;
                this.firstLoad = firstLoad;

                this.flowerColor = this.calculateColor();
                this.startLocation = this.calculateStartLocation(this.communityType);
                this.maxSegmentsLength = this.calculateMaxSegmentLength();
                this.segmentsLength = this.firstLoad ? 10: this.maxSegmentsLength;
                this.flowerRadius = this.calculateFlowerRadius(this.segmentsLength);
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
                p.ellipse(0, 0, t / 3, t / 3);
                p.strokeWeight(t);
                this.theta = this.angle + p.sin(len + this.num) * 5;
                p.line(0, 0, 0, -len);
                p.translate(0, -len);
                // Update y coordinate based on translations
                this.y = this.y + (-len);
                if (len > 5) {
                    p.push();
                    p.rotate(p.radians(-this.theta));
                    this.flowerBranch(len);
                    p.pop();
                } else {
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
                    let k = this.flowerPetalNum / 2;
                    p.beginShape();
                    for (let i = 0; i < p.TWO_PI; i += 0.01) {
                        let x = this.flowerRadius * p.sin(k * i) * p.sin(k * i) * p.cos(i);
                        let y = this.flowerRadius * p.sin(k * i) * p.sin(k * i) * p.sin(i);
                        p.vertex(x, y);
                    }
                    p.endShape();
                } else {
                    p.beginShape();
                    for (let i = 0; i < p.TWO_PI; i += 0.01) {
                        let x = this.flowerRadius * p.sin(this.flowerPetalNum * i) * p.cos(i);
                        let y = this.flowerRadius * p.sin(this.flowerPetalNum * i) * p.sin(i);
                        p.vertex(x, y);
                    }
                    p.endShape();
                }

                // Make a circular mask for the image
                let cmask = p.createGraphics(this.flowerRadius, this.flowerRadius);
                cmask.beginShape();
                cmask.circle(this.flowerRadius / 2, this.flowerRadius / 2, this.flowerRadius);
                cmask.endShape();
                this.face.mask(cmask);
                p.image(this.face, 0 - (this.flowerRadius / 2), 0 - (this.flowerRadius / 2), this.flowerRadius, this.flowerRadius);
            }

            // Calculates the number of petals for the flower (min: 3, max: 15)
            calculatePetals = (prayers) => {
                if (prayers.length < 3) return 3;
                if (prayers.length > 15) return 15;
                return prayers.length;
            };

            // Calculates the color of the flower based on most recent prayer
            calculateColor = () => {
                let colorIndex = Math.floor(Math.random() * 6);
                return p.color(colorTheme[colorIndex]);
            };

            // Calculating start location for the flower based on community type
            calculateStartLocation = (communityType) => {
                let segment = (p.width - 200) / 3;
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
            };

            calculateMaxSegmentLength = () => {
                return Math.floor(Math.random() * (150 - 50) + 50);
            };

            calculateFlowerRadius = (segmentsLength) => {
                return p.map(segmentsLength, 50, 150, 50, 70);
            };

            // Function to populate the div for a supporter with all their details
            initializeSupporterDetails = () => {
                this.div.addClass('supporterDetailDiv');
                let img = p.createImg(require("../images/" + this.faceImageName), 'Supporter Image');
                let name = p.createP(this.name);
                let lastActive = p.createP("Last Active: " + this.getLastActive());
                let community = p.createP("Community: " + this.getCommunity());
                this.div.child(img);
                this.div.child(name);
                this.div.child(lastActive);
                this.div.child(community);
                this.div.hide();
            };

            // Handle click events on the flower to show supporter information
            handleClick = () => {
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
            };

            // Returns a string that tells when the supporter was last active
            getLastActive = () => {
                let lastPrayer = this.prayers[this.prayers.length - 1];
                switch (lastPrayer) {
                    case 1:
                        return "Last hour";
                        break;
                    case 2:
                        return "Last day";
                        break;
                    case 3:
                        return "Last 3 days";
                        break;
                    case 4:
                        return "Last week";
                        break;
                    case 5:
                        return "Last month";
                        break;
                    case 6:
                        return "Last year";
                        break;
                    default:
                        return "Last year";
                }
            };

            // Returns a string that tells the community of the supporter
            getCommunity = () => {
                switch (this.communityType) {
                    case 1:
                        return "Church";
                        break;
                    case 2:
                        return "Gym";
                        break;
                    case 3:
                        return "Family";
                        break;
                    default:
                        return "Unknown";
                }
            }
        }

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
            windowResized = true;
        };

        // Mouse pressed event for handling click events on flowers
        p.mousePressed = () => {
            // document.getElementById('supportViz').classList.remove('blurCanvas');
            for (let i = 0; i < allSupporters.length; i++) {
                allSupporters[i].handleClick();
            }
            let allDetailDivs = Array.from(document.querySelectorAll('.supporterDetailDiv'));
            let removeBlur = allDetailDivs.every((div) => {
                let style = window.getComputedStyle(div);
                return style.display === 'none';
            });
            if (removeBlur) {
                document.getElementById('supportViz').classList.remove('blurCanvas');
            }
        };

        // TODO: Fix logic for changing cursor
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

    render() {
        return (
            <div ref={this.myRef}>
            </div>
        )
    }
}

export default GardenViz;
/*
 Controller. This part handles the logic between objects and view.
 */

function playSound(soundfile) {
    document.getElementById("span").innerHTML=
        "<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />";
}
window.addEventListener("load",function() {
    playSound("HellMarch.mp3");
},false);


var game = new Game();
var i = 0;
var p1 = document.getElementById('p1');

function init(){
    if (game.init())
        game.start();
}

var MarineSpawnTimer = 3;
var ZerglingSpawnTimer = 1;

window.addEventListener("load",function() {
// Create 2 marines every MarineSpawnTimer seconds.
    window.setInterval(function(){
        var newRine = new Marine("Terran",imgRepo.TerranMarineBlue);
        UnitArray[UnitArray.length] = newRine;
        ObjectArray[ObjectArray.length] = newRine;
        newRine.pos(Math.floor(Math.random() * game.unitCanvas.width - newRine.width),game.unitCanvas.height + 0);
        newRine.draw();
        var newRine2 = new Marine("Terran",imgRepo.TerranMarineRed);
        UnitArray[UnitArray.length] = newRine2;
        ObjectArray[ObjectArray.length] = newRine2;
        newRine2.pos(Math.floor(Math.random() * game.unitCanvas.width - newRine2.width),game.unitCanvas.height + 0);
        newRine2.draw();
    },MarineSpawnTimer * 1000);

// Create 2 lings every ZerglingSpawnTimer seconds.
    window.setInterval((function(){
        var newLing = new Zergling("Zerg",imgRepo.ZergZerglingPurple);
        UnitArray[UnitArray.length] = newLing;
        ObjectArray[ObjectArray.length] = newLing;
        newLing.pos(Math.floor(Math.random() * game.unitCanvas.width - newLing.width),-10);
        newLing.draw();
        var newLing2 = new Zergling("Zerg",imgRepo.ZergZerglingGreen);
        UnitArray[UnitArray.length] = newLing2;
        ObjectArray[ObjectArray.length] = newLing2;
        newLing2.pos(Math.floor(Math.random() * game.unitCanvas.width - newLing2.width),-10);
        newLing2.draw();
    }),ZerglingSpawnTimer * 1000);
},false);

/*
 Model. All objects are located here
 */




// Global Variables
var ObjectArray = []; // Holds all objects in the game
var StructureArray = []; // Holds all structures in the game
var UnitArray = []; // Holds all units in the game
var CurrentlySelected; // used to deselect unit/buildings that die;





// Image repository singleton. Every image only have to be loaded once this way.
var imgRepo = new function(){
    var ImagesLoaded = 0;
    var AllImages = 30;     // Very important that this is updated every time a new image is added. Fun will ensue if it is wrong.
    this.CheckIfImagesLoaded = function () {
        ImagesLoaded += 1;
        if(ImagesLoaded === AllImages){ // When all images are loaded, calls the init function
            init();
        }
    };

    // background
    this.background = new Image();
    this.background.onload = this.CheckIfImagesLoaded;

    // Terran
    // Structures. Blue and Red;
    this.TerranCCBlue = new Image();
    this.TerranCCBlue.onload = this.CheckIfImagesLoaded;
    this.TerranCCRed = new Image();
    this.TerranCCRed.onload = this.CheckIfImagesLoaded;
    this.TerranBarracksBlue = new Image();
    this.TerranBarracksBlue.onload = this.CheckIfImagesLoaded;
    this.TerranBarracksRed = new Image();
    this.TerranBarracksRed.onload = this.CheckIfImagesLoaded;
    this.TerranSupplyDepotBlue = new Image();
    this.TerranSupplyDepotBlue.onload = this.CheckIfImagesLoaded;
    this.TerranSupplyDepotRed = new Image();
    this.TerranSupplyDepotRed.onload = this.CheckIfImagesLoaded;
    this.TerranEngineeringBayBlue = new Image();
    this.TerranEngineeringBayBlue.onload = this.CheckIfImagesLoaded;
    this.TerranEngineeringBayRed = new Image();
    this.TerranEngineeringBayRed.onload = this.CheckIfImagesLoaded;
    this.TerranFactoryBlue = new Image();
    this.TerranFactoryBlue.onload = this.CheckIfImagesLoaded;
    this.TerranFactoryRed = new Image();
    this.TerranFactoryRed.onload = this.CheckIfImagesLoaded;
    // Units. Blue and Red.
    this.TerranMarineBlue = new Image();
    this.TerranMarineBlue.onload = this.CheckIfImagesLoaded;
    this.TerranMarineRed = new Image();
    this.TerranMarineRed.onload = this.CheckIfImagesLoaded;
    // Icons - Structures
    this.BarracksIcon = new Image();
    this.BarracksIcon.onload = this.CheckIfImagesLoaded;
    this.SupplyDepotIcon = new Image();
    this.SupplyDepotIcon.onload = this.CheckIfImagesLoaded;
    this.EngineeringBayIcon = new Image();
    this.EngineeringBayIcon.onload = this.CheckIfImagesLoaded;
    this.FactoryIcon = new Image();
    this.FactoryIcon.onload = this.CheckIfImagesLoaded;
    this.CommandCenterIcon = new Image();
    this.CommandCenterIcon.onload = this.CheckIfImagesLoaded;
    this.PointDefenseDroneIcon = new Image();
    this.PointDefenseDroneIcon.onload = this.CheckIfImagesLoaded;
    // icons - Units
    this.MarineIcon = new Image();
    this.MarineIcon.onload = this.CheckIfImagesLoaded;


    // Zerg
    // Structures. Purple and green;
    this.ZergEarlyStageHivePurple = new Image();
    this.ZergEarlyStageHivePurple.onload = this.CheckIfImagesLoaded;
    this.ZergEarlyStageHiveGreen = new Image();
    this.ZergEarlyStageHiveGreen.onload = this.CheckIfImagesLoaded;
    this.ZergMediumStageHivePurple = new Image();
    this.ZergMediumStageHivePurple.onload = this.CheckIfImagesLoaded;
    this.ZergMediumStageHiveGreen = new Image();
    this.ZergMediumStageHiveGreen.onload = this.CheckIfImagesLoaded;
    this.ZergSpawningStructurePurple = new Image();
    this.ZergSpawningStructurePurple.onload = this.CheckIfImagesLoaded;
    this.ZergSpawningStructureGreen = new Image();
    this.ZergSpawningStructureGreen.onload = this.CheckIfImagesLoaded;
    //Units
    this.ZergZerglingPurple = new Image();
    this.ZergZerglingPurple.onload = this.CheckIfImagesLoaded;
    this.ZergZerglingGreen = new Image();
    this.ZergZerglingGreen.onload = this.CheckIfImagesLoaded;
    // Icons
    this.ZerglingIcon = new Image();
    this.ZerglingIcon.onload = this.CheckIfImagesLoaded;

    // Other
    // Icons
    this.BuildingSpotIcon = new Image();
    this.BuildingSpotIcon.onload = this.CheckIfImagesLoaded;


    // sources

    // Background
    this.background.src = "Images/Background/sands_contrast.png";

    // Terran
    // Structures
    this.TerranSupplyDepotBlue.src = "Images/Structures/Terran/TerranSupplyDepotBlue.png";
    this.TerranSupplyDepotRed.src = "Images/Structures/Terran/TerranSupplyDepotRed.png";
    this.TerranCCBlue.src = "Images/Structures/Terran/TerranCCBlue.png";
    this.TerranCCRed.src = "Images/Structures/Terran/TerranCCRed.png";
    this.TerranBarracksBlue.src = "Images/Structures/Terran/TerranBarracksBlue.png";
    this.TerranBarracksRed.src = "Images/Structures/Terran/TerranBarracksRed.png";
    this.TerranEngineeringBayBlue.src = "Images/Structures/Terran/TerranEngineeringBayBlue.png";
    this.TerranEngineeringBayRed.src = "Images/Structures/Terran/TerranEngineeringBayRed.png";
    this.TerranFactoryBlue.src = "Images/Structures/Terran/TerranFactoryBlue.png";
    this.TerranFactoryRed.src = "Images/Structures/Terran/TerranFactoryRed.png";
    // Units
    this.TerranMarineBlue.src = "Images/Units/Terran/TerranMarineBlue.png";
    this.TerranMarineRed.src = "Images/Units/Terran/TerranMarineRed.png";
    // Icons
    this.SupplyDepotIcon.src = "Images/Icons/Terran/Structures/supply-depot.gif";
    this.EngineeringBayIcon.src = "Images/Icons/Terran/Structures/engineering-bay.gif";
    this.FactoryIcon.src = "Images/Icons/Terran/Structures/factory.gif";
    this.CommandCenterIcon.src = "Images/Icons/Terran/Structures/command-center.gif";
    this.PointDefenseDroneIcon.src = "Images/Icons/Terran/Structures/point-defense-drone.gif";
    this.BarracksIcon.src = "Images/Icons/Terran/Structures/barracks.gif";
    this.MarineIcon.src = "Images/Icons/Terran/Units/marine.gif";

    // Zerg
    // Structures
    this.ZergMediumStageHivePurple.src = "Images/Structures/Zerg/ZergMediumStageHivePurple.png";
    this.ZergMediumStageHiveGreen.src = "Images/Structures/Zerg/ZergMediumStageHiveGreen.png";
    this.ZergEarlyStageHivePurple.src = "Images/Structures/Zerg/ZergEarlyStageHivePurple.png";
    this.ZergEarlyStageHiveGreen.src = "Images/Structures/Zerg/ZergEarlyStageHiveGreen.png";
    this.ZergSpawningStructurePurple.src = "Images/Structures/Zerg/ZergSpawningStructurePurple.png";
    this.ZergSpawningStructureGreen.src = "Images/Structures/Zerg/ZergSpawningStructureGreen.png";
    // Units
    this.ZergZerglingPurple.src = "Images/Units/Zerg/ZergZerglingPurple.png";
    this.ZergZerglingGreen.src = "Images/Units/Zerg/ZergZerglingGreen.png";
    //Icons
    this.ZerglingIcon.src = "Images/Icons/Zerg/Units/zergling.gif";

    // Other
    // Icons
    this.BuildingSpotIcon.src = "Images/Icons/Terran/Structures/BuildingSpot.png";
};





// The game object. initializes the game and starts it.
function Game(){
    this.bgCanvas = document.getElementById("bgCanvas");
    this.structCanvas = document.getElementById('structCanvas');
    this.unitCanvas = document.getElementById('unitCanvas');
    this.messageCanvas = document.getElementById('messageCanvas');
    this.hudbgCanvas = document.getElementById('hudbgCanvas');
    this.hudCanvas = document.getElementById('hudCanvas');

    this.init = function(){
        if (this.bgCanvas.getContext){
            this.bgContext = this.bgCanvas.getContext("2d");
            this.structContext = this.structCanvas.getContext("2d");
            this.unitContext = this.unitCanvas.getContext("2d");
            this.messageContext = this.messageCanvas.getContext("2d");
            this.hudbgContext = this.hudbgCanvas.getContext("2d");
            this.hudContext = this.hudCanvas.getContext("2d");

            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;

            // init background HUD
            this.hudbgContext.fillStyle = "#c3c3c3";
            this.hudbgContext.fillRect(0,0,this.hudCanvas.width,this.hudCanvas.height);
            this.hudbgContext.fillStyle = "#000000";
            this.hudbgContext.fillRect(5,5,this.hudCanvas.width - 10,this.hudCanvas.height - 10);

            // init background object.
            this.background = new Background();
            this.background.init(0,0);
            this.background.draw();


            return true
        }
        else return false;
    };

    // Collision detection for all units
    this.CollisionDetection = function () {
        for (var i = 0, len = UnitArray.length; i < len; i++) {
            for (var j = 0, len2 = ObjectArray.length; j < len2; j++) {
                var ThisLongSide = UnitArray[i].width < UnitArray[i].height ? UnitArray[i].width : UnitArray[i].height;

                if (ObjectArray[j].Type != "Medium Building Spot" && UnitArray[i] != ObjectArray[j]) {
                    if (UnitArray[i].x <= ObjectArray[j].x &&
                        UnitArray[i].x + ThisLongSide >= ObjectArray[j].x &&
                        UnitArray[i].y <= ObjectArray[j].y &&
                        UnitArray[i].y + ThisLongSide >= ObjectArray[j].y) {

                        //window.alert("hit");

                        var OtherLongSide = ObjectArray[j].width < ObjectArray[j].height ? ObjectArray[j].width : ObjectArray[j].height;

                        // finding distance between this units middle and other objects middle
                        var ThisMiddle_x = UnitArray[i].x + UnitArray[i].width / 2, ThisMiddle_y = UnitArray[i].y + UnitArray[i].height / 2;
                        var OtherMiddle_x = ObjectArray[j].x + ObjectArray[j].width / 2, OtherMiddle_y = ObjectArray[j].y + ObjectArray[j].height / 2;
                        var x = Math.abs(ThisMiddle_x - OtherMiddle_x);
                        var y = Math.abs(ThisMiddle_y - OtherMiddle_y);
                        var pyth = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));

                        var ThisHitCircleRadius = ThisLongSide / 2;
                        var OtherHitCircleRadius = OtherLongSide / 2;

                        // angle between objects
                        var top = ThisMiddle_y - OtherMiddle_x;
                        var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - OtherMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - OtherMiddle_x),2));
                        var ObjectAtAngle = Math.acos(top/bottom);

                        // If the hitcircles are overlapping, push unit away from each other
                        if (pyth < ThisHitCircleRadius + OtherHitCircleRadius) {

                            // this unit
                            // Clear previous draw
                            var prev_x = UnitArray[i].x, prev_y = UnitArray[i].y;
                            UnitArray[i].context.save();
                            UnitArray[i].context.translate(ThisMiddle_x, ThisMiddle_y);
                            UnitArray[i].x = 0 - UnitArray[i].width / 2;
                            UnitArray[i].y = 0 - UnitArray[i].height / 2;
                            UnitArray[i].context.rotate(UnitArray[i].RotationAngle);
                            UnitArray[i].context.clearRect(UnitArray[i].x - 1, UnitArray[i].y - 1, UnitArray[i].width + 2, UnitArray[i].height + 2);
                            UnitArray[i].context.restore();
                            UnitArray[i].pos(prev_x, prev_y);

                            // calculate movement
                            var Movement_x = Math.abs(Math.sin(ObjectAtAngle) * UnitArray[i].MovementSpeed);
                            var Movement_y = Math.abs(Math.cos(ObjectAtAngle) * UnitArray[i].MovementSpeed);
                            if (ThisMiddle_x > OtherMiddle_x) ObjectAtAngle = 2*Math.PI - Math.abs(ObjectAtAngle);

                            ThisMiddle_x < OtherMiddle_x ? UnitArray[i].x -= Movement_x : UnitArray[i].x += Movement_x;
                            ThisMiddle_y < OtherMiddle_y ? UnitArray[i].y -= Movement_y : UnitArray[i].y += Movement_y;

                            // rotation and draw
                            prev_x = UnitArray[i].x; prev_y = UnitArray[i].y;
                            ThisMiddle_x = UnitArray[i].x + UnitArray[i].width / 2; ThisMiddle_y = UnitArray[i].y + UnitArray[i].height / 2;
                            UnitArray[i].context.save();
                            UnitArray[i].RotationAngle = ObjectAtAngle;
                            UnitArray[i].context.translate(ThisMiddle_x, ThisMiddle_y);
                            UnitArray[i].x = 0 - UnitArray[i].width / 2;
                            UnitArray[i].y = 0 - UnitArray[i].height / 2;
                            UnitArray[i].context.rotate(UnitArray[i].RotationAngle);
                            UnitArray[i].draw();
                            UnitArray[i].context.restore();
                            UnitArray[i].pos(prev_x, prev_y);

                            // other object
                            if (ObjectArray[j].SuperType != "Structure") {
                                prev_x = ObjectArray[j].x; prev_y = ObjectArray[j].y;
                                ObjectArray[j].context.save();
                                ObjectArray[j].context.translate(OtherMiddle_x, OtherMiddle_y);
                                ObjectArray[j].x = 0 - ObjectArray[j].width / 2;
                                ObjectArray[j].y = 0 - ObjectArray[j].height / 2;
                                ObjectArray[j].context.rotate(ObjectArray[j].RotationAngle);
                                ObjectArray[j].context.clearRect(ObjectArray[j].x - 1, ObjectArray[j].y - 1, ObjectArray[j].width + 2, ObjectArray[j].height + 2);
                                ObjectArray[j].context.restore();
                                ObjectArray[j].pos(prev_x, prev_y);

                                // reverse angle
                                ObjectAtAngle < Math.PI ? ObjectAtAngle += Math.PI : ObjectAtAngle -= Math.PI;

                                // calculate movement
                                Movement_x = Math.abs(Math.sin(ObjectAtAngle) * ObjectArray[j].MovementSpeed);
                                Movement_y = Math.abs(Math.cos(ObjectAtAngle) * ObjectArray[j].MovementSpeed);
                                if (OtherMiddle_x > ThisMiddle_x) ObjectAtAngle = 2*Math.PI - Math.abs(ObjectAtAngle);

                                ThisMiddle_x < OtherMiddle_x ? ObjectArray[j].x += Movement_x : ObjectArray[j].x -= Movement_x;
                                ThisMiddle_y < OtherMiddle_y ? ObjectArray[j].y += Movement_y : ObjectArray[j].y -= Movement_y;

                                // rotation and draw
                                prev_x = ObjectArray[j].x; prev_y = ObjectArray[j].y;
                                OtherMiddle_x = ObjectArray[j].x + ObjectArray[j].width / 2; OtherMiddle_y = ObjectArray[j].y + ObjectArray[j].height / 2;
                                ObjectArray[j].context.save();
                                ObjectArray[j].RotationAngle = ObjectAtAngle;
                                ObjectArray[j].context.translate(OtherMiddle_x, OtherMiddle_y);
                                ObjectArray[j].x = 0 - ObjectArray[j].width / 2;
                                ObjectArray[j].y = 0 - ObjectArray[j].height / 2;
                                ObjectArray[j].context.rotate(ObjectArray[j].RotationAngle);
                                ObjectArray[j].draw();
                                ObjectArray[j].context.restore();
                                ObjectArray[j].pos(prev_x, prev_y);
                            }
                        }
                    }
                }
            }
        }
    };

    // Handles target Detection and selection for all units
    this.TargetDetection = function () {
        for (var i = 0; i < UnitArray.length; i++) {
            if (UnitArray[i].CurrentTarget === null || UnitArray[i].CurrentTarget.SuperType === "Structure"){
                var ThisUnitMiddle_x = UnitArray[i].x + UnitArray[i].width / 2, ThisUnitMiddle_y = UnitArray[i].y + UnitArray[i].height / 2;
                var TargetArray = []; // Array of possible targets. Used to choose the closest enemy as target.

                // Checks for unit targets first.
                for (j = 0, len_j = UnitArray.length; j < len_j; j++) {
                    if (Math.abs(UnitArray[i].y - UnitArray[j].y) < UnitArray[i].AggressionRange + 50){
                        if (UnitArray[i].Faction != UnitArray[j].Faction){
                            var EnemyMiddle_x = UnitArray[j].x + UnitArray[j].width / 2, EnemyMiddle_y = UnitArray[j].y + UnitArray[j].height / 2;
                            var x = Math.abs(ThisUnitMiddle_x - EnemyMiddle_x);
                            var y = Math.abs(ThisUnitMiddle_y - EnemyMiddle_y);
                            var pyth = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
                            var EnemyHitCircleRadius = UnitArray[j].width < UnitArray[j].height ? UnitArray[j].width / 2 : UnitArray[j].height / 2;

                            if (pyth < UnitArray[i].AggressionRange + EnemyHitCircleRadius) {
                                TargetArray[TargetArray.length] = UnitArray[j];
                                UnitArray[j].DisFromUnit = pyth;
                            }
                        }
                    }
                }
                // Selects the closest unit as target
                if (TargetArray.length != 0) {
                    var TargetUnit = TargetArray[0];
                    for (var k = 0, len = TargetArray.length; k < len; k++) {
                        if (TargetArray[k].DisFromUnit < TargetUnit.DisFromUnit)
                            TargetUnit = TargetArray[k];
                    }
                    UnitArray[i].CurrentTarget = TargetUnit;
                }

                // check for structure targets if no unit targets nearby.
                if (UnitArray[i].CurrentTarget === null) {
                    if (ThisUnitMiddle_y < 500 + UnitArray[i].AggressionRange || ThisUnitMiddle_y > 1600 - UnitArray[i].AggressionRange) {
                        for (j = 0, len = StructureArray.length; j < len; j++) {
                            if (StructureArray[j].Faction != UnitArray[i].Faction && StructureArray[j].Hp != null) {
                                var EnemyMiddle_x = StructureArray[j].x + StructureArray[j].width / 2, EnemyMiddle_y = StructureArray[j].y + StructureArray[j].height / 2;
                                var x = Math.abs(ThisUnitMiddle_x - EnemyMiddle_x);
                                var y = Math.abs(ThisUnitMiddle_y - EnemyMiddle_y);
                                var pyth = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));

                                if (pyth < UnitArray[i].AggressionRange + StructureArray[j].width / 2) {
                                    TargetArray[TargetArray.length] = StructureArray[j];
                                    StructureArray[j].DisFromUnit = pyth;
                                }
                            }
                        }
                    }
                }
                // Selects the closest Structure as target
                if (TargetArray.length != 0 && UnitArray[i].CurrentTarget === null) {
                    var TargetUnit = TargetArray[0];
                    for (var k = 0, len = TargetArray.length; k < len; k++) {
                        if (TargetArray[k].DisFromUnit < TargetUnit.DisFromUnit)
                            TargetUnit = TargetArray[k];
                    }
                    UnitArray[i].CurrentTarget = TargetUnit;
                }
            }
        }
    };

    // Checks if an object is destroyed
    this.DeathDetection = function () {
        for (i = 0, len = ObjectArray.length; i < len; i++) {
            if (ObjectArray[i] != undefined && ObjectArray[i].Hp != null) {
                if (ObjectArray[i].Hp <= 0) {
                    if (ObjectArray[i].SuperType === "Unit") {
                        // clears unit from canvas
                        var prev_x = ObjectArray[i].x, prev_y = ObjectArray[i].y;
                        ObjectArray[i].context.save();
                        ObjectArray[i].context.translate(ObjectArray[i].x + ObjectArray[i].width / 2, ObjectArray[i].y + ObjectArray[i].height / 2);
                        ObjectArray[i].x = 0 - ObjectArray[i].width / 2;
                        ObjectArray[i].y = 0 - ObjectArray[i].height / 2;
                        ObjectArray[i].context.rotate(ObjectArray[i].RotationAngle);
                        ObjectArray[i].context.clearRect(ObjectArray[i].x - 1, ObjectArray[i].y - 1, ObjectArray[i].width + 2, ObjectArray[i].height + 2);
                        ObjectArray[i].context.restore();
                        ObjectArray[i].x = prev_x; ObjectArray[i].y = prev_y;

                        // initiates the deathanimation for this unit
                        ObjectArray[i].DeathAnimation();

                        // Set CurrentTarget for all units that has this unit as target to null
                        for (j = 0, len = UnitArray.length; j < len; j++) {
                            if (UnitArray[j].CurrentTarget === ObjectArray[i]) UnitArray[j].CurrentTarget = null;
                        }

                        // If unit is on the hud, clears the hud
                        if (ObjectArray[i] === CurrentlySelected){
                            game.hudContext.clearRect(0,0,game.hudCanvas.width, game.hudCanvas.height);
                        }

                        // Deletes unit from arrays
                        UnitArray.splice(UnitArray.indexOf(ObjectArray[i]),1);
                        ObjectArray.splice(ObjectArray.indexOf(ObjectArray[i]),1);
                    }
                    else {
                        // structure type
                    }
                }
            }
        }
    };

    // Add right click handling to the main canvas
    this.messageCanvas.addEventListener('click',function (e) {
        // finds the correct mouse position on the canvas.
        var x = 0;
        var y = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) 	{
            x = e.pageX - this.offsetLeft;
            y = e.pageY - this.offsetTop;
        }
        else if (e.clientX || e.clientY) 	{
            x = e.clientX + document.body.scrollLeft - this.offsetLeft;
            y = e.clientY + document.body.scrollTop - this.offsetTop;
        }

        // uses the information to see if something has been clicked on.
        for (i = 0, len = ObjectArray.length; i < len; i++) {
            if (ObjectArray[i].x < x &&
                ObjectArray[i].x + ObjectArray[i].height > x &&
                ObjectArray[i].y < y &&
                ObjectArray[i].y + ObjectArray[i].width > y) {

                ObjectArray[i].Selected();
                return;
            }
        }
    },false);

    // Add right click handling to the HUD canvas
    this.hudCanvas.addEventListener('click', function (e) {
        // finds the correct mouse position on the canvas.
        var x = 0;
        var y = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) 	{
            x = e.pageX - this.offsetLeft - document.body.scrollLeft;
            y = e.pageY - this.offsetTop - document.body.scrollTop;
        }
        else if (e.clientX || e.clientY) 	{
            x = e.clientX + document.body.scrollLeft - this.offsetLeft;
            y = e.clientY + document.body.scrollTop - this.offsetTop;
        }

        if (CurrentlySelected != null) {
            for (i = 0, len = CurrentlySelected.OptionsArray.length; i < len; i++) {
                if (CurrentlySelected.OptionsArray[i].x < x &&
                    CurrentlySelected.OptionsArray[i].x + CurrentlySelected.OptionsArray[i].height > x &&
                    CurrentlySelected.OptionsArray[i].y < y &&
                    CurrentlySelected.OptionsArray[i].y + CurrentlySelected.OptionsArray[i].width > y) {

                    CurrentlySelected.OptionsArray[i].Selected();
                    return;
                }
            }
        }
    },false);

    this.start = function(){
        animate();
    }
}







/*
 *  Unit objects.
 */
// abstract object. All units inherit from this.
function Unit(Type, Hp, Armor, MovementSpeed, AttackDamage, AttackSpeed, AttackRange, AttackForm, PossibleTargets, AggressionRange, MovementForm, Race, Faction, Width, Height, Image, Icon){
    this.SuperType = "Unit";
    this.Type = Type;
    this.MaxHp = Hp;
    this.Hp = Hp;
    this.Armor = Armor;
    this.MovementSpeed = MovementSpeed;
    this.AttackDamage = AttackDamage;
    this.AttackSpeed = AttackSpeed;
    this.AttackRange = AttackRange;
    this.AttackForm = AttackForm;
    this.PossibleTargets = PossibleTargets;
    this.AggressionRange = AggressionRange;
    this.MovementForm = MovementForm;
    this.Race = Race;
    this.Faction = Faction;
    this.width = Width;
    this.height = Height;
    this.Image = Image;
    this.Icon = Icon;
    this.CurrentTarget = null;
    this.RotationAngle = 0; // current rotation in radians

    var that = this; // for use in local setTimeout and setInterval
    var AttackCooldown = false;
    this.HudOptionsDraw = null; // abstract

    this.canvas = document.getElementById('unitCanvas');
    this.context = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    this.pos = function(x, y){
        this.x = x;
        this.y = y;
    };
    this.draw = function(){
        this.context.drawImage(this.Image, this.x,this.y,this.width,this.height);
    };
    this.clear = function () {
        this.context.clearRect(this.x - 1,this.y - 1,this.width + 2,this.height + 2);
    };

    this.Selected = function () {
        CurrentlySelected = this;
        game.hudContext.clearRect(0,0,game.hudCanvas.width,game.hudCanvas.height);

        game.hudContext.fillStyle = "#c3c3c3";
        game.hudContext.fillRect(320,5,5,game.hudCanvas.height);
        game.hudContext.fillRect(670,5,5,game.hudCanvas.height);

        game.hudContext.fillStyle = "#ffffff";
        game.hudContext.drawImage(this.Icon,20,20,110,110);
        game.hudContext.font = "18px Arial";
        if (this.Hp != null) game.hudContext.fillText(this.Hp,20, 165, 45);
        if (this.Hp != null) game.hudContext.fillText("/",70, 165);
        if (this.Hp != null) game.hudContext.fillText(this.MaxHp,90, 165);
        game.hudContext.fillText(this.Type, 160, 35,150);
        game.hudContext.font = "14px Arial";
        game.hudContext.fillText("Faction: " + this.Faction, 160, 65);
        if (this.Armor != null) game.hudContext.fillText("Armor: " + this.Armor, 160, 85);

        // Draws hud options if implemented
        if (this.HudOptionsDraw != null && this.HudOptionsDraw != undefined) this.HudOptionsDraw();
    };

    this.animate = function () {
        var ThisMiddle_x = this.x + this.width / 2, ThisMiddle_y = this.y + this.height / 2;
        var prev_x, prev_y;

        // If the unit has a target
        if (this.CurrentTarget != null) {
            var EnemyMiddle_x = this.CurrentTarget.x + this.CurrentTarget.width / 2, EnemyMiddle_y = this.CurrentTarget.y + this.CurrentTarget.height / 2;

            // angle between two lines formular. Used to decide where to turn and move towards.
            var top = ThisMiddle_y - EnemyMiddle_y;
            var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));
            var EnemyAtAngle = Math.acos(top/bottom);

            // calculate current distance to enemy
            var DistanceToEnemy = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));

            // If enemy is within attack range. ATTACK !!!
            if (DistanceToEnemy < this.AttackRange + this.CurrentTarget.width / 2) {
                if (ThisMiddle_x > EnemyMiddle_x) EnemyAtAngle = 2*Math.PI - Math.abs(EnemyAtAngle);

                // If enemy isn't in front of this unit, rotate to face him
                if (EnemyAtAngle < this.RotationAngle - 0.005 || EnemyAtAngle > this.RotationAngle + 0.005) {
                    // clear previous rotated image;
                    prev_x = this.x; prev_y = this.y;
                    this.context.save();
                    this.context.translate(ThisMiddle_x, ThisMiddle_y);
                    this.x = 0 - this.width / 2;
                    this.y = 0 - this.height / 2;
                    this.context.rotate(this.RotationAngle);
                    this.context.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
                    this.context.restore();
                    this.pos(prev_x, prev_y);

                    // rotation and draw
                    this.context.save();
                    this.RotationAngle = EnemyAtAngle;
                    this.context.translate(ThisMiddle_x, ThisMiddle_y);
                    this.x = 0 - this.width / 2;
                    this.y = 0 - this.height / 2;
                    this.context.rotate(this.RotationAngle);
                    this.draw();
                    this.context.restore();
                    this.pos(prev_x, prev_y);
                }

                // If AttackCooldown isn't down, attack
                if (AttackCooldown === false){
                    var damage = this.AttackDamage - this.CurrentTarget.Armor;

                    if (damage < 1) damage = 1;
                    this.CurrentTarget.Hp -= damage;

                    if (CurrentlySelected === this.CurrentTarget) {
                        game.hudContext.clearRect(20,150,45,15);
                        game.hudContext.font = "18px Arial";
                        game.hudContext.fillText(this.CurrentTarget.Hp, 20, 165, 45);
                    }

                    // Show attack animation

                    // Play attack animation sound

                    // Show sign on enemy that it has been attacked

                    AttackCooldown = true;
                    window.setTimeout(function(){AttackCooldown = false;},that.AttackSpeed * 1000);
                }
            }

            // if enemy is targeted but not in attackrange, move towards it.
            else{
                // clear previous rotated image;
                prev_x = this.x; prev_y = this.y;
                this.context.save();
                this.context.translate(ThisMiddle_x, ThisMiddle_y);
                this.x = 0 - this.width / 2;
                this.y = 0 - this.height / 2;
                this.context.rotate(this.RotationAngle);
                this.context.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
                this.context.restore();
                this.pos(prev_x, prev_y);

                // calculate movement
                var Movement_x = Math.abs(Math.sin(EnemyAtAngle) * this.MovementSpeed);
                var Movement_y = Math.abs(Math.cos(EnemyAtAngle) * this.MovementSpeed);
                if (ThisMiddle_x > EnemyMiddle_x) EnemyAtAngle = 2*Math.PI - Math.abs(EnemyAtAngle);

                ThisMiddle_x < EnemyMiddle_x ? this.x += Movement_x : this.x -= Movement_x;
                EnemyMiddle_y < ThisMiddle_y ? this.y -= Movement_y : this.y += Movement_y;

                // rotation and draw
                prev_x = this.x; prev_y = this.y;
                ThisMiddle_x = this.x + this.width / 2; ThisMiddle_y = this.y + this.height / 2;
                this.context.save();
                this.RotationAngle = EnemyAtAngle;
                this.context.translate(ThisMiddle_x, ThisMiddle_y);
                this.x = 0 - this.width / 2;
                this.y = 0 - this.height / 2;
                this.context.rotate(this.RotationAngle);
                this.draw();
                this.context.restore();
                this.pos(prev_x, prev_y);
            }
        }

        // if no enemy is targeted
        else {
            // clear previous rotation angle
            prev_x = this.x; prev_y = this.y;
            this.context.save();
            this.context.translate(ThisMiddle_x, ThisMiddle_y);
            this.x = 0 - this.width / 2;
            this.y = 0 - this.height / 2;
            this.context.rotate(this.RotationAngle);
            this.clear();
            this.context.restore();
            this.pos(prev_x, prev_y);

            this.Faction === "Terran" ? this.pos(this.x, this.y - this.MovementSpeed) : this.pos(this.x, this.y + this.MovementSpeed);
            this.Faction === "Terran" ? this.RotationAngle = 0 : this.RotationAngle = Math.PI;

            // rotation
            prev_x = this.x; prev_y = this.y;
            this.context.save();
            this.context.translate(ThisMiddle_x, ThisMiddle_y);
            this.x = 0 - this.width / 2;
            this.y = 0 - this.height / 2;
            this.context.rotate(this.RotationAngle);
            this.draw();
            this.context.restore();
            this.pos(prev_x,prev_y);
        }
    };

    this.DeathAnimation = function () {
        game.bgContext.beginPath();
        game.bgContext.fillStyle = "#CC0000";
        game.bgContext.globalAlpha = 0.5;
        game.bgContext.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width < this.height ? this.height : this.width
            ,0,2*Math.PI);
        game.bgContext.fill();
    };

    this.HudOptionsDraw = function () {
        // abstract
    }
}

// Terran
function Marine(Faction, Image){
    Unit.call(this, "Marine", 45, 0, 0.5, 6, 1.25, 200, "Ranged", "Air and Ground", 300, "Ground", "Terran", Faction, 24, 16, Image, imgRepo.MarineIcon);
}
Marine.prototype = Object.create(Unit.prototype);
Marine.prototype.constructor = Marine;
//Marine Upgrades. Static variables
Marine.MarineRangeUpgrade = false;
Marine.StimpacksUpgrade = false;

// Zerg
function Zergling (Faction, Image){
    Unit.call(this, "Zergling", 35, 0, 1, 5, 0.9, 10, "Melee", "Ground", 300, "Ground", "Zerg", Faction, 12, 18, Image, imgRepo.ZerglingIcon);
}
Zergling.prototype = Object.create(Unit.prototype);
Zergling.prototype.constructor = Zergling;
// global zergling upgrades
Zergling.SpeedUpgrade = false;
Zergling.AdrenalGlandsUpgrade = false;













/*
 *  Structure objects. All structures inherit from this object.
 */
function Structure (Type, Hp, Armor, Race, Faction, Width, Height, Image, Icon) {
    this.SuperType = "Structure";
    this.Type = Type;
    this.MaxHp = Hp;
    this.Hp = Hp;
    this.Armor = Armor;
    this.Race = Race;
    this.Faction = Faction;
    this.width = Width;
    this.height = Height;
    this.Image = Image;
    this.Icon = Icon;

    this.OptionsArray = [];

    this.canvas = document.getElementById('structCanvas');
    this.context = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    this.pos = function (x,y) {
        this.x = x;
        this.y = y;
    };
    this.draw = function () {
        this.context.drawImage(Image, this.x, this.y, this.width, this.height);
    };
    this.clear = function () {
        this.context.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
    }

    // When the structure is clicked on, draws relevant info on the hud.
    this.Selected = function () {
        CurrentlySelected = this;
        game.hudContext.clearRect(0,0,game.hudCanvas.width,game.hudCanvas.height);

        game.hudContext.fillStyle = "#c3c3c3";
        game.hudContext.fillRect(320,5,5,game.hudCanvas.height);
        game.hudContext.fillRect(670,5,5,game.hudCanvas.height);

        game.hudContext.fillStyle = "#ffffff";
        game.hudContext.drawImage(this.Icon,20,20,110,110);
        game.hudContext.font = "18px Arial";
        if (this.Hp != null) game.hudContext.fillText(this.Hp,20, 165);
        if (this.Hp != null) game.hudContext.fillText("/",70, 165);
        if (this.Hp != null) game.hudContext.fillText(this.MaxHp,90, 165);
        game.hudContext.fillText(this.Type, 160, 35,150);
        game.hudContext.font = "14px Arial";
        game.hudContext.fillText("Faction: " + this.Faction, 160, 65);
        if (this.Armor != null) game.hudContext.fillText("Armor: " + this.Armor, 160, 85);

        // Draws hud options if implemented
        if (this.HudOptionsDraw != null && this.HudOptionsDraw != undefined) this.HudOptionsDraw();

    };

    this.animate = function () {
        // abstract
    };

    // Abstract function implemented in inherited objects that draw hud options.
    this.HudOptionsDraw = function () {
        // abstract
    };
}


// Terran
function CommandCenter (Faction, Image) {
    Structure.call(this, "Command Center", 1500, 1, "Terran", Faction, 128, 128, Image, imgRepo.CommandCenterIcon);
}
CommandCenter.prototype = Object.create(Structure.prototype);
CommandCenter.prototype.constructor = CommandCenter;

function Barracks (Faction, Image) {
    Structure.call(this, "Barracks", 1000, 1, "Terran", Faction, 64, 64, Image, imgRepo.BarracksIcon);

    this.MarineOption = new NewUnitOption (this,680,10,imgRepo.MarineIcon,function(){return new Marine("Terran", imgRepo.TerranMarineBlue);});

    this.OptionsArray[this.OptionsArray.length] = this.MarineOption;

    this.HudOptionsDraw = function () {
        this.MarineOption.draw();
    }
}

Barracks.prototype = Object.create(Structure.prototype);
Barracks.prototype.constructor = Barracks;
function SupplyDepot (Faction, Image) {
    Structure.call(this, "Supply Depot", 500, 1, "Terran", Faction, 64, 64, Image, imgRepo.SupplyDepotIcon);
}
SupplyDepot.prototype = Object.create(Structure.prototype);
SupplyDepot.prototype.constructor = SupplyDepot;
function EngineeringBay (Faction, Image) {
    Structure.call(this, "Engineering Bay", 1000, 1, "Terran", Faction, 64, 64, Image, imgRepo.EngineeringBayIcon);
}
EngineeringBay.prototype = Object.create(Structure.prototype);
EngineeringBay.prototype.constructor = EngineeringBay;
function Factory (Faction, Image) {
    Structure.call(this, "Factory", 1000, 1, "Terran", Faction, 64, 64, Image, imgRepo.FactoryIcon);
}
Factory.prototype = Object.create(Structure.prototype);
Factory.prototype.constructor = Factory;




// Zerg
function GreaterHive (Faction, Image) {
    Structure.call(this, "Greater Hive", 2500, 2, "Zerg", Faction, 272, 272, Image, Image);
}
GreaterHive.prototype = Object.create(Structure.prototype);
GreaterHive.prototype.constructor = GreaterHive;

function LowerHive (Faction, Image) {
    Structure.call(this, "Lower Hive", 1500, 1, "Zerg", Faction, 160, 160, Image, Image);
}
LowerHive.prototype = Object.create(Structure.prototype);
LowerHive.prototype.constructor = LowerHive;

function SpawningStructure (Faction, Image) {
    Structure.call(this, "Spawning Structure", 1000, 1, "Zerg", Faction, 128, 128, Image, Image);

    var that = this;
    this.Spawntimer = 2; // seconds untill zergling is spawned
    this.OnCooldown = false;

    this.animate = function () {
        /*if (this.OnCooldown === false){
         var NewZergling = new Zergling("Zerg", imgRepo.ZergZerglingPurple);
         UnitArray[UnitArray.length] = NewZergling;
         ObjectArray[ObjectArray.length] = NewZergling;
         NewZergling.pos(Math.floor(Math.random() * (this.width - NewZergling.width)) + this.x, this.y + this.height + 5);
         NewZergling.draw();
         this.OnCooldown = true;
         window.setTimeout(function(){that.OnCooldown = false},that.Spawntimer * 1000);
         }*/
    }
}
LowerHive.prototype = Object.create(Structure.prototype);
LowerHive.prototype.constructor = LowerHive;




// Other
function BuildingSpot (Type, Race, Faction, width, height) {
    Structure.call(this, Type, null, null, Race, Faction, width, height, null, imgRepo.BuildingSpotIcon);

    this.SupplyDepotOption = new NewStructureOption(this, 680, 10, imgRepo.SupplyDepotIcon, function(){return new SupplyDepot("Terran",imgRepo.TerranSupplyDepotBlue);});
    this.BarracksOption = new NewStructureOption(this, 749, 10, imgRepo.BarracksIcon, function(){return new Barracks("Terran",imgRepo.TerranBarracksBlue);});
    this.EngineeringBayOption = new NewStructureOption(this, 818, 10, imgRepo.EngineeringBayIcon, function(){return new EngineeringBay("Terran",imgRepo.TerranEngineeringBayBlue);});
    this.FactoryOption = new NewStructureOption(this, 887, 10, imgRepo.FactoryIcon, function(){return new Factory("Terran",imgRepo.TerranFactoryBlue);});

    this.OptionsArray[this.OptionsArray.length] = this.SupplyDepotOption;
    this.OptionsArray[this.OptionsArray.length] = this.BarracksOption;
    this.OptionsArray[this.OptionsArray.length] = this.EngineeringBayOption;
    this.OptionsArray[this.OptionsArray.length] = this.FactoryOption;

    this.draw = function () {
        this.context.fillStyle = "#000000";
        this.context.globalAlpha = 0.3;
        this.context.fillRect(this.x,this.y,this.width,this.height);
        this.context.globalAlpha = 1;
        this.context.strokeRect(this.x,this.y,this.width,this.height);
    };

    // Add to the inherited rightclick function
    this.HudOptionsDraw = function () {
        this.SupplyDepotOption.draw();
        this.BarracksOption.draw();
        this.EngineeringBayOption.draw();
        this.FactoryOption.draw();
    };


}
BuildingSpot.prototype = Object.create(Structure.prototype);
BuildingSpot.prototype.constructor = BuildingSpot;






/*
 * Hud Options
 */

// Abstract hud object
function HudOption (Caller, x, y, Icon, NewObject) {
    this.Caller = Caller;
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.Icon = Icon;
    this.NewObject = NewObject;

    this.draw = function () {
        game.hudContext.drawImage(this.Icon, this.x, this.y, 64, 64);
    };

    this.Selected = function () {
        // abstract. This function is run when the option is clicked
    };
}
// Structure hud object
function NewStructureOption (Caller, x, y, Icon, NewObject) {
    HudOption.call(this, Caller, x, y, Icon, NewObject);
    this.Selected = function () {
        game.structContext.clearRect(Caller.x-2, Caller.y-2, Caller.width+4, Caller.height+4);

        var NewStructure = new NewObject;
        StructureArray[StructureArray.indexOf(Caller)] = NewStructure;
        ObjectArray[ObjectArray.indexOf(Caller)] = NewStructure;
        NewStructure.Selected();
        CurrentlySelected = NewStructure;
        NewStructure.pos(Caller.x, Caller.y);
        NewStructure.draw();
    }
}
// Structure hud object
function NewUnitOption (Caller, x, y, Icon, NewObject) {
    HudOption.call(this, Caller, x, y, Icon, NewObject);
    this.Selected = function () {
        var NewUnit = new NewObject;
        UnitArray[UnitArray.length] = NewUnit;
        ObjectArray[ObjectArray.length] = NewUnit;
        NewUnit.pos(Caller.x + Caller.width / 2, Caller.y - 30);
        NewUnit.draw();
    }
}







// The background object.
function Background(){
    this.init = function(x, y){
        this.x = x;
        this.y = y;
    };

    this.Tilesize = 64; // the size of a tile
    this.RowTileCount = 15; // Number of tiles in a row
    this.ColTileCount = 30; // Number of tiles in a column
    this.ImageNumTiles = 10; // Number of tiles per row in the tileset image
    this.Ground = [
        [0,6,0,0,0,0,0,0,8,0,0,0,0,3,0],
        [0,0,0,0,7,0,0,0,0,0,2,0,10,0,0],
        [0,0,0,10,0,0,0,0,0,0,0,0,0,0,0],
        [8,0,0,0,0,0,9,0,0,0,7,0,0,8,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,9,0,0,0,0,0,6,0,0,0,0,6,0,0],
        [0,0,0,0,10,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,9,0,0,0,0,7,0,0,0,0,0,0],
        [10,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,8,0,0,0,0,0,0,0,0,0,0,0],
        [0,7,0,0,0,0,8,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,10,7,0,0,0,0,0],
        [3,10,6,0,0,0,0,0,0,0,0,0,0,6,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,8,0],
        [0,0,0,10,0,0,0,0,9,0,0,0,0,0,0],
        [7,0,0,8,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,8,0,0,8,0,0,0,0],
        [0,0,6,0,0,0,0,0,0,0,0,0,0,0,7],
        [0,0,0,9,0,0,0,6,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,10,0,0,0,0,0],
        [0,0,0,0,0,0,8,0,7,0,0,0,0,0,10],
        [0,0,6,0,0,0,0,0,0,0,0,8,0,0,0],
        [0,10,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,7,0,0,0,0,8,0,10,0,7,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,10,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,9,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,6,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,9]
    ];

    this.draw = function(){
        for (r = 0; r < this.RowTileCount; r++){
            for (c = 0; c < this.ColTileCount; c++){
                var Tile = this.Ground[c][r];
                var TileRow = (Tile / this.ImageNumTiles) | 0;
                var TileCol = (Tile % this.ImageNumTiles) | 0;

                this.context.drawImage(imgRepo.background,(TileCol*this.Tilesize),(TileRow*this.Tilesize),
                                       this.Tilesize,this.Tilesize,(r*this.Tilesize),(c*this.Tilesize),this.Tilesize,this.Tilesize);
            }
        }
    }
}








// animation function. This function handles object animation. It is called 60 times per second.
function animate(){

    // check if any units are dead. Deletes them if they are.
    game.DeathDetection();

    // Check if any objects collide
    game.CollisionDetection();

    // See if any enemy units/structures are in agression range
    game.TargetDetection();

    // animates
    for (i = 0, len = ObjectArray.length; i < len; i++) {
        ObjectArray[i].animate();
    }

    requestAnimFrame(animate);
}

// For cross browser functionality
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();
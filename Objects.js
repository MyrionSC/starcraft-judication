/*
This file holds all objects in the game
 */

// Global Variables
var game = null, // holds the current game
    AnimationVar = null, // Holds the RequestAnimationFrame variable. Used to pause the game.
    CurrentlySelected = null, // used to show selected unit on Hud;
    PreviouslySelected = null, // Used to switch back and forth between command hud and object hud
    GamePaused = false; // used to decide which animation functions to run

// Command States. When CurrentlySelected === null, a command hud is shown on the hud.
var CommandState = "Attack Move",// Holds the current unit movement orders. They are: Attack Move, Passive Move, Hold Position, Spread Out, Group Up.
    MoveDirection = "Up"; // Holds unit movement direction. They are: Up, Down, Left, Right.

// The game object. initializes the game and starts it. Contains logic pertaining to all objects.
function Game(){
    this.Paused = false;
    var that = this;

    // level init functions

    // Frontmenu background battle init
    this.initFrontMenu = function () {
        this.bgCanvas = document.getElementById("bgCanvas");
        this.structCanvas = document.getElementById('structCanvas');
        this.unitCanvas = document.getElementById('unitCanvas');

        if (this.bgCanvas.getContext) { // checks if canvas is supported in the browser
            this.bgContext = this.bgCanvas.getContext("2d");
            this.structContext = this.structCanvas.getContext("2d");
            this.unitContext = this.unitCanvas.getContext("2d");

            this.bgCanvas.height = 600;
            this.bgCanvas.width = 960;
            this.bgCanvas.style.marginTop = 10;
            this.structCanvas.height = 600;
            this.structCanvas.width = 960;
            this.structCanvas.style.marginTop = 10;
            this.unitCanvas.height = 600;
            this.unitCanvas.width = 960;
            this.unitCanvas.style.marginTop = 10;

            // creating relations between the game object and all it's participants.
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;

            Unit.prototype.context = this.unitContext;
            Unit.prototype.canvasWidth = this.unitCanvas.width;
            Unit.prototype.canvasHeight = this.unitCanvas.height;
            Unit.prototype.game = this;

            Structure.prototype.context = this.structContext;
            Structure.prototype.canvasWidth = this.structCanvas.width;
            Structure.prototype.canvasHeight = this.structCanvas.height;
            Structure.prototype.game = this;

            // init variabels
            this.ObjectArray = [];
            this.UnitArray = [];
            this.StructureArray = [];
            this.FrameTimer = 0;
            this.DeadUnitsArray = [];
            this.PlayerMinerals = 0;
            this.PlayerGas = 0;
            this.PlayerSupply = 0;
            this.PlayerMaxSupply = 0;

            // init background object.
            this.background = new Background(imgRepo.background, 64, 15, 30, 10,[
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
            ]);
            this.background.pos(0,0);
            this.background.draw();

            // inits quadtree. Used for collision detection
            this.QuadTree = new QuadTree({x:0,y:0,width:this.unitCanvas.width,height:this.unitCanvas.height});

            this.TerranStrengthOnField = 0;
            this.MarinesSpawningRate = 0;
            this.MarineLastSpawned = 0;

            this.ZergStrengthOnField = 0;
            this.ZerglingsSpawnRate = 0;
            this.ZerglingLastSpawned = 0;
            this.HydralisksSpawnRate = 0;
            this.HydraliskLastSpawned = 0;

            var FixedMarineSpawnRate = 1;
            var FixedZerglingSpawnRate = 0.75;
            var FixedHydraliskSpawnRate = 2;

            var rine = new Marine("Player",imgRepo.TerranMarineRed);
            this.UnitArray[this.UnitArray.length] = rine;
            this.ObjectArray[this.ObjectArray.length] = rine;
            rine.pos(Math.floor(Math.random() * 100) + 300, 600);

            var ling1 = new Zergling("Zerg",imgRepo.ZergZerglingPurple);
            this.UnitArray[this.UnitArray.length] = ling1;
            this.ObjectArray[this.ObjectArray.length] = ling1;
            ling1.pos(Math.floor(Math.random() * 100) + 300, -10);
            var ling2 = new Zergling("Zerg",imgRepo.ZergZerglingPurple);
            this.UnitArray[this.UnitArray.length] = ling2;
            this.ObjectArray[this.ObjectArray.length] = ling2;
            ling2.pos(Math.floor(Math.random() * 100) + 300, -10);

            // spawn amount of units based on army strength on field
            this.ExtraAnimation = function () {
                var ArmyDifference = 0;

                // finds strength of armies on field
                for (var i = 0, len = this.UnitArray.length; i < len; i++) {
                    // terran units
                    if (this.UnitArray[i].Type == "Marine")
                        this.TerranStrengthOnField += 1;

                    // zerg units
                    else if (this.UnitArray[i].Type == "Zergling") {
                        this.ZergStrengthOnField += 0.6;
                    }
                    else if (this.UnitArray[i].Type == "Hydralisk") {
                        this.ZergStrengthOnField += 2;
                    }
                }

                // Determine if the strength of the armies are skewed
                if (this.TerranStrengthOnField < this.ZergStrengthOnField) {
                    ArmyDifference = this.ZergStrengthOnField / this.TerranStrengthOnField;

                    // Calculate Terran spawnrate
                    this.MarinesSpawningRate = FixedMarineSpawnRate / Math.pow(ArmyDifference, 3);

                    // calculate zerg spawnrate
                    this.ZerglingsSpawnRate = FixedZerglingSpawnRate * Math.pow(ArmyDifference, 3);
                    this.HydralisksSpawnRate = FixedHydraliskSpawnRate * Math.pow(ArmyDifference, 3);
                }
                else {
                    ArmyDifference = this.TerranStrengthOnField / this.ZergStrengthOnField;

                    // Normalize terran spawnrate
                    this.MarinesSpawningRate = FixedMarineSpawnRate * Math.pow(ArmyDifference, 3);

                    // Calculate zerg spawnrate
                    this.ZerglingsSpawnRate = FixedZerglingSpawnRate / Math.pow(ArmyDifference, 3);
                    this.HydralisksSpawnRate = FixedHydraliskSpawnRate * Math.pow(ArmyDifference, 3);
                }

                // Spawn units
                // Zerg
                if (this.ZerglingLastSpawned + Math.ceil(60 * this.ZerglingsSpawnRate) < this.FrameTimer) {
                    var NewZergling = new Zergling("Zerg",imgRepo.ZergZerglingPurple);
                    this.UnitArray[this.UnitArray.length] = NewZergling;
                    this.ObjectArray[this.ObjectArray.length] = NewZergling;
                    NewZergling.pos(Math.floor(Math.random() * 890), -10);

                    this.ZerglingLastSpawned = this.FrameTimer;
                }
                if (this.HydraliskLastSpawned + Math.ceil(60 * this.HydralisksSpawnRate) < this.FrameTimer) {
                    var NewHydra = new Hydralisk("Zerg",imgRepo.ZergHydraliskPurple);
                    this.UnitArray[this.UnitArray.length] = NewHydra;
                    this.ObjectArray[this.ObjectArray.length] = NewHydra;
                    NewHydra.pos(Math.floor(Math.random() * 890), -10);

                    this.HydraliskLastSpawned = this.FrameTimer;
                }

                // Terran
                if (this.MarineLastSpawned + Math.ceil(60 * this.MarinesSpawningRate) < this.FrameTimer) {
                    var newMarine = new Marine("Player",imgRepo.TerranMarineRed);
                    this.UnitArray[this.UnitArray.length] = newMarine;
                    this.ObjectArray[this.ObjectArray.length] = newMarine;
                    newMarine.pos(Math.floor(Math.random() * 890), 600);

                    this.MarineLastSpawned = this.FrameTimer;
                }




                // Writes number of killed units in left corner
                var KilledZerglings = 0, KilledMarines = 0;

                for (var i = 0, len = this.DeadUnitsArray.length; i < len; i++) {
                    if (this.DeadUnitsArray[i] == "Marine"){
                        KilledMarines += 1;
                    }
                    else if (this.DeadUnitsArray[i] == "Zergling") {
                        KilledZerglings += 1;
                    }
                }

                this.structContext.clearRect(880, 0, 80, 100);
                this.structContext.font = "10";
                this.structContext.fillStyle = "#ffffff";
                this.structContext.fillText("Army Strengs:", 880, 12);
                this.structContext.fillText("Terran: " + this.TerranStrengthOnField, 880, 24);
                this.structContext.fillText("Zerg: " + this.ZergStrengthOnField, 880, 36);
                this.structContext.fillText("Difference: " + ArmyDifference, 880, 48);
                this.structContext.fillText("Killed units:", 880, 64);
                this.structContext.fillText(KilledMarines + " Marines", 880, 76);
                this.structContext.fillText(KilledZerglings + " Zerglings", 880, 88);

                this.TerranStrengthOnField = 0;
                this.ZergStrengthOnField = 0;
            };

            return true;
        }
        else
            return false;
    };

    this.initMediumSkirmish = function(){
        this.bgCanvas = document.getElementById("bgCanvas");
        this.structCanvas = document.getElementById('structCanvas');
        this.unitCanvas = document.getElementById('unitCanvas');
        this.messageCanvas = document.getElementById('messageCanvas');
        this.hudbgCanvas = document.getElementById('hudbgCanvas');
        this.hudCanvas = document.getElementById('hudCanvas');
        this.topMenuBtn = document.getElementById('topGameMenuBtn');
        this.topMenu = document.getElementById('topGameMenu');

        if (this.bgCanvas.getContext) { // checks if canvas is supported in the browser
            this.bgContext = this.bgCanvas.getContext("2d");
            this.structContext = this.structCanvas.getContext("2d");
            this.unitContext = this.unitCanvas.getContext("2d");
            this.messageContext = this.messageCanvas.getContext("2d");
            this.hudbgContext = this.hudbgCanvas.getContext("2d");
            this.hudContext = this.hudCanvas.getContext("2d");

            // set dimensions of elements
            this.bgCanvas.height = 1920;
            this.bgCanvas.width = 960;
            this.structCanvas.height = 1920;
            this.structCanvas.width = 960;
            this.unitCanvas.height = 1920;
            this.unitCanvas.width = 960;
            this.messageCanvas.width = 960;
            this.messageCanvas.height = window.innerHeight - 200;
            this.hudbgCanvas.height = 200;
            this.hudbgCanvas.width = 960;
            this.hudCanvas.height = 200;
            this.hudCanvas.width = 960;
            document.body.style.height = "2104px";

            // create relations between object prototypes and game
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;

            Unit.prototype.context = this.unitContext;
            Unit.prototype.canvasWidth = this.unitCanvas.width;
            Unit.prototype.canvasHeight = this.unitCanvas.height;
            Unit.prototype.game = this;

            Structure.prototype.context = this.structContext;
            Structure.prototype.canvasWidth = this.structCanvas.width;
            Structure.prototype.canvasHeight = this.structCanvas.height;
            Structure.prototype.game = this;

            CommandHud.prototype.context = this.hudContext;
            CommandHud.prototype.game = this;
            AlertSystem.prototype.context = this.messageContext;
            AlertSystem.prototype.game = this;
            HudOption.prototype.game = this;

            // init Commandhud and Alertsystem
            this.Commandhud = new CommandHud();
            this.Alertsystem = new AlertSystem();

            // init games data structures
            this.ObjectArray = []; // Holds all objects in the game
            this.UnitArray = []; // Holds all units in the game
            this.StructureArray = []; // Holds all structures in the game
            this.DeadUnitsArray = []; // Holds all dead units
            this.DestroyedStructuresArray = []; // Holds all destroyed structures;
            this.MineralsArray = []; // Holds all mineable minerals
            //this.EnemyWaveQueue = []; // Holds enemy wave information, such as units spawned and time untill spawn.
            //this.SpawnTimer = [], // Holds time untill next enemy spawn

            this.PlayerMinerals = 0;
            this.PlayerGas = 0;
            this.PlayerSupply = 0;
            this.PlayerMaxSupply = 0;
            this.FrameTimer = 0;

            // init background HUD
            this.hudbgContext.fillStyle = "#c3c3c3";
            this.hudbgContext.fillRect(0,0,this.hudCanvas.width,this.hudCanvas.height);
            this.hudbgContext.fillStyle = "#000000";
            this.hudbgContext.fillRect(5,5,this.hudCanvas.width - 10,this.hudCanvas.height - 10);

            // init background object.
            this.background = new Background(imgRepo.background, 64, 15, 30, 10,[
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
            ]);
            this.background.pos(0,0);
            this.background.draw();

            // Draw messageCanvas
            this.messageContext.fillStyle = "#FFFFFF";
            this.messageContext.font = "14px Arial";
            this.messageContext.drawImage(imgRepo.MineralsIcon, 740, 2, 16, 16);
            this.messageContext.fillText(this.PlayerMinerals, 760, 15, 50);
            this.messageContext.drawImage(imgRepo.GasIcon, 810, 2, 16, 16);
            this.messageContext.fillText(this.PlayerGas, 830, 15, 50);
            this.messageContext.drawImage(imgRepo.SupplyDepotIcon, 880, 2, 16, 16);
            this.messageContext.fillText(this.PlayerSupply + " / " + this.PlayerMaxSupply, 900, 15, 50);

            // init Terran

            // init Main building.
            this.FriendlyCC = new CommandCenter("Player",imgRepo.TerranCCBlue);
            this.FriendlyCC.pos(this.FriendlyCC.canvasWidth / 2 - this.FriendlyCC.width / 2, this.FriendlyCC.canvasHeight - 50 - this.FriendlyCC.height);
            this.FriendlyCC.HotKey = "G";
            this.FriendlyCC.draw();
            this.StructureArray[this.StructureArray.length] = this.FriendlyCC;
            this.ObjectArray[this.ObjectArray.length] = this.FriendlyCC;
            // init building spots.
            for (i = 0; i < 10; i++) {
                var UpperBS = new BuildingSpot("Medium Building Spot","Terran","Player",64,64);
                UpperBS.pos(50 + 89 * i, UpperBS.canvasHeight - 114 - this.FriendlyCC.height - 50 - 64 - 20);
                var IntHotKey = i + 1;
                if (IntHotKey === 10) IntHotKey = 0;
                UpperBS.HotKey = IntHotKey.toString();
                UpperBS.draw();
                this.StructureArray[this.StructureArray.length] = UpperBS;
                this.ObjectArray[this.ObjectArray.length] = UpperBS;

                var LowerBS = new BuildingSpot("Medium Building Spot","Terran","Player",64,64);
                LowerBS.pos(50 + 89 * i, LowerBS.canvasHeight - 114 - this.FriendlyCC.height - 50);
                LowerBS.HotKey = IntHotKey.toString();
                LowerBS.draw();
                this.StructureArray[this.StructureArray.length] = LowerBS;
                this.ObjectArray[this.ObjectArray.length] = LowerBS;
            }
            // init SCV's
            for (i = 0; i < 4; i++) {
                var NewSCV = new SCV("Player", imgRepo.TerranSCVBlue);
                NewSCV.pos(this.FriendlyCC.x + this.FriendlyCC.width + 5, this.FriendlyCC.y + (NewSCV.height + 5) * i);
                NewSCV.draw();
                this.ObjectArray[this.ObjectArray.length] = NewSCV;
                this.UnitArray[this.UnitArray.length] = NewSCV;
            }

            // Choose player start resources
            this.PlayerMinerals = 500;
            this.PlayerGas = 0;

            // calculate starting supply and maxsupply
            for (var i = 0, len = this.ObjectArray.length; i < len; i++) {
                if (this.ObjectArray[i].Faction === "Player") {
                    if (this.ObjectArray[i].MaxSupplyLift != undefined) {
                        this.PlayerMaxSupply += this.ObjectArray[i].MaxSupplyLift;
                    }
                    else if (this.ObjectArray[i].SupplyWeight != undefined) {
                        this.PlayerSupply += this.ObjectArray[i].SupplyWeight;
                    }
                }
            }
            this.ResourceChanges = true;

            // init map Resources
            // Gas Geyser
            this.SouthGasGeyser = new GasGeyser(30000);
            this.SouthGasGeyser.pos(this.FriendlyCC.x - 200 - this.SouthGasGeyser.width / 2, this.FriendlyCC.y + this.FriendlyCC.height / 2 - this.SouthGasGeyser.height / 2);
            this.SouthGasGeyser.HotKey = "T";
            this.SouthGasGeyser.draw();
            this.StructureArray[this.StructureArray.length] = this.SouthGasGeyser;
            this.ObjectArray[this.ObjectArray.length] = this.SouthGasGeyser;

            // Minerals
            for (var i = 0; i < 6; i++) {
                var CloseMineral = new MineralsBlue(10000);
                CloseMineral.pos(this.FriendlyCC.x + this.FriendlyCC.width + 150 + Math.floor(Math.random() * 10), this.FriendlyCC.y - 10 + (CloseMineral.height + 2) * i);
                CloseMineral.draw();
                this.MineralsArray[this.MineralsArray.length] = CloseMineral;
                this.ObjectArray[this.ObjectArray.length] = CloseMineral;
            }


            // init Zerg

            // init Main building.
            this.EnemyCC = new GreaterHive("Enemy",imgRepo.ZergMediumStageHivePurple);
            this.EnemyCC.pos(this.EnemyCC.canvasWidth / 2 - this.EnemyCC.width / 2, 50);
            this.EnemyCC.draw();
            this.StructureArray[this.StructureArray.length] = this.EnemyCC;
            this.ObjectArray[this.ObjectArray.length] = this.EnemyCC;
            // init spawning buildings
            for (i = 0; i < 2; i++) {
                var NewSpawningStructure = new SpawningStructure("Enemy", imgRepo.ZergSpawningStructurePurple);
                NewSpawningStructure.pos(200 + 420 * i, 320);
                NewSpawningStructure.draw();
                this.StructureArray[this.StructureArray.length] = NewSpawningStructure;
                this.ObjectArray[this.ObjectArray.length] = NewSpawningStructure;
            }
            NewSpawningStructure = new SpawningStructure("Enemy", imgRepo.ZergSpawningStructurePurple);
            NewSpawningStructure.pos(400, 370);
            NewSpawningStructure.draw();
            this.StructureArray[this.StructureArray.length] = NewSpawningStructure;
            this.ObjectArray[this.ObjectArray.length] = NewSpawningStructure;

            CurrentlySelected = this.FriendlyCC;
            PreviouslySelected = this.CommandHud;

            // inits quadtree. Used for collision detection
            this.QuadTree = new QuadTree({x:0,y:0,width:this.unitCanvas.width,height:this.unitCanvas.height});

            // scroll to bottom of page
            window.scrollTo(0, document.body.scrollHeight);

            this.ZergBioMass = 2; // The amount of unitweight that the zerg can send at the terran at a given time

            this.SpawnUnits = function () {
                // count zerg tech buildings
                // var SpawningPoolPresent = false;

                /*for (var i = 0, len = ObjectArray.length; i < len; i++) {
                    if (ObjectArray[i].Type === "Spawning Structure") {
                        // SpawningPoolPresent = true;
                    }
                }*/


                // spawn units based on amount of techbuildins present
                for (var i = 0, len = this.ObjectArray.length; i < len; i++) {
                    if (this.ObjectArray[i].Type === "Spawning Structure") {
                        for (var j = 0; j < this.ZergBioMass; j++) {
                            this.ObjectArray[i].SpawnQueue.push(new InfestedTerran("Enemy", imgRepo.ZergInfestedTerranPurple));
                            this.ObjectArray[i].SpawnQueue.push(new InfestedTerran("Enemy", imgRepo.ZergInfestedTerranPurple));
                        }


                        //ObjectArray[i].SpawnQueue.push(new InfestedTerran("Zerg", imgRepo.ZergInfestedTerranPurple));
                        //ObjectArray[i].SpawnQueue.push(new Zergling("Zerg", imgRepo.ZergZerglingPurple));

                    }
                }
            };

            this.NextSpawn = 1800;
            this.SpawnTimer = 30;

            // Extra animation: Handles timers (spawn, tech)
            this.ExtraAnimation = function () {
                //
                if (this.FrameTimer > this.NextSpawn) {
                    this.SpawnUnits();

                    this.NextSpawn = this.FrameTimer + this.SpawnTimer * 60;
                    if (this.ZergBioMass <= 30) {
                        this.ZergBioMass += 2;
                    }
                }



                // structure/tech. Sets a tech timer. At the end of it, spawns more buildings


            };



            // add eventhandlers
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
                for (i = 0, len = that.ObjectArray.length; i < len; i++) {
                    if (that.ObjectArray[i].x < x &&
                        that.ObjectArray[i].x + that.ObjectArray[i].height > x &&
                        that.ObjectArray[i].y < y &&
                        that.ObjectArray[i].y + that.ObjectArray[i].width > y) {

                        that.ObjectArray[i].Selected();
                        return;
                    }
                }
            },false);
            // Onmousemove handling for main canvas. Shows tooltips if mouse is over a hudoption
            this.messageCanvas.addEventListener("mousemove", function(e){
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

                // prints it to ele
                //MousePosEle.innerHTML = "( " + x + " , " + y + " )";
            },false);
            // Deletes tooltip if mouse leaves hudcanvas
            this.messageCanvas.addEventListener("mouseover", function(){
                that.messageContext.clearRect(that.messageCanvas.width - 320, that.messageCanvas.height - 520, 320, 520);
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

                for (i = 0, len = CurrentlySelected.HudOptionsArray.length; i < len; i++) {
                    if (CurrentlySelected.HudOptionsArray[i].x < x &&
                        CurrentlySelected.HudOptionsArray[i].x + CurrentlySelected.HudOptionsArray[i].height > x &&
                        CurrentlySelected.HudOptionsArray[i].y < y &&
                        CurrentlySelected.HudOptionsArray[i].y + CurrentlySelected.HudOptionsArray[i].width > y) {

                        CurrentlySelected.HudOptionsArray[i].Selected();
                        return;
                    }
                }

            },false);
            // Onmousemove handling to HUD canvas
            this.hudCanvas.addEventListener('mousemove', function (e) {

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

                // prints mouse position
                //MousePosEle.innerHTML = "( " + x + " , " + y + " )";

                // Shows tooltip if mouse over hud option
                for (var i = 0, len = CurrentlySelected.HudOptionsArray.length; i < len; i++) {
                    if (CurrentlySelected.HudOptionsArray[i].x < x &&
                        CurrentlySelected.HudOptionsArray[i].x + CurrentlySelected.HudOptionsArray[i].height > x &&
                        CurrentlySelected.HudOptionsArray[i].y < y &&
                        CurrentlySelected.HudOptionsArray[i].y + CurrentlySelected.HudOptionsArray[i].width > y) {

                        CurrentlySelected.HudOptionsArray[i].ShowToolTip();
                        return;
                    }
                }

                // this can't be used for some reason. Clears the amount of canvas that a tooltip can possibly take up
                that.messageContext.clearRect(that.messageCanvas.width - 320, that.messageCanvas.height - 520, 320, 520);
            }, false);
            // menu button
            this.topMenuBtn.addEventListener('click', function (e) {
                if (that.topMenu.style.visibility == "") {
                    var StartRecordingBtn = document.createElement("button");
                    StartRecordingBtn.innerHTML = "Start Recording";
                    StartRecordingBtn.addEventListener('click', function (e) {
                        Recording = true;
                    }, false);

                    var StopRecordingBtn = document.createElement("button");
                    StopRecordingBtn.innerHTML = "Stop Recording";
                    StopRecordingBtn.addEventListener('click', function (e) {

                        var sum = 0;
                        for (i = 0; i < RecordingsArray.length; i++) {
                            sum += RecordingsArray[i];
                        }

                        var ele = document.getElementById('RecordingResult');
                        ele.innerHTML = sum / RecordingsArray.length;

                        Recording = false;
                        RecordingsArray.length = 0;
                    }, false);

                    var RecordingResult = document.createElement("p");
                    RecordingResult.id = "RecordingResult";

                    var FPSText = document.createElement("p");
                    FPSText.id = "FPSText";
                    FPSText.innerHTML = "FPS: NA";

                    that.topMenu.appendChild(StartRecordingBtn);
                    that.topMenu.appendChild(StopRecordingBtn);
                    that.topMenu.appendChild(RecordingResult);
                    that.topMenu.appendChild(FPSText);

                    that.topMenu.style.visibility = "visible";
                }
                else {
                    that.topMenu.innerHTML = "";
                    that.topMenu.style.visibility = "";
                }
            }, false);
            // dev: prints fps. delete after game finished
            window.setInterval(function () {
                var ele = document.getElementById("FPSText");
                if (ele != undefined) {
                    ele.innerHTML = "FPS: " + FPS;
                    FPS = 0;
                }
            },1000);

            // returns true if nothing goes wrong, so the init function starts the animation
            return true
        }
        else return false;
    };

    this.initSandBox = function () {
        this.bgCanvas = document.getElementById("bgCanvas");
        this.structCanvas = document.getElementById('structCanvas');
        this.unitCanvas = document.getElementById('unitCanvas');
        this.messageCanvas = document.getElementById('messageCanvas');
        this.hudbgCanvas = document.getElementById('hudbgCanvas');
        this.hudCanvas = document.getElementById('hudCanvas');
        this.topMenuBtn = document.getElementById('topGameMenuBtn');
        this.topMenu = document.getElementById('topGameMenu');
        this.UnitPickerBtn = document.getElementById("UnitPickerBtn");
        this.StructurePickerBtn = document.getElementById("StructurePickerBtn");
        this.UnitPickerDiv = document.getElementById("UnitPickerDiv");
        this.StructurePickerDiv = document.getElementById("StructurePickerDiv");
        this.SandboxOptionsBtn = document.getElementById("SandboxOptionsBtn");
        this.SandboxOptionsDiv = document.getElementById("SandboxOptionsDiv");
        this.UnitNumberSelected = 0;
        this.FrameTimer = 0;

        if (this.bgCanvas.getContext) { // checks if canvas is supported in the browser
            this.bgContext = this.bgCanvas.getContext("2d");
            this.structContext = this.structCanvas.getContext("2d");
            this.unitContext = this.unitCanvas.getContext("2d");
            this.messageContext = this.messageCanvas.getContext("2d");
            this.hudbgContext = this.hudbgCanvas.getContext("2d");
            this.hudContext = this.hudCanvas.getContext("2d");

            // set dimensions of elements
            this.bgCanvas.height = 1920;
            this.bgCanvas.width = 960;
            this.structCanvas.height = 1920;
            this.structCanvas.width = 960;
            this.unitCanvas.height = 1920;
            this.unitCanvas.width = 960;
            this.messageCanvas.width = 960;
            this.messageCanvas.height = window.innerHeight - 200;
            this.hudbgCanvas.height = 200;
            this.hudbgCanvas.width = 960;
            this.hudCanvas.height = 200;
            this.hudCanvas.width = 960;
            document.body.style.height = "2104px";

            // create relations between object prototypes and game
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;

            Unit.prototype.context = this.unitContext;
            Unit.prototype.canvasWidth = this.unitCanvas.width;
            Unit.prototype.canvasHeight = this.unitCanvas.height;
            Unit.prototype.game = this;

            Structure.prototype.context = this.structContext;
            Structure.prototype.canvasWidth = this.structCanvas.width;
            Structure.prototype.canvasHeight = this.structCanvas.height;
            Structure.prototype.game = this;

            CommandHud.prototype.context = this.hudContext;
            CommandHud.prototype.game = this;
            AlertSystem.prototype.context = this.messageContext;
            AlertSystem.prototype.game = this;
            HudOption.prototype.game = this;

            // init Commandhud and Alertsystem
            this.Commandhud = new CommandHud();
            this.Alertsystem = new AlertSystem();

            // init games data structures
            this.ObjectArray = []; // Holds all objects in the game
            this.UnitArray = []; // Holds all units in the game
            this.StructureArray = []; // Holds all structures in the game
            this.DeadUnitsArray = []; // Holds all dead units
            this.DestroyedStructuresArray = []; // Holds all destroyed structures;
            this.MineralsArray = []; // Holds all mineable minerals

            // init background HUD
            this.hudbgContext.fillStyle = "#c3c3c3";
            this.hudbgContext.fillRect(0,0,this.hudCanvas.width,this.hudCanvas.height);
            this.hudbgContext.fillStyle = "#000000";
            this.hudbgContext.fillRect(5,5,this.hudCanvas.width - 10,this.hudCanvas.height - 10);

            // init background object.
            this.background = new Background(imgRepo.background, 64, 15, 30, 10,[
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
            ]);
            this.background.pos(0,0);
            this.background.draw();

            CurrentlySelected = this.CommandHud;
            PreviouslySelected = this.CommandHud;

            // inits quadtree. Used for collision detection
            this.QuadTree = new QuadTree({x:0,y:0,width:this.unitCanvas.width,height:this.unitCanvas.height});


            // populate ObjectPickers with units/structures
            this.createPickerImg = function (image, nr) {
                var Img = document.createElement("img");
                Img.className = "SandBoxPickerItems";
                Img.src = image.src;
                Img.number = nr;

                Img.addEventListener("click",function () {
                    var PickerItems = document.getElementsByClassName("SandBoxPickerItems");
                    if (Img.style.backgroundColor == "") {
                        // color all other black
                        for (var i = 0, len = PickerItems.length; i < len; i++) {
                            PickerItems[i].style.backgroundColor = "";
                        }
                        // color green
                        Img.style.backgroundColor = "rgb(0, 255, 0)";
                        // set number
                        that.UnitNumberSelected = Img.number;
                    }
                    else {
                        // color black
                        for (var i = 0, len = PickerItems.length; i < len; i++) {
                            PickerItems[i].style.backgroundColor = "";
                        }
                        // set number to 0
                        that.UnitNumberSelected = 0;
                    }
                }, false);
                Img.ondragstart = function() { return false; };

                return Img;
            };
            this.FillUnitPicker = function (div) {
                var FriendlyMarine = this.createPickerImg(imgRepo.MarineIcon, 1);
                var EnemyMarine = this.createPickerImg(imgRepo.MarineIcon, 2);
                var FriendlyZergling = this.createPickerImg(imgRepo.ZerglingIcon, 3);
                var EnemyZergling = this.createPickerImg(imgRepo.ZerglingIcon, 4);
                var FriendlyHydralisk = this.createPickerImg(imgRepo.HydraliskIcon, 5);
                var enemyHydralisk = this.createPickerImg(imgRepo.HydraliskIcon, 6);
                div.appendChild(FriendlyMarine);
                div.appendChild(EnemyMarine);
                div.appendChild(FriendlyZergling);
                div.appendChild(EnemyZergling);
                div.appendChild(FriendlyHydralisk);
                div.appendChild(enemyHydralisk);
            };
            this.FillStructurePicker = function (div) {
                var FriendlyAutoturret = this.createPickerImg(imgRepo.AutoTurretIcon, 7);
                var EnemyAutoturret = this.createPickerImg(imgRepo.AutoTurretIcon, 8);
                div.appendChild(FriendlyAutoturret);
                div.appendChild(EnemyAutoturret);
            };
            this.FillOptionsDiv = function (div) {
                var PauseBtn = document.createElement("button");
                PauseBtn.className = "SandBoxOptionItems";
                PauseBtn.innerHTML = "Pause";
                var ClearFieldBtn = document.createElement("button");
                ClearFieldBtn.className = "SandBoxOptionItems";
                ClearFieldBtn.innerHTML = "Clear Field";

                PauseBtn.addEventListener("click", function () {
                    GamePaused == false ? GamePaused = true : GamePaused = false;
                }, false);
                ClearFieldBtn.addEventListener("click", function () {
                    that.ClearUnitsFromField();
                }, false);

                div.appendChild(PauseBtn);
                div.appendChild(ClearFieldBtn);
            };

            this.FillUnitPicker(this.UnitPickerDiv);
            this.FillStructurePicker(this.StructurePickerDiv);
            this.FillOptionsDiv(this.SandboxOptionsDiv);

            // scroll to bottom of page
            window.scrollTo(0, document.body.scrollHeight);

            // add eventhandlers

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

                // uses the information to see if something has been clicked on if player isn't spawning.
                if (that.UnitNumberSelected == 0) {
                    for (i = 0, len = that.ObjectArray.length; i < len; i++) {
                        if (that.ObjectArray[i].x < x &&
                            that.ObjectArray[i].x + that.ObjectArray[i].height > x &&
                            that.ObjectArray[i].y < y &&
                            that.ObjectArray[i].y + that.ObjectArray[i].width > y) {

                            that.ObjectArray[i].Selected();
                            return;
                        }
                    }
                }
                else { // spawn the selected unit
                    switch (that.UnitNumberSelected) {
                        case 1:
                            that.SpawnUnit(Marine, "Player", imgRepo.TerranMarineBlue, x, y);
                            break;
                        case 2:
                            that.SpawnUnit(Marine, "Enemy", imgRepo.TerranMarineBlue, x, y);
                            break;
                        case 3:
                            that.SpawnUnit(Zergling, "Player", imgRepo.ZergZerglingGreen, x, y);
                            break;
                        case 4:
                            that.SpawnUnit(Zergling, "Enemy", imgRepo.ZergZerglingPurple, x, y);
                            break;
                        case 5:
                            that.SpawnUnit(Hydralisk, "Player", imgRepo.ZergHydraliskGreen, x, y);
                            break;
                        case 6:
                            that.SpawnUnit(Hydralisk, "Enemy", imgRepo.ZergHydraliskPurple, x, y);
                            break;
                        case 7:
                            that.SpawnUnit(AutoTurret, "Player", imgRepo.TerranAutoTurretBaseBlue, x, y);
                            break;
                        case 8:
                            that.SpawnUnit(AutoTurret, "Enemy", imgRepo.TerranAutoTurretBaseRed, x, y);
                            break;
                    }
                }
            },false);
            // Onmousemove handling for main canvas. Shows tooltips if mouse is over a hudoption
            this.messageCanvas.addEventListener("mousemove", function(e){
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

                // prints it to ele
                //MousePosEle.innerHTML = "( " + x + " , " + y + " )";
            },false);
            // Deletes tooltip if mouse leaves hudcanvas
            this.messageCanvas.addEventListener("mouseover", function(){
                that.messageContext.clearRect(that.messageCanvas.width - 320, that.messageCanvas.height - 520, 320, 520);
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
                if (CurrentlySelected != undefined) {
                    for (i = 0, len = CurrentlySelected.HudOptionsArray.length; i < len; i++) {
                        if (CurrentlySelected.HudOptionsArray[i].x < x &&
                            CurrentlySelected.HudOptionsArray[i].x + CurrentlySelected.HudOptionsArray[i].height > x &&
                            CurrentlySelected.HudOptionsArray[i].y < y &&
                            CurrentlySelected.HudOptionsArray[i].y + CurrentlySelected.HudOptionsArray[i].width > y) {

                            CurrentlySelected.HudOptionsArray[i].Selected();
                            return;
                        }
                    }
                }

            },false);
            // Onmousemove handling to HUD canvas
            this.hudCanvas.addEventListener('mousemove', function (e) {

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

                // prints mouse position
                //MousePosEle.innerHTML = "( " + x + " , " + y + " )";

                // Shows tooltip if mouse over hud option
                if (CurrentlySelected != undefined) {
                    for (var i = 0, len = CurrentlySelected.HudOptionsArray.length; i < len; i++) {
                        if (CurrentlySelected.HudOptionsArray[i].x < x &&
                            CurrentlySelected.HudOptionsArray[i].x + CurrentlySelected.HudOptionsArray[i].height > x &&
                            CurrentlySelected.HudOptionsArray[i].y < y &&
                            CurrentlySelected.HudOptionsArray[i].y + CurrentlySelected.HudOptionsArray[i].width > y) {

                            CurrentlySelected.HudOptionsArray[i].ShowToolTip();
                            return;
                        }
                    }
                }
                // this can't be used for some reason. Clears the amount of canvas that a tooltip can possibly take up
                that.messageContext.clearRect(that.messageCanvas.width - 320, that.messageCanvas.height - 520, 320, 520);
            }, false);
            // menu button
            this.topMenuBtn.addEventListener('click', function (e) {
                if (that.topMenu.style.visibility == "") {
                    var StartRecordingBtn = document.createElement("button");
                    StartRecordingBtn.innerHTML = "Start Recording";
                    StartRecordingBtn.addEventListener('click', function (e) {
                        Recording = true;
                    }, false);

                    var StopRecordingBtn = document.createElement("button");
                    StopRecordingBtn.innerHTML = "Stop Recording";
                    StopRecordingBtn.addEventListener('click', function (e) {

                        var sum = 0;
                        for (i = 0; i < RecordingsArray.length; i++) {
                            sum += RecordingsArray[i];
                        }

                        var ele = document.getElementById('RecordingResult');
                        ele.innerHTML = sum / RecordingsArray.length;

                        Recording = false;
                        RecordingsArray.length = 0;
                    }, false);

                    var RecordingResult = document.createElement("p");
                    RecordingResult.id = "RecordingResult";

                    var FPSText = document.createElement("p");
                    FPSText.id = "FPSText";
                    FPSText.innerHTML = "FPS: NA";

                    that.topMenu.appendChild(StartRecordingBtn);
                    that.topMenu.appendChild(StopRecordingBtn);
                    that.topMenu.appendChild(RecordingResult);
                    that.topMenu.appendChild(FPSText);

                    that.topMenu.style.visibility = "visible";
                }
                else {
                    that.topMenu.innerHTML = "";
                    that.topMenu.style.visibility = "";
                }
            }, false);
            // collapse / show objectpickers
            this.UnitPickerBtn.addEventListener('click', function (e) {
                if (that.UnitPickerDiv.style.visibility == "collapse") {
                    that.UnitPickerDiv.style.visibility = "visible";
                    that.FillUnitPicker(that.UnitPickerDiv);
                }
                else {
                    that.UnitPickerDiv.style.visibility = "collapse";
                    that.UnitPickerDiv.innerHTML = "";
                }
            }, false);
            this.StructurePickerBtn.addEventListener('click', function (e) {
                if (that.StructurePickerDiv.style.visibility == "collapse") {
                    that.StructurePickerDiv.style.visibility = "visible";
                    that.FillStructurePicker(that.StructurePickerDiv);
                }
                else {
                    that.StructurePickerDiv.style.visibility = "collapse";
                    that.StructurePickerDiv.innerHTML = "";
                }
            }, false);
            this.SandboxOptionsBtn.addEventListener('click', function (e) {
                if (that.SandboxOptionsDiv.style.visibility == "collapse") {
                    that.SandboxOptionsDiv.style.visibility = "visible";
                    that.FillOptionsDiv(that.SandboxOptionsDiv);
                }
                else {
                    that.SandboxOptionsDiv.style.visibility = "collapse";
                    that.SandboxOptionsDiv.innerHTML = "";
                }
            }, false);


            // dev: prints fps. delete after game finished
            window.setInterval(function () {
                var ele = document.getElementById("FPSText");
                if (ele != undefined) {
                    ele.innerHTML = "FPS: " + FPS;
                    FPS = 0;
                }
            },1000);

            // returns true if nothing goes wrong, so the init function starts the animation
            return true
        }
        else return false;
    };



    // spawn functions
    this.SpawnUnit = function (Unit, Faction, Image, x, y) {
        var newUnit = new Unit(Faction, Image);
        newUnit.pos(x - newUnit.width / 2,y - newUnit.height / 2);
        newUnit.draw();
        this.ObjectArray.push(newUnit);
        //this.UnitArray.push(newUnit);
    };

    // field functions
    this.ClearUnitsFromField = function () {
        for (var i = 0; i < this.ObjectArray.length; i++) {
            var obj = this.ObjectArray[i];
            if (obj != undefined && obj.SuperType == "Unit") {
                this.ObjectArray.splice(this.ObjectArray.indexOf(obj,1));
                obj.clear();
                i--;
            }
        }
    };

    //Game animation functions. Are run up to 60 times a second in animate function.

    // Collision detection for all units // Expand with quad-tree  // Still somewhat faulty
    this.CollisionDetection = function () {
        var objects = [];
        game.QuadTree.getAllObjects(objects);
        for (var i = 0, len = objects.length; i < len; i++) {
            if (objects[i].SuperType != "Structure") {
                var collidableObjects = [];
                game.QuadTree.findObjects(collidableObjects, objects[i]);
                for (var j = 0, len2 = collidableObjects.length; j < len2; j++) {
                    var ThisLongSide = objects[i].width <= objects[i].height ? objects[i].height : objects[i].width;

                    if (collidableObjects[j].Type != "Medium Building Spot" && collidableObjects[j].SuperType != "Missile" && objects[i] != collidableObjects[j]) {
                        var OtherLongSide = collidableObjects[j].width <= collidableObjects[j].height ? collidableObjects[j].height : collidableObjects[j].width;

                        // Initial box AABB collision detection.
                        if ((objects[i].x <= collidableObjects[j].x && objects[i].x + ThisLongSide > collidableObjects[j].x ||
                            collidableObjects[j].x < objects[i].x && collidableObjects[j].x + OtherLongSide > objects[i].x)
                            &&
                            (objects[i].y <= collidableObjects[j].y && objects[i].y + ThisLongSide > collidableObjects[j].y ||
                                collidableObjects[j].y < objects[i].y && collidableObjects[j].y + OtherLongSide > objects[i].x)) {

                            // finding distance between this units middle and other objects middle
                            var ThisMiddle_x = objects[i].x + objects[i].width / 2, ThisMiddle_y = objects[i].y + objects[i].height / 2;
                            var OtherMiddle_x = collidableObjects[j].x + collidableObjects[j].width / 2, OtherMiddle_y = collidableObjects[j].y + collidableObjects[j].height / 2;
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

                                // if object is a missile either collide with enemy or do nothing
                                if (objects[i].SuperType == "Missile") {
                                    if (objects[i].Faction != collidableObjects[j].Faction &&
                                    objects[j].Hp != undefined) {
                                        objects[i].CollisionWithEnemy(collidableObjects[j]);
                                    }
                                }

                                else {
                                    // this unit
                                    // Clear previous draw
                                    objects[i].clear();

                                    // calculate movement
                                    var Movement_x = Math.abs(Math.cos(ObjectAtAngle) * objects[i].MovementSpeed);
                                    var Movement_y = Math.abs(Math.cos(ObjectAtAngle) * objects[i].MovementSpeed);

                                    ThisMiddle_x < OtherMiddle_x ? objects[i].x -= Movement_x * 2.5: objects[i].x += Movement_x * 2.5;
                                    ThisMiddle_y < OtherMiddle_y ? objects[i].y -= Movement_y * 2.5: objects[i].y += Movement_y * 2.5;

                                    // other object
                                    if (collidableObjects[j].SuperType != "Structure") {
                                        collidableObjects[j].clear();

                                        // reverse angle
                                        ObjectAtAngle < Math.PI ? ObjectAtAngle += Math.PI : ObjectAtAngle -= Math.PI;

                                        // calculate movement
                                        Movement_x = Math.abs(Math.cos(ObjectAtAngle) * collidableObjects[j].MovementSpeed);
                                        Movement_y = Math.abs(Math.cos(ObjectAtAngle) * collidableObjects[j].MovementSpeed);
                                        //if (OtherMiddle_x > ThisMiddle_x) ObjectAtAngle = 2*Math.PI - Math.abs(ObjectAtAngle);

                                        OtherMiddle_x < ThisMiddle_x ? collidableObjects[j].x -= Movement_x * 2.5 : collidableObjects[j].x += Movement_x * 2.5;
                                        OtherMiddle_y < ThisMiddle_y ? collidableObjects[j].y -= Movement_y * 2.5 : collidableObjects[j].y += Movement_y * 2.5;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    // Handles target Detection and selection for all units
    this.TargetDetection = function () {
        var obj = this.ObjectArray; // local vars faster than this.var
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].AttackDamage != undefined) {
                if (obj[i].Working != true) {
                    // if unit is terran non building and on something else than attack move or hold position, don't find a target
                    if (obj[i].Faction === "Player" && obj[i].SuperType != "Structure" && CommandState != "Attack Move" && CommandState != "Hold Position") {
                        obj[i].CurrentTarget = null;
                    }


                    // if unit is not player controlled or on attack move or hold position, find closest target
                    else {
                        //if (UnitArray[i].CurrentTarget === null || UnitArray[i].CurrentTarget.SuperType === "Structure" || UnitArray[i].AttackForm === "Melee") {
                        var ThisUnitMiddle_x = obj[i].x + obj[i].width / 2, ThisUnitMiddle_y = obj[i].y + obj[i].height / 2;
                        var HighPriorityTargets = []; // Number of HighPriority targets nearby
                        var MediumPriorityTargets = []; // Number of HighPriority targets nearby
                        var LowPriorityTargets = []; // Number of HighPriority targets nearby

                        // if unit is melee, it always looks for a new target
                        if (obj[i].AttackForm == "Ranged" && obj[i].CurrentTarget != null) {
                            var EnemyMiddle_x = obj[i].CurrentTarget.x + obj[i].CurrentTarget.width / 2, EnemyMiddle_y = obj[i].CurrentTarget.y + obj[i].CurrentTarget.height / 2;
                            var x = Math.abs(ThisUnitMiddle_x - EnemyMiddle_x);
                            var y = Math.abs(ThisUnitMiddle_y - EnemyMiddle_y);
                            var pyth = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));

                            // if enemy is still inside attack range, don't find new target
                            if (obj[i].AttackRange + obj[i].CurrentTarget.HitCircleRadius > pyth) {
                                continue; // skips to the next iteration of the loop
                            }
                        }

                        // Checks for nearby targets
                        for (j = 0, len_j = obj.length; j < len_j; j++) {
                            if (obj[i].Faction != obj[j].Faction && obj[j].Hp != undefined){
                                var EnemyMiddle_x = obj[j].x + obj[j].width / 2, EnemyMiddle_y = obj[j].y + obj[j].height / 2;
                                var EnemyHitCircleRadius = obj[j].HitCircleRadius;

                                if (Math.abs(ThisUnitMiddle_y - EnemyMiddle_y) < obj[i].AggressionRange + EnemyHitCircleRadius &&
                                    Math.abs(ThisUnitMiddle_x - EnemyMiddle_x) < obj[i].AggressionRange + EnemyHitCircleRadius) { // for performance. Objects only look for targets within close proximity

                                    var x = Math.abs(ThisUnitMiddle_x - EnemyMiddle_x);
                                    var y = Math.abs(ThisUnitMiddle_y - EnemyMiddle_y);
                                    var pyth = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));

                                    if (pyth < obj[i].AggressionRange + EnemyHitCircleRadius) {
                                        if (obj[j].AttackDamage > 0 && obj[j].Working != true) {
                                            HighPriorityTargets[HighPriorityTargets.length] = obj[j];
                                            obj[j].DisFromUnit = pyth;
                                        }
                                        else if (obj[j].Working === true) {
                                            MediumPriorityTargets[MediumPriorityTargets.length] = obj[j];
                                            obj[j].DisFromUnit = pyth;
                                        }
                                        else {
                                            LowPriorityTargets[LowPriorityTargets.length] = obj[j];
                                            obj[j].DisFromUnit = pyth;
                                        }
                                    }
                                }
                            }
                        }

                        // Selects the closest high priority target as target
                        if (HighPriorityTargets.length != 0) {
                            var TargetUnit = HighPriorityTargets[0];
                            for (var k = 0, len = HighPriorityTargets.length; k < len; k++) {
                                if (HighPriorityTargets[k].DisFromUnit < TargetUnit.DisFromUnit)
                                    TargetUnit = HighPriorityTargets[k];
                            }
                            obj[i].CurrentTarget = TargetUnit;
                        }
                        // else the closest medium priority target
                        else if (MediumPriorityTargets.length != 0) {
                            var TargetUnit = MediumPriorityTargets[0];
                            for (var k = 0, len = MediumPriorityTargets.length; k < len; k++) {
                                if (MediumPriorityTargets[k].DisFromUnit < TargetUnit.DisFromUnit)
                                    TargetUnit = MediumPriorityTargets[k];
                            }
                            obj[i].CurrentTarget = TargetUnit;
                        }
                        // else the closest low priority target
                        else if (LowPriorityTargets.length != 0) {
                            var TargetUnit = LowPriorityTargets[0];
                            for (var k = 0, len = LowPriorityTargets.length; k < len; k++) {
                                if (LowPriorityTargets[k].DisFromUnit < TargetUnit.DisFromUnit)
                                    TargetUnit = LowPriorityTargets[k];
                            }
                            obj[i].CurrentTarget = TargetUnit;
                        }
                    }
                }
            }
        }
    };

    // is set to true every time something takes damage
    this.PossibleDeaths = false;
    // Checks if an object is destroyed
    this.DeathDetection = function () {
        if (this.PossibleDeaths === true) {
            for (var i = 0; i < this.ObjectArray.length; i++) {
                if (this.ObjectArray[i].Hp != null) {
                    if (this.ObjectArray[i].Hp <= 0) {
                        if (this.ObjectArray[i].SuperType === "Unit") {
                            // clears unit from canvas
                            this.ObjectArray[i].clear();

                            // initiates the death animation for this unit
                            this.ObjectArray[i].DeathAnimation();

                            // Set CurrentTarget for all units that has this unit as target to null
                            for (var j = 0, len = this.ObjectArray.length; j < len; j++) {
                                if (this.ObjectArray[j].CurrentTarget === this.ObjectArray[i]) this.ObjectArray[j].CurrentTarget = null;
                            }

                            // For dead scv's if they are harvesting from something, handle shit
                            if (this.ObjectArray[i].HarvestingFrom != null) {
                                this.ObjectArray[i].HarvestingFrom.HarvesterArray.splice(this.ObjectArray[i].HarvestingFrom.HarvesterArray.indexOf(this.ObjectArray[i]), 1);

                                if (this.ObjectArray[i].HarvestingFrom.OccupiedBy === this.ObjectArray[i]) {
                                    this.ObjectArray[i].HarvestingFrom.Occupied = false;
                                    this.ObjectArray[i].HarvestingFrom.OccupiedBy = null;
                                }

                                this.ObjectArray[i].HarvestingFrom = null;
                            }

                            // If unit is on the hud, clears the hud
                            if (this.ObjectArray[i] === CurrentlySelected){
                                PreviouslySelected = this.Commandhud;
                                this.Commandhud.Selected();
                            }
                            if (this.ObjectArray[i] === PreviouslySelected)
                                PreviouslySelected = this.Commandhud;

                            // if unit has supplyweight, remove it from playersupply
                            if (this.ObjectArray[i].Faction === "Player" && this.ObjectArray[i].SupplyWeight > 0) {
                                this.PlayerSupply -= this.ObjectArray[i].SupplyWeight;
                            }

                            this.DeadUnitsArray[this.DeadUnitsArray.length] = this.ObjectArray[i].Type;

                            // Deletes unit from arrays
                            this.UnitArray.splice(this.UnitArray.indexOf(this.ObjectArray[i]),1);
                            this.ObjectArray.splice(this.ObjectArray.indexOf(this.ObjectArray[i]),1);
                        }


                        else if (this.ObjectArray[i].SuperType === "Structure") {
                            // clear structure from canvas
                            this.ObjectArray[i].clear();

                            if (this.ObjectArray[i].Type === "Auto Turret") {
                                this.unitContext.clearRect(this.ObjectArray[i].x, this.ObjectArray[i].y, this.ObjectArray[i].width, this.ObjectArray[i].height);
                            }

                            // initiates the death animation for this structure
                            this.ObjectArray[i].DeathAnimation();

                            // Set CurrentTarget for all units that has this structure as target to null
                            for (j = 0, len = this.UnitArray.length; j < len; j++) {
                                if (this.UnitArray[j].CurrentTarget === this.ObjectArray[i]) this.UnitArray[j].CurrentTarget = null;
                            }

                            // If structure is on the hud, clears the hud
                            if (this.ObjectArray[i] === CurrentlySelected){
                                PreviouslySelected = this.FriendlyCC;
                                this.Commandhud.Selected();
                            }

                            this.DestroyedStructuresArray[this.DestroyedStructuresArray.length] = this.ObjectArray[i].Type;

                            // If structure is a Refinery, replaces it with a gas geyser
                            if (this.ObjectArray[i].Type === "Refinery") {
                                this.SouthGasGeyser = new GasGeyser(this.ObjectArray[i].GasAmount);
                                this.SouthGasGeyser.HotKey = this.ObjectArray[i].HotKey;
                                this.SouthGasGeyser.pos(this.ObjectArray[i].x, this.ObjectArray[i].y);
                                this.SouthGasGeyser.draw();
                                this.StructureArray[this.StructureArray.indexOf(this.ObjectArray[i])] = this.SouthGasGeyser;
                                this.ObjectArray[this.ObjectArray.indexOf(this.ObjectArray[i])] = this.SouthGasGeyser;
                            }
                            // If structure is Terran (not cc), replaces it with a building spot.
                            else if (this.ObjectArray[i].Faction === "Player" && this.ObjectArray[i].Type != "Command Center") {
                                var NewBuildingSpot = new BuildingSpot("Medium Building Spot", "Terran", "Player", 64, 64);
                                NewBuildingSpot.HotKey = this.ObjectArray[i].HotKey;
                                NewBuildingSpot.pos(
                                    this.ObjectArray[i].x + this.ObjectArray[i].width / 2 - NewBuildingSpot.width / 2,
                                    this.ObjectArray[i].y + this.ObjectArray[i].height / 2 - NewBuildingSpot.height / 2
                                );
                                NewBuildingSpot.draw();
                                this.StructureArray[this.StructureArray.indexOf(this.ObjectArray[i])] = NewBuildingSpot;
                                this.ObjectArray[this.ObjectArray.indexOf(this.ObjectArray[i])] = NewBuildingSpot;
                            }
                            // else removes it froms arrays
                            else {
                                this.StructureArray.splice(this.StructureArray.indexOf(this.ObjectArray[i]),1);
                                this.ObjectArray.splice(this.ObjectArray.indexOf(this.ObjectArray[i]),1);
                            }
                        }
                    }
                }

                // If Minerals are depleted, remove them
                else if (this.ObjectArray[i].Type === "Blue Minerals" || this.ObjectArray[i].Type === "Gold Minerals") {
                    if (this.ObjectArray[i].MineralAmount <= 0) {
                        this.ObjectArray[i].clear();

                        while (this.ObjectArray[i].HarvesterArray.length > 0) {
                            this.ObjectArray[i].HarvesterArray.pop();
                        }

                        for (var k = 0, len2 = this.UnitArray.length; k < len2; k++) {
                            if (this.UnitArray[k].HarvestingFrom === this.ObjectArray[i]) {
                                this.UnitArray[k].HarvestingFrom = null;
                            }
                        }

                        this.MineralsArray.splice(this.MineralsArray.indexOf(this.ObjectArray[i]), 1);
                        this.ObjectArray.splice(this.ObjectArray.indexOf(this.ObjectArray[i]), 1);
                    }
                }
            }

            this.PossibleDeaths = false;
        }
    };

    // Animates all objects on canvas
    this.Animation = function () {
        for (i = 0, len = this.ObjectArray.length; i < len; i++) {
            if (this.ObjectArray[i] != undefined) {
                this.ObjectArray[i].animate();
            }
        }
    };

    // Update Resources on messagecanvas, if changes have been made
    this.ResourceChanges = false;
    this.ResourceUpdate = function () {
        if (this.ResourceChanges === true) {
            this.messageContext.clearRect(735, 0, 225, 25);

            this.messageContext.fillStyle = "#FFFFFF";
            this.messageContext.font = "14px Arial";
            this.messageContext.drawImage(imgRepo.MineralsIcon, 740, 2, 16, 16);
            this.messageContext.fillText(this.PlayerMinerals, 760, 15, 50);
            this.messageContext.drawImage(imgRepo.GasIcon, 810, 2, 16, 16);
            this.messageContext.fillText(this.PlayerGas, 830, 15, 50);
            this.messageContext.drawImage(imgRepo.SupplyDepotIcon, 880, 2, 16, 16);
            this.PlayerMaxSupply < this.PlayerSupply ? this.messageContext.fillStyle = "#FF0000" : this.messageContext.fillStyle = "#FFFFFF";
            this.messageContext.fillText(this.PlayerSupply + " / " + this.PlayerMaxSupply, 900, 15, 50);
        }
    };

    // Allows extra utility to levels. defined in init functions
    this.ExtraAnimation = function () {
        // abstract
    };

    // Starts the animations after everything has been loaded.
    this.start = function(){
        AnimationVar = requestAnimationFrame(animate);
    }
}

// CommandHud Object. Contains draw and options for Commandhud
function CommandHud () {
    this.HudOptionsArray = [];

    // Command State options
    this.HudOptionsArray.push(new CommandStateOption(this, 15, 15, "Spread Out", "Q", function () {
        this.Caller.context.fillText("Spread", this.x + 7, this.y + 30);
        this.Caller.context.fillText("Out", this.x + 18, this.y + 45);
    })); // Spread Out
    this.HudOptionsArray.push(new CommandStateOption(this, 15 + 60 * 2, 15, "Group Up", "E", function () {
        this.Caller.context.fillText("Group", this.x + 12, this.y + 30);
        this.Caller.context.fillText("Up", this.x + 22, this.y + 45);
    })); // Group Up
    this.HudOptionsArray.push(new CommandStateOption(this, 15, 15 + 60 * 2, "Attack Move", "Z", function () {
        this.Caller.context.fillText("Attack", this.x + 12, this.y + 30);
        this.Caller.context.fillText("Move", this.x + 14, this.y + 45);
    })); // Attack Move
    this.HudOptionsArray.push(new CommandStateOption(this, 15 + 60, 15 + 60 * 2, "Passive Move", "X", function () { // Passive Move
        this.Caller.context.fillText("Passive", this.x + 3, this.y + 30);
        this.Caller.context.fillText("Move", this.x + 12, this.y + 45);
    })); // Passive Move
    this.HudOptionsArray.push(new CommandStateOption(this, 15 + 60 * 2, 15 + 60 * 2, "Hold Position", "C", function () { // Passive Move
        this.Caller.context.fillText("Hold", this.x + 12, this.y + 30);
        this.Caller.context.fillText("Position", this.x + 3, this.y + 45);
    })); // Passive Move

    // Move Direction Options
    this.HudOptionsArray.push(new MoveDirectionOption(this, 15 + 60, 15, "Up", "W", function () {
        this.Caller.context.beginPath();
        this.Caller.context.moveTo(this.x + 15, this.y + 30);
        this.Caller.context.lineTo(this.x + 30, this.y + 15);
        this.Caller.context.lineTo(this.x + 45, this.y + 30);
        this.Caller.context.lineTo(this.x + 35, this.y + 30);
        this.Caller.context.lineTo(this.x + 35, this.y + 45);
        this.Caller.context.lineTo(this.x + 25, this.y + 45);
        this.Caller.context.lineTo(this.x + 25, this.y + 30);
        this.Caller.context.closePath();

        this.Caller.context.fillStyle = "#FFFFFF";
        this.Caller.context.fill();
    }));  // Move Up
    this.HudOptionsArray.push(new MoveDirectionOption(this, 15, 15 + 60, "Left", "A", function () {
        this.Caller.context.beginPath();
        this.Caller.context.moveTo(this.x + 15, this.y + 30);
        this.Caller.context.lineTo(this.x + 30, this.y + 15);
        this.Caller.context.lineTo(this.x + 30, this.y + 25);
        this.Caller.context.lineTo(this.x + 45, this.y + 25);
        this.Caller.context.lineTo(this.x + 45, this.y + 35);
        this.Caller.context.lineTo(this.x + 30, this.y + 35);
        this.Caller.context.lineTo(this.x + 30, this.y + 45);
        this.Caller.context.closePath();

        this.Caller.context.fillStyle = "#FFFFFF";
        this.Caller.context.fill();
    }));  // Move Left
    this.HudOptionsArray.push(new MoveDirectionOption(this, 15 + 60, 15 + 60, "Down", "S", function () {
        this.Caller.context.beginPath();
        this.Caller.context.moveTo(this.x + 15, this.y + 30);
        this.Caller.context.lineTo(this.x + 25, this.y + 30);
        this.Caller.context.lineTo(this.x + 25, this.y + 15);
        this.Caller.context.lineTo(this.x + 35, this.y + 15);
        this.Caller.context.lineTo(this.x + 35, this.y + 30);
        this.Caller.context.lineTo(this.x + 45, this.y + 30);
        this.Caller.context.lineTo(this.x + 30, this.y + 45);
        this.Caller.context.closePath();

        this.Caller.context.fillStyle = "#FFFFFF";
        this.Caller.context.fill();
    }));  // Move Down
    this.HudOptionsArray.push(new MoveDirectionOption(this, 15 + 60 * 2, 15 + 60, "Right", "D", function () {
        this.Caller.context.beginPath();
        this.Caller.context.moveTo(this.x + 30, this.y + 15);
        this.Caller.context.lineTo(this.x + 45, this.y + 30);
        this.Caller.context.lineTo(this.x + 30, this.y + 45);
        this.Caller.context.lineTo(this.x + 30, this.y + 35);
        this.Caller.context.lineTo(this.x + 15, this.y + 35);
        this.Caller.context.lineTo(this.x + 15, this.y + 25);
        this.Caller.context.lineTo(this.x + 30, this.y + 25);
        this.Caller.context.closePath();

        this.Caller.context.fillStyle = "#FFFFFF";
        this.Caller.context.fill();
    }));  // Move Right

    this.Selected = function () {
        if (CurrentlySelected != this) PreviouslySelected = CurrentlySelected;
        if (CurrentlySelected != this) CurrentlySelected.clear();
        CurrentlySelected = this;

        // clears hud
        this.context.clearRect(0,0,this.game.hudCanvas.width,this.game.hudCanvas.height);

        this.HudOptionsDraw();

        this.NextSpawnTimerDraw();

        this.DrawGameTimer();
    };

    this.HudOptionsDraw = function () {
        for (var i = 0, len = this.HudOptionsArray.length; i < len; i++) {
            this.HudOptionsArray[i].draw();
        }
    };

    this.NextSpawnTimerDraw = function () {
        this.context.fillStyle = "#ffffff";
        this.context.font = "20px Arial";
        this.context.fillText("Time untill next spawn:", 400, 30);
        var NextSpawnInSec = Math.floor((this.game.NextSpawn - this.game.FrameTimer) / 60);
        this.context.fillText(NextSpawnInSec, 470, 60);
    };

    this.DrawGameTimer = function () {
        var Sec = 0, Min = 0, Hour = 0;

        Hour = Math.floor(this.game.FrameTimer / 60 / 60 / 60);
        Min = Math.floor((this.game.FrameTimer / 60 / 60) % 60);
        Sec = Math.floor((this.game.FrameTimer / 60) % 60);

        if (Min < 10) Min = "0" + Min.toString();
        if (Sec < 10) Sec = "0" + Sec.toString();

        this.context.font = "12px Arial";
        this.context.fillStyle = "#ffffff";
        this.context.fillText("Time Passed:", 800, 20);
        this.context.fillText(Hour + " : " + Min + " : " + Sec, 895, 20);
    };
}

// Units

// abstract unit object. All units inherit from this.
function Unit(Type, Hp, Armor, BuildTime, MineralCost, GasCost, SupplyWeight, MovementSpeed, AttackDamage, AttackSpeed,
              AttackRange, AttackForm, PossibleTargets, AggressionRange, MovementForm, Race, Faction, Width, Height, Image,
              Icon, Description){
    this.SuperType = "Unit";
    this.Type = Type;
    this.MaxHp = Hp;
    this.Hp = Hp;
    this.Armor = Armor;
    this.BuildTime = BuildTime;
    this.MineralCost = MineralCost;
    this.GasCost = GasCost;
    this.SupplyWeight = SupplyWeight;
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
    this.HitCircleRadius = this.width > this.height ? this.width / 2 : this.height / 2;
    this.Image = Image;
    this.Icon = Icon;
    this.Description = Description;

    this.CurrentTarget = null;
    this.RotationAngle = 0; // current rotation in radians

    // "private" properties
    this.Attacking = false; // used along with draw to correctly draw attack animations
    this.AttackAnimationLength = 0.5;
    this.LastAttackTime = 0;

    this.HudOptionsArray = [];

    // All friendly units can selfdestroy
    this.DeleteOption = new DeleteOption(this, 710 + (55 + 5) * 3, 10 + (55 + 5) * 2, "V");
    this.HudOptionsArray.push(this.DeleteOption);

    this.canvas = document.getElementById('unitCanvas');
    this.context = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    // Used to quickly change position of unit
    this.pos = function(x, y){
        this.x = x;
        this.y = y;
    };

    // Used to spawn a unit at x,y coordinates
    this.spawn = function (x, y) {
        // abstract
    };

    // Draws the unit on canvas correctly rotated
    this.draw = function(){
        var prev_x = this.x, prev_y = this.y;
        this.context.save();
        this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.x = 0 - this.width / 2;
        this.y = 0 - this.height / 2;
        this.context.rotate(this.RotationAngle);

        // draw attack animation if unit recently attacked
        if (this.game.FrameTimer > this.LastAttackTime && this.game.FrameTimer < this.LastAttackTime + this.AttackAnimationLength * 60 && this.Attacking === true) {
            this.AttackAnimation();
        }

        this.context.drawImage(this.Image, this.x,this.y,this.width,this.height);
        this.context.restore();
        this.pos(prev_x, prev_y);

        // draws hp bar on top of unit if not full health
        if (this.Hp < this.MaxHp) {
            this.context.fillStyle = "#999999";
            this.context.fillRect(this.x - 2, this.y - 2, this.width + 4, 5);

            var PercentHealth = this.Hp / this.MaxHp;
            var HealthbarInPx = PercentHealth * (this.width + 4);
            if (PercentHealth > 0.66) {
                this.context.fillStyle = "#33CC00";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
            else if (PercentHealth > 0.33) {
                this.context.fillStyle = "#ffff00";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
            else {
                this.context.fillStyle = "#ff0000";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
        }

        // if unit is selected, draw green ring around it
        if (CurrentlySelected === this) {
            this.context.beginPath();
            this.context.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2,2)),
                0,
                Math.PI * 2
            );
            this.context.strokeStyle = "#33CC00";
            this.context.lineWidth = 1;
            this.context.stroke();
        }
    };

    // clears the unit from canvas correctly rotated
    this.clear = function () {
        this.context.globalCompositeOperation = "destination-out";
        this.context.beginPath();
        this.context.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2,2)) + 5,
            0,
            Math.PI * 2
        );
        this.context.fill();
        this.context.globalCompositeOperation = "source-over";
    };

    // fires if unit is clicked on
    this.Selected = function () {
        // Clears the circle from the old selected object and sets this is Currently selected
        if (CurrentlySelected != undefined) {
            if (CurrentlySelected != this) PreviouslySelected = CurrentlySelected;
            if (CurrentlySelected != this.game.Commandhud) CurrentlySelected.clear();
        }
        CurrentlySelected = this;

        // Clears hud
        this.game.hudContext.clearRect(0,0,this.game.hudCanvas.width,this.game.hudCanvas.height);

        // draws seperator lines on hud
        this.game.hudContext.fillStyle = "#c3c3c3";
        this.game.hudContext.fillRect(320,5,5,this.game.hudCanvas.height);
        this.game.hudContext.fillRect(700,5,5,this.game.hudCanvas.height);

        // Fills hud with object info
        this.game.hudContext.fillStyle = "#ffffff";
        this.game.hudContext.drawImage(this.Icon,20,20,110,110);
        this.game.hudContext.font = "18px Arial";
        if (this.Hp != null) this.game.hudContext.fillText(this.Hp,20, 165, 45);
        if (this.Hp != null) this.game.hudContext.fillText("/",70, 165);
        if (this.Hp != null) this.game.hudContext.fillText(this.MaxHp,90, 165);
        this.game.hudContext.fillText(this.Type, 160, 35,150);
        this.game.hudContext.font = "14px Arial";
        this.game.hudContext.fillText("Faction:            " + this.Faction, 160, 65);
        if (this.AttackDamage != null) this.game.hudContext.fillText("Atk Damage:     " + this.AttackDamage, 160, 85);
        if (this.AttackSpeed != null) this.game.hudContext.fillText("Atk Speed:        " + this.AttackSpeed, 160, 105);
        if (this.AttackRange != null) this.game.hudContext.fillText("Atk Range:        " + this.AttackRange, 160, 125);
        if (this.MovementSpeed != null) this.game.hudContext.fillText("Move Speed:     " + this.MovementSpeed, 160, 145);

        // Draws hud options if implemented
        if (this.HudOptionsDraw != null && this.HudOptionsDraw != undefined) this.HudOptionsDraw();
    };

    // Animation. Runs from the animate function once each frame.
    this.animate = function () {
        this.Attacking = false;

        // If this unit is not a player unit attackmove.
        if (this.Faction != "Player") this.AttackMove();

        // if this unit is a player unit, react according to command state
        else {
            if (CommandState === "Attack Move") this.AttackMove();

            else if (CommandState === "Passive Move") this.PassiveMove();

            else if (CommandState === "Hold Position") this.HoldPosition();

            else if (CommandState === "Spread Out") this.SpreadOut();

            else if (CommandState === "Group Up") this.GroupUp();

            //else this.Group(); // dev: check if applicable
        }
    };

    this.Attack = function () {
        var damage = this.AttackDamage - this.CurrentTarget.Armor;

        if (damage < 1) damage = 1;
        this.CurrentTarget.Hp -= damage;

        // Show attack animation
        this.LastAttackTime = this.game.FrameTimer;

        // Play attack animation sound

        // Show sign on enemy that it has been attacked

        if (this.CurrentTarget.Hp <= 0) {
            this.game.PossibleDeaths = true; // notify the game that it has to check if any objects are destroyed
        }
    };

    // Units move in MoveDirection while attacking everything in attackrange
    this.AttackMove = function () {
        var ThisMiddle_x = this.x + this.width / 2, ThisMiddle_y = this.y + this.height / 2;

        // If the unit has a target
        if (this.CurrentTarget != null) {
            var EnemyMiddle_x = this.CurrentTarget.x + this.CurrentTarget.width / 2, EnemyMiddle_y = this.CurrentTarget.y + this.CurrentTarget.height / 2;

            // angle between two lines formular. Used to decide where to turn and move towards.
            var top = ThisMiddle_y - EnemyMiddle_y;
            var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));
            var EnemyAtAngle = Math.acos(top/bottom);

            // Rotate towards enemy
            if (ThisMiddle_x > EnemyMiddle_x) EnemyAtAngle = 2*Math.PI - Math.abs(EnemyAtAngle);
            this.RotationAngle = EnemyAtAngle;

            // calculate current distance to enemy
            var DistanceToEnemy = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));

            // If enemy is within attack range. ATTACK !!!
            if (DistanceToEnemy < this.AttackRange + this.CurrentTarget.width / 2) {
                this.Attacking = true;

                // If AttackCooldown isn't down, attack
                if (this.game.FrameTimer > this.LastAttackTime + this.AttackSpeed * 60){
                    this.Attack();
                }
            }

            // if enemy is targeted but not in attackrange, move towards it.
            else{
                // calculate movement
                var Movement_x = Math.abs(Math.sin(EnemyAtAngle) * this.MovementSpeed);
                var Movement_y = Math.abs(Math.cos(EnemyAtAngle) * this.MovementSpeed);

                // apply movement
                ThisMiddle_x < EnemyMiddle_x ? this.x += Movement_x : this.x -= Movement_x;
                EnemyMiddle_y < ThisMiddle_y ? this.y -= Movement_y : this.y += Movement_y;
            }
        }

        // if no enemy is targeted move in MoveDirection
        else {
            // determine new rotation angle and moves
            if (this.Faction === "Player") {
                if (MoveDirection === "Up") {
                    this.pos(this.x, this.y - this.MovementSpeed);
                    this.RotationAngle = 0;
                }
                else if (MoveDirection === "Right") {
                    this.pos(this.x + this.MovementSpeed, this.y);
                    this.RotationAngle = Math.PI / 2;
                }
                else if (MoveDirection === "Down") {
                    this.pos(this.x, this.y + this.MovementSpeed);
                    this.RotationAngle = Math.PI;
                }
                else {
                    this.pos(this.x - this.MovementSpeed, this.y);
                    this.RotationAngle = Math.PI * 1.5;
                }
            }

            // if this unit isn't player controlled. If friendly go towards enemy base, otherwise go towards friendly base
            else  {
                this.Faction === "Friendly" ? this.pos(this.x, this.y - this.MovementSpeed) : this.pos(this.x, this.y + this.MovementSpeed);
                this.Faction === "Friendly" ? this.RotationAngle = 0 : this.RotationAngle = Math.PI;
            }
        }
    };

    // Units move in MoveDirection without attacking
    this.PassiveMove = function () {
        // determine new rotation angle and moves
        if (this.Faction === "Player") {
            if (MoveDirection === "Up") {
                this.pos(this.x, this.y - this.MovementSpeed);
                this.RotationAngle = 0;
            }
            else if (MoveDirection === "Right") {
                this.pos(this.x + this.MovementSpeed, this.y);
                this.RotationAngle = Math.PI / 2;
            }
            else if (MoveDirection === "Down") {
                this.pos(this.x, this.y + this.MovementSpeed);
                this.RotationAngle = Math.PI;
            }
            else {
                this.pos(this.x - this.MovementSpeed, this.y);
                this.RotationAngle = Math.PI * 1.5;
            }
        }
    };

    // Units stand still while attacking everything in range
    this.HoldPosition = function () {
        var ThisMiddle_x = this.x + this.width / 2, ThisMiddle_y = this.y + this.height / 2;

        // If the unit has a target
        if (this.CurrentTarget != null) {
            var EnemyMiddle_x = this.CurrentTarget.x + this.CurrentTarget.width / 2, EnemyMiddle_y = this.CurrentTarget.y + this.CurrentTarget.height / 2;

            // angle between two lines formular. Used to decide where to turn and move towards.
            var top = ThisMiddle_y - EnemyMiddle_y;
            var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));
            var EnemyAtAngle = Math.acos(top/bottom);

            // apply rotation
            if (ThisMiddle_x > EnemyMiddle_x) EnemyAtAngle = 2*Math.PI - Math.abs(EnemyAtAngle);
            this.RotationAngle = EnemyAtAngle;

            // calculate current distance to enemy
            var DistanceToEnemy = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));

            // If enemy is within attack range. ATTACK !!!
            if (DistanceToEnemy < this.AttackRange + this.CurrentTarget.width / 2) {
                this.Attacking = true;

                // If AttackCooldown isn't down, attack
                if (this.game.FrameTimer > this.LastAttackTime + this.AttackSpeed * 60){
                    var damage = this.AttackDamage - this.CurrentTarget.Armor;

                    if (damage < 1) damage = 1;
                    this.CurrentTarget.Hp -= damage;

                    // Show attack animation
                    this.LastAttackTime = this.game.FrameTimer;
                    this.AttackAnimation();

                    // Play attack animation sound

                    // Show sign on enemy that it has been attacked

                    if (this.CurrentTarget.Hp <= 0) {
                        this.game.PossibleDeaths = true; // notify the game that it has to check if any objects are destroyed
                    }
                }
            }
        }
    };

    // Units move away from the midpoint between all friendly units
    this.SpreadOut = function () {
        // find midpoint between all friendly units
        var SumOfUnitMiddle_x = 0, SumOfUnitMiddle_y = 0, NumOfFriendlyUnits = 0;
        for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
            if (this.game.UnitArray[i].Faction === "Player" && this.game.UnitArray[i].Working != true) {
                SumOfUnitMiddle_x += this.game.UnitArray[i].x + this.game.UnitArray[i].width / 2;
                SumOfUnitMiddle_y += this.game.UnitArray[i].y + this.game.UnitArray[i].height / 2;
                NumOfFriendlyUnits += 1;
            }
        }

        // if there are friendly units beside this one, move away from the average midpoint
        if (NumOfFriendlyUnits > 1) {
            var AverageMiddlePoint_x = SumOfUnitMiddle_x / NumOfFriendlyUnits, AverageMiddlePoint_y = SumOfUnitMiddle_y / NumOfFriendlyUnits;

            // calculate angle between this unit and middle point
            var ThisMiddle_x = this.x + this.width / 2, ThisMiddle_y = this.y + this.height / 2;

            // angle between two lines formular. Used to decide where to turn and move towards.
            var top = ThisMiddle_y - AverageMiddlePoint_y;
            var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - AverageMiddlePoint_x),2) + Math.pow(Math.abs(ThisMiddle_y - AverageMiddlePoint_y),2));
            var MidPointAtAngle = Math.acos(top/bottom);

            // calculate movement
            var Movement_x = Math.abs(Math.sin(MidPointAtAngle) * this.MovementSpeed);
            var Movement_y = Math.abs(Math.cos(MidPointAtAngle) * this.MovementSpeed);

            // find correct rotation
            if (ThisMiddle_x > AverageMiddlePoint_x) MidPointAtAngle = 2*Math.PI - Math.abs(MidPointAtAngle);

            // rotate unit 180 degrees so they go away from center
            MidPointAtAngle > Math.PI ? MidPointAtAngle -= Math.PI : MidPointAtAngle += Math.PI;

            // apply movement
            ThisMiddle_x > AverageMiddlePoint_x ? this.x += Movement_x : this.x -= Movement_x;
            AverageMiddlePoint_y > ThisMiddle_y ? this.y -= Movement_y : this.y += Movement_y;

            // Apply rotation
            this.RotationAngle = MidPointAtAngle;
        }
    };

    // Units move closer to the midpoint between all friendly units
    this.GroupUp = function () {
        // find midpoint between all friendly units
        var SumOfUnitMiddle_x = 0, SumOfUnitMiddle_y = 0, NumOfFriendlyUnits = 0;
        for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
            if (this.game.UnitArray[i].Faction === "Player" && this.game.UnitArray[i].Working != true) {
                SumOfUnitMiddle_x += this.game.UnitArray[i].x + this.game.UnitArray[i].width / 2;
                SumOfUnitMiddle_y += this.game.UnitArray[i].y + this.game.UnitArray[i].height / 2;
                NumOfFriendlyUnits += 1;
            }
        }

        // if there are friendly units beside this one, move closer to the average midpoint
        if (NumOfFriendlyUnits > 1) {
            var AverageMiddlePoint_x = SumOfUnitMiddle_x / NumOfFriendlyUnits, AverageMiddlePoint_y = SumOfUnitMiddle_y / NumOfFriendlyUnits;

            // calculate angle between this unit and middle point
            var ThisMiddle_x = this.x + this.width / 2, ThisMiddle_y = this.y + this.height / 2;

            // angle between two lines formular. Used to decide where to turn and move towards.
            var top = ThisMiddle_y - AverageMiddlePoint_y;
            var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - AverageMiddlePoint_x),2) + Math.pow(Math.abs(ThisMiddle_y - AverageMiddlePoint_y),2));
            var MidPointAtAngle = Math.acos(top/bottom);

            // calculate movement
            var Movement_x = Math.abs(Math.sin(MidPointAtAngle) * this.MovementSpeed);
            var Movement_y = Math.abs(Math.cos(MidPointAtAngle) * this.MovementSpeed);
            if (ThisMiddle_x > AverageMiddlePoint_x) MidPointAtAngle = 2*Math.PI - Math.abs(MidPointAtAngle);

            ThisMiddle_x < AverageMiddlePoint_x ? this.x += Movement_x : this.x -= Movement_x;
            AverageMiddlePoint_y < ThisMiddle_y ? this.y -= Movement_y : this.y += Movement_y;

            // apply rotation
            this.RotationAngle = MidPointAtAngle;
        }
    };

    // Fires when a unit dies // should be abstract. Is just a red blood splatter right now
    this.DeathAnimation = function () {
        this.game.bgContext.beginPath();
        this.game.bgContext.fillStyle = "#CC0000";
        this.game.bgContext.globalAlpha = 0.5;
        this.game.bgContext.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width < this.height ? this.height : this.width
            ,0,2*Math.PI);
        this.game.bgContext.fill();
    };

    // abstract function. Draws hudoptions on hud.
    this.HudOptionsDraw = function () {
        for (var i = 0, len = this.HudOptionsArray.length; i < len; i++) {
            this.HudOptionsArray[i].draw();
        }
    };

    // Abstract function. If a unit has more animation, this is implemented in the child object
    this.ExtraAnimation = function () {
        // abstract
    };

    // AttackAnimation. Is used in draw function.
    this.AttackAnimation = function () {
        // abstract
    };
}

// Terran
function Marine(Faction, Image){
    Unit.call(this, "Marine", 45, 0, 2, 50, 0, 1, 0.5, 6, 1.25, 160, "Ranged", "Air and Ground", 450, "Ground", "Terran", Faction,
              24, 24, Image, imgRepo.MarineIcon, "All-purpose infantry");

    var AttackCooldown = false;
    var AttackReadyAt = 0;
    var AttackStanceImg = this.Faction === "Player" ? imgRepo.TerranMarineBlueAttackStance : imgRepo.TerranMarineRedAttackStance;
    var NormalStanceImg = this.Faction === "Player" ? imgRepo.TerranMarineBlue : imgRepo.TerranMarineRed;
    // dev: do something about the above
    this.AttackAnimationLength = 0.6125;

    // Marine Attack animation (little yellow cone on gun)
    this.AttackAnimation = function () {
        this.game.unitContext.fillStyle = "#ffff00";
        this.game.unitContext.beginPath();
        this.game.unitContext.moveTo(this.x + 3, this.y + 2);
        var rand = Math.floor(Math.random() * 3);
        this.game.unitContext.lineTo(this.x - rand, this.y - 1 - rand);
        this.game.unitContext.lineTo(this.x + 5, this.y);
        this.game.unitContext.closePath();
        this.game.unitContext.fill();
    };

    // Overriden. marine image goes back to normalstance.
    this.animate = function () {
        this.Image = NormalStanceImg;
        this.Attacking = false;

        // If this unit is not a player unit attackmove.
        if (this.Faction != "Player") this.AttackMove();

        // if this unit is a player unit, react according to command state
        else {
            if (CommandState === "Attack Move") this.AttackMove();

            else if (CommandState === "Passive Move") this.PassiveMove();

            else if (CommandState === "Hold Position") this.HoldPosition();

            else if (CommandState === "Spread Out") this.SpreadOut();

            else if (CommandState === "Group Up") this.GroupUp();

            else this.Group(); // check if applicable
        }
    };

    // Overridden. Marines rotate extra much when facing enemy.
    this.AttackMove = function () {
        var ThisMiddle_x = this.x + this.width / 2, ThisMiddle_y = this.y + this.height / 2;

        // If the unit has a target
        if (this.CurrentTarget != null) {
            var EnemyMiddle_x = this.CurrentTarget.x + this.CurrentTarget.width / 2, EnemyMiddle_y = this.CurrentTarget.y + this.CurrentTarget.height / 2;

            // angle between two lines formular. Used to decide where to turn and move towards.
            var top = ThisMiddle_y - EnemyMiddle_y;
            var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));
            var EnemyAtAngle = Math.acos(top/bottom);

            // Rotate towards enemy
            if (ThisMiddle_x > EnemyMiddle_x) EnemyAtAngle = 2*Math.PI - Math.abs(EnemyAtAngle);
            this.RotationAngle = EnemyAtAngle;

            // calculate current distance to enemy
            var DistanceToEnemy = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));

            // If enemy is within attack range. ATTACK !!!
            if (DistanceToEnemy < this.AttackRange + this.CurrentTarget.width / 2) {
                this.Attack();
            }

            // if enemy is targeted but not in attackrange, move towards it.
            else{
                // calculate movement
                var Movement_x = Math.abs(Math.sin(EnemyAtAngle) * this.MovementSpeed);
                var Movement_y = Math.abs(Math.cos(EnemyAtAngle) * this.MovementSpeed);

                // apply movement
                ThisMiddle_x < EnemyMiddle_x ? this.x += Movement_x : this.x -= Movement_x;
                EnemyMiddle_y < ThisMiddle_y ? this.y -= Movement_y : this.y += Movement_y;
            }
        }

        // if no enemy is targeted move in MoveDirection
        else {
            // determine new rotation angle and moves
            if (this.Faction === "Player") {
                if (MoveDirection === "Up") {
                    this.pos(this.x, this.y - this.MovementSpeed);
                    this.RotationAngle = 0;
                }
                else if (MoveDirection === "Right") {
                    this.pos(this.x + this.MovementSpeed, this.y);
                    this.RotationAngle = Math.PI / 2;
                }
                else if (MoveDirection === "Down") {
                    this.pos(this.x, this.y + this.MovementSpeed);
                    this.RotationAngle = Math.PI;
                }
                else {
                    this.pos(this.x - this.MovementSpeed, this.y);
                    this.RotationAngle = Math.PI * 1.5;
                }
            }

            // if this unit isn't player controlled. If friendly go towards enemy base, otherwise go towards friendly base
            else  {
                this.Faction === "Friendly" ? this.pos(this.x, this.y - this.MovementSpeed) : this.pos(this.x, this.y + this.MovementSpeed);
                this.Faction === "Friendly" ? this.RotationAngle = 0 : this.RotationAngle = Math.PI;
            }
        }
    };

    this.Attack = function () {
        this.Attacking = true; // used along with draw to correctly draw attack animations

        // change marine image to attack stance
        this.Image = AttackStanceImg;

        // rotate marine gun towards enemy
        this.RotationAngle += 0.9;

        // If AttackCooldown isn't down, attack
        if (this.game.FrameTimer > this.LastAttackTime + this.AttackSpeed * 60){
            var damage = this.AttackDamage - this.CurrentTarget.Armor;

            if (damage < 1) damage = 1;
            this.CurrentTarget.Hp -= damage;

            // Show attack animation
            this.LastAttackTime = this.game.FrameTimer;

            // Play attack animation sound

            // Show sign on enemy that it has been attacked

            if (this.CurrentTarget.Hp <= 0) {
                this.game.PossibleDeaths = true; // notify the game that it has to check if any objects are destroyed
            }
        }
    };

    // Overridden. Marines rotate extra much when facing enemy.
    this.HoldPosition = function () {
        var ThisMiddle_x = this.x + this.width / 2, ThisMiddle_y = this.y + this.height / 2;

        // If the unit has a target
        if (this.CurrentTarget != null) {
            var EnemyMiddle_x = this.CurrentTarget.x + this.CurrentTarget.width / 2, EnemyMiddle_y = this.CurrentTarget.y + this.CurrentTarget.height / 2;

            // angle between two lines formular. Used to decide where to turn and move towards.
            var top = ThisMiddle_y - EnemyMiddle_y;
            var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));
            var EnemyAtAngle = Math.acos(top/bottom);

            // apply rotation
            if (ThisMiddle_x > EnemyMiddle_x) EnemyAtAngle = 2*Math.PI - Math.abs(EnemyAtAngle);
            this.RotationAngle = EnemyAtAngle;

            // calculate current distance to enemy
            var DistanceToEnemy = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - EnemyMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - EnemyMiddle_y),2));

            // If enemy is within attack range. ATTACK !!!
            if (DistanceToEnemy < this.AttackRange + this.CurrentTarget.width / 2) {
                this.Attacking = true;

                // change marine image to attackstance
                this.Image = AttackStanceImg;

                // apply extra marine rotation
                this.RotationAngle += 0.9;

                // Check if ready to attack // dev: check if obsolete
                if (AttackCooldown === true) {
                    if (AnimationVar >= AttackReadyAt) {
                        AttackCooldown = false;
                    }
                }

                // If AttackCooldown isn't down, attack
                if (this.game.FrameTimer > this.LastAttackTime + this.AttackSpeed * 60){
                    var damage = this.AttackDamage - this.CurrentTarget.Armor;

                    if (damage < 1) damage = 1;
                    this.CurrentTarget.Hp -= damage;

                    // Show attack animation
                    this.LastAttackTime = this.game.FrameTimer;

                    // Play attack animation sound

                    // Show sign on enemy that it has been attacked

                    if (this.CurrentTarget.Hp <= 0) {
                        this.game.PossibleDeaths = true; // notify the game that it has to check if any objects are destroyed
                    }
                }
            }
        }
    };
}
Marine.prototype = Object.create(Unit.prototype);
Marine.prototype.constructor = Marine;
//Marine Upgrades. Static variables
Marine.MarineRangeUpgrade = false;
Marine.StimpacksUpgrade = false;

function SCV(Faction, Image){
    Unit.call(this, "SCV", 45, 0, 2, 50, 0, 1, 0.7, 5, 1.5, 20, "Melee", "Ground", 450, "Ground", "Terran", Faction, 24, 24, Image, imgRepo.SCVIcon, "Minerals and gas harvester");

    this.HarvestingFrom = null;
    this.HarvestingTime = 1.5; // when TimeHarvested / 60 == this, return to cc with harvest
    this.TimeHarvested = 0; // Time harvested in frames
    this.AmountCarried = 0; // after harvesting, amount that is carried
    var MineralsCarriedPic = null;

    this.Working = true;
    this.HarvestingMinerals = true;
    this.HarvestingGas = false;
    this.CarryingMinerals = false;
    this.CarryingGas = false;

    // Overridden. SCV's are sometimes holding minerals or gas.
    this.draw = function(){
        var prev_x = this.x, prev_y = this.y;
        this.context.save();
        this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.x = 0 - this.width / 2;
        this.y = 0 - this.height / 2;
        this.context.rotate(this.RotationAngle);
        this.context.drawImage(this.Image, this.x,this.y,this.width,this.height);
        if (this.CarryingMinerals === true) this.context.drawImage(MineralsCarriedPic, this.x, this.y, 8, 8);
        else if (this.CarryingGas === true) this.context.drawImage(imgRepo.GasIcon, this.x, this.y, 8, 8);
        this.context.restore();
        this.pos(prev_x, prev_y);

        // draws hp bar on top of scv if not full health
        if (this.Hp != null && this.Hp < this.MaxHp) {
            this.context.fillStyle = "#999999";
            this.context.fillRect(this.x - 2, this.y - 2, this.width + 4, 5);

            var PercentHealth = this.Hp / this.MaxHp;
            var HealthbarInPx = PercentHealth * (this.width + 4);
            if (PercentHealth > 0.66) {
                this.context.fillStyle = "#33CC00";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
            else if (PercentHealth > 0.33) {
                this.context.fillStyle = "#ffff00";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
            else {
                this.context.fillStyle = "#ff0000";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
        }

        if (CurrentlySelected === this) {
            this.context.beginPath();
            this.context.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2,2)),
                0,
                Math.PI * 2
            );
            this.context.strokeStyle = "#33CC00";
            this.context.lineWidth = 1;
            this.context.stroke();
        }
    };

    // Overridden. SCV's have unique harvesting behaviour
    this.animate = function () {
        if (this.Working === true) {
            var ThisMiddle_x = this.x + this.width / 2, ThisMiddle_y = this.y + this.height / 2;
            if (this.HarvestingMinerals === true) {

                // if not carrying minerals
                if (this.game.MineralsArray.length != 0) {
                    // find mineral target
                    if (this.HarvestingFrom === null) {
                        // Find a mineral with few other workers on
                        Loop1: for (var i = 0; i < 100; i++) {
                            for (var j = 0, len = this.game.MineralsArray.length; j < len; j++) {
                                if (this.game.MineralsArray[j].HarvesterArray.length === i) {
                                    this.game.MineralsArray[j].HarvesterArray.push(this);
                                    this.HarvestingFrom = this.game.MineralsArray[j];

                                    break Loop1;
                                }
                            }
                        }
                    }

                    if (this.CarryingMinerals === false) {
                        // go to mineral target
                        var MineralMiddle_x = this.HarvestingFrom.x + this.HarvestingFrom.width / 2, MineralMiddle_y = this.HarvestingFrom.y + this.HarvestingFrom.height / 2;

                        // angle between two lines formular. Used to decide where to turn and move towards.
                        var top = ThisMiddle_y - MineralMiddle_y;
                        var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - MineralMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - MineralMiddle_y),2));
                        var MineralAtAngle = Math.acos(top/bottom);

                        // calculate current distance to mineral
                        var DistanceToMineral = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - MineralMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - MineralMiddle_y),2));

                        // If mineral is within attack range. HARVEST !!!
                        if (DistanceToMineral < this.AttackRange + this.HarvestingFrom.width / 2) {
                            if (this.HarvestingFrom.Occupied === false || this.HarvestingFrom.OccupiedBy === this) {
                                this.HarvestingFrom.OccupiedBy = this;
                                this.HarvestingFrom.Occupied = true;
                                this.TimeHarvested += 1;

                                // when harvest time is done
                                if (this.TimeHarvested / 60 === this.HarvestingTime) {
                                    this.TimeHarvested = 0;
                                    this.CarryingMinerals = true;
                                    this.AmountCarried = this.HarvestingFrom.Type === "Blue Minerals" ? MineralsBlue.MineralsPerTrip : MineralsGold.MineralsPerTrip;
                                    this.HarvestingFrom.MineralAmount -= this.HarvestingFrom.Type === "Blue Minerals" ? MineralsBlue.MineralsPerTrip : MineralsGold.MineralsPerTrip;
                                    MineralsCarriedPic = this.HarvestingFrom.Type === "Blue Minerals" ? imgRepo.MineralsBlue : imgRepo.MineralsGold;
                                    this.HarvestingFrom.Occupied = false;
                                    this.HarvestingFrom.OccupiedBy = null;

                                    if (this.HarvestingFrom.MineralAmount <= 0) {
                                        this.game.PossibleDeaths = true; // notify the game that this mineral is depleted
                                    }
                                }
                            }
                        }

                        // if mineral is targeted but not in attackrange, move towards it.
                        else {
                            // calculate movement
                            var Movement_x = Math.abs(Math.sin(MineralAtAngle) * this.MovementSpeed);
                            var Movement_y = Math.abs(Math.cos(MineralAtAngle) * this.MovementSpeed);
                            if (ThisMiddle_x > MineralMiddle_x) MineralAtAngle = 2*Math.PI - Math.abs(MineralAtAngle);

                            // apply movement
                            ThisMiddle_x < MineralMiddle_x ? this.x += Movement_x : this.x -= Movement_x;
                            MineralMiddle_y < ThisMiddle_y ? this.y -= Movement_y : this.y += Movement_y;

                            // apply rotation
                            this.RotationAngle = MineralAtAngle;
                        }
                    }
                }

                // If carrying minerals
                if (this.CarryingMinerals === true) {
                    // go to CC
                    var CCMiddle_x = this.game.FriendlyCC.x + this.game.FriendlyCC.width / 2, CCMiddle_y = this.game.FriendlyCC.y + this.game.FriendlyCC.height / 2;

                    // angle between two lines formular. Used to decide where to turn and move towards.
                    var top = ThisMiddle_y - CCMiddle_y;
                    var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - CCMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - CCMiddle_y),2));
                    var CCAtAngle = Math.acos(top/bottom);

                    // calculate current distance to CC
                    var DistanceToCC = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - CCMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - CCMiddle_y),2));

                    // If CC is within attackrange, deliver minerals
                    if (DistanceToCC < this.AttackRange + this.game.FriendlyCC.width / 2) {
                        this.CarryingMinerals = false;
                        this.game.PlayerMinerals += this.AmountCarried;
                        this.AmountCarried = 0;
                        if (this.HarvestingFrom != null) this.HarvestingFrom.HarvesterArray.splice(this.HarvestingFrom.HarvesterArray.indexOf(this),1);
                        this.HarvestingFrom = null;
                        this.game.ResourceChanges = true; // notify messagecanvas of changes to resources
                    }

                    // else move towards CC
                    else{
                        // calculate movement
                        var Movement_x = Math.abs(Math.sin(CCAtAngle) * this.MovementSpeed);
                        var Movement_y = Math.abs(Math.cos(CCAtAngle) * this.MovementSpeed);
                        if (ThisMiddle_x > CCMiddle_x) CCAtAngle = 2*Math.PI - Math.abs(CCAtAngle);

                        // apply movement
                        ThisMiddle_x < CCMiddle_x ? this.x += Movement_x : this.x -= Movement_x;
                        CCMiddle_y < ThisMiddle_y ? this.y -= Movement_y : this.y += Movement_y;

                        // apply rotation
                        this.RotationAngle = CCAtAngle;
                    }
                }
            }

            else if (this.HarvestingGas === true) {
                if (this.game.SouthGasGeyser.Type === "Refinery" && this.game.SouthGasGeyser.GasAmount > 0) {
                    if (this.CarryingGas === false) {
                        // go to Refinery
                        var RefineryMiddle_x = this.game.SouthGasGeyser.x + this.game.SouthGasGeyser.width / 2, RefineryMiddle_y = this.game.SouthGasGeyser.y + this.game.SouthGasGeyser.height / 2;

                        // angle between two lines formular. Used to decide where to turn and move towards.
                        var top = ThisMiddle_y - RefineryMiddle_y;
                        var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - RefineryMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - RefineryMiddle_y),2));
                        var RefineryAtAngle = Math.acos(top/bottom);

                        // calculate current distance to mineral
                        var DistanceToRefinery = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - RefineryMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - RefineryMiddle_y),2));

                        // If Refinery is within attack range and unoccupied. HARVEST !!!
                        if (DistanceToRefinery < this.AttackRange + this.game.SouthGasGeyser.width / 2) {
                            if (this.game.SouthGasGeyser.Occupied === false) {
                                this.game.SouthGasGeyser.Occupied = true;
                                this.game.SouthGasGeyser.OccupiedBy = this;
                                this.game.ObjectArray.splice(this.game.ObjectArray.indexOf(this),1);
                            }
                        }

                        // if Refinery is targeted but not in attackrange, move towards it.
                        else {
                            // calculate movement
                            var Movement_x = Math.abs(Math.sin(RefineryAtAngle) * this.MovementSpeed);
                            var Movement_y = Math.abs(Math.cos(RefineryAtAngle) * this.MovementSpeed);
                            if (ThisMiddle_x > RefineryMiddle_x) RefineryAtAngle = 2*Math.PI - Math.abs(RefineryAtAngle);

                            // apply movement
                            ThisMiddle_x < RefineryMiddle_x ? this.x += Movement_x : this.x -= Movement_x;
                            RefineryMiddle_y < ThisMiddle_y ? this.y -= Movement_y : this.y += Movement_y;

                            // apply rotation
                            this.RotationAngle = RefineryAtAngle;
                        }
                    }

                    if (this.CarryingGas === true) {
                        // go to CC
                        var CCMiddle_x = this.game.FriendlyCC.x + this.game.FriendlyCC.width / 2, CCMiddle_y = this.game.FriendlyCC.y + this.game.FriendlyCC.height / 2;

                        // angle between two lines formular. Used to decide where to turn and move towards.
                        var top = ThisMiddle_y - CCMiddle_y;
                        var bottom = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - CCMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - CCMiddle_y),2));
                        var CCAtAngle = Math.acos(top/bottom);

                        // calculate current distance to CC
                        var DistanceToCC = Math.sqrt(Math.pow(Math.abs(ThisMiddle_x - CCMiddle_x),2) + Math.pow(Math.abs(ThisMiddle_y - CCMiddle_y),2));

                        // If CC is within attackrange, deliver Gas
                        if (DistanceToCC < this.AttackRange + this.game.FriendlyCC.width / 2) {

                            this.clear();
                            this.CarryingGas = false;

                            this.draw();
                            this.game.PlayerGas += this.AmountCarried;
                            this.AmountCarried = 0;
                            this.game.ResourceChanges = true; // notify messagecanvas of changes to resources
                        }

                        // else move towards CC
                        else{
                            // calculate movement
                            var Movement_x = Math.abs(Math.sin(CCAtAngle) * this.MovementSpeed);
                            var Movement_y = Math.abs(Math.cos(CCAtAngle) * this.MovementSpeed);
                            if (ThisMiddle_x > CCMiddle_x) CCAtAngle = 2*Math.PI - Math.abs(CCAtAngle);

                            // apply movement
                            ThisMiddle_x < CCMiddle_x ? this.x += Movement_x : this.x -= Movement_x;
                            CCMiddle_y < ThisMiddle_y ? this.y -= Movement_y : this.y += Movement_y;

                            // apply rotation
                            this.RotationAngle = CCAtAngle;
                        }

                    }
                }
            }
        }




        // If player has "pulled" SCV's, follow the commandstate
        else {
            if (CommandState === "Attack Move") this.AttackMove();

            else if (CommandState === "Passive Move") this.PassiveMove();

            else if (CommandState === "Spread Out") this.SpreadOut();

            else if (CommandState === "Group Up") this.GroupUp();

            else this.HoldPosition();

        }
    }
}
SCV.prototype = Object.create(Unit.prototype);
SCV.prototype.constructor = SCV;
//SCV Upgrades. Static variables



// Zerg
function InfestedTerran (Faction, Image){
    Unit.call(this, "Infested Terran", 25, 0, 5, 20, 0, 0.2, 0.4, 7, 1.5, 15, "Melee", "Ground", 450, "Ground", "Zerg", Faction,
              24, 15, Image, imgRepo.InfestedTerranIcon, "Slow, fragile, expendable unit");

    this.HudOptionsArray.length = 0; // So you can't just click on it and delete it :P

    this.NormalStanceImg = this.Image;
    this.AttackAnimImg = this.Image === imgRepo.ZergInfestedTerranPurple ? imgRepo.ZergInfestedTerranPurple_AttackAnim : imgRepo.ZergInfestedTerranGreen_AttackAnim;

    this.AttackAnimationLength = 0.3;

    // Overriden. InfestedTerran image goes back to normalstance.
    this.animate = function () {
        this.Image = this.NormalStanceImg;
        this.Attacking = false;

        // If this unit is not a player unit attackmove.
        if (this.Faction != "Player") this.AttackMove();

        // if this unit is a player unit, react according to command state
        else {
            if (CommandState === "Attack Move") this.AttackMove();

            else if (CommandState === "Passive Move") this.PassiveMove();

            else if (CommandState === "Hold Position") this.HoldPosition();

            else if (CommandState === "Spread Out") this.SpreadOut();

            else if (CommandState === "Group Up") this.GroupUp();
        }
    };

    this.AttackAnimation = function () {
        this.Image = this.AttackAnimImg;
    }
}
InfestedTerran.prototype = Object.create(Unit.prototype);
InfestedTerran.prototype.constructor = InfestedTerran;

function Zergling (Faction, Image){
    Unit.call(this, "Zergling", 35, 0, 10, 50, 0, 0.5, 0.9, 5, 0.9, 20, "Melee", "Air and Ground", 450, "Ground", "Zerg", Faction,
              12, 18, Image, imgRepo.ZerglingIcon, "Fast, fragile, high-dps melee unit");

    this.HudOptionsArray.length = 0; // So you can't just click on it and delete it :P
}
Zergling.prototype = Object.create(Unit.prototype);
Zergling.prototype.constructor = Zergling;
// global zergling upgrades
Zergling.SpeedUpgrade = false;
Zergling.AdrenalGlandsUpgrade = false;

function Hydralisk (Faction, Image){
    Unit.call(this, "Hydralisk", 80, 0, 20, 75, 25, 1, 0.7, 9, 1.2, 160, "Ranged", "Ground", 450, "Ground", "Zerg", Faction,
              24, 36, Image, imgRepo.HydraliskIcon, "Versatile, ranged, air and ground attacker");

    this.Attack = function () {
        // spawn hydralisk spike
        this.game.ObjectArray.push(new HydraliskSpine(this));
        this.LastAttackTime = this.game.FrameTimer;
    };

    this.HudOptionsArray.length = 0; // So you can't just click on it and delete it :P
}
Hydralisk.prototype = Object.create(Unit.prototype);
Hydralisk.prototype.constructor = Hydralisk;








// missile
function Missile (parent, image, speed, height, width, timeout, type) {
    this.SuperType = "Missile";
    this.Type = type;
    this.height = height;
    this.width = width;
    this.HitCircleRadius = this.width > this.height ? this.width / 2 : this.height / 2;
    this.x = parent.x + parent.width / 2 - this.width / 2;
    this.y = parent.y + parent.height / 2 - this.height / 2;
    this.Image = image;
    this.Speed = speed;
    this.Damage = parent.AttackDamage;
    this.RotationAngle = parent.RotationAngle;
    this.Faction = parent.Faction;
    this.context = parent.context;
    this.game = parent.game;
    this.ParentMidPosition_x = parent.x  + parent.width / 2;
    this.ParentMidPosition_y = parent.y + parent.height / 2;

    this.CreationFrame = this.game.FrameTimer;
    this.Timeout = timeout; // frames until missile disappears

    // Used to quickly change position of unit
    this.pos = function(x, y){
        this.x = x;
        this.y = y;
    };

    // Draws the unit on canvas correctly rotated
    this.draw = function(){
        var prev_x = this.x, prev_y = this.y;
        this.context.save();
        this.context.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.x = 0 - this.width / 2;
        this.y = 0 - this.height / 2;
        this.context.rotate(this.RotationAngle);
        this.context.drawImage(this.Image, this.x,this.y,this.width,this.height);
        this.context.restore();
        this.pos(prev_x, prev_y);
    };

    // clears the unit from canvas correctly rotated
    this.clear = function () {
        this.context.globalCompositeOperation = "destination-out";
        this.context.beginPath();
        this.context.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2,2)) + 5,
            0,
            Math.PI * 2
        );
        this.context.fill();
        this.context.globalCompositeOperation = "source-over";
    };

    this.animate = function () {
        // if missile has timed out, remove it from objects
        if (this.game.FrameTimer > this.CreationFrame + this.Timeout) {
            this.game.ObjectArray.splice(this.game.ObjectArray.indexOf(this),1);
            return;
        }

        var Movement_x = Math.sin(this.RotationAngle) * this.Speed;
        var Movement_y = Math.cos(this.RotationAngle) * this.Speed;



        this.x += Movement_x;
        this.y += Movement_y * -1;

        // apply movement
//        this.ParentMidPosition_x < this.x + this.width / 2 ? this.x += Movement_x : this.x -= Movement_x;
//        this.ParentMidPosition_y < this.y + this.height / 2 ? this.y += Movement_y : this.y -= Movement_y;

//        var reducedRotation = this.RotationAngle % Math.PI*2;
//        reducedRotation > Math.PI ? this.x += Movement_x : this.x -= Movement_x;
//        reducedRotation < Math.PI * 0.5 || reducedRotation > Math.PI * 1.5 ? this.y += Movement_y : this.y -= Movement_y;
    };

    this.CollisionWithEnemy = function(enemy) {
        var damage = this.Damage - enemy.Armor;

        if (damage < 1) damage = 1;
        enemy.Hp -= damage;

        if (enemy.Hp <= 0) {
            this.game.PossibleDeaths = true; // notify the game that it has to check if any objects are destroyed
        }

        this.clear();
        this.game.ObjectArray.splice(this.game.ObjectArray.indexOf(this),1);
    }
}

function HydraliskSpine (parent) {
    Missile.call(this, parent, imgRepo.HydraliskSpine, 5, 4, 2, 40, "HydraliskSpine");
}
HydraliskSpine.prototype = Object.create(Missile.prototype);
HydraliskSpine.prototype.constructor = HydraliskSpine;

// Structures

// Abstract structure object. All structures inherit from this object.
function Structure (Type, Hp, Armor, BuildTime, MineralCost, GasCost, Race, Faction, Width, Height, Image, Icon, Description) {
    this.SuperType = "Structure";
    this.Type = Type;
    this.MaxHp = Hp;
    this.Hp = Hp;
    this.Armor = Armor;
    this.BuildTime = BuildTime;
    this.MineralCost = MineralCost;
    this.GasCost = GasCost;
    this.Race = Race;
    this.Faction = Faction;
    this.width = Width;
    this.HitCircleRadius = this.width > this.height ? this.width / 2 : this.height / 2;
    this.height = Height;
    this.Image = Image;
    this.Icon = Icon;
    this.Description = Description;

    this.ProductionList = []; // Contains all objects currently being built/researched
    this.ProductionProgress = 0;
    this.ProducingUnitSupplyCounted = false;
    this.IsSalvaging = false; // determines if structure is salvaging
    this.SalvageTime = 3; // the time that a structure salvages before being done
    this.SalvageCounter = 0; // The amount of frames that structure has been salvaging
    this.AlertShown = false;
    var that = this;

    this.HudOptionsArray = []; // Contains all hudoptions of this object
    // All structures except a few has salvage and cancel options
    this.SalvageOption = new SalvageOption(this, 710 + (55 + 5) * 2, 10 + (55 + 5) * 2, "C");
    this.CancelOption = new CancelOption(this, 710 + (55 + 5) * 3, 10 + (55 + 5) * 2, "V");
    this.HudOptionsArray[this.HudOptionsArray.length] = this.SalvageOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.CancelOption;

    this.canvas = document.getElementById('structCanvas');
    this.context = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    // Used to quickly change position of structure
    this.pos = function (x,y) {
        this.x = x;
        this.y = y;
    };

    // Draws the structure on canvas
    this.draw = function () {
        this.context.drawImage(this.Image, this.x, this.y, this.width, this.height);

        // draws hotkey char
        if (this.HotKey != undefined && this.HotKey != null){
            this.context.fillStyle = "#FFFFFF";
            this.context.font = "14px Arial";
            this.context.fillText(this.HotKey, this.x + this.width / 2 - 3, this.y + this.height / 2 + 5);
        }

        // draws hp bar on top of structure if not full health
        if (this.Hp != null && this.Hp < this.MaxHp) {
            this.context.fillStyle = "#999999";
            this.context.fillRect(this.x - 2, this.y - 2, this.width + 4, 5);

            var PercentHealth = this.Hp / this.MaxHp;
            var HealthbarInPx = PercentHealth * (this.width + 4);
            if (PercentHealth > 0.66) {
                this.context.fillStyle = "#33CC00";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
            else if (PercentHealth > 0.33) {
                this.context.fillStyle = "#ffff00";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
            else {
                this.context.fillStyle = "#ff0000";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
        }

        // If something is being constructed, draw a progressbar under the structure
        if (this.ProductionList.length != 0) {
            this.context.fillStyle = "#333333";
            this.context.fillRect(this.x, this.y + this.height + 3, this.width, 5);

            this.context.fillStyle = "#33CC00";
            var ProductionProgressionInPx = ((this.ProductionProgress / 60) / this.ProductionList[0].BuildTime) * this.width;
            this.context.fillRect(this.x, this.y + this.height + 3, ProductionProgressionInPx, 5);
        }
        // else if structure is being salvages, draw a progressbar for that under structure
        else if (this.IsSalvaging === true) {
            this.context.fillStyle = "#333333";
            this.context.fillRect(this.x, this.y + this.height + 3, this.width, 5);

            this.context.fillStyle = "#FF0000"; // Red, I hope
            var SalvageProgressionInPx = ((this.SalvageCounter / 60) / this.SalvageTime) * this.width;
            this.context.fillRect(this.x, this.y + this.height + 3, SalvageProgressionInPx, 5);
        }

        // If this is selected, draw a green ring around the structure
        if (CurrentlySelected === this) {
            this.context.beginPath();
            this.context.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2,2)),
                0,
                Math.PI * 2
            );
            this.context.strokeStyle = "#33CC00";
            this.context.lineWidth = 1;
            this.context.stroke();
            this.context.strokeStyle = "#000000";
        }
    };

    // Clears the structure from canvas
    this.clear = function () {
        this.context.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);

        if (CurrentlySelected === this) {
            this.context.globalCompositeOperation = "destination-out";
            this.context.beginPath();
            this.context.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2,2)) + 3,
                0,
                Math.PI * 2
            );
            this.context.fill();
            this.context.globalCompositeOperation = "source-over";
        }
        if (this.ProductionList.length != 0) {
            this.context.clearRect(this.x - 1, this.y + this.height + 2, this.width + 2, 7);
        }
        else if (this.IsSalvaging === true) {
            this.context.clearRect(this.x - 1, this.y + this.height + 2, this.width + 2, 7);
        }
    };

    // When the structure is clicked on, draws relevant info on the hud.
    this.Selected = function () {
        if (CurrentlySelected != undefined) {
            if (CurrentlySelected != this) PreviouslySelected = CurrentlySelected;
            if (CurrentlySelected != this.game.Commandhud) CurrentlySelected.clear();
        }
        CurrentlySelected = this;

        // clears hud
        this.game.hudContext.clearRect(0,0,this.game.hudCanvas.width,this.game.hudCanvas.height);

        // draws seperators on hud
        this.game.hudContext.fillStyle = "#c3c3c3";
        this.game.hudContext.fillRect(320,5,5,this.game.hudCanvas.height);
        this.game.hudContext.fillRect(700,5,5,this.game.hudCanvas.height);

        // Draw object information on hud to the left
        this.ObjectHudInformation();

        // Draws production list on hud (if not empty)
        if (this.ProductionList.length != 0) {
            this.game.hudContext.drawImage(this.ProductionList[0].Icon, 365, 30, 64, 64);

            // style it up for the next part
            this.game.hudContext.strokeStyle = "#FFFFFF";
            this.game.hudContext.fillStyle = "#FFFFFF";
            this.game.hudContext.font = "40px Arial";

            for (var i = 0, len = 4; i < len; i++) {
                if (this.ProductionList[i + 1] != undefined) {
                    this.game.hudContext.drawImage(this.ProductionList[i + 1].Icon, 365 + i * 74, 104, 64, 64);
                }
                else {
                    this.game.hudContext.strokeRect(365 + i * 74, 104, 64, 64);
                    this.game.hudContext.fillText(i + 2, 365 + 22 + 74 * i, 104 + 44);
                }
            }

            // producing Marine, researching stim etc.
            if (this.ProductionList[0].SuperType === "Unit") {
                this.game.hudContext.font = "14px Arial";
                this.game.hudContext.fillText("Producing " + this.ProductionList[0].Type, 440, 63);
            }
            else if ( this.ProductionList[0].SuperType === "Research") {
                // Researching...
            }

            // Draws production progression bar on hud
            this.game.hudContext.fillStyle = "#333333";
            this.game.hudContext.fillRect(440, 73, 210, 20);

            this.game.hudContext.fillStyle = "#33CC00";
            var ProgressionInPx = ((this.ProductionProgress / 60) / this.ProductionList[0].BuildTime) * 210;
            this.game.hudContext.fillRect(440, 73, ProgressionInPx, 20);
        }

        // Draws hud options if implemented
        if (this.HudOptionsDraw != null && this.HudOptionsDraw != undefined) this.HudOptionsDraw();
    };

    // Hud Information for this object
    this.ObjectHudInformation = function () {
        this.game.hudContext.fillStyle = "#ffffff";
        this.game.hudContext.drawImage(this.Icon,20,20,110,110);
        this.game.hudContext.font = "18px Arial";
        if (this.Hp != null) this.game.hudContext.fillText(this.Hp,20, 165);
        if (this.Hp != null) this.game.hudContext.fillText("/",70, 165);
        if (this.Hp != null) this.game.hudContext.fillText(this.MaxHp,90, 165);
        this.game.hudContext.fillText(this.Type, 160, 35,150);
        this.game.hudContext.font = "14px Arial";
        if (this.Faction != null) this.game.hudContext.fillText("Faction: " + this.Faction, 160, 65);
        if (this.Armor != null) this.game.hudContext.fillText("Armor: " + this.Armor, 160, 85);
    };

    // Production function. If ProductionList.length != null, produce whatever. Called in animation func.
    this.Production = function () {
        if (this.ProductionList.length != 0) {
            if (this.ProducingUnitSupplyCounted === false && this.game.PlayerSupply + this.ProductionList[0].SupplyWeight <= this.game.PlayerMaxSupply) {
                this.game.PlayerSupply += this.ProductionList[0].SupplyWeight;
                this.ProducingUnitSupplyCounted = true;
            }
            else if (this.ProducingUnitSupplyCounted === true) {
                this.ProductionProgress += 1;

                if (this.ProductionProgress / 60 === this.ProductionList[0].BuildTime) {
                    if (this.ProductionList[0].SuperType === "Unit") {
                        this.clear(); // to clear the progressbar on main canvas
                        var NewUnit = this.ProductionList.shift();
                        this.draw();
                        this.game.UnitArray[this.game.UnitArray.length] = NewUnit;
                        this.game.ObjectArray[this.game.ObjectArray.length] = NewUnit;
                        NewUnit.pos(this.x + this.width / 2 - NewUnit.width / 2, this.y - 5 - NewUnit.height);
                        NewUnit.draw();
                    }

                    this.ProducingUnitSupplyCounted = false;
                    this.ProductionProgress = 0;
                }
            }
            else if (this.game.PlayerSupply + this.ProductionList[0].SupplyWeight > this.game.PlayerMaxSupply && this.AlertShown === false) {
                this.game.Alertsystem.AddAlert("Not enough Supply Depots");
                this.AlertShown = true;
                window.setTimeout(function () { that.AlertShown = false;}, 3000);
            }
        }
    };

    this.Salvage = function () {
        if (this.IsSalvaging === true) {
            this.SalvageCounter += 1;

            if (this.SalvageCounter / 60 === this.SalvageTime) {
                this.Hp = 0;
                this.game.PossibleDeaths = true;

                this.game.PlayerMinerals += Math.floor(this.MineralCost / 2);
                this.game.PlayerGas += Math.floor(this.GasCost / 2);
                if (this.MaxSupplyLift != undefined)
                    this.game.PlayerMaxSupply -= this.MaxSupplyLift;
            }
        }
    };

    // Structure animation.
    this.animate = function () {
        this.clear();

        this.draw();

        this.Production();

        this.Salvage();

        // Extra animation implemented in child objects
        this.ExtraAnimation();
    };

    // Abstract. Fires when the structure is destroyed
    this.DeathAnimation = function () {
        // not implemented
    };
    // Abstract function implemented in inherited objects that draw hud options.
    this.HudOptionsDraw = function () {
        for (var i = 0, len = this.HudOptionsArray.length; i < len; i++) {
            this.HudOptionsArray[i].draw();
        }
    };
    // Abstract function implemented in inherited objects that further animation
    this.ExtraAnimation = function () {
        // abstract
    }
}


// Terran
function CommandCenter (Faction, Image) {
    Structure.call(this, "Command Center", 1500, 1, null, null, null, "Terran",
                   Faction, 128, 128, Image, imgRepo.CommandCenterIcon, "Main building. Constructs SCV's.");

    this.MaxSupplyLift = 10;

    // Constructs and draws options
    this.HudOptionsArray.length = 0; // because you shouldn't be able to salvage the CC

    // row 1
    this.SCVOption = new NewUnitOption (this,710,10,imgRepo.SCVIcon, function () {return new SCV("Player", imgRepo.TerranSCVBlue);}, "Q");
    this.SCVToMineralsOption = new SCVToMineralsOption(this, 710, 10 + 55 + 5, "A");
    this.SCVToGasOption = new SCVToGasOption(this, 710 + 55 + 5, 10 + 55 + 5, "S");
    // row 3
    this.PullSCVOption = new PullSCVOption (this, 710, 10 + 60 * 2, "Z");
    this.RecallSCVOption = new RecallSCVOption (this, 710 + 60, 10 + 60 * 2, "X");
    this.CancelOption = new CancelOption(this, 710 + (55 + 5) * 3, 10 + (55 + 5) * 2, "V");

    this.HudOptionsArray[this.HudOptionsArray.length] = this.SCVOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.SCVToMineralsOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.SCVToGasOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.PullSCVOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.RecallSCVOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.CancelOption;
}
CommandCenter.prototype = Object.create(Structure.prototype);
CommandCenter.prototype.constructor = CommandCenter;

function Barracks (Faction, Image) {
    Structure.call(this, "Barracks", 1000, 1, 5, 150, 0, "Terran",
                   Faction, 64, 64, Image, imgRepo.BarracksIcon, "Constructs infantry units");

    // Constructs and draws options
    this.MarineOption = new NewUnitOption (this,710,10,imgRepo.MarineIcon,function(){return new Marine("Player", imgRepo.TerranMarineBlue);}, "Q");

    this.HudOptionsArray[this.HudOptionsArray.length] = this.MarineOption;
}
Barracks.prototype = Object.create(Structure.prototype);
Barracks.prototype.constructor = Barracks;

function SupplyDepot (Faction, Image) {
    Structure.call(this, "Supply Depot", 500, 1, 5, 100, 0, "Terran",
                   Faction, 64, 64, Image, imgRepo.SupplyDepotIcon, "Allows more units to be recruited");

    this.MaxSupplyLift = 10;
}
SupplyDepot.prototype = Object.create(Structure.prototype);
SupplyDepot.prototype.constructor = SupplyDepot;

function EngineeringBay (Faction, Image) {
    Structure.call(this, "Engineering Bay", 1000, 1, 5, 125, 0, "Terran",
                   Faction, 64, 64, Image, imgRepo.EngineeringBayIcon, "Researches upgrades");
}
EngineeringBay.prototype = Object.create(Structure.prototype);
EngineeringBay.prototype.constructor = EngineeringBay;

function Factory (Faction, Image) {
    Structure.call(this, "Factory", 1000, 1, 5, 150, 100, "Terran",
                   Faction, 64, 64, Image, imgRepo.FactoryIcon, "Constructs mechanical units");
}
Factory.prototype = Object.create(Structure.prototype);
Factory.prototype.constructor = Factory;

function Refinery (Faction, Image) {
    Structure.call(this, "Refinery", 1000, 1, 5, 75, 0, "Terran",
                   Faction, 96, 96, Image, imgRepo.RefineryIcon, "Allows gas to be gathered");

    this.GasAmount = this.game.SouthGasGeyser.GasAmount;
    this.HarvesterArray = [];
    this.Occupied = false;
    this.OccupiedBy = null;
    this.OccupationTime = 0;

    this.ExtraAnimation = function () {
        if (this.Occupied === true) {
            this.OccupationTime += 1;

            if (this.OccupationTime / 60 === Refinery.HarvestingTime) {
                this.game.ObjectArray[this.game.ObjectArray.length] = this.OccupiedBy;
                this.OccupiedBy.CarryingGas = true;
                this.OccupiedBy.CarryingMinerals = false;
                this.OccupiedBy.AmountCarried = Refinery.GasPerTrip;
                this.GasAmount -= Refinery.GasPerTrip;

                this.Occupied = false;
                this.OccupiedBy = null;
                this.OccupationTime = 0;
            }
        }
    };

    this.ObjectHudInformation = function () {
        this.game.hudContext.fillStyle = "#ffffff";
        this.game.hudContext.drawImage(this.Icon,20,20,110,110);
        this.game.hudContext.font = "18px Arial";
        this.game.hudContext.fillText(this.Hp,20, 165);
        this.game.hudContext.fillText("/",70, 165);
        this.game.hudContext.fillText(this.MaxHp,90, 165);
        this.game.hudContext.fillText(this.Type, 160, 35,150);
        this.game.hudContext.font = "14px Arial";
        this.game.hudContext.fillText("Faction: " + this.Faction, 160, 65);
        this.game.hudContext.fillText("Armor: " + this.Armor, 160, 85);
        this.game.hudContext.fillText("Gas amount: " + this.GasAmount, 160, 105);
        this.game.hudContext.fillText("Harvesters: " + this.HarvesterArray.length, 160, 125);
    };
}
Refinery.prototype = Object.create(Structure.prototype);
Refinery.prototype.constructor = Refinery;
// Refinery Global variables.
Refinery.GasPerTrip = 10;
Refinery.HarvestingTime = 2;

function AutoTurret (Faction, Image) {
    Structure.call(this, "Auto Turret", 250, 1, 5, 100, 0, "Terran",
                   Faction, 48, 48, Image, imgRepo.AutoTurretIcon, "Medium-range ground and air defense");

    this.CurrentTarget = null;
    this.RotationAngle = 0;
    this.AttackRange = 300;
    this.AggressionRange = 300;
    this.AttackDamage = 5;
    this.AttackSpeed = 1;

    var AttackAnimationTime = 0.5;
    var AttackAnimationStart = 0;
    var AttackAnimationEnd = 0;

    this.TurretImage = imgRepo.TerranAutoTurretHeadBlue_BaseAnim;
    this.TurretWidth = 36;
    this.TurretHeight = 36;

    this.LastAttackTime = 0;

    // autoturret has a turret that is drawn on unitcanvas
    this.draw = function () {
        this.context.drawImage(this.Image, this.x, this.y, this.width, this.height);

        // draw turret
        var prev_x = this.x, prev_y = this.y;
        this.game.unitContext.save();
        this.game.unitContext.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.x = 0 - this.TurretWidth / 2;
        this.y = 0 - this.TurretHeight / 2;
        this.game.unitContext.rotate(this.RotationAngle);
        this.game.unitContext.drawImage(this.TurretImage, this.x,this.y,this.TurretWidth,this.TurretHeight);
        this.game.unitContext.restore();
        this.pos(prev_x, prev_y);

        // draws hotkey char
        if (this.HotKey != undefined && this.HotKey != null){
            this.context.fillStyle = "#FFFFFF";
            this.context.font = "14px Arial";
            this.context.fillText(this.HotKey, this.x + this.width / 2 - 3, this.y + this.height / 2 + 5);
        }

        // draws hp bar on top of structure if not full health
        if (this.Hp != null && this.Hp < this.MaxHp) {
            this.context.fillStyle = "#999999";
            this.context.fillRect(this.x - 2, this.y - 2, this.width + 4, 5);

            var PercentHealth = this.Hp / this.MaxHp;
            var HealthbarInPx = PercentHealth * (this.width + 4);
            if (PercentHealth > 0.66) {
                this.context.fillStyle = "#33CC00";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
            else if (PercentHealth > 0.33) {
                this.context.fillStyle = "#ffff00";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
            else {
                this.context.fillStyle = "#ff0000";
                this.context.fillRect(this.x - 2, this.y - 2, HealthbarInPx, 5);
            }
        }

        // If something is being constructed, draw a progressbar under the structure
        if (this.ProductionList.length != 0) {
            this.context.fillStyle = "#333333";
            this.context.fillRect(this.x, this.y + this.height + 3, this.width, 5);

            this.context.fillStyle = "#33CC00";
            var ProductionProgressionInPx = ((this.ProductionProgress / 60) / this.ProductionList[0].BuildTime) * this.width;
            this.context.fillRect(this.x, this.y + this.height + 3, ProductionProgressionInPx, 5);
        }
        // else if structure is being salvages, draw a progressbar for that under structure
        else if (this.IsSalvaging === true) {
            this.context.fillStyle = "#333333";
            this.context.fillRect(this.x, this.y + this.height + 3, this.width, 5);

            this.context.fillStyle = "#FF0000"; // Red, I hope
            var SalvageProgressionInPx = ((this.SalvageCounter / 60) / this.SalvageTime) * this.width;
            this.context.fillRect(this.x, this.y + this.height + 3, SalvageProgressionInPx, 5);
        }

        // If this is selected, draw a green ring around the structure
        if (CurrentlySelected === this) {
            this.context.beginPath();
            this.context.arc(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2,2)),
                0,
                Math.PI * 2
            );
            this.context.strokeStyle = "#33CC00";
            this.context.lineWidth = 1;
            this.context.stroke();
            this.context.strokeStyle = "#000000";
        }
    };

    // autoturret needs to clear both structure and unitcanvas
    this.clear = function () {
        this.context.globalCompositeOperation = "destination-out";
        this.context.beginPath();
        this.context.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2,2)) + 5,
            0,
            Math.PI * 2
        );
        this.context.fill();
        this.context.globalCompositeOperation = "source-over";

        this.context.clearRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6);

        this.game.unitContext.globalCompositeOperation = "destination-out";
        this.game.unitContext.beginPath();
        this.game.unitContext.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.sqrt(Math.pow(this.width / 2,2) + Math.pow(this.height / 2,2)) + 5,
            0,
            Math.PI * 2
        );
        this.game.unitContext.fill();
        this.game.unitContext.globalCompositeOperation = "source-over";
    };

    this.ExtraAnimation = function () {
        // If the unit has a target
        if (this.CurrentTarget != null) {
            var ThisMiddle_x = this.x + this.width / 2, ThisMiddle_y = this.y + this.height / 2;
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
  /*              // clear previous rotated image;
                var prev_x = this.x, prev_y = this.y;
                game.unitContext.save();
                game.unitContext.translate(this.x + this.width / 2, this.y + this.height / 2);
                this.x = 0 - this.width / 2;
                this.y = 0 - this.height / 2;
                game.unitContext.rotate(this.RotationAngle);
                game.unitContext.clearRect(this.x,this.y - 10,this.width,this.height + 10);
                game.unitContext.restore();
                this.pos(prev_x, prev_y);
*/
                // rotation and draw
                this.RotationAngle = EnemyAtAngle;
/*
                // draw turret
                game.unitContext.save();
                game.unitContext.translate(this.x + this.width / 2, this.y + this.height / 2);
                this.x = 0 - this.TurretWidth / 2;
                this.y = 0 - this.TurretHeight / 2;
                game.unitContext.rotate(this.RotationAngle);
                game.unitContext.drawImage(this.TurretImage, this.x,this.y,this.TurretWidth,this.TurretHeight);
                game.unitContext.restore();
                this.pos(prev_x, prev_y);
*/
                // If AttackCooldown isn't down, attack
                if (this.game.FrameTimer >= this.LastAttackTime + this.AttackSpeed * 60){
                    var damage = this.AttackDamage - this.CurrentTarget.Armor;
                    if (damage < 1) damage = 1;
                    this.CurrentTarget.Hp -= damage;

                    // start attack animation timer
                    AttackAnimationStart = this.game.FrameTimer;
                    AttackAnimationEnd = this.game.FrameTimer + (Math.ceil(AttackAnimationTime * 60));

                    // Play attack animation sound

                    // Show sign on enemy that it has been attacked


                    this.LastAttackTime = this.game.FrameTimer;

                    if (this.CurrentTarget.Hp <= 0) {
                        game.PossibleDeaths = true; // notify the game that it has to check if any objects are destroyed
                    }
                }
            }

            // if unit has recently attacked, show attack animation
            if (this.game.FrameTimer < AttackAnimationEnd && this.game.FrameTimer > AttackAnimationStart && this.CurrentTarget != null) {
                this.AttackAnimation();
            }
        }

        // else rotate around like a badass
        else {
            // rotation
            this.RotationAngle += 0.005;
        }
    };

    this.AttackAnimation = function () {
        this.game.unitContext.fillStyle = "#ffff00";
        this.game.unitContext.lineWidth = 2;

        var prev_x = this.x, prev_y = this.y;
        this.game.unitContext.save();
        this.game.unitContext.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.x = 0 - this.TurretWidth / 2;
        this.y = 0 - this.TurretHeight / 2;
        this.game.unitContext.rotate(this.RotationAngle);

        this.game.unitContext.beginPath();
        this.game.unitContext.moveTo(this.x + this.width / 2 - 9, this.y + this. height / 2 - this.TurretHeight / 2 - 6);
        this.game.unitContext.lineTo(this.x + this.width / 2 - 5  - Math.random() * 3, this.y + this. height / 2 - this.TurretHeight / 2 - 15 - Math.random() * 3);
        this.game.unitContext.lineTo(this.x + this.width / 2 - 3, this.y + this. height / 2 - this.TurretHeight / 2 - 6);
        this.game.unitContext.closePath();
        this.game.unitContext.fill();

        this.game.unitContext.restore();
        this.pos(prev_x, prev_y);


        // shift between turret images
        if (this.Faction === "Player") {
            this.TurretImage === imgRepo.TerranAutoTurretHeadBlue_BaseAnim ?
                this.TurretImage = imgRepo.TerranAutoTurretHeadBlue_Anim1 :
                this.TurretImage = imgRepo.TerranAutoTurretHeadBlue_BaseAnim;
        }
        else {
            this.TurretImage === imgRepo.TerranAutoTurretHeadRed_BaseAnim ?
                this.TurretImage = imgRepo.TerranAutoTurretHeadRed_Anim1 :
                this.TurretImage = imgRepo.TerranAutoTurretHeadRed_BaseAnim;
        }
    }
}
AutoTurret.prototype = Object.create(Structure.prototype);
AutoTurret.prototype.constructor = AutoTurret;


// Zerg
function GreaterHive (Faction, Image) {
    Structure.call(this, "Greater Hive", 2500, 2, 100, 200, 200, "Zerg", Faction, 272, 272, Image, Image, null);

    this.HudOptionsArray.length = 0;
    /*var PulsateCooldown = false;
     var PulsateTimer = 2;

     // override parent function
     this.ExtraAnimation = function () {
     if (PulsateCooldown === false) {
     this.clear();
     this.draw();
     PulsateCooldown = true;
     window.setTimeout(function(){
     PulsateCooldown = false;
     }, PulsateTimer * 1000);
     }
     }*/
}
GreaterHive.prototype = Object.create(Structure.prototype);
GreaterHive.prototype.constructor = GreaterHive;

function LowerHive (Faction, Image) {
    Structure.call(this, "Lower Hive", 1500, 1, 100, 300, 0, "Zerg", Faction, 160, 160, Image, Image, null);

    this.HudOptionsArray.length = 0;
}
LowerHive.prototype = Object.create(Structure.prototype);
LowerHive.prototype.constructor = LowerHive;

function SpawningStructure (Faction, Image) {
    Structure.call(this, "Spawning Structure", 1000, 1, 50, 200, 0, "Zerg", Faction, 128, 128, Image, Image, null);

    this.HudOptionsArray.length = 0;

    //this.ZerglingSpawnTimer = 5; // seconds untill zergling is spawned
    //this.LastZerglingSpawned = 0;
    this.SpawnQueue = [];
    this.SpawnDelay = 0.5;
    this.LastSpawned = 0;


    this.ExtraAnimation = function () {
        // spawns all units in the spawnqueue, half a second apart
        if (this.SpawnQueue.length != 0 && this.game.FrameTimer > this.LastSpawned + this.SpawnDelay * 60) {
            NewUnit = this.SpawnQueue.shift();
            this.game.UnitArray[this.game.UnitArray.length] = NewUnit;
            this.game.ObjectArray[this.game.ObjectArray.length] = NewUnit;
            NewUnit.pos(Math.floor(Math.random() * (this.width - NewUnit.width)) + this.x, this.y + this.height + 5);
            this.LastSpawned = this.game.FrameTimer;
        }


        /*if (FrameTimer > this.LastZerglingSpawned + this.ZerglingSpawnTimer * 60){
             var NewZergling = new Zergling("Zerg", imgRepo.ZergZerglingPurple);
             UnitArray[UnitArray.length] = NewZergling;
             ObjectArray[ObjectArray.length] = NewZergling;
             NewZergling.pos(Math.floor(Math.random() * (this.width - NewZergling.width)) + this.x, this.y + this.height + 5);
             NewZergling.draw();
             this.LastZerglingSpawned = FrameTimer;
        }*/
    }
}
SpawningStructure.prototype = Object.create(Structure.prototype);
SpawningStructure.prototype.constructor = SpawningStructure;




// Other
// Building spots
function BuildingSpot (Type, Race, Faction, width, height) {
    Structure.call(this, Type, null, null, null, null, null, Race, Faction, width, height, null, imgRepo.BuildingSpotIcon, null);

    // constructs hud options
    this.HudOptionsArray.length = 0; // BS should not have a salvage option
    // row 1
    this.SupplyDepotOption = new NewStructureOption(this, 710, 10, imgRepo.SupplyDepotIcon, function(){return new SupplyDepot("Player",imgRepo.TerranSupplyDepotBlue);}, "Q");
    this.BarracksOption = new NewStructureOption(this, 710 + 55 + 5, 10, imgRepo.BarracksIcon, function(){return new Barracks("Player",imgRepo.TerranBarracksBlue);}, "W");
    this.EngineeringBayOption = new NewStructureOption(this, 710 + (55 + 5) * 2, 10, imgRepo.EngineeringBayIcon, function(){return new EngineeringBay("Player",imgRepo.TerranEngineeringBayBlue);}, "E");
    this.FactoryOption = new NewStructureOption(this, 710 + (55 + 5) * 3, 10, imgRepo.FactoryIcon, function(){return new Factory("Player",imgRepo.TerranFactoryBlue);}, "R");
    // row 2
    this.AutoTurretOption = new NewStructureOption(this, 710, 10 + 55 + 5, imgRepo.AutoTurretIcon, function(){return new AutoTurret("Player",imgRepo.TerranAutoTurretBaseBlue);}, "A");
    // row 3
    this.CancelOption = new CancelOption(this, 710 + (55 + 5) * 3, 10 + (55 + 5) * 2, "V");

    this.HudOptionsArray[this.HudOptionsArray.length] = this.SupplyDepotOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.BarracksOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.EngineeringBayOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.FactoryOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.AutoTurretOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.CancelOption;

    this.draw = function () {
        // gray if constructing, see through if not
        if (this.ProductionList.length != 0) {
            this.context.fillStyle = "#666666";
            this.context.fillRect(this.x,this.y,this.width,this.height);
        }
        else {
            this.context.fillStyle = "#000000";
            this.context.strokeStyle = "#000000";
            this.context.globalAlpha = 0.3;
            this.context.fillRect(this.x,this.y,this.width,this.height);
            this.context.globalAlpha = 1;
            this.context.strokeRect(this.x,this.y,this.width,this.height);
        }

        // draws hotkey char
        this.context.fillStyle = "#FFFFFF";
        this.context.font = "14px Arial";
        this.context.fillText(this.HotKey, this.x + this.width / 2 - 3, this.y + this.height / 2 + 5);

        // If something is being constructed, draw a progressbar under the structure
        if (this.ProductionList.length != 0) {
            this.context.fillStyle = "#333333";
            this.context.fillRect(this.x, this.y + this.height + 3, this.width, 5);

            this.context.fillStyle = "#33CC00";
            var ProgressionInPx = ((this.ProductionProgress / 60) / this.ProductionList[0].BuildTime) * this.width;
            this.context.fillRect(this.x, this.y + this.height + 3, ProgressionInPx, 5);
        }

        // green rectangle around if selected
        if (CurrentlySelected === this) {
            this.context.strokeStyle = "#33CC00";
            this.context.lineWidth = 1;
            this.context.strokeRect(this.x,this.y,this.width,this.height);
        }
    };

    this.clear = function () {
        this.context.clearRect(this.x - 1,this.y - 1,this.width + 2,this.height + 2);

        if (this.ProductionList.length != 0) {
            this.context.clearRect(this.x - 1, this.y + this.height + 2, this.width + 2, 7);
        }
    };

    this.Selected = function () {
        if (CurrentlySelected != this) PreviouslySelected = CurrentlySelected;
        if (CurrentlySelected != this.game.Commandhud) CurrentlySelected.clear();
        CurrentlySelected = this;

        // clears hud
        this.game.hudContext.clearRect(0,0,game.hudCanvas.width,game.hudCanvas.height);

        // draws seperators on hud
        this.game.hudContext.fillStyle = "#c3c3c3";
        this.game.hudContext.fillRect(320,5,5,this.game.hudCanvas.height);
        this.game.hudContext.fillRect(700,5,5,this.game.hudCanvas.height);

        // Draw object information on hud
        this.game.hudContext.fillStyle = "#ffffff";
        this.game.hudContext.drawImage(this.Icon,20,20,110,110);
        this.game.hudContext.font = "18px Arial";
        this.game.hudContext.fillText(this.Type, 160, 35,150);

        // Draws production list on hud (if not empty)
        if (this.ProductionList.length != 0) {
            this.game.hudContext.drawImage(this.ProductionList[0].Icon, 365, 30, 64, 64);

            this.game.hudContext.font = "14px Arial";
            this.game.hudContext.fillText("Constructing " + this.ProductionList[0].Type, 440, 63);

            // Draws production progression bar on hud
            this.game.hudContext.fillStyle = "#333333";
            this.game.hudContext.fillRect(440, 73, 210, 20);

            this.game.hudContext.fillStyle = "#33CC00";
            var ProgressionInPx = ((this.ProductionProgress / 60) / this.ProductionList[0].BuildTime) * 210;
            this.game.hudContext.fillRect(440, 73, ProgressionInPx, 20);
        }

        // Draws hud options if implemented
        this.HudOptionsDraw();
    };

    // Production function. If ProductionList.length != null, produce whatever. Called in animation func.
    this.Production = function () {
        if (this.ProductionList.length != 0) {
            this.ProductionProgress += 1;

            if (this.ProductionProgress / 60 === this.ProductionList[0].BuildTime) {
                this.clear();
                var NewStructure = this.ProductionList.shift();
                if (this.HotKey != undefined) NewStructure.HotKey = this.HotKey;
                this.game.StructureArray[this.game.StructureArray.indexOf(this)] = NewStructure;
                this.game.ObjectArray[this.game.ObjectArray.indexOf(this)] = NewStructure;

                NewStructure.pos(
                    (this.x + this.width / 2) - (NewStructure.width / 2),
                    this.y + this.height / 2 - (NewStructure.height / 2)
                );

                NewStructure.draw();

                if (NewStructure.MaxSupplyLift != undefined) this.game.PlayerMaxSupply += NewStructure.MaxSupplyLift;

                if (CurrentlySelected === this) {
                    CurrentlySelected = NewStructure;
                }
                else if (PreviouslySelected === this) {
                    PreviouslySelected = NewStructure;
                }

                this.ProductionProgress = 0;
            }
        }
    };
}
BuildingSpot.prototype = Object.create(Structure.prototype);
BuildingSpot.prototype.constructor = BuildingSpot;


// Resources
function MineralsBlue (MineralAmount) {
    Structure.call(this, "Blue Minerals", null, null, null, null, null, null, null, 24, 24, imgRepo.MineralsBlue, imgRepo.MineralsBlue, null);

    this.Occupied = false;
    this.OccupiedBy = null;
    this.MineralAmount = MineralAmount;
    this.HarvesterArray = [];

    this.HudOptionsArray.length = 0;

    this.ObjectHudInformation = function () {
        this.game.hudContext.fillStyle = "#ffffff";
        this.game.hudContext.drawImage(this.Icon,20,20,110,110);
        this.game.hudContext.font = "18px Arial";
        this.game.hudContext.fillText(this.Type, 160, 35,150);
        this.game.hudContext.font = "14px Arial";
        this.game.hudContext.fillText("Mineral amount: " + this.MineralAmount, 160, 65);
        this.game.hudContext.fillText("Harvesters: " + this.HarvesterArray.length, 160, 85);
    }
}
MineralsBlue.prototype = Object.create(Structure.prototype);
MineralsBlue.prototype.constructor = MineralsBlue;
// MineralsBlue global variables
MineralsBlue.MineralsPerTrip = 10;

function MineralsGold (MineralAmount) {
    Structure.call(this, "Gold Minerals", null, null, null, null, null, null, null, 32, 32, imgRepo.MineralsGold, imgRepo.MineralsGold, null);

    this.Occupied = false;
    this.OccupiedBy = null;
    this.MineralAmount = MineralAmount;
    this.HarvesterArray = [];

    this.HudOptionsArray.length = 0;

    this.ObjectHudInformation = function () {
        this.game.hudContext.fillStyle = "#ffffff";
        this.game.hudContext.drawImage(this.Icon,20,20,110,110);
        this.game.hudContext.font = "18px Arial";
        this.game.hudContext.fillText(this.Type, 160, 35,150);
        this.game.hudContext.font = "14px Arial";
        this.game.hudContext.fillText("Mineral amount: " + this.MineralAmount, 160, 65);
        this.game.hudContext.fillText("Harvesters: " + this.HarvesterArray.length, 160, 85);
    }
}
MineralsGold.prototype = Object.create(Structure.prototype);
MineralsGold.prototype.constructor = MineralsGold;
// MineralsGold global variables
MineralsGold.MineralsPerTrip = 20;

function GasGeyser (GasAmount) {
    Structure.call(this, "Gas Geyser", null, null, null, null, null, null, null, 96, 96, imgRepo.GasGeyserAnim1, imgRepo.GasGeyserAnim1, null);

    this.GasAmount = GasAmount;

    this.HudOptionsArray.length = 0; // GasGeyser should not have a salvage option
    this.RefineryOption = new NewStructureOption(this, 710, 10, imgRepo.RefineryIcon, function(){return new Refinery("Player",imgRepo.TerranRefineryBlue);}, "Q");
    this.CancelOption = new CancelOption(this, 710 + (55 + 5) * 3, 10 + (55 + 5) * 2, "V");

    this.HudOptionsArray[this.HudOptionsArray.length] = this.RefineryOption;
    this.HudOptionsArray[this.HudOptionsArray.length] = this.CancelOption;

    this.ExtraAnimation = function () {
        if (this.Image === imgRepo.GasGeyserAnim1) this.Image = imgRepo.GasGeyserAnim2;
        else if (this.Image === imgRepo.GasGeyserAnim2) this.Image = imgRepo.GasGeyserAnim3;
        else if (this.Image === imgRepo.GasGeyserAnim3) this.Image = imgRepo.GasGeyserAnim1;
    };

    this.Production = function () {
        if (this.ProductionList.length != 0) {
            this.ProductionProgress += 1;

            if (this.ProductionProgress / 60 === this.ProductionList[0].BuildTime) {
                this.clear();
                var NewStructure = this.ProductionList.shift();
                if (this.HotKey != undefined) NewStructure.HotKey = this.HotKey;
                this.game.StructureArray[this.game.StructureArray.indexOf(this)] = NewStructure;
                this.game.ObjectArray[this.game.ObjectArray.indexOf(this)] = NewStructure;
                NewStructure.pos(this.x, this.y);
                NewStructure.draw();

                if (CurrentlySelected === this) {
                    CurrentlySelected = NewStructure;
                }

                this.ProductionProgress = 0;

                this.game.SouthGasGeyser = NewStructure;
            }
        }
    };

    this.Selected = function () {
        if (CurrentlySelected != this) PreviouslySelected = CurrentlySelected;
        if (CurrentlySelected != this.game.Commandhud) CurrentlySelected.clear();
        CurrentlySelected = this;

        // clears hud
        this.game.hudContext.clearRect(0,0,this.game.hudCanvas.width,this.game.hudCanvas.height);

        // draws seperators on hud
        this.game.hudContext.fillStyle = "#c3c3c3";
        this.game.hudContext.fillRect(320,5,5,this.game.hudCanvas.height);
        this.game.hudContext.fillRect(700,5,5,this.game.hudCanvas.height);

        // Draw object information on hud
        this.ObjectHudInformation();

        // Draws production list on hud (if not empty)
        if (this.ProductionList.length != 0) {
            this.game.hudContext.drawImage(this.ProductionList[0].Icon, 365, 30, 64, 64);

            this.game.hudContext.font = "14px Arial";
            this.game.hudContext.fillText("Constructing " + this.ProductionList[0].Type, 440, 63);

            // Draws production progression bar on hud
            this.game.hudContext.fillStyle = "#333333";
            this.game.hudContext.fillRect(440, 73, 210, 20);

            this.game.hudContext.fillStyle = "#33CC00";
            var ProgressionInPx = ((this.ProductionProgress / 60) / this.ProductionList[0].BuildTime) * 210;
            this.game.hudContext.fillRect(440, 73, ProgressionInPx, 20);
        }

        // Draws hud options if implemented
        if (this.HudOptionsDraw != null && this.HudOptionsDraw != undefined) this.HudOptionsDraw();
    };

    this.ObjectHudInformation = function () {
        this.game.hudContext.fillStyle = "#ffffff";
        this.game.hudContext.drawImage(this.Icon,20,20,110,110);
        this.game.hudContext.font = "18px Arial";
        this.game.hudContext.fillText(this.Type, 160, 35,150);
        this.game.hudContext.font = "14px Arial";
        this.game.hudContext.fillText("Gas amount: " + this.GasAmount, 160, 65);
    }
}
GasGeyser.prototype = Object.create(Structure.prototype);
GasGeyser.prototype.constructor = GasGeyser;





/*
 * Hud Options
 */

// Abstract hud object
function HudOption (Caller, x, y, Icon, NewObject, HotKey) {
    this.Caller = Caller;
    this.x = x;
    this.y = y;
    this.width = 55;
    this.height = 55;
    this.Icon = Icon;
    this.NewObject = NewObject;
    this.HotKey = HotKey;

    this.Title = ""; // abstract
    this.Description_Line1 = ""; // abstract
    this.Description_Line2 = ""; // abstract
    this.Description_Line3 = ""; // abstract

    this.ToolTipWidth = 250;
    this.ToolTipHeight = 0;

    this.draw = function () {
        this.game.hudContext.drawImage(this.Icon, this.x, this.y, this.width, this.height);

        // draws hotkey
        this.game.hudContext.fillStyle = "#FFFFFF";
        this.game.hudContext.font = "14px Arial";
        this.game.hudContext.clearRect(this.x + 3, this.y + 3, 13, 13);
        this.game.hudContext.fillText(this.HotKey, this.x + 4, this.y + 14);
    };
    this.Selected = function () {
        // abstract. This function is run when the option is clicked
    };

    this.ShowToolTip = function () {
        // calculate height of this Tooltip, if no pre-defined height
        if (this.ToolTipHeight === 0) {
            this.ToolTipHeight += 10; // to offset blunt edges

            if (this.NewObject != null) {
                this.ToolTipHeight += 40;  // for title
                var tempobject = new this.NewObject;
                if (tempobject.MineralCost && tempobject.MineralCost != 0) this.ToolTipHeight += 20;
                if (tempobject.GasCost && tempobject.GasCost != 0) this.ToolTipHeight += 20;
                if (tempobject.BuildTime && tempobject != 0) this.ToolTipHeight += 20;
                if (tempobject.Description && tempobject.Description.length != 0) this.ToolTipHeight += 35;
            }

            else{
                this.ToolTipHeight += 40; // for Title
                if (this.Description_Line1.length != 0) this.ToolTipHeight += 20;
                if (this.Description_Line2.length != 0) this.ToolTipHeight += 20;
                if (this.Description_Line3.length != 0) this.ToolTipHeight += 20;
            }
        }

        // clears the area that can at most be covered with a tooltip
        this.game.messageContext.clearRect(this.game.messageCanvas.width - 320, this.game.messageCanvas.height - 520, 320, 520);

        this.game.messageContext.beginPath();
        this.game.messageContext.moveTo(this.game.messageCanvas.width - this.ToolTipWidth - 2 + 5, this.game.messageCanvas.height - 2);
        this.game.messageContext.lineTo(this.game.messageCanvas.width - this.ToolTipWidth - 2, this.game.messageCanvas.height - 7);
        this.game.messageContext.lineTo(this.game.messageCanvas.width - this.ToolTipWidth - 2, this.game.messageCanvas.height - this.ToolTipHeight - 2 + 5);
        this.game.messageContext.lineTo(this.game.messageCanvas.width - this.ToolTipWidth - 2 + 5, this.game.messageCanvas.height - this.ToolTipHeight - 2);
        this.game.messageContext.lineTo(this.game.messageCanvas.width - 7, this.game.messageCanvas.height - this.ToolTipHeight - 2);
        this.game.messageContext.lineTo(this.game.messageCanvas.width - 2, this.game.messageCanvas.height - this.ToolTipHeight - 2 + 5);
        this.game.messageContext.lineTo(this.game.messageCanvas.width - 2, this.game.messageCanvas.height - 7);
        this.game.messageContext.lineTo(this.game.messageCanvas.width - 7, this.game.messageCanvas.height - 2);
        this.game.messageContext.lineTo(this.game.messageCanvas.width - this.ToolTipWidth - 2 + 5, this.game.messageCanvas.height - 2);
        this.game.messageContext.closePath();

        this.game.messageContext.globalAlpha = 0.95;
        this.game.messageContext.fillStyle = "#001000";
        this.game.messageContext.fill();
        this.game.messageContext.strokeStyle = "#003300";
        this.game.messageContext.lineWidth = 2;
        this.game.messageContext.stroke();
        this.game.messageContext.globalAlpha = 1;

        if (this.NewObject != null) {
            var object = new this.NewObject;

            // prints title
            this.game.messageContext.font = "16px Arial";
            this.game.messageContext.fillStyle = "#FFFFFF";
            this.game.messageContext.fillText("Construct " + object.Type, this.game.messageCanvas.width - this.ToolTipWidth + 7, this.game.messageCanvas.height - this.ToolTipHeight + 22);

            var i = 0;
            // prints additional information
            this.game.messageContext.font = "14px Arial";
            this.game.messageContext.fillStyle = "#FFFFFF";
            if (object.MineralCost && object.MineralCost != 0) {
                this.game.messageContext.drawImage(imgRepo.MineralsIcon, this.game.messageCanvas.width - this.ToolTipWidth + 7, this.game.messageCanvas.height - this.ToolTipHeight + 38, 16, 16);
                this.game.messageContext.fillText(object.MineralCost, this.game.messageCanvas.width - this.ToolTipWidth + 30, this.game.messageCanvas.height - this.ToolTipHeight + 50);
            }
            if (object.GasCost && object.GasCost != 0) {
                i += 1;
                this.game.messageContext.drawImage(imgRepo.GasIcon, this.game.messageCanvas.width - this.ToolTipWidth + 7, this.game.messageCanvas.height - this.ToolTipHeight + 38 + i * 20, 16, 16);
                this.game.messageContext.fillText(object.GasCost, this.game.messageCanvas.width - this.ToolTipWidth + 30, this.game.messageCanvas.height - this.ToolTipHeight + 50 + i * 20);
            }
            if (object.BuildTime && object != 0) {
                i += 1;
                this.game.messageContext.drawImage(imgRepo.BuildTimeIcon, this.game.messageCanvas.width - this.ToolTipWidth + 7, this.game.messageCanvas.height - this.ToolTipHeight + 38 + i * 20, 14, 14);
                this.game.messageContext.fillText(object.BuildTime, this.game.messageCanvas.width - this.ToolTipWidth + 30, this.game.messageCanvas.height - this.ToolTipHeight + 50 + i * 20);
            }
            if (object.Description && object.Description.length != 0) {
                i += 1;
                this.game.messageContext.fillText(object.Description, this.game.messageCanvas.width - this.ToolTipWidth + 5, this.game.messageCanvas.height - this.ToolTipHeight + 60 + i * 20);
            }
        }
        else {
            // prints title
            this.game.messageContext.font = "16px Arial";
            this.game.messageContext.fillStyle = "#FFFFFF";
            this.game.messageContext.fillText(this.Title, this.game.messageCanvas.width - this.ToolTipWidth + 7, this.game.messageCanvas.height - this.ToolTipHeight + 22);

            // prints description
            this.game.messageContext.font = "14px Arial";
            this.game.messageContext.fillStyle = "#FFFFFF";
            this.game.messageContext.fillText(this.Description_Line1, this.game.messageCanvas.width - this.ToolTipWidth + 7, this.game.messageCanvas.height - this.ToolTipHeight + 52);

            if (this.Description_Line2.length != 0) {
                this.game.messageContext.fillText(this.Description_Line2, this.game.messageCanvas.width - this.ToolTipWidth + 7, this.game.messageCanvas.height - this.ToolTipHeight + 72);
            }
            if (this.Description_Line3.length != 0) {
                this.game.messageContext.fillText(this.Description_Line3, this.game.messageCanvas.width - this.ToolTipWidth + 7, this.game.messageCanvas.height - this.ToolTipHeight + 92);
            }
        }
    }
}

// For buildingspots
function NewStructureOption (Caller, x, y, Icon, NewObject, HotKey) {
    HudOption.call(this, Caller, x, y, Icon, NewObject, HotKey);

    this.Selected = function () {
        if (Caller.ProductionList.length === 0) {
            var NewStructure = new NewObject;
            if (NewStructure.MineralCost <= this.game.PlayerMinerals && NewStructure.GasCost <= this.game.PlayerGas) {
                Caller.ProductionList.push(NewStructure);

                this.game.PlayerMinerals -= NewStructure.MineralCost;
                this.game.PlayerGas -= NewStructure.GasCost;
            }
            else if (this.game.PlayerMinerals < NewStructure.MineralCost) {
                this.game.Alertsystem.AddAlert("Not enough minerals");
            }
            else if (this.game.PlayerGas < NewStructure.GasCost) {
                this.game.Alertsystem.AddAlert("Not enough Gas");
            }
        }
    };
}
NewStructureOption.prototype = Object.create(HudOption.prototype);
NewStructureOption.prototype.constructor = NewStructureOption;

// for unit producing structures
function NewUnitOption (Caller, x, y, Icon, NewObject, HotKey) {
    HudOption.call(this, Caller, x, y, Icon, NewObject, HotKey);
    this.Selected = function () {
        if (Caller.IsSalvaging != true) {
            if (Caller.ProductionList.length < 5){
                var NewUnit = new NewObject;
                if (NewUnit.MineralCost <= this.game.PlayerMinerals && NewUnit.GasCost <= this.game.PlayerGas) {
                    Caller.ProductionList.push(NewUnit);

                    this.game.PlayerMinerals -= NewUnit.MineralCost;
                    this.game.PlayerGas -= NewUnit.GasCost;
                    this.game.ResourceChanges = true;
                }
                else if (this.game.PlayerMinerals < NewUnit.MineralCost) {
                    this.game.Alertsystem.AddAlert("Not enough minerals");
                }
                else if (this.game.PlayerGas < NewUnit.GasCost) {
                    this.game.Alertsystem.AddAlert("Not enough Gas");
                }
            }
        }
    }
}
NewUnitOption.prototype = Object.create(HudOption.prototype);
NewUnitOption.prototype.constructor = NewUnitOption;

// For CC: pulling scvs / putting on gas / mins
function SCVToGasOption (Caller, x, y, HotKey) {
    HudOption.call(this, Caller, x, y, imgRepo.SCVToGasIcon, null, HotKey);

    this.Title = "Put SCV on gas";
    this.Description_Line1 = "Puts an SCV on gas, if a refinery is";
    this.Description_Line2 = "constructed";

    this.Selected = function () {
        if (this.game.SouthGasGeyser.Type === "Refinery") {
            for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
                if (this.game.UnitArray[i].Working === true) {
                    if (this.game.UnitArray[i].HarvestingMinerals === true && this.game.UnitArray[i].CarryingMinerals === false) {
                        this.game.UnitArray[i].HarvestingMinerals = false;
                        this.game.UnitArray[i].HarvestingGas = true;

                        if (this.game.UnitArray[i].HarvestingFrom != null) {
                            this.game.UnitArray[i].HarvestingFrom.HarvesterArray.splice(this.game.UnitArray[i].HarvestingFrom.HarvesterArray.indexOf(this.game.UnitArray[i]), 1);

                            if (this.game.UnitArray[i].HarvestingFrom.OccupiedBy === this.game.UnitArray[i]) {
                                this.game.UnitArray[i].HarvestingFrom.Occupied = false;
                                this.game.UnitArray[i].HarvestingFrom.OccupiedBy = null;
                            }
                        }

                        this.game.UnitArray[i].HarvestingFrom = null;
                        this.game.UnitArray[i].TimeHarvested = 0;

                        game.SouthGasGeyser.HarvesterArray[this.game.game.SouthGasGeyser.HarvesterArray.length] = this.game.UnitArray[i];
                        return;
                    }
                }
            }
            for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
                if (this.game.UnitArray[i].Working === true) {
                    if (this.game.UnitArray[i].HarvestingMinerals === true) {
                        this.game.UnitArray[i].HarvestingMinerals = false;
                        this.game.UnitArray[i].HarvestingGas = true;

                        if (this.game.UnitArray[i].HarvestingFrom != null) {
                            this.game.UnitArray[i].HarvestingFrom.HarvesterArray.splice(this.game.UnitArray[i].HarvestingFrom.HarvesterArray.indexOf(this.game.UnitArray[i]), 1);

                            if (this.game.UnitArray[i].HarvestingFrom.OccupiedBy === this.game.UnitArray[i]) {
                                this.game.UnitArray[i].HarvestingFrom.Occupied = false;
                                this.game.UnitArray[i].HarvestingFrom.OccupiedBy = null;
                            }
                        }

                        this.game.UnitArray[i].HarvestingFrom = null;
                        this.game.UnitArray[i].TimeHarvested = 0;

                        this.game.SouthGasGeyser.HarvesterArray[this.game.SouthGasGeyser.HarvesterArray.length] = this.game.UnitArray[i];
                        return;
                    }
                }
            }
            this.game.Alertsystem.AddAlert("All available SCV's already on Gas");
        }
        else {
            this.game.Alertsystem.AddAlert("You must build a refinery first");
        }
    }
}
SCVToGasOption.prototype = Object.create(HudOption.prototype);
SCVToGasOption.prototype.constructor = SCVToGasOption;

function SCVToMineralsOption (Caller, x, y, HotKey) {
    HudOption.call(this, Caller, x, y, imgRepo.SCVToMineralsIcon, null, HotKey);

    this.Title = "Put SCV on minerals";
    this.Description_Line1 = "Put an SCV on minerals, if any are";
    this.Description_Line2 = "available.";

    this.Selected = function () {
        for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
            if (this.game.UnitArray[i].Working === true) {
                if (this.game.UnitArray[i].HarvestingGas === true && this.game.UnitArray[i].CarryingGas === false) {
                    this.game.UnitArray[i].HarvestingMinerals = true;
                    this.game.UnitArray[i].HarvestingGas = false;
                    this.game.UnitArray[i].HarvestingFrom = null;
                    this.game.SouthGasGeyser.HarvesterArray.splice(this.game.SouthGasGeyser.HarvesterArray.indexOf(this.game.UnitArray[i]), 1);
                    return;
                }
            }
        }
        for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
            if (this.game.UnitArray[i].Working === true) {
                if (this.game.UnitArray[i].HarvestingGas === true) {
                    this.game.UnitArray[i].HarvestingMinerals = true;
                    this.game.UnitArray[i].HarvestingGas = false;
                    this.game.UnitArray[i].HarvestingFrom = null;
                    this.game.game.SouthGasGeyser.HarvesterArray.splice(this.game.SouthGasGeyser.HarvesterArray.indexOf(this.game.UnitArray[i]), 1);
                    return;
                }
            }
        }
        // If function comes this far: MessageArray[MessageArray.length] = new Message("Not enough Working SCV's");
        this.game.Alertsystem.AddAlert("All available SCV's already on minerals");
    }
}
SCVToMineralsOption.prototype = Object.create(HudOption.prototype);
SCVToMineralsOption.prototype.constructor = SCVToMineralsOption;

function PullSCVOption (Caller, x, y, HotKey) {
    HudOption.call(this, Caller, x, y, imgRepo.PullSCVIcon, null, HotKey);

    this.Title = "Pull SCV";
    this.Description_Line1 = "Make an SCV join the fighting";

    this.Selected = function () {
        for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
            if (this.game.UnitArray[i].Working === true && this.game.UnitArray[i].AmountCarried === 0) {
                this.game.UnitArray[i].Working = false;

                if (this.game.UnitArray[i].HarvestingFrom != null) {
                    this.game.UnitArray[i].HarvestingFrom.HarvesterArray.splice(this.game.UnitArray[i].HarvestingFrom.HarvesterArray.indexOf(this.game.UnitArray[i]), 1);

                    if (this.game.UnitArray[i].HarvestingFrom.OccupiedBy === this.game.UnitArray[i]) {
                        this.game.UnitArray[i].HarvestingFrom.Occupied = false;
                        this.game.UnitArray[i].HarvestingFrom.OccupiedBy = null;
                    }
                }

                this.game.UnitArray[i].HarvestingFrom = null;
                this.game.UnitArray[i].TimeHarvested = 0;

                return;
            }
        }
        for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
            if (this.game.UnitArray[i].Working === true) {
                this.game.UnitArray[i].Working = false;
                if (this.game.UnitArray[i].HarvestingFrom != null) {
                    this.game.UnitArray[i].HarvestingFrom.HarvesterArray.splice(this.game.UnitArray[i].HarvestingFrom.HarvesterArray.indexOf(this.game.UnitArray[i]), 1);

                    if (this.game.UnitArray[i].HarvestingFrom.OccupiedBy === this.game.UnitArray[i]) {
                        this.game.UnitArray[i].HarvestingFrom.Occupied = false;
                        this.game.UnitArray[i].HarvestingFrom.OccupiedBy = null;
                    }
                }
                this.game.UnitArray[i].HarvestingFrom = null;
                this.game.UnitArray[i].TimeHarvested = 0;

                return;
            }
        }
        this.game.Alertsystem.AddAlert("No available working SCV's");
    }
}
PullSCVOption.prototype = Object.create(HudOption.prototype);
PullSCVOption.prototype.constructor = PullSCVOption;

function RecallSCVOption (Caller, x, y, HotKey) {
    HudOption.call(this, Caller, x, y, imgRepo.SCVWorkIcon, null, HotKey);

    this.Title = "Recall SCV";
    this.Description_Line1 = "Puts a fighting SCV back on";
    this.Description_Line2 = "harvesting duty";

    this.Selected = function () {
        for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
            if (this.game.UnitArray[i].Working === false && this.game.UnitArray[i].AmountCarried != 0) {
                this.game.UnitArray[i].Working = true;
                return;
            }
        }
        for (var i = 0, len = this.game.UnitArray.length; i < len; i++) {
            if (this.game.UnitArray[i].Working === false) {
                this.game.UnitArray[i].Working = true;
                return;
            }
        }
        this.game.Alertsystem.AddAlert("No available fighting SCV's");
    }
}
RecallSCVOption.prototype = Object.create(HudOption.prototype);
RecallSCVOption.prototype.constructor = RecallSCVOption;

// General Options
// Cancel building units / structures
function CancelOption (Caller, x, y, HotKey) {
    HudOption.call(this, Caller, x, y, imgRepo.CancelIcon, null, HotKey);

    this.Title = "Cancel Action";
    this.Description_Line1 = "Cancels current action";

    this.Selected = function () {
        if (Caller.ProductionList.length != 0) {
            Caller.clear();
            var CanceledObject = Caller.ProductionList.pop();
            Caller.draw();

            this.game.PlayerMinerals += CanceledObject.MineralCost;
            this.game.PlayerGas += CanceledObject.GasCost;

            if (Caller.ProductionList.length === 0) {
                if (Caller.ProductionProgress != undefined) Caller.ProductionProgress = 0;
                if (CanceledObject.SupplyWeight != undefined && Caller.ProducingUnitSupplyCounted === true) this.game.PlayerSupply -= CanceledObject.SupplyWeight;
                if (Caller.ProducingUnitSupplyCounted != undefined) Caller.ProducingUnitSupplyCounted = false;
            }
        }
        else if (Caller.IsSalvaging === true) {
            // cancel salvage
            Caller.clear();
            Caller.IsSalvaging = false;
            Caller.draw();
            Caller.SalvageCounter = 0;
        }
    }
}
CancelOption.prototype = Object.create(HudOption.prototype);
CancelOption.prototype.constructor = CancelOption;

// Salvage option for buildings
function SalvageOption (Caller, x, y, HotKey) {
    HudOption.call(this, Caller, x, y, imgRepo.SalvageIcon, null, HotKey);

    this.Title = "Salvage Structure";
    this.Description_Line1 = "Returns 50% of the spent resources";
    this.Description_Line2 = "after a few seconds delay.";

    this.Selected = function () {
        if (Caller.IsSalvaging != true) {
            if (Caller.ProductionList.length === 0) {
                Caller.IsSalvaging = true;
                Caller.SalvageCounter = 0;
            }
            else{
                this.game.Alertsystem.AddAlert("Cancel production before salvaging");
            }
        }
    }
}
SalvageOption.prototype = Object.create(HudOption.prototype);
SalvageOption.prototype.constructor = SalvageOption;

// Delete option for units
function DeleteOption (Caller, x, y, HotKey) {
    HudOption.call(this, Caller, x, y, imgRepo.DeleteIcon, null, HotKey);

    this.Title = "Delete Unit";
    this.Description_Line1 = "Instantly destroys the selected";
    this.Description_Line2 = "unit.";

    this.Selected = function () {
        Caller.Hp = 0;

        this.game.PossibleDeaths = true;
    }
}
DeleteOption.prototype = Object.create(HudOption.prototype);
DeleteOption.prototype.constructor = DeleteOption;


// CommandHud Options
// CommandState options
function CommandStateOption (Caller, x, y, NewCommandState, HotKey, ButtonFill) {
    HudOption.call(this, Caller, x, y, null, null, HotKey);

    this.height = 50;
    this.width = 50;
    this.ButtonFill = ButtonFill;

    this.Selected = function () {
        CommandState = NewCommandState;
    };
    this.draw = function () {
        CommandState === NewCommandState ? this.Caller.context.fillStyle = "#003300" : this.Caller.context.fillStyle = "#000000";
        this.Caller.context.fillRect(this.x, this.y, this.height, this.width);

        this.Caller.context.strokeStyle = "#FFFFFF";
        this.Caller.context.strokeRect(this.x, this.y, this.height, this.width);

        this.Caller.context.font = "12px Arial";
        this.Caller.context.fillStyle = "#FFFFFF";
        this.Caller.context.fillText(this.HotKey, this.x + 3, this.y + 13);
        this.ButtonFill();
    }
}
CommandStateOption.prototype = Object.create(HudOption.prototype);
CommandStateOption.prototype.constructor = CommandStateOption;

// MoveDirection options
function MoveDirectionOption (Caller, x, y, NewMoveDirection, HotKey, ButtonFill) {
    HudOption.call(this, Caller, x, y, null, null, HotKey);

    this.height = 50;
    this.width = 50;
    this.ButtonFill = ButtonFill;

    this.Selected = function () {
        MoveDirection = NewMoveDirection;
    };
    this.draw = function () {
        MoveDirection === NewMoveDirection ? this.Caller.context.fillStyle = "#003300" : this.Caller.context.fillStyle = "#000000";
        this.Caller.context.fillRect(this.x, this.y, this.height, this.width);

        this.Caller.context.strokeStyle = "#FFFFFF";
        this.Caller.context.strokeRect(this.x, this.y, this.height, this.width);

        this.Caller.context.font = "12px Arial";
        this.Caller.context.fillStyle = "#FFFFFF";
        this.Caller.context.fillText(this.HotKey, this.x + 3, this.y + 13);
        this.ButtonFill();
    }
}
MoveDirectionOption.prototype = Object.create(HudOption.prototype);
MoveDirectionOption.prototype.constructor = MoveDirectionOption;




// Alert system. Prints alerts to messagecanvas
function AlertSystem () {
    this.canvas = document.getElementById('messageCanvas');
    this.context = this.canvas.getContext('2d');

    this.AlertArray = [];

    this.AddAlert = function (Message) {
        var alert = new Alert(Message);

        this.AlertArray.unshift(alert);
    };

    this.clear = function () {
        this.context.clearRect(10, this.game.messageCanvas.height - 20 - 25 * this.AlertArray.length, 300, 30 * this.AlertArray.length);
    };

    this.draw = function () {
        this.context.font = "18px Arial";
        this.context.fillStyle = "#FF0000";

        for (var i = 0, len = this.AlertArray.length; i < len; i++) {
            this.context.fillText(this.AlertArray[i].Message, 10, this.game.messageCanvas.height - 20 - 25 * i, 300);
        }
    };

    this.arrayCheck = function () {
        // if there are more than 10 messages, remove the oldest
        while (this.AlertArray.length > 10) {
            this.AlertArray.pop();
        }

        for (var i = 0, len = this.AlertArray.length; i < len; i++) {
            this.AlertArray[i].ShowCounter += 1;

            if (this.AlertArray[i].ShowCounter / 60 >= this.AlertArray[i].ShowTime) {
                this.clear();
                this.AlertArray.pop();
                //this.AlertArray.splice(this.AlertArray.indexOf(this.AlertArray[i]), 1);
            }
        }
    };

    this.show = function () {
        if (this.AlertArray.length != 0) {
            this.arrayCheck();

            this.clear();

            this.draw();
        }
    }
}
function Alert (Message) {
    this.Message = Message;
    this.ShowTime = 2;
    this.ShowCounter = 0;
}



// The background object.
function Background(Image, Tilesize, RowTileCount, ColTileCount, ImageNumTiles, Ground){
    this.pos = function(x, y){
        this.x = x;
        this.y = y;
    };

    this.Image = Image;
    this.ImageNumTiles = ImageNumTiles; // Number of tiles per row in the tileset image
    this.Tilesize = Tilesize; // the size of a tile
    this.RowTileCount = RowTileCount; // Number of tiles in a row
    this.ColTileCount = ColTileCount; // Number of tiles in a column
    this.Ground = Ground;

    this.draw = function(){
        for (r = 0; r < this.RowTileCount; r++){
            for (c = 0; c < this.ColTileCount; c++){
                var Tile = this.Ground[c][r];
                var TileRow = (Tile / this.ImageNumTiles) | 0;
                var TileCol = (Tile % this.ImageNumTiles) | 0;

                this.context.drawImage(this.Image,(TileCol*this.Tilesize),(TileRow*this.Tilesize),
                                       this.Tilesize,this.Tilesize,(r*this.Tilesize),(c*this.Tilesize),this.Tilesize,this.Tilesize);
            }
        }
    }
}



/**
 * QuadTree object.
 *
 * The quadrant indexes are numbered as below:
 *     |
 *  1  |  0
 * —-+—-
 *  2  |  3
 *     |
 */
function QuadTree(boundBox, lvl) {
    var maxObjects = 10;
    this.bounds = boundBox || {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    var objects = [];
    this.nodes = [];
    var level = lvl || 0;
    var maxLevels = 5;
    /*
     * Clears the QuadTree and all nodes of objects
     */
    this.clear = function() {
        objects = [];
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].clear();
        }
        this.nodes = [];
    };
    /*
     * Get all objects in the QuadTree
     */
    this.getAllObjects = function(returnedObjects) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].getAllObjects(returnedObjects);
        }
        for (var i = 0, len = objects.length; i < len; i++) {
            returnedObjects.push(objects[i]);
        }
        return returnedObjects;
    };
    /*
     * Return all objects that the object could collide with
     */
    this.findObjects = function(returnedObjects, obj) {
        if (typeof obj === "undefined") {
            console.log("UNDEFINED OBJECT");
            return;
        }
        var index = this.getIndex(obj);
        if (index != -1 && this.nodes.length) {
            this.nodes[index].findObjects(returnedObjects, obj);
        }
        for (var i = 0, len = objects.length; i < len; i++) {
            returnedObjects.push(objects[i]);
        }
        return returnedObjects;
    };
    /*
     * Insert the object into the QuadTree. If the tree
     * excedes the capacity, it will split and add all
     * objects to their corresponding nodes.
     */
    this.insert = function(obj) {
        if (typeof obj === "undefined") {
            return;
        }
        if (obj instanceof Array) {
            for (var i = 0, len = obj.length; i < len; i++) {
                this.insert(obj[i]);
            }
            return;
        }
        if (this.nodes.length) {
            var index = this.getIndex(obj);
            // Only add the object to a subnode if it can fit completely
            // within one
            if (index != -1) {
                this.nodes[index].insert(obj);
                return;
            }
        }
        objects.push(obj);
        // Prevent infinite splitting
        if (objects.length > maxObjects && level < maxLevels) {
            if (this.nodes[0] == null) {
                this.split();
            }
            var i = 0;
            while (i < objects.length) {
                var index = this.getIndex(objects[i]);
                if (index != -1) {
                    this.nodes[index].insert((objects.splice(i,1))[0]);
                }
                else {
                    i++;
                }
            }
        }
    };
    /*
     * Determine which node the object belongs to. -1 means
     * object cannot completely fit within a node and is part
     * of the current node
     */
    this.getIndex = function(obj) {
        var index = -1;
        var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
        var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
        // Object can fit completely within the top quadrant
        var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
        // Object can fit completely within the bottom quandrant
        var bottomQuadrant = (obj.y > horizontalMidpoint);
        // Object can fit completely within the left quadrants
        if (obj.x < verticalMidpoint &&
            obj.x + obj.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            }
            else if (bottomQuadrant) {
                index = 2;
            }
        }
        // Object can fix completely within the right quandrants
        else if (obj.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            }
            else if (bottomQuadrant) {
                index = 3;
            }
        }
        return index;
    };
    /*
     * Splits the node into 4 subnodes
     */
    this.split = function() {
        // Bitwise or [html5rocks]
        var subWidth = (this.bounds.width / 2) | 0;
        var subHeight = (this.bounds.height / 2) | 0;
        this.nodes[0] = new QuadTree({
             x: this.bounds.x + subWidth,
             y: this.bounds.y,
             width: subWidth,
             height: subHeight
         }, level+1);
        this.nodes[1] = new QuadTree({
             x: this.bounds.x,
             y: this.bounds.y,
             width: subWidth,
             height: subHeight
         }, level+1);
        this.nodes[2] = new QuadTree({
             x: this.bounds.x,
             y: this.bounds.y + subHeight,
             width: subWidth,
             height: subHeight
         }, level+1);
        this.nodes[3] = new QuadTree({
             x: this.bounds.x + subWidth,
             y: this.bounds.y + subHeight,
             width: subWidth,
             height: subHeight
         }, level+1);
    };
}



// dev: used for dev work, delete in finished game
var FPS = 0;
var Recording = false;
var RecordingsArray = [];

// animation function. This function handles object animation. It is called 60 times per second (optimally).
function animate(){
    AnimationVar = requestAnimFrame(animate);

    if (!GamePaused) {
        // dev: remove after game finished
        if (Recording)
            var startTime = Date.now();

        // check if any units are dead or destroyed. Deletes them if they are.
        game.DeathDetection();

        // if CurrentlySelected isn't null, draw it on hud.
        if (CurrentlySelected != null) {
            CurrentlySelected.Selected();
        }

        // clear quadtree
        game.QuadTree.clear();

        // insert objects into quadtree
        for (var i = 0, len = game.ObjectArray.length; i < len; i++) {
            // Working workers and building spots shouldn't be collision checked
            if (game.ObjectArray[i].Working != true && game.ObjectArray[i].Type != "Medium Building Spot")
                game.QuadTree.insert(game.ObjectArray[i]);
        }

        // Check if any objects collide
        if (game.FrameTimer % 2 == 0)
            game.CollisionDetection();

        // See if any enemy units/structures are in agression range
        if (game.FrameTimer % 6 == 0)
            game.TargetDetection();

        // clear all objects
        for (var i = 0, len = game.ObjectArray.length; i < len; i++) {
            game.ObjectArray[i].clear();
        }

        // calculates unit behaviour
        game.Animation();

        // draw all objects
        for (i = 0, len = game.ObjectArray.length; i < len; i++) {
            game.ObjectArray[i].draw();
        }

        // If changes have been made to resources, update canvas
        game.ResourceUpdate();

        // shows alerts on messagecanvas;
        if (game.Alertsystem != undefined) game.Alertsystem.show();

        // if there are time based functions that happen at some point
        game.ExtraAnimation();

        // dev: remove after game finished
        if (Recording)
            RecordingsArray.push(Date.now() - startTime);

        // Keeps track of ingame time, based on fps. Used for timebased functions.
        FPS++; // dev
        game.FrameTimer++;
    }
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
window.cancelRequestAnimFrame = ( function() {
    return window.cancelRequestAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )();

// Keyboard event listeners

// listens for special chars such as 'escape'.
window.addEventListener("keydown",function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;

    // If escape is clicked cancel CurrentlySelected building unit/structure
    if (charCode === 27) {
        evt.preventDefault();

        if (CurrentlySelected != game.Commandhud){
            if (CurrentlySelected.ProductionList.length != 0) {
                CurrentlySelected.clear();
                var CanceledObject = CurrentlySelected.ProductionList.pop();
                CurrentlySelected.draw();

                game.PlayerMinerals += CanceledObject.MineralCost;
                game.PlayerGas += CanceledObject.GasCost;

                if (CurrentlySelected.ProductionList.length === 0) {
                    if (CurrentlySelected.ProductionProgress != undefined) CurrentlySelected.ProductionProgress = 0;
                    if (CanceledObject.SupplyWeight != undefined && CurrentlySelected.ProducingUnitSupplyCounted === true) game.PlayerSupply -= CanceledObject.SupplyWeight;
                    if (CurrentlySelected.ProducingUnitSupplyCounted != undefined) CurrentlySelected.ProducingUnitSupplyCounted = false;
                }
            }
            else if (CurrentlySelected.IsSalvaging === true) {
                // cancel salvage
                CurrentlySelected.clear();
                CurrentlySelected.IsSalvaging = false;
                CurrentlySelected.draw();
                CurrentlySelected.SalvageCounter = 0;
            }
        }
    }
    // if tab is pressed switch to command hud.
    else if (charCode === 9) {
        evt.preventDefault();
        if (game.Commandhud != undefined) {
            if (CurrentlySelected === game.Commandhud) {
                PreviouslySelected.Selected();
            }
            else {
                game.Commandhud.Selected();
            }
        }
    }

},false);

// listens for chars and numbers
window.addEventListener("keypress",function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);

    // Checks if a buildings hotkey has been clicked on. selects building if so.
    for (var i = 0, len = game.StructureArray.length; i < len; i++) {
        if (game.StructureArray[i].HotKey != undefined && game.StructureArray[i].HotKey != null) {
            if (charStr.toUpperCase() === game.StructureArray[i].HotKey && CurrentlySelected != game.StructureArray[i]) {
                game.StructureArray[i].Selected();
                CurrentlySelected = game.StructureArray[i];
                return;
            }
        }
    }
    // Checks if a hudoptions hotkey of CurrentlySelected has been clicked on
    for (var j = 0,len2 = CurrentlySelected.HudOptionsArray.length; j < len2; j++) {
        if (charStr.toUpperCase() === CurrentlySelected.HudOptionsArray[j].HotKey) {
            CurrentlySelected.HudOptionsArray[j].Selected();
            return;
        }
    }
},false);

// prevents button presses such as tab from going to adress bar and such
window.addEventListener("keyup",function(evt) {
    evt = evt || window.event;

    evt.preventDefault();
},false);
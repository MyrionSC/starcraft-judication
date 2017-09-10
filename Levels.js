
var Levels = new function () {
    // Frontmenu background battle init
    this.initFrontMenu = function () {
        // removes the loading div
        document.body.innerHTML = "";

        // create canvas elements
        var bgCanvas = document.createElement("canvas");
        bgCanvas.id = "bgCanvas";
        bgCanvas.className = "MainCanvas";
        var structCanvas = document.createElement("canvas");
        structCanvas.id = "structCanvas";
        structCanvas.className = "MainCanvas";
        var unitCanvas = document.createElement("canvas");
        unitCanvas.id = "unitCanvas";
        unitCanvas.className = "MainCanvas";

        // creates front menu element
        var FrontMenu = document.createElement("div");
        FrontMenu.id = "FrontMenuDiv";

        // creates Frontmenu element children
        var LeftSideBar = document.createElement("div");
        LeftSideBar.id = "LeftSideBarDiv";
        var MainContent = document.createElement("div");
        MainContent.id = "MainContentDiv";

        // creates buttons and logo in left side bar, as well as button logic
        var MinimizeBtn = document.createElement("div");
        MinimizeBtn.id = "MinimizeBtn";
        MinimizeBtn.innerHTML = "_";
        MinimizeBtn.addEventListener("click",function() {
            MainContent.innerHTML = "";
            var doc = document.getElementById("LeftSideBarDiv");
            if (doc.style.width != "25px") {
                doc.style.width = "25px";
                doc.style.height = "25px";

                for (var i = 0; i < doc.childNodes.length; i++) {
                    doc.childNodes[i].style.visibility = "collapse";
                    doc.childNodes[i].style.background = "";
                }
            }
            else {
                doc.style.width = "240px";
                doc.style.height = "396px";

                for (var i = 0; i < doc.childNodes.length; i++) {
                    doc.childNodes[i].style.visibility = "visible";
                }
            }
        },false);
        MinimizeBtn.addEventListener("mouseover",function() {
            this.style.background = "rgb(0, 180, 0)";
        },false);
        MinimizeBtn.addEventListener("mouseout",function() {
            this.style.background = "#ffffff";
        },false);

        var Logo = document.createElement("img");
        Logo.src = "MenuLogo.png";
        Logo.id = "FrontMenuLogo";

        var CampaignBtn = document.createElement("button");
        CampaignBtn.innerHTML = "Campaign";
        CampaignBtn.className = "FrontMenuButton";
        CampaignBtn.addEventListener("click",function() {
            if (this.style.background == "") {
                // deletes all children in Maincontent
                MainContent.innerHTML = "";

                // if any other buttons are green, make them grey
                var buttons = document.getElementsByClassName("FrontMenuButton");
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].style.background == "rgb(0, 102, 0)") {
                        buttons[i].style.background = "";
                    }
                }

                // Make this button green
                this.style.background = "#006600";

                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);
            }
            else {
                this.style.background = "";
                MainContent.innerHTML = "";
            }
        },false);
        var SkirmishBtn = document.createElement("button");
        SkirmishBtn.innerHTML = "Skirmish";
        SkirmishBtn.className = "FrontMenuButton";
        SkirmishBtn.addEventListener("click",function() {
            if (this.style.background == "") {
                // deletes all children in Maincontent
                MainContent.innerHTML = "";

                // if any other buttons are green, make them grey
                var buttons = document.getElementsByClassName("FrontMenuButton");
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].style.background == "rgb(0, 102, 0)") {
                        buttons[i].style.background = "";
                    }
                }

                // Make this button green
                this.style.background = "#006600";

                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);
            }
            else {
                this.style.background = "";
                MainContent.innerHTML = "";
            }
        },false);
        var SurvivalBtn = document.createElement("button");
        SurvivalBtn.innerHTML = "Survival";
        SurvivalBtn.className = "FrontMenuButton";
        SurvivalBtn.addEventListener("click",function() {
            if (this.style.background == "") {
                // deletes all children in Maincontent
                MainContent.innerHTML = "";

                // if any other buttons are green, make them grey
                var buttons = document.getElementsByClassName("FrontMenuButton");
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].style.background == "rgb(0, 102, 0)") {
                        buttons[i].style.background = "";
                    }
                }

                // Make this button green
                this.style.background = "#006600";

                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);
            }
            else {
                this.style.background = "";
                MainContent.innerHTML = "";
            }
        },false);
        var OptionsBtn = document.createElement("button");
        OptionsBtn.innerHTML = "Options";
        OptionsBtn.className = "FrontMenuButton";
        OptionsBtn.addEventListener("click",function() {
            if (this.style.background == "") {
                // deletes all children in Maincontent
                MainContent.innerHTML = "";

                // if any other buttons are green, make them grey
                var buttons = document.getElementsByClassName("FrontMenuButton");
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].style.background == "rgb(0, 102, 0)") {
                        buttons[i].style.background = "";
                    }
                }

                // Make this button green
                this.style.background = "#006600";

                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);
            }
            else {
                this.style.background = "";
                MainContent.innerHTML = "";
            }
        },false);
        var CreditsBtn = document.createElement("button");
        CreditsBtn.innerHTML = "Credits";
        CreditsBtn.className = "FrontMenuButton";
        CreditsBtn.addEventListener("click",function() {
            if (this.style.background == "") {
                // deletes all children in Maincontent
                MainContent.innerHTML = "";

                // if any other buttons are green, make them grey
                var buttons = document.getElementsByClassName("FrontMenuButton");
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].style.background == "rgb(0, 102, 0)") {
                        buttons[i].style.background = "";
                    }
                }

                // Make this button green
                this.style.background = "#006600";

                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);
            }
            else {
                this.style.background = "";
                MainContent.innerHTML = "";
            }
        },false);



        // append canvas elements
        document.body.appendChild(bgCanvas);
        document.body.appendChild(structCanvas);
        document.body.appendChild(unitCanvas);

        // appends front menu elements to document
        LeftSideBar.appendChild(Logo);
        LeftSideBar.appendChild(CampaignBtn);
        LeftSideBar.appendChild(SkirmishBtn);
        LeftSideBar.appendChild(SurvivalBtn);
        LeftSideBar.appendChild(OptionsBtn);
        LeftSideBar.appendChild(CreditsBtn);
        FrontMenu.appendChild(LeftSideBar);
        FrontMenu.appendChild(MainContent);
        FrontMenu.appendChild(MinimizeBtn);
        document.body.appendChild(FrontMenu);

        // init background battle
        game = new Game();
        //if (game.initFrontMenu()) {
        //    game.start();
        //}

        game.bgCanvas = document.getElementById("bgCanvas");
        game.structCanvas = document.getElementById('structCanvas');
        game.unitCanvas = document.getElementById('unitCanvas');

        if (game.bgCanvas.getContext) { // checks if canvas is supported in the browser
            game.bgContext = this.bgCanvas.getContext("2d");
            game.structContext = this.structCanvas.getContext("2d");
            game.unitContext = this.unitCanvas.getContext("2d");

            game.bgCanvas.height = 600;
            game.bgCanvas.width = 960;
            game.bgCanvas.style.marginTop = 10;
            game.structCanvas.height = 600;
            game.structCanvas.width = 960;
            game.structCanvas.style.marginTop = 10;
            game.unitCanvas.height = 600;
            game.unitCanvas.width = 960;
            game.unitCanvas.style.marginTop = 10;

            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;

            // init background object.
            game.background = new Background(imgRepo.background, 64, 15, 30, 10,[
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
            game.background.pos(0,0);
            game.background.draw();

            game.TerranStrengthOnField = 0;
            game.MarinesSpawningRate = 0;
            game.MarineLastSpawned = 0;

            game.ZergStrengthOnField = 0;
            game.ZerglingsSpawnRate = 0;
            game.ZerglingLastSpawned = 0;

            var rine = new Marine("Terran",imgRepo.TerranMarineRed);
            UnitArray[UnitArray.length] = rine;
            ObjectArray[ObjectArray.length] = rine;
            rine.pos(Math.floor(Math.random() * 100) + 300, 600);

            var ling1 = new Zergling("Zerg",imgRepo.ZergZerglingPurple);
            UnitArray[UnitArray.length] = ling1;
            ObjectArray[ObjectArray.length] = ling1;
            ling1.pos(Math.floor(Math.random() * 100) + 300, -10);
            var ling2 = new Zergling("Zerg",imgRepo.ZergZerglingPurple);
            UnitArray[UnitArray.length] = ling2;
            ObjectArray[ObjectArray.length] = ling2;
            ling2.pos(Math.floor(Math.random() * 100) + 300, -10);

            // spawn amount of units based on army strength on field
            game.ExtraAnimation = function () {
                var ArmyDifference = 0;

                // finds strength of armies on field
                for (var i = 0, len = UnitArray.length; i < len; i++) {
                    // terran units
                    if (UnitArray[i].Type == "Marine")
                        game.TerranStrengthOnField += 1;

                    // zerg units
                    else if (UnitArray[i].Type == "Zergling") {
                        game.ZergStrengthOnField += 0.6;
                    }
                }

                // Determine if the strength of the armies are skewed
                if (game.TerranStrengthOnField < game.ZergStrengthOnField) {
                    ArmyDifference = game.ZergStrengthOnField / game.TerranStrengthOnField;

                    // Calculate Terran spawnrate
                    game.MarinesSpawningRate = 1 / Math.pow(ArmyDifference, 3);

                    // calculate zerg spawnrate
                    game.ZerglingsSpawnRate = 0.75 * Math.pow(ArmyDifference, 3);
                }
                else {
                    ArmyDifference = game.TerranStrengthOnField / game.ZergStrengthOnField;

                    // Normalize terran spawnrate
                    game.MarinesSpawningRate = 1 * Math.pow(ArmyDifference, 3);

                    // Calculate zerg spawnrate
                    game.ZerglingsSpawnRate = 0.75 / Math.pow(ArmyDifference, 3);
                }

                // Spawn units
                // Zerg
                if (game.ZerglingLastSpawned + Math.ceil(60 * game.ZerglingsSpawnRate) < FrameTimer) {
                    var NewZergling = new Zergling("Zerg",imgRepo.ZergZerglingPurple);
                    UnitArray[UnitArray.length] = NewZergling;
                    ObjectArray[ObjectArray.length] = NewZergling;
                    NewZergling.pos(Math.floor(Math.random() * 890), -10);

                    game.ZerglingLastSpawned = FrameTimer;
                }

                // Terran
                if (game.MarineLastSpawned + Math.ceil(60 * game.MarinesSpawningRate) < FrameTimer) {
                    var newMarine = new Marine("Terran",imgRepo.TerranMarineRed);
                    UnitArray[UnitArray.length] = newMarine;
                    ObjectArray[ObjectArray.length] = newMarine;
                    newMarine.pos(Math.floor(Math.random() * 890), 600);

                    game.MarineLastSpawned = FrameTimer;
                }




                // Writes number of killed units in left corner
                var KilledZerglings = 0, KilledMarines = 0;

                for (var i = 0, len = DeadUnitsArray.length; i < len; i++) {
                    if (DeadUnitsArray[i] == "Marine"){
                        KilledMarines += 1;
                    }
                    else if (DeadUnitsArray[i] == "Zergling") {
                        KilledZerglings += 1;
                    }
                }

                game.structContext.clearRect(880, 0, 80, 100);
                game.structContext.font = "10";
                game.structContext.fillStyle = "#ffffff";
                game.structContext.fillText("Army Strengs:", 880, 12);
                game.structContext.fillText("Terran: " + this.TerranStrengthOnField, 880, 24);
                game.structContext.fillText("Zerg: " + this.ZergStrengthOnField, 880, 36);
                game.structContext.fillText("Difference: " + ArmyDifference, 880, 48);
                game.structContext.fillText("Killed units:", 880, 64);
                game.structContext.fillText(KilledMarines + " Marines", 880, 76);
                game.structContext.fillText(KilledZerglings + " Zerglings", 880, 88);

                game.TerranStrengthOnField = 0;
                game.ZergStrengthOnField = 0;
            };

            return true;
        }
        else
            return false;
    }
};

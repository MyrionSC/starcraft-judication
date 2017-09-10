var FrontMenu = new function () {
    that = this; // for use in eventhandlers

    // layout

    // creates the front menu
    this.FrontMenuCreate = function () {
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
                doc.style.height = "455px";

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
            if (that.ButtonGrey(this, MainContent)) {
                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);
            }
        },false);
        CampaignBtn.addEventListener("mouseover",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "rgb(0, 180, 0)";

        },false);
        CampaignBtn.addEventListener("mouseout",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "#ffffff";
        },false);


        var SkirmishBtn = document.createElement("button");
        SkirmishBtn.innerHTML = "Skirmish";
        SkirmishBtn.className = "FrontMenuButton";
        SkirmishBtn.addEventListener("click",function() {
            if (that.ButtonGrey(this, MainContent)) {
                var Content = document.createElement("div");
                Content.className = "MainContentClass";
                MainContent.appendChild(Content);

                that.CreateSkirmishMenu(Content);
            }
        },false);
        SkirmishBtn.addEventListener("mouseover",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "rgb(0, 180, 0)";

        },false);
        SkirmishBtn.addEventListener("mouseout",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "#ffffff";
        },false);

        var SurvivalBtn = document.createElement("button");
        SurvivalBtn.innerHTML = "Survival";
        SurvivalBtn.className = "FrontMenuButton";
        SurvivalBtn.addEventListener("click",function() {
            if (that.ButtonGrey(this, MainContent)) {
                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);
            }
        },false);
        SurvivalBtn.addEventListener("mouseover",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "rgb(0, 180, 0)";

        },false);
        SurvivalBtn.addEventListener("mouseout",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "#ffffff";
        },false);

        var SandBoxBtn = document.createElement("button");
        SandBoxBtn.innerHTML = "SandBox";
        SandBoxBtn.className = "FrontMenuButton";
        SandBoxBtn.addEventListener("click",function() {
            if (that.ButtonGrey(this, MainContent)) {
                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);

                that.CreateSandBoxMenu(Content);
            }
        },false);
        SandBoxBtn.addEventListener("mouseover",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "rgb(0, 180, 0)";

        },false);
        SandBoxBtn.addEventListener("mouseout",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "#ffffff";
        },false);

        var OptionsBtn = document.createElement("button");
        OptionsBtn.innerHTML = "Options";
        OptionsBtn.className = "FrontMenuButton";
        OptionsBtn.addEventListener("click",function() {
            if (that.ButtonGrey(this, MainContent)) {
                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);
            }
        },false);
        OptionsBtn.addEventListener("mouseover",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "rgb(0, 180, 0)";

        },false);
        OptionsBtn.addEventListener("mouseout",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "#ffffff";
        },false);

        var CreditsBtn = document.createElement("button");
        CreditsBtn.innerHTML = "Credits";
        CreditsBtn.className = "FrontMenuButton";
        CreditsBtn.addEventListener("click",function() {
            if (that.ButtonGrey(this, MainContent)) {
                var Content = document.createElement("div");
                Content.className = "MainContentClass";

                MainContent.appendChild(Content);
            }
        },false);
        CreditsBtn.addEventListener("mouseover",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "rgb(0, 180, 0)";

        },false);
        CreditsBtn.addEventListener("mouseout",function() {
            if (this.style.background != "rgb(0, 102, 0)")
                this.style.background = "#ffffff";
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
        LeftSideBar.appendChild(SandBoxBtn);
        LeftSideBar.appendChild(OptionsBtn);
        LeftSideBar.appendChild(CreditsBtn);
        FrontMenu.appendChild(LeftSideBar);
        FrontMenu.appendChild(MainContent);
        FrontMenu.appendChild(MinimizeBtn);
        document.body.appendChild(FrontMenu);
    };

    // creates the skirmish menu
    this.CreateSkirmishMenu = function (MainContent) {
        // Paragraph for explanation
        var explanationPara = document.createElement("p");
        explanationPara.style.margin = "5px";
        explanationPara.style.marginBottom = "20px";
        explanationPara.style.color = "#ffffff";
        explanationPara.style.fontSize = "32px";
        explanationPara.style.textAlign = "center";
        explanationPara.innerHTML = "Assault a single zerg base";

        // divs for column set up
        var leftDiv = document.createElement("div");
        leftDiv.style.display = "inline-block";
        leftDiv.style.verticalAlign = "top";
        leftDiv.style.width = "170px";
        leftDiv.style.marginRight = "20px";
        var rightDiv = document.createElement("div");
        rightDiv.style.verticalAlign = "top";
        rightDiv.style.display = "inline-block";

        // skirmish buttons
        var easybutton = document.createElement("button");
        easybutton.className = "SkirmishButtons";
        easybutton.innerHTML = "EASY";
        easybutton.addEventListener("click",function() {
            that.CreateEasySkirmish();
        },false);
        easybutton.addEventListener("mouseover",function() {
            this.style.background = "rgb(0, 180, 0)";
        },false);
        easybutton.addEventListener("mouseout",function() {
            this.style.background = "#ffffff";
        },false);
        var mediumbutton = document.createElement("button");
        mediumbutton.className = "SkirmishButtons";
        mediumbutton.innerHTML = "MEDIUM";
        mediumbutton.addEventListener("click",function() {
            that.CreateMediumSkirmish();
        },false);
        mediumbutton.addEventListener("mouseover",function() {
            this.style.background = "rgb(0, 180, 0)";
        },false);
        mediumbutton.addEventListener("mouseout",function() {
            this.style.background = "#ffffff";
        },false);
        var hardbutton = document.createElement("button");
        hardbutton.className = "SkirmishButtons";
        hardbutton.innerHTML = "HARD";
        hardbutton.addEventListener("click",function() {
            that.CreateHardSkirmish();
        },false);
        hardbutton.addEventListener("mouseover",function() {
            this.style.background = "rgb(0, 180, 0)";
        },false);
        hardbutton.addEventListener("mouseout",function() {
            this.style.background = "#ffffff";
        },false);
        var insanebutton = document.createElement("button");
        insanebutton.className = "SkirmishButtons";
        insanebutton.innerHTML = "INSANE";
        insanebutton.addEventListener("click",function() {
            that.CreateInsaneSkirmish();
        },false);
        insanebutton.addEventListener("mouseover",function() {
            this.style.background = "rgb(0, 180, 0)";
        },false);
        insanebutton.addEventListener("mouseout",function() {
            this.style.background = "#ffffff";
        },false);

        // skirmish explanations // the extra divs are necessary to vertically center text
        var easyexpla = document.createElement("div");
        easyexpla.className = "SkirmishExplas";
        var easyexplap = document.createElement("p");
        easyexplap.innerHTML = "Low spawn and tech rate";
        easyexpla.appendChild(easyexplap);
        var mediumexpla = document.createElement("div");
        mediumexpla.className = "SkirmishExplas";
        var mediumexplap = document.createElement("p");
        mediumexplap.innerHTML = "medium spawn and tech rate";
        mediumexpla.appendChild(mediumexplap);
        var hardexpla = document.createElement("div");
        hardexpla.className = "SkirmishExplas";
        var hardexplap = document.createElement("p");
        hardexplap.innerHTML = "high spawn and tech rate";
        hardexpla.appendChild(hardexplap);
        var insaneexpla = document.createElement("div");
        insaneexpla.className = "SkirmishExplas";
        var insaneexplap = document.createElement("p");
        insaneexplap.innerHTML = "Surprise Motherfucker!";
        insaneexpla.appendChild(insaneexplap);

        // append divs to MainContent.
        leftDiv.appendChild(easybutton);
        leftDiv.appendChild(mediumbutton);
        leftDiv.appendChild(hardbutton);
        leftDiv.appendChild(insanebutton);
        rightDiv.appendChild(easyexpla);
        rightDiv.appendChild(mediumexpla);
        rightDiv.appendChild(hardexpla);
        rightDiv.appendChild(insaneexpla);
        MainContent.appendChild(explanationPara);
        MainContent.appendChild(leftDiv);
        MainContent.appendChild(rightDiv);



    };

    // creates sandbox menu
    this.CreateSandBoxMenu = function (MainContent) {
        var StartSandboxBtn = document.createElement("button");
        StartSandboxBtn.style.fontSize = "32px";
        StartSandboxBtn.style.textAlign = "center";
        StartSandboxBtn.innerHTML = "Start Sandbox";
        StartSandboxBtn.addEventListener("click", function () {
            that.CreateSandBox();
        }, false);

        MainContent.appendChild(StartSandboxBtn);
    };



    // create game functions

    // Creates elements for skirmish games
    this.CreateEasySkirmish = function () {
        alert("Not implemented");
    };
    this.CreateMediumSkirmish = function () {
        // Stops current game.
        this.ResetGame();

        document.body.innerHTML = "";
        this.CreateElementsForGame();

        // starts new game
        game = new Game();
        if (game.initMediumSkirmish()) {
            game.start();
        }
    };
    this.CreateHardSkirmish = function () {
        alert("Not implemented");
    };
    this.CreateInsaneSkirmish = function () {
        alert("Not implemented");
    };

    // create elements for sandbox
    this.CreateSandBox = function () {
        // Stops current game.
        this.ResetGame();

        document.body.innerHTML = "";
        this.CreateElementsForGame();
        this.CreateSandBoxObjectPickerElements();

        // starts new game
        game = new Game();
        if (game.initSandBox()) {
            game.start();
        }
    };




    // helper functions

    this.CreateElementsForGame = function () {
        // create top menu elements
        var topGameMenuBtn = document.createElement("Button");
        topGameMenuBtn.id = "topGameMenuBtn";
        topGameMenuBtn.innerHTML = "Menu";
        var topGameMenu = document.createElement("Div");
        topGameMenu.id = "topGameMenu";

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
        var messageCanvas = document.createElement("canvas");
        messageCanvas.id = "messageCanvas";
        var hudbgCanvas = document.createElement("canvas");
        hudbgCanvas.id = "hudbgCanvas";
        hudbgCanvas.className = "HudCanvas";
        var hudCanvas = document.createElement("canvas");
        hudCanvas.id = "hudCanvas";
        hudCanvas.className = "HudCanvas";

        // append them to body
        document.body.appendChild(topGameMenuBtn);
        document.body.appendChild(topGameMenu);
        document.body.appendChild(bgCanvas);
        document.body.appendChild(structCanvas);
        document.body.appendChild(unitCanvas);
        document.body.appendChild(messageCanvas);
        document.body.appendChild(hudbgCanvas);
        document.body.appendChild(hudCanvas);
    };

    this.CreateSandBoxObjectPickerElements = function () {
        // create super div
        var ObjectsPickerSuperDiv = document.createElement("Div");
        ObjectsPickerSuperDiv.id = "SandBoxPickerSuperDiv";

        // create elements in super div
        var UnitPickerBtn = document.createElement("Button");
        UnitPickerBtn.id = "UnitPickerBtn";
        UnitPickerBtn.className = "SandBoxPickerBtns";
        UnitPickerBtn.innerHTML = "Units";
        var UnitPickerDiv = document.createElement("Div");
        UnitPickerDiv.id = "UnitPickerDiv";
        UnitPickerDiv.className = "SandBoxPickerDivs";
        var StructurePickerBtn = document.createElement("Button");
        StructurePickerBtn.id = "StructurePickerBtn";
        StructurePickerBtn.className = "SandBoxPickerBtns";
        StructurePickerBtn.innerHTML = "Structures";
        var StructurePickerDiv = document.createElement("Div");
        StructurePickerDiv.id = "StructurePickerDiv";
        StructurePickerDiv.className = "SandBoxPickerDivs";
        var SandboxOptionsBtn = document.createElement("Button");
        SandboxOptionsBtn.id = "SandboxOptionsBtn";
        SandboxOptionsBtn.className = "SandBoxPickerBtns";
        SandboxOptionsBtn.innerHTML = "Options";
        var SandboxOptionsDiv = document.createElement("Div");
        SandboxOptionsDiv.id = "SandboxOptionsDiv";
        SandboxOptionsDiv.className = "SandBoxPickerDivs";

        ObjectsPickerSuperDiv.appendChild(UnitPickerBtn);
        ObjectsPickerSuperDiv.appendChild(UnitPickerDiv);
        ObjectsPickerSuperDiv.appendChild(StructurePickerBtn);
        ObjectsPickerSuperDiv.appendChild(StructurePickerDiv);
        ObjectsPickerSuperDiv.appendChild(SandboxOptionsBtn);
        ObjectsPickerSuperDiv.appendChild(SandboxOptionsDiv);

        document.body.appendChild(ObjectsPickerSuperDiv);
    };

    // used to stop and delete a game. Sets all GlobalVariables to standard.
    this.ResetGame = function () {
        document.body.style.height = "";
        game = null;
        window.cancelRequestAnimFrame(AnimationVar); // Holds the RequestAnimationFrame variable. Used to pause the game.
        AnimationVar = null;
        CurrentlySelected = null; // used to show selected unit on Hud;
        PreviouslySelected = null; // Used to switch back and forth between command hud and object hud

        // Command States. When CurrentlySelected === null, a command hud is shown on the hud.
        CommandState = "Attack Move"; // Holds the current unit movement orders. They are: Attack Move, Passive Move, Hold Position, Spread Out, Group Up.
        MoveDirection = "Up"; // Holds unit movement direction. They are: Up, Down, Left, Right.
    };

    // checks what color button is. If green, make grey, if grey and selected, make green. also clear MainContent.
    this.ButtonGrey = function (ele, maincontent) {
        if (ele.style.background != "rgb(0, 102, 0)") {
            // deletes all children in Maincontent
            maincontent.innerHTML = "";

            // if any other buttons are green, make them grey
            var buttons = document.getElementsByClassName("FrontMenuButton");
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].style.background == "rgb(0, 102, 0)") {
                    buttons[i].style.background = "";
                }
            }

            // Make this button green
            ele.style.background = "#006600";

            return true;
        }
        else {
            ele.style.background = "";
            maincontent.innerHTML = "";

            return false;
        }
    };
};
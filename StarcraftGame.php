<html xmlns="http://www.w3.org/1999/xhtml" lang="da">
<head>
    <title>Starcraft: Judication</title>
    <style>
        body {
            background: #111111;
        }

        #FrontMenuDiv {
            background: transparent;
            position: fixed;
            width: 960px;
            height: 600px;
            top: 10px;
            left: 50%;
            margin-left: -480px;
            z-index: 10;
        }
        #LeftSideBarDiv {
            float: left;
            width: 240px;
            text-align: center;
            margin: 10px;
            background: #000000;
            opacity: 0.8;
            border-radius: 10px;
        }
        #MinimizeBtn {
            position: absolute;
            top: 15px;
            left: 15px;
            opacity: 1;
            text-align: center;
            font-size: 10px;
            border-radius: 5px;
            border-width: 2px;
            border-color: white;
            background: white;
            width: 15px;
            height: 15px;
            z-index: 11;

            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        #MainContentDiv {
            float: left;
            width: 480px;
        }
        .MainContentClass {
            border-radius: 10px;
            background: #000000;
            width: 460px;
            margin: 10px;
            padding: 10px;
            opacity: 0.8;
        }
        #FrontMenuLogo {
            margin: 15px;
        }
        .FrontMenuButton {
            margin: 10px;
            font-size: 30px;
            width: 220px;
        }

        .SkirmishButtons {
            width: 150px;
            font-size: 30px;
            margin: 10px;
        }
        .SkirmishExplas {
            font-size: 18px;
            color: #ffffff;
            width: 250px;
            height: 60px;
            display: table;
        }
        .SkirmishExplas p {
            display: table-cell;
            vertical-align: middle;
        }

        #button1{
            position: fixed;
            top: 10px;
            left: 10px;
            width: 217px;
        }
        #button2{
            position: fixed;
            top: 10px;
            left: 80px;
        }
        #pausebtn{
            position: fixed;
            top: 40px;
            left: 10px;
        }
        #unpausebtn{
            position: fixed;
            top: 70px;
            left: 10px;
        }
        #infop {
            position: fixed;
            top: 150px;
            left: 10px;
            width: 200px;
            color: white;
        }
        #MouseCanvasPos{
            position: fixed;
            top: 0;
            right: 5px;
        }
        #p1 {
            position: fixed;
            top: 20px;
            right: 5px;
        }
        #FPS {
            position: fixed;
            top: 40px;
            right: 5px;
        }
        #StartGameButton {
            position: fixed;
            top: 250px;
            left: 10px;
        }



        #topGameMenuBtn{
            z-index: 10;
            position: fixed;
            top: 5px;
            left: 50%;
            margin-left: -475px;

            opacity: 0.3;
            text-align: center;
            font-size: 16px;
            border-radius: 2px;
            border-width: 2px;
            border-color: #000000;
            background: #ffffff;
        }
        #topGameMenu{
            z-index: 10;
            position: fixed;
            top: 40px;
            left: 50%;
            margin-left: -475px;

            opacity: 0.9;
            text-align: center;
            font-size: 10px;
            border-radius: 5px;
            border-width: 2px;
            border-color: #000000;
            background: #ffffff;
            visibility: collapse;
        }

        #SandBoxPickerSuperDiv {
            z-index: 10;
            position: fixed;
            top: 5px;
            left: 50%;
            margin-left: 365px;
            padding: 5px;
            padding-top: 0;


            text-align: center;
            font-size: 16px;
            background: rgba(255, 255, 255, 0.3);
        }
        .SandBoxPickerBtns {
            margin-top: 5px;
            width: 100px;
            text-align: center;
            font-size: 16px;
            border-width: 2px;
            border-color: #000000;
            background: #909090;
        }
        .SandBoxPickerDivs {
            width: 100px;
            background: #000000;
            display: -webkit-box;
        }
        .SandBoxPickerItems {
            width: 40px;
            height: 40px;
            padding: 3px 5px 3px 5px;
            background: #000000;
        }
        .SandBoxOptionItems {
            width: 90px;
            height: 25px;
            padding: 3px 5px 3px 5px;
            text-align: center;
            font-size: 16px;
        }


        #bgCanvas{
            z-index: 0;
        }
        #structCanvas{
            z-index: 1;
        }
        #unitCanvas{
            z-index: 2;
        }
        #hudbgCanvas{
            z-index: 4;
        }
        #hudCanvas{
            z-index: 5;
        }
        #messageCanvas{
            position: fixed;
            top: 0;
            left: 50%;
            margin-left: -480px;

            -moz-user-select: -moz-none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;

            z-index: 3;
        }
        .MainCanvas {
            position: absolute;
            top: 0;
            left: 50%;
            margin-left: -480px;

            -moz-user-select: -moz-none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        .HudCanvas {
            position: fixed;
            bottom: 0;
            left: 50%;
            margin-left: -480px;

            -moz-user-select: -moz-none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

    </style>
</head>

<body>

<div id="wrapper" style="width:100%; text-align:center">
    <img src="ZergLogoWhite.png" width="354" height="368.5" id="LoadIcon">
    <p id="LoadP" style="font-size: 40px; color: white">Loading...</p>
</div>


<!--<button id="button1">Create ling</button>
<button id="button2">Create Marine</button>
<button id="pausebtn">Pause game</button>
<button id="unpausebtn">Unpause game</button>
<button id="StartGameButton">Start game</button>
<p id="infop">Control information: <br> Use tab to switch between controlhud and last selected object</p>



<canvas width="960" height="1920" class="MainCanvas" id="bgCanvas">Canvas not supported in this browser. Please update it.</canvas>
<canvas width="960" height="1920" class="MainCanvas" id="structCanvas"></canvas>
<canvas width="960" height="1920" class="MainCanvas" id="unitCanvas"></canvas>
<canvas width="960" height="0" id='messageCanvas'></canvas> <!-- height set dynamically to height of user window - 200 --
<canvas width="960" height="200" class="HudCanvas" id="hudbgCanvas"></canvas>
<canvas width="960" height="200" class="HudCanvas" id="hudCanvas"></canvas>

<p id="MouseCanvasPos">ele</p>
<p id="p1">Time passed: 0 seconds</p>
<p id="FPS">FPS: 0</p> -->



<script type="text/javascript" src="FrontMenu.js"></script>
<script type="text/javascript" src="ImageRepository.js"></script>
<script type="text/javascript" src="Objects.js"></script>
</body>



</html>

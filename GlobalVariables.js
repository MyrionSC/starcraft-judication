var game = undefined;
var commandhud = undefined;
var alertsystem = undefined;

// Global Variables
var AnimationVar, // Holds the RequestAnimationFrame variable. Used to pause the game.
    ObjectArray = [], // Holds all objects in the game
    StructureArray = [], // Holds all structures in the game
    UnitArray = [], // Holds all units in the game
    DeadUnitsArray = [], // Holds all dead units
    DestroyedStructuresArray = [], // Holds all destroyed structures;
    MineralsArray = [], // Holds all mineable minerals
    CurrentlySelected = commandhud, // used to show selected unit on Hud;
    PreviouslySelected = commandhud, // Used to switch back and forth between command hud and object hud
    FrameTimer = 0; // Used to calculated all timebased events.

// Command States. When CurrentlySelected === null, a command hud is shown on the hud.
var CommandState = "Attack Move",// Holds the current unit movement orders. They are: Attack Move, Passive Move, Hold Position, Spread Out, Group Up.
    MoveDirection = "Up"; // Holds unit movement direction. They are: Up, Down, Left, Right.

// Player Resources // are initiated in the game.init function
var PlayerMinerals = 0,
    PlayerGas = 0,
    PlayerSupply = 0,
    PlayerMaxSupply = 0;

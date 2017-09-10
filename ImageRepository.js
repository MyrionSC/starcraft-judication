/**
 * This file contains all image files. Also contains startup logic for front menu
 */

// Image repository singleton. Every image only have to be loaded once this way.
var imgRepo = new function(){
    var ImagesLoaded = 0;
    var AllImages = 65;     // Very important that this is updated every time a new image is added. Fun will ensue if it is wrong.
    this.CheckIfImagesLoaded = function () {
        ImagesLoaded += 1;
        if(ImagesLoaded === AllImages) { // When all images are loaded, creates the front menu.
            FrontMenu.FrontMenuCreate();

            game = new Game();
            if (game.initFrontMenu()) {
                game.start();
            }
        }
    };

    // background
    this.background = new Image();
    this.background.onload = this.CheckIfImagesLoaded;

    //Frontmenu
    this.FrontMenuLogo = new Image();
    this.FrontMenuLogo.onload = this.CheckIfImagesLoaded;

    // Terran
    // Structures.
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
    this.TerranRefineryBlue = new Image();
    this.TerranRefineryBlue.onload = this.CheckIfImagesLoaded;
    this.TerranRefineryRed = new Image();
    this.TerranRefineryRed.onload = this.CheckIfImagesLoaded;
    this.TerranAutoTurretBaseBlue = new Image();
    this.TerranAutoTurretBaseBlue.onload = this.CheckIfImagesLoaded;
    this.TerranAutoTurretBaseRed = new Image();
    this.TerranAutoTurretBaseRed.onload = this.CheckIfImagesLoaded;
    this.TerranAutoTurretHeadBlue_BaseAnim = new Image();
    this.TerranAutoTurretHeadBlue_BaseAnim.onload = this.CheckIfImagesLoaded;
    this.TerranAutoTurretHeadRed_BaseAnim = new Image();
    this.TerranAutoTurretHeadRed_BaseAnim.onload = this.CheckIfImagesLoaded;
    this.TerranAutoTurretHeadBlue_Anim1 = new Image();
    this.TerranAutoTurretHeadBlue_Anim1.onload = this.CheckIfImagesLoaded;
    this.TerranAutoTurretHeadRed_Anim1 = new Image();
    this.TerranAutoTurretHeadRed_Anim1.onload = this.CheckIfImagesLoaded;
    // Units.
    this.TerranMarineBlue = new Image();
    this.TerranMarineBlue.onload = this.CheckIfImagesLoaded;
    this.TerranMarineBlueAttackStance = new Image();
    this.TerranMarineBlueAttackStance.onload = this.CheckIfImagesLoaded;
    this.TerranMarineRed = new Image();
    this.TerranMarineRed.onload = this.CheckIfImagesLoaded;
    this.TerranMarineRedAttackStance = new Image();
    this.TerranMarineRedAttackStance.onload = this.CheckIfImagesLoaded;
    this.TerranSCVBlue = new Image();
    this.TerranSCVBlue.onload = this.CheckIfImagesLoaded;
    this.TerranSCVRed = new Image();
    this.TerranSCVRed.onload = this.CheckIfImagesLoaded;
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
    this.RefineryIcon = new Image();
    this.RefineryIcon.onload = this.CheckIfImagesLoaded;
    this.AutoTurretIcon = new Image();
    this.AutoTurretIcon.onload = this.CheckIfImagesLoaded;
    // icons - Units
    this.MarineIcon = new Image();
    this.MarineIcon.onload = this.CheckIfImagesLoaded;
    this.SCVIcon = new Image();
    this.SCVIcon.onload = this.CheckIfImagesLoaded;
    // icons - Abilities
    this.SCVToGasIcon = new Image();
    this.SCVToGasIcon.onload = this.CheckIfImagesLoaded;
    this.SCVToMineralsIcon = new Image();
    this.SCVToMineralsIcon.onload = this.CheckIfImagesLoaded;
    this.CancelIcon = new Image();
    this.CancelIcon.onload = this.CheckIfImagesLoaded;
    this.SCVWorkIcon = new Image();
    this.SCVWorkIcon.onload = this.CheckIfImagesLoaded;
    this.PullSCVIcon = new Image();
    this.PullSCVIcon.onload = this.CheckIfImagesLoaded;
    this.SalvageIcon = new Image();
    this.SalvageIcon.onload = this.CheckIfImagesLoaded;
    this.DeleteIcon = new Image();
    this.DeleteIcon.onload = this.CheckIfImagesLoaded;

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
    this.ZergHydraliskGreen = new Image();
    this.ZergHydraliskGreen.onload = this.CheckIfImagesLoaded;
    this.ZergHydraliskPurple = new Image();
    this.ZergHydraliskPurple.onload = this.CheckIfImagesLoaded;
    this.HydraliskSpine = new Image();
    this.HydraliskSpine.onload = this.CheckIfImagesLoaded;
    this.ZergInfestedTerranPurple = new Image();
    this.ZergInfestedTerranPurple.onload = this.CheckIfImagesLoaded;
    this.ZergInfestedTerranPurple_AttackAnim = new Image();
    this.ZergInfestedTerranPurple_AttackAnim.onload = this.CheckIfImagesLoaded;
    this.ZergInfestedTerranGreen = new Image();
    this.ZergInfestedTerranGreen.onload = this.CheckIfImagesLoaded;
    this.ZergInfestedTerranGreen_AttackAnim = new Image();
    this.ZergInfestedTerranGreen_AttackAnim.onload = this.CheckIfImagesLoaded;

    // Icons
    this.ZerglingIcon = new Image();
    this.ZerglingIcon.onload = this.CheckIfImagesLoaded;
    this.HydraliskIcon = new Image();
    this.HydraliskIcon.onload = this.CheckIfImagesLoaded;
    this.InfestedTerranIcon = new Image();
    this.InfestedTerranIcon.onload = this.CheckIfImagesLoaded;

    // Other

    // Resources
    this.MineralsBlue = new Image();
    this.MineralsBlue.onload = this.CheckIfImagesLoaded;
    this.MineralsGold = new Image();
    this.MineralsGold.onload = this.CheckIfImagesLoaded;
    this.GasGeyserAnim1 = new Image();
    this.GasGeyserAnim1.onload = this.CheckIfImagesLoaded;
    this.GasGeyserAnim2 = new Image();
    this.GasGeyserAnim2.onload = this.CheckIfImagesLoaded;
    this.GasGeyserAnim3 = new Image();
    this.GasGeyserAnim3.onload = this.CheckIfImagesLoaded;

    // Icons
    this.BuildingSpotIcon = new Image();
    this.BuildingSpotIcon.onload = this.CheckIfImagesLoaded;
    this.MineralsIcon = new Image();
    this.MineralsIcon.onload = this.CheckIfImagesLoaded;
    this.GasIcon = new Image();
    this.GasIcon.onload = this.CheckIfImagesLoaded;
    this.BuildTimeIcon = new Image();
    this.BuildTimeIcon.onload = this.CheckIfImagesLoaded;



    // sources

    //FrontMenu
    this.FrontMenuLogo.src = "Images/MenuLogo.png";

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
    this.TerranRefineryBlue.src = "Images/Structures/Terran/TerranRefineryBlue.png";
    this.TerranRefineryRed.src = "Images/Structures/Terran/TerranRefineryRed.png";
    this.TerranAutoTurretBaseBlue.src = "Images/Structures/Terran/TerranAutoTurretBaseBlue.png";
    this.TerranAutoTurretBaseRed.src = "Images/Structures/Terran/TerranAutoTurretBaseRed.png";
    this.TerranAutoTurretHeadBlue_BaseAnim.src = "Images/Structures/Terran/TerranAutoTurretHeadBlue_BaseAnim.png";
    this.TerranAutoTurretHeadRed_BaseAnim.src = "Images/Structures/Terran/TerranAutoTurretHeadRed_BaseAnim.png";
    this.TerranAutoTurretHeadBlue_Anim1.src = "Images/Structures/Terran/TerranAutoTurretHeadBlue_Anim1.png";
    this.TerranAutoTurretHeadRed_Anim1.src = "Images/Structures/Terran/TerranAutoTurretHeadRed_Anim1.png";

    // Units
    this.TerranMarineBlue.src = "Images/Units/Terran/TerranMarineBlue2.png";
    this.TerranMarineBlueAttackStance.src = "Images/Units/Terran/TerranMarineBlue2AttackStance.png";
    this.TerranMarineRed.src = "Images/Units/Terran/TerranMarineRed2.png";
    this.TerranMarineRedAttackStance.src = "Images/Units/Terran/TerranMarineRed2AttackStance.png";
    this.TerranSCVBlue.src = "Images/Units/Terran/TerranSCVBlue.png";
    this.TerranSCVRed.src = "Images/Units/Terran/TerranSCVRed.png";
    // Icons
    // structures
    this.SupplyDepotIcon.src = "Images/Icons/Terran/Structures/supply-depot.gif";
    this.EngineeringBayIcon.src = "Images/Icons/Terran/Structures/engineering-bay.gif";
    this.FactoryIcon.src = "Images/Icons/Terran/Structures/factory.gif";
    this.CommandCenterIcon.src = "Images/Icons/Terran/Structures/command-center.gif";
    this.PointDefenseDroneIcon.src = "Images/Icons/Terran/Structures/point-defense-drone.gif";
    this.BarracksIcon.src = "Images/Icons/Terran/Structures/barracks.gif";
    this.RefineryIcon.src = "Images/Icons/Terran/Structures/refinery.gif";
    this.AutoTurretIcon.src = "Images/Icons/Terran/Structures/auto-turret.gif";
    // Units
    this.MarineIcon.src = "Images/Icons/Terran/Units/marine.gif";
    this.SCVIcon.src = "Images/Icons/Terran/Units/scv.gif";
    // Abilities
    this.SCVToGasIcon.src = "Images/Icons/Terran/Abilities/SCVToGasIcon.gif";
    this.SCVToMineralsIcon.src = "Images/Icons/Terran/Abilities/SCVToMineralsIcon.gif";
    this.SCVWorkIcon.src = "Images/Icons/Terran/Abilities/WorkIcon.gif";
    this.PullSCVIcon.src = "Images/Icons/Terran/Abilities/PullSCVIcon.gif";
    this.CancelIcon.src = "Images/Icons/Terran/Abilities/CancelIcon.png";
    this.SalvageIcon.src = "Images/Icons/Terran/Abilities/SalvageIcon.gif";
    this.DeleteIcon.src = "Images/Icons/Terran/Abilities/DeleteIcon.png";


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
    this.ZergHydraliskPurple.src = "Images/Units/Zerg/ZergHydraliskPurple.png";
    this.ZergHydraliskGreen.src = "Images/Units/Zerg/ZergHydraliskGreen.png";
    this.HydraliskSpine.src = "Images/Units/Zerg/HydraliskSpine.png";
    this.ZergInfestedTerranPurple.src = "Images/Units/Zerg/ZergInfestedTerranPurple.png";
    this.ZergInfestedTerranPurple_AttackAnim.src = "Images/Units/Zerg/ZergInfestedTerranPurple_AttackAnim.png";
    this.ZergInfestedTerranGreen.src = "Images/Units/Zerg/ZergInfestedTerranGreen.png";
    this.ZergInfestedTerranGreen_AttackAnim.src = "Images/Units/Zerg/ZergInfestedTerranGreen_AttackAnim.png";
    //Icons
    this.ZerglingIcon.src = "Images/Icons/Zerg/Units/zergling.gif";
    this.HydraliskIcon.src = "Images/Icons/Zerg/Units/hydralisk.gif";
    this.InfestedTerranIcon.src = "Images/Icons/Zerg/Units/infested_terran.gif";

    // Other
    // Resources
    this.MineralsBlue.src = "Images/Resources/MineralsBlue.png";
    this.MineralsGold.src = "Images/Resources/MineralsGold.png";
    this.GasGeyserAnim1.src = "Images/Resources/GasGeyser_anim1.png";
    this.GasGeyserAnim2.src = "Images/Resources/GasGeyser_anim2.png";
    this.GasGeyserAnim3.src = "Images/Resources/GasGeyser_anim3.png";

    // Icons
    this.BuildingSpotIcon.src = "Images/Icons/Terran/Structures/BuildingSpot.png";
    this.MineralsIcon.src = "Images/Icons/Neutral/MineralsIcon.png";
    this.GasIcon.src = "Images/Icons/Neutral/GasIcon.png";
    this.BuildTimeIcon.src = "Images/Icons/Neutral/BuildTimeIcon.gif";
};
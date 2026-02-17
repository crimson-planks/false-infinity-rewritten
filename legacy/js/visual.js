import { createApp } from 'vue'
import { AutobuyerComponent } from './vuecomp/Autobuyer.js';
const App = createApp({
    data() {
        appThis=this;
        return {
            currentTab: "autobuyer",
            currentSubTab: "matter",
            clickMatterGain: "",
            matter: "",
            deflation: "",
            deflationCost: "",
            deflationPower: "",
            clickDeflationPowerGain: "",
            potentialDeflators: "",
            deflator: "",
            translatedDeflationPower: "",
            translatedDeflationPowerMultiplier: "",
            canDeflate: false,
            changeDeflationTextCondition: false,
            requiredDeflationPowerOnDeflationSacrifice: "",
            isOverflow: false,
            overflowPoint: "",
            autobuyers: {
                matter: [
                    {
                        type: "matter",
                        ord: 0,
                        displayName: "Autoclicker",
                    },
                    {
                        type: "matter",
                        ord: 1,
                        displayName: "Autobuyer 1",
                    }
                ],
                deflation: [
                    {
                        type: "deflation",
                        ord: 0,
                        displayName: "Deflation Power Autoclicker",
                    }
                ]
            }
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(){
            this.UpdateScreen();
        },
        UpdateScreen() {
            this.matter = notations[game.notation].format(game.matter);
            this.clickMatterGain = notations[game.notation].format(GetClickMatterGain());
            this.deflation = notations[game.notation].format(game.deflation);
            this.deflationCost = notations[game.notation].format(getDeflationCost(1));
            this.deflationPower = notations[game.notation].format(game.deflationPower);
            this.clickDeflationPowerGain = notations[game.notation].format(GetClickDeflationPowerGain());
            this.potentialDeflators = notations[game.notation].format(getPotentialDeflatorsOnDeflation(1));
            this.requiredDeflationPowerOnDeflationSacrifice = notations[game.notation].format(getRequiredDeflationPowerOnDeflationSacrifice());
            this.deflator = notations[game.notation].format(game.deflator);
            this.translatedDeflationPower = notations[game.notation].format(GetTranslatedDeflationPower());
            this.translatedDeflationPowerMultiplier = notations[game.notation].format(Decimal.pow(2,game.deflation));
            this.canDeflate = canDeflate(1);
            this.changeDeflationTextCondition = game.deflation.add(1).gt(4);
            this.isOverflow = game.isOverflow;
            this.overflowPoint = notations[game.notation].format(game.overflowPoint);
            for(let type in game.autobuyers){
                for(let i=0; i < game.autobuyers[type].length; i++){
                    if(this.autobuyers[type][i]===undefined) this.autobuyers[type][i]={};
                    this.autobuyers[type][i].amount = notations[game.notation].format(game.autobuyers[type][i].amount);
                    this.autobuyers[type][i].cost = notations[game.notation].format(getAutobuyerCost(type,i));
                    this.autobuyers[type][i].interval = notations[game.notation].format(game.autobuyers[type][i].interval);
                    this.autobuyers[type][i].intervalCost = notations[game.notation].format(getAutobuyerIntervalCost(type,i));
                    this.autobuyers[type][i].isActive = game.autobuyers[type][i].isActive;
                    this.autobuyers[type][i].canBuy = canBuyAutobuyer(type,i,1);
                    this.autobuyers[type][i].canBuyInterval = canBuyInterval(type,i,1);
                }
            }
        },
        ChangeTab(tab) {
            this.currentTab = tab;
            this.UpdateScreen();
        },
        ChangeSubTab(subtab) {
            this.currentSubTab = subtab;
            this.UpdateScreen();
        },
        ClickButton() {
            game.matter = game.matter.add(GetClickMatterGain());
            this.UpdateScreen();
        },
        BuyAutobuyer(type, ord) {
            buyAutobuyer(type, ord, 1);
            this.UpdateScreen();
        },
        BuyInterval(type,ord) {
            buyInterval(type, ord, 1);
            this.UpdateScreen();
        },
        ToggleIsActive(type,ord) {
            ToggleIsActive(type,ord);
            this.UpdateScreen();
        },
        ClickDeflationButton(){
            deflate(1);
            this.UpdateScreen();
        },
        ClickDeflationPowerButton(){
            game.deflationPower = game.deflationPower.add(GetClickDeflationPowerGain());
            this.UpdateScreen();
        },
        ClickDeflationSacrificeButton(){
            deflationSacrifice();
            this.UpdateScreen();
        },
        overflow(){
            overflow();
        },
        save(){
            save(game);
        },
        load(){
            load();
        }
    }
});
init();
App.component('autobuyer',AutobuyerComponent);
App.mount('#app');
document.getElementById("app").setAttribute("style", "display: block;");
isReady=true;

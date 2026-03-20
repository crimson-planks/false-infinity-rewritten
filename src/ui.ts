/** @prettier */
import { formatValue, NotationIdEnum, type NotationId } from '@/notation';
import { type Ref } from '@vue/reactivity';
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { computed, ref, watch } from 'vue';
import {
  AutobuyerKindArr,
  AutobuyerKindObj,
  ClickMaxMatterAutobuyerInterval,
  getAutobuyerCostScaling,
  getAutobuyerInterval,
  getDeflationPowerAutobuyerIntervalDivideByDeflation,
  getIntervalCostScaling,
  isAutobuyerUnlocked,
  type AutobuyerLocation,
  type AutobuyerSaveData
} from './autobuyer';
import { autobuyerConstObj } from './autobuyer_const';
import { gameCache } from './cache';
import { addCurrency, CurrencyKindObj, CurrencyName, getCurrency } from './currency';
import {
  deflationSacrifice,
  getTranslatedDeflationPowerExponent,
  getTranslatedDeflationPowerMultiplier
} from './deflation_power';
import { allocateStar, convertMatter, get_matterDecay_dueTo_fusion, getEnergyEffect, getEnergyGainWhenFusing, pourMatter, ToggleFusion } from './fusion';
import { getMatterPerSecond, getPlayTime } from './game';
import { player } from './player';
import {
  BuyStar,
  canDeflate,
  deflationCostScaling,
  getDeflatorGainOnDeflation,
  getOverflowLimit,
  getStarCost,
  overflow,
  starCostScaling
} from './prestige';
import {
  getUpgradeCostScaling,
  upgradeConstObj,
  upgradeCurrency,
  UpgradeKindArr,
  UpgradeKindObj,
  type UpgradeKind
} from './upgrade';
import { buyExtendOverflow, getExtendOverflowCost, getOverflowPointMultiplierByExtension, getTotalOverflowExtension, IsExtendOverflowUnlocked, type extendOverflowCurrency } from './extend_overflow';
export interface AutobuyerVisualData {
  loc: AutobuyerLocation;
  visible: boolean;
  name: string;
  amount: string;
  timer: string;
  interval: string;
  toggle: string;
  cost: string;
  intervalCost: string;
  canBuy: boolean;
  canBuyInterval: boolean;
}
export function getDefaultAutobuyerVisualData(ad: AutobuyerLocation): AutobuyerVisualData {
  return {
    loc: { kind: ad.kind, ord: ad.ord },
    visible: true,
    name: autobuyerConstObj[ad.kind][ad.ord].name,
    amount: '',
    timer: '',
    interval: '',
    toggle: '',
    cost: '',
    intervalCost: '',
    canBuy: false,
    canBuyInterval: false,
  };
}
export interface UpgradeVisualData {
  kind: UpgradeKind;
  ord: number;
  amount: string;
  maxAmount: string;
  effectValue: string;
  boughtMax: boolean;
  isInfinitelyBuyable: boolean;
  cost: string;
  canBuy: boolean;
}
export const autobuyerOptions = {
  matterAutobuyer: [{ selectedOrd: [0, 1] }]
} as const;
export type TabName = 'autobuyer' | 'overflow' | 'option' | 'statistics';
export type SubtabName = 'matter' | 'deflation' | 'overflow' | 'upgrades' | 'fusion' | 'extend' | 'general';
export const notationGroups = [
  [NotationIdEnum.default],
  [NotationIdEnum.scientific],
  [NotationIdEnum.logarithm],
  [NotationIdEnum.standard, NotationIdEnum.mixedScientific],
  [NotationIdEnum.SI, NotationIdEnum.mixedSI],
  [NotationIdEnum.inequality, NotationIdEnum.binaryInequality]
] as const;
Object.freeze(notationGroups);
export const tabs: {
  [key in TabName]: {
    name: string;
    subtab: {
      [key: string]: {
        name: string;
      };
    };
  };
} = {
  autobuyer: {
    name: 'Autobuyer',
    subtab: {
      matter: {
        name: 'Matter'
      },
      deflation: {
        name: 'Deflation'
      },
      overflow: {
        name: 'Overflow'
      }
    }
  },
  overflow: {
    name: 'Overflow',
    subtab: {
      upgrades: {
        name: 'Upgrades'
      },
      fusion: {
        name: 'Fusion'
      },
      extend: {
        name: 'Extend'
      }
    }
  },
  option: {
    name: 'Option',
    subtab: {
      option: {
        name: 'Option'
      }
    }
  },
  statistics: {
    name: 'Statistics',
    subtab: {
      general: {
        name: 'General'
      }
    }
  }
};
export const texts = {
  'en-US': {
    tabs,
    notations: {
      default: 'Default',
      scientific: 'Scientific',
      logarithm: 'Logarithm',
      standard: 'Standard',
      mixedScientific: 'Mixed Scientific',
      inequality: 'Inequality',
      binaryInequality: 'Binary Inequality'
    },
    autobuyer: {
      optionName: {
        matterAutobuyer: ['Selected Matter Autobuyer Number']
      }
    },
    upgrades: {
      overflow: [
        {
          description: 'Increase the exponent of translated deflation power.'
        },
        {
          description: 'Deflations give more deflators.'
        },
        {
          description: 'Increase the effectiveness of buying an interval'
        },
        {
          description: 'Deflation power affects interval cost at a reduced rate'
        },
        {
          description:
            'Increase the exponent of deflations for deflation power autoclicker multiplier'
        },
        {
          description: 'Get more overflow points based on fastest overflow time'
        },
        {
          description: 'Deflation count multiplies overflow point gain'
        },
        {
          description: 'Start with matter'
        },
        {
          description: 'Unlock the 2nd matter autobuyer'
        }
      ],
      helium: [
        {
          description: 'Deflation no longer resets anything'
        },
        {
          description: 'Divide the interval of matter autobuyers'
        },
        {
          description: 'Power Overflow upgrade 6'
        }
      ]
    }
  }
};

export const ui = ref({
  currentTab: 'autobuyer' as TabName,
  tabs: {
    autobuyer: {
      visible: true
    },
    overflow: {
      visible: false
    },
    option: {
      visible: true
    },
    statistics: {
      visible: true
    }
  },
  subtabs: {
    autobuyer: {
      currentSubtab: 'matter' as SubtabName,
      matter: {
        visible: true
      },
      deflation: {
        visible: false
      },
      overflow: {
        visible: false
      }
    },
    overflow: {
      currentSubtab: 'upgrades' as SubtabName,
      upgrades: {
        visible: true
      },
      fusion: {
        visible: true
      },
      extend: {
        visible: false
      }
    },
    option: {
      currentSubtab: 'option' as SubtabName,
      option: {
        visible: true
      }
    },
    statistics: {
      currentSubtab: 'general' as SubtabName,
      general: {
        visible: true
      }
    }
  },
  notationSelectWindowVisible: false,
  creditsVisible: false,
  notationId: <NotationId>NotationIdEnum.default,
  playTime: '',
  matter: '',
  totalMatter: '',
  matterPerSecond: '',
  deflationCost: '',
  autobuyers: {
    matter: Array(autobuyerConstObj.matter.length)
      .fill(0)
      .map((v, i) => getDefaultAutobuyerVisualData({kind: AutobuyerKindObj.Matter, ord: i})),
    deflationPower: Array(autobuyerConstObj.deflationPower.length)
      .fill(0)
      .map((v, i) => getDefaultAutobuyerVisualData({kind: AutobuyerKindObj.DeflationPower, ord: i})),
    matterAutobuyer: Array(autobuyerConstObj.matterAutobuyer.length)
      .fill(0)
      .map((v, i) => getDefaultAutobuyerVisualData({kind: AutobuyerKindObj.MatterAutobuyer, ord: i}))
  },
  upgrades: {
    overflow: Array(upgradeConstObj.overflow.length)
      .fill(0)
      .map((v, i) => {
        return {
          kind: UpgradeKindObj.Overflow,
          ord: i,
          amount: '',
          maxAmount: '',
          effectValue: '',
          boughtMax: false,
          isInfinitelyBuyable: false,
          cost: '',
          canBuy: false
        };
      }),
      helium: Array(upgradeConstObj.helium.length)
      .fill(0)
      .map((v, i) => {
        return {
          kind: UpgradeKindObj.helium,
          ord: i,
          amount: '',
          maxAmount: '',
          effectValue: '',
          boughtMax: false,
          isInfinitelyBuyable: false,
          cost: '',
          canBuy: false
        };
      }),
  },
  htmlAttributes: {
    overflowExtensionRange_max: 1,
  },
  deflation: '',
  canDeflate: false,
  hasDeflated: false,
  deflatorGainOnDeflation: '',
  canDeflationSacrifice: false,
  matterAutobuyerCostScalingReductionByDeflation: '',
  deflationPower: '',
  translatedDeflationPower: '',
  translatedDeflationPowerExponent: '',
  translatedDeflationPowerMultiplier: '',
  translatedDeflationPowerMultiplierWhenSacrifice: '',
  previousSacrificeDeflationPower: '',
  translatedDeflationPowerMultiplierBySacrificedDeflationPower: '',
  deflator: '',
  deflationPowerAutobuyerIntervalDivideByDeflation: '',
  overflow: '',
  isOverflowing: false,
  overflowPoint: '',
  fusionMatterPoured: '',
  fusionMatterPouredPercentage: '',
  fusionUnlocked: false,
  isFusing: false,
  matterDecay_dueTo_fusion: '',
  star: '',
  starCost: '',
  canBuyStar: false,
  allocatedStar: '',
  helium: '',
  energy: '',
  energyEffect: '',
  energyGainWhenFusing: '',
  overflowLimit: '',
  overflowPointMultiplierByExtension: '',
  extendOverflowTotalAmount: '',
  extendOverflowLevel: '',
  extendOverflow: {
    matter: {
      cost: '',
      canBuy: false
    },
    deflationPower: {
      cost: '',
      canBuy: false
    },
    overflowPoint: {
      cost: '',
      canBuy: false
    }
  },
  statistics: {
    timeOnDeflation: '',
    overflow: {
      timeOn: '',
      visible: false
    }
  }
});
export type uiType = typeof ui;
export const input: Ref<{
  maxAutobuyerIntervalHeld: boolean;
  MPressed: boolean;
  fusionUnlockPourMatter: string;
  starAllocateAmount: string;
  OverflowExtensionLevel: number;
  autobuyerOption: {
    matterAutobuyer: [{ selectedOrd: number }];
  };
}> = ref({
  maxAutobuyerIntervalHeld: false,
  MPressed: false,
  fusionUnlockPourMatter: '',
  OverflowExtensionLevel: 0,
  starAllocateAmount: '',
  autobuyerOption: {
    matterAutobuyer: [{ selectedOrd: 0 }]
  }
});
/**Get the max attribute of range input element 'overflow-extension-range' */
function getOverflowExtensionRange_max(){
  const toe = getTotalOverflowExtension();
  if(toe.lt(Decimal.dNumberMax)) return toe.toNumber();
  else return Number.MAX_VALUE
}
/**Get the number that must be multiplied to the value of range input element 'overflow-extension-range' to get the corresponding extension level.*/
function getOverflowExtensionRange_scale(){
  const toe = getTotalOverflowExtension();
  if(toe.lt(Decimal.dNumberMax)) return new Decimal(Decimal.dOne);
  else return Decimal.dNumberMax.div(toe);
}
export const sanitizedInput = {
  fusionUnlockPourMatter: computed(() => {
    return sanitizeStringDecimal(input.value.fusionUnlockPourMatter).max(0).floor();
  }),
  starAllocateAmount: computed(() => {
    return sanitizeStringDecimal(input.value.starAllocateAmount).max(0).floor();
  }),
};
export function sanitizeStringDecimal(s: string) {
  let d = new Decimal(s);
  if (d.isNan() || !d.isFinite()) return new Decimal(Decimal.dZero);
  else return d;
}
const updateCurrentOverflowExtensionLevel = () => {
  player.extendOverflow.currentLevel = getOverflowExtensionRange_scale().mul(input.value.OverflowExtensionLevel);
}
//TODO: since <input type="range"> does not work on input >= Number.MAX_VALUE, if max extension level exceeds that, set max to Number.MAX_VALUE and adjust input value accordingly.
//TODO 2: also update when the return value of getTotalOverflowExtension changes.
watch(
  () => input.value.OverflowExtensionLevel,
  () => {
    updateCurrentOverflowExtensionLevel();
  }
)
watch(
  () => input.value.autobuyerOption.matterAutobuyer[0].selectedOrd,
  () => {
    if (player.autobuyers.matterAutobuyer[0].option === undefined)
      player.autobuyers.matterAutobuyer[0].option = {
        selectedOrd: input.value.autobuyerOption.matterAutobuyer[0].selectedOrd
      };
    else
      player.autobuyers.matterAutobuyer[0].option.selectedOrd =
        input.value.autobuyerOption.matterAutobuyer[0].selectedOrd;
  }
);
export function getBuyableClassBinding(canBuy: boolean) {
  return { 'button--can-buy': canBuy, 'button--cannot-buy': !canBuy };
}
export function FormatTime(timeSeconds: DecimalSource){

}
export function updateScreenInit() {
  for (const uk of UpgradeKindArr) {
    for (let i = 0; i < player.upgrades[uk].length; i++) {
      ui.value.upgrades[uk][i].isInfinitelyBuyable = !upgradeConstObj[uk][i].maxAmount.isFinite();
    }
  }
}
export function updateScreen() {
  //window.performance.mark('updateScreen start')

  ui.value.totalMatter = formatValue(player.totalMatter, player.notationId);
  ui.value.playTime = getPlayTime().toString();
  ui.value.notationId = player.notationId;

  ui.value.matter = formatValue(player.matter, player.notationId);
  ui.value.matterPerSecond = formatValue(getMatterPerSecond(), player.notationId);
  ui.value.deflationCost = formatValue(
    deflationCostScaling.getCurrentCost(player.deflation),
    player.notationId
  );
  ui.value.canDeflate = canDeflate();
  ui.value.hasDeflated = gameCache.hasDeflated.cachedValue;
  ui.value.deflatorGainOnDeflation = formatValue(getDeflatorGainOnDeflation(), player.notationId);
  ui.value.canDeflationSacrifice = gameCache.canDeflationSacrifice.cachedValue;
  ui.value.matterAutobuyerCostScalingReductionByDeflation = formatValue(
    gameCache.matterAutobuyerCostScalingReductionByDeflation.cachedValue,
    player.notationId
  );
  ui.value.deflation = formatValue(player.deflation, player.notationId);

  ui.value.deflationPower = formatValue(player.deflationPower, player.notationId);
  ui.value.translatedDeflationPower = formatValue(
    gameCache.translatedDeflationPower.cachedValue,
    player.notationId
  );
  ui.value.translatedDeflationPowerExponent = formatValue(
    getTranslatedDeflationPowerExponent(),
    player.notationId
  );
  ui.value.translatedDeflationPowerMultiplier = formatValue(
    getTranslatedDeflationPowerMultiplier(),
    player.notationId
  );
  ui.value.previousSacrificeDeflationPower = formatValue(
    player.previousSacrificeDeflationPower,
    player.notationId
  );
  ui.value.translatedDeflationPowerMultiplierWhenSacrifice = formatValue(
    gameCache.translatedDeflationPowerMultiplierWhenSacrifice.cachedValue,
    player.notationId
  );
  ui.value.translatedDeflationPowerMultiplierBySacrificedDeflationPower = formatValue(
    gameCache.translatedDeflationPowerMultiplierBySacrificedDeflationPower.cachedValue,
    player.notationId
  );
  ui.value.deflator = formatValue(player.deflator, player.notationId);
  ui.value.deflationPowerAutobuyerIntervalDivideByDeflation = formatValue(getDeflationPowerAutobuyerIntervalDivideByDeflation(), player.notationId);
  ui.value.isOverflowing = player.isOverflowing;
  ui.value.overflow = formatValue(player.overflow, player.notationId);
  ui.value.overflowPoint = formatValue(player.overflowPoint, player.notationId);
  ui.value.fusionMatterPoured = formatValue(player.fusion.matterPoured, player.notationId);
  ui.value.fusionMatterPouredPercentage = formatValue(
    player.fusion.matterPoured.div(1e10).mul(100),
    player.notationId
  );
  ui.value.fusionUnlocked = player.fusion.unlocked;
  ui.value.isFusing = player.fusion.isFusing;
  ui.value.matterDecay_dueTo_fusion = formatValue(get_matterDecay_dueTo_fusion(player.matter), player.notationId);
  ui.value.star = formatValue(player.fusion.star, player.notationId);
  ui.value.starCost = formatValue(getStarCost(), player.notationId) + ' ' + CurrencyName['matter'];
  ui.value.canBuyStar = starCostScaling.canBuy(
    player.fusion.star,
    Decimal.dOne,
    getCurrency('matter')
  );
  ui.value.allocatedStar = formatValue(player.fusion.allocatedStar, player.notationId);
  ui.value.helium =
    formatValue(player.fusion.helium, player.notationId) +
    ' ' +
    CurrencyName[CurrencyKindObj.helium];
  ui.value.energy =
    formatValue(player.fusion.energy, player.notationId) +
    ' ' +
    CurrencyName[CurrencyKindObj.energy];
  ui.value.energyEffect = formatValue(getEnergyEffect(), player.notationId);
  ui.value.energyGainWhenFusing = formatValue(getEnergyGainWhenFusing(), player.notationId);
  ui.value.htmlAttributes.overflowExtensionRange_max = getOverflowExtensionRange_max();
  ui.value.overflowLimit = formatValue(getOverflowLimit(), player.notationId);
  ui.value.overflowPointMultiplierByExtension = formatValue(getOverflowPointMultiplierByExtension(), player.notationId);
  ui.value.extendOverflowTotalAmount = formatValue(getTotalOverflowExtension(),player.notationId);
  ui.value.extendOverflowLevel = formatValue(player.extendOverflow.currentLevel, player.notationId);
  ui.value.extendOverflow.matter.cost = formatValue(getExtendOverflowCost('matter'), player.notationId);
  ui.value.extendOverflow.matter.canBuy = getExtendOverflowCost('matter').lte(player.matter);
  ui.value.extendOverflow.deflationPower.cost = formatValue(getExtendOverflowCost('deflationPower'), player.notationId);
  ui.value.extendOverflow.deflationPower.canBuy = getExtendOverflowCost('deflationPower').lte(player.deflationPower);
  ui.value.extendOverflow.overflowPoint.cost = formatValue(getExtendOverflowCost('overflowPoint'), player.notationId);
  ui.value.extendOverflow.overflowPoint.canBuy = getExtendOverflowCost('overflowPoint').lte(player.overflowPoint);
  ui.value.tabs.overflow.visible = gameCache.hasOverflowed.cachedValue;
  ui.value.subtabs.autobuyer.matter.visible = true;
  ui.value.subtabs.autobuyer.deflation.visible = gameCache.hasDeflated.cachedValue;
  ui.value.subtabs.autobuyer.overflow.visible = gameCache.hasOverflowed.cachedValue;

  ui.value.subtabs.overflow.extend.visible = IsExtendOverflowUnlocked();

  ui.value.statistics.timeOnDeflation = String(player.currentTime - player.lastDeflationTime);
  ui.value.statistics.overflow.timeOn = String(player.currentTime - player.lastOverflowTime);

  ui.value.statistics.overflow.visible = player.overflow.gt(0);
  //window.performance.mark("autobuyer loop start")
  ui.value.autobuyers.matter[0].visible = true;
  ui.value.autobuyers.matter[1].visible = true;
  ui.value.autobuyers.matter[2].visible =
    gameCache.upgradeEffectValue.overflow?.[8]?.cachedValue?.gt(0) ?? false;
  for (const ak of AutobuyerKindArr) {
    for (let i = 0; i < player.autobuyers[ak].length; i++) {
      ui.value.autobuyers[ak][i].loc.kind = player.autobuyers[ak][i].kind;
      ui.value.autobuyers[ak][i].loc.ord = player.autobuyers[ak][i].ord;
      ui.value.autobuyers[ak][i].visible = isAutobuyerUnlocked(ui.value.autobuyers[ak][i].loc) ?? false;
      ui.value.autobuyers[ak][i].amount = formatValue(
        player.autobuyers[ak][i].amount,
        player.notationId
      );
      ui.value.autobuyers[ak][i].timer = formatValue(
        player.autobuyers[ak][i].timer,
        player.notationId
      );
      ui.value.autobuyers[ak][i].interval = formatValue(
        getAutobuyerInterval({ kind: ak, ord: i }),
        player.notationId
      );
      ui.value.autobuyers[ak][i].toggle = player.autobuyers[ak][i].toggle ? 'On' : 'Off';
      ui.value.autobuyers[ak][i].cost =
        formatValue(
          getAutobuyerCostScaling({ kind: ak, ord: i }).getCurrentCost(
            player.autobuyers[ak][i].amount
          ),
          player.notationId
        ) +
        ' ' +
        CurrencyName[autobuyerConstObj[ak][i].currency];
      ui.value.autobuyers[ak][i].intervalCost =
        formatValue(
          getIntervalCostScaling({ kind: ak, ord: i }).getCurrentCost(
            player.autobuyers[ak][i].intervalAmount
          ),
          player.notationId
        ) +
        ' ' +
        CurrencyName[autobuyerConstObj[ak][i].intervalCurrency];
      ui.value.autobuyers[ak][i].canBuy = getAutobuyerCostScaling({ kind: ak, ord: i }).canBuy(
        player.autobuyers[ak][i].amount,
        Decimal.dOne,
        getCurrency(autobuyerConstObj[ak][i].currency)
      );
      ui.value.autobuyers[ak][i].canBuyInterval = getIntervalCostScaling({
        kind: ak,
        ord: i
      }).canBuy(
        player.autobuyers[ak][i].intervalAmount,
        Decimal.dOne,
        getCurrency(autobuyerConstObj[ak][i].intervalCurrency)
      );
    }
  }
  //window.performance.mark("autobuyer loop end")
  //window.performance.mark("upgrade loop start")
  for (const uk of UpgradeKindArr) {
    for (let i = 0; i < player.upgrades[uk].length; i++) {
      ui.value.upgrades[uk][i].kind = player.upgrades[uk][i].kind;
      ui.value.upgrades[uk][i].ord = player.upgrades[uk][i].ord;
      ui.value.upgrades[uk][i].amount = formatValue(
        player.upgrades[uk][i].amount,
        player.notationId
      );
      ui.value.upgrades[uk][i].boughtMax = player.upgrades[uk][i].amount.gte(
        upgradeConstObj[uk][i].maxAmount
      );
      ui.value.upgrades[uk][i].cost =
        formatValue(
          getUpgradeCostScaling(uk, i).getCurrentCost(player.upgrades[uk][i].amount),
          player.notationId
        ) +
        ' ' +
        CurrencyName[upgradeCurrency[uk][i]];
      ui.value.upgrades[uk][i].canBuy =
        !ui.value.upgrades[uk][i].boughtMax &&
        getUpgradeCostScaling(uk, i).canBuy(
          player.upgrades[uk][i].amount,
          Decimal.dOne,
          getCurrency(upgradeCurrency[uk][i])
        );
      ui.value.upgrades[uk][i].maxAmount = formatValue(
        upgradeConstObj[uk][i].maxAmount,
        player.notationId
      );
      ui.value.upgrades[uk][i].effectValue = formatValue(
        gameCache.upgradeEffectValue[uk][i].cachedValue,
        player.notationId
      );
    }
  }
  //window.performance.mark("upgrade loop end");
}
export function ClickFusionPourMatterButton() {
  if (player.isOverflowing) return;
  pourMatter(sanitizedInput.fusionUnlockPourMatter.value);
}
export const inputFunctions = {
  ClickMatterButton() {
    addCurrency(CurrencyKindObj.matter, Decimal.dOne);
  },
  ClickMaxMatterAutobuyerInterval,
  ClickDeflationPowerButton() {
    addCurrency(CurrencyKindObj.deflationPower, Decimal.dOne);
  },
  ClickDeflationSacrificeButton() {
    deflationSacrifice();
  },
  ClickOverflowButton() {
    overflow();
  },
  BuyStar() {
    BuyStar();
  },
  AllocateStar(d: Decimal) {
    allocateStar(d);
  },
  ClickToggleFusionButton() {
    ToggleFusion();
  },
  ClickConvertMatterButton() {
    convertMatter(Decimal.dOne);
  },
  BuyExtendOverflow(currency: extendOverflowCurrency) {
    buyExtendOverflow(currency);
    updateCurrentOverflowExtensionLevel();
  },
  ChangeTab(tab: TabName) {
    ui.value.notationSelectWindowVisible = false;
    ui.value.creditsVisible = false;
    ui.value.currentTab = tab;
  },
  ChangeSubtab(subtab: SubtabName) {
    ui.value.subtabs[ui.value.currentTab].currentSubtab = subtab;
  },
  ToggleNotationSelectWindow() {
    ui.value.notationSelectWindowVisible = !ui.value.notationSelectWindowVisible;
  },
  ChangeNotation(notation: NotationId) {
    player.notationId = notation;
    ui.value.notationId = notation;
  }
};

export function initInput() {
  input.value.autobuyerOption.matterAutobuyer[0].selectedOrd = Number(
    player.autobuyers.matterAutobuyer[0].option?.selectedOrd
  );
  input.value.OverflowExtensionLevel = player.extendOverflow.currentLevel.div(getOverflowExtensionRange_scale()).floor().toNumber();
}

export function displayError(error: string) {
  let errorElement = document.getElementById('game-error');
  if (errorElement == null) {
    return;
  }
  errorElement.setAttribute('style', '');

  let errorDescriptionElement = document.getElementById('error-description');
  if (errorDescriptionElement == null) return;
  const newElement = document.createTextNode(error);
  const lineBreakElement = document.createElement('br');
  errorDescriptionElement.appendChild(newElement);
  errorDescriptionElement.appendChild(lineBreakElement);
}

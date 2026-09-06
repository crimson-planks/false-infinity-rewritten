/** @prettier */
import { formatValue, NotationIdEnum, type NotationId } from '@/notation';
import { type Ref } from '@vue/reactivity';
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { computed, ref, watch } from 'vue';
import {
  AutobuyerKindArr,
  AutobuyerKindObj,
  buyOverflowAutobuyer,
  ClickMaxMatterAutobuyerInterval,
  getAutobuyerCostScaling,
  getAutobuyerInterval,
  getDeflationPowerAutobuyerIntervalDivideByDeflation,
  getDeflationPowerAutobuyerIntervalDivideExponentByDeflation,
  getIntervalCostScaling,
  getIntervalMultiplierByBying,
  isAutobuyerUnlocked,
  overflowAutobuyerCostScaling,
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
import { allocateStar, convertMatter, get_matterDecay_dueTo_fusion, getEnergyEffect, getEnergyGainWhenFusing, getHeliumPerSecond, pourMatter, ToggleFusion } from './fusion';
import { getEstimatedOverflowTime, getMatterPerSecond, getPlayTime } from './game';
import { player } from './player';
import {
  BuyStar,
  canDeflate,
  canMoleReset,
  getDeflationCostScaling,
  getDeflatorGainOnDeflation,
  getMoleCost,
  getOverflowLimit,
  getOverflowPointGain,
  getStarCost,
  hasOverflowed,
  isMoleUnlocked,
  moleReset,
  overflowReset,
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
import { challengeArr, challengeConstObj, enterOverflowChallenge, exitOverflowChallenge, isInChallenge, type ChallengeType, type OverflowChallenge } from './challenge';
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
export interface ChallengeVisualData {
  kind: ChallengeType;
  id: OverflowChallenge;
}
export const autobuyerOptions = {
  matterAutobuyer: [{ selectedOrd: [0, 1] }]
} as const;
export type TabName = 'autobuyer' | 'overflow' | 'challenge' | 'option' | 'statistics';
export type SubtabName = 'matter' | 'deflation' | 'overflow' | 'upgrades' | 'fusion' | 'extend'| 'general';
export const notationGroups = [
  [NotationIdEnum.default, NotationIdEnum.defaultString],
  [NotationIdEnum.scientific],
  [NotationIdEnum.logarithm],
  [NotationIdEnum.standard, NotationIdEnum.mixedScientific],
  [NotationIdEnum.SI, NotationIdEnum.mixedSI],
  [NotationIdEnum.lexicographic],
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
  challenge: {
    name: 'Challenge',
    subtab: {
      overflow: {
        name: 'Overflow'
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
    overflowAutobuyer: {
      names: ['Matter Autobuyer^2','Auto Deflator','Auto Maxer','Deflation Power Autobuyer^2','Auto Overflower','Auto Mole Reset']
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
          description: 'Divide the interval of the matter autoclicker based on deflation count.'
        },
        {
          description: 'Deflation power affects interval cost at a reduced rate'
        },
        {
          description:
            'Overflow points divides autoclicker interval'
        },
        {
          description: 'Get more overflow points based on fastest overflow time'
        },
        {
          description: 'Multiply overflow point gain from all sources'
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
          description: 'Deflation power boosts helium gain at a reduced rate'
        },
        {
          description: 'Reduce deflation cost scaling'
        },
        {
          description: 'Helium boosts energy gain at a reduced rate'
        },
      ]
    },
    challenges: {
      overflow: {
        oc1: {
          modifier: 'Multiplier for Translated Deflation Power is set to 0, unaffected by all modifiers.',
          reward: 'Increase the exponent of deflations for deflation power autoclicker multiplier by 1 per overflow challenge completion.'
        },
        oc2: {
          modifier: 'When buying an interval of matter autobuyers or autoclicker, the interval cost of other matter autobuyers or autoclicker bumps up to the next cost.',
          reward: 'Deflation resets nothing.'
        },
        oc3: {
          modifier: 'Exponentially increasing inflation power increases the cost of matter autobuyers based on the amount of autoclickers and amount of deflations, which resets on deflations. Disable overflow challenge 2 reward.',
          reward: 'Unlock Moles.'
        },
        oc4: {
          modifier: 'Deflation and Mole Reset costs are swapped.',
          reward: 'Unlock the mole reset autobuyer.'
        }
      }
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
    challenge: {
      visible: false
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
    challenge: {
      currentSubtab: 'overflow' as SubtabName,
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
  },
  overflowAutobuyer: {
    bought: 0,
    cost: '',
    option: [
      {
        toggle: '',
        interval: 0.05,
        timer: 0,
      },
      {
        toggle: '',
      },
      {
        toggle: '',
      },
      {
        toggle: '',
      },
      {
        toggle: '',
      },
      {
        toggle: '',
      }
    ]
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
  matterAutobuyerIntervalMultiplierByBying: '',
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
  deflationCosteflationPowerAutobuyerIntervalDivideExponentByDeflation: '',
  deflationPowerAutobuyerIntervalDivideByDeflation: '',
  hasOverflowed: false,
  overflow: '',
  isOverflowing: false,
  changeExtensionLevelDisabled: false,
  overflowPoint: '',
  overflowPointWhenOverflow: '',
  estimatedOverflowTime: '',
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
  heliumPerSecond: '',
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
    },
    helium: {
      cost: '',
      canBuy: false
    },
  },
  isMoleUnlocked: false,
  mole: '',
  moleCost: '',
  canMoleReset: false,

  isInChallenge: false,
  currentChallenge: {
    overflow: undefined as OverflowChallenge | undefined,
  },
  challengeStuff: {
    inflationPower: ''
  },
  challenge: {
    overflow: {
      oc1: {
        goal: '',
        visible: false,
        completed: false,
      },
      oc2: {
        goal: '',
        visible: false,
        completed: false,
      },
      oc3: {
        goal: '',
        visible: false,
        completed: false,
      },
      oc4: {
        goal: '',
        visible: false,
        completed: false,
      }
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
  overflowAutobuyerOption: [
    {
      interval: string;
    }
  ]
}> = ref({
  maxAutobuyerIntervalHeld: false,
  MPressed: false,
  fusionUnlockPourMatter: '',
  OverflowExtensionLevel: 0,
  starAllocateAmount: '',
  autobuyerOption: {
    matterAutobuyer: [{ selectedOrd: 0 }]
  },
  overflowAutobuyerOption: [
    {
      interval: '0.05'
    }
  ]
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
  overflowAutobuyer1interval: computed(() => {
    return sanitizeStringDecimal(input.value.overflowAutobuyerOption[0].interval).clampMin(0.05)
  })
};
export function sanitizeStringNumber(s: string) {
  let n = Number(s);
  if(Number.isNaN(n) || !Number.isFinite(n)) return 0;
  else return n;
}
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
  () => input.value.overflowAutobuyerOption[0].interval,
  () => {
   player.overflowAutobuyer.option[0].interval = Math.max(sanitizeStringNumber(input.value.overflowAutobuyerOption[0].interval),0.05)
  }
)

export function getBuyableClassBinding(canBuy: boolean) {
  return { 'button--can-buy': canBuy, 'button--cannot-buy': !canBuy };
}
export function FormatTime(timeSeconds: DecimalSource){
  timeSeconds = Decimal.fromValue_noAlloc(timeSeconds);
  if(!timeSeconds.isFinite()) return 'forever';
  if(timeSeconds.lt(60)) return `${timeSeconds.toPrecision(4)} seconds`;
  const timeMinutes = timeSeconds.div(60).trunc();
  const timeSecondsRemainder = timeSeconds.sub(timeMinutes.mul(60));
  if(timeSeconds.lt(3600)) return `${timeMinutes.toString()} minutes and ${timeSecondsRemainder.toFixed(3)} seconds`;
  const timeHours = timeSeconds.div(3600).trunc();
  const timeMinutesRemainder = timeMinutes.sub(timeHours.mul(60));
  if(timeSeconds.lt(86400)) return `${timeHours.toString()} hours, ${timeMinutesRemainder.toString()} minutes, and ${timeSecondsRemainder.toFixed(2)} seconds`;
  const timeDays = timeSeconds.div(86400).trunc();
  const timeHoursRemainder = timeHours.sub(timeDays.mul(24));
  return `${timeDays.toString()} days, ${timeHoursRemainder.toString()} hours, ${timeMinutesRemainder.toString()} minutes, and ${timeSecondsRemainder.toFixed(1)} seconds`
}
export function updateScreenInit() {
  for (const uk of UpgradeKindArr) {
    for (let i = 0; i < upgradeConstObj[uk].length; i++) {
      ui.value.upgrades[uk][i].isInfinitelyBuyable = !upgradeConstObj[uk][i].maxAmount.isFinite();
    }
  }
}
export function updateScreen() {
  //const startMark = performance.mark('updateScreen start');

  ui.value.totalMatter = formatValue(player.totalMatter, player.notationId);
  ui.value.playTime = FormatTime(getPlayTime()/1000);
  ui.value.notationId = player.notationId;

  ui.value.matter = formatValue(player.matter, player.notationId);
  ui.value.matterPerSecond = formatValue(getMatterPerSecond(), player.notationId);
  ui.value.deflationCost = formatValue(
    getDeflationCostScaling().getCurrentCost(player.deflation),
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

  ui.value.matterAutobuyerIntervalMultiplierByBying = formatValue(getIntervalMultiplierByBying({kind: 'matter', ord: 0}),player.notationId);
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
  ui.value.deflationCosteflationPowerAutobuyerIntervalDivideExponentByDeflation = formatValue(getDeflationPowerAutobuyerIntervalDivideExponentByDeflation(),player.notationId);
  ui.value.deflationPowerAutobuyerIntervalDivideByDeflation = formatValue(getDeflationPowerAutobuyerIntervalDivideByDeflation(), player.notationId);
  ui.value.isOverflowing = player.isOverflowing;
  ui.value.changeExtensionLevelDisabled = player.isOverflowing || player.currentOverflowChallenge!=undefined;
  ui.value.hasOverflowed = hasOverflowed();
  ui.value.overflow = formatValue(player.overflow, player.notationId);
  ui.value.overflowPoint = formatValue(player.overflowPoint, player.notationId);
  ui.value.overflowPointWhenOverflow = formatValue(getOverflowPointGain(),player.notationId);
  ui.value.estimatedOverflowTime =FormatTime(getEstimatedOverflowTime(getMatterPerSecond()));
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
  ui.value.heliumPerSecond = formatValue(getHeliumPerSecond(),player.notationId);
  ui.value.energy =
    formatValue(player.fusion.energy, player.notationId) +
    ' ' +
    CurrencyName[CurrencyKindObj.energy];
  ui.value.energyEffect = formatValue(getEnergyEffect(player.fusion.energy), player.notationId);
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
  ui.value.extendOverflow.helium.cost = formatValue(getExtendOverflowCost('helium'), player.notationId);
  ui.value.extendOverflow.helium.canBuy = getExtendOverflowCost('helium').lte(player.fusion.helium);

  ui.value.isMoleUnlocked = isMoleUnlocked();
  ui.value.mole = formatValue(player.mole, player.notationId);
  ui.value.moleCost = formatValue(getMoleCost(), player.notationId);
  ui.value.canMoleReset = canMoleReset()

  ui.value.isInChallenge = isInChallenge();
  ui.value.currentChallenge.overflow = player.currentOverflowChallenge;

  for(let i = 0; i < challengeArr.length; i++){
    ui.value.challenge.overflow[challengeArr[i]].visible = player.challenges.overflow[challengeArr[i]].unlocked;
    ui.value.challenge.overflow[challengeArr[i]].completed = player.challenges.overflow[challengeArr[i]].completed;
  }

  ui.value.challengeStuff.inflationPower = formatValue(player.challengeStuff.inflationPower, player.notationId);

  ui.value.tabs.overflow.visible = gameCache.hasOverflowed.cachedValue;
  ui.value.tabs.challenge.visible = IsExtendOverflowUnlocked();
  ui.value.subtabs.autobuyer.matter.visible = true;
  ui.value.subtabs.autobuyer.deflation.visible = gameCache.hasDeflated.cachedValue;
  ui.value.subtabs.autobuyer.overflow.visible = gameCache.hasOverflowed.cachedValue;

  ui.value.subtabs.overflow.extend.visible = IsExtendOverflowUnlocked();

  ui.value.statistics.timeOnDeflation = FormatTime((player.currentTime - player.lastDeflationTime)/1000);
  ui.value.statistics.overflow.timeOn = FormatTime((player.currentTime - player.lastOverflowTime)/1000);

  ui.value.statistics.overflow.visible = player.overflow.gt(0);
  //window.performance.mark("autobuyer loop start")

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

  ui.value.overflowAutobuyer.bought = player.overflowAutobuyer.bought;
  ui.value.overflowAutobuyer.cost = `${overflowAutobuyerCostScaling.getCurrentCost(player.overflowAutobuyer.bought)} OP`

  for(let i=0;i<6;i++){
    ui.value.overflowAutobuyer.option[i].toggle = player.overflowAutobuyer.option[i].toggle ? 'On' : 'Off'
  }


  //window.performance.mark("autobuyer loop end")
  //window.performance.mark("upgrade loop start")
  for (const uk of UpgradeKindArr) {
    for (let i = 0; i < upgradeConstObj[uk].length; i++) {
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
  //window.performance.mark('updateScreen end');
  //window.performance.measure("updateScreen measure",{start:'updateScreen start',end:'updateScreen end'});

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
    overflowReset();
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
  ToggleOverflowAutobuyer(n: number) {
    player.overflowAutobuyer.option[n].toggle=!player.overflowAutobuyer.option[n].toggle;
  },
  BuyExtendOverflow(currency: extendOverflowCurrency) {
    buyExtendOverflow(currency);
    updateCurrentOverflowExtensionLevel();
  },
  ClickEnterChallenge(oc: OverflowChallenge){
    enterOverflowChallenge(oc);
  },
  ClickExitOverflowChallenge(){
    exitOverflowChallenge();
  },
  ClickBuyOverflowAutobuyerButton(){
    buyOverflowAutobuyer();
  },
  ClickMoleResetButton(){
    moleReset();
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
  input.value.OverflowExtensionLevel = player.extendOverflow.currentLevel.div(getOverflowExtensionRange_scale()).floor().toNumber();
  input.value.overflowAutobuyerOption[0].interval = player.overflowAutobuyer.option[0].interval.toString();
}

export function displayError(error: string) {
  let errorElement = document.getElementById('game-error');
  if (errorElement == null) {
    return;
  }
  errorElement.setAttribute('style', '');

  let errorDescriptionElement = document.getElementById('error-description');
  if (errorDescriptionElement == null) {
    errorDescriptionElement = document.createElement('p');
    errorDescriptionElement.setAttribute('id','error-description');
  }
  const newElement = document.createTextNode(error);
  const lineBreakElement = document.createElement('br');
  errorDescriptionElement.appendChild(newElement);
  errorDescriptionElement.appendChild(lineBreakElement);
}

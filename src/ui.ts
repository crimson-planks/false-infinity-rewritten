/** @prettier */
import { computed, ref, watch } from 'vue';
import { player } from './player';
import { formatValue, NotationIdEnum, type NotationId } from '@/notation';
import { autobuyerConstObj } from './autobuyer_const';
import {
  getAutobuyerCostScaling,
  type AutobuyerKind,
  AutobuyerKindObj,
  getIntervalCostScaling,
  getAutobuyerInterval,
  AutobuyerKindArr,
  type AutobuyerSaveData,
  ClickMaxMatterAutobuyerInterval
} from './autobuyer';
import {
  canDeflate,
  deflationSacrifice,
  getDeflationCost,
  getDeflatorGainOnDeflation,
  overflow
} from './prestige';
import { gameCache } from './cache';
import { addCurrency, CurrencyKindObj, CurrencyName, getCurrency } from './currency';
import { getMatterPerSecond, getPlayTime } from './game';
import {
  getUpgradeCostScaling,
  upgradeConstObj,
  upgradeCurrency,
  type UpgradeKind,
  UpgradeKindArr,
  UpgradeKindObj
} from './upgrade';
import {
  getTranslatedDeflationPowerExponent,
  getTranslatedDeflationPowerMultiplier
} from './deflation_power';
import Decimal from 'break_eternity.js';
import { convertMatter, pourMatter } from './fusion';
import { type Ref } from '@vue/reactivity';
export interface AutobuyerVisualData {
  kind: AutobuyerKind;
  ord: number;
  name: string;
  amount: string;
  timer: string;
  interval: string;
  toggle: string;
  cost: string;
  intervalCost: string;
  canBuy: boolean;
  canBuyInterval: boolean;
  hasOption: boolean;
}
export function getDefaultAutobuyerVisualData(ad: AutobuyerSaveData): AutobuyerVisualData {
  return {
    kind: ad.kind,
    ord: ad.ord,
    name: autobuyerConstObj[ad.kind][ad.ord].name,
    amount: '',
    timer: '',
    interval: '',
    toggle: '',
    cost: '',
    intervalCost: '',
    canBuy: false,
    canBuyInterval: false,
    hasOption: false
  };
}
export interface UpgradeVisualData {
  kind: UpgradeKind;
  ord: number;
  amount: string;
  maxAmount: string;
  effectValue: string;
  boughtMax: boolean;
  cost: string;
  canBuy: boolean;
}
export const autobuyerOptions = {
  matterAutobuyer: [{ selectedOrd: [0, 1] }]
} as const;
export type TabName = 'autobuyer' | 'overflow' | 'option' | 'statistics';
export type SubtabName = 'matter' | 'deflation' | 'overflow' | 'upgrades' | 'fusion' | 'general';
export const notationGroups = [
  [NotationIdEnum.default],
  [NotationIdEnum.scientific],
  [NotationIdEnum.logarithm],
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
          description: 'Deflations give twice as many deflators.'
        },
        {
          description: 'Increase the effectiveness of buying an interval'
        },
        {
          description: 'Deflation power affects interval cost at a reduced rate'
        },
        {
          description:
            'Increase the effectiveness of deflations for deflation power autoclicker multiplier'
        },
        {
          description: 'Get more overflow points based on fastest overflow time'
        },
        {
          description: 'Deflation count multiplies overflow point gain'
        },
        {
          description: 'Start with matter'
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
      currentSubtab: 'matter',
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
      currentSubtab: 'upgrades',
      upgrades: {
        visible: true
      },
      fusion: {
        visible: true
      }
    },
    option: {
      currentSubtab: 'option',
      option: {
        visible: true
      }
    },
    statistics: {
      currentSubtab: 'general',
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
      .map((v, i) => {
        return {
          kind: AutobuyerKindObj.Matter,
          ord: i,
          name: autobuyerConstObj.matter[i].name,
          amount: '',
          timer: '',
          toggle: '',
          interval: '',
          cost: '',
          intervalCost: '',
          canBuy: false,
          canBuyInterval: false,
          hasOption: false
        };
      }),
    deflationPower: Array(autobuyerConstObj.deflationPower.length)
      .fill(0)
      .map((v, i) => {
        return {
          kind: AutobuyerKindObj.DeflationPower,
          ord: i,
          name: autobuyerConstObj.deflationPower[i].name,
          amount: '',
          timer: '',
          toggle: '',
          interval: '',
          cost: '',
          intervalCost: '',
          canBuy: false,
          canBuyInterval: false,
          hasOption: false
        };
      }),
    matterAutobuyer: [
      {
        kind: AutobuyerKindObj.MatterAutobuyer,
        ord: 0,
        name: autobuyerConstObj.matterAutobuyer[0].name,
        amount: '',
        timer: '',
        toggle: '',
        interval: '',
        cost: '',
        intervalCost: '',
        canBuy: false,
        canBuyInterval: false,
        hasOption: true
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
          cost: '',
          canBuy: false
        };
      })
  },
  deflation: '',
  canDeflate: false,
  deflatorGainOnDeflation: '',
  canDeflationSacrifice: false,
  deflationPower: '',
  translatedDeflationPower: '',
  translatedDeflationPowerExponent: '',
  translatedDeflationPowerMultiplier: '',
  translatedDeflationPowerMultiplierWhenSacrifice: '',
  previousSacrificeDeflationPower: '',
  translatedDeflationPowerMultiplierBySacrificedDeflationPower: '',
  deflator: '',
  overflow: '',
  isOverflowing: false,
  overflowPoint: '',
  fusionMatterPoured: '',
  fusionMatterPouredPercentage: '',
  fusionUnlocked: false,
  helium: '',
  energy: '',
  statistics: {
    timeOnDeflation: '',
    overflow: {
      timeOn: '',
      visible: false
    }
  }
});
export const input: Ref<{
  fusionUnlockPourMatter: string;
  notationId: NotationId;
  autobuyerOption: {
    matterAutobuyer: [{ selectedOrd: number }];
  };
}> = ref({
  fusionUnlockPourMatter: '',
  notationId: player.notationId,
  autobuyerOption: {
    matterAutobuyer: [{ selectedOrd: 0 }]
  }
});
input.value.notationId = player.notationId;
export const sanitizedInput = {
  fusionUnlockPourMatter: computed(() => {
    return sanitizeStringDecimal(input.value.fusionUnlockPourMatter).max(0).floor();
  })
};
export function sanitizeStringDecimal(s: string) {
  let d = new Decimal(s);
  if (d.isNan() || !d.isFinite()) return new Decimal(Decimal.dZero);
  else return d;
}

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
export function updateScreen() {
  //window.performance.mark('updateScreen start')

  ui.value.totalMatter = formatValue(player.totalMatter, player.notationId);
  ui.value.playTime = getPlayTime().toString();
  ui.value.notationId = player.notationId;

  ui.value.matter = formatValue(player.matter, player.notationId);
  ui.value.matterPerSecond = formatValue(getMatterPerSecond(), player.notationId);
  ui.value.deflationCost = formatValue(
    getDeflationCost().getCurrentCost(player.deflation),
    player.notationId
  );
  ui.value.canDeflate = canDeflate();
  ui.value.deflatorGainOnDeflation = formatValue(getDeflatorGainOnDeflation(), player.notationId);
  ui.value.canDeflationSacrifice = gameCache.canDeflationSacrifice.cachedValue;
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
  ui.value.isOverflowing = player.isOverflowing;
  ui.value.overflow = formatValue(player.overflow, player.notationId);
  ui.value.overflowPoint = formatValue(player.overflowPoint, player.notationId);
  ui.value.fusionMatterPoured = formatValue(player.fusion.matterPoured, player.notationId);
  ui.value.fusionMatterPouredPercentage = formatValue(
    player.fusion.matterPoured.div(1e10).mul(100),
    player.notationId
  );
  ui.value.fusionUnlocked = player.fusion.unlocked;
  ui.value.helium =
    formatValue(player.fusion.helium, player.notationId) +
    ' ' +
    CurrencyName[CurrencyKindObj.helium];
  ui.value.energy =
    formatValue(player.fusion.energy, player.notationId) +
    ' ' +
    CurrencyName[CurrencyKindObj.energy];

  ui.value.tabs.overflow.visible = player.overflow.gt(0);
  ui.value.subtabs.autobuyer.matter.visible = !player.isOverflowing;
  ui.value.subtabs.autobuyer.deflation.visible = player.deflation.gt(0) && !player.isOverflowing;
  ui.value.subtabs.autobuyer.overflow.visible = player.overflow.gt(0);

  ui.value.statistics.timeOnDeflation = String(player.currentTime - player.lastDeflationTime);
  ui.value.statistics.overflow.timeOn = String(player.currentTime - player.lastOverflowTime);

  ui.value.statistics.overflow.visible = player.overflow.gt(0);
  //window.performance.mark("autobuyer loop start")
  for (const ak of AutobuyerKindArr) {
    for (let i = 0; i < player.autobuyers[ak].length; i++) {
      ui.value.autobuyers[ak][i].kind = player.autobuyers[ak][i].kind;
      ui.value.autobuyers[ak][i].ord = player.autobuyers[ak][i].ord;
      ui.value.autobuyers[ak][i].amount = formatValue(
        player.autobuyers[ak][i].amount,
        player.notationId
      );
      ui.value.autobuyers[ak][i].timer = formatValue(
        player.autobuyers[ak][i].timer,
        player.notationId
      );
      ui.value.autobuyers[ak][i].interval = formatValue(
        getAutobuyerInterval(ak, i),
        player.notationId
      );
      ui.value.autobuyers[ak][i].toggle = player.autobuyers[ak][i].toggle ? 'On' : 'Off';
      ui.value.autobuyers[ak][i].cost =
        formatValue(
          getAutobuyerCostScaling(ak, i).getCurrentCost(player.autobuyers[ak][i].amount),
          player.notationId
        ) +
        ' ' +
        CurrencyName[autobuyerConstObj[ak][i].currency];
      ui.value.autobuyers[ak][i].intervalCost =
        formatValue(
          getIntervalCostScaling(ak, i).getCurrentCost(player.autobuyers[ak][i].intervalAmount),
          player.notationId
        ) +
        ' ' +
        CurrencyName[autobuyerConstObj[ak][i].intervalCurrency];
      ui.value.autobuyers[ak][i].canBuy = getAutobuyerCostScaling(ak, i).canBuy(
        player.autobuyers[ak][i].amount,
        Decimal.dOne,
        getCurrency(autobuyerConstObj[ak][i].currency)
      );
      ui.value.autobuyers[ak][i].canBuyInterval = getIntervalCostScaling(ak, i).canBuy(
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
  ClickConvertMatterButton() {
    convertMatter(Decimal.dOne);
  },
  ChangeTab(tab: TabName) {
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
  input.value.notationId = player.notationId;
  input.value.autobuyerOption.matterAutobuyer[0].selectedOrd = Number(
    player.autobuyers.matterAutobuyer[0].option?.selectedOrd
  );
}

export function displayError(error: string) {
  let errorElement = document.getElementById('game-error');
  if (errorElement == null) {
    return;
  }
  errorElement.innerHTML = error;
}

/** @prettier */
import { computed, ref, watch } from 'vue';
import { player } from './player';
import { formatValue, NotationIdEnum, type NotationId } from '@/notation';
import {
  getAutobuyerCostScaling,
  AutobuyerKind,
  getIntervalCostScaling,
  autobuyerCurrency,
  autobuyerName,
  intervalCurrency
} from './autobuyer';
import {
  canDeflate,
  deflationCost,
  deflationSacrifice,
  getDeflationCost,
  getDeflatorGainOnDeflation,
  overflow
} from './prestige';
import { gameCache } from './cache';
import { addCurrency, CurrencyKind, CurrencyName, getCurrency } from './currency';
import { getMatterPerSecond, getPlayTime, VERSION } from './main';
import { getUpgradeCostScaling, upgradeCurrency, UpgradeKind, upgradeMaxAmount } from './upgrade';
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
export type TabName = 'autobuyer' | 'overflow' | 'option' | 'statistics';
export type SubtabName = 'matter' | 'deflation' | 'upgrades' | 'fusion' | 'general';
export const tabs: {
  [key: string]: {
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
      inequality: 'Inequality'
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
  tab: 'autobuyer',
  tabs: {
    autobuyer: {
      visible: true
    },
    overflow: {
      visible: true
    },
    option: {
      visible: true
    },
    statistics: {
      visible: true
    }
  },
  subtab: 'matter',
  subtabs: {
    autobuyer: {
      matter: {
        visible: true
      },
      deflation: {
        visible: false
      }
    },
    overflow: {
      upgrades: {
        visible: true
      },
      fusion: {
        visible: true
      }
    },
    option: {
      option: {
        visible: true
      }
    },
    statistics: {
      general: {
        visible: true
      }
    }
  },
  creditsVisible: false,
  playTime: '',
  matter: '',
  totalMatter: '',
  matterPerSecond: '',
  deflationCost: '',
  autobuyers: {
    matter: Array(player.autobuyers.matter.length)
      .fill(0)
      .map((v, i) => {
        return {
          kind: AutobuyerKind.Matter,
          ord: i,
          name: autobuyerName.matter[i],
          amount: '',
          timer: '',
          toggle: '',
          interval: '',
          cost: '',
          intervalCost: '',
          canBuy: false,
          canBuyInterval: false
        };
      }),
    deflationPower: Array(player.autobuyers.matter.length)
      .fill(0)
      .map((v, i) => {
        return {
          kind: AutobuyerKind.Matter,
          ord: i,
          name: autobuyerName.matter[i],
          amount: '',
          timer: '',
          toggle: '',
          interval: '',
          cost: '',
          intervalCost: '',
          canBuy: false,
          canBuyInterval: false
        };
      })
  },
  upgrades: {
    overflow: Array(player.upgrades.overflow.length)
      .fill(0)
      .map((v, i) => {
        return {
          kind: UpgradeKind.Overflow,
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
  energy: ''
});
export const input: Ref<{ fusionUnlockPourMatter: string; notationId: NotationId }> = ref({
  fusionUnlockPourMatter: '',
  notationId: 'default'
});
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
  () => input.value.notationId,
  () => {
    player.notationId = input.value.notationId;
  }
);
export function updateScreen() {
  ui.value.totalMatter = formatValue(player.totalMatter, player.notationId);
  ui.value.playTime = getPlayTime().toString();

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
    player.fusion.matterPoured.div('1e10').mul(100),
    player.notationId
  );
  ui.value.fusionUnlocked = player.fusion.unlocked;
  ui.value.helium = formatValue(player.fusion.helium, player.notationId);
  ui.value.energy = formatValue(player.fusion.energy, player.notationId);

  ui.value.tabs.overflow.visible = player.overflow.gt(0);
  ui.value.subtabs.autobuyer.deflation.visible = player.deflation.gt(0);
  //@ts-ignore: this is a valid way of iterating through an Object
  Object.keys(player.autobuyers).forEach((ak: AutobuyerKind) => {
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
        player.autobuyers[ak][i].interval,
        player.notationId
      );
      ui.value.autobuyers[ak][i].toggle = player.autobuyers[ak][i].toggle ? 'On' : 'Off';
      ui.value.autobuyers[ak][i].cost =
        formatValue(
          getAutobuyerCostScaling(ak, i).getCurrentCost(player.autobuyers[ak][i].amount),
          player.notationId
        ) +
        ' ' +
        CurrencyName[autobuyerCurrency[ak][i]];
      ui.value.autobuyers[ak][i].intervalCost =
        formatValue(
          getIntervalCostScaling(ak, i).getCurrentCost(player.autobuyers[ak][i].intervalAmount),
          player.notationId
        ) +
        ' ' +
        CurrencyName[intervalCurrency[ak][i]];
      ui.value.autobuyers[ak][i].canBuy = getAutobuyerCostScaling(ak, i)
        .getCurrentCost(player.autobuyers[ak][i].amount)
        .lte(getCurrency(autobuyerCurrency[ak][i]));
      ui.value.autobuyers[ak][i].canBuyInterval = getIntervalCostScaling(ak, i)
        .getCurrentCost(player.autobuyers[ak][i].intervalAmount)
        .lte(getCurrency(autobuyerCurrency[ak][i]));
    }
  });
  //@ts-ignore: same reason
  Object.keys(player.upgrades).forEach((uk: UpgradeKind) => {
    for (let i = 0; i < player.upgrades[uk].length; i++) {
      ui.value.upgrades[uk][i].kind = player.upgrades[uk][i].kind;
      ui.value.upgrades[uk][i].ord = player.upgrades[uk][i].ord;
      ui.value.upgrades[uk][i].amount = formatValue(
        player.upgrades[uk][i].amount,
        player.notationId
      );
      ui.value.upgrades[uk][i].boughtMax = player.upgrades[uk][i].amount.gte(
        upgradeMaxAmount[uk][i]
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
        getUpgradeCostScaling(uk, i)
          .getCurrentCost(player.upgrades[uk][i].amount)
          .lte(getCurrency(upgradeCurrency[uk][i]));
      ui.value.upgrades[uk][i].maxAmount = formatValue(upgradeMaxAmount[uk][i], player.notationId);
      ui.value.upgrades[uk][i].effectValue = formatValue(
        gameCache.upgradeEffectValue[uk][i].cachedValue,
        player.notationId
      );
    }
  });
}
export function ClickFusionPourMatterButton() {
  if (player.isOverflowing) return;
  pourMatter(sanitizedInput.fusionUnlockPourMatter.value);
}
export function handleInput(type: string, args: string[]) {
  if (type === 'ClickMatterButton') addCurrency(CurrencyKind.Matter, Decimal.dOne);
  if (type === 'ClickDeflationPowerButton') addCurrency(CurrencyKind.DeflationPower, Decimal.dOne);
  if (type === 'ClickDeflationSacrificeButton') deflationSacrifice();
  if (type === 'ClickOverflowButton') overflow();
  if (type === 'ClickConvertMatterButton') convertMatter(Decimal.dOne);
  if (type === 'ChangeTab') ui.value.tab = args[0];
  if (type === 'ChangeSubtab') ui.value.subtab = args[0];
}

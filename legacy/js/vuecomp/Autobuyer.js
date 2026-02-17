export const AutobuyerComponent = {
    props: ["type","ord","displayName","amount","interval","cost","intervalCost","isActive",
        "canBuy","canBuyInterval"
    ],
    emits: ["buyAutobuyer","buyInterval","ToggleIsActive"],
    template: `
    <div class="autobuyer">
        <div class="autobuyer-name">{{displayName}}</div>
        <div class="autobuyer-box">
            {{amount}}
        </div>
        <div class="autobuyer-box autobuyer-cost" :class="{'can-buy': canBuy, 'cannot-buy': !canBuy}" @click="$emit('buyAutobuyer',type,ord)">
            Cost: {{cost}}
        </div>
        <div class="autobuyer-box">
            {{interval}}
        </div>
        <div class="autobuyer-box autobuyer-intervalcost" :class="{'can-buy': canBuyInterval, 'cannot-buy': !canBuyInterval}" @click="$emit('buyInterval',type,ord)">
            Interval Cost: {{intervalCost}}
        </div>
        <div class="autobuyer-box" @click="$emit('ToggleIsActive',type,ord)">
            Active: {{ isActive }}
        </div>
    </div>
    `,
    computed: {
    },
    methods: {
    }
}

var template = `
<div class="form-selection" :class="{'h-auto flex-wrap': layout != '' }">
    <div class="d-flex align-items-center" :style="layout" v-for="opcao in options" :key="opcao">
        <div class="form-radio" :class="{'form-radio--active': checked == opcao}">
            <input class="form-radio__input" type="radio" tabindex="0"
                :id="opcao.toLowerCase() + randomId"
                :name="opcao.toLowerCase() + randomId"
                :disabled="disabled"
                v-model="checked"
                :value="opcao"
                @change="onChange()"
                @keydown.enter="checked = opcao; onChange()"
            >
            <div class="form-radio__background">
                <div class="form-radio__outer"></div>
                <div class="form-radio__inner"></div>
            </div>
            <div class="form-radio__underlay"></div>
        </div>
        <label class="form-selection__label" :for="opcao.toLowerCase() + randomId">{{opcao}}</label>
    </div>
</div>
`;

Vue.component('TvInputRadio', {
    props: {
        default: {
            type: String,
            default: false
        },
        options: {
            type: Array,
            default: []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        layout: {
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            checked: this.default,
            randomId: ""
        }
    },
    watch: {
        default: function() {
			this.checked = this.default;
        }
    },
    template: template,
    created: function(){
        var min = Math.ceil(0);
        var max = Math.floor(100);
        this.randomId = Math.floor(Math.random() * (max - min + 1)) + min;
        
        
    },
    methods: {
        onChange: function() {
            this.$emit('input', this.checked);
        }
    }
})

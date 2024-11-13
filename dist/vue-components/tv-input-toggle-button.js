var template = `
<div class="form-selection">
    <div class="form-button-radio" :class="{'form-button-radio--active': checked == opcao.id}" v-for="opcao in options">
        <input :id="id + opcao.id" :name="opcao.id" class="form-button-radio__input" type="radio" v-model="checked" :value="opcao.id" @change="onChange()" @click="removeCheckedOption($event)" :disabled="disabled || opcao.disabled">
        <div class="form-button-radio__background"></div>
        <span class="form-button-radio__text"><i class="fas mr-2" :class="opcao.icon" v-if="opcao.icon"></i>{{ opcao.descricao }}</span>
        <div class="form-button-radio__underlay"></div>
    </div>
</div>
`;

Vue.component('TvInputToggleButton', {
    props: {
        id: {
            type: String,
            required: true
        },
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
        removeOption: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            checked: this.default,
        }
    },
    watch: {
        default: function() {
			this.checked = this.default;
        }
    },
    template: template,
    methods: {
        onChange: function() {
            this.$emit('input', this.checked);
        },

        removeCheckedOption: function(e) {
            if(this.removeOption && e.target.value == this.checked) {
                this.checked = '';
                this.onChange();
            }
        }
    }
})

var template = `
<div class="form-container">
    <div class="form-field form-field--line form-field--suffix-icon" :class="{'form-field--active': content != ''}">
        <i class="form-field__icon fas fa-search"></i>

        <input
            :id="id"
            :name="id"
            type="text"
            class="form-control"
            :placeholder="placeholder"
            autocomplete="off"
            spellcheck="false"
            tabindex="0"
            v-model="content"
            @click="focus = true"
            @blur="focus = false"
            v-on:input="debounceDataFiltered()"
        />

        <div class="form-outline" :class="{ 'form-outline--active form-outline--focus': focus || content != '' }">
            <div class="form-outline__prefix"></div>
            <div class="form-outline__middle">
                <label :for="id" class="form-field__label"></label>
            </div>
            <div class="form-outline__suffix"></div>
        </div>
    </div>
</div>
`;

Vue.component('TvInputSearch', {
    props: {
        id: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            default: 'Pesquisar'
        },
        value: {
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            content: this.value,
            focus: false,
            timeoutId: null
        }
    },
    computed: {},
    template: template,
    watch: {
        value: function() {
            this.content = this.value;
        },
    },
    methods: {
        debounceDataFiltered: function() {
            this.timeoutId = debounce(this, this.changeSearch, this.timeoutId);
        },

        changeSearch: function() {
            this.$emit('keyup', this.content);
            this.timeoutId = null
        }
    }
})

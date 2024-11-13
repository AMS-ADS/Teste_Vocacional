var template = `
<div class="form-container">
    <div class="form-field form-select form-field--suffix-icon" @blur="blurInput()" :class="[altClass, {'form-field--error': errorMessageDisplay !== '', 'form-field--log': (hint && hint.log), 'form-field--prefix-icon': customButton && customButtonPrefix, 'form-field--disabled': disabled, 'form-field--active':selectedOption}]">

        <slot name="custom-element"></slot>

        <input class="form-control pointer" type="text" autocomplete="off" spellcheck="false" ref="search"
            :id="id"
            :name="id"
            tabindex="0"
            :disabled="disabled"
            v-model="search"
            @click="isOpen && hasFocus ? blurInput() : focusInput()"
            @focus="executedFocus()"
            @blur="blurInput()"
            @keydown.up.prevent="arrowKeyNavigation(-1)"
            @keydown.down.prevent="arrowKeyNavigation(1)"
            @keydown.enter="navigationSelect()"
        />

        <div class="form-select__wrapper" :title="selectedOption" v-show="selected != null && selected != '' && !focus" @click="focusInput('form-select__wrapper')">
            <span class="form-select__selected">{{selectedOption}}</span>
        </div>

        <button class="form-select__clean form-field__icon h-auto form-select__action" type="button" v-if="customButton" @click="customButtonEvent()" tabindex="-1">
            <i :class="customButtonIcon"></i>
        </button>

        <i class="form-field__icon form-select__arrow fas fa-caret-down" :class="{'form-select__arrow--active': focus}" v-if="!disabled"></i>

        <template v-if="removeButton">
            <button class="form-select__clean form-field__icon" type="button" v-if="selected != null && selected != '' && !disabled" @mousedown="removeOption()" tabindex="-1"><i class="fas fa-times" :class="'form-select__clean' + id"></i></button>
        </template>

        <div class="form-outline" :class="{'form-outline--active': (selected != null && selected != '') || focus, 'form-outline--focus': focus}">
            <div class="form-outline__prefix"></div>
            <div class="form-outline__middle">
                <label class="form-field__label" :for="id" :style="{ 'background-color': labelBg }"><slot></slot></label>
            </div>
            <div class="form-outline__suffix"></div>
        </div>
        <i class="order-1 mr-3 tv-tooltip-btn" :class="[hint.icon]" :style="{'background-color':hint.bg, 'color': hint.color}" :title="(hint.tooltip) ? '' : hint.title" @click="emitHintAction($event)" v-if="hint"></i>

        <div class="form-select__dropdown" :class="{'form-select__dropdown--active': focus}" @mousedown="preventCloseDropdown($event)" ref="inputDropdown">
            <ul class="form-select__list">
                <template v-if="optionsFiltered.length > 0">
                    <li class="form-select__item"
                        v-for="(option, i) of optionsFiltered"
                        :key="option.id"
                        :class="{ 'form-select__item--disabled': option.disabled, 'highlighted': i === highLightedIndex }"
                        @mousedown="changeOption(option); blurInput();"
                    >
                        <template v-if="option.icon == '' || typeof option.icon == 'undefined'">
                            <span class="form-select__option">{{ displayCodigo && option.codigo != '' ? option.codigo : '' }} <template v-if="displayCodigo && option.codigo != '' && option.descricao != ''">-</template> {{ option.descricao != '' ? option.descricao : '' }}</span>
                        </template>

                        <template v-else-if="option.icon != '' || typeof option.icon != 'undefined'">
                            <span class="form-select__option">
                                <i class="color-primary" :class="[option.icon, {'ml-2 order-2': reverseIcon, 'mr-2': !reverseIcon}]"></i>
                                <span :class="{'order-1': reverseIcon}">{{ option.descricao }}</span>
                            </span>
                        </template>
                    </li>
                </template>

                <template v-else>
                    <li class="form-select__item">
                        <span class="form-select__option">Nenhum registro encontrado.</span>
                    </li>
                </template>
            </ul>
        </div>
    </div>
    <div class="form-support" v-if="errorMessageDisplay !== '' || helperMessage !== ''">
        <span class="form-support__help-message form-support__error-message" v-if="errorMessageDisplay !== ''">{{errorMessageDisplay}}</span>
        <span :id="id + '-help-message'"  class="form-support__help-message" v-if="errorMessageDisplay == ''">
            <i :class="helperMessageIcon" v-if="helperMessageIcon != ''"></i>
            {{helperMessage}}
        </span>
    </div>
</div>
`;



Vue.component('TvInputSelect', {
    props: {
        id: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            required: true
        },
        default: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        helperMessage: {
            type: String,
            default: ''
        },
        helperMessageIcon: {
            type: String,
            default: ''
        },
        errorMessage: {
            type: String,
            default: ''
        },
        hint: Object,
        displayCodigo: {
            type: Boolean,
            default: true
        },
        removeButton: {
            type: Boolean,
            default: true
        },
        customButton: {
            type: Boolean,
            default: false
        },
        customButtonIcon: {
            type: String,
            default: ''
        },
        customButtonPrefix: {
            type: Boolean,
            default: false
        },
        reverseIcon: {
            type: Boolean,
            default: false
        },
        newConfig: {
            type: Boolean,
            default: false
        },
        allOptions: {
            type: Boolean,
            default: false
        },
        altClass: {
            type: String,
            default: ''
        },
        labelBg: {
            type: String,
            default: ''
        },
        hiddenValue: String
    },
    data: function() {
        return {
            selected: this.default,
            focus: false,
            hasFocus: false,
            search: '',
            optionsFiltered: [],
            errorMessageDisplay: '',
            timeoutId: null,
            isOpen: false,
            highLightedIndex: 0
        }
    },

    template: template,

    created: function() {
        this.timeoutId = debounce(this, this.setOptionsFiltered, this.timeoutId);
    },

    mounted: function() {
        this.loadOption();
    },

    computed: {
        selectedOption: function() {
            if(this.selected != null && this.selected != "") {
                if(!Array.isArray(this.selected)){
                    const options = this.options;
                    const optionsLength = options.length;
                    //Primeiro compara com os IDs
                    for (let i = 0; i < optionsLength; i++) {
                        if(options[i].id == this.selected){
                            this.selected = options[i];
                            if(this.displayCodigo && this.selected.codigo !== "" && this.selected.descricao !== ""){
                                return this.selected.codigo + ' - ' + this.selected.descricao;
                            }else if(this.selected.descricao == ""){
                                return this.selected.codigo;
                            }else{
                                return this.selected.descricao;
                            }
                        }
                    }
                    //Depois com os códigos
                    for (let j = 0; j < optionsLength; j++) {
                       if(options[j].codigo == this.selected){
                           this.selected = options[j];
                           if(this.displayCodigo && this.selected.codigo !== "" && this.selected.descricao !== ""){
                               return this.selected.codigo + ' - ' + this.selected.descricao;
                           }else if(this.selected.descricao == ""){
                               return this.selected.codigo;
                           }else{
                               return this.selected.descricao;
                           }
                       }
                    }
                }
                //Se não encontrar
                if(this.displayCodigo && this.selected.codigo !== "" && this.selected.descricao !== ""){
                    return this.selected.codigo + ' - ' + this.selected.descricao;
                }else if(this.selected.descricao == ""){
                    return this.selected.codigo;
                }else{
                    return this.selected.descricao;
                }
            }
        }
    },

    watch: {
        default: function() {
            if(this.newConfig) {
                if(this.default === null || this.default == "") {
                    this.selected = null;
                } else if(this.default != null && this.default != '') {
                    this.loadOption();
                }
            } else {
                if(this.default === null || this.default == "")
                    this.removeOption();
                else if(this.default != ""){
                    this.loadOption();
                }
            }
        },
        focus: function(value) {
            if(value) {
                vm = this;
                Vue.nextTick()
                    .then(function () {
                        vm.$refs.search.focus();
                        vm.focusInput()
                })
            }
        },
        isOpen: function(){
            if(!this.isOpen){
                this.$refs.search.blur();
                return false
            }
        },
        errorMessage: function() {
            this.errorMessageDisplay = this.errorMessage;
        },
        search: function() {
            this.timeoutId = debounce(this, this.setOptionsFiltered, this.timeoutId);
        },
        options: function() {
            if(this.options.length > 0) {
                this.timeoutId = debounce(this, this.setOptionsFiltered, this.timeoutId);
            } else {
                this.optionsFiltered = []
            }
        },
        hiddenValue: function() {
            if(this.hiddenValue) {
                this.timeoutId = debounce(this, this.setOptionsFiltered, this.timeoutId);
            }
        }
    },

    methods: {
        setOptionsFiltered: function() {
            this.highLightedIndex = 0;
            const optionsLength = (this.allOptions) ? this.options.length : 25;

            if(this.search){
                let displayed = this.options.filter((item)=>{
                    const procurar = this.search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                    const codigo = item.codigo ? item.codigo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : null;
                    const descricao = item.descricao ? item.descricao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : null;

                    if(codigo != null && codigo.includes(procurar) || descricao != null && descricao.includes(procurar)) return true;

                    return false;
                }).slice(0, optionsLength);

                if(this.hiddenValue) {
                    const hiddenValueIndex = displayed.findIndex(x => x.id == this.hiddenValue);
                    if(hiddenValueIndex != -1) {
                        displayed.splice(hiddenValueIndex, 1);
                    }
                }

                this.optionsFiltered = displayed;
            }else{
                let displayed = this.options.slice(0, optionsLength);

                if(this.hiddenValue) {
                    const hiddenValueIndex = displayed.findIndex(x => x.id == this.hiddenValue);
                    if(hiddenValueIndex != -1) {
                        displayed.splice(hiddenValueIndex, 1);
                    }
                }
                
                this.optionsFiltered = displayed;
            }
        },
        changeOption: function(newOption) {
            if(this.newConfig) {
                if((this.selected == null || this.selected == '') || newOption.id != this.selected.id) {
                    this.selected = newOption;
                    this.$emit('input', this.selected.id);
                }
            } else {
                this.selected = newOption;
                this.$emit('input', this.selected.id);
            }
            
            // if (this.selected != null && this.selected != '') {
            this.errorMessageDisplay = '';
            // }
        },
        removeOption: function() {
            this.selected = null;
            this.$emit('input', this.selected);
        },
        customButtonEvent: function(){
            this.$emit('custom-button-event', this.selected);
        },
        executedFocus: function() {
            if (!this.hasFocus) {
                this.focusInput();
                setTimeout(() => {
                    this.hasFocus = true;
                }, 300);
            }
        },
        focusInput: function() {
            if(!this.disabled) {
                this.focus = true;
                this.isOpen = true;
                const tasSideNav = document.querySelector('.tv-sidenav__body');
                const selectDropdown = this.$refs.inputDropdown;
                if (tasSideNav && tasSideNav.contains(selectDropdown)) {
                    setTimeout(() => { 
                        if(selectDropdown.getBoundingClientRect().bottom > tasSideNav.getBoundingClientRect().bottom) {
                            let auxDiffHeight = selectDropdown.getBoundingClientRect().bottom - tasSideNav.getBoundingClientRect().bottom
                            tasSideNav.scrollTop += auxDiffHeight + 50
                        }
                    }, 100);
                }

                this.$emit('focus', this.$refs.inputDropdown);
            }
        },
        blurInput: function() {
            this.search = '';
            this.isOpen = false;
            setTimeout(() => {
                this.focus = false;
            }, 150);
            this.hasFocus = false;
            this.highLightedIndex = 0;
            this.$refs.inputDropdown.scrollTop = 0
        },
        preventCloseDropdown: function($event) {
            if($event.target.classList.contains("form-select__dropdown")) {
                $event.preventDefault();
            }
        },
        loadOption: function() {
            if(this.default != "" && this.default != null){
                let auxId = null
                let auxCodigo = null
                let auxDescricao = null

                for (let i = 0; i < this.options.length; i++) {
                    if(this.options[i].id == this.default) {
                        auxId = this.options[i]
                    }else if(this.options[i].codigo && this.options[i].codigo.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() == this.default.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()){
                        auxCodigo = this.options[i]
                    } else if(this.options[i].descricao && this.options[i].descricao.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() == this.default.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()){
                        auxDescricao = this.options[i]
                    }
                }

                if(this.newConfig) {
                    if(auxId != null) {
                        this.selected = auxId;
                    } else if(auxCodigo != null) {
                        this.selected = auxCodigo;
                    } else if(auxDescricao != null) {
                        this.selected = auxDescricao;
                    } else {
                        this.removeOption()
                    }
                } else {
                    if(auxId != null){
                        this.changeOption(auxId);
                    }else if(auxCodigo != null){
                        this.changeOption(auxCodigo);
                    }else if(auxDescricao != null){
                        this.changeOption(auxDescricao);
                    }
    
                    if(this.selected == null || this.selected == "") {
                        this.removeOption();
                    }
                }

            }
        },

        emitHintAction: function(e) {
            if(this.hint.tooltip !== undefined) {
                openTooltip(e, this.hint.title, this.hint.log);
            } else {
                this.$emit('hint-action', this.checked);
            }
        },

        arrowKeyNavigation(direction) {
            if(direction == -1 && this.highLightedIndex > 0) {
                this.highLightedIndex -= 1;
            } else if(direction == 1 && this.highLightedIndex < this.optionsFiltered.length -1) {
                this.highLightedIndex += 1
            }

            let itemElement = this.$refs.inputDropdown.children[0].children[this.highLightedIndex];
            let dropDownElement = this.$refs.inputDropdown;

            if(itemElement.getBoundingClientRect().bottom > dropDownElement.getBoundingClientRect().bottom) {
                let heightDiff = itemElement.getBoundingClientRect().bottom - dropDownElement.getBoundingClientRect().bottom
                dropDownElement.scrollTop += heightDiff + 20
            } else if(itemElement.getBoundingClientRect().top < dropDownElement.getBoundingClientRect().top) {
                let heightDiff = itemElement.getBoundingClientRect().top - dropDownElement.getBoundingClientRect().top
                dropDownElement.scrollTop += heightDiff
            }
        },

        navigationSelect() {
            let selectedItem = this.optionsFiltered[this.highLightedIndex]
            if(typeof selectedItem != 'undefined') {
                this.changeOption(selectedItem);
                this.blurInput();
            }
        }
    }
})

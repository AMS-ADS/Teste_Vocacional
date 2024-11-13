var template = `
<div class="form-container">
    <div class="form-field" :class="{'form-field--prefix-icon': prefixIcon !== '' || prefixText !== '' || customButton && customButtonPrefix, 'form-field--suffix-icon': suffixIcon !== '' || suffixText !== '' || customButton, 'form-field--prefix-text': prefixText !== '', 'form-field--suffix-text': suffixText !== '', 'form-field--error': errorMessageDisplay !== '', 'form-field--log': (hint && hint.log) || (hasCharCount && maxLengthValue != null && charCount > maxLengthValue),'form-field--disabled': disabled, 'form-field--active':content.length > 0}">
        <template v-if="customButton != ''">
            <i id="show-password-icon" class="form-field__iconbtn form-field__icon" :class="customButton" @click="customButtonEvent()" tabindex="-1"></i>
        </template>    
        <template v-if="prefixIcon !== ''">
            <i class="form-field__icon" :class="prefixIcon"></i>
        </template>
        <template v-if="suffixIcon !== ''">
            <i class="form-field__icon" :class="suffixIcon"></i>
        </template>
        <template v-if="prefixText !== ''">
            <span class="form-field__icon">{{prefixText}}</span>
        </template>
        <template v-if="suffixText !== ''">
            <span class="form-field__icon">{{suffixText}}</span>
        </template>
        <template v-if="mask !== ''">
            <input :type="type" class="form-control" :class="[altClass, {'text-right': suffixIcon !== '' || suffixText !== ''}]" autocomplete="off" spellcheck="false"
                :id="id"
                :name="id"
                tabindex="0"
                :title="content"
                v-model="content"
                v-mask="mask"
                :maxlength="maxLengthValue"
                @focus="focusInput($event)"
                @blur="blurInput"
                @change="onChange"
                :disabled="disabled"
                :onkeydown="onkeydown"
                @keypress="formatComma"
                v-on:keyup.enter="onEnterEmit()"
            >
        </template>
        <template v-else>
            <input :type="type" class="form-control" :class="[altClass, {'text-right': suffixIcon !== '' || suffixText !== ''}]" :autocomplete="(type == 'password' || type == 'PASSWORD') ? 'new-password' : 'off'" spellcheck="false"
                :id="id"
                :name="id"
                tabindex="0"
                :title="content"
                v-model="content"
                :maxlength="maxLengthValue"
                @focus="focusInput($event)"
                @blur="blurInput()"
                @change="onChange"
                :disabled="disabled"
                :onkeydown="onkeydown"
                @keypress="formatComma"
                v-on:keyup.enter="onEnterEmit()"
            >
        </template>
        <div class="form-outline" :class="{'form-outline--active': content.length > 0 || focus, 'form-outline--focus': focus}">
            <div class="form-outline__prefix"></div>
            <div class="form-outline__middle">
                <label class="form-field__label" :for="id" :style="{ 'background-color': labelBg }"><slot></slot></label>
            </div>
            <div class="form-outline__suffix"></div>
        </div>
        <div class="form-loading" :class="{'justify-content-end': loadingText != ''}" v-if="loading">
            <div class="form-loading__spinner">
              <div class="str1"></div>
              <div class="str2"></div>
              <div class="str3"></div>
              <div class="str4"></div>
              <div class="str5"></div>
            </div>
            <span class="form-loading__text" v-if="loadingText != ''">{{loadingText}}</span>
        </div>
        <i class="order-1 mr-3 tv-tooltip-btn" :class="[hint.icon]" :style="{'background-color':hint.bg, 'color': hint.color}" :title="(hint.tooltip) ? '' : hint.title" @click="emitHintAction($event)" v-if="hint"></i>
    </div>
    <div class="form-support" v-if="errorMessageDisplay !== '' || helperMessage !== '' || hasCharCount == true">
        <span class="form-support__help-message form-support__error-message" v-if="errorMessageDisplay !== ''">{{errorMessageDisplay}}</span>
        <span :id="id + '-help-message'"  class="form-support__help-message" v-if="errorMessageDisplay == ''">{{helperMessage}}</span>
        <span v-if="hasCharCount" class="form-support__character-count">{{charCount}}<span v-if="maxLength">/</span>{{maxLength}}</span>
    </div>
</div>
`;

Vue.component('TvInputText', {
    props: {
        id: {
            type: String,
            required: true
        },
        altClass: {
            type: String,
            default: ''
        },
        labelBg: {
            type: String,
            default: ''
        },
        helperMessage: {
            type: String,
            default: ''
        },
        errorMessage: {
            type: String,
            default: ''
        },
        warningTooltip: {
            type: String,
            default: ''
        },
        hint: Object,
        prefixIcon: {
            type: String,
            default: ''
        },
        suffixIcon: {
            type: String,
            default: ''
        },
        prefixText: {
            type: String,
            default: ''
        },
        suffixText: {
            type: String,
            default: ''
        },
        maxLength: Number,
        minValue: Number,
        maxValue: Number,
        hasCharCount: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        default: {
            type: String,
            default: ''
        },
        onkeydown: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        mask: {
            type: String,
            default: ''
        },
        format: {
            type: Number,
            default: -1
        },
        cnpjcpf:  {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingText: {
            type: String,
            default: ''
        },
        customButton: {
            type: String,
            default: ''
        },
        customButtonPrefix: {
            type: Boolean,
            default: false
        },
    },
    data: function() {
        return {
            content: this.default,
            focus: false,
            maxLengthValue: this.maxLength,
            errorMessageDisplay: ''
        }
    },
    computed: {
        charCount: function() {
            return this.content.length;
        }
    },
    mounted: function() {
        if(this.maxLength != null && this.content != null && this.content.indexOf(",") > -1) {
            this.maxLengthValue = this.maxLength;
            this.maxLengthValue++;
        }

        if(this.maxValue && !this.maxLength) {
            this.maxLengthValue = formatNumberToFront(this.maxValue).length;
        }
    },
    watch: {
        default: function() {
            let contentAux = this.default

            if(contentAux != '' && this.format != -1) {
                contentAux = Number(formatNumberToBack(contentAux))
                contentAux = formatNumberToFront(contentAux, this.format, true);
            }

            this.content = contentAux;
        },

        maxLength: function() {
            this.maxLengthValue = this.maxLength;
        },

        content: function(){
            if(this.cnpjcpf){
                if(this.content != "") {
                    if(!this.content.includes(".")){
                        this.maxLengthValue = 14;
                    }else if(this.content.length == 18 || this.content.includes("/")){
                        this.maxLengthValue = 18;
                    }else{
                        this.maxLengthValue = 17;
                    }
                } else {
                    this.maxLengthValue = this.maxLength;
                }
            }

            if(this.mask == '##:##') {
                if(this.content.length == 5) {
                    let hours = this.content.split(':')[0];
                    let minutes = this.content.split(':')[1];

                    if(parseInt(hours) > 23) {
                        hours = 23;
                    }

                    if(parseInt(minutes) > 59) {
                        minutes = 59;
                    }

                    this.content = hours + ':' + minutes;
                }
            }

            this.errorMessageDisplay = '';
            this.$emit('keydown', this.content);
        },

        format: function() {
            if(this.format != -1){
                let aux_value = this.content.split(".").join("").replace(",", ".").split(",").join("");
                aux_value = Number(aux_value).toFixed(this.format);
                aux_value = Number(aux_value).toLocaleString('pt-br', {minimumFractionDigits: this.format});

                (this.content !=  "") ? this.content = aux_value : this.content = "";
            }
        },

        errorMessage: function() {
            this.errorMessageDisplay = this.errorMessage;
        },

        minValue: function(){
            this.onChange();
        }
    },
    template: template,
    methods: {
        focusInput: function(e){
            this.focus = true;

            if(!this.cnpjcpf) {
                e.target.select();
            }
        },

        formatComma: function($event) {
            if(this.format != -1) {
                if(($event.key == "," && this.format == 0) || ($event.key == "," && this.content.indexOf(",") != -1) || ($event.key == "," && this.content == "")) {
                    $event.preventDefault();
                } else {
                    if($event.target.selectionStart == 0 && $event.target.selectionEnd == $event.target.value.length){
                        return true;
                    }

                    let maxLengthMinus = 0;
                    if(this.content.indexOf("-") != -1) {
                        maxLengthMinus = 1;
                    }

                    if(this.format > 0 && this.maxLength != null && this.content != null && this.content.indexOf(",") == -1 && (this.content.length == (this.maxLength + maxLengthMinus) - this.format) && $event.key != ",") {
                        this.maxLengthValue = this.maxLength;
                        this.maxLengthValue = this.maxLengthValue + 1 + maxLengthMinus;
                        this.content =  this.content + ",";
                    } else if($event.key == ',' && (this.content.length == (this.maxLength + maxLengthMinus) - this.format)) {
                        this.maxLengthValue = this.maxLength;
                        this.maxLengthValue = this.maxLengthValue + 1 + maxLengthMinus;
                    }

                    if(this.content != null && this.content.indexOf(",")>-1 && (this.content.split(',')[1].length == this.format)){
                        $event.preventDefault();
                    }
                }
            }
        },
        
        blurInput: function(){
            this.focus = false;
            this.$emit('blur', this.focus);
        },

        onChange: function(){
            if(this.cnpjcpf){
                let aux_value = this.content;

                if(aux_value.replace(/[^0-9]/g, '').length == 14){
                    aux_value = aux_value.replace(/[^0-9]/g, '');

					this.content = aux_value.substring(0, 2) + '.' + aux_value.substring(2, 5)+ '.' + aux_value.substring(5, 8) + '/' + aux_value.substring(8, 12) + '-' + aux_value.substring(12, 15);

				}else if(aux_value.replace(/[^0-9]/g, '').length == 11){
					aux_value = aux_value.replace(/[^0-9]/g, '');

					this.content = aux_value.substring(0, 3) + '.' + aux_value.substring(3, 6)+ '.' + aux_value.substring(6, 9) + '-' + aux_value.substring(9, 11);
				}
            }

            if(this.format != -1) {
                let aux_value = Number(formatNumberToBack(this.content))
                aux_value = formatNumberToFront(aux_value, this.format, true);

                (this.content !=  "") ? this.content = aux_value : this.content = "";
            }

            if(this.minValue || this.maxValue) {
                let auxValue = this.content.split(".").join("").replace(",", ".").split(",").join("");
                auxValue = parseFloat(auxValue);

                if(this.minValue && auxValue <= this.minValue) {
                    if(this.format != -1 && this.format != 0) {
                        this.content = Number(this.minValue).toLocaleString('pt-br', {minimumFractionDigits: this.format});
                    } else {
                        this.content = this.minValue.toString();
                    }
                }

                if(this.maxValue && auxValue > this.maxValue) {
                    if(this.format != -1 && this.format != 0) {
                        this.content = Number(this.maxValue).toLocaleString('pt-br', {minimumFractionDigits: this.format});
                    } else {
                        this.content = formatNumberToFront(this.maxValue, 0)
                    }
                }
            }

            this.$emit('input', this.content);
        },

        onEnterEmit: function(){
            this.$emit('enter-action', this.content);
        },

        emitHintAction: function(e) {
            if(this.hint.tooltip !== undefined) {
                openTooltip(e, this.hint.title, this.hint.log);
            } else {
                this.$emit('hint-action', this.checked);
            }
        },
        customButtonEvent: function(){
            this.$emit('custom-button-event', this.content);
        }
    }
});

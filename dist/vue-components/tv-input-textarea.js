var template = `
<div class="form-container">
    <div :id="'textarea-'+id" class="form-field form-textarea" :class="{'form-field--error': errorMessageDisplay !== '', 'form-field--log': (hint && hint.log)}">
        <textarea class="form-control" autocomplete="off" spellcheck="false"
            :id="id"
            :name="id"
            tabindex="0"
            v-model="content"
            :maxlength="maxLength"
            @focus="focusInput($event)"
            @blur="blurInput"
            @change="onChange"
            :disabled="disabled"
            :readonly="readonly"
            @keypress="formatSpaces($event)"
		></textarea>
        <div class="form-outline" :class="{'form-outline--active': content.length > 0 || focus, 'form-outline--focus': focus}">
            <div class="form-outline__prefix"></div>
            <div class="form-outline__middle">
                <label class="form-field__label" :for="id"><slot></slot></label>
            </div>
            <div class="form-outline__suffix"></div>
        </div>
        <i class="order-1 mr-3 tv-tooltip-btn" :class="[hint.icon]" :style="{'background-color':hint.bg, 'color': hint.color}" :title="(hint.tooltip) ? '' : hint.title" @click="emitHintAction($event)" v-if="hint"></i>
    </div>
    <div class="form-support" v-if="errorMessageDisplay !== '' || helperMessage !== '' || hasCharCount == true">
        <span class="form-support__help-message form-support__error-message" v-if="errorMessageDisplay !== ''">{{errorMessageDisplay}}</span>
        <span :id="id + '-help-message'"  class="form-support__help-message" v-if="errorMessageDisplay == ''">{{helperMessage}}</span>
        <span v-if="hasCharCount" class="form-support__character-count">{{charCount}}/{{maxLength}}</span>
    </div>
</div>
`;

Vue.component('tvInputTextarea', {
    props: {
        id: {
            type: String,
            required: true
        },
        helperMessage: {
            type: String,
            default: ''
        },
        errorMessage: {
            type: String,
            default: ''
        },
        hint: Object,
        maxLength: Number,
        hasCharCount: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        default: {
            type: String,
            default: ''
        },
        resize: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            content: this.default,
            focus: false,
            errorMessageDisplay: ''
        }
    },
    mounted: function() {
        if(this.resize) {
            this.resizeHeight();
        }
    },
    computed: {
        charCount: function() {
            return this.content.length;
        },
    },
    watch: {
        default: function() {
            this.content = this.default;
            const el = document.getElementById(this.id);
            if(el.value == '') {
                el.scrollTo(0, 0)
            }
        },
        content: function() {
            this.errorMessageDisplay = '';

            if(this.resize) {
                setTimeout(() => { this.resizeHeight(); }, 100);
            }

            this.$emit('keydown', this.content);
        },
        errorMessage: function() {
            this.errorMessageDisplay = this.errorMessage;
        }
    },
    template: template,
    methods: {
        focusInput: function(e){
            this.focus = true;
            e.target.select();
        },
        blurInput: function(){
            this.focus = false;
        },
        onChange: function(){
            this.$emit('input', this.content);
        },

        resizeHeight: function() {
            var el = document.getElementById(this.id);
            el.style.height = "auto";
            el.style.height = (el.scrollHeight) + "px";

            if(el.scrollHeight < 198) {
                el.style.overflow = "hidden";
            } else {
                el.style.overflow = "auto";
            }
        },

        emitHintAction: function(e) {
            if(this.hint.tooltip !== undefined) {
                openTooltip(e, this.hint.title, this.hint.log);
            } else {
                this.$emit('hint-action', this.checked);
            }
        },

        formatSpaces: function(e) {
            const content = this.content;
            if(e.keyCode == 32 && content == '' || e.keyCode == 32 && content.charAt(content.length - 1) == ' ') {
                e.preventDefault();
            }
        }
    }
})

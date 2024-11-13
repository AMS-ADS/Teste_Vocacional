var template = `
<div class="form-container">
    <div :id="'datepicker_' + id" class="form-field form-datepicker" :class="{'form-field--error': errorMessageDisplay !== '', 'form-field--log': (hint && hint.log)}" >
		<template v-if="mode == 'range'">
            <v-date-picker ref="vDatePicker"
                is-range
                color="tv-blue" 
                :key="datePickerKey"
                class="d-flex align-items-center"
                :class="{'form-datepicker--disabled': disabled}"
                v-model="content"
                :min-date="contentMinDate"
                :max-date="contentMaxDate"
                :popover="{ visibility: 'focus'}"
                :update-on-input="false"
                :attributes='attrs'
                @drag="focusInput()">
                <template v-slot="{ inputValue, inputEvents, updateValue, hidePopover }">
                    <input ref="start"
                        :id="id + '-inicial'"
                        :name="id + '-inicial'"
                        class="form-control text-right"
                        :value="inputValue.start"
                        :disabled="disabled"
                        autocomplete="off"
                        spellcheck="false"
                        tabindex="0"
                        v-on="inputEvents.start"
                        @focus="focusInput($event)"
                        @blur="hidePopover(); blurInput($event)"
                        @keypress="formatDate($event)"
                        onkeydown="return onlyNumbers(event)">

                    <span v-if="inputValue.start != null && !disabled"><i class="fas fa-arrow-right color-neutral tv-font-12"></i></span>

                    <input ref="end"
                        :id="id + '-final'"
                        :name="id + '-final'"
                        class="form-control text-left"
                        :value="inputValue.end"
                        :disabled="disabled"
                        autocomplete="off"
                        spellcheck="false"
                        tabindex="-1"
                        v-on="inputEvents.end"
                        @focus="focusInput($event)"
                        @blur="hidePopover(); blurInput($event)"
                        @keypress="formatDate($event)"
                        onkeydown="return onlyNumbers(event)">
                </template>
            </v-date-picker>
                        
            <button class="form-datepicker__clean form-field__icon" type="button" v-if="removeButton && content.start != null && !disabled" @click="clearDate()" tabindex="-1">
                <i class="fas fa-times"></i>
            </button>
        </template>

        <template v-else>
            <v-date-picker ref="vDatePicker"
                is24hr
                color="tv-blue" 
                class="d-flex align-items-center"
                :class="{'form-datepicker--disabled': disabled}"
                v-model="content"
                :min-date="contentMinDate"
                :max-date="contentMaxDate"
                :mode="mode"
                :popover="{visibility: 'focus'}"
                :update-on-input="false"
                :attributes='attrs'
                :available-dates="contentExceptionDate"
                disabled-dates="{}"
                @input="onChange">
                <template v-slot="{ inputValue, inputEvents, hidePopover }">
        			<input :id="id"
                        :name="id"
                        class="form-control text-center"
                        :value="inputValue + suffixValueContent"
                        :disabled="disabled"
                        autocomplete="off"
                        spellcheck="false"
                        tabindex="0"
                        v-on="inputEvents"
                        @focus="focusInput($event)"
                        @blur="hidePopover(); blurInput($event)"
                        @keypress="formatDate($event)"
                        onkeydown="return onlyNumbers(event)">
                </template>
    		</v-date-picker>
        </template>

        <div class="form-outline" :class="{'form-outline--active': (mode == 'range' && content.start != null) || (mode != 'range' && content != null) || focus, 'form-outline--focus': focus}">
            <div class="form-outline__prefix"></div>
            <div class="form-outline__middle">
                <label class="form-field__label" :for="id" :style="{ 'background-color': labelBg }"><slot></slot></label>
            </div>
            <div class="form-outline__suffix"></div>
        </div>

        <i class="order-1 mr-3 tv-tooltip-btn" :class="[hint.icon]" :style="{'background-color':hint.bg, 'color': hint.color}" :title="(hint.tooltip) ? '' : hint.title" @click="emitHintAction($event)" v-if="hint"></i>
    </div>

    <div class="form-support" v-if="errorMessageDisplay !== '' || helperMessage !== ''">
        <span class="form-support__help-message form-support__error-message" v-if="errorMessageDisplay !== ''">{{errorMessageDisplay}}</span>
        <span :id="id + '-help-message'"  class="form-support__help-message" v-if="errorMessageDisplay == ''">{{helperMessage}}</span>
    </div>
</div>
`;

Vue.component('TvInputDatepicker', {
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
        disabled: {
            type: Boolean,
            default: false
        },
        default: null,
        mode: {
            type: String,
            default: 'date'
        },
        minDate: {
            type: Date,
            default: null
        },
        maxDate: {
            type: Date,
            default: null
        },
        exceptionDate: {
            type: Date,
            default: null
        },
        maxRange: {
            type: Number,
            default: null
        },
        suffixValue: {
            type: String,
            default: ''
        },
        removeButton: {
            type: Boolean,
            default: true
        },
        labelBg: {
            type: String,
            default: ''
        },
    },
    
    data: function() {
        return {
            content: this.default,
            contentMinDate: this.minDate,
            contentMaxDate: this.maxDate,
            contentExceptionDate: {
                start: null,
                end: null
            },
            attrs: [
                {
                    highlight: {
                        style: {
                            backgroundColor: '#E8E8EA',
                        },
                    },
                    dates: new Date(),
                    popover: {
                        label: 'Hoje',
                    },
                }
            ],
            focus: false,
            datePickerKey: 0,
            suffixValueContent: '',
            errorMessageDisplay: '',
        }
    },

    template: template,

    mounted: function() {
        let datepickerForm = document.getElementById('datepicker_' + this.id);
        let popoverCalendar = null;

        if(this.disabled) {
            return
        }

        if(this.mode == 'range') {
            popoverCalendar = datepickerForm.children[0].children[3]
        } else {
            popoverCalendar = datepickerForm.children[0].children[1]
        }

        if(popoverCalendar) {
            popoverCalendar.style.zIndex = '98'
            popoverCalendar.setAttribute("id", "calendar_" + this.id)
            datepickerForm.insertAdjacentElement('beforebegin', popoverCalendar);
        }
    },

    watch: {
        default: function() {
            this.content = this.default;

            if(this.mode == 'range') {
                if(this.default.start != null && this.default.end != null) {
                    this.$refs.start.value = this.default.start
                    this.$refs.end.value  = this.default.end
                    
                    this.$refs.vDatePicker.value_ = {
                        start: this.content.start,
                        end: this.content.end
                    }
                    this.$refs.vDatePicker.dateParts[0].date = this.content.start
                    this.$refs.vDatePicker.dateParts[1].date  = this.content.end
                } else {
                    this.clearDate();
                }
            } else {
                if(this.default != null) {
                    this.$refs.vDatePicker.value_ = this.content
                    this.$refs.vDatePicker.dateParts[0].date = this.content
                }
            }
        },

        content: function() {
            if(this.mode == 'range') {
                if(this.maxRange != null) {
                    this.setMinMaxDate(this.content);
                }
            } else {
                if(this.content == null) {
                    this.suffixValueContent = ''
                }
            }

            this.errorMessageDisplay = '';
            this.$emit('change', this.content);
        },

        minDate: function(){
            this.contentMinDate = this.minDate;
            this.setExceptionDate();
        },

        maxDate: function(){
            this.contentMaxDate = this.maxDate
            this.setExceptionDate();
        },

        suffixValue: function() {
            this.suffixValueContent = this.suffixValue;
        },

        errorMessage: function() {
            this.errorMessageDisplay = this.errorMessage;
        },
    },

    methods: {
        focusInput: function(e = null) {
            if(e == null) {
                e = document.getElementById(this.id + '-inicial')
                e.focus();
                e.select();
            } else {
                e.target.select();
            }
            
            this.focus = true;
        },

        blurInput: function(e) {
            if(this.mode == 'range') {
                if(e.relatedTarget == null || e.relatedTarget.id !== `${this.id}-final`) {
                    this.focus = false;
                } else if(this.$refs.start.value == '') {
                    this.focus = false;
                }
            } else {
                this.focus = false;
            }

            this.$emit('blur', this.content);
        },
        
        formatDate: function(e) {
            if(e.target.value.length == 2 || e.target.value.length == 5) {
                e.target.value = `${e.target.value}/`;
            }
        },

        setMinMaxDate: function(e) {
            if(e !== null) {
                let minDateAux = moment(e.start).subtract(this.maxRange, 'days');
                let maxDateAux = moment(e.start).add(this.maxRange, 'days');
                
                if(this.minDate && moment(minDateAux).isBefore(this.minDate)) {
                    this.contentMinDate = this.minDate
                } else {
                    this.contentMinDate = minDateAux.toDate();
                }

                if(this.maxDate && !moment(maxDateAux).isBefore(this.maxDate)) {
                    this.contentMaxDate = this.maxDate
                } else {
                    this.contentMaxDate = maxDateAux.toDate();
                }
            } else {
                this.contentMinDate = this.minDate
                this.contentMaxDate = this.maxDate
            }
        },

        setExceptionDate: function() {
            if(this.minDate != null) {
                if(this.exceptionDate != null && this.exceptionDate != null && this.exceptionDate < this.minDate) {
                    this.contentExceptionDate.start = this.exceptionDate
                } else {
                    this.contentExceptionDate.start = this.minDate
                }
            } else {
                this.contentExceptionDate.start = null;
            }

            if (this.maxDate != null) {
                if(this.exceptionDate != null && this.exceptionDate != null && this.exceptionDate > this.maxDate) {
                    this.contentExceptionDate.end = this.exceptionDate
                } else {
                    this.contentExceptionDate.end = this.maxDate
                }
            } else {
                this.contentExceptionDate.end = null;
            }

        },

        emitHintAction: function(e) {
            if(this.hint.tooltip !== undefined) {
                openTooltip(e, this.hint.title, this.hint.log);
            } else {
                this.$emit('hint-action', this.checked);
            }
        },

        clearDate: function() {
            this.content.start = null;
            this.content.end = null;
            this.datePickerKey++;
        },

        onChange: function() {
            this.$emit('input', this.content);
        }
    }
})

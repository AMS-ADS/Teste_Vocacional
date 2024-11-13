var template = `
<div class="form-selection" :class="[altClass, {'form-selection--reverse': reverse}]">
	<div class="form-checkbox" :class="{'form-checkbox--active': checked}">
		<input class="form-checkbox__input" type="checkbox" tabindex="0"
			:id="id"
			:name="id"
			:disabled="disabled"
			v-model="checked"
			@change="onChange"
			@keydown.enter="checked = !checked; onChange()"
		>
		<div class="form-checkbox__background">
			<i class="form-checkbox__checkmark fas fa-check"></i>
		</div>
		<div class="form-checkbox__underlay"></div>
	</div>
	<label class="form-selection__label"><slot></slot></label>
</div>
`;

Vue.component('TvInputCheckbox', {
    props: {
		id: {
			type: String,
			required: true
		},
		altClass:{
			type: String,
			default: ''
		},
		default: {
			type: Boolean,
			default: false
		},
		disabled: {
            type: Boolean,
            default: false
        },
		reverse: {
			type: Boolean,
			default: false
		}
    },
    data: function() {
        return {
            checked: this.default
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
        }
    }
})

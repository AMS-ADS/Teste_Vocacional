var template = `
<button class="btn-float btn-float--square" @click="scrollTop" v-show="visible">
	<i class="fas fa-chevron-up btn-float__icon"></i>
</button>
`;

Vue.component('tvBacktotop', {
    data: function() {
        return {
            visible: false
        }
    },
    template: template,
    methods: {
		scrollTop: function () {
	        window.scrollTo({ top: 0, behavior: 'smooth' })
	    },
	    scrollListener: function (e) {
	    	this.visible = window.scrollY > 200;
	    }
    },
	mounted: function () {
		window.addEventListener('scroll', this.scrollListener)
  	},
  	beforeDestroy: function () {
    	window.removeEventListener('scroll', this.scrollListener)
  	}
})

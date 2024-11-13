var template = `
<div class="w-100 h-100">
	<canvas :id="id" class="w-100 h-100" :aria-label="title" role="img"></canvas>
</div>
`;

Vue.component('tvChart', {
	props: {
		id: {
			type: String,
            required: true
		},
		title: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			required: true
		},
		config: {}
	},
    data: function() {
		return {
			type: this.type
        }
    },

    template: template,

	mounted: function() {
		Chart.defaults.font.size = 10;
		const ctx = document.getElementById(this.id);
		// const colors = ['#5C8DF4', '#74D1E9', '#2B2B8A', '#7A7AA8', '#006FB3', '#0046D6', '#4AA5F9', '#759AFF', '#99B6FF', '#BBD3FF', '#BFE7FF', '#80CFFF', "#0066FF"];

		const colors = ['#5C8DF4', '#ffc164', '#2B2B8A', '#7A7AA8', '#006FB3', '#0046D6', '#4AA5F9', '#759AFF', '#99B6FF', '#BBD3FF'];

		let legendAux = this.config.datasets.length > 1 ? true : false;
		let datasetsAux = [];
		this.config.datasets.forEach(dataset => {
			datasetsAux.push({
				label: dataset.label,
				borderColor: dataset.color,
				borderJoinStyle: 'round',
				borderRadius: 4,
				pointBorderColor: dataset.color,
				pointBackgroundColor: dataset.color,
				backgroundColor: colors,
				pointBorderWidth: 0.2,
				fill: true,
				tension: 0.1,
				data: dataset.data,
			})
		});

    	new Chart(ctx, {
			type: this.type,
			data: {
				labels: this.config.label,
				datasets: datasetsAux
			},
			options: {
				animation: false,
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: legendAux,
						position: 'bottom',
						labels: {
							boxHeight: 6,
							padding: 10,
							usePointStyle: true,
							pointStyleWidth: 8,
							color: '#757389',
							font: {
								size: 12
							}
						}
					},
					tooltip: {
						displayColors: false,
						titleFont: {
							size: 12
						},
						bodyFont: {
							size: 12
						},
						callbacks: {
							label: function(context) {
								return `R$ ${formatNumberToFront(context.raw, 2)}`
							}
						}
					}
				},
				scales: {
					x: {
						display: false,
					},
					y: {
						border: {
							dash: [3, 10],
							dashOffset: 1
						},
						grid: {
							circular: true
						}
					}
				}
			}
		});
	}
});

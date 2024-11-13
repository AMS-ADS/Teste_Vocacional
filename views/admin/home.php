<?php
    include '../../includes/route.php';
    include '../../config/sessao.php';
    include '../../includes/header.php';
    include '../../includes/alert-banner.php';
    include '../../includes/alert-dialog.php';
    include '../../includes/alert-snackbar.php';
?>

<div id="home-el">
	<tv-home
        v-cloak inline-template>
        <div>
            <section class="content-favorite">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12 col-xl-auto mb-3 mb-xl-0" style="width: 300px">
                            <div class="tv-card h-100">
                                <p class="mb-3 font-weight-bold"><i class="fa fa-filter mr-1"></i> Parâmetros</p>
                                <div class="row">
                                    <div class="col-12">
                                        <div class="form-group">
                                            <tv-input-select id="curso" v-model="filter.curso" :default="filter.curso" :options="list.curso">Curso</tv-input-select>
                                        </div>
                                        <hr style="color: var(--neutral-100);">
                                    </div>
                                    <div class="col-12">
                                        <p class="tv-font-11 color-neutral font-weight-bold mb-2 mt-2">ANO</p>
                                    </div>
                                    <div class="col-12">
                                        <div class="row">
                                            <div v-for="ano in list.anos" :key="'ano' + ano" class="col-6">
                                                <tv-input-checkbox :id="'anos' + ano" v-model="filter.anos" :default="filter.anos">{{ ano }}</tv-input-checkbox>
                                            </div>
                                        </div>
                                        <hr style="color: var(--neutral-100);">
                                    </div>
                                    <div class="col-12">
                                        <p class="tv-font-11 color-neutral font-weight-bold mb-2">SEMESTRE</p>
                                    </div>
                                    <div class="col-12">
                                        <div class="row">
                                            <div v-for="semestre in list.semestre" :key="'semestre' + semestre" class="col-6">
                                                <tv-input-checkbox :id="'semestre' + semestre" v-model="filter.semestre" :default="filter.semestre">{{ semestre }}</tv-input-checkbox>
                                            </div>
                                        </div>
                                        <hr style="color: var(--neutral-100);">
                                    </div>
                                    <div class="col-12">
                                        <p class="tv-font-11 color-neutral font-weight-bold mb-2">PERÍODO</p>

                                        <div class="row">
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <tv-input-datepicker id="filter-periodo-vencimento-start" v-model="filter.periodo.start" :default="filter.periodo.start">Inicial</tv-input-datepicker>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <tv-input-datepicker id="filter-periodo-vencimento-end" v-model="filter.periodo.end" :default="filter.periodo.end" :min-date="filter.periodo.start">Final</-input-datepicker>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-xl-auto" style="width: calc(100% - 300px)">
                            <div class="tv-card h-100">
                                <div class="row">
                                    <div class="col-12 col-lg-12">
                                        <div>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h2 style="color: var (--primary-dark);">Registros de pessoas</h2>
                                                </div>
                                                <div>
                                                    <button id="dados" class="btn-icon" title="Visualizar dados">
                                                    <i class="fas fa-file-invoice"></i>
                                                </button>
                                                </div>
                                            </div>
                                            
                                            <hr class="mt-1" style="color: var(--neutral-100);">
                                            <tv-chart :id="'my-chart-compra'" :title="'Gráfico Simples'" :type="'bar'" :config="graficoCompras"></tv-chart>
                                        </div>
                                    </div>
                                    <!-- <div class="col-12 col-lg-6">
                                        <div class="tv-card">
                                            <h2 class="mb-2 p-1" style="color: var (--primary-dark);">Análise reográfica de pessoas</h2>
                                            <hr style="color: var(--neutral-100); height: 5px important;">
                                            <tv-chart :id="'my-chart-cidade'" :title="'Gráfico Simples'" :type="'doughnut'" :config="graficoCidade"></tv-chart>
                                        </div>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
	</tv-home>
</div>

<script src="<?php echo $route ?>dist/vendors/Vue/axios.min.js"></script>
<script src="<?php echo $route ?>dist/vendors/chart/Chart.js"></script>
<script src="<?php echo $route ?>dist/vendors/vcalendar/vcalendar.min.js"></script>
<script src="<?php echo $route ?>dist/vendors/moment/moment.min.js"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-chart.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-checkbox.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-select.js?rls=<?=$release?>"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-datepicker.js?rls=<?=$release?>"></script>

<script>
    const tvHome = {
        data: function () {
            return {
                graficoCompras: {
                    datasets: [],
                    label: []
                },
                graficoCidade: {
                    datasets: [],
                    label: []
                },
                dados: ['Jan', 'Fev', 'Marc', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                cidade: ['São Paulo', 'Tatuí', "Capela do Alto", "Iperó", "Boituva"],
                list: {
                    anos: [],
                    semestre: ['Primeiro', 'Segundo', 'Terceiro', 'Quarto'],
                    curso: [],
                },
                filter: {
                    anos: false,
                    semestre: false,
                    periodo: {
                        start: null,
                        end: null
                    },
                    curso: null
                }
            }
        },

        created: function() {
            this.getLastFiveYears();
            this.getCursoSelect();
            this.graficoCompras.datasets.push({ label: 'Pessoas', data: [80, 50, 60, 60, 90, 12, 12, 45, 100, 10, 20, 20], color: '#0046D6', bg: '#0047d649'})
            for (let i of this.dados) {
	    		this.graficoCompras.label.push(i)
			}

            this.graficoCidade.datasets.push({ label: 'Cidades', data: [80, 50, 60, 60, 90], color: '#0046D6'})
            for (let i of this.cidade) {
	    		this.graficoCidade.label.push(i)
			}
        },

        methods: {
            getLastFiveYears: function() {
                this.list.anos = [];
                for (let i = 0; i < 5; i++) {
                    let dataAux = moment().subtract(i, 'years').format('YYYY');
                    this.list.anos.push(dataAux);
                }

                return this.list.anos;
            },

            getCursoSelect: function() {
                this.list.curso = [];

                var settings = {
                    url: "homeBack.php?acao=getCursoSelect",
                    metodo: "GET",
                    envio: "",
                    async: false
          	    };
        	    sendUrlAxios(settings,this.getCursoSelectCallback);   
            },
            getCursoSelectCallback: function(status, response) {
                if(status == 200) {
                    this.list.curso = response.data
                } else {
                    this.list.curso = [];
                }
            }


        }
    }

    new Vue({
        el: '#home-el',
        components: {
		    tvHome: tvHome
	    }
    })

</script>

<?php
    include $root.'includes/footer.php';
?>

var tvPergunta = {
    data: function() {
        return {
            template: 0,
            viewMode: false,
            isEditing: false,
            authorizedEdit: true,
            tableEndpoint: `back-end/pergunta.php?acao=getCursoId`,
            defaultTables: {
                id: 'perguntas',
				title: 'Perguntas',
				columns: [
                    { name:'ID',title:'ID',type:'int',size: 5, hide: true },
                    { name: 'PRIMEIRA', title: 'Primeira pergunta', type: 'string', size: 100 },
                    { name: 'SEGUNDA', title: 'Segunda pergunta', type: 'string', size: 100 },
                    { name: 'TERCEIRA', title: 'Terceira pergunta', type: 'string', size: 100 },
                    { name: 'QUARTA', title: 'Quarta pergunta', type: 'string', size: 100 },
                    { name: 'QUINTA', title: 'Quinta pergunta', type: 'string', size: 100 }
                ]
            },
            form: {
                id: '0',
                pergunta1: '',
                pergunta2: '',
                pergunta3: '',
                pergunta4: '',
                pergunta5: '',
            },
            errors: {
                primeira: '',
                segunda: '',
                terceira: '',
                quarta: '',
                quinta: '',
            },
            recordIndex: [],
        }
    },
    props: {
        cursoCoordenador: {
			type: Number,
            required: true
		},
       
    },
    computed: {
        
    },
    created: function() {
        this.getPerguntaId();
        this.template = 1;
    },
    watch:{
        
    },
    methods: {
        refreshTables: function(e) {
			this.table_column = e[0].columns.slice();
			toggleTasLoad('hide');
		},
        backPage: function(){
            if(!this.isEditing){
                this.backPageConfirm();
            }else{
                //Abre modal para confirmar que você quer mudar de tela mesmo;
                var vue = this;
                $('#alert_dialog').modal();
                document.getElementById("dialog_msg").innerHTML = "Deseja realmente cancelar a operação?";
                document.getElementById("dialog_btn_close_text").innerHTML = "Não";
                document.getElementById("dialog_btn_text").innerHTML = "Sim";
                document.getElementById("dialog_btn").classList.add("btn-action--danger");
                document.getElementById("dialog_btn").onclick = function(){ vue.backPageConfirm() };
            }
        },
        backPageConfirm: function(){
			$('#alert_dialog').modal('hide');
            this.resetErrors();
			this.resetForm();
            this.isEditing = false;
			this.template = 1;
		},

        newRecover: function(){
            this.resetErrors();
            this.resetForm();
            this.template = 1;
            setTimeout(() => {this.focusFirstField("pergunta_form")}, 100);
        },

        addRecover: function (onEdit) {
            setTimeout(() => {this.focusFirstField("pergunta_form")}, 100);
            let metodo = "POST";
        
            if (onEdit) {
                metodo = "PUT";
            }

            console.log(this.form.id)

            var settings = {
                url: 'back-end/pergunta.php?acao=addRecover',
                method: metodo,
                envio: {
                    id: this.form.id,
                    primeira: this.form.pergunta1,
                    segunda: this.form.pergunta2,
                    terceira: this.form.pergunta3,
                    quarta: this.form.pergunta4,
                    quinta: this.form.pergunta5,
                    curso: this.cursoCoordenador                
                },
                async: false
            };
        
            sendUrlAxios(settings, this.addRecoverCallback);
        },        
        addRecoverCallback: function (status,response){
            if(status == 201){
                alertBannerDismiss();
                this.isEditing = false;
                alertSnackbar("Registro adicionado com sucesso.");
                this.getPerguntaId();
                this.resetForm();
            }else if(status == 200){
                alertBannerDismiss();
                alertSnackbar("Registro editado com sucesso.");
                this.getPerguntaId();
                this.resetForm();
            } else {
                this.displayErrors(response);
            }
        },

        getPerguntaId: function() {
            var settings = {
                url: `back-end/pergunta.php?acao=getPerguntaId&id=${this.cursoCoordenador}`,
                metodo: "GET",
                envio: "",
                async: false
            };
            sendUrlAxios(settings,this.getPerguntaIdCallback);
        },
        getPerguntaIdCallback: function(status, response) {
            if(status == 200){
                this.form.id = response.data.id.toString();
                this.form.pergunta1 = response.data.primeira;
                this.form.pergunta2 = response.data.segunda;
                this.form.pergunta3 = response.data.terceira;
                this.form.pergunta4= response.data.quarta;
                this.form.pergunta5 = response.data.quinta;
            }else if (status == 500) {
                alertBanner(500);
            }
        },

        recoverData: function(type,status,response) {
			var result = response.data;
			this.resetErrors();
			this.resetForm();
            console.log(result);

            if(status == 200){
				if(type == "edit"){
                    this.isEditing = true;
				} else if(type == "view"){
					this.viewMode = true;
				}
                
                this.getRecordIndex(result.id);
                this.form.id = result.id;
                this.form.codigo = result.codigo;
                this.form.descricao = result.descricao;

				this.template = 1;
        	}
        },

        resetErrors: function() {
            this.errors.primeira = '';
            this.errors.segunda = '';
            this.errors.terceira = '';
            this.errors.quarta = '';
            this.errors.quinta = '';
        },

        resetForm: function() {
            this.viewMode = false;
            this.isEditing = false;
            this.form.id = '0';
            this.form.pergunta1 = '';
            this.form.pergunta2 = '';
            this.form.pergunta3 = '';
            this.form.pergunta4 = '';
            this.form.pergunta5 = '';

            this.recordIndex = [];
        },
        // *************** COMMON FUNCTIONS ***************

		// Pula para o anterior ou próximo registro no modo visualização
		skipRecord: function(direction){
			var index = this.$refs.tasDatatable.dataFiltered.findIndex(x => x.data.LOGIN.value == this.form.login);
			if(direction == 'back'){
				if(index - 1 != -1){
					this.resetErrors();
					this.resetForm();
					setTimeout(() => {
						$('.dropdown-toggle').dropdown();
					}, 100);

					var id = this.$refs.tasDatatable.dataFiltered[index - 1].data.LOGIN.value;

					var settings = {
	            	   	url: HIT10URL + '/usuario/' + id,
	            	  	metodo: "GET",
	            		envio: "",
	            	  	async: false
	              	};
	                sendUrlAxios(settings,this.viewRecordCallback);
				}
			}else if(direction == 'next'){
				if(index != this.$refs.tasDatatable.dataFiltered.length - 1){
					this.resetErrors();
					this.resetForm();
					setTimeout(() => {
						$('.dropdown-toggle').dropdown();
					}, 100);

					var id = this.$refs.tasDatatable.dataFiltered[index + 1].data.LOGIN.value;

					var settings = {
	            	   	url: HIT10URL + '/usuario/' + id,
	            	  	metodo: "GET",
	            		envio: "",
	            	  	async: false
	              	};
	                sendUrlAxios(settings,this.viewRecordCallback);
				}
			}
		},

		// Pega o index do registro atual
        getRecordIndex: function (id) {
			this.recordIndex = [];
			var index = this.$refs.tasDatatable.dataFiltered.findIndex(x => x.data.ID.value == id);
			this.recordIndex = this.$refs.tasDatatable.dataFiltered[index];
		},

		// Botões de ação dentro do registro
		editRecordInside: function(){
			this.viewMode = false;
			this.isEditing = true;
        },
		cloneRecordInside: function(){
			this.form.login = "";
			this.viewMode = false;
			this.isEditing = true;
        },
		deleteRecordInsideDialog: function(){
            var vm = this;
        	$('#alert_dialog').modal();
            document.getElementById("dialog_msg").innerHTML = "Deseja excluir este item ?";
			document.getElementById("dialog_btn_text").innerHTML = "Excluir";
        	document.getElementById("dialog_btn").classList.add("btn-action--danger");
        	document.getElementById("dialog_btn").onclick = function(){ vm.deleteRecordInside(vm.form.login)};
        },
		deleteRecordInside: function(id){
			$('#alert_dialog').modal('hide');

            var settings = {
                url: `back-end/pergunta?acao=deleteRecordInside&id=${id}`,
                metodo: "DELETE",
                envio: "",
                async: false
            };
            sendUrlAxios(settings,this.deleteRecordCallback);
		},

        // Callback dos botões de ação da tabela
		viewRecordCallback: function(status,response) {
			this.recoverData("view",status,response);
		},
		editRecordCallback: function(status,response) {
			this.recoverData("edit",status,response);
		},
		deleteRecordCallback: function (status,response){
			if(status == 200){
				this.template = 1;
				this.getTableData();
				alertSnackbar("Registro excluído com sucesso.");
			}else{
				alertBanner(response[0].userMessage);
			}
		},

        // Apresenta erros nos campos e foca no primeiro
		displayErrors: function(response) {
            for (var key in response) {
                if (Number.isInteger(Number(key))) {
                    var error = response[key];
                    if (error.field && error.field != "") {
                        var aux_id = error.field.replace(".", "_");
                        this.errors[aux_id] = error.userMessage;
                    } else {
                        alertBanner(error.userMessage);
                    }
                }
            }
        
            var focus = false;
            for (var key in this.errors) {
                if (!focus && this.errors[key] != "") {
                    var element = document.getElementById(key);
                    if (element) {
                        element.focus();
                        focus = true;
                    }
                }
            }
        }, 

		// Focar no primeiro campo de um formulário ou no campo indicado (singleField) se houver.
		focusFirstField: function(container, singleField){
			var focus = false;
			var container = document.getElementById(container);
			var inputs = container.getElementsByTagName('input');

			for (var i = 0; i < inputs.length; ++i) {
				if(!focus && singleField !== undefined && !inputs[singleField].disabled){
					inputs[singleField].focus();
					focus = true;
				}else if(!focus && !inputs[i].disabled){
					inputs[i].focus();
					focus = true;
				}
			}
		}
    }
}

new Vue({
    el: '#app',
    data: {
        template: 1,
    },
    components: {
        tvPergunta: tvPergunta
    }
})

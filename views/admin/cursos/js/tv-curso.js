var tvCurso = {
    data: function() {
        return {
            template: 0,
            viewMode: false,
            isEditing: false,
            authorizedEdit: true,
            tableEndpoint: `back-end/curso.php?acao=getCursoId`,
            defaultTables: {
                id: 'cursos',
				title: 'Cursos',
				columns: [
                    {name:'ID',title:'ID',type:'int',size: 5, hide: true},
                    {name:'CODIGO',title:'Código',type:'string',size: 10},
                    {name:'DESCRICAO',title:'Descrição',type:'string',size: 50},
                    {name:'SOBRE',title:'Sobre',type:'string',size: 50},
                ]
            },
            table_column: [],
            table_row: [],
            form: {
                id: 0,
                codigo: '',
                descricao: '',
                sobre: ''
            },
            errors: {
                codigo: '',
                descricao: '',
                sobre: ''
            },
            recordIndex: [],
        }
    },
    props: {
       
    },
    computed: {
        
    },
    created: function() {
        this.getTableData();
        this.template = 1;
        this.table_column = this.defaultTables.columns;
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
            this.getTableData();
            this.isEditing = false;
			this.template = 1;
		},

        newRecover: function(){
            this.resetErrors();
            this.resetForm();
            this.template = 2;
            setTimeout(() => {this.focusFirstField("curso_form")}, 100);
        },

        addRecover: function (onEdit) {
            setTimeout(() => {this.focusFirstField("curso_form")}, 100);
            let metodo = "POST";
        
            if (onEdit) {
                metodo = "PUT";
            }

            console.log(this.form.id)

            var settings = {
                url: 'back-end/curso.php?acao=addRecover',
                method: metodo,
                envio: {
                    id: this.form.id,
                    codigo: this.form.codigo,
                    descricao: this.form.descricao,
                    sobre: this.form.sobre
                },
                async: false
            };
        
            sendUrlAxios(settings, this.addRecoverCallback);
        },        
        addRecoverCallback: function (status,response){
            if(status == 201){
                alertBannerDismiss();
                this.getTableData();
                this.template = 1;
                this.isEditing = false;
                alertSnackbar("Registro adicionado com sucesso.");
                this.resetForm();
            }else if(status == 200){
                alertBannerDismiss();
                this.getTableData();
                this.template = 1;
                this.isEditing = false;
                alertSnackbar("Registro editado com sucesso.");
                this.resetForm();
            }else if (status == 500) {
                alertBanner(500);
            }else{
                this.resetErrors();
				this.displayErrors(response);
            }
        },

        getCodigo: function() {
            var settings = {
                url: `back-end/curso.php?acao=getCodigo&descricao=${this.form.descricao}&codigo=${this.form.codigo}`,
                metodo: "GET",
                envio: "",
                async: false
            };
            sendUrlAxios(settings,this.getCodigoCallback);
        },
        getCodigoCallback: function(status, response) {
            if(status == 200){
                this.form.codigo = response.data
                console.log(response);
            }else if (status == 500) {
                alertBanner(500);
            }
        },

        getTableData: function () {
        	var settings = {
        	   	url: "back-end/curso.php?acao=getTableData",
        	  	metodo: "GET",
        		envio: "",
        	  	async: false
          	};
        	sendUrlAxios(settings,this.setTableData);
        },
        setTableData: function (status,response) {
            this.table_row = [];
            var aux_row = [];

        	if(status == 200){
        		var aux_tabela_info = response.data;
                var i;
                for (i = 0; i < aux_tabela_info.length; i++) {
                    aux_row.push({
                        data: {
                            ID: {
                                value: aux_tabela_info[i].id
                            },
                            CODIGO: {
                                value: aux_tabela_info[i].codigo
                            },
                            DESCRICAO: {
                                value: aux_tabela_info[i].descricao
                            },
                            SOBRE: {
                                value: aux_tabela_info[i].sobre
                            }
                        },
                        buttons: {
							edit: {
								displayInline: this.authorizedEdit,
								disable: !this.authorizedEdit
							},
							clone: false,
							delete: {
								displayInline: this.authorizedEdit,
								disable: !this.authorizedEdit
							},
                        }
                    });
                }

                this.table_row = aux_row;
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
                this.form.sobre = result.sobre;

				this.template = 2;
        	}
        },

        resetErrors: function() {
            this.errors.codigo = '';
            this.errors.descricao = '';
            this.errors.sobre = '';
        },

        resetForm: function() {
            this.viewMode = false;
            this.isEditing = false;
            this.form.id = 0,
            this.form.codigo = "",
            this.form.descricao = "";
            this.form.sobre = "";

            this.recordIndex = [];
        },
        // *************** COMMON FUNCTIONS ***************

		// Pula para o anterior ou próximo registro no modo visualização
		skipRecord: function(direction){
			var index = this.$refs.tasDatatable.dataFiltered.findIndex(x => x.data.ID.value == this.form.id);
			if(direction == 'back'){
				if(index - 1 != -1){
					this.resetErrors();
					this.resetForm();
					setTimeout(() => {
						$('.dropdown-toggle').dropdown();
					}, 100);

					var id = this.$refs.tasDatatable.dataFiltered[index - 1].data.ID.value;

					var settings = {
                        url: `${this.tableEndpoint}&id=${id}&subacao=get`,
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

					var id = this.$refs.tasDatatable.dataFiltered[index + 1].data.ID.value;

					var settings = {
	            	   	url: `${this.tableEndpoint}&id=${id}&subacao=get`,
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
                url: `back-end/curso?acao=deleteRecordInside&id=${id}`,
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
        tvCurso: tvCurso
    }
})

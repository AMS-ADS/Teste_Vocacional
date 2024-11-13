var tvUsuario = {
    data: function() {
        return {
            template: 0,
            viewMode: false,
            isEditing: false,
            authorizedEdit: true,
            senhaIcon: '',
            senhaType: 'password',
            tableEndpoint: `back-end/usuario.php?acao=getUsuarioId`,
            defaultTables: {
                id: 'usuarios',
				title: 'Usuários',
				columns: [
                    {name:'LOGIN',title:'Login',type:'string',size: 100},
                    {name:'NOME',title:'Nome',type:'string',size: 100},
                    {name:'EMAIL',title:'E-mail',type:'string',size: 100},
                    {name:'CURSO',title:'Curso',type:'string',size: 100},
                    {name:'INSTITUICAO',title:'Instituição',type:'string',size: 5},
                    {name:'NIVEL_ACESSO',title:'Nível acesso',type:'string',size: 10},
                ]
            },
            table_column: [],
            table_row: [],
            form: {
                login: '',
                senha: '',
                nome: '',
                email: '',
                nivelAcesso: 'Administrador',
                instituicao: 'Fatec',
                curso: null,
            },
            errors: {
                login: '',
                senha: '',
                nome: '',
                email: '',
                instituicao: '',
                curso: '',
            },
            botaoGravar: true,
            list: {
                nivelAcesso: ['Administrador', 'Coordenador'],
                instituicao: ['Fatec', 'Etec'],
                curso: []
            },
            recordIndex: [],
            showCursoSelect: false,
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
        'form.nivelAcesso'() {
            if(this.form.nivelAcesso == 'Coordenador') {
                this.showCursoSelect = true;
                this.getCursoSelect();
            } else {
                this.showCursoSelect = false;
                this.form.cuso = null;
            }
        },
        'form.instituicao'() {
                this.getCursoSelect();
        }
    },
    methods: {
        refreshTables: function(e) {
			this.table_column = e[0].columns.slice();
			toggleTasLoad('hide');
		},
        togglePassword: function () {
            if(this.senhaType == 'password') {
                this.senhaIcon = 'fas fa-eye-slash';
                this.senhaType = 'text';
            } else {
                this.senhaIcon = 'fas fa-eye';
                this.senhaType = 'password';
            }
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
            this.senhaIcon = 'fas fa-eye';
            this.botaoGravar = true;
            this.template = 2;
            setTimeout(() => {this.focusFirstField("usuario_form")}, 100);
        },

        addRecover: function (onEdit) {
            var metodo = "POST";
        
            if (onEdit) {
                metodo = "PUT";
            }

            let nivelAcessoAux = 1
            if(this.form.nivelAcesso == 'Coordenador') {
                nivelAcessoAux = 2
            }

            var settings = {
                url: 'back-end/usuario.php?acao=addRecover',
                method: metodo,
                envio: {
                    login: this.form.login,
                    senha: this.form.senha,
                    nome: this.form.nome,
                    email: this.form.email,
                    nivelAcesso: nivelAcessoAux,
                    instituicao: this.form.instituicao,
                    curso: this.form.curso
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

        getTableData: function () {
        	var settings = {
        	   	url: "back-end/usuario.php?acao=getTableData",
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
                    if(aux_tabela_info[i].nivelAcesso == 1) {
                        aux_tabela_info[i].nivelAcesso = 'Administrador';
                    } else {
                        aux_tabela_info[i].nivelAcesso = 'Coordenador';
                    }

                    aux_row.push({
                        data: {
                            LOGIN: {
                                value: aux_tabela_info[i].login
                            },
                            NOME: {
                                value: aux_tabela_info[i].nome
                            },
                            EMAIL: {
                                value: aux_tabela_info[i].email
                            },
                            NIVEL_ACESSO: {
                                value: aux_tabela_info[i].nivelAcesso
                            },
                            INSTITUICAO: {
                                value: aux_tabela_info[i].instituicao
                            },
                            CURSO: {
                                value: aux_tabela_info[i].curso
                            }
                        },
                        buttons: {
							edit: {
								displayInline: this.authorizedEdit,
								disable: !this.authorizedEdit
							},
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

        getCursoSelect: function() {
            this.list.curso = [];

            var settings = {
                url: `back-end/usuario.php?acao=getCursoSelect&instituicao=${this.form.instituicao}`,
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
        },

        recoverData: function(type,status,response) {
			var result = response.data;
			this.resetForm();
			this.resetErrors();

            if(status == 200){
				if(type == "edit"){
                    this.isEditing = true;
				}else if(type == "view"){
					this.viewMode = true;
				}

                this.getRecordIndex(result.login);
                this.form.login = result.login;
                this.form.senha= result.senha;
                this.form.email = result.email;
                this.form.instituicao = result.instituicao;
                this.form.curso = result.curso;
                this.form.nome = result.nome;
                console.log(result.nivelAcesso)
                if(result.nivelAcesso == 1) {
                    this.form.nivelAcesso = 'Administrador';
                } else {
                    this.form.nivelAcesso = 'Coordenador';
                }

				this.template = 2;
        	}
        },

        verificaLogin: function () {
            this.errors.login = '';
            this.botaoGravar = true;
            setTimeout(() => {
                var i;
                for (i = 0; i < this.table_row.length; i++) {
                    var login = this.table_row[i].data.LOGIN.value;
                    if(this.form.login == login) {
                        this.errors.login = "Nome de login já existente.";
                        this.botaoGravar = false;
                    }
                }
            }, 50)
        },

        resetErrors: function() {
            this.errors.login = '';
            this.errors.senha = '';
            this.errors.nome = '';
            this.errors.email = '';
            this.errors.instituicao = '';
            this.errors.curso = '';
        },

        resetForm: function() {
            this.viewMode = false;
            this.isEditing = false;
            this.form.login = "",
            this.form.senha = "";
            this.form.nome = "";
            this.form.email = "";
            this.form.nivelAcesso = "Administrador";
            this.form.instituicao = 'Fatec';
            this.form.curso = null;
            this.senhaIcon = '';
            this.senhaType = 'password';

            this.showCursoSelect = false;
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

					var id = this.$refs.tasDatatable.dataFiltered[index + 1].data.LOGIN.value;

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
			var index = this.$refs.tasDatatable.dataFiltered.findIndex(x => x.data.LOGIN.value == id);
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
                url: `${this.tableEndpoint}&id=${id}&subacao=delete`,
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
        tvUsuario: tvUsuario
    }
})

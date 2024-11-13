var template = `
<div>
    <div id="datatable-config-dialog" class="tv-dialog modal fade" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="datatable_dialog" aria-hidden="true">
        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="d-flex align-items-center">
                        <h2 v-show="layout == 'view'">Personalizar tabela</h2>
                        <h2 v-show="layout == 'new'">Adicionar perfil</h2>
                        <h2 v-show="layout == 'edit'">Editar perfil</h2>
                        <h2 v-show="layout == 'delete'">Excluir perfil</h2>

                        <button class="btn-action btn-action--icon btn-action--contain btn-action--primary ml-2" :title="list.profiles.length < 3 ? 'Adicionar perfil' : 'Você já atingiu o limite de perfis para essa tabela'" :disabled="dataLoading || list.profiles.length == 3" @click="newProfile()" v-if="layout == 'view'">
                            <i class="btn-action__icon fa fa-plus"></i>
                            <div class="btn-action__underlay"></div>
                        </button>
                    </div>
                </div>

			    <div class="modal-body">
                    <div class="tv-loading tv-loading--modal" v-if="dataLoading">
                        <div class="tv-loading__spinner"></div>
                        <img class="tv-loading__icon" :src="this.route + '/dist/images/turion-simbolo.svg'">
                    </div>

                    <div class="modal-overflow" style="max-height: calc(100vh - 190px)" :class="{'py-2': layout == 'view' }">
                        <div v-show="layout == 'view'">
                            <p class="color-neutral mb-2" v-if="list.profiles.length > 0"><i class="fas fa-pencil-ruler mr-1"></i> <span class="font-weight-medium">Perfis</span> ({{ list.profiles.length }}/3)</p>

                            <div class="tv-card tv-card--outline px-1"
                                v-for="(profile, profileI) in list.profiles"
                                :key="profile.id">

                                <div class="d-flex align-items-center">
                                    <tv-input-radio class="mr-auto" v-model="selectedProfile" :default="selectedProfile" :options="[profile.descricao]" v-on:input="setCurrentProfile(profile.id)"></tv-input-radio>
                                    
                                    <button class="btn-icon" type="button" title="Editar perfil" @click="getProfile(profile.id)">
                                        <i class="fas fa-pen"></i>
                                    </button>
                                </div>
                            </div>

                            <tv-input-radio v-model="selectedProfile" :default="selectedProfile" :options="['Padrão do sistema']" v-on:input="setToDefaultProfile()" class="mt-3" style="margin-left: 5px" v-if="list.profiles.length > 0"></tv-input-radio>
                        </div>

                        <div class="py-3 px-2" v-show="layout == 'new' || layout == 'edit' && filteredColumns.length > 0">
                            <tv-input-text id="datatable-config-profile-name" class="mb-3" v-model="form.descricao" :default="form.descricao" :error-message="profileNameError">Nome do perfil</tv-input-text>

                            <div class="mb-4" v-if="list.tables.length > 1">
                                <p class="color-neutral font-weight-medium mb-3"><i class="fas fa-table mr-1"></i> Tabelas</p>

                                <tv-input-select id="datatable-config-profile-tables" v-model="selectedTable" :default="selectedTable" :options="list.tables" :display-codigo="false" :remove-button="false" :new-config="true">Selecione uma tabela</tv-input-select>
                            </div>

                            <div class="mb-3" v-if="form.tables.length > 1 && form.tables[selectedIndexTable]['groups']">
                                <tv-input-select id="datatable-config-profile-tables" v-model="form.tables[selectedIndexTable]['groupSelected']" :default="form.tables[selectedIndexTable]['groupSelected']" :options="tables[selectedIndexTable]['groups']" :display-codigo="false" :new-config="true">Agrupamento</tv-input-select>
                            </div>

                            <p class="color-neutral font-weight-medium mb-3"><i class="fas fa-columns mr-1"></i> Colunas</p>

                            <draggable dragClass="dragging-ticket" v-model="filteredColumns" group="colunas" animation="150" handle=".handle" @start="drag=true" @end="drag=false" :move="changeColumnPosition" item-key="keyCol">
                                <div class="tv-card tv-table-config-col" :class="{'tv-table-config-col--hide': !col.show}" v-for="(col, colI) in filteredColumns" :key="col.name">
                                    <tv-input-checkbox :id="'datatable-config-profile-col-checkbox-' + col.name" :title="col.show ? 'Ocultar' : 'Mostrar'" v-model="col.show" :default="col.show"></tv-input-checkbox>

                                    <div :id="'datatable-config-profile-col-title-' + col.name" class="tv-table-config-col-title" :class="{'tv-table-config-col-title--disabled': !col.show}" @click="toggleColumnTitleInput(colI, 'open')" :title="col.show ? 'Alterar título' : ''">
                                        <span class="tv-table-config-col-title__current text-ellipsis">{{ col.title }}</span>

                                        <span class="tv-table-config-col-title__original" v-if="typeof col.originalTitle != 'undefined'">{{ col.originalTitle }}</span>
                                    </div>

                                    <input :id="'datatable-config-profile-col-input-' + col.name" type="text" class="form-control tv-table-config-col__input d-none" autocomplete="off" spellcheck="false" :value="''" :disabled="!col.show" @blur="toggleColumnTitleInput(colI, 'close', $event)" />
                        
                                    <button class="btn-icon ml-auto" type="button" title="Recuperar título original" @click="toggleColumnTitleInput(colI, 'reset')" :disabled="!col.show" v-if="typeof col.originalTitle != 'undefined'">
                                        <i class="fas fas fa-undo-alt"></i>
                                    </button>

                                    <button class="btn-icon" type="button" :title="col.fixed ? 'Desafixar' : 'Fixar'" :class="{'color-danger': col.fixed}" :disabled="!col.show" @click="toggleFixedColumn(colI)">
                                        <i class="fas fas fa-thumbtack"></i>
                                    </button>

                                    <button class="btn-icon handle" type="button" title="Alterar posição" style="cursor: grab" :disabled="!col.show">
                                        <i class="fas fas fa-align-justify"></i>
                                    </button>
                                </div>
                            </draggable>
                        </div>

                        <div v-if="layout == 'delete'">
                            <p class="tv-font-14 text-center">Deseja excluir o perfil <span class="font-weight-bold">{{ selectedProfile }}</span>?</p>
                        </div>

                        <p class="text-center color-neutral mt-3" v-show="layout == 'view' && list.profiles.length == 0">
                            Você ainda não possui perfis personalizados para essa tabela.<br/>Crie um novo clicando no botão "+" acima.
                        </p>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-action btn-action--text btn-action--neutral" data-dismiss="modal" v-if="layout == 'view'">
                        <span class="btn-action__label">Fechar</span>
                        <div class="btn-action__underlay"></div>
                    </button>

                    <button class="btn-action btn-action--text btn-action--danger mr-auto" @click="layout = 'delete'" v-if="layout == 'edit'">
                        <span class="btn-action__label">Excluir</span>
                        <div class="btn-action__underlay"></div>
                    </button>

                    <template v-if="layout == 'delete'">
                        <button class="btn-action btn-action--text btn-action--neutral" @click.stop="backPage('edit')">
                            <span class="btn-action__label">Cancelar</span>
                            <div class="btn-action__underlay"></div>
                        </button>

                        <button class="btn-action btn-action--text btn-action--danger" @click="deleteProfile()">
                            <span class="btn-action__label">Excluir</span>
                            <div class="btn-action__underlay"></div>
                        </button>
                    </template>

                    <template v-if="layout == 'new' || layout == 'edit'">
                        <button class="btn-action btn-action--text btn-action--neutral" @click.stop="backPage()">
                            <span class="btn-action__label">Cancelar</span>
                            <div class="btn-action__underlay"></div>
                        </button>

                        <button class="btn-action btn-action--text btn-action--primary" @click="saveProfile(layout)">
                            <span class="btn-action__label">{{ layout == 'new' ? 'Adicionar' : 'Salvar' }}</span>
                            <div class="btn-action__underlay"></div>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</div>
`;

Vue.component('TvDatatableConfig', {
    props: {
        pageId: {
            type: String,
            default: '',
            required: true
        },
        tables: {
            type: Array,
            default: []
        },
    },
    data: function() {
        return {
            list:{
                profiles: [],
                tables: []
            },
            form: {
                id: 0,
                descricao: '',
                tables: []
            },
            route: Root,
            dataLoading: false,
            selectedTable: null,
            selectedIndexTable: 0,
            layout: 'view',
            selectedProfile: null,
            defaultProfileSelected: true,
            profileNameError: '',
            drag: false,
            isProfileDefault: false
        }
    },
    template: template,
    created: function() {
        for(let i in this.tables) {
            this.list.tables.push({
                id: this.tables[i].id,
                descricao: this.tables[i].title
            })
        }

        this.selectedTable = this.list.tables[0].id
        this.getProfilesSelect();
    },

    computed: {
        filteredColumns: {
            get: function() {
                if(this.selectedTable != null) {
                    if(this.form.tables.length > 1) {
                        let tableIndex = this.form.tables.findIndex(x => x.id == this.selectedTable);
                        this.selectedIndexTable = tableIndex
                        if(tableIndex != -1) {
                            return this.form.tables[tableIndex].columns
                        }
                    } else if(this.form.tables.length == 1) {
                        return this.form.tables[0].columns
                    }
                }
    
                return []
            },

            set: function(newValue) {
                if(this.selectedTable != null) {
                    if(this.form.tables.length > 0) {
                        let tableIndex = this.form.tables.findIndex(x => x.id == this.selectedTable);
                        this.selectedIndexTable = tableIndex
                        if(tableIndex != -1) {
                            this.form.tables[tableIndex].columns = newValue;
                        }
                    }
                }
            }
        }
    },
    methods: {
        getProfilesSelect: function(getCurrent = true) {
            this.dataLoading = true;
            this.list.profiles = [];

            const settings = {
        		url: `${HIT10URL}/viewConfig/select?item=${this.pageId}`,
        		metodo: 'GET',
        		envio: ''
        	};
        	sendUrlAxios(settings,this.getProfilesSelectCallback, getCurrent);
        },
        getProfilesSelectCallback: function (status, response, getCurrent) {
            if(status == 200) {
                for(const profile of response.data) {
                    this.list.profiles.push(profile);
                }
                
                if(getCurrent) {
                    this.getCurrentProfile();
                }
            } else {
                this.selectedProfile = 'Padrão do sistema';
                this.isProfileDefault = true
                this.$emit('refresh-tables', this.tables);
                this.dataLoading = false;
            }
        },

        getCurrentProfile: function() {
            const settings = {
        		url: `${HIT10URL}/viewConfig/current?item=${this.pageId}`,
        		metodo: 'GET',
        		envio: ''
        	};
        	sendUrlAxios(settings,this.getCurrentProfileCallback);
        },
        getCurrentProfileCallback: function (status, response) {
            if(status == 200) {
                this.selectedProfile = response.data.descricao;
                this.isProfileDefault = false
                const consistedTables = this.consistTables(JSON.parse(response.data.modelo));
                this.$emit('refresh-tables', consistedTables);
            } else {
                this.selectedProfile = 'Padrão do sistema';
                this.isProfileDefault = true
                this.$emit('refresh-tables', this.tables);
            }

            this.dataLoading = false;
        },

        setCurrentProfile: function(profileId, applyProfile = true) {
            this.dataLoading = true;

            const settings = {
        		url: `${HIT10URL}/viewConfig/current/${profileId}`,
        		metodo: 'PUT',
        		envio: ''
        	};
        	sendUrlAxios(settings,this.setCurrentProfileCallback, applyProfile);
        },
        setCurrentProfileCallback: function (status, response, applyProfile) {
            if(status == 200 && applyProfile) {
                this.getProfilesSelect();
            } else {
                this.dataLoading = false;
            }
        },

        setToDefaultProfile: function() {
            this.dataLoading = true;
            this.isProfileDefault = true
            const settings = {
        		url: `${HIT10URL}/viewConfig/default/${this.pageId}`,
        		metodo: 'PUT',
        		envio: ''
        	};
        	sendUrlAxios(settings,this.setToDefaultProfileCallback);
        },
        setToDefaultProfileCallback: function (status, response) {
            if(status == 200) {
                this.$emit('refresh-tables', this.tables);
            }

            this.dataLoading = false;
        },

        getProfile: function(profileId, isView = false) {
            this.dataLoading = true;
            this.selectedTable = this.list.tables[0].id;

            // this.selectedIndexTable = this.form.tables.findIndex(x => x.id == this.selectedTable);
            this.selectedIndexTable = this.list.tables.findIndex(x => x.id == this.selectedTable);
            const settings = {
        		url: `${HIT10URL}/viewConfig/${profileId}`,
        		metodo: 'GET',
        		envio: ''
        	};
        	sendUrlAxios(settings,this.getProfileCallback, isView);
        },
        getProfileCallback: function (status, response, isView) {
            if(status == 200) {
                this.form.id = response.data.id;
                this.form.descricao = response.data.descricao;
                const consistedTables = this.consistTables(JSON.parse(response.data.modelo));
                this.form.tables = this.setColumnCheckboxValue(consistedTables);
                this.layout = 'edit';
            }

            this.dataLoading = false;
        },

        saveProfile: function (mode, applyProfile = true) {
            if(this.form.descricao == '') {
                this.profileNameError = 'Campo obrigatório.';
                document.getElementById('datatable-config-profile-name').focus();
                return
            } else {
                const profileI = this.list.profiles.findIndex(x => x.descricao == this.form.descricao);

                if(profileI != -1 && this.list.profiles[profileI].id != this.form.id) {
                    this.profileNameError = 'Nome de perfil já utilizado.';
                    document.getElementById('datatable-config-profile-name').focus();
                    return
                }
            }

            this.dataLoading = true;

            let modeloAux = this.revertColumnCheckboxValue(this.form.tables);

            const settings = {
        		url: `${HIT10URL}/viewConfig`,
        		metodo: (mode == 'new') ? 'POST' : 'PUT',
        		envio: {
                    id: this.form.id,
                    grupo: '',
					item: this.pageId,
                    descricao: this.form.descricao,
					modelo: JSON.stringify(modeloAux)
                },
                async: false
        	};
            sendUrlAxios(settings,this.saveProfileCallback, applyProfile);
        },
        saveProfileCallback: function (status, response, applyProfile) {
            if((status == 200 || status == 201) && applyProfile) {
                this.setCurrentProfile(response.data.id, applyProfile);
                this.backPage();
            } else {
                this.dataLoading = false;
            }
        },

        deleteProfile: function() {
			this.dataLoading = true;

            const settings = {
        		url: `${HIT10URL}/viewConfig/${this.form.id}`,
        		metodo: 'DELETE',
        		envio: ''
        	};
            sendUrlAxios(settings,this.deleteProfileCallback);
		},
		deleteProfileCallback: function(status, response) {
            if(status == 200) {
                this.getProfilesSelect()
                this.backPage();
			} else {
                this.dataLoading = false;
            }
		},

        newProfile: function () {
            if(this.list.profiles.length == 3) { return }

            this.form.id = 0;
            this.form.descricao = '';
            let defaultTables = JSON.parse(JSON.stringify(this.tables));
            this.form.tables = this.setColumnCheckboxValue(defaultTables);
            this.selectedTable = this.list.tables[0].id;
            this.selectedIndexTable = 0
            this.layout = 'new';
            setTimeout(() => { document.getElementById('datatable-config-profile-name').focus(); }, 100);
        },

        backPage: function (layout = 'view') {
            if(layout == 'edit') {
                this.layout = 'edit';
            } else {
                this.form.id = 0;
                this.form.descricao = '';
                this.form.tables = [];
                this.layout = 'view';
                this.profileNameError = '';
            }
        },

        consistTables: function(customTables) {
            let consistedTable = JSON.parse(JSON.stringify(this.tables));

            for(let table of consistedTable) {
                for(let cTable of customTables) {
                    if(table.id == cTable.id) {
                        if(cTable['groups']) {
                            table.groups = cTable.groups
                            table.groupSelected = cTable.groupSelected
                        }

                        for(let [columnI, column] of table.columns.entries()) {
                            let cColumnI = cTable.columns.findIndex(x => x.name == column.name);
                            if(cColumnI != -1) {
                                if(column.title != cTable.columns[cColumnI].title && typeof cTable.columns[cColumnI]['originalTitle'] != 'undefined') {
                                    table.columns[columnI]['originalTitle'] = column.title;
                                    table.columns[columnI].title = cTable.columns[cColumnI].title
                                }

                                if(typeof cTable.columns[cColumnI]['hide'] != 'undefined') {
                                    table.columns[columnI]['hide'] = cTable.columns[cColumnI]['hide'];
                                } else if(typeof column['hide'] != 'undefined') {
                                    delete table.columns[columnI]['hide']
                                }

                                if(typeof cTable.columns[cColumnI]['fixed'] != 'undefined') {
                                    table.columns[columnI]['fixed'] = cTable.columns[cColumnI]['fixed'];
                                } else if(typeof column['fixed'] != 'undefined') {
                                    delete table.columns[columnI]['fixed']
                                }
                            } else {

                            }
                        }

                        table.columns.sort(function (a, b) {
                            let aI = cTable.columns.findIndex(x => x.name == a.name)
                            let bI = cTable.columns.findIndex(x => x.name == b.name)

                            if(aI == -1 || bI == -1) {
                                return 0
                            }

                            return aI - bI
                        });
                    }
                }
            }

            return consistedTable
        },

        setColumnCheckboxValue: function(tables) {
            for(let i in tables) {
                for(var j in tables[i].columns) {
                    if(tables[i].columns[j].hide) {
                        tables[i].columns[j]['show'] = false;
                    } else {
                        tables[i].columns[j]['show'] = true;
                    }
                    
                    delete tables[i].columns[j]['hide']
                }
            }

            return tables
        },

        revertColumnCheckboxValue: function(tables) {
            for(let i in tables) {
                for(var j in tables[i].columns) {
                    if(!tables[i].columns[j].show) {
                        tables[i].columns[j]['hide'] = true;
                    }

                    delete tables[i].columns[j].show;
                }
            }

            return tables
        },

        toggleColumnTitleInput: function(colI, action, e) {
            if(!this.filteredColumns[colI].show) {
                return
            }

            let colInput = document.getElementById(`datatable-config-profile-col-input-${this.filteredColumns[colI].name}`);
            let colTitle = document.getElementById(`datatable-config-profile-col-title-${this.filteredColumns[colI].name}`);

            if(action == 'open') {
                colTitle.classList.add('d-none');
                colInput.classList.remove('d-none');
                colInput.value = this.filteredColumns[colI].title;
                colInput.focus();
            } else if(action == 'close') {
                if(typeof this.filteredColumns[colI]['originalTitle'] !== 'undefined') {
                    if(e.target.value.trim() == this.filteredColumns[colI]['originalTitle']) {
                        delete this.filteredColumns[colI]['originalTitle'];
                    }
                } else if(e.target.value.trim() != this.filteredColumns[colI].title) {
                    this.filteredColumns[colI]['originalTitle'] = this.filteredColumns[colI].title;
                }

                this.filteredColumns[colI].title = e.target.value.trim();


                colInput.classList.add('d-none');
                colTitle.classList.remove('d-none');
            } else if(action == 'reset') {
                colInput.value = '';
                this.filteredColumns[colI].title = this.filteredColumns[colI]['originalTitle']
                delete this.filteredColumns[colI]['originalTitle'];
            }
        },

        toggleFixedColumn: function(colI) {
            const sum = (this.filteredColumns[colI]['fixed']) ? 0 : 1
            const fixedColumns = this.filteredColumns.map(x => x.fixed);
            const lastFixedColumn = (fixedColumns.lastIndexOf(true) > -1) ? fixedColumns.lastIndexOf(true) + sum : 0;
            this.filteredColumns.splice(lastFixedColumn, 0, this.filteredColumns.splice(colI, 1)[0]);

            this.filteredColumns[lastFixedColumn]['fixed'] = !this.filteredColumns[lastFixedColumn]['fixed'];
        },

        changeColumnPosition: function(e) {
            if(e.draggedContext.element['fixed'] && !e.relatedContext.element['fixed'] || !e.draggedContext.element['fixed'] && e.relatedContext.element['fixed']) {
                return false
            }
        }
    },
})

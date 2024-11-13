<section class="content-header">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="tv-page-header">
                    <button class="btn-icon mr-2" title="Voltar" onclick="backHome()"><i class="fas fa-arrow-left"></i></button>
                    <h1 v-if="!isEditing">Adicionar Perguntas</h1>
                    <h1 v-else-if="viewMode">Visualizar Perguntas</h1>
                    <h1 v-else>Editar Perguntas</h1>
                </div>

                <div class="tas-page-header__actions" v-if="isEditing && authorizedEdit && recordIndex && recordIndex.buttons">
                    <span class="dropdown">
                        <button class="btn-icon dropdown-toggle m-0" type="button" title="Ações" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <ul class="dropdown-menu__options">
                                <li class="dropdown-menu__item" v-if="viewMode && !recordIndex.buttons.edit.disable">
                                    <span class="dropdown-menu__link" title="Editar" @click="editRecordInside()">
                                        <i class="fas fa-pen color-secondary"></i> Editar
                                    </span>
                                </li>
                                <li class="dropdown-menu__item" v-if="!recordIndex.buttons.clone.disable">
                                    <span class="dropdown-menu__link" title="Duplicar" @click="cloneRecordInside()">
                                        <i class="fas fa-clone color-warning"></i> Duplicar
                                    </span>
                                </li>
                                <li class="dropdown-menu__item" v-if="!recordIndex.buttons.delete.disable">
                                    <span class="dropdown-menu__link" title="Excluir" @click="deleteRecordInsideDialog()">
                                        <i class="fas fa-trash-alt color-danger"></i> Excluir
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="content-body">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="tv-card">
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                        <tv-input-number v-show="false" id="id" v-model="form.id" :default="form.id"></tv-input-number>
                            <div class="row">
                                <div class="col-2 col-md-1 text-center">
                                    <div class="d-flex align-items-center justify-content-center mx-auto mt-3" 
                                        style="width: 35px; min-width: 35px; height: 35px; border: 2px dotted var(--primary); border-radius: 50%; background-color: var(--secondary-100);">
                                        <span class="tas-font-11 color-primary font-weight-bold text-center">1</span>
                                    </div>
                                </div>
                                <div class="col-10 col-md-11">
                                    <div class="form-group">
                                        <tv-input-textarea id="primeira" v-model="form.pergunta1" :default="form.pergunta1" :error-message="errors.primeira">Primeira pergunta</tv-input-textarea>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="row">
                                <div class="col-2 col-md-1 text-center">
                                    <div class="d-flex align-items-center justify-content-center mx-auto mt-3" 
                                        style="width: 35px; min-width: 35px; height: 35px; border: 2px dotted var(--primary); border-radius: 50%; background-color: var(--secondary-100);">
                                        <span class="tas-font-11 color-primary font-weight-bold text-center">2</span>
                                    </div>
                                </div>
                                <div class="col-10 col-md-11">
                                    <div class="form-group">
                                        <tv-input-textarea id="segunda" v-model="form.pergunta2" :default="form.pergunta2" :error-message="errors.segunda">Segunda pergunta</tv-input-textarea>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="row">
                                <div class="col-2 col-md-1 text-center">
                                    <div class="d-flex align-items-center justify-content-center mx-auto mt-3" 
                                        style="width: 35px; min-width: 35px; height: 35px; border: 2px dotted var(--primary); border-radius: 50%; background-color: var(--secondary-100);">
                                        <span class="tas-font-11 color-primary font-weight-bold text-center">3</span>
                                    </div>
                                </div>
                                <div class="col-10 col-md-11">
                                    <div class="form-group">
                                        <tv-input-textarea id="terceira" v-model="form.pergunta3" :default="form.pergunta3" :error-message="errors.terceira">Terceira pergunta</tv-input-textarea>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="row">
                                <div class="col-2 col-md-1 text-center">
                                    <div class="d-flex align-items-center justify-content-center  mx-auto mt-3" 
                                        style="width: 35px; min-width: 35px; height: 35px; border: 2px dotted var(--primary); border-radius: 50%; background-color: var(--secondary-100);">
                                        <span class="tas-font-11 color-primary font-weight-bold text-center">4</span>
                                    </div>
                                </div>
                                <div class="col-10 col-md-11">
                                    <div class="form-group">
                                        <tv-input-textarea id="quarta" v-model="form.pergunta4" :default="form.pergunta4" :error-message="errors.quarta">Quarta pergunta</tv-input-textarea>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="row">
                                <div class="col-2 col-md-1 text-center">
                                    <div class="d-flex align-items-center justify-content-center mx-auto mt-3" 
                                        style="width: 35px; min-width: 35px; height: 35px; border: 2px dotted var(--primary); border-radius: 50%; background-color: var(--secondary-100);">
                                        <span class="tas-font-11 color-primary font-weight-bold text-center">5</span>
                                    </div>
                                </div>
                                <div class="col-10 col-md-11">
                                    <div class="form-group">
                                        <tv-input-textarea id="quinta" v-model="form.pergunta5" :default="form.pergunta5" :error-message="errors.quinta">Quinta pergunta</tv-input-textarea>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <button id="usuario_adicionar" class="btn-action btn-action--contain btn-action--primary float-sm-right" @click="addRecover()" v-if="!this.isEditing" >
                                <span class="btn-action__label">Gravar</span>
                                <div class="btn-action__underlay"></div>
                            </button>
                            <button id="usuario_cancelar" class="btn-action btn-action--outline btn-action--primary float-sm-right" onclick="backHome()">
                                <span class="btn-action__label" v-if="!viewMode">Cancelar</span>
                                <span class="btn-action__label" v-else>Voltar</span>
                                <div class="btn-action__underlay"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<button class="btn-float btn-float--square btn-float--secondary" :class="{'btn-float--disabled': this.$refs.tasDatatable.dataFiltered.findIndex(x => x.data.CODIGO.value == this.form.codigo) == 0}" title="Anterior" v-if="viewMode" @click="skipRecord('back')">
    <i class="fas fa-arrow-left btn-float__icon"></i>
</button>
<button class="btn-float btn-float--square btn-float--secondary" :class="{'btn-float--disabled': this.$refs.tasDatatable.dataFiltered.findIndex(x => x.data.CODIGO.value == this.form.codigo) == this.$refs.tasDatatable.dataFiltered.length - 1}" title="Próximo" v-if="viewMode" @click="skipRecord('next')">
    <i class="fas fa-arrow-right btn-float__icon"></i>
</button>

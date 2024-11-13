<section class="content-header">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="tv-page-header">
                    <button class="btn-icon mr-2" title="Voltar" @click="backPage()"><i class="fas fa-arrow-left"></i></button>
                    <h1 v-if="!isEditing">Adicionar Cursos</h1>
                    <h1 v-else-if="viewMode">Visualizar Cursos</h1>
                    <h1 v-else>Editar Cursos</h1>

                    <div class="tv-page-header__actions" v-if="isEditing && authorizedEdit && recordIndex && recordIndex.buttons">
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
    </div>
</section>

<section class="content-body">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="tv-card">
                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <div class="form-group">
                                <tv-input-text id="codigo" name="codigo" v-model="form.codigo" :default="form.codigo" :error-message="errors.codigo" :disabled="true">Código</tv-input-text>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <div class="form-group">
                                <tv-input-text id="descricao" name="descricao" v-model="form.descricao" :default="form.descricao" :disabled="viewMode" :error-message="errors.descricao" v-on:input="getCodigo">Descrição</tv-input-text>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <div class="form-group">
                                <tv-input-textarea id="sobre" name="sobre" v-model="form.sobre" :default="form.sobre" :disabled="viewMode" :error-message="errors.sobre">Sobre</tv-input-textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <button id="usuario_adicionar" class="btn-action btn-action--contain btn-action--primary float-sm-right" @click="addRecover()" v-if="!this.isEditing" >
                                <span class="btn-action__label">Gravar</span>
                                <div class="btn-action__underlay"></div>
                            </button>
                            <button id="usuario_salvar" class="btn-action btn-action--contain btn-action--primary float-sm-right" @click="addRecover(true)" v-if="this.isEditing && !viewMode">
                                <span class="btn-action__label">Salvar</span>
                                <div class="btn-action__underlay"></div>
                            </button>
                            <button id="usuario_cancelar" class="btn-action btn-action--outline btn-action--primary float-sm-right" @click="backPage()">
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

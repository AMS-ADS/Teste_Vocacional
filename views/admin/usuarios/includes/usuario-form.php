<section class="content-header">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="tv-page-header">
                    <button class="btn-icon mr-2" title="Voltar" @click="backPage()"><i class="fas fa-arrow-left"></i></button>
                    <h1 v-if="!isEditing">Adicionar Usuários</h1>
                    <h1 v-else-if="viewMode">Visualizar Usuários</h1>
                    <h1 v-else>Editar Usuários</h1>

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
                                <tv-input-text id="login" name="login" v-model="form.login" :default="form.login" :error-message="errors.login" :disabled="(isEditing) ? true : false" @blur="verificaLogin()">Login</tv-input-text>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <div class="form-group">
                                <tv-input-text id="senha" name="senha" :type="senhaType" v-model="form.senha" :default="form.senha" :disabled="viewMode" :error-message="errors.senha" :custom-button="(!isEditing) ? senhaIcon : ''"  v-on:custom-button-event="togglePassword()">Senha</tv-input-text>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <div class="form-group">
                                <tv-input-text id="nome" name="nome" v-model="form.nome" :default="form.nome" :disabled="viewMode" :error-message="errors.nome">Nome</tv-input-text>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <div class="form-group">
                                <tv-input-text id="email" name="email" v-model="form.email" :default="form.email" :disabled="viewMode" :error-message="errors.email">E-mail</tv-input-text>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <p class="tv-font-14 font-weight-medium pl-2 mb-1 color-neutral">Instituição</p>
                            <div class="form-group">
                                <tv-input-radio id="instituicao" v-model="form.instituicao" :default="form.instituicao" :options="list.instituicao" :disabled="viewMode"></tv-input-radio>
                            </div>
						</div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <p class="tv-font-14 font-weight-medium pl-2 mb-1 color-neutral">Nível Acesso</p>
                            <div class="form-group">
                                <tv-input-radio id="nivelAcesso" v-model="form.nivelAcesso" :default="form.nivelAcesso" :options="list.nivelAcesso" :disabled="viewMode"></tv-input-radio></tv-input-radio>
                            </div>
						</div>
                    </div>

                    <div class="row" v-show="showCursoSelect">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <div class="form-group">
                                <tv-input-select id="curso" v-model="form.curso" :default="form.curso" :options="list.curso" :error-message="errors.curso" :remove-button="false" :disabled="viewMode">Curso</tv-input-select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-5 col-lg-4">
                            <button id="usuario_adicionar" class="btn-action btn-action--contain btn-action--primary float-sm-right" @click="addRecover()" v-if="!this.isEditing" :disabled="!botaoGravar">
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

<button class="btn-float btn-float--square btn-float--secondary" :class="{'btn-float--disabled': this.$refs.tasDatatable.dataFiltered.findIndex(x => x.data.LOGIN.value == this.form.login) == 0}" title="Anterior" v-if="viewMode" @click="skipRecord('back')">
    <i class="fas fa-arrow-left btn-float__icon"></i>
</button>
<button class="btn-float btn-float--square btn-float--secondary" :class="{'btn-float--disabled': this.$refs.tasDatatable.dataFiltered.findIndex(x => x.data.LOGIN.value == this.form.login) == this.$refs.tasDatatable.dataFiltered.length - 1}" title="Próximo" v-if="viewMode" @click="skipRecord('next')">
    <i class="fas fa-arrow-right btn-float__icon"></i>
</button>

<section class="content-header">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="tv-page-header">
                    <button class="btn-icon mr-2" title="Voltar" onclick="backHome()"><i class="fas fa-arrow-left"></i></button>
                    <h1>Usuários</h1>
                    <!-- <div class="tv-page-header__actions order-2 order-sm-3">
                        <button id="open-modal-tutorial" class="btn-icon d-none" title="Visualizar tutoriais" @click="$refs.tasModalTutorial.openModal()">
                            <i class="fas fa-play-circle"></i>
                        </button>
                        
                        <span id="pageFavorite" class="btn-icon" title="Adicionar esta página aos favoritos">
                            <input class="btn-icon__input" type="checkbox" onchange="setFavorito('<?php echo $_GET['sideID']?>',this.checked)" @click="favorito = !favorito" :checked="favorito" >
                            <i class="btn-icon__unchecked far fa-star color-neutral"></i>
                            <i class="btn-icon__checked fas fa-star color-warning"></i>
                        </span>
                    </div> -->
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
                    <tv-datatable
                        ref="tasDatatable"
                        title="Usuários"
                        :endpoint="tableEndpoint"
                        id-column="LOGIN"
                        ref-column="NOME"
                        sort-default="NOME"
                        :columns="table_column"
                        :rows="table_row"
                        v-on:add-action="newRecover()">
                    </tv-datatable>
                </div>
            </div>
        </div>
    </div>
</section>
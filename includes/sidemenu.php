<div id="sidemenu-el">
    <tv-sidemenu v-cloak inline-template :user-permission="<?= $_SESSION["nivelAcesso"] ?>">
        <div id="tv_sidemenu" class="tv-sidemenu tv-sidemenu--active" onmouseleave="sidemenuMouseLeave()">
            <div class="tv-sidemenu__body">
                <ul id="main_pages" class="tv-sidemenu__list" data-simplebar>
                    <div v-if="filteredItems.length > 0">
                        <li class="tv-sidemenu__itens" v-for="item in filteredItems" :key="item.id">
                            <a class="tv-sidemenu__parent collapsed" class="tv-sidemenu__child" :class="{ 'tv-sidemenu__child--active': item.active }" href="#" @click="callAddUsage(item.id, item.endpoint)" role="button" :aria-expanded="item.collapsed" :aria-controls="item.id">
                                <i class="parent-icon fas" :class="item.icone"></i>
                                <span>{{ item.descricao }}</span>
                            </a>
                        </li>
                    </div>
                </ul>
            </div>

            <div class="tv-sidemenu__footer">
                <button class="btn-icon d-none d-lg-flex" aria-label="Travar menu" title="Travar menu" onclick="lockSidemenu()">
                    <i id="tv_sidemenu_lock_icon" class="fas fa-lock"></i>
                </button>

                <button class="btn-icon d-none d-lg-flex ml-auto" aria-label="Esconder menu" title="Esconder menu" onclick="hideSidemenu(true)">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
        </div>
    </tv-sidemenu>
</div>

<script src="<?php echo $route ?>dist/vendors/Vue/vue.js"></script>
<script src="<?php echo $route ?>dist/vue-components/tv-input-search.js?rls=<?=$release?>"></script>

<script>
    const tvSidemenu = {
        props: {
            userPermission: {
                type: Number,
                required: true
            }
        },

        data: function () {
            return {
                itemsList: [],
                search: '',
                loaded: false,
            }
        },

        computed: {
            filteredItems: function() {
                let filtered = [];

                if (this.userPermission === 1) {
                    filtered = this.itemsList;
                } else if (this.userPermission === 2) {
                    filtered = this.itemsList.filter(item => item.descricao === 'Perguntas' || item.descricao === 'Home');
                }

                if (this.search !== '') {
                    let searchAux = this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    filtered = filtered.filter((item) => item.descricao.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchAux));
                }

                return filtered;
            }
        },

        mounted() {
            this.getSidemenuItems();
        },

        methods: {
            getSidemenuItems: function() {
                fetch(Root + '/includes/json_sidemenu.txt')
                .then(response => response.json())
                .then(data => {
                    this.itemsList = data;
                    this.loaded = true;
                })
                .catch(error => {
                    console.error('Erro ao buscar os itens do menu:', error);
                });
            },
            callAddUsage: function (id, url) {
                addUsage(id, `${Root}/${url}`);
            },
        }
    };

    new Vue({
        el: '#sidemenu-el',
        components: {
		    tvSidemenu: tvSidemenu
	    }
    });
</script>

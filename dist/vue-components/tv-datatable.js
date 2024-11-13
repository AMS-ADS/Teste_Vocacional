var template = `
<div :id="'tv-table-' + title + '-content'" class="tv-datatable" v-show="columns.length > 0">
    <div class="tv-datatable-header" v-if="dtHeader">
        <div class="row">
            <div class="col-12 col-sm-auto pr-sm-0 mb-3 mb-sm-0 order-1" v-if="addButton">
                <button :id="'table-' + title + '-add-button'" class="btn-action btn-action--contain btn-action--primary m-0" @click="emitAddButton()">
                    <span class="btn-action__label">Adicionar</span>
                    <div class="btn-action__underlay"></div>
                </button>
            </div>

            <div class="col-auto d-flex order-1 order-sm-2" v-if="customTable">
                
                <button class="btn-icon d-sm-flex" type="button" title="Personalizar tabela" @click="openDatatableConfig()" v-if="customTable">
                    <i class="fas fa-table"></i>
                </button>
            </div>

            <slot name="table-header"></slot>

            <div class="col-sm-4 col-lg-3 ml-auto order-3" :class="($slots['table-header']) ? 'col-12 mt-3 mt-sm-0' : 'col'">
                <div class="form-container">
                    <div class="form-field form-field--line form-field--suffix-icon" :class="{'form-field--active':data_table.filtro.length > 0}">
                        <i class="form-field__icon fas fa-search"></i>
                        <input :id="'search-'+title" :name="'search-'+title" type="search" class="form-control" placeholder="Pesquisar" autocomplete="off" spellcheck="false" @click="focusInput('search')" @blur="blurInput('search')" v-on:input="data_table.filtro = $event.target.value; changeSearch()" :value="data_table.filtro">

                        <div class="form-outline" :class="{'form-outline--active': data_table.filtro.length > 0 || focusSearch, 'form-outline--focus': focusSearch}">
                            <div class="form-outline__prefix"></div>
                            <div class="form-outline__middle">
                                <label :for="'search-'+title" class="form-field__label"></label>
                            </div>
                            <div class="form-outline__suffix"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="tv-datatable-totalbox row" v-if="header && header.length > 0">
        <div class="col-auto col-md" v-for="data in header">
            <div class="tv-card h-100">
                <p class="tv-datatable-totalbox__title">{{ data.title }}</p>

                <div class="d-flex align-items-center w-100" :class="data.inline ? 'flex-row justify-content-center' : 'flex-column'">
                    <template v-for="value in data.value">
                        <div class="tv-datatable-totalbox__value" :title="value.text" v-if="value.text != ''">
                            <i class="tv-datatable-totalbox__icon" :class="value.icon" :style="'color:' + value.color"></i>
                            <span class="text-ellipsis">{{ value.text }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <div role="table" :id="'tv-table-' + title" class="tv-table">
        <div role="row" class="tv-table-header" :style="{ 'grid-template-columns': gridTemplateColumns, 'grid-template-rows': gridTemplateRows }">
            <div role="columnheader" class="tv-table-cell tv-table-cell--fixed tv-table-cell--checkbox"
                v-if="rowCheckbox">

                <div class="form-selection">
                    <div class="form-checkbox" :class="{ 'form-checkbox--active': data_table.allchecked }">
                        <input class="form-checkbox__input" type="checkbox"
                            v-model="data_table.allchecked"
                            @click="checkAll($event.target.checked)">
                            
                            <div class="form-checkbox__background">
                                <i class="form-checkbox__checkmark fas fa-minus"></i>
                            </div>
                        <div class="form-checkbox__underlay"></div>
                    </div>
                </div>
            </div>

            <div role="columnheader" class="tv-table-cell tv-table-cell--fixed tv-table-cell--checkbox"
                v-if="rowRadio">
            </div>

            <div role="columnheader" class="tv-table-cell tv-table-cell--fixed"
                v-if="nestedTable"
                :style="[ rowCheckbox || rowRadio ? { 'left': '30px' } : { 'left': '0px' } ]">
            </div>

            <template v-for="col in columns">
                <div role="columnheader" class="tv-table-cell"
                    v-if="!col.hide"
                    :class="{ 'tv-table-cell--fixed': col.fixed, 'justify-content-center text-center': col.align == 'center', 'justify-content-end': col.align == 'right' }"
                    :style="{ 'grid-row': col.row, 'grid-column': col.column, 'left': col.left + 'px', 'background-color': col.backgroundColor }">

                    <div :title="col.title"
                        class="text-ellipsis"
                        :class="{ 'pointer': !col.dontSort }"
                        :style="[ col.breakWord ? { 'white-space': 'break-spaces' } : '' ]" @click="setSortedColumn(col.name, col.type, col.dontSort)">{{ col.title }}</div>

                    <button class="tv-table-sort" :class="{ 'tv-table-sort--active': col.name == sortColumnName }" type="button" @click="setSortedColumn(col.name, col.type, col.dontSort)" v-if="!col.dontSort">
                        <i class="fas" :class="(col.name == sortColumnName && sort == 'desc') ? 'fa-long-arrow-alt-down' : 'fa-long-arrow-alt-up'"></i>
                    </button>
                </div>
            </template>

            <div class="tv-table-load">
                <div class="tv-table-load__track" :class="{ 'visible': timeoutId != null }"></div>
            </div>
        </div>

        <div role="row" :id="'tv-table-row-' + title + '-' + rowI" class="tv-table-row"
            v-for="(row, rowI) in dataDisplayed"
            :key="row.data[idColumn].value"
            :style="{ 'grid-template-columns': gridTemplateColumns, 'background-color': row.backgroundColor }"
            @click="rowAction(rowI)"
            @contextmenu.prevent="openContextMenu(row, rowI, $event)">

            <div role="cell" class="tv-table-cell tv-table-cell--fixed tv-table-cell--checkbox"
                v-if="rowCheckbox">

                <div class="form-selection">
                    <div class="form-checkbox" :class="{ 'form-checkbox--active': row.checkbox.checked }">
                        <input class="form-checkbox__input" type="checkbox"
                            v-model="row.checkbox.checked"
                            :disabled="row.checkbox.disable"
                            @click="emitCheckedList(row.data[idColumn].value, $event.target.checked)">
                            
                            <div class="form-checkbox__background">
                                <i class="form-checkbox__checkmark fas fa-check"></i>
                            </div>
                        <div class="form-checkbox__underlay"></div>
                    </div>
                </div>
            </div>

            <div role="cell" class="tv-table-cell tv-table-cell--fixed tv-table-cell--checkbox"
                v-if="rowRadio">

                <div class="form-selection">
                    <div class="form-radio" :class="{'form-radio--active': row.radio.checked}">
                        <input class="form-radio__input" type="radio" tabindex="0"
                            :id="'datatable-radio-' + row.data[idColumn].value"
                            :disabled="row.radio.disable"
                            v-model="row.radio.checked"
                            :value="row.data[idColumn].value"
                            @click="emitRadioValue(row.data[idColumn].value)"
                        >
                        <div class="form-radio__background">
                            <div class="form-radio__outer"></div>
                            <div class="form-radio__inner"></div>
                        </div>
                        <div class="form-radio__underlay"></div>
                    </div>
                </div>
            </div>

            <div role="cell" class="tv-table-cell tv-table-cell--fixed tv-table-cell--button"
                v-if="nestedTable && !row.hideNestedRowButton"
                :class="{ 'active': nestedTableRow.show }"
                :style="[ rowCheckbox || rowRadio ? { 'left': '30px' } : { 'left': '0px' } ]">

                <button class="btn-icon"
                    :title="(nestedTableRow.show) ? 'Retrair' : 'Expandir'"
                    @click.stop="toggleNestTable(rowI)">

                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>

            <div role="cell" class="tv-table-cell tv-table-cell--fixed tv-table-cell--button"
                v-if="row.hideNestedRowButton"
                :style="[ rowCheckbox || rowRadio ? { 'left': '30px' } : { 'left': '0px' } ]">
            </div>
            
            <template v-for="cell in columns">
                <div role="cell" class="tv-table-cell"
                    v-if="!cell.hide && cell.name != 'BLANK'"
                    :class="[row.data[cell.name]['class'], { 'justify-content-center': cell.align == 'center', 'justify-content-end': cell.align == 'right', 'tv-table-cell--fixed': cell.fixed, 'd-none': row.data[cell.name].hide }]"
                    :style="{ 'left': cell.left + 'px', 'background-color': row.data[cell.name].backgroundColor, 'color': row.data[cell.name].color, 'font-weight': row.data[cell.name].fontWeight, 'grid-column':  row.data[cell.name].column }">

                    <template v-if="cell.type == 'icon'">
                        <span class="tv-table-cell__icon"
                            v-for="icon in row.data[cell.name].value"
                            :title="icon.title">

                            <i :class="[ icon.icon ]" :style="{ 'color': icon.color }"></i>
                            <div class="text-ellipsis" v-if="icon.label">{{ icon.title }}</div>
                        </span>
                    </template>

                    <template v-else-if="cell.type == 'color'">
                        <div class="tv-table-cell__color"
                            :style="[ !row.data[cell.name].value.startsWith('http') ? { 'background-color': row.data[cell.name].value } : { 'background-color': 'none' }, row.data[cell.name].value == '#ffffff' ? { 'border': '1px solid #b7b7b7' } : { 'border': 'none' } ]">

                            <img alt="Imagem do registro"
                                v-if="row.data[cell.name].value.startsWith('http')"
                                :src="row.data[cell.name].value"
                            />
                        </div>
                    </template>

                    <template v-else-if="cell.type == 'image'">
                        <div class="tv-table-cell__image">
                            <img alt="Imagem do registro" :src="row.data[cell.name].value" />
                        </div>
                    </template>

                    <template v-else-if="cell.type == 'progress'">
                        <div class="tv-table-cell__progress" :title="row.data[cell.name].value + '%'">
                            <span class="tv-table-cell__progress-value"
                                :style="[ row.data[cell.name].value >= 96 ? { 'color': '#ffffff' } : { 'color': 'initial' } ]">

                                {{ row.data[cell.name].value }}%
                            </span>

                            <span class="tv-table-cell__progress-bar"
                                :class="{ 'tv-table-cell__progress-bar--low': row.data[cell.name].value <= 50, 'tv-table-cell__progress-bar--mid': row.data[cell.name].value >= 51 && row.data[cell.name].value <= 95, 'tv-table-cell__progress-bar--full': row.data[cell.name].value >= 96 }"
                                :style="{ 'width': row.data[cell.name].value + '%' }">
                            </span>
                        </div>
                    </template>

                    <div class="text-ellipsis"
                        v-else
                        :title="(row.data[cell.name].title) ? row.data[cell.name].title : row.data[cell.name].value">
                        
                        {{ row.data[cell.name].value }}
                    </div>

                    <template v-if="row.data[cell.name].element">
                        <span v-html="row.data[cell.name].element"></span>
                    </template>

                    <template v-if="row.data[cell.name].tooltip">
                        <span class="pointer" :class="{ 'flex-1': row.data[cell.name].tooltip.flex }" v-html="row.data[cell.name].tooltip.element" @mouseover="toggleCellTooltip('open', $event, row.data[cell.name].tooltip.text)" @mouseleave="toggleCellTooltip('close')" @click="toggleCellTooltip('open', $event, row.data[cell.name].tooltip.text)"></span>
                    </template>
                </div>
                
                <div role="cell" class="tv-table-cell" :style="{ 'background-color': row.data['BLANK'].backgroundColor }" v-else-if="cell.name == 'BLANK' && row.data['BLANK']"></div>
            </template>

            <div class="tv-table-actions" v-if="rowButtons && displayActionsButton(row)">
                <div class="tv-table-actions__container">
                    <button class="tv-table-actions__context btn-icon"
                        @click.stop="openContextMenu(row, rowI, $event)">

                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    
                    <template v-for="(altButton, altButtonI) in rowAltButtons">
                        <button class="tv-table-actions__button btn-icon"
                            v-if="row.buttons[altButtonI].displayInline"
                            :title="altButton.title"
                            :disabled="row.buttons[altButtonI].disable"
                            :style="{ 'color': altButton.color }"
                            @click.stop="emitRowAltButtons(altButtonI, rowI)">

                            <i :class="[altButton.icon]"></i>
                            <span class="tv-table-actions__alert" v-if="!row.buttons[altButtonI].disable && row.buttons[altButtonI].alert"></span>
                        </button>
                    </template>

                    
                    <button class="tv-table-actions__button btn-icon color-primary" title="Editar"
                        v-if="row.buttons.edit && row.buttons.edit.displayInline"
                        :disabled="row.buttons.edit.disable"
                        @click.stop="emitRowButtons('edit', rowI)">

                        <i class="fas fa-pen"></i>
                    </button>

                    <button class="tv-table-actions__button btn-icon color-danger" title="Excluir"
                        v-if="row.buttons.delete && row.buttons.delete.displayInline"
                        :disabled="row.buttons.delete.disable"
                        @click.stop="emitRowButtons('delete', rowI)">

                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>

        <div role="row" class="tv-table-row tv-table-row--empty"
            v-if="dataDisplayed.length == 0"
            :style="{ 'grid-template-columns': gridTemplateColumns }">

            <div role="cell" class="tv-table-cell">
                <div>Nenhum registro encontrado.</div>
            </div>
        </div>

        <div role="row" class="tv-table-total"
            v-if="footer && footer.data && dataDisplayed.length > 0"
            :style="{ 'grid-template-columns': gridTemplateColumns, 'grid-template-rows': footer.rows }">

            <div role="cell" class="tv-table-cell tv-table-cell--fixed justify-content-center" v-if="rowCheckbox">
                <div class="text-ellipsis" :title="checkedList.length">{{ (checkedList.length > 0) ? checkedList.length : '' }}</div>
            </div>

            <div role="cell" class="tv-table-cell tv-table-cell--fixed"
                v-if="nestedTable"
                :style="[ rowCheckbox || rowRadio ? { 'left': '30px' } : { 'left': '0px' } ]">
            </div>

            <template v-for="col in columns">
                <template v-if="!col.hide">
                    <template v-if="footer.data[col.name]">
                        <div role="cell" class="tv-table-cell"
                            v-for="(cell, cellI) in footer.data[col.name]"
                            :class="{ 'justify-content-center': col.align == 'center', 'justify-content-end': col.align == 'right', 'tv-table-cell--fixed': col.fixed }"
                            :style="{ 'grid-row': cell.row, 'left': col.left + 'px' }">

                            <div class="text-ellipsis" :title="cell.value">{{ cell.value }}</div>
                        </div>
                    </template>

                    <template v-else>
                        <div role="cell" class="tv-table-cell"
                            :class="{ 'tv-table-cell--fixed': col.fixed }"
                            :style="{ 'left': col.left + 'px' }">

                            <div class="text-ellipsis"></div>
                        </div>
                    </template>
                </template>
            </template>
        </div>

        <div class="tv-datatable-nest" v-if="nestedTable && nestedTableRow.show">
            <slot name="nested-table"></slot>
        </div>
    </div>
    
    <div class="tv-datatable-footer" v-if="dtFooter">
        <div class="form-container mr-2">
            <div class="form-field form-field--line form-select form-select--openup form-field--suffix-icon tv-datatable-select" tabindex="0" @click="focusInput('select')" @blur="blurInput('select')">
                <div class="form-select__wrapper">
                    <span class="form-select__selected">{{data_table.paginacao}}</span>
                </div>
                <i class="form-field__icon form-select__arrow fas fa-caret-down" :class="{'form-select__arrow--active': focusSelect}"></i>
                <div class="form-outline form-outline--active" :class="{'form-outline--focus': focusSelect}">
                    <div class="form-outline__prefix"></div>
                    <div class="form-outline__middle"></div>
                    <div class="form-outline__suffix"></div>
                </div>

                <div class="form-select__dropdown" :class="{'form-select__dropdown--active': focusSelect}">
                    <ul class="form-select__list">
                        <li class="form-select__item"  @mousedown="changePaginacao(25); blurInput('select')" :value="data_table.paginacao">
                            <span class="form-select__option">25</span>
                        </li>
                        <li class="form-select__item"  @mousedown="changePaginacao(50); blurInput('select')" :value="data_table.paginacao">
                            <span class="form-select__option">50</span>
                        </li>
                        <li class="form-select__item"  @mousedown="changePaginacao(75); blurInput('select')" :value="data_table.paginacao">
                            <span class="form-select__option">75</span>
                        </li>
                        <li class="form-select__item"  @mousedown="changePaginacao(100); blurInput('select')" :value="data_table.paginacao">
                            <span class="form-select__option">100</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <span class="tv-datatable-pagination">{{ data_table.total }} registros</span>

        <button class="tv-datatable-paginationbtn" :class="{'tv-datatable-paginationbtn--disabled':data_table.paginaAtual == 1}" title="Ir para a primeira página" @click="dataTableViraPagina(\'MIN\')"><i class="fas fa-angle-double-left"></i></button>
        <button class="tv-datatable-paginationbtn" title="Ir para a página anterior" :class="{'tv-datatable-paginationbtn--disabled':data_table.paginaAtual == 1}" @click="dataTableViraPagina(\'-\')"><i class="fas fa-angle-left"></i></button>

        <span class="tv-datatable-pagination">{{data_table.paginaAtual}} / {{data_table.quantidadePagina}}</span>

        <button class="tv-datatable-paginationbtn" title="Ir para a próxima página" :class="{'tv-datatable-paginationbtn--disabled':data_table.paginaAtual == data_table.quantidadePagina}" @click="dataTableViraPagina(\'+\')"><i class="fas fa-angle-right"></i></button>
        <button class="tv-datatable-paginationbtn" title="Ir para a última página" :class="{'tv-datatable-paginationbtn--disabled':data_table.paginaAtual == data_table.quantidadePagina}" @click="dataTableViraPagina(\'MAX\')"><i class="fas fa-angle-double-right"></i></button>
    </div>
</div>
`;

Vue.component('TvDatatable', {
    props: {
        title: {
            type: String,
            required: true
        },
        endpoint: String,
        idColumn: {
            type: String,
            required: true
        },
        refColumn: {
            type: String,
            required: true
        },
        columns: {
            type: Array,
            default: () => [],
            required: true
        },
        rows: {
            type: Array,
            default: () => [],
            required: true
        },
        header: Array,
        footer: Object,
        sortDefault: String,
        sortDirection: {
            type: String,
            default: 'asc'
        },
        rowButtons: {
            type: Boolean,
            default: true
        },
        rowAltButtons: Object,
        rowCheckbox: {
            type: Boolean,
            default: false
        },
        rowRadio: {
            type: Boolean,
            default: false
        },
        dtHeader:{
            type: Boolean,
            default: true
        },
        dtFooter:{
            type: Boolean,
            default: true
        },
        addButton: {
            type: Boolean,
            default: true
        },
        customHeight: {
            type: String,
            default: ""
        },
        nestedTable: {
            type: Boolean,
            default: false
        },
        exportJson: Object,
        customTable: {
            type: Boolean,
            default: false
        },
        useEndpoint: {
            type: Boolean,
            default: true
        },
        scrollYPosition: {
            type: String,
            default: 'top'
        },
        refreshSearch : {
            type: Boolean,
            default: true
        }
    },
    data: function() {
        return {
            route: Root,

            data_table: {
                filtro: '',
                paginacao: 100,
                total: 0,
                paginaAtual: 1,
                paginaAtualItemFechado: 1,
                quantidadePagina: 0,
                personalizada: false,
                allchecked: false,
                indexClick: null,
                onRecord: false,
                tablePosition: 0
            },
            sort: this.sortDirection,
            sortColumnName: this.sortDefault,

            searchField: false,
            focusSelect: false,
            focusSearch: false,
            dataFiltered: [],
            checkedList: [],
            checkedRadioValue: '',
            timeoutId: null,
            content: this.rows,
            gridTemplateColumns: '',
            gridTemplateRows: '',
            nestedTableRow: {
                show: false,
                index: null
            },
            customHeightValue: this.customHeight,
            excelLoading: false
        }
    },
    template: template,
    created: function() {
        this.configColumns();
        this.setSortDefault();
        this.setRowAltButtons();

        if(!this.dtFooter){
            this.data_table.paginacao = 500;
        }

        this.data_table.quantidadePagina = Math.ceil(this.rows.length / this.data_table.paginacao);


        if(this.customHeight != ""){
            setTimeout(() => {
                window.addEventListener("resize", this.windowResize);
                this.windowResize();
            }, 50);
        }

        if (this.rows.length > 0) {
            this.debounceDataFiltered();
        }
    },

    destroyed: function() {
        if(this.rowCheckbox) {
            this.checkAll(false);
        }

        if(this.rowRadio) {
            this.checkedRadioValue = '';
        }
    },

    computed: {
        dataDisplayed: function() {
            var displayed = [];

            if(this.dataFiltered.length > 0) {
                var start = this.data_table.paginacao * (this.data_table.paginaAtual - 1);
                var end = this.data_table.paginacao * this.data_table.paginaAtual;
                displayed = this.dataFiltered.slice(start, end);

                if(this.scrollYPosition != 'top') {
                    setTimeout(() => {
                        const tablePedidos = document.getElementById(`tv-table-${this.title}`);
                        tablePedidos.scrollTop = tablePedidos.scrollHeight
                    }, 10);
                }
            }

            this.data_table.total = formatNumberToFront(this.dataFiltered.length);

            return displayed;
        }
    },
    watch: {
        columns: function(){
            this.configColumns();
            this.setSortDefault();
        },

        rows: function() {
            this.content = JSON.parse(JSON.stringify(this.rows));

            this.setRowSearchValue();

            if(this.refreshSearch) {
                this.data_table.filtro = '';
            }
            this.data_table.paginaAtual = 1;
            this.debounceDataFiltered();
            
            if(this.rowCheckbox) {
                this.refreshCheckedList();
            }

            if(this.rowRadio) {
                this.refreshRadioValue();
            }
            
            if(this.nestedTable && this.dataDisplayed.length > 0) {
                this.nestedTableRow.show = false;
                this.nestedTableRow.index = null;
            }

            if(this.data_table.onRecord) {
                setTimeout(() => this.rowAction(this.data_table.indexClick, false), 300);
                
                this.data_table.onRecord = false
            } else {
                this.data_table.indexClick = null
            }
        },

        customHeight: function() {
            this.customHeightValue = this.customHeight
            window.removeEventListener("resize", this.windowResize);
            window.addEventListener("resize", this.windowResize);
            this.windowResize();
        },

        rowCheckbox: function() {
            this.configColumns();
            if(this.rowCheckbox){
                this.refreshCheckedList();
            }
        }
    },
    methods: {
        configColumns: function() {
            this.gridTemplateColumns = '';
            this.gridTemplateRows = '';

            var gridTemplateRowsCount = 0;
            var leftAux = 0;

            if(this.rowCheckbox || this.rowRadio) {
                leftAux += 30;
                this.gridTemplateColumns += '30px ';
            }

            if(this.nestedTable) {
                leftAux += 30;
                this.gridTemplateColumns += '30px ';
            }

            for (var i in this.columns) {
                if(!this.columns[i].hide) {
                    if(this.columns[i].column == undefined || this.columns[i].column == '') {
                        if(typeof this.columns[i].size === 'string') {
                            var sizeAux = this.columns[i].size.split(' ');
                            this.gridTemplateColumns += `minmax(${sizeAux[0]}, ${sizeAux[1]}) `;
                            
                            if(this.columns[i].fixed) {
                                this.columns[i].left = leftAux;
                                leftAux += Number(sizeAux[0].replace('px', ''));
                            }
                        } else {
                            this.gridTemplateColumns += `minmax(${this.columns[i].size}px, 1fr) `;
        
                            if(this.columns[i].fixed) {
                                this.columns[i].left = leftAux;
                                leftAux += this.columns[i].size;
                            }
                        }
                    }

                    if(this.columns[i].row) {
                        var rowCount = 0;

                        if(this.columns[i].row.includes('/')) {
                            rowCount = this.columns[i].row.split('/')[1];
                        } else {
                            rowCount = this.columns[i].row;
                        }

                        if(rowCount > gridTemplateRowsCount) {
                            gridTemplateRowsCount = rowCount;
                        }
                    }
                }
            }

            this.gridTemplateRows = '1fr '.repeat(gridTemplateRowsCount);
        },

        setRowSearchValue: function() {
            if(this.content.length > 0) {
                for(var i in this.content) {
                    this.content[i].search = "";
                    
                    for (var j = 0; j < this.columns.length; j++) {
                        if(!this.columns[j].hide && this.columns[j].name != 'BLANK') {
                            this.content[i].search += `${this.content[i].data[this.columns[j].name].value} `
                        }
                    }
                }
            }
        },

        setRowAltButtons: function() {
            const cmenuGroup = Array.prototype.slice.call(document.getElementById('alt-button-content').children);
            for(var i in cmenuGroup) {
                cmenuGroup[i].classList.remove('d-block');
                cmenuGroup[i].classList.add('d-none');
            }

            if(this.rowAltButtons) {
                for(var k in this.rowAltButtons) {
                    if(!cmenuGroup.find(x => x.id === `tv-cmenu-${toKebabCase(k)}`)) {
                        var li = document.createElement('li');
                        li.setAttribute('id', `tv-cmenu-${toKebabCase(k)}`);
                        li.classList.add('tv-context-menu__item');
                        li.classList.add('d-none');

                        var span = document.createElement('span');

                        var i = document.createElement('i');
                        i.setAttribute('class', this.rowAltButtons[k].icon);
                        i.style.color = this.rowAltButtons[k].color;

                        var title = document.createTextNode(this.rowAltButtons[k].title);

                        span.appendChild(i);
                        span.appendChild(title);
                        li.appendChild(span);

                        document.getElementById("alt-button-content").appendChild(li);
                    }
                }
            }
        },

        debounceDataFiltered: function() {
            this.timeoutId = debounce(this, this.setDataFiltered, this.timeoutId);
        },
        setDataFiltered: function() {
            const searchValue = this.data_table.filtro.trim().toLowerCase();
            var rows = this.content.slice();
            var dataFilteredAux = [];

            if(searchValue == '') {
                dataFilteredAux = rows;
            } else {
                dataFilteredAux = rows.filter((row)=> {
                    if(row.search) {
                        var rowCells = row.search.toString().toLowerCase();
                        if(rowCells.includes(searchValue)) {
                            return true;
                        }
                    } else {
                        for(var i in this.columns) {
                            if(this.columns[i].type == 'CHECKBOX'){
                                continue;
                            }
    
                            var rowCells = row.data[this.columns[i].name].value;
                            if(rowCells && rowCells.toString().toLowerCase().includes(searchValue)) {
                                return true;
                            }
                        }
                    }

                    return false;
                })
            }
            
            this.data_table.quantidadePagina = Math.ceil(dataFilteredAux.length / this.data_table.paginacao);
            this.sortTable(dataFilteredAux, this.sortColumnName, this.sort, this.sortColumnType);

            this.timeoutId = null;

            if(this.nestedTableRow.index != null) {
                setTimeout(() => {
                    document.getElementById(`tv-table-${this.title}`).scrollTo(0, this.data_table.tablePosition);
                    this.rowAction(this.nestedTableRow.index, true);
                    this.nestedTableRow.index = null;
                }, 100);
            } else {
                this.resetaRowAction();
            }
        },

        setSortDefault: function() {
            if(this.sortDefault) {
                if(this.columns.find(x => x.name == this.sortDefault)) {
                    this.sortColumnType = this.columns.find(x => x.name == this.sortDefault).type;
                }
            }
        },

        setSortedColumn: function(columnName, columnType, dontSort) {
            if(dontSort) {
                return
            }

            if(this.sortColumnName == columnName) {
                this.sort = (this.sort == 'desc') ? 'asc' : 'desc';
            } else {
                this.sort = 'asc';
                this.sortColumnName = columnName;
                this.sortColumnType = columnType;
            }
            
            this.sortTable(this.dataFiltered.slice(), this.sortColumnName, this.sort, this.sortColumnType);
            this.resetaRowAction();
        },

        sortTable: function(rows, columnName, direction, columnType) {
            if(columnType == 'string' || columnType == 'color') {
                rows.sort(function (a, b) {
                    if (String(a.data[columnName].value).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") > String(b.data[columnName].value).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                        return (direction == 'desc') ? -1 : 1;
                    }

                    if (String(a.data[columnName].value).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") < String(b.data[columnName].value).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                        return (direction == 'desc') ? 1 : -1;
                    }

                    return 0;
                });
            } else if(columnType == 'date') {
                rows.sort(function (a, b) {
                    var timeA = "";
                    var timeB = "";
                    var dateA = "";
                    var dateB = "";
                    var datetimeA = 0;
                    var datetimeB = 0;
        
                    if(a.data[columnName].value.includes(',')) {
                        dateA = a.data[columnName].value.split(', ')[0].split('/');
                        timeA = a.data[columnName].value.split(', ')[1];
                    } else {
                        dateA = a.data[columnName].value.split('/');
                    }
        
                    if(b.data[columnName].value.includes(',')) {
                        dateB = b.data[columnName].value.split(', ')[0].split('/');
                        timeB = b.data[columnName].value.split(', ')[1];
                    } else {
                        dateB = b.data[columnName].value.split('/');
                    }
        
                    if(dateA != "") {
                        datetimeA = Date.parse(dateA.reverse().join('-') + ' ' + timeA);
                    }
        
                    if(dateB != "") {
                        datetimeB = Date.parse(dateB.reverse().join('-') + ' ' + timeB);
                    }
        
                    if (datetimeA > datetimeB) {
                        return (direction == 'desc') ? -1 : 1;
                    }

                    if (datetimeA < datetimeB) {
                        return (direction == 'desc') ? 1 : -1;
                    }
        
                    return 0;
                });
            } else if(columnType == 'icon') {
                rows.sort(function (a, b) {
                    if(a.data[columnName].value.length > 0) {
                        var auxA = "";
                        var auxB = "";
                        for (var k in a.data[columnName].value) {
                            auxA += a.data[columnName].value[k].title
                        }
        
                        for (var j in b.data[columnName].value) {
                            auxB += b.data[columnName].value[j].title
                        }
        
                        if (String(auxA).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") > String(auxB).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                            return (direction == 'desc') ? -1 : 1;
                        }
        
                        if (String(auxA).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") < String(auxB).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                            return (direction == 'desc') ? 1 : -1;
                        }

                        return 0;
                    }

                    return 0
                });
            } else if(columnType == 'int' || columnType == 'progress') {
                rows.sort(function (a, b) {
                    var valueA = (a.data[columnName].value != "") ? parseFloat(String(a.data[columnName].value).replace(/\./g, "").replace(',','.').replace(/[^\d.-]/g, '')) : "";
        
                    if(typeof a.data[columnName].value === 'string' && a.data[columnName].value.includes("|")) {
                        valueA = 0;
                        var splitedValueA = a.data[columnName].value.split(" | ");
        
                        for(var i in splitedValueA) {
                            valueA += parseFloat(String(splitedValueA[i]).replace(/\./g, "").replace(',','.').replace(/[^\d.-]/g, ''));
                        }
                    }
        
                    var valueB = (b.data[columnName].value != "") ? parseFloat(String(b.data[columnName].value).replace(/\./g, "").replace(',','.').replace(/[^\d.-]/g, '')) : "";
        
                    if(typeof b.data[columnName].value === 'string' && b.data[columnName].value.includes("|")) {
                        var valueB = 0;
                        var splitedValueB = b.data[columnName].value.split(" | ");
        
                        for(var j in splitedValueB) {
                            valueB += parseFloat(String(splitedValueB[j]).replace(/\./g, "").replace(',','.').replace(/[^\d.-]/g, ''));
                        }
                    }
        
                    if(valueA > valueB) {
                        return (direction == 'desc') ? -1 : 1;
                    }
        
                    if(valueA < valueB) {
                        return (direction == 'desc') ? 1 : -1;
                    }
        
                    return 0;
                });
            }
                
            this.dataFiltered = rows;
        },

        dataTableViraPagina: function(x){
            if(x == '-')
                if(this.data_table.paginaAtual > 1)
                    this.data_table.paginaAtual--;
            if(x == '+')
                if(this.data_table.paginaAtual < this.data_table.quantidadePagina)
                    this.data_table.paginaAtual++;
            if(x == 'MIN')
                this.data_table.paginaAtual = 1;
            if(x == 'MAX')
                this.data_table.paginaAtual = this.data_table.quantidadePagina;

            this.data_table.paginaAtualItemFechado = this.data_table.paginaAtual

            this.resetaRowAction();
        },

        changePaginacao: function(value){
            this.data_table.paginaAtual = 1;
            this.data_table.paginacao = value;

            this.data_table.quantidadePagina = Math.ceil(this.dataFiltered.length / this.data_table.paginacao);

            this.resetaRowAction();
        },

        changeSearch: function() {
            this.data_table.paginaAtual = 1;
            this.data_table.indexClick = null

            this.debounceDataFiltered();
        },

        focusInput: function(input) {
            if(input == "select"){
                this.focusSelect = true;
            }else if(input == "search"){
                this.focusSearch = true;
            }
        },

        blurInput: function(input) {
            if(input == "select"){
                this.focusSelect = false;
            }else if(input == "search"){
                this.focusSearch = false;
            }
        },

        rowAction: function(index, dontReset) {
            var table = document.getElementById(`tv-table-${this.title}`);
            var element = document.getElementById(`tv-table-row-${this.title}-${index}`);
            var dontResetAux = (dontReset) ? true : false;

            if(table && element) {
                if(element.classList.contains("tv-table-row--active") && !dontResetAux) {
                    this.resetaRowAction();
                } else {
                    this.resetaRowAction();
                    element.classList.add("tv-table-row--active");
                }
            }

            this.data_table.indexClick = index;
            this.data_table.windowPosition = document.documentElement.scrollTop;
            this.data_table.tablePosition = document.getElementById(`tv-table-${this.title}`).scrollTop;
        },
        resetaRowAction: function() {
            var rows = document.getElementById(`tv-table-${this.title}`);
            if(rows) {
                rows = rows.getElementsByClassName("tv-table-row tv-table-row--active");
                for(var i = 0; i < rows.length; i++) {
                    rows[i].classList.remove("tv-table-row--active");
                }
            }
        },

        checkAll: function(value, enableCheckbox = false) {
            this.checkedList = [];

            for (var i = 0; i < this.dataFiltered.length; i++) {
                if(enableCheckbox) {
                    this.dataFiltered[i].checkbox.disable = false;
                }

                if(!this.dataFiltered[i].checkbox.disable) {
                    this.dataFiltered[i].checkbox.checked = value;

                    if(value) {
                        Vue.set(this.checkedList, this.checkedList.length, this.dataFiltered[i].data[this.idColumn].value)
                    }
                }
            }

            this.data_table.allchecked = value;
            this.$emit('checked', this.checkedList);
        },

        refreshCheckedList: function() {
            this.checkedList = [];
            var checkedCout = 0;

            for(var i = 0; i < this.content.length; i++) {
                if(this.content[i].checkbox.checked) {
                    Vue.set(this.checkedList, this.checkedList.length, this.content[i].data[this.idColumn].value);
                }

                if(!this.content[i].checkbox.disable) {
                    checkedCout++;
                }
            }

            if(checkedCout > 0 && this.checkedList.length == checkedCout) {
                this.data_table.allchecked = true;
            } else {
                this.data_table.allchecked = false;
            }

            if(this.checkedList.length > 0) {
                this.$emit('checked', this.checkedList);
            }
        },

        emitCheckedList: function(value, add) {
            if(add == true) {
                Vue.set(this.checkedList, this.checkedList.length, value)
            } else {
                var index = this.checkedList.indexOf(value);
                this.checkedList.splice(index, 1);
            }

            if(this.checkedList.length == this.dataFiltered.length) {
                this.data_table.allchecked = true;
            } else {
                this.data_table.allchecked = false;
            }

            this.$emit('checked', this.checkedList);
        },

        toggleRowDisableCheckbox: function(itemId, value) {
            const itemIndex = this.dataFiltered.findIndex(x => x.data.ID.value == itemId);
            if(itemIndex != -1) {
                this.dataFiltered[itemIndex].checkbox.disable = value;
            }
        },

        refreshRadioValue: function() {
            this.checkedRadioValue = ''

            for(var i = 0; i < this.content.length; i++) {
                if(this.content[i].radio.checked) {
                    this.checkedRadioValue = this.content[i].data[this.idColumn].value;
                    break
                }
            }

            if(this.checkedRadioValue != '') {
                this.$emit('checkedRadio', this.checkedRadioValue);
            }
        },

        emitRadioValue: function(value) {
            if(this.checkedRadioValue == value) {
                return
            }

            let rowIndex = this.dataFiltered.findIndex(x => x.data[this.idColumn].value == this.checkedRadioValue);
            if(rowIndex != -1) {
                this.dataFiltered[rowIndex].radio.checked = false;
            }

            this.checkedRadioValue = value

            this.$emit('checkedRadio', value);
        },

        displayActionsButton: function(row) {
            if(row.buttons) {
                for(var i in row.buttons) {
                    if(row.buttons[i].disable == undefined || row.buttons[i].disable == false) {
                        return true
                    }
                }
            }
            
            return false;
        },

        openContextMenu: function(row, rowI, e) {
            if(!this.rowButtons || !row.buttons) {
                return;
            }

            let vue = this;
            let separator = false;
            document.getElementById("alt-button-content").classList.remove('separator');

            if(row.buttons.edit && (row.buttons.edit.disable == undefined || !row.buttons.edit.disable)) {
                separator = true;
                document.getElementById("tv-cmenu-edit").classList.remove('d-none');
                document.getElementById("tv-cmenu-edit").classList.add('d-block');
                document.getElementById("tv-cmenu-edit").onclick = function(){ vue.emitRowButtons('edit', rowI) };
            } else {
                document.getElementById("tv-cmenu-edit").classList.remove('d-block');
                document.getElementById("tv-cmenu-edit").classList.add('d-none');
            }

            if(row.buttons.delete && (row.buttons.delete.disable == undefined || !row.buttons.delete.disable)) {
                separator = true;
                document.getElementById("tv-cmenu-delete").classList.remove('d-none');
                document.getElementById("tv-cmenu-delete").classList.add('d-block');
                document.getElementById("tv-cmenu-delete").onclick = function(){ vue.emitRowButtons('delete', rowI) };
            } else {
                document.getElementById("tv-cmenu-delete").classList.remove('d-block');
                document.getElementById("tv-cmenu-delete").classList.add('d-none');
            }

            const cmenuGroup = Array.prototype.slice.call(document.getElementById('alt-button-content').children);
            for(var i in cmenuGroup) {
                cmenuGroup[i].classList.remove('d-block');
                cmenuGroup[i].classList.add('d-none');
            }

            for(var i in this.rowAltButtons) {
                var altButtonTitleAux = toKebabCase(i);

                if(row.buttons[i].disable == undefined || !row.buttons[i].disable) {
                    if(separator) {
                        separator = false;
                        document.getElementById("alt-button-content").classList.add('separator');
                    }

                    document.getElementById(`tv-cmenu-${altButtonTitleAux}`).classList.remove('d-none');
                    document.getElementById(`tv-cmenu-${altButtonTitleAux}`).classList.add('d-block');
                    (function(altButtonTitleAux) {
                        document.getElementById(`tv-cmenu-${altButtonTitleAux}`).onclick = function(){
                            vue.emitRowAltButtons(altButtonTitleAux, rowI)
                        };
                    })(altButtonTitleAux);

                    if(row.buttons[i].alert == undefined) {
                        continue;  
                    }

                    if(row.buttons[i].alert) {
                        document.getElementById(`tv-cmenu-${altButtonTitleAux}`).classList.add('tv-context-menu__alert');
                    } else {
                        document.getElementById(`tv-cmenu-${altButtonTitleAux}`).classList.remove('tv-context-menu__alert');
                    }
                } else {
                    document.getElementById(`tv-cmenu-${altButtonTitleAux}`).classList.remove('d-block');
                    document.getElementById(`tv-cmenu-${altButtonTitleAux}`).classList.add('d-none');
                }
            }

            document.getElementById("tv-cmenu").classList.add("show");
            document.getElementById("tv-cmenu").style.top = mouseYPosition(e, 'cmenu') + "px";
            document.getElementById("tv-cmenu").style.left = mouseXPosition(e, 'cmenu') + "px";

            this.rowAction(rowI, true);
            e.preventDefault();
        },

        emitRowButtons: function(button, rowI) {
            if(this.useEndpoint) {
                if(button == 'edit') {
                    this.editRecord(this.dataDisplayed[rowI].data[this.idColumn].value);
                } else if(button == 'delete') {
                    this.deleteRecordDialog(this.dataDisplayed[rowI].data[this.idColumn].value, this.dataDisplayed[rowI].data[this.refColumn].value);
                }
            } else {
                this.$emit(button, this.dataDisplayed[rowI]);
            }

            this.rowAction(rowI, true);
        },

        editRecord: function(id){
            if(this.endpoint && this.endpoint !== ""){
                var settings = {
                    url: `${this.endpoint}&id=${id}&subacao=get`,
                    method: "GET",
                    envio: "",
                    async: false
                };
                sendUrlAxios(settings,this.$parent.editRecordCallback, this.title);
            }else{
                this.$emit('edit', id);
            }

            this.data_table.onRecord = true;

            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        },

        deleteRecordDialog: function(id, label){
            var vm = this;
            alertDialogReset();
            $('#alert_dialog').modal();
            document.getElementById("dialog_msg").innerHTML = "Excluir <strong>" + label + "</strong> ?";
            document.getElementById("dialog_btn_text").innerHTML = "Excluir";
            document.getElementById("dialog_btn").classList.add("btn-action--danger");
            document.getElementById("dialog_btn").onclick = function(){ vm.deleteRecord(id)};
        },
        deleteRecord: function(id){
            $('#alert_dialog').modal('hide');
            this.resetaRowAction();

            if(this.endpoint && this.endpoint !== ""){
                var settings = {
                    url: `${this.endpoint}&id=${id}&subacao=delete`,
                    metodo: "DELETE",
                    envio: "",
                    async: false
                };
                sendUrlAxios(settings,this.$parent.deleteRecordCallback, this.title);
            }else{
                this.$emit('delete', id);
            }

            this.data_table.onRecord = true;
        },

        emitRowAltButtons: function(buttonTitle, rowI) {
            var button = toKebabCase(buttonTitle);
            this.$emit(button, this.dataDisplayed[rowI].data);
            this.rowAction(rowI, true);
        },

        emitAddButton: function() {
            this.data_table.indexClick = null;
            this.$emit('add-action');
        },

        toggleNestTable: function(rowI) {
            if(this.nestedTableRow.show) {
                this.customHeightValue = this.customHeight;
                this.windowResize();
                this.nestedTableRow.show = false;
                this.debounceDataFiltered();
                this.data_table.paginaAtual = (this.data_table.paginaAtualItemFechado) ? this.data_table.paginaAtualItemFechado : 1;
                this.data_table.quantidadePagina = Math.ceil(this.dataFiltered.length / this.data_table.paginacao);
            } else {
                this.nestedTableRow.index = rowI;
                var item = this.dataDisplayed[rowI];
                this.$emit('load-nest-table', item);

                this.data_table.windowPosition = document.documentElement.scrollTop;
                this.data_table.tablePosition = document.getElementById(`tv-table-${this.title}`).scrollTop;
                
                setTimeout(() => {
                    this.dataFiltered = [item];
                    this.data_table.paginaAtual = 1;
                    this.data_table.quantidadePagina = 1;
                    this.nestedTableRow.show = true;
                    this.customHeightValue = 'none';
                    this.windowResize();
                }, 100);
            }
        },

        windowResize: function() {
            var el = document.getElementById(`tv-table-${this.title}-content`);
            if(el != null) {
                if(window.matchMedia('(min-width: 992px)').matches) {
                    if(this.customHeightValue != "") {
                        el.style.maxHeight = this.customHeightValue;
                    } else {
                        el.style = "";
                    }
                } else {
                    el.style.maxHeight = "none";
                }
            }
        },

        openDatatableConfig: function() {
			$('#datatable-config-dialog').modal('show');
		},

        toggleCellTooltip: function(action, e, text) {
            setTimeout(() => {
                if(action == 'open') {
                    openTooltip(e, text, false, 'small');
                } else if(action == 'close') {
                    closeTooltip();
                }
            }, 100);
        },
    }
})

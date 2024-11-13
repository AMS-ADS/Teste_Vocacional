<section>
    <div class="d-flex m-5">
        <button class="btn-icon mr-2 back-button" title="Voltar" onclick="backHome(true)" style="margin-top: -7px;">
            <i class="fas fa-arrow-left"></i>
        </button>
        <div class="progress-container" style="width: 100%;">
            <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
        </div>
    </div>      
    <div class="tv-card text-center mx-5 text-uppercase">{{form.pergunta}}</div>
</section>

<section>
    <div class="p-5 m-5 game-container" v-if="currentComponent == 'tvTemplateOne'" style="background-color: #000; border-radius: 10px; position: relative; overflow: hidden;">
        <div class="row" style="min-height: calc(100vh - 480px); position: relative;">
            <!-- Pac-Man -->
            <div 
                :style="{ top: pacmanPosition.top + '%', left: pacmanPosition.left + '%', position: 'absolute' }"
                @click="eatFace">
                <img src="../../../dist/images/pacman.png" alt="" width="125" height="125">
            </div>

            <!-- Loop das carinhas -->
            <div v-for="(face, index) in carinhas" :key="index" v-if="!face.captured" 
                :style="face.style" class="carinha" style="position: absolute;">
                <img :src="face.src" width="90" height="90" />
            </div>
        </div>
    </div>

    <div v-else class="p-5" style="min-height: calc(100vh - 307px);">
        <template v-if="currentComponent == 'tvTemplateTwo'">
            <div class="d-flex flex-column justify-content-center align-items-start" style="min-height: calc(100vh - 500px);">
                <label class="mb-3 text-left text-uppercase">Quanto concorda de 0 a 10?</label>
                <tv-input-toggle-button id="tableDuplicatasMode" v-model="opcoes" :default="opcoes" :options="tableOpcoes"></tv-input-toggle-button>
            </div>
        </template>
        <template v-if="currentComponent == 'tvTemplateTree'">
            <div class="center-container" style="min-height: calc(100vh - 500px);">
                <div class="rating">
                    <input type="radio" id="estrela5" name="rating" value="5">
                    <label for="estrela5">★</label>

                    <input type="radio" id="estrela4" name="rating" value="4">
                    <label for="estrela4">★</label>

                    <input type="radio" id="estrela3" name="rating" value="3">
                    <label for="estrela3">★</label>

                    <input type="radio" id="estrela2" name="rating" value="2">
                    <label for="estrela2">★</label>

                    <input type="radio" id="estrela1" name="rating" value="1">
                    <label for="estrela1">★</label>
                </div>
            </div>
        </template>
        <template v-if="currentComponent == 'tvTemplateFor'">
            <div class="slider-container d-flex flex-column justify-content-center align-items-start" style="min-height: calc(100vh - 500px);">
                <label for="rangeInput" class="mb-3 text-left text-uppercase">O quanto você concorda com a questão a seguir?</label>
                <input type="range" id="rangeInput" min="0" max="100" value="50">
            </div>
        </template>
    </div>
</section>
<section>
    <button class="btn-continuar" @click="nextPage">
        CONTINUAR
    </button>
</section>

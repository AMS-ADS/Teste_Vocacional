var tvPergunta = {
    data: function() {
        return {
            list: {
                index: ['primeira', 'segunda', 'terceira', 'quarta', 'quinta'],
                templates: ['tvTemplateOne', 'tvTemplateTwo', 'tvTemplateTree', 'tvTemplateFor']
            },
            form: {
                curso: 0,
                pergunta: ''
            },
            tableOpcoes: [
                { id: '1', descricao: '1', disabled: false },
                { id: '2', descricao: '2', disabled: false },
                { id: '3', descricao: '3', disabled: false },
                { id: '4', descricao: '4', disabled: false },
                { id: '5', descricao: '5', disabled: false },
                { id: '6', descricao: '6', disabled: false },
                { id: '7', descricao: '7', disabled: false },
                { id: '8', descricao: '8', disabled: false },
                { id: '9', descricao: '9', disabled: false },
                { id: '10', descricao: '10', disabled: false }
            ],
            opcoes: 0,
            currentComponent: null,
            currentStep: 0,
            totalSteps: 30,
            exibidasPerguntas: [],
            pacmanPosition: { top: 50, left: 50 }, // Posição inicial do Pac-Man
            carinhas: [
                { id: 1, src: '../../../dist/images/mal.png', captured: false, style: {} },
                { id: 2, src: '../../../dist/images/meio_mal.png', captured: false, style: {} },
                { id: 3, src: '../../../dist/images/mmedio.png', captured: false, style: {} },
                { id: 4, src: '../../../dist/images/meio_feliz.png', captured: false, style: {} },
                { id: 5, src: '../../../dist/images/feliz.png', captured: false, style: {} }
            ],
            ordemCarinhasComidas: []
        }
    },
    mounted() {
        if (this.currentComponent === 'tvTemplateOne') {
            this.placeCharacters();
            window.addEventListener('keydown', this.handleKeyPress);
        }
    },
    beforeDestroy() {
        if (this.currentComponent === 'tvTemplateOne') {
            window.removeEventListener('keydown', this.handleKeyPress);
        }
    },
    computed: {
        progressWidth() {
            return (this.currentStep / this.totalSteps) * 100;
        }
    },
    created() {
        this.nextPage();
    },
    methods: {
        nextPage() {
            this.getPergunta();
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
            }

            const randomIndex = Math.floor(Math.random() * this.list.templates.length);
            this.currentComponent = this.list.templates[randomIndex];

            this.placeCharacters();
            window.addEventListener('keydown', this.handleKeyPress);
            this.carinhas.forEach((carinha,) => {
                carinha.captured = false;
            });
            
        },

        getPergunta() {
            var settings = {
                url: `back-end/pergunta.php?acao=getPergunta`,
                metodo: "GET",
                envio: "",
                async: false
            };
            sendUrlAxios(settings, this.getPerguntaCallback);
        },

        getPerguntaCallback(status, response) {
            if (status == 200) {
                let result = response.data;
                let novaPergunta = null;
                let randomIndexAux = null;
                let index = null;
                const randomIndex = Math.floor(Math.random() * result.length);

                do {
                    randomIndexAux = Math.floor(Math.random() * this.list.index.length);
                    index = this.list.index[randomIndexAux];
                    novaPergunta = result[randomIndex][index];
                } while (this.exibidasPerguntas.includes(novaPergunta) && this.exibidasPerguntas.length < result.length);

                this.exibidasPerguntas.push(novaPergunta);
                this.form.pergunta = novaPergunta;
                this.form.curso = result[randomIndex].curso;

            } else if (status == 500) {
                alertBanner(500);
            }
        },

        placeCharacters() {
            const positions = [];
            this.carinhas.forEach(carinha => {
                let position;
                let attempts = 0;

                // Tentar encontrar uma posição que não esteja muito perto das outras
                do {
                    const top = Math.random() * 80 + 10; // Garante que a carinha não fique na borda
                    const left = Math.random() * 80 + 10;
                    position = { top, left };
                    
                    // Checa se a nova posição está longe o suficiente das outras carinhas
                    const isFarEnough = positions.every(p => {
                        const distance = Math.sqrt(Math.pow(p.top - top, 2) + Math.pow(p.left - left, 2));
                        return distance > 10; // Distância mínima entre carinhas
                    });

                    if (isFarEnough) {
                        positions.push(position);
                        break;
                    }

                    attempts++;
                } while (attempts < 100);

                carinha.style = {
                    top: `${position.top}%`,
                    left: `${position.left}%`
                };
            });
        },
        handleKeyPress(event) {
            const key = event.key;
            let newPos = { ...this.pacmanPosition };
        
            const pacmanSize = 5; // Percentual do tamanho do Pac-Man, com base na altura/largura (considerando ele como 125px)
        
            // Ajuste de movimento, levando em conta o tamanho do Pac-Man
            if (key === 'ArrowUp') newPos.top = Math.max(-22, this.pacmanPosition.top - 5);
            if (key === 'ArrowDown') newPos.top = Math.min(80 - pacmanSize, this.pacmanPosition.top + 5);
            if (key === 'ArrowLeft') newPos.left = Math.max(-4, this.pacmanPosition.left - 5);
            if (key === 'ArrowRight') newPos.left = Math.min(100 - pacmanSize, this.pacmanPosition.left + 5);
        
            this.pacmanPosition = newPos;
            this.checkCollision();
        },
        checkCollision() {
            // Verificar colisão entre o Pac-Man e as carinhas
            this.carinhas.forEach((carinha, index) => {
                if (!carinha.captured && this.isCollision(carinha.style)) {
                    this.captureFace(index);
                }
            });
        },
        isCollision(carinhaStyle) {
            // Checar se a posição do Pac-Man coincide com a da carinha
            const pacmanRect = { 
                top: this.pacmanPosition.top, 
                left: this.pacmanPosition.left, 
                size: 10 
            };
            const carinhaRect = { 
                top: parseFloat(carinhaStyle.top), 
                left: parseFloat(carinhaStyle.left), 
                size: 10 
            };

            return (
                Math.abs(pacmanRect.top - carinhaRect.top) < pacmanRect.size &&
                Math.abs(pacmanRect.left - carinhaRect.left) < pacmanRect.size
            );
        },
        captureFace(index) {
            this.carinhas[index].captured = true;
            this.ordemCarinhasComidas.push(
                {
                    contadorCarinhas: this.carinhas[index].id,
                    cursoPergunta: this.form.curso
                }
            );
            console.log(this.ordemCarinhasComidas)
        },
        eatFace() {
            // Simular o Pac-Man comendo a próxima carinha disponível
            const nextFace = this.carinhas.findIndex(face => !face.captured);
            if (nextFace !== -1) {
                this.captureFace(nextFace);
            }
        }
    }
};

new Vue({
    el: '#app',
    components: {
        tvPergunta: tvPergunta
    }
});

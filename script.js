// --- MOTOR PRINCIPAL ---
// --- MOTOR PRINCIPAL ---

// Função para parar todas as músicas antes de tocar a próxima
function pararTodasAsMusicas() {
    const musicas = ['musica-forca', 'musica-stop', 'musica-puzzle', 'musica-pacman', 'musica-labirinto'];
    musicas.forEach(id => {
        let audio = document.getElementById(id);
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Volta o áudio para o início
        }
    });
}

function mudarFase(idAtual, idProxima) {
    document.getElementById(idAtual).classList.add('escondido');
    document.getElementById(idProxima).classList.remove('escondido');
    
    // Para todas as músicas sempre que muda de ecrã
    pararTodasAsMusicas();
    
    // Toca a música correspondente à nova fase
    let idMusica = "";
    if (idProxima === 'fase-forca') idMusica = 'musica-forca';
    if (idProxima === 'fase-stop') idMusica = 'musica-stop';
    if (idProxima === 'fase-puzzle') idMusica = 'musica-puzzle';
    if (idProxima === 'fase-pacman') idMusica = 'musica-pacman';
    
    if (idMusica !== "") {
        let audioParaTocar = document.getElementById(idMusica);
        // O .catch evita erros caso o navegador bloqueie o áudio automático
        if (audioParaTocar) audioParaTocar.play().catch(e => console.log("Áudio bloqueado pelo navegador")); 
    }
    
    // Inicializações de fases específicas
    if (idProxima === 'fase-puzzle') {
        prepararPuzzle();
    }
    if (idProxima === 'fase-pacman') {
        iniciarPacman();
    }
}

// --- FASE 1: FORCA ---
const palavras = ["PROTECAO", "ORIENTACAO", "CONFIANCA", "FUTURO", "EXEMPLO", "CARINHO", "AMIZADE"];
let palavraSorteada = "";
let letrasAdivinhadas = [];
let tentativasRestantes = 6;

function iniciarForca() {
    palavraSorteada = palavras[Math.floor(Math.random() * palavras.length)];
    letrasAdivinhadas = [];
    tentativasRestantes = 6;
    document.getElementById('btn-proxima-fase1').classList.add('escondido');
    criarTeclado();
    desenharForca(0); 
    atualizarTelaForca();
}

function criarTeclado() {
    const tecladoDiv = document.getElementById('teclado');
    tecladoDiv.innerHTML = "";
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < alfabeto.length; i++) {
        let letra = alfabeto[i];
        let botao = document.createElement('button');
        botao.innerText = letra;
        botao.className = 'tecla';
        botao.onclick = function() { chutarLetra(letra, botao); };
        tecladoDiv.appendChild(botao);
    }
}

function chutarLetra(letra, botaoClicado) {
    botaoClicado.disabled = true;
    letrasAdivinhadas.push(letra);
    if (!palavraSorteada.includes(letra)) {
        tentativasRestantes--;
        desenharForca(6 - tentativasRestantes); 
    }
    atualizarTelaForca();
}

function atualizarTelaForca() {
    let textoMostrar = "";
    let ganhou = true;

    for (let i = 0; i < palavraSorteada.length; i++) {
        let letra = palavraSorteada[i];
        if (letrasAdivinhadas.includes(letra)) {
            textoMostrar += letra;
        } else {
            textoMostrar += "_";
            ganhou = false;
        }
    }

    document.getElementById('palavra-secreta').innerText = textoMostrar;
    document.getElementById('forca-status').innerText = "Tentativas restantes: " + tentativasRestantes;
    document.getElementById('forca-status').style.color = "#e74c3c";

    if (ganhou) {
        document.getElementById('forca-status').innerText = "Você passou no teste!";
        document.getElementById('forca-status').style.color = "#2ecc71";
        document.getElementById('teclado').innerHTML = "";
        document.getElementById('btn-proxima-fase1').classList.remove('escondido');
    } else if (tentativasRestantes <= 0) {
        document.getElementById('forca-status').innerText = "Game Over! O enigma continua oculto...";
        document.getElementById('teclado').innerHTML = '<button onclick="iniciarForca()">Tentar Novamente</button>';
    }
}

function desenharForca(erros) {
    const canvas = document.getElementById('forca-canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2c3e50';

    if (erros === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(10, 190);
        ctx.lineTo(190, 190);
        ctx.moveTo(50, 190);
        ctx.lineTo(50, 20);
        ctx.moveTo(50, 20);
        ctx.lineTo(120, 20);
        ctx.moveTo(120, 20);
        ctx.lineTo(120, 50);
        ctx.stroke();
    }
    if (erros === 1) {
        ctx.beginPath();
        ctx.arc(120, 70, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (erros === 2) {
        ctx.beginPath();
        ctx.moveTo(120, 90);
        ctx.lineTo(120, 140);
        ctx.stroke();
    }
    if (erros === 3) {
        ctx.beginPath();
        ctx.moveTo(120, 100);
        ctx.lineTo(90, 120);
        ctx.stroke();
    }
    if (erros === 4) {
        ctx.beginPath();
        ctx.moveTo(120, 100);
        ctx.lineTo(150, 120);
        ctx.stroke();
    }
    if (erros === 5) {
        ctx.beginPath();
        ctx.moveTo(120, 140);
        ctx.lineTo(90, 180);
        ctx.stroke();
    }
    if (erros === 6) {
        ctx.beginPath();
        ctx.moveTo(120, 140);
        ctx.lineTo(150, 180);
        ctx.stroke();
    }
}

iniciarForca();

// --- FASE 2: STOP ---
let timerStop;
let tempoRestante = 30;
let letraAtual = '';

function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function iniciarStop() {
    document.getElementById('btn-iniciar-stop').classList.add('escondido');
    document.getElementById('painel-stop').classList.remove('escondido');
    document.getElementById('mensagem-stop').innerText = "";
    document.getElementById('btn-proxima-fase2').classList.add('escondido');
    
    // Alfabeto filtrado: apenas letras com virtudes e objetos fáceis em português
    // (Tirámos K, Q, W, X, Y, Z para ninguém ficar bloqueado)
    const alfabetoStop = "ABCDEFGHILMNOPRSTUV";
    letraAtual = alfabetoStop[Math.floor(Math.random() * alfabetoStop.length)];
    document.getElementById('letra-stop').innerText = letraAtual;
    
    // Limpa os novos campos temáticos
    document.getElementById('input-nome').value = "";
    document.getElementById('input-caracteristica').value = "";
    document.getElementById('input-objeto').value = "";
    
    // Habilita os campos para digitação
    document.getElementById('input-nome').disabled = false;
    document.getElementById('input-caracteristica').disabled = false;
    document.getElementById('input-objeto').disabled = false;
    document.getElementById('btn-gritar-stop').disabled = false;
    
    tempoRestante = 30;
    document.getElementById('tempo-stop').innerText = `Tempo: ${tempoRestante}s`;
    
    clearInterval(timerStop);
    timerStop = setInterval(contarTempo, 1000);
}

function contarTempo() {
    tempoRestante--;
    document.getElementById('tempo-stop').innerText = `Tempo: ${tempoRestante}s`;
    if (tempoRestante <= 0) avaliarStop();
}

function avaliarStop() {
    clearInterval(timerStop);
    
    // Trava os campos quando o tempo acaba ou gritam stop
    document.getElementById('input-nome').disabled = true;
    document.getElementById('input-caracteristica').disabled = true;
    document.getElementById('input-objeto').disabled = true;
    document.getElementById('btn-gritar-stop').disabled = true;
    
    // Pega os valores e remove acentos
    const nomeStr = removerAcentos(document.getElementById('input-nome').value.trim().toUpperCase());
    const caracteristicaStr = removerAcentos(document.getElementById('input-caracteristica').value.trim().toUpperCase());
    const objetoStr = removerAcentos(document.getElementById('input-objeto').value.trim().toUpperCase());
    
    // Valida se começam com a letra certa e têm pelo menos 2 letras
    const nomeOk = nomeStr.startsWith(letraAtual) && nomeStr.length >= 2;
    const caracteristicaOk = caracteristicaStr.startsWith(letraAtual) && caracteristicaStr.length >= 2;
    const objetoOk = objetoStr.startsWith(letraAtual) && objetoStr.length >= 2;
    
    let errosEncontrados = [];
    if (!nomeOk) errosEncontrados.push("Nome");
    if (!caracteristicaOk) errosEncontrados.push("Virtude/Característica");
    if (!objetoOk) errosEncontrados.push("Objeto para Criança");
    
    if (errosEncontrados.length === 0) {
        document.getElementById('mensagem-stop').innerText = "Vou confiar em vocês, hein! Respostas aceitas!";
        document.getElementById('mensagem-stop').style.color = "#2ecc71";
        document.getElementById('btn-proxima-fase2').classList.remove('escondido');
    } else {
        document.getElementById('mensagem-stop').innerText = `Ops! Problema em: ${errosEncontrados.join(", ")}. Tem que começar com a letra ${letraAtual}!`;
        document.getElementById('mensagem-stop').style.color = "#e74c3c";
        document.getElementById('btn-iniciar-stop').classList.remove('escondido');
        document.getElementById('btn-iniciar-stop').innerText = "Tentar Novamente";
    }
}

// --- FASE 3: PUZZLE ---
let estadoPuzzle = [1, 2, 3, 4, 5, 6, 7, 8, ""];
const objetivoPuzzle = [1, 2, 3, 4, 5, 6, 7, 8, ""];
let timerPuzzle;
let segundosPuzzle = 60; 
let puzzleAtivo = false;
let dicaAtiva = false;
let tentativasPuzzle = 0; // NOVO: Contador de tentativas

function iniciarPuzzle() {
    puzzleAtivo = true;
    segundosPuzzle = 120;
    document.getElementById('btn-iniciar-puzzle').classList.add('escondido');
    document.getElementById('mensagem-puzzle').innerText = "";
    document.getElementById('btn-proxima-fase3').classList.add('escondido');
    
    embaralharPuzzle();
    renderizarPuzzle();
    
    clearInterval(timerPuzzle);
    timerPuzzle = setInterval(atualizarTempoPuzzle, 1000);
}

function atualizarTempoPuzzle() {
    segundosPuzzle--;
    
    let minutos = Math.floor(segundosPuzzle / 60);
    let segundosRestantes = segundosPuzzle % 60;
    
    let minTexto = minutos < 10 ? "0" + minutos : minutos;
    let segTexto = segundosRestantes < 10 ? "0" + segundosRestantes : segundosRestantes;
    
    document.getElementById('tempo-puzzle').innerText = `Tempo: ${minTexto}:${segTexto}`;
    
    if (segundosPuzzle <= 0) {
        clearInterval(timerPuzzle);
        puzzleAtivo = false;
        tentativasPuzzle++; // Soma uma tentativa falha
        renderizarPuzzle();
        
        document.getElementById('btn-dica-puzzle').classList.add('escondido');
        
        if (tentativasPuzzle >= 3) {
            // Falhou 3 vezes: esconde o botão de tentar e mostra o botão de pular
            document.getElementById('mensagem-puzzle').innerText = "O tempo esgotou 3 vezes!";
            document.getElementById('mensagem-puzzle').style.color = "#e74c3c";
            document.getElementById('btn-iniciar-puzzle').classList.add('escondido');
            document.getElementById('btn-pular-puzzle').classList.remove('escondido');
        } else {
            // Ainda tem tentativas
            document.getElementById('mensagem-puzzle').innerText = "O tempo acabou! Tente novamente.";
            document.getElementById('mensagem-puzzle').style.color = "#e74c3c";
            document.getElementById('btn-iniciar-puzzle').classList.remove('escondido');
            document.getElementById('btn-iniciar-puzzle').innerText = `Tentar Novamente (${tentativasPuzzle}/3)`;
        }
    }
}

function embaralharPuzzle() {
    let indexVazio = 8;
    for(let i = 0; i < 100; i++) {
        let linha = Math.floor(indexVazio / 3);
        let col = indexVazio % 3;
        let vizinhos = [];
        
        if (linha > 0) vizinhos.push(indexVazio - 3);
        if (linha < 2) vizinhos.push(indexVazio + 3);
        if (col > 0) vizinhos.push(indexVazio - 1);
        if (col < 2) vizinhos.push(indexVazio + 1);
        
        let escolhido = vizinhos[Math.floor(Math.random() * vizinhos.length)];
        [estadoPuzzle[indexVazio], estadoPuzzle[escolhido]] = [estadoPuzzle[escolhido], estadoPuzzle[indexVazio]];
        indexVazio = escolhido;
    }
}

function renderizarPuzzle() {
    const tabuleiro = document.getElementById('tabuleiro-puzzle');
    tabuleiro.innerHTML = "";
    
    for (let i = 0; i < estadoPuzzle.length; i++) {
        let peca = document.createElement('div');
        let valor = estadoPuzzle[i];
        
        if (valor === "") {
            peca.className = "peca-vazia";
        } else {
            peca.className = "peca-puzzle";
            
            // Lógica para mapear qual parte da foto fica em qual peça
            let linhaOriginal = Math.floor((valor - 1) / 3);
            let colunaOriginal = (valor - 1) % 3;
            
            // Aplica a imagem e posiciona o corte perfeitamente
            peca.style.backgroundImage = "url('cortepluzze.jpg')";
            peca.style.backgroundSize = "300px 300px"; // Tamanho total do quebra-cabeça
            peca.style.backgroundPosition = `-${colunaOriginal * 100}px -${linhaOriginal * 100}px`;
            
            if (puzzleAtivo) {
                peca.onclick = () => moverPeca(i);
            }
        }
        tabuleiro.appendChild(peca);
    }
}

function moverPeca(indexPeca) {
    if (!puzzleAtivo) return;
    
    const indexVazio = estadoPuzzle.indexOf("");
    const linhaPeca = Math.floor(indexPeca / 3);
    const colPeca = indexPeca % 3;
    const linhaVazio = Math.floor(indexVazio / 3);
    const colVazio = indexVazio % 3;
    
    const ehAdjacente = (Math.abs(linhaPeca - linhaVazio) === 1 && colPeca === colVazio) || 
                        (Math.abs(colPeca - colVazio) === 1 && linhaPeca === linhaVazio);
    
    if (ehAdjacente) {
        estadoPuzzle[indexVazio] = estadoPuzzle[indexPeca];
        estadoPuzzle[indexPeca] = "";
        renderizarPuzzle();
        verificarVitoriaPuzzle();
    }
}

function verificarVitoriaPuzzle() {
    let venceu = true;
    for (let i = 0; i < estadoPuzzle.length; i++) {
        if (estadoPuzzle[i] !== objetivoPuzzle[i]) {
            venceu = false;
            break;
        }
    }
    
    if (venceu) {
        clearInterval(timerPuzzle);
        puzzleAtivo = false;
        document.getElementById('mensagem-puzzle').innerText = "Quebra-cabeça resolvido!";
        document.getElementById('mensagem-puzzle').style.color = "#2ecc71";
        document.getElementById('btn-proxima-fase3').classList.remove('escondido');
        renderizarPuzzle();
    }
}

function pularPuzzleOficial() {
    mudarFase('fase-puzzle', 'fase-pacman');
}

renderizarPuzzle();

// --- FASE 4: PACMAN CONTINUO (CORRIGIDO) ---
const tamanhoGrade = 10;
let posicaoPacman = { x: 0, y: 0 };
let direcaoPacman = { x: 0, y: 0 };
let pontosPacman = 0;
const metaPontos = 15;
let pontosGrade = [];
let viloes = [];
let jogoPacmanAtivo = false;
let timerViloes;
let timerMovimentoPacman;

function iniciarPacman() {
    posicaoPacman = { x: 0, y: 0 };
    direcaoPacman = { x: 0, y: 0 }; // Começa parado até apertar a 1ª seta
    pontosPacman = 0;
    pontosGrade = [];
    viloes = [{ x: 9, y: 9 }, { x: 9, y: 0 }, { x: 0, y: 9 }]; 
    jogoPacmanAtivo = true;
    
    document.getElementById('btn-proxima-fase4').classList.add('escondido');
    document.getElementById('btn-iniciar-pacman').classList.add('escondido');
    document.getElementById('mensagem-pacman').innerText = "";
    
    gerarPontosAleatorios();
    atualizarPlacarPacman();
    renderizarPacman();
    
    clearInterval(timerViloes);
    clearInterval(timerMovimentoPacman);
    
    // Fantasmas correm a cada 350ms
    timerViloes = setInterval(moverViloes, 350); 
    
    // Pacman anda sozinho a cada 200ms na direção escolhida
    timerMovimentoPacman = setInterval(loopMovimentoPacman, 200);
    
    document.removeEventListener('keydown', mudarDirecaoPacman);
    document.addEventListener('keydown', mudarDirecaoPacman);
}

function gerarPontosAleatorios() {
    while (pontosGrade.length < metaPontos) {
        let x = Math.floor(Math.random() * tamanhoGrade);
        let y = Math.floor(Math.random() * tamanhoGrade);
        
        let ocupado = false;
        if (x === posicaoPacman.x && y === posicaoPacman.y) ocupado = true;
        for (let p of pontosGrade) if (p.x === x && p.y === y) ocupado = true;
        for (let v of viloes) if (v.x === x && v.y === y) ocupado = true;
        
        if (!ocupado) pontosGrade.push({ x: x, y: y });
    }
}

function renderizarPacman() {
    const tabuleiro = document.getElementById('tabuleiro-pacman');
    if (!tabuleiro) return;
    tabuleiro.innerHTML = "";
    
    for (let y = 0; y < tamanhoGrade; y++) {
        for (let x = 0; x < tamanhoGrade; x++) {
            let celula = document.createElement('div');
            celula.className = "celula-pacman";
            
            if (x === posicaoPacman.x && y === posicaoPacman.y) {
                let p = document.createElement('div');
                p.className = "pacman";
                celula.appendChild(p);
            } else {
                let temVilao = false;
                for (let v of viloes) {
                    if (v.x === x && v.y === y) {
                        temVilao = true;
                        break;
                    }
                }
                
                if (temVilao) {
                    let vElemento = document.createElement('div');
                    vElemento.className = "vilao";
                    celula.appendChild(vElemento);
                } else {
                    for (let i = 0; i < pontosGrade.length; i++) {
                        if (pontosGrade[i].x === x && pontosGrade[i].y === y) {
                            let ponto = document.createElement('div');
                            ponto.className = "ponto";
                            celula.appendChild(ponto);
                            break;
                        }
                    }
                }
            }
            tabuleiro.appendChild(celula);
        }
    }
}

function atualizarPlacarPacman() {
    document.getElementById('placar-pacman').innerText = `Pontos: ${pontosPacman} / ${metaPontos}`;
}

function mudarDirecaoPacman(evento) {
    if (!jogoPacmanAtivo) return;
    
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(evento.key)) {
        evento.preventDefault();
    }
    
    if (evento.key === "ArrowUp" || evento.key === "w") direcaoPacman = { x: 0, y: -1 };
    if (evento.key === "ArrowDown" || evento.key === "s") direcaoPacman = { x: 0, y: 1 };
    if (evento.key === "ArrowLeft" || evento.key === "a") direcaoPacman = { x: -1, y: 0 };
    if (evento.key === "ArrowRight" || evento.key === "d") direcaoPacman = { x: 1, y: 0 };
}

function loopMovimentoPacman() {
    if (!jogoPacmanAtivo || (direcaoPacman.x === 0 && direcaoPacman.y === 0)) return;
    
    let novaX = posicaoPacman.x + direcaoPacman.x;
    let novaY = posicaoPacman.y + direcaoPacman.y;
    
    if (novaX >= 0 && novaX < tamanhoGrade && novaY >= 0 && novaY < tamanhoGrade) {
        posicaoPacman.x = novaX;
        posicaoPacman.y = novaY;
        verificarColeta();
        verificarColisao();
        renderizarPacman();
    }
}

function moverViloes() {
    if (!jogoPacmanAtivo) return;
    
    for (let i = 0; i < viloes.length; i++) {
        let v = viloes[i];
        let diffX = posicaoPacman.x - v.x;
        let diffY = posicaoPacman.y - v.y;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            v.x += diffX > 0 ? 1 : -1;
        } else if (diffY !== 0) {
            v.y += diffY > 0 ? 1 : -1;
        } else if (diffX !== 0) {
            v.x += diffX > 0 ? 1 : -1;
        }
    }
    
    renderizarPacman();
    verificarColisao();
}

function verificarColisao() {
    for (let v of viloes) {
        if (v.x === posicaoPacman.x && v.y === posicaoPacman.y) {
            jogoPacmanAtivo = false;
            clearInterval(timerViloes);
            clearInterval(timerMovimentoPacman);
            document.getElementById('mensagem-pacman').innerText = "Você foi pego pelos fantasmas!";
            document.getElementById('mensagem-pacman').style.color = "#e74c3c";
            document.getElementById('btn-iniciar-pacman').classList.remove('escondido');
            return;
        }
    }
}

function verificarColeta() {
    for (let i = 0; i < pontosGrade.length; i++) {
        if (pontosGrade[i].x === posicaoPacman.x && pontosGrade[i].y === posicaoPacman.y) {
            pontosGrade.splice(i, 1);
            pontosPacman++;
            atualizarPlacarPacman();
            break;
        }
    }
    
    if (pontosPacman >= metaPontos) {
        jogoPacmanAtivo = false;
        clearInterval(timerViloes);
        clearInterval(timerMovimentoPacman);
        document.getElementById('mensagem-pacman').innerText = "Fuga concluída com sucesso!";
        document.getElementById('mensagem-pacman').style.color = "#2ecc71";
        document.getElementById('btn-proxima-fase4').classList.remove('escondido');
    }
}

function mostrarAlertaLabirinto() {
    pararTodasAsMusicas(); // Garante que fica em silêncio no alerta
    
    document.getElementById('final-etapa1').classList.add('escondido');
    document.getElementById('alerta-gigante').classList.remove('escondido');
    
    setTimeout(() => {
        document.getElementById('alerta-gigante').classList.add('escondido');
        document.getElementById('final-etapa2-labirinto').classList.remove('escondido');
        
        // Toca a música de tensão do labirinto!
        let audioLabirinto = document.getElementById('musica-labirinto');
        if(audioLabirinto) audioLabirinto.play();
        
        iniciarLabirintoCanvas(); 
    }, 3000);
}

// --- NOVO LABIRINTO COM MOVIMENTO CONTINUO ---
let labPos = { x: 20, y: 20, raio: 7 };
let labDirecao = { x: 0, y: 0 };
let labAtivo = false;
let ctxLab;
let canvasLab;
let loopAnimacaoLab;

function iniciarLabirintoCanvas() {
    canvasLab = document.getElementById('canvas-labirinto');
    ctxLab = canvasLab.getContext('2d');
    labAtivo = true;
    labPos.x = 20;
    labPos.y = 20;
    labDirecao = { x: 0, y: 0 };
    document.getElementById('mensagem-labirinto').innerText = "";
    
    document.removeEventListener('keydown', capturarDirecaoLabirinto);
    document.addEventListener('keydown', capturarDirecaoLabirinto);
    
    cancelAnimationFrame(loopAnimacaoLab);
    loopLabirintoFrame();
}

function desenharLabirintoLimpo(desenharBolinha = true) {
    ctxLab.clearRect(0, 0, canvasLab.width, canvasLab.height);
    
    // 1. Fundo Branco do Labirinto
    ctxLab.fillStyle = "#ffffff";
    ctxLab.fillRect(0, 0, canvasLab.width, canvasLab.height);
    
    // 2. Traçado das Paredes 
    ctxLab.strokeStyle = "#111111";
    ctxLab.lineWidth = 5;
    ctxLab.lineCap = "round";
    ctxLab.beginPath();
    
    // Borda exterior
    ctxLab.strokeRect(10, 10, 280, 280);
    
    // Paredes principais
    ctxLab.moveTo(70, 10); ctxLab.lineTo(70, 240); 
    ctxLab.moveTo(140, 290); ctxLab.lineTo(140, 60); 
    ctxLab.moveTo(210, 10); ctxLab.lineTo(210, 240); 
    
    // Obstáculos
    ctxLab.moveTo(70, 150); ctxLab.lineTo(110, 150); 
    ctxLab.moveTo(140, 200); ctxLab.lineTo(100, 200); 
    ctxLab.moveTo(140, 120); ctxLab.lineTo(180, 120); 
    ctxLab.moveTo(210, 180); ctxLab.lineTo(170, 180); 
    
    ctxLab.stroke();
    
    // 3. Destino / Saída
    ctxLab.fillStyle = "#2980b9";
    ctxLab.fillRect(250, 250, 35, 35);
    ctxLab.fillStyle = "#ffffff";
    ctxLab.font = "bold 11px Arial";
    ctxLab.fillText("FIM", 257, 272);

    // 4. Jogador
    if (desenharBolinha) {
        ctxLab.fillStyle = "#e74c3c";
        ctxLab.beginPath();
        ctxLab.arc(labPos.x, labPos.y, labPos.raio, 0, Math.PI * 2);
        ctxLab.fill();
        ctxLab.strokeStyle = "#c0392b";
        ctxLab.lineWidth = 2;
        ctxLab.stroke();
    }
}

function capturarDirecaoLabirinto(e) {
    if (!labAtivo) return;
    
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
    }
    
    let velocidade = 1.2; // Kaypim pisiyachinchik velocidade nisqanta (aswan suwaylla kuyunanpaq)
    if (e.key === "ArrowUp" || e.key === "w") labDirecao = { x: 0, y: -velocidade };
    if (e.key === "ArrowDown" || e.key === "s") labDirecao = { x: 0, y: velocidade };
    if (e.key === "ArrowLeft" || e.key === "a") labDirecao = { x: -velocidade, y: 0 };
    if (e.key === "ArrowRight" || e.key === "d") labDirecao = { x: velocidade, y: 0 };
}

function loopLabirintoFrame() {
    if (!labAtivo) return;
    
    let novoX = labPos.x + labDirecao.x;
    let novoY = labPos.y + labDirecao.y;
    
    desenharLabirintoLimpo(false);
    
    function bateuNaParede(x, y) {
        let pixel = ctxLab.getImageData(x, y, 1, 1).data;
        return pixel[0] < 50 && pixel[1] < 50 && pixel[2] < 50 && pixel[3] > 0;
    }

    let raio = labPos.raio + 1;
    let colisao = bateuNaParede(novoX, novoY) || 
                  bateuNaParede(novoX + raio, novoY) || 
                  bateuNaParede(novoX - raio, novoY) || 
                  bateuNaParede(novoX, novoY + raio) || 
                  bateuNaParede(novoX, novoY - raio);

    if (colisao && (labDirecao.x !== 0 || labDirecao.y !== 0)) {
        labAtivo = false;
        labDirecao = { x: 0, y: 0 };
        document.getElementById('popup-derrota-labirinto').classList.remove('escondido');
        return;
    } else {
        labPos.x = novoX;
        labPos.y = novoY;
    }
    
    desenharLabirintoLimpo(true);
    
    if (labPos.x >= 250 && labPos.y >= 250) {
        labAtivo = false;
        document.removeEventListener('keydown', capturarDirecaoLabirinto);
        vencerLabirinto();
        return;
    }
    
    loopAnimacaoLab = requestAnimationFrame(loopLabirintoFrame);
}

function reiniciarLabirinto() {
    document.getElementById('popup-derrota-labirinto').classList.add('escondido');
    labPos.x = 40; 
    labPos.y = 40;
    labDirecao = { x: 0, y: 0 };
    labAtivo = true; 
    desenharLabirintoLimpo();
    loopLabirintoFrame();
}

function vencerLabirinto() {
    // 1. Desliga TODAS as músicas de fundo imediatamente
    pararTodasAsMusicas();

    // 2. Esconde o labirinto e mostra o vídeo
    document.getElementById('final-etapa2-labirinto').classList.add('escondido');
    document.getElementById('final-etapa3-video').classList.remove('escondido');

    const video = document.getElementById('video-homenagem');
    video.currentTime = 0; // Garante que o vídeo começa do início
    video.play();

    // 3. Quando o vídeo terminar, abre a carta e toca "É tão lindo"
    video.onended = function() {
        document.getElementById('final-etapa3-video').classList.add('escondido');
        document.getElementById('final-etapa4-convite').classList.remove('escondido');
        
        let audioCarta = document.getElementById('audio-homenagem');
        if (audioCarta) {
            audioCarta.volume = 0.5;
            audioCarta.play().catch(e => console.log("Áudio da carta bloqueado pelo navegador"));
        }
    };
}

// Função para pular o vídeo durante a fase de testes
function pularVideo() {
    const video = document.getElementById('video-homenagem');
    video.pause(); // Pausa o vídeo
    
    // Esconde a tela do vídeo e mostra a tela da carta
    document.getElementById('final-etapa3-video').classList.add('escondido');
    document.getElementById('final-etapa4-convite').classList.remove('escondido');
    
    // Dá play no áudio da homenagem
    const audio = document.getElementById('audio-homenagem');
    audio.play();
}

function aceitarConvite() {
    document.querySelector('.botoes-resposta').classList.add('escondido');
    document.getElementById('mensagem-aceite').classList.remove('escondido');
    criarConfetes();
}

function criarConfetes() {
    for (let i = 0; i < 150; i++) {
        let confete = document.createElement('div');
        confete.className = 'confete';
        confete.style.left = Math.random() * 100 + 'vw';
        confete.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confete.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(confete);
    }
}


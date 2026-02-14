// Estrutura dos grupos de animais
const gruposAnimais = [
    { id: 1, nome: 'Avestruz', numeros: [1, 2, 3, 4] },
    { id: 2, nome: 'Águia', numeros: [5, 6, 7, 8] },
    { id: 3, nome: 'Burro', numeros: [9, 10, 11, 12] },
    { id: 4, nome: 'Borboleta', numeros: [13, 14, 15, 16] },
    { id: 5, nome: 'Cachorro', numeros: [17, 18, 19, 20] },
    { id: 6, nome: 'Cabra', numeros: [21, 22, 23, 24] },
    { id: 7, nome: 'Carneiro', numeros: [25, 26, 27, 28] },
    { id: 8, nome: 'Camelo', numeros: [29, 30, 31, 32] },
    { id: 9, nome: 'Cobra', numeros: [33, 34, 35, 36] },
    { id: 10, nome: 'Coelho', numeros: [37, 38, 39, 40] },
    { id: 11, nome: 'Cavalo', numeros: [41, 42, 43, 44] },
    { id: 12, nome: 'Elefante', numeros: [45, 46, 47, 48] },
    { id: 13, nome: 'Galo', numeros: [49, 50, 51, 52] },
    { id: 14, nome: 'Gato', numeros: [53, 54, 55, 56] },
    { id: 15, nome: 'Jacaré', numeros: [57, 58, 59, 60] },
    { id: 16, nome: 'Leão', numeros: [61, 62, 63, 64] },
    { id: 17, nome: 'Macaco', numeros: [65, 66, 67, 68] },
    { id: 18, nome: 'Porco', numeros: [69, 70, 71, 72] },
    { id: 19, nome: 'Pavão', numeros: [73, 74, 75, 76] },
    { id: 20, nome: 'Peru', numeros: [77, 78, 79, 80] },
    { id: 21, nome: 'Touro', numeros: [81, 82, 83, 84] },
    { id: 22, nome: 'Tigre', numeros: [85, 86, 87, 88] },
    { id: 23, nome: 'Urso', numeros: [89, 90, 91, 92] },
    { id: 24, nome: 'Veado', numeros: [93, 94, 95, 96] },
    { id: 25, nome: 'Vaca', numeros: [97, 98, 99, 0] } // 0 representa 00
];

// Emojis para os animais
const emojisAnimais = {
    'Avestruz': '🐦',
    'Águia': '🦅',
    'Burro': '🫏',
    'Borboleta': '🦋',
    'Cachorro': '🐕',
    'Cabra': '🐐',
    'Carneiro': '🐑',
    'Camelo': '🐪',
    'Cobra': '🐍',
    'Coelho': '🐰',
    'Cavalo': '🐴',
    'Elefante': '🐘',
    'Galo': '🐓',
    'Gato': '🐱',
    'Jacaré': '🐊',
    'Leão': '🦁',
    'Macaco': '🐵',
    'Porco': '🐷',
    'Pavão': '🦚',
    'Peru': '🦃',
    'Touro': '🐂',
    'Tigre': '🐅',
    'Urso': '🐻',
    'Veado': '🦌',
    'Vaca': '🐄'
};

// Estado do jogo
let saldo = 1000;
let apostas = [];
let resultadoSorteio = null;
let animaisSelecionados = [];

// Função para obter multiplicador baseado no tipo e colocação
function obterMultiplicador(tipo, colocacao) {
    const isCabeca = colocacao === '1';
    const isQualquer = colocacao === '1ao5';
    
    switch(tipo) {
        case 'grupo':
            // Grupo: cabeça 18x, qualquer posição 3.6x
            return isCabeca ? 18 : (isQualquer ? 3.6 : 18);
        case 'dezena':
            // Dezena: cabeça 60x, qualquer posição 12x
            return isCabeca ? 60 : (isQualquer ? 12 : 60);
        case 'centena':
            // Centena: cabeça 600x, qualquer posição 120x
            return isCabeca ? 600 : (isQualquer ? 120 : 600);
        case 'milhar':
            // Milhar: cabeça 4000x, qualquer posição 800x
            return isCabeca ? 4000 : (isQualquer ? 800 : 4000);
        case 'duqueGrupo':
            // Duque de grupo: 18.5x
            return 18.5;
        case 'duqueDezena':
            // Duque de dezena: 300x
            return 300;
        case 'ternoDezena':
            // Terno de dezena: 3000x
            return 3000;
        case 'ternGrupo':
            // Terno de grupo: 130x
            return 130;
        default:
            return 1;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inicializarAnimais();
    atualizarSaldo();
    atualizarHistorico();
    
    document.getElementById('tipoAposta').addEventListener('change', atualizarInterface);
    document.getElementById('btnApostar').addEventListener('click', fazerAposta);
    document.getElementById('btnSortear').addEventListener('click', realizarSorteio);
});

// Função para encontrar o animal pelo número
function encontrarAnimalPorNumero(numero) {
    const num = numero === 0 || numero === '00' ? 0 : parseInt(numero);
    for (const grupo of gruposAnimais) {
        if (grupo.numeros.includes(num)) {
            return grupo;
        }
    }
    return null;
}

// Função para formatar número com zeros à esquerda
function formatarNumero(num, tamanho) {
    return String(num).padStart(tamanho, '0');
}

// Inicializar grid de animais
function inicializarAnimais() {
    const grid = document.getElementById('animaisGrid');
    const gridMultipla = document.getElementById('animaisGridMultipla');
    
    gruposAnimais.forEach(grupo => {
        const card = criarCardAnimal(grupo, false);
        grid.appendChild(card);
        
        const cardMultipla = criarCardAnimal(grupo, true);
        gridMultipla.appendChild(cardMultipla);
    });
}

// Criar card de animal
function criarCardAnimal(grupo, multipla = false) {
    const card = document.createElement('div');
    card.className = 'animal-card';
    card.dataset.animalId = grupo.id;
    
    const emoji = emojisAnimais[grupo.nome] || '🐾';
    const numerosStr = grupo.numeros.map(n => n === 0 ? '00' : formatarNumero(n, 2)).join(', ');
    
    card.innerHTML = `
        <div class="animal-emoji">${emoji}</div>
        <div class="animal-nome">${grupo.nome}</div>
        <div class="animal-numeros">${numerosStr}</div>
    `;
    
    if (multipla) {
        card.addEventListener('click', () => selecionarAnimalMultipla(grupo.id, card));
    } else {
        card.addEventListener('click', () => selecionarAnimal(grupo.id, card));
    }
    
    return card;
}

// Selecionar animal (aposta simples)
function selecionarAnimal(animalId, card) {
    const tipoAposta = document.getElementById('tipoAposta').value;
    
    if (tipoAposta !== 'grupo') return;
    
    // Remove seleção anterior APENAS do grid de aposta simples
    const animaisGrid = document.getElementById('animaisGrid');
    if (animaisGrid) {
        animaisGrid.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selecionado'));
    }
    
    // Adiciona nova seleção
    card.classList.add('selecionado');
}

// Selecionar animal (aposta múltipla)
function selecionarAnimalMultipla(animalId, card) {
    const tipoAposta = document.getElementById('tipoAposta').value;
    
    if (tipoAposta !== 'duqueGrupo' && tipoAposta !== 'ternGrupo') return;
    
    const maxSelecao = tipoAposta === 'duqueGrupo' ? 2 : 3;
    const index = animaisSelecionados.indexOf(animalId);
    
    if (index > -1) {
        // Deselecionar
        animaisSelecionados.splice(index, 1);
        card.classList.remove('selecionado');
    } else {
        // Selecionar
        if (animaisSelecionados.length < maxSelecao) {
            animaisSelecionados.push(animalId);
            card.classList.add('selecionado');
            // Efeito visual
            card.style.transform = 'scale(1.15)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        } else {
            mostrarNotificacao(`Você só pode selecionar ${maxSelecao} animais para ${tipoAposta === 'duqueGrupo' ? 'duque' : 'terno'}`, 'warning');
        }
    }
    
    atualizarSelecionados();
}

// Atualizar lista de selecionados
function atualizarSelecionados() {
    const div = document.getElementById('selecionados');
    if (animaisSelecionados.length === 0) {
        div.innerHTML = '';
        return;
    }
    
    const nomes = animaisSelecionados.map(id => {
        const grupo = gruposAnimais.find(g => g.id === id);
        return `${emojisAnimais[grupo.nome]} ${grupo.nome}`;
    }).join(', ');
    
    div.innerHTML = `<strong>Selecionados:</strong> ${nomes}`;
}

// Atualizar interface baseada no tipo de aposta
function atualizarInterface() {
    const tipoAposta = document.getElementById('tipoAposta').value;
    const animaisGrid = document.getElementById('animaisGrid');
    const numeroInput = document.getElementById('numeroInput');
    const multiplaSelecao = document.getElementById('multiplaSelecao');
    const multiplaDezena = document.getElementById('multiplaDezena');
    const helpDezenas = document.getElementById('helpDezenas');
    const dezenasAposta = document.getElementById('dezenasAposta');
    
    // Reset seleções completamente
    animaisSelecionados = [];
    
    // Limpar seleções de AMBOS os grids
    const animaisGridMultipla = document.getElementById('animaisGridMultipla');
    
    if (animaisGrid) {
        animaisGrid.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selecionado'));
    }
    if (animaisGridMultipla) {
        animaisGridMultipla.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selecionado'));
    }
    
    const selecionadosDiv = document.getElementById('selecionados');
    if (selecionadosDiv) {
        selecionadosDiv.innerHTML = '';
    }
    if (dezenasAposta) {
        dezenasAposta.value = '';
    }
    
    // Limpar campo de número também
    const numeroAposta = document.getElementById('numeroAposta');
    if (numeroAposta) {
        numeroAposta.value = '';
    }
    
    // Esconder todos os campos
    if (animaisGrid) animaisGrid.style.display = 'none';
    if (numeroInput) numeroInput.style.display = 'none';
    if (multiplaSelecao) multiplaSelecao.style.display = 'none';
    if (multiplaDezena) multiplaDezena.style.display = 'none';
    
    // Mostrar o campo apropriado baseado no tipo de aposta
    if (tipoAposta === 'grupo') {
        if (animaisGrid) animaisGrid.style.display = 'grid';
    } else if (tipoAposta === 'dezena' || tipoAposta === 'centena' || tipoAposta === 'milhar') {
        if (numeroInput) numeroInput.style.display = 'block';
    } else if (tipoAposta === 'duqueGrupo' || tipoAposta === 'ternGrupo') {
        if (multiplaSelecao) multiplaSelecao.style.display = 'block';
        if (helpDezenas) {
            helpDezenas.textContent = tipoAposta === 'duqueGrupo' ? 'Selecione 2 animais' : 'Selecione 3 animais';
        }
    } else if (tipoAposta === 'duqueDezena' || tipoAposta === 'ternoDezena') {
        if (multiplaDezena) {
            multiplaDezena.style.display = 'block';
            if (helpDezenas) {
                helpDezenas.textContent = tipoAposta === 'duqueDezena' ? 'Digite 2 dezenas separadas por vírgula (ex: 01, 02)' : 'Digite 3 dezenas separadas por vírgula (ex: 01, 02, 03)';
            }
        } else {
            console.error('Elemento multiplaDezena não encontrado!');
        }
    }
}

// Fazer aposta
function fazerAposta() {
    const tipoAposta = document.getElementById('tipoAposta').value;
    const valor = parseFloat(document.getElementById('valorAposta').value);
    const colocacao = document.getElementById('colocacao').value;
    
    if (valor <= 0) {
        mostrarNotificacao('Valor da aposta deve ser maior que zero!', 'error');
        return;
    }
    
    if (valor > saldo) {
        mostrarNotificacao('Saldo insuficiente!', 'error');
        return;
    }
    
    let aposta = {
        id: Date.now(),
        tipo: tipoAposta,
        valor: valor,
        colocacao: colocacao,
        ganhou: null, // null = não verificado ainda, false = verificou e perdeu, true = verificou e ganhou
        pago: false,
        verificada: false // Flag para indicar se já foi verificada
    };
    
    // Validar e processar aposta baseada no tipo
    if (tipoAposta === 'grupo') {
        // Buscar card selecionado APENAS no grid de aposta simples (não no grid múltipla)
        const animaisGrid = document.getElementById('animaisGrid');
        const cardSelecionado = animaisGrid.querySelector('.animal-card.selecionado');
        if (!cardSelecionado) {
            mostrarNotificacao('Selecione um animal!', 'warning');
            return;
        }
        const animalId = parseInt(cardSelecionado.dataset.animalId);
        const grupo = gruposAnimais.find(g => g.id === animalId);
        if (!grupo) {
            mostrarNotificacao('Animal não encontrado!', 'error');
            return;
        }
        aposta.animal = grupo.nome;
        aposta.animalId = animalId;
    } else if (tipoAposta === 'dezena' || tipoAposta === 'centena' || tipoAposta === 'milhar') {
        const numero = document.getElementById('numeroAposta').value.trim();
        const tamanhoEsperado = tipoAposta === 'dezena' ? 2 : tipoAposta === 'centena' ? 3 : 4;
        
        if (numero.length !== tamanhoEsperado || isNaN(numero)) {
            mostrarNotificacao(`Digite um número válido de ${tipoAposta === 'dezena' ? '2' : tipoAposta === 'centena' ? '3' : '4'} dígitos!`, 'warning');
            return;
        }
        
        // Armazenar número formatado corretamente com zeros à esquerda
        if (tipoAposta === 'centena') {
            // Garantir que centena tem 3 dígitos (ex: 123 -> 123, 12 -> 012)
            aposta.numero = formatarNumero(parseInt(numero), 3);
        } else if (tipoAposta === 'dezena') {
            // Garantir que dezena tem 2 dígitos (ex: 5 -> 05)
            aposta.numero = formatarNumero(parseInt(numero), 2);
        } else {
            // Milhar tem 4 dígitos
            aposta.numero = formatarNumero(parseInt(numero), 4);
        }
        
        if (tipoAposta === 'dezena') {
            const num = parseInt(numero);
            const grupo = encontrarAnimalPorNumero(num);
            aposta.animal = grupo ? grupo.nome : null;
        }
    } else if (tipoAposta === 'duqueGrupo' || tipoAposta === 'ternGrupo') {
        const quantidadeEsperada = tipoAposta === 'duqueGrupo' ? 2 : 3;
        if (animaisSelecionados.length !== quantidadeEsperada) {
            mostrarNotificacao(`Selecione exatamente ${quantidadeEsperada} animais!`, 'warning');
            return;
        }
        aposta.animais = animaisSelecionados.map(id => {
            const grupo = gruposAnimais.find(g => g.id === id);
            return { id: id, nome: grupo.nome };
        });
    } else if (tipoAposta === 'duqueDezena' || tipoAposta === 'ternoDezena') {
        const dezenasInput = document.getElementById('dezenasAposta').value.trim();
        const dezenas = dezenasInput.split(',').map(d => d.trim()).filter(d => d);
        const quantidadeEsperada = tipoAposta === 'duqueDezena' ? 2 : 3;
        
        if (dezenas.length !== quantidadeEsperada) {
            mostrarNotificacao(`Digite exatamente ${quantidadeEsperada} dezenas separadas por vírgula!`, 'warning');
            return;
        }
        
        // Validar que são números válidos de 2 dígitos
        const dezenasValidas = dezenas.every(d => /^\d{2}$/.test(d) && parseInt(d) >= 0 && parseInt(d) <= 99);
        if (!dezenasValidas) {
            mostrarNotificacao('Digite dezenas válidas (00 a 99)!', 'warning');
            return;
        }
        
        aposta.dezenas = dezenas.map(d => formatarNumero(parseInt(d), 2));
    }
    
    // Registrar aposta
    saldo -= valor;
    apostas.push(aposta);
    atualizarSaldo();
    atualizarHistorico();
    
    mostrarNotificacao(`Aposta registrada! Valor: R$ ${valor.toFixed(2)}`, 'success');
    
    // Efeito visual no botão
    const btnApostar = document.getElementById('btnApostar');
    btnApostar.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btnApostar.style.transform = '';
    }, 200);
    
    // Limpar formulário completamente
    document.getElementById('valorAposta').value = 10;
    
    // Limpar TODOS os cards selecionados de ambos os grids
    const animaisGrid = document.getElementById('animaisGrid');
    const animaisGridMultipla = document.getElementById('animaisGridMultipla');
    
    if (animaisGrid) {
        animaisGrid.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selecionado'));
    }
    if (animaisGridMultipla) {
        animaisGridMultipla.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selecionado'));
    }
    
    // Limpar campos específicos
    if (tipoAposta === 'dezena' || tipoAposta === 'centena' || tipoAposta === 'milhar') {
        document.getElementById('numeroAposta').value = '';
    } else if (tipoAposta === 'duqueDezena' || tipoAposta === 'ternoDezena') {
        const dezenasInput = document.getElementById('dezenasAposta');
        if (dezenasInput) {
            dezenasInput.value = '';
        }
    }
    
    // Limpar seleções múltiplas
    animaisSelecionados = [];
    const selecionadosDiv = document.getElementById('selecionados');
    if (selecionadosDiv) {
        selecionadosDiv.innerHTML = '';
    }
}

// Realizar sorteio
function realizarSorteio() {
    // Verificar se há apostas pendentes (não verificadas ainda)
    // Uma aposta está pendente se ainda não foi verificada
    const apostasPendentes = apostas.filter(aposta => !aposta.verificada);
    
    if (apostas.length === 0 || apostasPendentes.length === 0) {
        mostrarNotificacao('Faça pelo menos uma aposta antes de sortear!', 'warning');
        return;
    }
    
    // Limpar TODAS as seleções visuais antes de realizar o sorteio
    const animaisGrid = document.getElementById('animaisGrid');
    const animaisGridMultipla = document.getElementById('animaisGridMultipla');
    
    if (animaisGrid) {
        animaisGrid.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selecionado'));
    }
    if (animaisGridMultipla) {
        animaisGridMultipla.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selecionado'));
    }
    
    // Limpar array de seleções múltiplas
    animaisSelecionados = [];
    const selecionadosDiv = document.getElementById('selecionados');
    if (selecionadosDiv) {
        selecionadosDiv.innerHTML = '';
    }
    
    const btnSortear = document.getElementById('btnSortear');
    btnSortear.disabled = true;
    btnSortear.textContent = 'Sorteando...';
    
    const premiosDiv = document.getElementById('premios');
    const animaisDiv = document.getElementById('resultadoAnimais');
    
    // Limpar resultados anteriores
    premiosDiv.innerHTML = '<div class="sorteio-animacao">Sorteando...</div>';
    animaisDiv.innerHTML = '';
    
    // Animação de sorteio
    let contador = 0;
    const intervalo = setInterval(() => {
        contador++;
        const numerosAleatorios = [];
        for (let i = 0; i < 5; i++) {
            numerosAleatorios.push(Math.floor(Math.random() * 10000));
        }
        
        let html = '<div class="premios-lista">';
        numerosAleatorios.forEach((premio, index) => {
            const premioFormatado = formatarNumero(premio, 4);
            html += `
                <div class="premio-item" style="animation: none;">
                    <span class="premio-posicao">${index + 1}º Prêmio:</span>
                    <span class="premio-numero">${premioFormatado}</span>
                </div>
            `;
        });
        html += '</div>';
        premiosDiv.innerHTML = html;
        
        if (contador >= 20) {
            clearInterval(intervalo);
            // Gerar resultado final
            resultadoSorteio = [];
            for (let i = 0; i < 5; i++) {
                const premio = Math.floor(Math.random() * 10000);
                resultadoSorteio.push(premio);
            }
            
            // Exibir resultados finais com animação
            setTimeout(() => {
                exibirResultados();
                verificarApostas();
                btnSortear.disabled = false;
                btnSortear.textContent = 'Realizar Sorteio';
                
                // Garantir que todas as seleções estejam limpas após o sorteio
                if (animaisGrid) {
                    animaisGrid.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selecionado'));
                }
                if (animaisGridMultipla) {
                    animaisGridMultipla.querySelectorAll('.animal-card').forEach(c => c.classList.remove('selecionado'));
                }
                animaisSelecionados = [];
                const selecionadosDivFinal = document.getElementById('selecionados');
                if (selecionadosDivFinal) {
                    selecionadosDivFinal.innerHTML = '';
                }
            }, 300);
        }
    }, 100);
}

// Exibir resultados do sorteio
function exibirResultados() {
    const premiosDiv = document.getElementById('premios');
    const animaisDiv = document.getElementById('resultadoAnimais');
    
    let htmlPremios = '<div class="premios-lista">';
    let htmlAnimais = '<div class="animais-resultado">';
    
    resultadoSorteio.forEach((premio, index) => {
        const premioFormatado = formatarNumero(premio, 4);
        const dezena = premioFormatado.slice(-2);
        const centena = premioFormatado.slice(-3);
        const numDezena = parseInt(dezena);
        const grupo = encontrarAnimalPorNumero(numDezena);
        
        // Verificar se algum animal das apostas ganhou (apenas apostas não verificadas)
        const ganhou = apostas.some(aposta => {
            // Verificar apenas apostas não verificadas ainda
            if (aposta.verificada) return false;
            
            const premiosParaVerificar = obterPremiosParaVerificar(aposta.colocacao);
            if (premiosParaVerificar.includes(premio)) {
                // Garantir comparação correta de números (não strings)
                if (aposta.tipo === 'grupo' && grupo && parseInt(aposta.animalId) === parseInt(grupo.id)) return true;
                // Garantir que ambos estejam formatados com 2 dígitos para comparação
                if (aposta.tipo === 'dezena') {
                    const numeroFormatado = formatarNumero(parseInt(aposta.numero) || 0, 2);
                    if (numeroFormatado === dezena) return true;
                }
                if (aposta.tipo === 'centena' && aposta.numero === centena) return true;
                if (aposta.tipo === 'milhar' && aposta.numero === premioFormatado) return true;
            }
            return false;
        });
        
        const classeGanhou = ganhou ? 'premio-ganhou' : '';
        
        htmlPremios += `
            <div class="premio-item ${classeGanhou}" style="animation-delay: ${index * 0.1}s">
                <span class="premio-posicao">${index + 1}º Prêmio:</span>
                <span class="premio-numero">${premioFormatado}</span>
                <span class="premio-dezena">Dezena: ${dezena}</span>
                <span class="premio-centena">Centena: ${centena}</span>
                ${ganhou ? '<span class="premio-badge">GANHOU!</span>' : ''}
            </div>
        `;
        
        htmlAnimais += `
            <div class="animal-resultado-item" style="animation-delay: ${index * 0.1}s">
                ${emojisAnimais[grupo.nome]} ${grupo.nome} (${dezena})
            </div>
        `;
    });
    
    htmlPremios += '</div>';
    htmlAnimais += '</div>';
    
    premiosDiv.innerHTML = htmlPremios;
    animaisDiv.innerHTML = htmlAnimais;
}

// Verificar apostas
function verificarApostas() {
    let totalGanho = 0;
    
    apostas.forEach(aposta => {
        // Pular apenas apostas já verificadas (independente de pagas ou não)
        // Uma aposta verificada já foi processada e não deve ser verificada novamente
        if (aposta.verificada) return;
        
        let ganhou = false;
        const premiosParaVerificar = obterPremiosParaVerificar(aposta.colocacao);
        
        if (aposta.tipo === 'grupo') {
            ganhou = verificarGrupo(aposta.animalId, premiosParaVerificar);
        } else if (aposta.tipo === 'dezena') {
            ganhou = verificarDezena(aposta.numero, premiosParaVerificar);
        } else if (aposta.tipo === 'centena') {
            ganhou = verificarCentena(aposta.numero, premiosParaVerificar);
        } else if (aposta.tipo === 'milhar') {
            ganhou = verificarMilhar(aposta.numero, premiosParaVerificar);
        } else if (aposta.tipo === 'duqueGrupo') {
            ganhou = verificarDuque(aposta.animais, premiosParaVerificar);
        } else if (aposta.tipo === 'ternGrupo') {
            ganhou = verificarTerno(aposta.animais, premiosParaVerificar);
        } else if (aposta.tipo === 'duqueDezena') {
            ganhou = verificarDuqueDezena(aposta.dezenas, premiosParaVerificar);
        } else if (aposta.tipo === 'ternoDezena') {
            ganhou = verificarTernoDezena(aposta.dezenas, premiosParaVerificar);
        }
        
        // Marcar que a aposta foi verificada
        aposta.verificada = true;
        
        if (ganhou) {
            aposta.ganhou = true;
            const multiplicador = obterMultiplicador(aposta.tipo, aposta.colocacao);
            const ganho = aposta.valor * multiplicador;
            totalGanho += ganho;
            aposta.ganho = ganho;
            aposta.pago = true;
        } else {
            // Marcar explicitamente como não ganhou (após verificação)
            aposta.ganhou = false;
            aposta.ganho = 0;
            aposta.pago = false;
        }
    });
    
    if (totalGanho > 0) {
        saldo += totalGanho;
        atualizarSaldo();
        mostrarNotificacao(`Parabéns! Você ganhou R$ ${totalGanho.toFixed(2)}!`, 'success', 5000);
        
        // Efeito de confete visual
        criarEfeitoConfete();
    } else {
        mostrarNotificacao('Nenhuma aposta ganhou neste sorteio.', 'info');
    }
    
    atualizarHistorico();
}

// Função para mostrar notificações estilo cassino
function mostrarNotificacao(mensagem, tipo = 'info', duracao = 3000) {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    
    const icons = {
        success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };
    
    const cores = {
        success: '#00AA00',
        warning: '#FFD700',
        error: '#DC143C',
        info: '#FFD700'
    };
    
    notificacao.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem;">
            <div style="flex-shrink: 0; color: ${cores[tipo]}; filter: drop-shadow(0 0 10px ${cores[tipo]});">${icons[tipo]}</div>
            <div style="flex: 1; font-weight: 600; letter-spacing: 0.05em;">${mensagem}</div>
        </div>
    `;
    
    notificacao.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: #ffffff;
        padding: 1.25rem 1.5rem;
        border-radius: 1rem;
        box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.7),
            0 0 40px ${cores[tipo]}40;
        z-index: 10000;
        font-weight: 600;
        font-size: 0.9375rem;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid ${cores[tipo]}60;
        max-width: 450px;
        font-family: 'Inter', sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notificacao.remove(), 400);
    }, duracao);
}

// Função para criar efeito de confete
function criarEfeitoConfete() {
    const cores = ['#FFD700', '#FFA500', '#00AA00', '#DC143C', '#FF6347'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confete = document.createElement('div');
            confete.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${cores[Math.floor(Math.random() * cores.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: confeteFall ${2 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(confete);
            
            setTimeout(() => confete.remove(), 4000);
        }, i * 50);
    }
}

// Obter prêmios para verificar baseado na colocação
function obterPremiosParaVerificar(colocacao) {
    if (colocacao === '1ao5') {
        return resultadoSorteio;
    } else {
        const index = parseInt(colocacao) - 1;
        return [resultadoSorteio[index]];
    }
}

// Verificar grupo (aparece em qualquer um dos prêmios verificados)
// IMPORTANTE: Deve verificar se o GRUPO do prêmio corresponde ao GRUPO apostado
function verificarGrupo(animalId, premios) {
    // Verificar se o animalId é válido e converter para número
    if (animalId === null || animalId === undefined) {
        return false;
    }
    
    const animalIdNum = parseInt(animalId);
    if (isNaN(animalIdNum)) {
        return false;
    }
    
    const grupoApostado = gruposAnimais.find(g => g.id === animalIdNum);
    
    // Verificar se o grupo foi encontrado
    if (!grupoApostado || !grupoApostado.numeros || !Array.isArray(grupoApostado.numeros)) {
        return false;
    }
    
    // Verificar cada prêmio
    for (const premio of premios) {
        if (premio === null || premio === undefined) continue;
        
        const premioFormatado = formatarNumero(premio, 4);
        // Pegar os últimos 2 dígitos (a dezena)
        const dezenaStr = premioFormatado.slice(-2);
        // Converter para número, tratando "00" como 0
        const numDezena = dezenaStr === '00' ? 0 : parseInt(dezenaStr);
        
        // Encontrar qual grupo pertence essa dezena
        const grupoPremio = encontrarAnimalPorNumero(numDezena);
        
        // Verificar se o grupo do prêmio é o mesmo grupo apostado
        if (grupoPremio && grupoPremio.id === animalIdNum) {
            return true;
        }
    }
    return false;
}

// Verificar dezena
function verificarDezena(numero, premios) {
    // Garantir que o número da aposta está formatado com 2 dígitos
    const numeroFormatado = formatarNumero(parseInt(numero) || 0, 2);
    
    for (const premio of premios) {
        if (premio === null || premio === undefined) continue;
        
        const premioFormatado = formatarNumero(premio, 4);
        // Pegar os últimos 2 dígitos do prêmio (a dezena)
        const dezenaPremio = premioFormatado.slice(-2);
        
        // Comparar strings formatadas (mais seguro que comparar números)
        if (dezenaPremio === numeroFormatado) {
            return true;
        }
    }
    return false;
}

// Verificar centena (deve acertar os últimos 3 dígitos do número sorteado)
// Exemplo: Se o prêmio é 1234, a centena é 234
// Se apostar 234 e o prêmio for 1234, ganha
// Se apostar 234 e o prêmio for 5234, ganha (últimos 3 dígitos são 234)
function verificarCentena(numero, premios) {
    // Garantir que o número da aposta tem exatamente 3 dígitos
    // Ex: "123" -> "123", "12" -> "012", "1" -> "001"
    const numeroFormatado = formatarNumero(parseInt(numero) || 0, 3);
    
    // Verificar em cada prêmio se os últimos 3 dígitos coincidem
    for (const premio of premios) {
        if (premio === null || premio === undefined) continue;
        
        // Formatar prêmio com 4 dígitos (ex: 1234 -> "1234", 56 -> "0056")
        const premioFormatado = formatarNumero(premio, 4);
        
        // Pegar os últimos 3 dígitos do prêmio (ex: "1234" -> "234", "0056" -> "056")
        const centenaPremio = premioFormatado.slice(-3);
        
        // Comparar os 3 dígitos exatamente
        if (centenaPremio === numeroFormatado) {
            return true;
        }
    }
    return false;
}

// Verificar milhar
// IMPORTANTE: Deve acertar exatamente os 4 dígitos do número sorteado
function verificarMilhar(numero, premios) {
    // Garantir que o número está formatado com 4 dígitos
    const numeroFormatado = formatarNumero(parseInt(numero) || 0, 4);
    
    for (const premio of premios) {
        if (premio === null || premio === undefined) continue;
        
        const premioFormatado = formatarNumero(premio, 4);
        // Comparar exatamente os 4 dígitos
        if (premioFormatado === numeroFormatado) {
            return true;
        }
    }
    return false;
}

// Verificar duque de grupo
// IMPORTANTE: Deve verificar se EXATAMENTE os 2 animais apostados aparecem nos prêmios
function verificarDuque(animais, premios) {
    // Verificar se foram apostados exatamente 2 animais
    if (!animais || animais.length !== 2) {
        return false;
    }
    
    const idsAnimaisApostados = new Set(animais.map(a => a.id));
    const animaisEncontrados = new Set();
    
    for (const premio of premios) {
        if (premio === null || premio === undefined) continue;
        
        const premioFormatado = formatarNumero(premio, 4);
        const dezenaStr = premioFormatado.slice(-2);
        const numDezena = dezenaStr === '00' ? 0 : parseInt(dezenaStr);
        const grupo = encontrarAnimalPorNumero(numDezena);
        
        // Verificar se o grupo encontrado está entre os animais apostados
        if (grupo && idsAnimaisApostados.has(grupo.id)) {
            animaisEncontrados.add(grupo.id);
        }
    }
    
    // Deve encontrar exatamente os 2 animais apostados
    return animaisEncontrados.size === 2;
}

// Verificar terno de grupo
// IMPORTANTE: Deve verificar se EXATAMENTE os 3 animais apostados aparecem nos prêmios
function verificarTerno(animais, premios) {
    // Verificar se foram apostados exatamente 3 animais
    if (!animais || animais.length !== 3) {
        return false;
    }
    
    const idsAnimaisApostados = new Set(animais.map(a => a.id));
    const animaisEncontrados = new Set();
    
    for (const premio of premios) {
        if (premio === null || premio === undefined) continue;
        
        const premioFormatado = formatarNumero(premio, 4);
        const dezenaStr = premioFormatado.slice(-2);
        const numDezena = dezenaStr === '00' ? 0 : parseInt(dezenaStr);
        const grupo = encontrarAnimalPorNumero(numDezena);
        
        // Verificar se o grupo encontrado está entre os animais apostados
        if (grupo && idsAnimaisApostados.has(grupo.id)) {
            animaisEncontrados.add(grupo.id);
        }
    }
    
    // Deve encontrar exatamente os 3 animais apostados
    return animaisEncontrados.size === 3;
}

// Verificar duque de dezena
// IMPORTANTE: Deve verificar se EXATAMENTE as 2 dezenas apostadas aparecem nos prêmios
function verificarDuqueDezena(dezenas, premios) {
    // Verificar se foram apostadas exatamente 2 dezenas
    if (!dezenas || dezenas.length !== 2) {
        return false;
    }
    
    // Garantir que as dezenas estão formatadas com 2 dígitos
    const dezenasFormatadas = dezenas.map(d => formatarNumero(parseInt(d) || 0, 2));
    const dezenasApostadas = new Set(dezenasFormatadas);
    const dezenasEncontradas = new Set();
    
    for (const premio of premios) {
        if (premio === null || premio === undefined) continue;
        
        const premioFormatado = formatarNumero(premio, 4);
        const dezenaPremio = premioFormatado.slice(-2);
        
        // Verificar se a dezena do prêmio está entre as dezenas apostadas
        if (dezenasApostadas.has(dezenaPremio)) {
            dezenasEncontradas.add(dezenaPremio);
        }
    }
    
    // Deve encontrar exatamente as 2 dezenas apostadas
    return dezenasEncontradas.size === 2;
}

// Verificar terno de dezena
// IMPORTANTE: Deve verificar se EXATAMENTE as 3 dezenas apostadas aparecem nos prêmios
function verificarTernoDezena(dezenas, premios) {
    // Verificar se foram apostadas exatamente 3 dezenas
    if (!dezenas || dezenas.length !== 3) {
        return false;
    }
    
    // Garantir que as dezenas estão formatadas com 2 dígitos
    const dezenasFormatadas = dezenas.map(d => formatarNumero(parseInt(d) || 0, 2));
    const dezenasApostadas = new Set(dezenasFormatadas);
    const dezenasEncontradas = new Set();
    
    for (const premio of premios) {
        if (premio === null || premio === undefined) continue;
        
        const premioFormatado = formatarNumero(premio, 4);
        const dezenaPremio = premioFormatado.slice(-2);
        
        // Verificar se a dezena do prêmio está entre as dezenas apostadas
        if (dezenasApostadas.has(dezenaPremio)) {
            dezenasEncontradas.add(dezenaPremio);
        }
    }
    
    // Deve encontrar exatamente as 3 dezenas apostadas
    return dezenasEncontradas.size === 3;
}

// Atualizar saldo
function atualizarSaldo() {
    const saldoFormatado = saldo.toFixed(2).replace('.', ',');
    document.getElementById('saldo').textContent = `R$ ${saldoFormatado}`;
    if (saldo < 100) {
        document.getElementById('saldo').classList.add('saldo-baixo');
    } else {
        document.getElementById('saldo').classList.remove('saldo-baixo');
    }
}

// Atualizar histórico
function atualizarHistorico() {
    const historicoDiv = document.getElementById('historico');
    
    if (apostas.length === 0) {
        historicoDiv.innerHTML = '<p class="sem-apostas">Nenhuma aposta realizada ainda.</p>';
        return;
    }
    
    let html = '<div class="apostas-lista">';
    
    // Ordenar por ID (maior = mais recente) para ter a mais recente no topo
    const apostasOrdenadas = [...apostas].sort((a, b) => b.id - a.id);
    
    apostasOrdenadas.forEach(aposta => {
        let descricao = '';
        
        if (aposta.tipo === 'grupo') {
            descricao = `${aposta.animal}`;
        } else if (aposta.tipo === 'dezena') {
            descricao = `Dezena ${aposta.numero}`;
        } else if (aposta.tipo === 'centena') {
            descricao = `Centena ${aposta.numero}`;
        } else if (aposta.tipo === 'milhar') {
            descricao = `Milhar ${aposta.numero}`;
        } else if (aposta.tipo === 'duqueGrupo') {
            descricao = `Duque de Grupo: ${aposta.animais.map(a => emojisAnimais[a.nome] + ' ' + a.nome).join(' + ')}`;
        } else if (aposta.tipo === 'ternGrupo') {
            descricao = `Terno de Grupo: ${aposta.animais.map(a => emojisAnimais[a.nome] + ' ' + a.nome).join(' + ')}`;
        } else if (aposta.tipo === 'duqueDezena') {
            descricao = `Duque de Dezena: ${aposta.dezenas.join(', ')}`;
        } else if (aposta.tipo === 'ternoDezena') {
            descricao = `Terno de Dezena: ${aposta.dezenas.join(', ')}`;
        }
        
        // Verificar corretamente o status da aposta
        let statusClass, statusText;
        
        // Se o sorteio ainda não foi realizado OU a aposta ainda não foi verificada
        if (!resultadoSorteio || !aposta.verificada) {
            statusClass = 'pendente';
            statusText = 'Pendente';
        }
        // Se a aposta ganhou (verificado e pago)
        else if (aposta.ganhou === true && aposta.pago === true && aposta.ganho > 0) {
            statusClass = 'ganhou';
            statusText = `Ganhou R$ ${aposta.ganho.toFixed(2)}`;
        }
        // Se o sorteio foi realizado, a aposta foi verificada e não ganhou
        else if (resultadoSorteio && aposta.verificada && aposta.ganhou === false) {
            statusClass = 'perdeu';
            statusText = 'Perdeu';
        }
        // Caso padrão (por segurança, mantém como pendente)
        else {
            statusClass = 'pendente';
            statusText = 'Pendente';
        }
        
        html += `
            <div class="aposta-item ${statusClass}">
                <div class="aposta-info">
                    <strong>${descricao}</strong>
                    <span class="aposta-valor">R$ ${aposta.valor.toFixed(2)}</span>
                </div>
                <div class="aposta-detalhes">
                    <span>Tipo: ${aposta.tipo}</span>
                    <span>Colocação: ${aposta.colocacao === '1ao5' ? '1º ao 5º' : aposta.colocacao + 'º'}</span>
                    <span class="aposta-status">${statusText}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    historicoDiv.innerHTML = html;
}

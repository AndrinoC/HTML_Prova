document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('idade').addEventListener('input', validarIdade);
    document.getElementById('idade').addEventListener('paste', (e) => {
        setTimeout(() => validarIdade(), 0);
    });
    document.getElementById('id').addEventListener('input', validarID);
    document.getElementById('id').addEventListener('paste', (e) => {
        setTimeout(() => validarID(), 0);
    });

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    document.body.classList.add('loaded');
});

function validarRespostas() {
    const totalQuestoes = 10;
    for (let i = 1; i <= totalQuestoes; i++) {
        const nomeGrupo = `nota${i}`;
        const radios = document.querySelectorAll(`input[name="${nomeGrupo}"]`);
        const algumaSelecionada = Array.from(radios).some(radio => radio.checked);
        if (!algumaSelecionada) {
            return { isValid: false, firstUnanswered: nomeGrupo };
        }
    }
    return { isValid: true, firstUnanswered: null };
}

function mostrarErroQuestaoPendente(nomeQuestao) {
    console.warn(`Questão pendente: ${nomeQuestao}`);
    const container = document.querySelector('.container');
    if (container) {
        container.classList.remove('shake');
        void container.offsetWidth;
        container.classList.add('shake');
        setTimeout(() => { container.classList.remove('shake'); }, 500);
    }

    const primeiroRadioPendente = document.querySelector(`input[name="${nomeQuestao}"]`);
    if (primeiroRadioPendente) {
        const cardPendente = primeiroRadioPendente.closest('.question-card');
        if (cardPendente) {
            cardPendente.scrollIntoView({ behavior: 'smooth', block: 'center' });
            cardPendente.classList.add('error-highlight');
            setTimeout(() => { cardPendente.classList.remove('error-highlight'); }, 2500);
        }
    }
    playSound('button-sound');
}


function calcular() {
    let totalScore = 0;
    const notas = document.querySelectorAll('input[type="radio"]:checked');
    notas.forEach((radio) => { totalScore += parseInt(radio.value); });

    const notaInput = document.getElementById('nota');
    notaInput.value = totalScore;

    let status;
    const statusInput = document.getElementById('status');
    if (totalScore < 43) {
        status = 'Reprovado';
    } else if (totalScore < 61) {
        status = 'Estagiário';
    } else if (totalScore < 90){
        status = 'AGT 3ª Classe';
    } else{
        status = 'AGT 3ª + TAP';
    }
    statusInput.value = status;
    statusInput.setAttribute('value', status);
    playSound('button-sound');
}

function copiarDados() {
    const validacao = validarRespostas();
    if (!validacao.isValid) {
        mostrarErroQuestaoPendente(validacao.firstUnanswered);
        alert(`Por favor, responda a questão pendente: ${document.querySelector(`input[name="${validacao.firstUnanswered}"]`).closest('.question-card').querySelector('h4').textContent.trim()}`);
        return;
    }

    const nome = document.getElementById('nome').value.trim();
    const idade = document.getElementById('idade').value;
    const passaporte = document.getElementById('id').value;
    const recrutador = document.getElementById('recrutador').value.trim();
    const nota = document.getElementById('nota').value;
    const status = document.getElementById('status').value;

    if (!nome || !idade || !passaporte || !recrutador || !nota || !status) {
        alert('Por favor, preencha todas as informações (Nome, Idade, ID, Recrutador) e calcule a nota antes de copiar.');
        const primeiroVazio = [document.getElementById('nome'), document.getElementById('idade'), document.getElementById('id'), document.getElementById('recrutador')].find(el => !el.value.trim());
        if(primeiroVazio) primeiroVazio.focus();
        return;
    }

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let  resultadoTexto = `**Nome:** ${nome}\n**Passaporte:** ${passaporte}\n**Idade:** ${idade}\n**Data:** ${dataAtual} ${horaAtual}\n**Nota:** ${nota}\n**Status:** ${status}\n**Recrutador:** ${recrutador}`;
    let notaNumerica = parseInt(nota, 10);
    if (status === 'AGT 3ª + TAP' || notaNumerica > 90) {
        resultadoTexto += `\n**Observação:** O conscrito se saiu acima da média e poderá realizar o TAP antecipadamente <@&1359030430589780018> <@&1264713299942051880>`;
    }
    navigator.clipboard.writeText(resultadoTexto).then(() => {
        const copyButton = document.querySelector('button:nth-of-type(1)');
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copiado!'; copyButton.style.backgroundColor = '#28a745';
        setTimeout(() => { copyButton.textContent = originalText; copyButton.style.backgroundColor = '#007bff'; }, 1500);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
        alert('Erro ao copiar dados. Verifique permissões ou tente manualmente.');
    });
    playSound('button-sound');
}

function tirarPrint() {
    const validacao = validarRespostas();
    if (!validacao.isValid) {
        mostrarErroQuestaoPendente(validacao.firstUnanswered);
         alert(`Por favor, responda a questão pendente: ${document.querySelector(`input[name="${validacao.firstUnanswered}"]`).closest('.question-card').querySelector('h4').textContent.trim()}`);
        return;
    }

    console.log('tirarPrint: Iniciando...');
    const container = document.querySelector('.container');
    if (!container) { console.error('tirarPrint: Elemento .container não encontrado!'); return; }

     const nome = document.getElementById('nome').value.trim();
     const idade = document.getElementById('idade').value;
     const passaporte = document.getElementById('id').value;
     const recrutador = document.getElementById('recrutador').value.trim();
     if (!nome || !idade || !passaporte || !recrutador) {
        alert('Preencha todas as informações (Nome, Idade, ID, Recrutador) antes de tirar o print.');
        const primeiroVazio = [document.getElementById('nome'), document.getElementById('idade'), document.getElementById('id'), document.getElementById('recrutador')].find(el => !el.value.trim());
        if(primeiroVazio) primeiroVazio.focus();
        return;
     }
     const nota = document.getElementById('nota').value;
     if (!nota) { alert('Calcule a nota selecionando as opções antes de tirar o print.'); return; }

    const allRadios = document.querySelectorAll('input[type="radio"]');
    const labelsToHide = [];

    try {
        allRadios.forEach(radio => {
            const label = document.querySelector(`label[for="${radio.id}"]`);
            if (!radio.checked) {
                if (label && !label.classList.contains('cc-label')) { label.classList.add('hidden'); labelsToHide.push(label); }
            } else { radio.classList.add('hide-radio'); }
        });
        console.log('tirarPrint: Classes de ocultação adicionadas.');
    } catch (e) {
        console.error('tirarPrint: Erro ao adicionar classes de ocultação:', e);
         labelsToHide.forEach(label => label.classList.remove('hidden'));
         allRadios.forEach(radio => radio.classList.remove('hide-radio'));
        return;
    }

    setTimeout(() => {
        console.log('tirarPrint: Dentro do setTimeout.');
        if (typeof domtoimage === 'undefined') {
             console.error('tirarPrint: Biblioteca dom-to-image não está definida!');
             alert('Erro: Biblioteca de print não carregou. Recarregue a página.');
             labelsToHide.forEach(label => label.classList.remove('hidden'));
             allRadios.forEach(radio => radio.classList.remove('hide-radio'));
             return;
        }
        const options = { quality: 0.98, bgcolor: '#1a1a1a' };
        domtoimage.toPng(document.body, options)
            .then(function (dataUrl) {
                console.log('tirarPrint: domtoimage.toPng SUCESSO.');
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                link.download = `recrutamento_${nome.replace(/\s+/g, '_') || 'candidato'}_${timestamp}.png`;
                link.href = dataUrl; link.click();
                console.log('tirarPrint: Download iniciado.');

                const printButton = document.querySelector('button:nth-of-type(2)');
                const originalText = printButton.textContent;
                printButton.textContent = 'Salvo!'; printButton.style.backgroundColor = '#28a745';
                setTimeout(() => { printButton.textContent = originalText; printButton.style.backgroundColor = '#ffc107'; }, 2000);
                playSound('print-sound');
            })
            .catch(function (error) { console.error('tirarPrint: domtoimage.toPng ERRO:', error); alert('Ocorreu um erro ao gerar o print. Verifique o console (F12).'); })
            .finally(() => {
                console.log('tirarPrint: Bloco finally - restaurando classes.');
                 labelsToHide.forEach(label => label.classList.remove('hidden'));
                 allRadios.forEach(radio => radio.classList.remove('hide-radio'));
                 console.log('tirarPrint: Classes restauradas.');
            });
    }, 300);
}

function resetQuiz() {
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('id').value = '';
    document.getElementById('recrutador').value = '';
    const notaInput = document.getElementById('nota');
    const statusInput = document.getElementById('status');
    notaInput.value = ''; statusInput.value = ''; statusInput.removeAttribute('value');

    document.querySelectorAll('.question-card.error-highlight').forEach(card => {
        card.classList.remove('error-highlight');
    });

    const elementsToShake = document.querySelectorAll('.question-card');
    elementsToShake.forEach(element => {
        element.classList.remove('shake');
        void element.offsetWidth;
        element.classList.add('shake');
        element.addEventListener('animationend', () => {
            element.classList.remove('shake');
        }, { once: true });
    });

    document.getElementById('nome').focus();
    playSound('button-sound');
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.error(`Erro ao tocar som ${soundId}:`, error));
    } else { console.warn(`Elemento de áudio com ID "${soundId}" não encontrado.`); }
}

function validarIdade() {
    const idadeInput = document.getElementById('idade'); let valorIdade = idadeInput.value;
    valorIdade = valorIdade.replace(/[^0-9]/g, '');
    if (valorIdade.length > 3) { valorIdade = valorIdade.slice(0, 3); }
    const idadeNum = parseInt(valorIdade, 10);
    if (valorIdade !== '' && (idadeNum < 1 || idadeNum > 120)) { if (idadeNum > 120) { valorIdade = '120'; } }
    idadeInput.value = valorIdade;
}
function validarID() {
    const idInput = document.getElementById('id'); let valorId = idInput.value;
    valorId = valorId.replace(/[^0-9]/g, '');
    if (valorId.length > 8) { valorId = valorId.slice(0, 8); }
    idInput.value = valorId;
}
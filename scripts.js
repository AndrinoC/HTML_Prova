document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('idade').addEventListener('input', validarIdade);
    document.getElementById('idade').addEventListener('paste', (e) => {
        setTimeout(() => validarIdade(), 0);
    });

    document.getElementById('id').addEventListener('input', validarID);
});

function calcular() {
    let totalScore = 0;
    const notas = document.querySelectorAll('input[type="radio"]:checked');

    notas.forEach((radio) => {
        totalScore += parseInt(radio.value);
    });

    document.getElementById('nota').value = totalScore;

    let status;
    if (totalScore < 45) {
        status = 'Reprovado';
    } else if (totalScore < 80) {
        status = 'Estagiário';
    } else {
        status = 'AGT 3ª Classe';
    }
    document.getElementById('status').value = status;

    playSound('button-sound');
}

function copiarDados() {
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const passaporte = document.getElementById('id').value;
    const recrutador = document.getElementById('recrutador').value;
    const nota = document.getElementById('nota').value;
    const status = document.getElementById('status').value;

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const resultadoTexto = `**Nome:** ${nome}\n**Passaporte:** ${passaporte}\n**Idade:** ${idade}\n**Data:** ${dataAtual} ${horaAtual}\n**Nota:** ${nota}\n**Status:** ${status}\n**Recrutador:** ${recrutador}`;

    navigator.clipboard.writeText(resultadoTexto).then(() => {
        alert('Dados copiados para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });

    playSound('button-sound');
}

function tirarPrint() {
    console.log('tirarPrint: Iniciando...');
    const container = document.querySelector('.container');
    if (!container) {
        console.error('tirarPrint: Elemento .container não encontrado!');
        return;
    }

    const allRadios = document.querySelectorAll('input[type="radio"]');
    console.log(`tirarPrint: Encontrados ${allRadios.length} radios.`);

    try {
        allRadios.forEach(radio => {
            if (!radio.checked) {
                if (radio.parentElement && radio.parentElement.tagName === 'LABEL') {
                    radio.parentElement.classList.add('hidden');
                } else {
                    console.warn('tirarPrint: Rádio sem label pai:', radio);
                }
            } else {
                radio.classList.add('hide-radio');
            }
        });
        console.log('tirarPrint: Classes de ocultação adicionadas.');
    } catch (e) {
        console.error('tirarPrint: Erro ao adicionar classes:', e);
         allRadios.forEach(radio => {
             if (radio.parentElement && radio.parentElement.tagName === 'LABEL') {
                radio.parentElement.classList.remove('hidden');
             }
             radio.classList.remove('hide-radio');
         });
        return;
    }


    setTimeout(() => {
        console.log('tirarPrint: Dentro do setTimeout, antes de domtoimage.');
        if (typeof domtoimage === 'undefined') {
             console.error('tirarPrint: Biblioteca domtoimage não está definida!');
             allRadios.forEach(radio => {
                if (radio.parentElement && radio.parentElement.tagName === 'LABEL') {
                    radio.parentElement.classList.remove('hidden');
                }
                radio.classList.remove('hide-radio');
             });
             return;
        }

        domtoimage.toPng(container)
            .then(function (dataUrl) {
                console.log('tirarPrint: domtoimage.toPng SUCESSO.');
                const link = document.createElement('a');
                link.download = 'recrutamento_resultado.png';
                link.href = dataUrl;
                link.click();
                console.log('tirarPrint: Download iniciado.');
            })
            .catch(function (error) {
                console.error('tirarPrint: domtoimage.toPng ERRO:', error);
                alert('Ocorreu um erro ao gerar o print. Verifique o console (F12).');
            })
            .finally(() => {
                console.log('tirarPrint: Bloco finally - restaurando classes.');
                allRadios.forEach(radio => {
                     if (radio.parentElement && radio.parentElement.tagName === 'LABEL') {
                        radio.parentElement.classList.remove('hidden');
                     }
                    radio.classList.remove('hide-radio');
                });
                 console.log('tirarPrint: Classes restauradas.');
            });
    }, 300);

    playSound('print-sound');
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');

    playSound('button-sound');
}

function resetQuiz() {
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    
    localStorage.removeItem('respostas');
    
    document.getElementById('nota').value = '';
    document.getElementById('status').value = '';
    document.getElementById('idade').value = null;
    document.getElementById('id').value = null;

    const elementsToShake = document.querySelectorAll('.question-card');
    elementsToShake.forEach(element => {
        element.classList.add('shake');

        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    });

    playSound('button-sound');
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
}

function validarIdade() {
    const idadeInput = document.getElementById('idade');
    const valorIdade = idadeInput.value;

    if (valorIdade.length > 3 || valorIdade < 1 || valorIdade > 120) {
        idadeInput.value = valorIdade.slice(0, 3);
    }
}

function validarID() {
    const idInput = document.getElementById('id');
    const valorId = idInput.value;

    if (valorId.length > 8 || valorId < 0 || valorId > 99999999) {
        idInput.value = valorId.slice(0, 8);
    }
}

document.getElementById('idade').addEventListener('paste', (e) => {
    setTimeout(() => validarIdade(), 0);
});

document.getElementById('id').addEventListener('paste', (e) => {
    setTimeout(() => validarID(), 0);
});

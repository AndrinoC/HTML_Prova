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
    if (totalScore < 40) {
        status = 'Reprovado';
    } else if (totalScore < 60) {
        status = 'Cadete';
    } else {
        status = 'Aspirante';
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

    const resultadoTexto = `**Nome:** ${nome}\n**Passaporte:** ${passaporte}\n**Idade:** ${idade}\n**Data:** ${dataAtual}\n**Nota:** ${nota}\n**Status:** ${status}\n**Recrutador:** ${recrutador}`;

    navigator.clipboard.writeText(resultadoTexto).then(() => {
        alert('Dados copiados para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });

    playSound('button-sound');
}

function tirarPrint() {
    html2canvas(document.querySelector(".container"), {
        useCORS: true,
        allowTaint: false,
    }).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'screenshot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(function (error) {
        console.error('Erro ao capturar a tela: ', error);
    });

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

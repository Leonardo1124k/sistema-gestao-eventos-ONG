document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('donationForm');
    const submitBtn = document.getElementById('submitBtn');
    const amountError = document.getElementById('amountError');
    const otherAmountContainer = document.getElementById('otherAmountContainer');
    const customAmountInput = document.getElementById('customAmount');
    const pixKey = "45.037.042/0001-35";

    // === TOGGLE OUTRO VALOR ===
    document.querySelectorAll('input[name="Valor_da_doacao"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'other') {
                otherAmountContainer.classList.add('active');
                customAmountInput.focus();
            } else {
                otherAmountContainer.classList.remove('active');
                customAmountInput.value = '';
                otherAmountContainer.classList.remove('error');
            }
        });
    });

    // === MÁSCARA TELEFONE ===
    document.getElementById('phone').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 11);
        if (v.length <= 2) v = `(${v}`;
        else if (v.length <= 7) v = `(${v.substring(0,2)}) ${v.substring(2)}`;
        else v = `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
        e.target.value = v;
    });

    // === MOSTRAR ERRO ===
    function showError(fieldId, msg) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        const group = field.closest('.form-group');
        if (group) {
            group.classList.add('error');
            const span = group.querySelector('.error-message');
            if (span) {
                span.textContent = msg;
                span.style.display = 'block';
            }
        }
    }

    // === VALIDAÇÃO NO SUBMIT ===
    form.addEventListener('submit', function handler(e) {
        e.preventDefault();

        // Limpar erros
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
        amountError.style.display = 'none';

        let isValid = true;

        // 1. Nome
        const name = document.getElementById('fullName').value.trim();
        if (!name || name.length < 3) {
            showError('fullName', 'Nome deve ter pelo menos 3 caracteres');
            isValid = false;
        }

        // 2. Email
        const email = document.getElementById('email').value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Email inválido');
            isValid = false;
        }

        // 3. Telefone
        const phoneDigits = document.getElementById('phone').value.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            showError('phone', 'Telefone deve ter DDD + número');
            isValid = false;
        }

        // 4. Valor da doação
        const selected = document.querySelector('input[name="Valor_da_doacao"]:checked');
        if (!selected) {
            amountError.style.display = 'block';
            isValid = false;
        } else if (selected.value === 'other') {
            const custom = parseFloat(customAmountInput.value);
            if (isNaN(custom) || custom <= 0) {
                showError('customAmount', 'Digite um valor maior que zero');
                isValid = false;
            }
        }

        // === ENVIO SE VÁLIDO ===
if (isValid) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // === PEGAR VALOR FINAL ===
    let finalValue = '0.00';
    const selected = document.querySelector('input[name="Valor_da_doacao"]:checked');
    if (selected) {
        if (selected.value === 'other') {
            const custom = parseFloat(customAmountInput.value);
            finalValue = isNaN(custom) || custom <= 0 ? '0.00' : custom.toFixed(2);
        } else {
            finalValue = parseFloat(selected.value).toFixed(2);
        }
    }
    document.getElementById('donationValue').value = finalValue;

    // === ENVIAR E REDIRECIONAR COM VALOR ===
    const params = new URLSearchParams({
        fullName: document.getElementById('fullName').value.trim(),
        donationValue: finalValue
    });

    const redirectUrl = `two/page.html?${params.toString()}`;

    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    }).then(() => {
        window.location.href = redirectUrl;
    }).catch(() => {
        window.location.href = redirectUrl; // Mesmo se falhar, mostra o sucesso
    });
}
    });

    // === CANCELAR ===
    document.getElementById('cancelBtn').addEventListener('click', () => {
        if (confirm('Cancelar doação?')) {
            form.reset();
            otherAmountContainer.classList.remove('active');
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
            amountError.style.display = 'none';
        }
    });

    // === COPIAR PIX ===
    document.getElementById('copyPixBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(pixKey).then(() => {
            const btn = document.getElementById('copyPixBtn');
            const old = btn.textContent;
            btn.textContent = 'Copiado!';
            btn.style.backgroundColor = '#2e7d32';
            setTimeout(() => {
                btn.textContent = old;
                btn.style.backgroundColor = '';
            }, 2000);
        }).catch(() => alert('Chave PIX: ' + pixKey));
    });

    // === SUCESSO ===
    if (location.search.includes('success=true')) {
        document.getElementById('successMessage').style.display = 'block';
        history.replaceState({}, '', location.pathname);
    }
});
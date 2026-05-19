        // URL da API (mantida original)
        const API_URL = "https://geradorai-backend-jh99.vercel.app/generate"; 

        // Captura dos elementos do DOM de forma segura após o carregamento
        const containerInputs = document.getElementById('inputs-container');
        const spinner = document.getElementById('loading-spinner');
        const btnEnviar = document.getElementById('btn-enviar');
        const resultadoContainer = document.getElementById('resultado-container');
        const errorContainer = document.getElementById('error-message');
        const recipeContentDiv = document.getElementById('recipe-content');

        // Reorganizar placeholders
        function reorganizarPlaceholders() {
            const inputs = containerInputs.querySelectorAll('.ingrediente-input');
            inputs.forEach((input, index) => {
                input.placeholder = `🍲 Ingrediente ${index + 1} · ex: ervas, legumes...`;
            });
        }

        // Adicionar campo dinâmico
        function adicionarInput() {
            const totalInputs = containerInputs.querySelectorAll('.ingrediente-input').length + 1;
            const wrapper = document.createElement('div');
            wrapper.className = 'flex gap-3 items-center w-full';
            
            const novoInput = document.createElement('input');
            novoInput.type = 'text';
            novoInput.placeholder = `📖 Ingrediente ${totalInputs} (ex: queijo, azeite)`;
            novoInput.className = 'ingrediente-input w-full px-5 py-3 bg-[#fef7e6] border border-[#e3cfaa] rounded-xl text-stone-700 focus:border-amber-600 focus:ring-2 focus:ring-amber-400/50 focus:outline-none transition-all font-serif-body';
            novoInput.required = true;
            
            const btnDeletar = document.createElement('button');
            btnDeletar.type = 'button';
            btnDeletar.innerHTML = '<i class="fas fa-trash-alt text-amber-700/70 hover:text-red-600 text-base"></i>';
            btnDeletar.className = 'flex-shrink-0 w-11 h-11 rounded-full bg-amber-50 hover:bg-red-50 border border-amber-200 transition-all duration-200 flex items-center justify-center';
            btnDeletar.setAttribute('aria-label', 'Remover');
            btnDeletar.onclick = function() { wrapper.remove(); reorganizarPlaceholders(); };
            
            wrapper.appendChild(novoInput);
            wrapper.appendChild(btnDeletar);
            containerInputs.appendChild(wrapper);
            reorganizarPlaceholders();
        }

        // Gerar receita chamando API
        async function gerarReceita(event) {
            event.preventDefault();
            
            const inputs = document.querySelectorAll('.ingrediente-input');
            const listaIngredientes = Array.from(inputs).map(i => i.value.trim()).filter(v => v !== "");
            
            if (listaIngredientes.length < 3) {
                mostrarErro("Adicione pelo menos 3 ingredientes no seu caderno de receitas para criarmos um prato especial.");
                return;
            }
            
            errorContainer.classList.add('hidden');
            resultadoContainer.classList.add('hidden');
            spinner.classList.remove('hidden');
            btnEnviar.disabled = true;
            btnEnviar.classList.add('opacity-70', 'cursor-not-allowed');
            
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ingredientes: listaIngredientes })
                });
                const data = await response.json();
                if (data.status === "success") {
                    exibirReceita(data.dados_receita);
                } else {
                    mostrarErro(data.message || "O Chef IA não conseguiu escrever sua receita. Tente novamente com outros ingredientes.");
                }
            } catch (error) {
                console.error(error);
                mostrarErro("Não foi possível conectar ao nosso forno mágico. Verifique sua conexão ou tente mais tarde.");
            } finally {
                spinner.classList.add('hidden');
                btnEnviar.disabled = false;
                btnEnviar.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        }
        
        // Exibir receita na tela
        function exibirReceita(receita) {
            document.getElementById('rec-titulo').innerText = receita.nome_da_receita || "Receita da Tradição";
            document.getElementById('rec-tempo').innerText = receita.tempo_de_preparo || "40 minutos";
            document.getElementById('rec-porcoes').innerText = receita.porcoes || "4 porções generosas";
            
            const ul = document.getElementById('rec-ingredientes');
            ul.innerHTML = "";
            if (receita.ingredientes && Array.isArray(receita.ingredientes)) {
                receita.ingredientes.forEach(ing => {
                    const li = document.createElement('li');
                    li.className = "flex items-start gap-2 text-stone-700 py-1 font-serif-body";
                    li.innerHTML = `<i class="fas fa-check-circle text-amber-600 text-sm mt-0.5"></i><span>${ing}</span>`;
                    ul.appendChild(li);
                });
            } else {
                ul.innerHTML = "<li class='italic text-stone-500'>Lista de ingredientes não disponível</li>";
            }
            
            const ol = document.getElementById('rec-preparo');
            ol.innerHTML = "";
            if (receita.modo_de_preparo && Array.isArray(receita.modo_de_preparo)) {
                receita.modo_de_preparo.forEach((passo, idx) => {
                    const li = document.createElement('li');
                    li.className = "text-stone-700 pl-1 pb-2 border-b border-amber-100/70 last:border-0 font-serif-body";
                    li.innerHTML = `<span class="font-bold font-serif-title text-amber-800 mr-2">${idx+1}.</span> ${passo}`;
                    ol.appendChild(li);
                });
            } else {
                ol.innerHTML = "<li class='text-amber-700 italic'>Modo de preparo não disponível no momento.</li>";
            }
            
            resultadoContainer.classList.remove('hidden');
            setTimeout(() => {
                resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 120);
        }
        
       function mostrarErro(mensagem) {
            const errorTextSpan = document.getElementById('error-text');
            errorTextSpan.innerText = mensagem;  
            errorContainer.classList.remove('hidden');
            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
        
        function reiniciarFormulario() {
            containerInputs.innerHTML = `
                <input type="text" placeholder="🍅 Ex: tomates italianos maduros" required class="ingrediente-input w-full px-5 py-3 bg-[#fef7e6] border border-[#e3cfaa] rounded-xl text-stone-700 focus:border-amber-600 focus:ring-2 focus:ring-amber-400/50 focus:outline-none transition-all font-serif-body">
                <input type="text" placeholder="🧄 Ex: alho perfumado, dentes" required class="ingrediente-input w-full px-5 py-3 bg-[#fef7e6] border border-[#e3cfaa] rounded-xl text-stone-700 focus:border-amber-600 focus:ring-2 focus:ring-amber-400/50 focus:outline-none transition-all font-serif-body">
                <input type="text" placeholder="🌿 Ex: manjericão fresco" required class="ingrediente-input w-full px-5 py-3 bg-[#fef7e6] border border-[#e3cfaa] rounded-xl text-stone-700 focus:border-amber-600 focus:ring-2 focus:ring-amber-400/50 focus:outline-none transition-all font-serif-body">
            `;
            resultadoContainer.classList.add('hidden');
            errorContainer.classList.add('hidden');
            reorganizarPlaceholders();
        }
        
        // ========== FUNÇÕES DOS BOTÕES ==========
        
        function imprimirReceita() {
            const recipeHTML = recipeContentDiv.cloneNode(true);
            const titulo = document.getElementById('rec-titulo').innerText;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Livro de Receitas - ${titulo}</title>
                    <script src="https://cdn.tailwindcss.com"><\/script>
                    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                    <style>
                        body { background: white; padding: 2rem; font-family: 'Lora', Georgia, serif; }
                        .recipe-card-print { max-width: 800px; margin: 0 auto; }
                        @media print {
                            body { padding: 0; margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="recipe-card-print">
                        ${recipeHTML.outerHTML}
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            
            // Timeout adicionado para dar tempo de carregar os estilos do Tailwind antes do print
            printWindow.onload = function() {
                setTimeout(() => {
                    printWindow.print();
                }, 350);
            };
        }
        
        function compartilharReceita() {
            const titulo = document.getElementById('rec-titulo').innerText;
            const ingredientes = Array.from(document.querySelectorAll('#rec-ingredientes li span')).map(s => s.innerText).join(', ');
            const texto = `📖 *${titulo}*\n\nIngredientes: ${ingredientes}\n\nReceita completa gerada pelo Livro de Receitas IA.`;
            
            if (navigator.share) {
                navigator.share({
                    title: titulo,
                    text: `Confira esta receita: ${titulo}`,
                    url: window.location.href,
                }).catch(err => console.log('Erro ao compartilhar:', err));
            } else {
                navigator.clipboard.writeText(texto).then(() => {
                    alert('📋 Receita copiada para a área de transferência! Compartilhe onde quiser.');
                }).catch(() => {
                    alert('Não foi possível compartilhar automaticamente. Você pode copiar manualmente.');
                });
            }
        }
        
        function baixarPDF() {
            const element = recipeContentDiv.cloneNode(true);
            const header = document.createElement('div');
            header.className = 'text-center mb-6 border-b pb-4';
            header.innerHTML = '<h2 class="font-serif-title text-2xl text-amber-800">📖 Livro de Receitas</h2><p class="text-sm text-stone-500">Gerado por IA · Chef Gemini</p>';
            element.prepend(header);
            
            const opt = {
                margin:        [0.5, 0.5, 0.5, 0.5],
                filename:      `receita_${document.getElementById('rec-titulo').innerText.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
                image:         { type: 'jpeg', quality: 0.98 },
                html2canvas:   { scale: 2, letterRendering: true, useCORS: false, logging: false },
                jsPDF:         { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        }
        
        window.addEventListener('DOMContentLoaded', () => {
            reorganizarPlaceholders();
        });
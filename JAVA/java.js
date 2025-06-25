//Variáveis globais
        let map;
        let currentTool = 'pen';
        let isDrawing = false;
        let uploadedPhotos = [];
        let locationData = null;
        let locationCapture = null;
        let terrainCapture = null;

        // Inicializar aplicação
        document.addEventListener('DOMContentLoaded', function() {
            initializeMap();
            setupDrawingCanvas();
            setupTerrainCanvas();
        });

        // Inicializar mapa (simulado)
        function initializeMap() {
            const mapDiv = document.getElementById('map');
            mapDiv.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #e9ecef; color: #6c757d; font-size: 18px;">
                    <div style="text-align: center;">
                        <svg style="width: 64px; height: 64px; margin-bottom: 15px;" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <p>Pesquise um local para visualizar o mapa</p>
                        <p style="font-size: 14px; margin-top: 10px;">Integração com Google Maps será ativada aqui</p>
                    </div>
                </div>
            `;
        }

        // Pesquisar localização
        function searchLocation() {
            const searchInput = document.getElementById('searchInput');
            const query = searchInput.value.trim();
            
            if (!query) {
                showMessage('Por favor, digite um local para pesquisar.', 'error');
                return;
            }

            // Simular pesquisa
            const mapDiv = document.getElementById('map');
            mapDiv.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); color: white; font-size: 18px;">
                    <div style="text-align: center;">
                        <svg style="width: 64px; height: 64px; margin-bottom: 15px;" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <p><strong>${query}</strong></p>
                        <p style="font-size: 14px; margin-top: 10px;">Localização encontrada - Mapa carregado</p>
                    </div>
                </div>
            `;

            locationData = {
                address: query,
                timestamp: new Date().toLocaleString('pt-BR')
            };

            showMessage('Local encontrado com sucesso!', 'success');
        }

        // Configurar canvas de desenho
        function setupDrawingCanvas() {
            const canvas = document.getElementById('drawingCanvas');
            const ctx = canvas.getContext('2d');
            
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);
        }

        function setupTerrainCanvas() {
            const canvas = document.getElementById('terrainCanvas');
            const ctx = canvas.getContext('2d');
            
            // Desenhar fundo do terreno
            ctx.fillStyle = '#8bc34a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Adicionar grid
            ctx.strokeStyle = '#689f38';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 40) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }
        }

        function setupTerrainDrawing() {
            const canvas = document.getElementById('terrainCanvas');
            
            canvas.addEventListener('mousedown', startTerrainDrawing);
            canvas.addEventListener('mousemove', drawTerrain);
            canvas.addEventListener('mouseup', stopTerrainDrawing);
            canvas.addEventListener('mouseout', stopTerrainDrawing);
            
            showMessage('Modo de desenho do terreno ativado!', 'success');
        }

        let terrainDrawing = false;

        function startTerrainDrawing(e) {
            terrainDrawing = true;
            const canvas = document.getElementById('terrainCanvas');
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }

        function drawTerrain(e) {
            if (!terrainDrawing) return;
            
            const canvas = document.getElementById('terrainCanvas');
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#2196f3';
            ctx.lineCap = 'round';
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }

        function stopTerrainDrawing() {
            terrainDrawing = false;
        }

        // Ferramentas de desenho
        function selectTool(tool) {
            currentTool = tool;
            document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        }

        function startDrawing(e) {
            isDrawing = true;
            const canvas = document.getElementById('drawingCanvas');
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }

        function draw(e) {
            if (!isDrawing) return;
            
            const canvas = document.getElementById('drawingCanvas');
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            
            if (currentTool === 'pen') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#e74c3c';
            } else if (currentTool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 20;
            }
            
            ctx.lineCap = 'round';
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function clearCanvas() {
            const canvas = document.getElementById('drawingCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function clearTerrainCanvas() {
            setupTerrainCanvas();
        }

        // Capturar imagens
        function captureLocation() {
            if (!locationData) {
                showMessage('Por favor, pesquise um local primeiro.', 'error');
                return;
            }
            
            const canvas = document.getElementById('drawingCanvas');
            locationCapture = canvas.toDataURL();
            showMessage('Captura do local realizada com sucesso!', 'success');
        }

        function captureTerrain() {
            const canvas = document.getElementById('terrainCanvas');
            terrainCapture = canvas.toDataURL();
            showMessage('Captura do terreno realizada com sucesso!', 'success');
        }

        // Upload de fotos
        function handlePhotoUpload(event) {
            const files = Array.from(event.target.files);
            
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const photo = {
                            id: Date.now() + Math.random(),
                            file: file,
                            dataUrl: e.target.result,
                            name: file.name,
                            description: ''
                        };
                        uploadedPhotos.push(photo);
                        updatePhotoPreview();
                        updateDescriptions();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        function updatePhotoPreview() {
            const preview = document.getElementById('photoPreview');
            preview.innerHTML = '';
            
            uploadedPhotos.forEach((photo, index) => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo-item';
                photoDiv.innerHTML = `
                    <img src="${photo.dataUrl}" alt="${photo.name}">
                    <button class="remove-btn" onclick="removePhoto(${photo.id})">×</button>
                `;
                preview.appendChild(photoDiv);
            });

            // Mostrar card de descrições se houver fotos
            const descriptionsCard = document.getElementById('descriptionsCard');
            descriptionsCard.style.display = uploadedPhotos.length > 0 ? 'block' : 'none';
        }

        function removePhoto(photoId) {
            uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
            updatePhotoPreview();
            updateDescriptions();
        }

        function updateDescriptions() {
            const container = document.getElementById('descriptionsContainer');
            container.innerHTML = '';
            
            uploadedPhotos.forEach((photo, index) => {
                const descDiv = document.createElement('div');
                descDiv.className = 'photo-description';
                descDiv.innerHTML = `
                    <div style="min-width: 100px;">
                        <img src="${photo.dataUrl}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                        <p style="margin-top: 8px; font-weight: 600; color: #4facfe;">Foto ${index + 1}</p>
                    </div>
                    <textarea 
                        placeholder="Descreva a Foto ${index + 1}..."
                        onchange="updatePhotoDescription(${photo.id}, this.value)"
                        value="${photo.description}"
                    >${photo.description}</textarea>
                `;
                container.appendChild(descDiv);
            });
        }

        function updatePhotoDescription(photoId, description) {
            const photo = uploadedPhotos.find(p => p.id === photoId);
            if (photo) {
                photo.description = description;
            }
        }

        // Gerar PDF
        async function generatePDF(event) {
    if (!locationData) {
        showMessage('Por favor, pesquise um local primeiro.', 'error');
        return;
    }

    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"><div class="spinner"></div>Gerando PDF...</div>';
    button.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        let y = 20;

        // Título
        pdf.setFontSize(20);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Relatório de Captura de Imóvel', 20, y);
        y += 10;

        // Linha
        pdf.setDrawColor(79, 172, 254);
        pdf.line(20, y, 190, y);
        y += 10;

        // Localização
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(` Endereço: ${locationData.address}`, 20, y);
        y += 7;
        pdf.text(` Data/Hora: ${locationData.timestamp}`, 20, y);
        y += 10;

        // Captura do Local
        if (locationCapture) {
            pdf.setFontSize(12);
            pdf.text(' Captura do Local:', 20, y);
            y += 5;
            pdf.addImage(locationCapture, 'PNG', 20, y, 170, 90);
            y += 100;
        }

        // Captura do Terreno
        if (terrainCapture) {
            if (y > 180) {
                pdf.addPage();
                y = 20;
            }
            pdf.text(' Captura do Terreno:', 20, y);
            y += 5;
            pdf.addImage(terrainCapture, 'PNG', 20, y, 170, 90);
            y += 100;
        }

        // Fotos e Descrições
        if (uploadedPhotos.length > 0) {
            pdf.setFontSize(14);
            pdf.text(' Fotos Documentadas:', 20, y);
            y += 10;

            for (let i = 0; i < uploadedPhotos.length; i++) {
                const photo = uploadedPhotos[i];
                if (y > 180) {
                    pdf.addPage();
                    y = 20;
                }

                pdf.setFontSize(12);
                pdf.text(`Foto ${i + 1}: ${photo.name}`, 20, y);
                y += 6;

                try {
                    pdf.addImage(photo.dataUrl, 'JPEG', 20, y, 80, 60);
                } catch {
                    pdf.text('Erro ao carregar imagem', 20, y);
                }

                if (photo.description) {
                    const textLines = pdf.splitTextToSize(photo.description, 100);
                    pdf.text(textLines, 110, y + 10);
                }

                y += 70;
            }
        }

        // Rodapé
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(120, 120, 120);
            pdf.text(`Página ${i} de ${pageCount}`, 20, 285);
            pdf.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 120, 285);
        }

        // Nome do arquivo com base no local
        const filename = `relatorio_${locationData.address.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);

        showMessage('PDF gerado com sucesso!', 'success');
    } catch (error) {
        console.error(error);
        showMessage('Erro ao gerar PDF. Tente novamente.', 'error');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}
// Gerar PDF
async function generatePDF(event) {
    if (!locationData) {
        showMessage('Por favor, pesquise um local primeiro.', 'error');
        return;
    }

    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"><div class="spinner"></div>Gerando PDF...</div>';
    button.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        let y = 20;

        // Título
        pdf.setFontSize(20);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Relatório de Captura de Imóvel', 20, y);
        y += 10;

        // Linha
        pdf.setDrawColor(79, 172, 254);
        pdf.line(20, y, 190, y);
        y += 10;

        // Localização
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text(` Endereço: ${locationData.address}`, 20, y);
        y += 7;
        pdf.text(` Data/Hora: ${locationData.timestamp}`, 20, y);
        y += 10;

        // Captura do Local
        if (locationCapture) {
            pdf.setFontSize(12);
            pdf.text('Captura do Local:', 20, y);
            y += 5;
            pdf.addImage(locationCapture, 'PNG', 20, y, 170, 90);
            y += 100;
        }

        // Captura do Terreno
        if (terrainCapture) {
            if (y > 180) {
                pdf.addPage();
                y = 20;
            }
            pdf.text(' Captura do Terreno:', 20, y);
            y += 5;
            pdf.addImage(terrainCapture, 'PNG', 20, y, 170, 90);
            y += 100;
        }

        // Fotos e Descrições
        if (uploadedPhotos.length > 0) {
            pdf.setFontSize(14);
            pdf.text('Fotos Documentadas:', 20, y);
            y += 10;

            for (let i = 0; i < uploadedPhotos.length; i++) {
                const photo = uploadedPhotos[i];
                if (y > 180) {
                    pdf.addPage();
                    y = 20;
                }

                pdf.setFontSize(12);
                pdf.text(`Foto ${i + 1}: ${photo.name}`, 20, y);
                y += 6;

                try {
                    pdf.addImage(photo.dataUrl, 'JPEG', 20, y, 80, 60);
                } catch {
                    pdf.text('Erro ao carregar imagem', 20, y);
                }

                if (photo.description) {
                    const textLines = pdf.splitTextToSize(photo.description, 100);
                    pdf.text(textLines, 110, y + 10);
                }

                y += 70;
            }
        }

        // Rodapé
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(120, 120, 120);
            pdf.text(`Página ${i} de ${pageCount}`, 20, 285);
            pdf.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 120, 285);
        }

        // Nome do arquivo com base no local
        const filename = `relatorio_${locationData.address.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);

        showMessage('PDF gerado com sucesso!', 'success');
    } catch (error) {
        console.error(error);
        showMessage('Erro ao gerar PDF. Tente novamente.', 'error');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Ativar o botão de gerar PDF
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('btnGerarPDF');
    if (btn) {
        btn.addEventListener('click', generatePDF);
    }
});



        // Funções auxiliares
        function showMessage(message, type) {
            const existingMessage = document.querySelector('.error-message, .success-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
            messageDiv.textContent = message;
            
            const firstCard = document.querySelector('.card');
            firstCard.parentNode.insertBefore(messageDiv, firstCard);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }

        // Permitir pesquisa com Enter
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchLocation();
            }
        });

        // Drag and drop para fotos
        const photoUpload = document.querySelector('.photo-upload');
        
        photoUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#e3f2fd';
        });
        
        photoUpload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
        });
        
        photoUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length > 0) {
                imageFiles.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const photo = {
                            id: Date.now() + Math.random(),
                            file: file,
                            dataUrl: e.target.result,
                            name: file.name,
                            description: ''
                        };
                        uploadedPhotos.push(photo);
                        updatePhotoPreview();
                        updateDescriptions();
                    };
                    reader.readAsDataURL(file);
                });
            }
        });
       
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('btnGerarPDF');
    btn.addEventListener('click', function () {
      const conteudo = document.getElementById('conteudo');
      const opcoes = {
        margin: [10, 10, 10, 10],
        filename: 'relatorio_vendas.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opcoes).from(conteudo).save();
    });
  });

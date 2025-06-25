
        let selectedOptions = new Set();
        let photos = [];
        let currentTool = 'draw';
        let isDrawing = false;
        let mapCaptures = {};

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            setupEventListeners();
            initializeCanvases();
        });

        function setupEventListeners() {
            // Seleção de opções
            document.querySelectorAll('.option-card').forEach(card => {
                card.addEventListener('click', function() {
                    const option = this.dataset.option;
                    toggleOption(option, this);
                });
            });

            // Upload de fotos
            const photoInput = document.getElementById('photo-input');
            const uploadArea = document.querySelector('.upload-area');

            photoInput.addEventListener('change', handlePhotoUpload);

            // Drag and drop
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                const files = e.dataTransfer.files;
                handleFiles(files);
            });

            // Ferramentas de desenho
            document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
                btn.addEventListener('click', function() {
                    const tool = this.dataset.tool;
                    const canvas = this.dataset.canvas;
                    selectTool(tool, canvas, this);
                });
            });
        }

        function toggleOption(option, element) {
            if (selectedOptions.has(option)) {
                selectedOptions.delete(option);
                element.classList.remove('selected');
            } else {
                selectedOptions.add(option);
                element.classList.add('selected');
            }

            updateSections();
        }

        function updateSections() {
            const mapsSection = document.getElementById('maps-section');
            const photosSection = document.getElementById('photos-section');

            mapsSection.classList.toggle('active', selectedOptions.has('maps'));
            photosSection.classList.toggle('active', selectedOptions.has('photos'));
        }

        function searchAddress() {
            const address = document.getElementById('address-search').value;
            if (!address.trim()) {
                alert('Por favor, digite um endereço para buscar.');
                return;
            }

            // Simulação de busca de endereço
            const maps = ['map1', 'map2', 'map3'];
            maps.forEach((mapId, index) => {
                const mapElement = document.getElementById(mapId);
                mapElement.innerHTML = `
                    <div style="background: linear-gradient(45deg, #e8f5e8, #f0f8ff); height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #2c3e50;">
                        <div style="font-size: 24px; margin-bottom: 10px;"></div>
                        <div style="font-weight: bold;">${['Mapa Principal', 'Vista Aérea', 'Terreno'][index]}</div>
                        <div style="font-size: 14px; margin-top: 5px;">${address}</div>
                    </div>
                `;
            });
        }

        function initializeCanvases() {
            ['canvas1', 'canvas2', 'canvas3'].forEach(canvasId => {
                const canvas = document.getElementById(canvasId);
                const ctx = canvas.getContext('2d');
                
                // Ajustar canvas para o tamanho do container
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
                
                setupCanvasEvents(canvas, ctx);
            });
        }

        function setupCanvasEvents(canvas, ctx) {
            let isDrawing = false;
            let startX, startY;

            canvas.addEventListener('mousedown', function(e) {
                isDrawing = true;
                const rect = canvas.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;

                if (currentTool === 'draw' || currentTool === 'eraser') {
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                }
            });

            canvas.addEventListener('mousemove', function(e) {
                if (!isDrawing) return;

                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ctx.lineWidth = currentTool === 'eraser' ? 20 : 3;
                ctx.lineCap = 'round';

                if (currentTool === 'draw') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = '#e74c3c';
                    ctx.lineTo(x, y);
                    ctx.stroke();
                } else if (currentTool === 'eraser') {
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            });

            canvas.addEventListener('mouseup', function(e) {
                if (!isDrawing) return;
                isDrawing = false;

                const rect = canvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;

                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = '#e74c3c';
                ctx.lineWidth = 3;

                if (currentTool === 'circle') {
                    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                    ctx.beginPath();
                    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                } else if (currentTool === 'rectangle') {
                    ctx.beginPath();
                    ctx.rect(startX, startY, endX - startX, endY - startY);
                    ctx.stroke();
                }
            });
        }

        function selectTool(tool, canvasId, button) {
            currentTool = tool;
            
            // Remove active class from all buttons for this canvas
            const canvasButtons = document.querySelectorAll(`[data-canvas="${canvasId}"]`);
            canvasButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to selected button
            button.classList.add('active');
        }

        function clearCanvas(canvasId) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function captureMap(mapNumber) {
            const canvas = document.getElementById(`canvas${mapNumber}`);
            const dataURL = canvas.toDataURL();
            mapCaptures[`map${mapNumber}`] = dataURL;
            alert(`Mapa ${mapNumber} capturado com sucesso!`);
        }

        function handlePhotoUpload(e) {
            handleFiles(e.target.files);
        }

        function handleFiles(files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const photo = {
                            id: Date.now() + Math.random(),
                            src: e.target.result,
                            name: file.name,
                            description: ''
                        };
                        photos.push(photo);
                        renderPhotos();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        function renderPhotos() {
            const grid = document.getElementById('photos-grid');
            grid.innerHTML = '';

            photos.forEach((photo, index) => {
                const photoElement = document.createElement('div');
                photoElement.className = 'photo-item';
                photoElement.innerHTML = `
                    <img src="${photo.src}" alt="${photo.name}" class="photo-preview">
                    <div class="photo-info">
                        <h4 style="margin-bottom: 10px; color: #2c3e50;">${photo.name}</h4>
                        <textarea 
                            class="photo-description" 
                            placeholder="Adicione uma descrição para esta foto..."
                            onchange="updatePhotoDescription(${index}, this.value)"
                        >${photo.description}</textarea>
                        <button class="remove-photo-btn" onclick="removePhoto(${index})">
                             Remover Foto
                        </button>
                    </div>
                `;
                grid.appendChild(photoElement);
            });
        }

        function updatePhotoDescription(index, description) {
            photos[index].description = description;
        }

        function removePhoto(index) {
            photos.splice(index, 1);
            renderPhotos();
        }

        function generatePDF() {
            if (selectedOptions.size === 0) {
                alert('Por favor, selecione pelo menos uma opção (Google Maps ou Relatório de Fotos)');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let yPosition = 20;

            // Título
            doc.setFontSize(20);
            doc.setTextColor(44, 62, 80);
            doc.text('Formulário de Fotos', 20, yPosition);
            yPosition += 20;

            // Data
            doc.setFontSize(12);
            doc.setTextColor(108, 117, 125);
            doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, yPosition);
            yPosition += 20;

            // Seção Google Maps
            if (selectedOptions.has('maps')) {
                doc.setFontSize(16);
                doc.setTextColor(44, 62, 80);
                doc.text(' Seção Google Maps', 20, yPosition);
                yPosition += 15;

                const address = document.getElementById('address-search').value;
                if (address) {
                    doc.setFontSize(12);
                    doc.text(`Endereço pesquisado: ${address}`, 20, yPosition);
                    yPosition += 10;
                }

                // Adicionar capturas de mapas se existirem
                Object.keys(mapCaptures).forEach(mapKey => {
                    if (yPosition > 250) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    doc.text(`Captura: ${mapKey}`, 20, yPosition);
                    yPosition += 10;
                    
                    try {
                        doc.addImage(mapCaptures[mapKey], 'PNG', 20, yPosition, 170, 100);
                        yPosition += 110;
                    } catch (e) {
                        doc.text('Erro ao adicionar imagem do mapa', 20, yPosition);
                        yPosition += 10;
                    }
                });
            }

            // Seção Relatório de Fotos
            if (selectedOptions.has('photos')) {
                if (yPosition > 200) {
                    doc.addPage();
                    yPosition = 20;
                }

                doc.setFontSize(16);
                doc.setTextColor(44, 62, 80);
                doc.text('📷 Relatório de Fotos', 20, yPosition);
                yPosition += 15;

                if (photos.length === 0) {
                    doc.setFontSize(12);
                    doc.setTextColor(108, 117, 125);
                    doc.text('Nenhuma foto foi adicionada.', 20, yPosition);
                } else {
                    photos.forEach((photo, index) => {
                        if (yPosition > 200) {
                            doc.addPage();
                            yPosition = 20;
                        }

                        doc.setFontSize(14);
                        doc.setTextColor(44, 62, 80);
                        doc.text(`Foto ${index + 1}: ${photo.name}`, 20, yPosition);
                        yPosition += 10;

                        try {
                            doc.addImage(photo.src, 'JPEG', 20, yPosition, 100, 75);
                        } catch (e) {
                            doc.text('Erro ao adicionar foto', 20, yPosition);
                        }

                        if (photo.description) {
                            doc.setFontSize(10);
                            doc.setTextColor(108, 117, 125);
                            const lines = doc.splitTextToSize(photo.description, 170);
                            doc.text(lines, 130, yPosition);
                        }

                        yPosition += 85;
                    });
                }
            }

            // Salvar PDF
            const filename = `formulario-fotos-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
            doc.save(filename);
        }
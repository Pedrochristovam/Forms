import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Upload, Download, Trash2, Circle, Square, Edit3, Camera, FileText, Map } from 'lucide-react';

const FormularioFotos = () => {
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState({
    googleMaps: false,
    relatorioFotos: false
  });
  
  const [endereco, setEndereco] = useState('');
  const [fotos, setFotos] = useState([]);
  const [modoDesenho, setModoDesenho] = useState('');
  const canvasRefs = [useRef(null), useRef(null), useRef(null)];
  const [isDrawing, setIsDrawing] = useState(false);

  const handleOpcaoChange = (opcao) => {
    setOpcoesSelecionadas(prev => ({
      ...prev,
      [opcao]: !prev[opcao]
    }));
  };

  const handleAddFoto = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          src: e.target.result,
          nome: file.name,
          descricao: ''
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDescricaoChange = (id, descricao) => {
    setFotos(prev => prev.map(foto => 
      foto.id === id ? { ...foto, descricao } : foto
    ));
  };

  const removeFoto = (id) => {
    setFotos(prev => prev.filter(foto => foto.id !== id));
  };

  const initCanvas = (canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const startDrawing = (e, canvasIndex) => {
    const canvas = canvasRefs[canvasIndex].current;
    if (!canvas || !modoDesenho) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    
    if (modoDesenho === 'draw') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e, canvasIndex) => {
    if (!isDrawing || !modoDesenho) return;
    
    const canvas = canvasRefs[canvasIndex].current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    
    if (modoDesenho === 'draw') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e, canvasIndex) => {
    if (!isDrawing || !modoDesenho) return;
    
    const canvas = canvasRefs[canvasIndex].current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    
    if (modoDesenho === 'circle') {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (modoDesenho === 'square') {
      ctx.strokeRect(x - 15, y - 15, 30, 30);
    }
    
    setIsDrawing(false);
  };

  const clearCanvas = (canvasIndex) => {
    const canvas = canvasRefs[canvasIndex].current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const captureCanvas = (canvasIndex) => {
    const canvas = canvasRefs[canvasIndex].current;
    const link = document.createElement('a');
    link.download = `mapa-${canvasIndex + 1}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const gerarPDF = () => {
    // Simulação da geração de PDF
    const conteudo = [];
    
    if (opcoesSelecionadas.googleMaps) {
      conteudo.push('=== GOOGLE MAPS ===');
      conteudo.push(`Endereço: ${endereco || 'Não especificado'}`);
      conteudo.push('Mapas com anotações capturados');
    }
    
    if (opcoesSelecionadas.relatorioFotos) {
      conteudo.push('=== RELATÓRIO DE FOTOS ===');
      fotos.forEach((foto, index) => {
        conteudo.push(`Foto ${index + 1}: ${foto.nome}`);
        conteudo.push(`Descrição: ${foto.descricao || 'Sem descrição'}`);
      });
    }
    
    const blob = new Blob([conteudo.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio.txt';
    link.click();
    
    alert('PDF gerado com sucesso! (Simulação - arquivo .txt baixado)');
  };

  useEffect(() => {
    canvasRefs.forEach(ref => {
      if (ref.current) {
        initCanvas(ref.current);
      }
    });
  }, [opcoesSelecionadas.googleMaps]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Formulário de Fotos</h1>
          <p className="text-gray-600">Monte seu formulário personalizado e gere PDF</p>
        </header>

        {/* Seleção de Opções */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Selecione as opções desejadas:</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={opcoesSelecionadas.googleMaps}
                onChange={() => handleOpcaoChange('googleMaps')}
                className="w-5 h-5 text-blue-600"
              />
              <Map className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium">Google Maps</span>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={opcoesSelecionadas.relatorioFotos}
                onChange={() => handleOpcaoChange('relatorioFotos')}
                className="w-5 h-5 text-blue-600"
              />
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-medium">Relatório de Fotos</span>
            </label>
          </div>
        </div>

        {/* Google Maps Section */}
        {opcoesSelecionadas.googleMaps && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-blue-600" />
              Google Maps
            </h2>
            
            {/* Busca de Endereço */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digite o endereço:
              </label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex.: Rua das Flores, 123, São Paulo, SP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Ferramentas de Desenho */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Ferramentas de Anotação:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setModoDesenho(modoDesenho === 'draw' ? '' : 'draw')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    modoDesenho === 'draw' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Desenhar</span>
                </button>
                <button
                  onClick={() => setModoDesenho(modoDesenho === 'circle' ? '' : 'circle')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    modoDesenho === 'circle' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Circle className="w-4 h-4" />
                  <span>Círculo</span>
                </button>
                <button
                  onClick={() => setModoDesenho(modoDesenho === 'square' ? '' : 'square')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    modoDesenho === 'square' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Square className="w-4 h-4" />
                  <span>Quadrado</span>
                </button>
              </div>
            </div>

            {/* Cards de Mapas */}
            <div className="grid gap-6">
              {[
                { titulo: 'Mapa Principal', descricao: 'Vista geral do local' },
                { titulo: 'Mapa de Detalhes', descricao: 'Vista detalhada da área' },
                { titulo: 'Mapa de Terreno', descricao: 'Captura do terreno específico' }
              ].map((mapa, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-medium">{mapa.titulo}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => clearCanvas(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Limpar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => captureCanvas(index)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Capturar"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{mapa.descricao}</p>
                  
                  {/* Simulação do Google Maps */}
                  <div className="relative">
                    <div className="bg-green-100 border-2 border-dashed border-green-300 rounded-lg h-64 flex items-center justify-center text-green-700 mb-2">
                      Google Maps API - {endereco || 'Digite um endereço'}
                    </div>
                    <canvas
                      ref={canvasRefs[index]}
                      width={800}
                      height={256}
                      className="absolute top-0 left-0 w-full h-64 cursor-crosshair"
                      onMouseDown={(e) => startDrawing(e, index)}
                      onMouseMove={(e) => draw(e, index)}
                      onMouseUp={(e) => stopDrawing(e, index)}
                      onMouseLeave={() => setIsDrawing(false)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relatório de Fotos Section */}
        {opcoesSelecionadas.relatorioFotos && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <Upload className="w-6 h-6 mr-2 text-blue-600" />
              Relatório de Fotos
            </h2>
            
            {/* Upload de Fotos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar Fotos:
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddFoto}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Lista de Fotos */}
            <div className="grid gap-4">
              {fotos.map((foto) => (
                <div key={foto.id} className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={foto.src}
                      alt={foto.nome}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{foto.nome}</h4>
                        <button
                          onClick={() => removeFoto(foto.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        placeholder="Descrição da foto..."
                        value={foto.descricao}
                        onChange={(e) => handleDescricaoChange(foto.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {fotos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma foto adicionada ainda. Use o campo acima para fazer upload.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botão Gerar PDF */}
        {(opcoesSelecionadas.googleMaps || opcoesSelecionadas.relatorioFotos) && (
          <div className="text-center">
            <button
              onClick={gerarPDF}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Download className="w-5 h-5" />
              <span>Gerar PDF</span>
            </button>
          </div>
        )}

        {/* Mensagem quando nenhuma opção está selecionada */}
        {!opcoesSelecionadas.googleMaps && !opcoesSelecionadas.relatorioFotos && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl">
              Selecione pelo menos uma opção acima para começar
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioFotos;
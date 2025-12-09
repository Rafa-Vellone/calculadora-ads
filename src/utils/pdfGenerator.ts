import jsPDF from "jspdf";
import { MediaDiariaData, MediaDiariaResults } from "@/components/MediaDiariaForm";
import { ViewsData, ViewsResults } from "@/components/ViewsForm";
import logoAds from "@/assets/logo-ads.png";

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatNumber = (value: number) => {
  return Math.round(value).toLocaleString('pt-BR');
};

const formatNumberWithDecimals = (value: number, decimals: number = 2) => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

const parseInputNumber = (value: string): number => {
  if (!value) return 0;
  return parseFloat(value.replace(/\./g, '').replace(',', '.'));
};

const formatDate = () => {
  return new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const generateSimulationTable = (doc: jsPDF, limiteDiario: number, cpv: number, startY: number, pageWidth: number): number => {
  let yPos = startY;
  
  // Section title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Simulação de Distribuição por Anúncio', 20, yPos);
  
  yPos += 12;
  
  // Table header
  const col1X = 25;
  const col2X = 85;
  const col3X = 145;
  
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Qtd. de Anúncios', col1X, yPos);
  doc.text('Valor por Anúncio/dia', col2X, yPos);
  doc.text('Views por Anúncio/dia', col3X, yPos);
  
  yPos += 10;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);
  
  for (let i = 1; i <= 6; i++) {
    const valorPorAnuncio = limiteDiario / i;
    const viewsPorAnuncio = Math.round(valorPorAnuncio / cpv);
    
    // Alternate row background
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
    }
    
    doc.text(`${i} anúncio${i > 1 ? 's' : ''}`, col1X, yPos);
    doc.text(formatCurrency(valorPorAnuncio), col2X, yPos);
    doc.text(formatNumber(viewsPorAnuncio), col3X, yPos);
    
    yPos += 8;
  }
  
  // Explanatory text
  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Importante:', 25, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 90, 90);
  
  const explanatoryText = 'Os valores apresentados na simulação servem como orientação para garantir que todo o saldo contratado seja utilizado de forma eficiente ao longo do contrato, permitindo que a Fraga entregue 100% do volume vendido ao cliente. No entanto, esses valores podem ser ajustados conforme a estratégia da campanha, sem comprometer o desempenho geral.';
  
  const splitExplanation = doc.splitTextToSize(explanatoryText, pageWidth - 50);
  doc.text(splitExplanation, 25, yPos);
  
  return yPos + (splitExplanation.length * 5) + 10;
};

export const generateMediaDiariaPDF = async (data: MediaDiariaData, results: MediaDiariaResults) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Parse CPV for simulation
  const cpvValue = parseInputNumber(data.cpv) || 0.8;
  
  // Load and add logo
  try {
    const img = await loadImage(logoAds);
    doc.addImage(img, 'PNG', 20, 15, 30, 15);
  } catch (e) {
    console.log('Could not load logo');
  }

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Relatório da Calculadora de Mídia ADS', pageWidth / 2, 45, { align: 'center' });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Cálculo pela Média Diária', pageWidth / 2, 55, { align: 'center' });

  // Date
  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDate()}`, pageWidth / 2, 63, { align: 'center' });

  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 70, pageWidth - 20, 70);

  // Info section
  let yPos = 85;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Informações Inseridas', 20, yPos);

  yPos += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);

  // Format input values with thousand separators
  const saldoTotalValue = parseInputNumber(data.saldoTotal);
  const saldoTotalFormatted = saldoTotalValue ? formatCurrency(saldoTotalValue) : 'R$ 0,00';
  const tempoContratoFormatted = formatNumber(parseInt(data.tempoContrato) || 0);
  const diasUteisFormatted = formatNumber(parseInt(data.diasUteis) || 0);

  const infoItems = [
    { label: 'Nome do Cliente', value: data.nomeCliente || 'Não informado' },
    { label: 'Saldo Total Contratado', value: saldoTotalFormatted },
    { label: 'Tempo de Contrato', value: `${tempoContratoFormatted} meses` },
    { label: 'Dias Úteis do Mês', value: `${diasUteisFormatted} dias` },
    { label: 'Custo por View (CPV)', value: `R$ ${data.cpv || '0,00'}` },
    { label: 'Custo por Clique (CPC)', value: `R$ ${data.cpc || '0,00'}` },
    { label: 'Taxa de Clique (CTR)', value: `${data.ctr || '0'}%` },
  ];

  infoItems.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, 90, yPos);
    yPos += 8;
  });

  // Results section
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Resultados Calculados', 20, yPos);

  yPos += 12;
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);

  const resultItems = [
    { label: 'Saldo Mensal', value: formatCurrency(results.saldoMensal) },
    { label: 'Limite Diário Ideal', value: formatCurrency(results.limiteDiario) },
    { label: 'Views por Dia', value: formatNumber(results.viewsPorDia) },
    { label: 'Views por Mês', value: formatNumber(results.viewsPorMes) },
  ];

  resultItems.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, 90, yPos);
    yPos += 8;
  });

  // Analysis section with humanized text
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Resumo da Análise', 20, yPos);

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);

  const clientName = data.nomeCliente || 'o cliente';
  const viewsPorDiaInt = formatNumber(results.viewsPorDia);
  const viewsPorMesInt = formatNumber(results.viewsPorMes);
  
  const analysisText = `Olá! Com base nas informações fornecidas, preparamos uma análise personalizada para ${clientName}.

O investimento total de ${saldoTotalFormatted}, distribuído ao longo de ${tempoContratoFormatted} meses, resulta em um saldo mensal de ${formatCurrency(results.saldoMensal)}. Para garantir uma entrega consistente e otimizada, recomendamos um limite diário de ${formatCurrency(results.limiteDiario)}, considerando ${diasUteisFormatted} dias úteis por mês.

Com essa configuração, a campanha pode alcançar aproximadamente ${viewsPorDiaInt} views por dia, totalizando cerca de ${viewsPorMesInt} views por mês. Essa distribuição equilibrada assegura uma exposição constante da marca, maximizando o retorno sobre o investimento.

Mantendo essa estratégia, a campanha será plenamente atendida, com entrega consistente durante todo o período contratado.`;

  const splitText = doc.splitTextToSize(analysisText, pageWidth - 45);
  doc.text(splitText, 25, yPos);
  
  yPos += splitText.length * 4.5 + 15;

  // Check if we need a new page for the simulation table
  if (yPos > 200) {
    doc.addPage();
    yPos = 30;
  }

  // Simulation table
  yPos = generateSimulationTable(doc, results.limiteDiario, cpvValue, yPos, pageWidth);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Documento gerado automaticamente pela Calculadora de Mídia ADS', pageWidth / 2, footerY, { align: 'center' });

  doc.save(`relatorio-media-diaria-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateViewsPDF = async (data: ViewsData, results: ViewsResults) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Parse CPV for simulation
  const cpvValue = parseInputNumber(data.cpv) || 0.8;
  
  // Load and add logo
  try {
    const img = await loadImage(logoAds);
    doc.addImage(img, 'PNG', 20, 15, 30, 15);
  } catch (e) {
    console.log('Could not load logo');
  }

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Relatório da Calculadora de Mídia ADS', pageWidth / 2, 45, { align: 'center' });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Cálculo pelas Views', pageWidth / 2, 55, { align: 'center' });

  // Date
  doc.setFontSize(10);
  doc.text(`Gerado em: ${formatDate()}`, pageWidth / 2, 63, { align: 'center' });

  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 70, pageWidth - 20, 70);

  // Info section
  let yPos = 85;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Informações Inseridas', 20, yPos);

  yPos += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);

  // Format input values with thousand separators
  const viewsPorMesInput = parseInputNumber(data.viewsPorMes);
  const viewsPorMesFormatted = formatNumber(viewsPorMesInput);
  const diasUteisFormatted = formatNumber(parseInt(data.diasUteis) || 0);
  const tempoContratoFormatted = formatNumber(parseInt(data.tempoContrato) || 0);

  const infoItems = [
    { label: 'Nome do Cliente', value: data.nomeCliente || 'Não informado' },
    { label: 'Views por Mês Desejadas', value: viewsPorMesFormatted },
    { label: 'Dias Úteis por Mês', value: `${diasUteisFormatted} dias` },
    { label: 'Custo por View (CPV)', value: `R$ ${data.cpv || '0,00'}` },
    { label: 'Custo por Clique (CPC)', value: `R$ ${data.cpc || '0,00'}` },
    { label: 'Taxa de Clique (CTR)', value: `${data.ctr || '0'}%` },
    { label: 'Tempo de Contrato', value: `${tempoContratoFormatted} meses` },
  ];

  infoItems.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, 90, yPos);
    yPos += 8;
  });

  // Results section
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Resultados Calculados', 20, yPos);

  yPos += 12;
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);

  const resultItems = [
    { label: 'Views por Dia', value: formatNumber(results.viewsPorDia) },
    { label: 'Investimento Mensal', value: formatCurrency(results.investimentoMensal) },
    { label: 'Limite Diário Ideal', value: formatCurrency(results.limiteDiario) },
    { label: 'Saldo Total Necessário', value: formatCurrency(results.saldoTotal) },
  ];

  resultItems.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, 90, yPos);
    yPos += 8;
  });

  // Analysis section with humanized text
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('Resumo da Análise', 20, yPos);

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);

  const clientName = data.nomeCliente || 'o cliente';
  const viewsPorDiaInt = formatNumber(results.viewsPorDia);
  
  const analysisText = `Olá! Com base nas informações fornecidas, preparamos uma análise personalizada para ${clientName}.

Para alcançar a meta de ${viewsPorMesFormatted} views por mês, será necessário um investimento mensal de ${formatCurrency(results.investimentoMensal)}, considerando um CPV de R$ ${data.cpv || '0,00'}.

Distribuindo esse investimento em ${diasUteisFormatted} dias úteis, recomendamos um limite diário de ${formatCurrency(results.limiteDiario)}, o que deve gerar aproximadamente ${viewsPorDiaInt} views por dia.

Para um contrato de ${tempoContratoFormatted} meses, o investimento total necessário é de ${formatCurrency(results.saldoTotal)}. Essa configuração permite atingir os objetivos de visibilidade de forma consistente e eficiente, garantindo que a campanha seja plenamente atendida durante todo o período.`;

  const splitText = doc.splitTextToSize(analysisText, pageWidth - 45);
  doc.text(splitText, 25, yPos);
  
  yPos += splitText.length * 4.5 + 15;

  // Check if we need a new page for the simulation table
  if (yPos > 200) {
    doc.addPage();
    yPos = 30;
  }

  // Simulation table
  yPos = generateSimulationTable(doc, results.limiteDiario, cpvValue, yPos, pageWidth);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Documento gerado automaticamente pela Calculadora de Mídia ADS', pageWidth / 2, footerY, { align: 'center' });

  doc.save(`relatorio-views-${new Date().toISOString().split('T')[0]}.pdf`);
};

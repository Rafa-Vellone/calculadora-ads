import { useState } from "react";
import InputField from "./InputField";
import ResultCard from "./ResultCard";
import { FileDown } from "lucide-react";
import { generateMediaDiariaPDF } from "@/utils/pdfGenerator";

export interface MediaDiariaData {
  nomeCliente: string;
  saldoTotal: string;
  tempoContrato: string;
  diasUteis: string;
  cpv: string;
  cpc: string;
  ctr: string;
}

export interface MediaDiariaResults {
  saldoMensal: number;
  limiteDiario: number;
  viewsPorDia: number;
  viewsPorMes: number;
}

interface MediaDiariaFormProps {
  data: MediaDiariaData;
  setData: (data: MediaDiariaData) => void;
  results: MediaDiariaResults | null;
  setResults: (results: MediaDiariaResults | null) => void;
}

const MediaDiariaForm = ({ data, setData, results, setResults }: MediaDiariaFormProps) => {
  const [showResults, setShowResults] = useState(!!results);

  const handleChange = (field: keyof MediaDiariaData, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleCalculate = () => {
    const saldoTotal = parseFloat(data.saldoTotal.replace(/\./g, '').replace(',', '.')) || 0;
    const tempoContrato = parseFloat(data.tempoContrato.replace(',', '.')) || 1;
    const diasUteis = parseFloat(data.diasUteis.replace(',', '.')) || 1;
    const cpv = parseFloat(data.cpv.replace(',', '.')) || 1;

    // Cálculos com precisão total (sem arredondamento)
    const saldoMensal = saldoTotal / tempoContrato;
    const limiteDiario = saldoMensal / diasUteis;
    const viewsPorDia = limiteDiario / cpv;
    const viewsPorMes = viewsPorDia * diasUteis;

    setResults({
      saldoMensal,
      limiteDiario,
      viewsPorDia,
      viewsPorMes,
    });
    setShowResults(true);
  };

  const handleClear = () => {
    setData({
      nomeCliente: '',
      saldoTotal: '',
      tempoContrato: '',
      diasUteis: '',
      cpv: '',
      cpc: '',
      ctr: '',
    });
    setResults(null);
    setShowResults(false);
  };

  const handleGeneratePDF = () => {
    if (results) {
      generateMediaDiariaPDF(data, results);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatNumber = (value: number) => {
    return Math.round(value).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-8">
      <div className="card-custom">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Informações do Contrato
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Nome do Cliente"
            value={data.nomeCliente}
            onChange={(v) => handleChange('nomeCliente', v)}
            placeholder="Ex: Empresa ABC"
            info="opcional"
          />
          <InputField
            label="Saldo Total Contratado"
            value={data.saldoTotal}
            onChange={(v) => handleChange('saldoTotal', v)}
            placeholder="Ex: 15.000,00"
            prefix="R$"
          />
          <InputField
            label="Tempo de Contrato"
            value={data.tempoContrato}
            onChange={(v) => handleChange('tempoContrato', v)}
            placeholder="Ex: 6"
            suffix="meses"
          />
          <InputField
            label="Dias Úteis do Mês"
            value={data.diasUteis}
            onChange={(v) => handleChange('diasUteis', v)}
            placeholder="Ex: 22"
            suffix="dias"
          />
          <InputField
            label="Custo por View (CPV)"
            value={data.cpv}
            onChange={(v) => handleChange('cpv', v)}
            placeholder="Ex: 0,8"
            prefix="R$"
          />
          <InputField
            label="Custo por Clique (CPC)"
            value={data.cpc}
            onChange={(v) => handleChange('cpc', v)}
            placeholder="Ex: 0,8"
            prefix="R$"
            info="informativo"
          />
          <InputField
            label="Taxa de Clique (CTR)"
            value={data.ctr}
            onChange={(v) => handleChange('ctr', v)}
            placeholder="Ex: 0,28"
            suffix="%"
            info="informativo"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <button onClick={handleCalculate} className="btn-gradient">
            Calcular
          </button>
          <button onClick={handleClear} className="btn-outline">
            Limpar
          </button>
          {showResults && results && (
            <button onClick={handleGeneratePDF} className="btn-secondary flex items-center gap-2">
              <FileDown size={18} />
              Gerar PDF
            </button>
          )}
        </div>
      </div>

      {showResults && results && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Resultados Calculados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard 
              label="Saldo Mensal" 
              value={formatCurrency(results.saldoMensal)} 
              delay={0}
            />
            <ResultCard 
              label="Limite Diário Ideal" 
              value={formatCurrency(results.limiteDiario)} 
              delay={100}
            />
            <ResultCard 
              label="Views por Dia" 
              value={formatNumber(results.viewsPorDia)} 
              delay={200}
            />
            <ResultCard 
              label="Views por Mês" 
              value={formatNumber(results.viewsPorMes)} 
              delay={300}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDiariaForm;

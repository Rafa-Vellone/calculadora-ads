import { useState } from "react";
import InputField from "./InputField";
import ResultCard from "./ResultCard";
import { FileDown } from "lucide-react";
import { generateViewsPDF } from "@/utils/pdfGenerator";

export interface ViewsData {
  nomeCliente: string;
  viewsPorMes: string;
  diasUteis: string;
  cpv: string;
  cpc: string;
  ctr: string;
  tempoContrato: string;
}

export interface ViewsResults {
  viewsPorDia: number;
  investimentoMensal: number;
  limiteDiario: number;
  saldoTotal: number;
}

interface ViewsFormProps {
  data: ViewsData;
  setData: (data: ViewsData) => void;
  results: ViewsResults | null;
  setResults: (results: ViewsResults | null) => void;
}

const ViewsForm = ({ data, setData, results, setResults }: ViewsFormProps) => {
  const [showResults, setShowResults] = useState(!!results);

  const handleChange = (field: keyof ViewsData, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleCalculate = () => {
    const viewsMes = parseFloat(data.viewsPorMes.replace(/\./g, '').replace(',', '.')) || 0;
    const diasUteis = parseFloat(data.diasUteis.replace(',', '.')) || 1;
    const cpv = parseFloat(data.cpv.replace(',', '.')) || 1;
    const tempoContrato = parseFloat(data.tempoContrato.replace(',', '.')) || 1;

    // Cálculos com precisão total (sem arredondamento)
    const viewsPorDia = viewsMes / diasUteis;
    const investimentoMensal = viewsMes * cpv;
    const limiteDiario = investimentoMensal / diasUteis;
    const saldoTotal = investimentoMensal * tempoContrato;

    setResults({
      viewsPorDia,
      investimentoMensal,
      limiteDiario,
      saldoTotal,
    });
    setShowResults(true);
  };

  const handleClear = () => {
    setData({
      nomeCliente: '',
      viewsPorMes: '',
      diasUteis: '',
      cpv: '',
      cpc: '',
      ctr: '',
      tempoContrato: '',
    });
    setResults(null);
    setShowResults(false);
  };

  const handleGeneratePDF = () => {
    if (results) {
      generateViewsPDF(data, results);
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
          Informações de Views
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
            label="Views por Mês Desejadas"
            value={data.viewsPorMes}
            onChange={(v) => handleChange('viewsPorMes', v)}
            placeholder="Ex: 100.000"
          />
          <InputField
            label="Tempo de Contrato"
            value={data.tempoContrato}
            onChange={(v) => handleChange('tempoContrato', v)}
            placeholder="Ex: 6"
            suffix="meses"
          />
          <InputField
            label="Dias Úteis por Mês"
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
              label="Views por Dia" 
              value={formatNumber(results.viewsPorDia)} 
              delay={0}
            />
            <ResultCard 
              label="Investimento Mensal" 
              value={formatCurrency(results.investimentoMensal)} 
              delay={100}
            />
            <ResultCard 
              label="Limite Diário Ideal" 
              value={formatCurrency(results.limiteDiario)} 
              delay={200}
            />
            <ResultCard 
              label="Saldo Total Necessário" 
              value={formatCurrency(results.saldoTotal)} 
              delay={300}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewsForm;

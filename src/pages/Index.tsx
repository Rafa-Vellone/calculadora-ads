import { useState } from "react";
import Header from "@/components/Header";
import TabSelector from "@/components/TabSelector";
import MediaDiariaForm, { MediaDiariaData, MediaDiariaResults } from "@/components/MediaDiariaForm";
import ViewsForm, { ViewsData, ViewsResults } from "@/components/ViewsForm";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'media-diaria' | 'views'>('media-diaria');
  
  // State for Média Diária tab
  const [mediaDiariaData, setMediaDiariaData] = useState<MediaDiariaData>({
    nomeCliente: '',
    saldoTotal: '',
    tempoContrato: '',
    diasUteis: '',
    cpv: '',
    cpc: '',
    ctr: '',
  });
  const [mediaDiariaResults, setMediaDiariaResults] = useState<MediaDiariaResults | null>(null);
  
  // State for Views tab
  const [viewsData, setViewsData] = useState<ViewsData>({
    nomeCliente: '',
    viewsPorMes: '',
    diasUteis: '',
    cpv: '',
    cpc: '',
    ctr: '',
    tempoContrato: '',
  });
  const [viewsResults, setViewsResults] = useState<ViewsResults | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="space-y-8">
          <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="animate-fade-in">
            {activeTab === 'media-diaria' ? (
              <MediaDiariaForm
                data={mediaDiariaData}
                setData={setMediaDiariaData}
                results={mediaDiariaResults}
                setResults={setMediaDiariaResults}
              />
            ) : (
              <ViewsForm
                data={viewsData}
                setData={setViewsData}
                results={viewsResults}
                setResults={setViewsResults}
              />
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>© {new Date().getFullYear()} Calculadora de Mídia Ads. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;

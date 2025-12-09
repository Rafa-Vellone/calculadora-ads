interface TabSelectorProps {
  activeTab: 'media-diaria' | 'views';
  onTabChange: (tab: 'media-diaria' | 'views') => void;
}

const TabSelector = ({ activeTab, onTabChange }: TabSelectorProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-muted rounded-2xl">
      <button
        onClick={() => onTabChange('media-diaria')}
        className={`tab-button flex-1 ${activeTab === 'media-diaria' ? 'active' : ''}`}
      >
        Cálculo pela Média Diária
      </button>
      <button
        onClick={() => onTabChange('views')}
        className={`tab-button flex-1 ${activeTab === 'views' ? 'active' : ''}`}
      >
        Cálculo pelas Views
      </button>
    </div>
  );
};

export default TabSelector;

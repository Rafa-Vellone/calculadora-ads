import logoAds from "@/assets/logo-ads.png";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <img 
          src={logoAds} 
          alt="Ads Logo" 
          className="h-10 md:h-12 w-auto"
        />
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          Calculadora de Mídia Ads
        </h1>
      </div>
    </header>
  );
};

export default Header;

# Calculadora de Mídia ADS

Este projeto é uma calculadora interativa para planejamento de investimentos em mídia dentro da plataforma de anúncios (ADS).  
Ele ajuda a definir limites diários ideais, estimar views e entender quanto investir para alcançar determinadas metas.

## Funcionalidades

- Duas abas de cálculo:
  - **Cálculo pela média diária**: você informa o saldo total contratado, tempo de contrato, dias úteis e custo por view (CPV), e o sistema calcula:
    - Saldo mensal
    - Limite diário ideal
    - Views por dia
    - Views por mês
  - **Cálculo pelas views desejadas**: você informa quantas views deseja atingir por mês, o CPV, dias úteis e tempo de contrato, e o sistema calcula:
    - Views por dia
    - Investimento mensal necessário
    - Limite diário ideal
    - Saldo total necessário para o período

- **Geração de PDF** com resumo amigável dos resultados de cada aba.
- **Simulação de até 6 anúncios** mostrando:
  - Quanto investir por anúncio por dia
  - Quantidade estimada de views por anúncio

> Importante: os valores apresentados nas simulações são estimativas baseadas nos parâmetros informados.  
> Eles não garantem o resultado exato das campanhas, mas servem como apoio para planejamento e tomada de decisão.

## Tecnologias utilizadas

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- jsPDF para geração dos relatórios em PDF

## Como rodar o projeto

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Execute o ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

3. Abra o navegador no endereço indicado pelo Vite (por padrão, algo como `http://localhost:5173` ou `http://localhost:8080`).

## Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

E, se quiser testar o build localmente:

```bash
npm run preview
```

---

Este repositório foi adaptado e personalizado para uso como **Calculadora de Mídia ADS**, sem qualquer vínculo com outras ferramentas de geração de código.

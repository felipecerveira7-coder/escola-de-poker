# Escola de Poker — guia para o Claude

Simulador de carreira e vida de um jogador de poker (Texas Hold'em), em português do Brasil.
Hoje é um único arquivo: `index.html` (~670 KB, HTML + CSS + JS sem build).
Publicado como artifact do claude.ai (slug `14444a5e-58ec-43d9-b1dd-71800b67264c`).

## Como o código está organizado

Tudo vive dentro do `<script>` de `index.html`, em objetos globais:

| Objeto | O que faz |
|---|---|
| `Table` (`CASH`, `TOUR`) | Mesa de poker: motor de mãos, bots, chat da mesa, render da mesa |
| `LIVES` | Bots do circuito: vida, dinheiro, humor, tilt, relações, diário |
| `LIFE` | O jogador: fama, energia, humor, casa, carros, itens, patrocínios, celular |
| `WALLET` | Carteira e extrato |
| `CAL` | Agenda e calendário: eventos, inscrição, avanço de dias |
| `CLK` | Relógio do dia (ações gastam horas; 9h–2h) |
| `SOC`, `RK`, `MIS`, `RETRO` | Social, ranking, missões, carreira retroativa |
| `LOVE`, `DATE`, `MATCH`, `PAV` | Namoro: encontros, cena interativa com IA, app de namoro, avatares de perfis |
| `FAM`, `GIFT` | Família e presentes |
| `OUTX`, `FR` | Sair com amigos, níveis de amizade, convites, aniversários |
| `SPX` | Verba de buy-ins e pedidos dos patrocinadores |
| `LEG`, `TROPH` | Lendas (heads-up) e troféus/Hall da Fama/selos |
| `PRESS`, `FEED`, `LIVEX` | Coletivas, feed das redes, lives |
| `INV` | Investimentos (aluguel, negócios, renda fixa) |
| `HOL` | Datas comemorativas |
| `ONL` | Cash online (apelidos, rakeback) |
| `OUT`, `AV` | Closet (looks mesa/rolê) e avatar SVG do jogador |
| `HUD`, `VG`, `HOJE`, `TOAST` | Interface: barra fixa, abas agrupadas, tela Hoje, avisos |
| `AIX` | Chamadas à IA (`window.claude`), sempre com fallback sem IA |

A pasta `modules/` tem as fontes dos módulos mais novos **como referência** (já estão embutidos no `index.html`).

## Padrões

- Persistência: `window.claude.use('db')` com espelho em `localStorage`; nunca gravar antes de `*.ready`.
- Mudanças antigas foram feitas por "patches" de string exata + wrappers (`const _x=OBJ.fn;OBJ.fn=function(){...}`).
- Toda chamada de IA tem resposta de reserva sem IA.
- Prompts de IA usam a constante `SARC` (entender ironia/sarcasmo).
- Textos para o usuário em português do Brasil, tom direto.

## Testes

```
npm install
npx playwright install chromium
npm test
```
Cada arquivo em `tests/` abre o `index.html` num celular simulado (390×860) e imprime `errors []` quando tudo passa.

## Próximos passos sugeridos (migração)

1. Separar o `<script>` em módulos ES (`src/*.js`) com um build (Vite) que gere de novo um único `index.html`.
2. Trocar os wrappers em cadeia por chamadas diretas nos módulos.
3. Mesa em canvas/PixiJS com animações de fichas e cartas.
4. PWA (instalável e offline).

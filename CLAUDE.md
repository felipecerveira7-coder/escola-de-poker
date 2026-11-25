# Escola de Poker — guia para o Claude

Simulador de carreira e vida de um jogador de poker (Texas Hold'em), em português do Brasil.
O código-fonte fica em `src/`; `npm run build` junta tudo num único `index.html` (~670 KB), que é o arquivo publicado.
Publicado como artifact do claude.ai (slug `14444a5e-58ec-43d9-b1dd-71800b67264c`).

## Como o código está organizado

- `src/head.html`, `src/styles.css`, `src/body.html`, `src/tail.html`: partes fixas da página.
- `src/js/NNN-nome.js`: o script em partes, concatenadas em ordem numérica (é um único escopo global, não são módulos ES).
- `tools/build.js`: gera `index.html`. **Edite sempre em `src/` e rode o build**; nunca edite `index.html` à mão.
- Para uma parte nova, crie `src/js/NNN-nome.js` com o número na posição em que ela precisa rodar.

Os objetos globais:

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
| `FACE` | Avatares ilustrados em SVG (bots, família, lendas, par, perfis, jogador) com expressões: feliz, neutro, triste, tilt, cansado, confiante |
| `CHIPFX` | Fichas voando na mesa (apostas pro pote, pote pro vencedor) |
| `ARENA` | Mesa em tela cheia: cenário por lugar, mesa inclinada em 3D, cartas voando/virando, anel de tempo, chance de vitória no all-in, river em suspense |
| `SFX` | Sons sintetizados com Web Audio (cartas, fichas, check, plateia, ambiente por lugar); mudo salvo em `localStorage` |
| `CITY` | Mapa ilustrado da cidade que substitui as abas da Vida (céu muda com a hora); `≡ Abas` volta ao modo antigo |
| `NOTEGO`, `WEEK` | Notificação tocável leva ao assunto; faixa "Próximos dias" na tela inicial |
| `BIG`, `bigPanel`, `fieldFill` | Torneios grandes: Main Event Nacional (4x/ano, ~R$ 1 mi), Campeonato Latino (abril, ~R$ 3 mi), Mundial em Las Vegas (julho, 1º leva R$ 20 mi); campos de 108 completados com jogadores de fora; satélites; painel "Os grandes do ano" na Agenda |
| `NAV` | Histórico de navegação; botão ‹ Voltar na barra do topo |
| `dayTaken`, `regRefund` | Não deixa se inscrever no torneio de hoje se o dia já foi usado; inscrição que não deu pra jogar por dia ocupado é devolvida sem falta |
| `tStartH`, `tLate`, `ITEMH`, `dayDid` | Dia medido em horas e energia: cada torneio tem horário (inscrição tardia de 2–3h), cada atividade gasta horas; não existe mais "uma coisa por dia" (`A.used` é só registro). Inscrito que chega atrasado entra com fichas blindadas (`lateFactor`); `tourAlarm` avisa quando o relógio passa da hora; `tourClash` avisa antes do encontro |
| `DSC` | Cenário desenhado, clima pra IA, ações e sugestões próprias de cada lugar do encontro; `DATE.fade` ("Apagar a luz": corte de cena, nada explícito) |
| `TELL` | Leitura do tempo do jogador: guarda o tempo de cada decisão, aprende no showdown se demora = forte ou fraco (`LIVES.s.htell`); bots atentos usam o histórico, casuais acreditam no clichê "demorou = fraco" |
| `IGRP`, `ICAP`, `softCap`, `itemPanel` | Efeito dos itens: itens do mesmo tipo não somam (só o melhor), acima do limite rendem 1/4 (máx. 1,5x), óculos só valem no look da mesa, loja avisa quando um item não rende, painel no perfil |
| `WEARFX`, `clFx`, `ifxNew` | Itens v66 (mente, estudo, grind online, viagem, roupas) com efeitos novos: `calm` (desgaste −%), `tcard` (cartões de tempo), `trav` (viagem/jet lag), `rbk` (rakeback), `study` (treino em dobro); closet mostra o que cada peça rende no look e sempre |
| `PEND` | 📱 do topo leva direto ao próximo pendente (notificações → namoro → conversas não lidas → entrevista); faixa "Ainda falta ver" no celular |
| `LIVE_BB`, `liveLevels`, `stTxt`, `kf` | Fichas realistas (v68): clube turbo 15 mil, sábado 30 mil, domingo/Main/etapa 40 mil (estilo BSOP), Nacional/Latino 100 mil (300/600), Mundial 60 mil (estilo WSOP), todos com ante do BB; `kf` abrevia fichas na mesa (152,4k · 1,25M); agenda mostra o stack |
| `CINE` | Momentos de cinema: heads-up, mesa final, campeão com confete, manchete do jornal, eliminação, notificação de mensagem |

A pasta `modules/` é histórica (fontes avulsas de versões antigas); a fonte de verdade é `src/`.

## Onde fica cada coisa (não duplicar)

- Barra do topo (`HUD`): saldo, energia, humor, hora. Avatar abre o perfil (com Closet); 📱 leva ao próximo pendente (`PEND`).
- Tela inicial da Vida: botões de avançar o dia, mapa da cidade, próximos dias, "Pra fazer agora".
- Cada lugar do mapa abre uma aba; amigos/contatos ficam em `amigos`, home game junto da casa.
- Antes de mostrar uma informação nova, veja se ela já existe em outro lugar.

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
npm test        # roda o build e depois os testes
```
Cada arquivo em `tests/` abre o `index.html` num celular simulado (390×860) e imprime `errors []` quando tudo passa.

## Próximos passos sugeridos (migração)

1. ~~Separar o script em partes com build~~ (feito na v57).
2. Trocar os wrappers em cadeia por chamadas diretas nas partes.
3. Mesa em canvas/WebGL (hoje: DOM + CSS 3D + `ARENA`/`CHIPFX`).
4. PWA completo com service worker (hoje só as meta tags de app no iPhone/Android).

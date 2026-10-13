# mglabs

Landing page da **mglabs**: site profissional no ar em 7 dias, a partir de R$ 697, com a primeira versão em 48 horas.

![mglabs — seu site no ar em 7 dias](public/og-image.png)

Site estático em HTML, CSS e JavaScript puro, sem framework e sem etapa de build. Você edita o arquivo e atualiza o navegador.

## Seções

| Seção | O que mostra |
|---|---|
| Hero | Oferta, CTAs para o WhatsApp e uma janela animada que monta o site com a linha do tempo Dia 1 → Dia 7 |
| Como funciona | Os 6 passos em cards, com os marcos (48h e publicado) em destaque |
| Sites que fiz pra clientes | Portfólio com galeria de prints: [HM2 Aviation](https://hm2aviation.com.br/) e [Moraes Luz Advocacia](https://moraesluzadv.com/) |
| Preço | O que está incluso, extras com preço fechado e as condições |
| Pra quem é | Perfis de cliente com destaque rotativo e painel de serviços extras |
| Atendimento | Atendimento nacional e internacional |
| Quem faz | Bio, foto e links do fundador |
| CTA final | Chamada para o WhatsApp |

## Rodando localmente

Não há dependências. Abra o `index.html` no navegador ou, para testar como se estivesse publicado, sirva a pasta:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

```
index.html            página única (todo o conteúdo)
style.css             estilos, organizados por seção
main.js               efeitos: entrada por scroll, destaque rotativo, brilho no cursor, barra de leitura
public/
  favicon.ico, favicon-32.png, apple-touch-icon.png, icon-192/512.png, site.webmanifest
  logo-mglabs.png     logo do menu e do rodapé (fundo transparente)
  mark-mglabs.png     símbolo </> usado no CTA final
  og-image.png        imagem que aparece ao compartilhar o link (1200×630)
  projetos/           prints otimizados do portfólio (.webp)
  mg/                 retrato do "Quem faz"
  project */          prints originais dos projetos (fonte)
```

Os arquivos grandes (`logomglabs.png`, `faviconmglabs.png`, `project */*.png`, `mg/mageMG1.png`) são os **originais**. O site usa apenas as versões otimizadas geradas a partir deles.

## Editando o conteúdo

**Cores e fontes.** Ficam no `:root` do `style.css`. A cor da marca é definida por `--primary`, `--primary-hover` e `--primary-rgb`. As fontes são Space Grotesk (títulos) e Inter (texto), carregadas do Google Fonts.

**Preço.** O valor aparece em vários lugares. Procure por `697` no `index.html`: título da aba, descrição, botão do menu, hero, seção de preço e faixa do "Como funciona". A `public/og-image.png` também traz o preço dentro da imagem e precisa ser gerada de novo.

**WhatsApp.** Todos os botões usam `https://wa.me/5562981330312?text=…`, com a mensagem já preenchida (codificada para URL).

**Projetos do portfólio.** Cada projeto é um `<article class="obra">` dentro de `#trabalhos`, com um print principal e dois de detalhe. Para adicionar um projeto:

1. Converta os prints para WebP: 1600 px de largura para o principal e 900 px para os detalhes.
   ```bash
   cwebp -q 82 -resize 1600 0 print-principal.png -o public/projetos/projeto-1.webp
   cwebp -q 80 -resize 900 0 print-detalhe.png -o public/projetos/projeto-2.webp
   ```
2. Copie um `<article class="obra">` existente e troque textos, links e imagens. Para a imagem ficar do outro lado, use `obra obra-invertida`.

**Endereço na animação do hero.** Se trocar `seunegocio.com.br`, atualize também o `steps(17, end)` em `.lab-url-texto` no `style.css`. O 17 é o número de caracteres do endereço.

## Publicando

Por ser estático, funciona em qualquer hospedagem: GitHub Pages, Netlify, Vercel ou Cloudflare Pages.

**GitHub Pages:** Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.

Depois de definir o domínio, troque o `og:image` e o `twitter:image` no `<head>` por uma URL absoluta (ex.: `https://seudominio.com.br/public/og-image.png`). WhatsApp, LinkedIn e Facebook não leem caminho relativo.

## Desempenho e acessibilidade

- As animações usam `transform` e `opacity` e pausam quando saem da tela.
- Tudo respeita `prefers-reduced-motion`: quem pede menos movimento vê a página parada, com o estado final.
- Sem JavaScript, a página continua completa. Os efeitos só animam o que já está no HTML.
- Imagens em WebP com `loading="lazy"`, e logo e ícones com paleta reduzida.

## Contato

**Miguel Luz**, Founder & Product Designer.
[LinkedIn](https://www.linkedin.com/in/miguelluz19) · [Instagram](https://www.instagram.com/miiguel.luz/) · [WhatsApp](https://wa.me/5562981330312)

© 2026 mglabs. Todos os direitos reservados.

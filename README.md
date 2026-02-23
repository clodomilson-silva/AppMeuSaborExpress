<h1 align="center">
  🍔 Meu Sabor Express
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Expo-54.0-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green?style=for-the-badge" />
</p>

<p align="center">
  Aplicativo mobile de delivery para a lanchonete <strong>Meu Sabor Express</strong>, desenvolvido com React Native + Expo.
</p>

---

## 📱 Visão Geral

**Meu Sabor Express** é um app de delivery moderno com design escuro premium, desenvolvido para Android e iOS. Permite que clientes naveguem pelo cardápio, visualizem detalhes dos produtos com adicionais, e acompanhem seus pedidos com uma experiência fluida e responsiva.

## ✨ Funcionalidades

- 🏠 **Home** — Banner promocional, categorias em destaque e produtos mais pedidos
- 🍽️ **Cardápio** — Lista completa com busca e filtro por categoria em tempo real
- 🛒 **Carrinho** — Tela de carrinho (em desenvolvimento)  
- 📋 **Pedidos** — Histórico de pedidos com status atualizado
- 👤 **Perfil** — Dados do usuário, endereços, pagamento e configurações
- 📦 **Detalhe do Produto** — Imagem hero, adicionais selecionáveis, observações e controle de quantidade

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0 | Plataforma e ferramentas |
| TypeScript | ~5.9 | Tipagem estática |
| React Navigation | 7.x | Navegação entre telas |
| Bottom Tabs | 7.x | Barra de navegação inferior |
| Native Stack | 7.x | Stack de telas |
| Safe Area Context | ^5.6 | Insets de área segura |
| Expo Vector Icons | ^15 | Ícones Ionicons |

## 📁 Estrutura do Projeto

```
AppMeuSabor/
├── App.tsx                    # Ponto de entrada com SafeAreaProvider
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── AddonItem.tsx      # Item de adicional selecionável
│   │   ├── CategoryFilter.tsx # Filtro de categorias (pills horizontais)
│   │   ├── CategoryItem.tsx   # Ícone de categoria circular
│   │   ├── ProductCardLarge.tsx # Card de produto (grid)
│   │   ├── ProductCardSmall.tsx # Card de produto (lista)
│   │   ├── PromoBanner.tsx    # Banner de promoção
│   │   └── SearchBar.tsx      # Barra de busca
│   ├── data/                  # Dados mockados
│   │   ├── categories.ts      # Lista de categorias
│   │   └── products.ts        # Lista de produtos com adicionais
│   ├── navigation/            # Configuração de rotas
│   │   ├── AppNavigator.tsx   # Stack navigator principal
│   │   └── TabNavigator.tsx   # Tab navigator com safe area
│   ├── screens/               # Telas da aplicação
│   │   ├── HomeScreen.tsx
│   │   ├── CardapioScreen.tsx
│   │   ├── CarrinhoScreen.tsx
│   │   ├── PedidosScreen.tsx
│   │   ├── PerfilScreen.tsx
│   │   └── ProductDetailScreen.tsx
│   └── theme/
│       └── index.ts           # Tokens de design (cores, fontes, espaçamentos)
└── package.json
```

## 🎨 Design System

O app utiliza um tema escuro premium com tokens centralizados em `src/theme/index.ts`:

- **Cor primária:** `#E8500A` (laranja vibrante)
- **Background:** `#141414` (escuro profundo)
- **Cards:** `#1E1E1E`
- **Tipografia:** Pesos de 400 a 800, tamanhos de 11px a 30px
- **Responsividade:** Todos os espaçamentos e alturas respeitam os insets do dispositivo via `useSafeAreaInsets()`

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Instalação

```bash
# Clone o repositório
git clone git@github.com:clodomilson-silva/AppMeuSaborExpress.git
cd AppMeuSaborExpress

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npx expo start
```

Escaneie o QR Code com o Expo Go para abrir o app no seu dispositivo.

### Scripts Disponíveis

```bash
npm start          # Inicia o servidor Metro
npm run android    # Abre no Android
npm run ios        # Abre no iOS
npm run web        # Abre no navegador
```

## 📱 Compatibilidade

| Plataforma | Suporte |
|---|---|
| Android | ✅ Android 9+ |
| iOS | ✅ iOS 13+ |
| Web | ✅ (experimental) |

> **Nota:** Testado com Expo Go no Samsung Galaxy A15 e emulador Android API 36.

## 🗺️ Roadmap

- [ ] Integração com backend / API REST
- [ ] Autenticação de usuário (login/cadastro)
- [ ] Carrinho funcional com persistência
- [ ] Pagamento integrado
- [ ] Rastreamento de pedido em tempo real
- [ ] Push notifications
- [ ] Tema claro/escuro

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido com ❤️ por <a href="https://github.com/clodomilson-silva">Clodomilson Silva</a>
</p>

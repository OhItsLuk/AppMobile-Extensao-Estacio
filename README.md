Projeto de Extensão — Aplicativo Mobile para Microempreendedores

Este repositório contém o aplicativo mobile desenvolvido como parte de um Projeto de Extensão Universitária, com o objetivo de apoiar o microempreendedorismo local. Através do app, microempreendedores têm acesso a uma ferramenta prática e acessível para gestão e controle de seus negócios.

🚀 Tecnologias Utilizadas

Back-end (API):

- .NET 8.0
- AutoMapper
- FluentValidation
- DTOs

Front-end (Mobile):

- React Native com Expo
- Axios
- Tailwind CSS

Banco de Dados:

- PostgreSQL

📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- Node.js (versão 18 ou superior)
- Android Studio
- Java Development Kit (JDK)
- Git

⚙️ Configuração do Ambiente

1. Configuração do Android Studio

1. Baixe e instale o Android Studio
1. Abra o Android Studio e vá em Tools > AVD Manager
1. Clique em Create Virtual Device
1. Escolha um dispositivo (recomendado: Pixel 4 ou superior)
1. Selecione uma imagem do sistema (recomendado: API 30 ou superior)
1. Finalize a criação do emulador

1. Configuração das Variáveis de Ambiente

Adicione as seguintes variáveis ao seu PATH:

Windows:

```bash
# Adicione ao PATH do sistema
%LOCALAPPDATA%\Android\Sdk\emulator
%LOCALAPPDATA%\Android\Sdk\tools
%LOCALAPPDATA%\Android\Sdk\tools\bin
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

macOS/Linux:

```bash
# Adicione ao ~/.bashrc ou ~/.zshrc
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/tools
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

🚀 Executando o Projeto

1. Clone o repositório

```bash
git clone https://github.com/OhItsLuk/AppMobile-Extensao-Estacio.git
cd AppMobile-Extensao-Estacio
```

2. Instale as dependências

```bash
npm install
```

3. Inicie o emulador Android

Abra o Android Studio e inicie o emulador criado anteriormente, ou execute via linha de comando:

```bash
# Liste os emuladores disponíveis
emulator -list-avds

# Inicie um emulador específico
emulator -avd NOME_DO_SEU_EMULADOR
```

4. Configure a API (Backend)

Importante: O projeto está configurado para se conectar com uma API local. Certifique-se de que:

1. O backend esteja executando na porta 5136
2. A API esteja configurada para aceitar conexões HTTP (não HTTPS) em ambiente de desenvolvimento
3. O arquivo src/config/apiConfig.ts está configurado corretamente:

```typescript
// Para emulador Android Studio
const API_BASE_URL = "http://10.0.2.2:5136";

// Para dispositivo físico (substitua pelo IP real da máquina)
// const API_BASE_URL = 'http://192.168.1.XXX:5136';
```

5. Execute o projeto

```bash
npm start
# ou
npx expo start
```

6. Conecte ao emulador

Após executar o comando acima:

1. Pressione 'a' no terminal para abrir no Android
2. Ou escaneie o QR Code com o aplicativo Expo Go (se usando dispositivo físico)

📱 Funcionalidades

- Sistema de Login: Autenticação de usuários
- Controle de Estoque: Gestão completa de produtos
- Listagem de Produtos: Visualização com indicadores de estoque baixo
- Cadastro de Produtos: Formulário para adicionar novos itens
- Edição de Quantidades: Atualização rápida via modal
- Dados de Exemplo: Produtos pré-cadastrados para demonstração

🔗 Links Importantes

📲 Repositório do App Mobile:
[AppMobile-Extensao-Estacio](https://github.com/OhItsLuk/AppMobile-API/)

📝 Roteiro de Extensão:
[Clique para acessar](https://liveestacio-my.sharepoint.com/:w:/g/personal/202303956932_alunos_estacio_br/EfjGNx3v5pJJrV7F9dYBuAEBw5zyNMkZqtBN5HPv0qAT_w?e=LkPnfz)

📄 Carta de Apresentação:
[Clique para acessar](https://liveestacio-my.sharepoint.com/:w:/g/personal/202303956932_alunos_estacio_br/Eb_sR-6qagRCnPlI8hN6X2sBBgL4BDVXdkSnNtqeiWKJ-Q?e=ccAdW8)

👨‍💻 Equipe dos Alunos Desenvolvedores

- Bruno Leitão — RA: 202303956923
- Emmanuel Bragança — RA: 202303233388
- Luca Soares — RA: 202303921683

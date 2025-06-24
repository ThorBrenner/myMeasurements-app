# myMeasurements-app

Este projeto é um aplicativo completo para gerenciamento de medidas corporais, com um backend robusto para processamento de dados e um frontend intuitivo para interação do usuário. O objetivo principal é fornecer uma ferramenta para que os usuários possam acompanhar suas medidas de forma eficiente e visual.




## Backend

O backend do `myMeasurements-app` é construído em Python e utiliza machine learning para prever medidas corporais com base em imagens e dados físicos. As principais funcionalidades incluem:

- **Segmentação de Imagens:** Remove o fundo das imagens e cria máscaras corporais.
- **Predição de Medidas:** Utiliza o modelo BMNet para prever 14 medidas corporais.
- **API REST:** Interface HTTP para integração com o frontend.
- **Processamento de Imagens:** Pipeline completo de pré-processamento para as imagens.

### Tecnologias do Backend

- Python
- `torch` e `torchvision` para operações de machine learning.
- `fastapi` e `uvicorn` para a API REST.
- `pillow` para manipulação de imagens.
- `numpy` e `pandas` para manipulação de dados.
- `scikit-learn` para aprendizado de máquina.
- `opencv-python` para processamento de imagem.
- `rembg` para remoção de fundo de imagens.
- `python-dotenv` para gerenciamento de variáveis de ambiente.
- `pydantic` para validação de dados.
- `aiofiles` para operações assíncronas de arquivo.
- `passlib[bcrypt]`, `bcrypt` e `python-jose[cryptography]` para autenticação e segurança.
- `sqlalchemy` para ORM (Object-Relational Mapping).




## Frontend

O frontend do `myMeasurements-app` é desenvolvido com tecnologias web modernas para proporcionar uma experiência de usuário fluida e responsiva. Ele se integra com a API REST do backend para exibir as medidas corporais e permitir a interação do usuário.

### Tecnologias do Frontend

- TypeScript
- React (provável, dado o uso de `vite.config.ts` e `package.json`)
- Tailwind CSS (indicado por `tailwind.config.ts` e `postcss.config.js`)
- Vite (para build e desenvolvimento rápido)
- Bun (como gerenciador de pacotes, indicado por `bun.lockb`)

## Instalação

Para configurar e executar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

- Docker e Docker Compose (recomendado para ambiente de desenvolvimento)
- Python 3.x
- Node.js e Bun (para o frontend)

### Backend

1. Navegue até o diretório `Backend`:
   ```bash
   cd Backend
   ```
2. Crie um arquivo `.env` baseado no `.env.example` e configure suas variáveis de ambiente.
3. Instale as dependências do Python:
   ```bash
   pip install -r requirements.txt
   ```
4. Execute o servidor:
   ```bash
   python run_server.py
   ```
   Ou, se estiver usando Docker Compose:
   ```bash
   docker-compose up --build
   ```

### Frontend

1. Navegue até o diretório `Frontend`:
   ```bash
   cd Frontend
   ```
2. Instale as dependências do Node.js/Bun:
   ```bash
   bun install
   ```
3. Inicie o aplicativo de desenvolvimento:
   ```bash
   bun dev
   ```

## Uso

Após a instalação e execução do backend e frontend, acesse o aplicativo no seu navegador através do endereço configurado para o frontend (geralmente `http://localhost:8080` ou similar).

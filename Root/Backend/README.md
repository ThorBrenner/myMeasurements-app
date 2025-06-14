# Body Sim Learner AI - Backend

Backend Python para o aplicativo Body Sim Learner AI que utiliza machine learning para predizer medidas corporais baseado em imagens e dados físicos.

## Funcionalidades

- **Segmentação de Imagens**: Remove o fundo das imagens e cria máscaras corporais
- **Predição de Medidas**: Utiliza modelo BMnet para predizer 14 medidas corporais
- **API REST**: Interface HTTP para integração com frontend
- **Processamento de Imagens**: Pipeline completo de pré-processamento

## Medidas Preditas

O modelo prediz as seguintes 14 medidas corporais (em centímetros):

1. **ankle** - Circunferência do tornozelo
2. **arm-length** - Comprimento do braço
3. **bicep** - Circunferência do bíceps
4. **calf** - Circunferência da panturrilha
5. **chest** - Circunferência do peito
6. **forearm** - Circunferência do antebraço
7. **height** - Altura total
8. **hip** - Circunferência do quadril
9. **leg-length** - Comprimento da perna
10. **shoulder-breadth** - Largura dos ombros
11. **shoulder-to-crotch** - Distância ombro-virilha
12. **thigh** - Circunferência da coxa
13. **waist** - Circunferência da cintura
14. **wrist** - Circunferência do pulso

## Instalação

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd body-sim-learner-backend
```

2. **Instale as dependências**:
```bash
pip install -r requirements.txt
```

3. **Configure o ambiente**:
```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

4. **Adicione o modelo treinado**:
   - Coloque o arquivo `bmnet.pth` na pasta `models/`
   - Se não tiver o modelo, o sistema funcionará com predições dummy para testes

## Uso

### Iniciar o servidor

```bash
python run_server.py
```

O servidor estará disponível em `http://localhost:8000`

### Documentação da API

Acesse `http://localhost:8000/docs` para ver a documentação interativa da API.

### Endpoints Principais

#### POST /predict
Prediz medidas corporais baseado em imagem e dados físicos.

**Parâmetros**:
- `image`: Arquivo de imagem (JPG, PNG, etc.)
- `height`: Altura em centímetros
- `weight`: Peso em quilogramas

**Resposta**:
```json
{
  "success": true,
  "measurements": {
    "ankle": 23.5,
    "arm-length": 65.2,
    "bicep": 28.7,
    "calf": 35.1,
    "chest": 95.3,
    "forearm": 25.8,
    "height": 175.0,
    "hip": 98.2,
    "leg-length": 78.9,
    "shoulder-breadth": 42.1,
    "shoulder-to-crotch": 56.4,
    "thigh": 52.3,
    "waist": 82.7,
    "wrist": 16.9
  },
  "message": "Predição realizada com sucesso"
}
```

#### POST /segment
Testa apenas a segmentação de imagem.

#### GET /health
Verifica o status do servidor e modelo.

## Arquitetura

### Estrutura do Projeto

```
app/
├── __init__.py
├── main.py              # FastAPI app principal
├── core/
│   ├── __init__.py
│   └── config.py        # Configurações
├── models/
│   ├── __init__.py
│   ├── bmnet.py         # Modelo BMnet
│   └── schemas.py       # Schemas Pydantic
├── services/
│   ├── __init__.py
│   ├── image_service.py # Processamento de imagens
│   └── prediction_service.py # Predições ML
└── utils/
    ├── __init__.py
    └── validators.py    # Validações
```

### Pipeline de Processamento

1. **Recepção da Imagem**: Upload via API REST
2. **Segmentação**: Remoção de fundo usando rembg
3. **Criação de Máscara**: Silhueta branca em fundo preto
4. **Pré-processamento**: Redimensionamento e normalização
5. **Predição**: Modelo BMnet com imagem + altura/peso
6. **Pós-processamento**: Validação e ajustes dos resultados

### Modelo BMnet

O modelo utiliza:
- **Backbone**: MNASNet pré-treinado (congelado)
- **Entrada**: Imagem (224x224) + altura + peso
- **Saída**: 14 medidas corporais
- **Arquitetura**: Features visuais + dados físicos → FC layers → predições

## Desenvolvimento

### Estrutura de Dados

O modelo espera:
- **Imagens**: Máscaras corporais (silhuetas brancas em fundo preto)
- **Formato**: 224x224 pixels, 3 canais, normalizadas
- **Dados físicos**: Altura (cm) e peso (kg)

### Adicionando Novas Funcionalidades

1. **Novos endpoints**: Adicione em `app/main.py`
2. **Processamento de imagem**: Modifique `app/services/image_service.py`
3. **Lógica de predição**: Ajuste `app/services/prediction_service.py`
4. **Validações**: Adicione em `app/utils/validators.py`

### Testes

Para testar o sistema sem o modelo treinado, o serviço gera predições dummy baseadas em heurísticas simples usando altura, peso e IMC.

## Dependências Principais

- **FastAPI**: Framework web
- **PyTorch**: Machine learning
- **rembg**: Remoção de fundo
- **OpenCV**: Processamento de imagens
- **Pillow**: Manipulação de imagens
- **NumPy/Pandas**: Computação científica

## Notas de Produção

1. **Modelo**: Certifique-se de ter o arquivo `bmnet.pth` treinado
2. **GPU**: Configure CUDA para melhor performance
3. **CORS**: Ajuste as origens permitidas para produção
4. **Logs**: Configure logging apropriado
5. **Validação**: Implemente validações robustas de entrada
6. **Cache**: Considere cache para predições frequentes

## Troubleshooting

### Modelo não carrega
- Verifique se `models/bmnet.pth` existe
- Confirme compatibilidade da versão do PyTorch
- Verifique logs para erros específicos

### Erro de segmentação
- Instale rembg: `pip install rembg`
- Verifique formato da imagem de entrada
- Confirme que OpenCV está instalado corretamente

### Performance lenta
- Use GPU se disponível
- Otimize tamanho das imagens
- Considere batch processing para múltiplas predições
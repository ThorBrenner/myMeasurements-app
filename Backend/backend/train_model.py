import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
from torchvision.models import mnasnet1_0, MNASNet1_0_Weights
from torch.utils.data import DataLoader, Dataset
import pandas as pd
import os
from PIL import Image
import numpy as np

# Configurações
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BATCH_SIZE = 32
LEARNING_RATE = 1e-3
EPOCHS = 50

# Transformações das imagens
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


# Dataset personalizado para BodyM (versão simplificada)
class BodyMDataset(Dataset):
    def __init__(self, root_dir, split="train", transform=None):
        self.mask_dir = os.path.join(root_dir, split, "mask")
        self.metadata = pd.read_csv(os.path.join(root_dir, split, "hwg_metadata.csv"))
        self.measurements = pd.read_csv(os.path.join(root_dir, split, "measurements.csv"))
        self.photo_map = pd.read_csv(os.path.join(root_dir, split, "subject_to_photo_map.csv"),
                                     dtype={'photo_id': str})
        self.photo_map['photo_id'] = self.photo_map['photo_id'].str.strip().str.lower()
        self.transform = transform

        # Merge dos dados
        self.data = self.metadata.merge(
            self.measurements, on="subject_id"
        ).merge(
            self.photo_map, on="subject_id"
        )

        # Definir colunas de medições
        self.measurement_columns = [
            'ankle', 'arm-length', 'bicep', 'calf', 'chest', 'forearm',
            'height', 'hip', 'leg-length', 'shoulder-breadth',
            'shoulder-to-crotch', 'thigh', 'waist', 'wrist'
        ]

        # Converter colunas numéricas
        numeric_cols = ['height_cm', 'weight_kg'] + self.measurement_columns
        self.data[numeric_cols] = self.data[numeric_cols].apply(
            pd.to_numeric, errors='coerce'
        ).fillna(0)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        row = self.data.iloc[idx]
        photo_id = str(row['photo_id']).strip().lower()
        front_img_path = os.path.join(self.mask_dir, f"{photo_id}.png")

        if not os.path.exists(front_img_path):
            raise FileNotFoundError(f"Arquivo não encontrado: {front_img_path}")

        # Obter altura e peso
        height_weight = torch.tensor([row['height_cm'], row['weight_kg']], dtype=torch.float32)

        # Obter medições
        measurements = torch.tensor(
            row[self.measurement_columns].values.astype(np.float32),
            dtype=torch.float32
        )

        # Carregar e transformar imagem
        front_img = self.transform(Image.open(front_img_path))

        return (front_img, height_weight), measurements


# Versão simplificada do BMnet
class BMnet(nn.Module):
    def __init__(self):
        super(BMnet, self).__init__()
        self.backbone = mnasnet1_0(weights=MNASNet1_0_Weights.IMAGENET1K_V1)

        # Congelar os parâmetros do backbone
        for param in self.backbone.parameters():
            param.requires_grad = False

        self.backbone.classifier = nn.Identity()

        # Camadas fully connected
        self.fc = nn.Sequential(
            nn.Linear(1280 + 2, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 14)
        )

    def forward(self, x):
        images, height_weight = x
        batch_size = images.size(0)

        # Extrair features das imagens
        features = self.backbone(images)
        features = features.view(batch_size, -1)

        # Concatenar com altura e peso
        combined = torch.cat((features, height_weight), dim=1)

        # Passar pelas camadas fully connected
        return self.fc(combined)


# Função de treinamento básica
def train_model():
    # Carregar dados
    data_dir = "D:/Datasets/BodyM"  # Use barras normais para evitar problemas
    train_dataset = BodyMDataset(root_dir=data_dir, split="train", transform=transform)
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)

    # Inicializar modelo
    model = BMnet().to(device)
    criterion = nn.L1Loss()  # MAE é melhor para regressão
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.9)

    for epoch in range(EPOCHS):
        model.train()
        epoch_loss = 0

        for (inputs, hw), targets in train_loader:
            inputs = inputs.to(device)
            hw = hw.to(device)
            targets = targets.to(device)

            optimizer.zero_grad()
            outputs = model((inputs, hw))
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()

        scheduler.step()
        print(f"Epoch {epoch + 1}/{EPOCHS}, Loss: {epoch_loss / len(train_loader):.4f}")

    torch.save(model.state_dict(), "bmnet_basic.pth")
    print("Modelo treinado e salvo!")


if __name__ == "__main__":
    train_model()
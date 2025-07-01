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

# Dataset personalizado para BodyM
class BodyMDataset(Dataset):
    def __init__(self, root_dir, split="train", transform=None):
        self.mask_front_dir = os.path.join(root_dir, split, "mask")
        self.mask_side_dir = os.path.join(root_dir, split, "mask_left")
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
        front_img_path = os.path.join(self.mask_front_dir, f"{photo_id}.png")
        side_img_path = os.path.join(self.mask_side_dir, f"{photo_id}.png")

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
        side_img = self.transform(Image.open(side_img_path))

        return (front_img, side_img, height_weight), measurements


# Modelo simplificado BMnet
class BMnet(nn.Module):
    def __init__(self):
        super(BMnet, self).__init__()
        weights = MNASNet1_0_Weights.IMAGENET1K_V1

        self.backbone_front = mnasnet1_0(weights=weights)
        self.backbone_side = mnasnet1_0(weights=weights)

        for param in self.backbone_front.parameters():
            param.requires_grad = False
        for param in self.backbone_side.parameters():
            param.requires_grad = False

        self.backbone_front.classifier = nn.Identity()
        self.backbone_side.classifier = nn.Identity()

        self.fc = nn.Sequential(
            nn.Linear(1280 + 1280 + 2, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 14)
        )

    def forward(self, x):
        front_img, side_img, height_weight = x
        # Extrair features das imagens
        front_feat = self.backbone_front(front_img)
        side_feat = self.backbone_side(side_img)
        # Concatenar features + altura/peso
        combined = torch.cat((front_feat, side_feat, height_weight), dim=1)
        return self.fc(combined)


# Função de treinamento com avaliação
def train_model():
    data_dir = "D:/Datasets/BodyM"

    # Datasets e loaders
    train_dataset = BodyMDataset(root_dir=data_dir, split="train", transform=transform)
    test_dataset = BodyMDataset(root_dir=data_dir, split="testA", transform=transform)

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

    # Modelo e otimizador
    model = BMnet().to(device)
    criterion = nn.L1Loss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.9)

    for epoch in range(EPOCHS):
        model.train()
        epoch_loss = 0

        for (front, side, hw), targets in train_loader:
            front = front.to(device)
            side = side.to(device)
            hw = hw.to(device)
            targets = targets.to(device)

            optimizer.zero_grad()
            outputs = model((front, side, hw))
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()

        scheduler.step()

        avg_train_loss = epoch_loss / len(train_loader)
        print(f"Epoch {epoch + 1}/{EPOCHS}, Train Loss: {avg_train_loss:.4f}")

        # Avaliação no conjunto de teste
        model.eval()
        test_loss = 0
        with torch.no_grad():
            for (front, side, hw), targets in test_loader:
                front = front.to(device)
                side = side.to(device)
                hw = hw.to(device)
                targets = targets.to(device)

                outputs = model((front, side, hw))
                loss = criterion(outputs, targets)
                test_loss += loss.item()

        avg_test_loss = test_loss / len(test_loader)
        print(f"Epoch {epoch + 1}/{EPOCHS}, Test Loss: {avg_test_loss:.4f}")

    torch.save(model.state_dict(), "../models/bmnet.pth")
    print("Modelo treinado e salvo!")


if __name__ == "__main__":
    train_model()

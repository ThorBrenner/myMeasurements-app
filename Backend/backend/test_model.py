import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms
import pandas as pd
import os
from PIL import Image
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from torchvision.models import mnasnet1_0, MNASNet1_0_Weights


# Configurações
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BATCH_SIZE = 32


# 1. Definir a classe BMnet (igual à do treinamento)
class BMnet(nn.Module):
    def __init__(self):
        super(BMnet, self).__init__()

        from torchvision.models import mnasnet1_0, MNASNet1_0_Weights
        weights = MNASNet1_0_Weights.DEFAULT

        self.backbone_front = mnasnet1_0(weights=weights)
        self.backbone_side = mnasnet1_0(weights=weights)

        for param in self.backbone_front.parameters():
            param.requires_grad = False
        for param in self.backbone_side.parameters():
            param.requires_grad = False

        self.backbone_front.classifier = nn.Identity()
        self.backbone_side.classifier = nn.Identity()

        self.fc = nn.Sequential(
            nn.Linear(1280 * 2 + 2, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 14)
        )

    def forward(self, x):
        front_img, side_img, height_weight = x
        images, height_weight = x
        front_feat = self.backbone_front(front_img)
        side_feat = self.backbone_side(side_img)
        combined = torch.cat((front_feat, side_feat, height_weight), dim=1)
        return self.fc(combined)


# 2. Definir o Dataset (igual ao do treinamento)
class BodyMDataset(torch.utils.data.Dataset):
    def __init__(self, root_dir, split="testA", transform=None):
        self.mask_front_dir = os.path.join(root_dir, split, "mask")
        self.mask_side_dir = os.path.join(root_dir, split, "mask_left")
        self.mask_left_dir = os.path.join(root_dir, split, "mask_left")
        self.metadata = pd.read_csv(os.path.join(root_dir, split, "hwg_metadata.csv"))
        self.measurements = pd.read_csv(os.path.join(root_dir, split, "measurements.csv"))
        self.photo_map = pd.read_csv(
            os.path.join(root_dir, split, "subject_to_photo_map.csv"),
            dtype={'photo_id': str}
        )
        self.photo_map['photo_id'] = self.photo_map['photo_id'].str.strip().str.lower()
        self.transform = transform
        self.data = self.metadata.merge(
            self.measurements, on="subject_id"
        ).merge(
            self.photo_map, on="subject_id"
        )
        self.measurement_columns = [
            'ankle', 'arm-length', 'bicep', 'calf', 'chest', 'forearm',
            'height', 'hip', 'leg-length', 'shoulder-breadth',
            'shoulder-to-crotch', 'thigh', 'waist', 'wrist'
        ]
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

        height_weight = torch.tensor([row['height_cm'], row['weight_kg']], dtype=torch.float32)
        measurements = torch.tensor(
            row[self.measurement_columns].values.astype(np.float32),
            dtype=torch.float32
        )
        front_img = self.transform(Image.open(front_img_path))
        side_img = self.transform(Image.open(side_img_path))

        return (front_img, side_img, height_weight), measurements


# 3. Função para carregar o modelo treinado
def load_model(model_path):
    model = BMnet().to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    return model


# 4. Função para avaliar o modelo
def evaluate_model(model, test_loader):
    all_targets = []
    all_preds = []

    with torch.no_grad():
        for (front, side, hw), targets in test_loader:
            front = front.to(device)
            side = side.to(device)
            hw = hw.to(device)

            outputs = model((front, side, hw))

            all_targets.append(targets.cpu().numpy())
            all_preds.append(outputs.cpu().numpy())

    all_targets = np.concatenate(all_targets)
    all_preds = np.concatenate(all_preds)

    return all_targets, all_preds


# 5. Função principal
def main():
    # Configurações
    data_dir = "D:/Datasets/BodyM"  # Altere para seu caminho
    model_path = "bmnet.pth"  # Caminho para o modelo treinado

    # Transformações (iguais às do treinamento)
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.Grayscale(num_output_channels=3),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Carregar dados de teste
    test_dataset = BodyMDataset(root_dir=data_dir, split="testA", transform=transform)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

    # Carregar modelo
    model = load_model(model_path)

    # Avaliar
    targets, preds = evaluate_model(model, test_loader)

    # Calcular métricas
    measurement_columns = [
        'ankle', 'arm-length', 'bicep', 'calf', 'chest', 'forearm',
        'height', 'hip', 'leg-length', 'shoulder-breadth',
        'shoulder-to-crotch', 'thigh', 'waist', 'wrist'
    ]

    print("\nResultados no conjunto testA:")
    print("-" * 50)
    print(f"{'Medida':<20} | {'MAE (cm)':<10} | {'RMSE (cm)':<10}")
    print("-" * 50)

    for i, col in enumerate(measurement_columns):
        mae = mean_absolute_error(targets[:, i], preds[:, i])
        rmse = np.sqrt(mean_squared_error(targets[:, i], preds[:, i]))
        print(f"{col:<20} | {mae:<10.2f} | {rmse:<10.2f}")

    # Métricas globais
    global_mae = mean_absolute_error(targets, preds)
    global_rmse = np.sqrt(mean_squared_error(targets, preds))

    print("\nMétricas Globais:")
    print(f"MAE Médio: {global_mae:.2f} cm")
    print(f"RMSE Médio: {global_rmse:.2f} cm")


if __name__ == "__main__":
    main()
import torch
import torch.nn as nn
from torchvision.models import mnasnet1_0, MNASNet1_0_Weights

class BMnet(nn.Module):
    """
    Body Measurement Network - Modelo para predição de medidas corporais
    Combina features extraídas de imagem com altura e peso para estimar 14 medidas.
    """
    def __init__(self):
        super(BMnet, self).__init__()
        
        # Carrega o modelo MNASNet com pesos pré-treinados
        weights = MNASNet1_0_Weights.DEFAULT
        self.backbone = mnasnet1_0(weights=weights)
        
        # Congelar parâmetros do backbone
        for param in self.backbone.parameters():
            param.requires_grad = False
        
        # Remover classificador original
        self.backbone.classifier = nn.Identity()
        
        # Novo classificador: 1280 (features da imagem) + 2 (altura, peso)
        self.fc = nn.Sequential(
            nn.Linear(1280 + 2, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 14)  # 14 medidas corporais
        )

    def forward(self, x: tuple[torch.Tensor, torch.Tensor]) -> torch.Tensor:
        """
        Passagem direta pelo modelo.
        Args:
            x: tuple (images, height_weight)
                - images: tensor [batch_size, 3, 224, 224]
                - height_weight: tensor [batch_size, 2]
        Returns:
            Tensor [batch_size, 14] com as medidas preditas
        """
        images, height_weight = x

        # Extrai features visuais
        features = self.backbone(images)  # [batch_size, 1280]

        # Concatena features com altura e peso
        combined = torch.cat((features, height_weight), dim=1)  # [batch_size, 1282]

        return self.fc(combined)

    @property
    def measurement_columns(self) -> list:
        """Nomes das medidas corporais preditas pelo modelo"""
        return [
            'ankle', 'arm-length', 'bicep', 'calf', 'chest', 'forearm',
            'height', 'hip', 'leg-length', 'shoulder-breadth',
            'shoulder-to-crotch', 'thigh', 'waist', 'wrist'
        ]

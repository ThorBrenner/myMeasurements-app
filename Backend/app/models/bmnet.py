import torch
import torch.nn as nn
from torchvision.models import mnasnet1_0, MNASNet1_0_Weights

class BMnet(nn.Module):
    """
    Modelo para predição de medidas corporais usando 2 imagens (frontal e lateral) + altura e peso.
    """
    def __init__(self):
        super(BMnet, self).__init__()

        # Backbone com pesos pré-treinados
        weights = MNASNet1_0_Weights.DEFAULT
        self.backbone_front = mnasnet1_0(weights=weights)
        self.backbone_side = mnasnet1_0(weights=weights)

        # Congelar parâmetros
        for param in self.backbone_front.parameters():
            param.requires_grad = False
        for param in self.backbone_side.parameters():
            param.requires_grad = False

        # Remover os classificadores originais
        self.backbone_front.classifier = nn.Identity()
        self.backbone_side.classifier = nn.Identity()

        # Classificador final: 1280 (front) + 1280 (side) + 2 (altura/peso)
        self.fc = nn.Sequential(
            nn.Linear(1280 * 2 + 2, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 14)
        )

    def forward(self, x: tuple[torch.Tensor, torch.Tensor, torch.Tensor]) -> torch.Tensor:
        """
        Args:
            x: (front_image, side_image, height_weight)
            - front_image: [B, 3, 224, 224]
            - side_image: [B, 3, 224, 224]
            - height_weight: [B, 2]
        """
        front_image, side_image, height_weight = x

        # Extrai features das duas imagens
        front_feat = self.backbone_front(front_image)
        side_feat = self.backbone_side(side_image)

        # Concatena features + altura/peso
        combined = torch.cat((front_feat, side_feat, height_weight), dim=1)  # [B, 2562]

        return self.fc(combined)

    @property
    def measurement_columns(self) -> list:
        return [
            'ankle', 'arm-length', 'bicep', 'calf', 'chest', 'forearm',
            'height', 'hip', 'leg-length', 'shoulder-breadth',
            'shoulder-to-crotch', 'thigh', 'waist', 'wrist'
        ]

import torch
import torch.nn as nn

class BMnet(nn.Module):
    """
    Body Measurement Network - Modelo para predição de medidas corporais
    """
    def __init__(self):
        super(BMnet, self).__init__()
        
        # Backbone: MNASNet pré-treinado
        self.backbone = torch.hub.load('pytorch/vision', 'mnasnet1_0', pretrained=True)
        
        # Congelar parâmetros do backbone
        for param in self.backbone.parameters():
            param.requires_grad = False
        
        # Remover classificador original
        self.backbone.classifier = nn.Identity()
        
        # Classificador personalizado
        # 1280 features do MNASNet + 2 (altura e peso) = 1282 inputs
        self.fc = nn.Sequential(
            nn.Linear(1280 + 2, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 14)  # 14 medidas corporais
        )

    def forward(self, x):
        """
        Forward pass
        Args:
            x: tuple (images, height_weight)
                - images: tensor de imagens [batch_size, 3, 224, 224]
                - height_weight: tensor [batch_size, 2] (altura, peso)
        """
        images, height_weight = x
        
        # Extrair features da imagem
        features = self.backbone(images)
        
        # Combinar features da imagem com altura e peso
        combined = torch.cat((features, height_weight), dim=1)
        
        # Predição final
        return self.fc(combined)

    @property
    def measurement_columns(self):
        """Nomes das medidas preditas pelo modelo"""
        return [
            'ankle', 'arm-length', 'bicep', 'calf', 'chest', 'forearm',
            'height', 'hip', 'leg-length', 'shoulder-breadth',
            'shoulder-to-crotch', 'thigh', 'waist', 'wrist'
        ]
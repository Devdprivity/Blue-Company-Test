<?php

namespace App\Domain\Tasks\Enums;

enum TaskPriority: string
{
    case BAJA = 'baja';
    case MEDIA = 'media';
    case ALTA = 'alta';
}

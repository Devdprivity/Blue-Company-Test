<?php

namespace App\Domain\Tasks\Enums;

enum TaskStatus: string
{
    case PENDIENTE = 'pendiente';
    case EN_PROGRESO = 'en_progreso';
    case FINALIZADA = 'finalizada';
}

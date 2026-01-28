<?php

namespace App\Domain\Projects\Enums;

enum ProjectStatus: string
{
    case NUEVO = 'nuevo';
    case EN_PROGRESO = 'en_progreso';
    case COMPLETADO = 'completado';
}

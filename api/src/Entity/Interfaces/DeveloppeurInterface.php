<?php
namespace src\Entity\Interfaces;

/**
 * 
 * @author franck
 *
 */
interface DeveloppeurInterface
{    
    public function getTalents(): array;
    
    public function addTalent($talent): string;
    
}


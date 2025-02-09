// agent/src/blockchain/contracts/Pasanaco.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Pasanaco {
    struct Participante {
        address wallet;
        uint256 aporte;
    }

    Participante[] public participantes;

    function crearPasanaco() public {
        // Lógica para crear un pasanaco
    }

    function unirsePasanaco(uint256 monto) public {
        // Lógica para unirse a un pasanaco
        participantes.push(Participante(msg.sender, monto));
    }

    function realizarPago(uint256 monto) public {
        // Lógica para realizar un pago
    }

    function consultarParticipantes() public view returns (Participante[] memory) {
        return participantes;
    }
}
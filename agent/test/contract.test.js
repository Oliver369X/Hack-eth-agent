const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PasanakuSalas Contract", function () {
    let PasanakuSalas;
    let pasanakuSalas;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Obtener el contrato y las cuentas
        PasanakuSalas = await ethers.getContractFactory("PasanakuSalas");
        [owner, addr1, addr2] = await ethers.getSigners();

        // Desplegar el contrato
        pasanakuSalas = await PasanakuSalas.deploy();
        await pasanakuSalas.deployed();
    });

    it("Debería crear una sala correctamente", async function () {
        const txResponse = await pasanakuSalas.crearSala(100, true);
        await txResponse.wait();

        const sala = await pasanakuSalas.salas(0);
        expect(sala.creador).to.equal(owner.address);
        expect(sala.montoContribucion).to.equal(100);
        expect(sala.esPublica).to.equal(true);
    });

    it("Debería permitir a un usuario unirse a una sala", async function () {
        await pasanakuSalas.crearSala(100, true);
        const salaId = 0;

        // Unirse a la sala
        const txResponse = await pasanakuSalas.connect(addr1).unirseSala(salaId, { value: ethers.utils.parseEther("0.1") });
        await txResponse.wait();

        const sala = await pasanakuSalas.salas(salaId);
        expect(sala.direccionesParticipantes).to.include(addr1.address);
    });

    it("Debería permitir al creador establecer el monto de depósito", async function () {
        await pasanakuSalas.crearSala(100, true);
        const salaId = 0;

        await pasanakuSalas.establecerMontoDeposito(salaId, 50);
        const sala = await pasanakuSalas.salas(salaId);
        expect(sala.montoDeposito).to.equal(50);
    });

    // Agrega más pruebas según sea necesario...
}); 
import { type Bus, type Datapath, type Instruction } from "../types/types";
import {
  Adder,
  ALU,
  ALUControl,
  Control,
  CPUComponent,
  DataMemory,
  InstructionMemory,
  LeftShift,
  Mux,
  ProgramCounter,
  RegisterFile,
  SignExtend,
} from "./components";

export const instruction_choices: Instruction[] = [
  { value: "add", label: "ADD (R-type)", format: "R-type: add $rd, $rs, $rt" },
  { value: "sub", label: "SUB (R-type)", format: "R-type: sub $rd, $rs, $rt" },
  { value: "lw", label: "LW (I-type)", format: "I-type: lw $rt, offset($rs)" },
  { value: "sw", label: "SW (I-type)", format: "I-type: sw $rt, offset($rs)" },
  {
    value: "beq",
    label: "BEQ (I-type)",
    format: "I-type: beq $rs, $rt, offset",
  },
  { value: "j", label: "J (J-type)", format: "J-type: j target" },
];

const mips_cpu = {
  PC: new ProgramCounter(-250, 150, 30, 70),
  IM: new InstructionMemory(-180, 150, 80, 100),
  MuxIm: new Mux("Mux-IM", 10, 180, 30, 70),
  RF: new RegisterFile(80, 150, 80, 100),
  MuxRF: new Mux("Mux-RF-ALU", 220, 190, 30, 70),
  ALU: new ALU(300, 150, 60, 60),
  SEx: new SignExtend(100, 300, 50, 80),
  DM: new DataMemory(420, 150, 80, 100),
  MuxDM: new Mux("Mux-DM", 540, 180, 30, 70),
  LS: new LeftShift(250, 20, 60, 80),
  ADDPC: new Adder(-200, -50, 80, 80), // PC+4 Adder,
  ADDBr: new Adder(350, 20, 80, 80), // Branch Adder
  MuxAdd: new Mux("Mux-Adder", 500, 0, 30, 70),
  ALUCtrl: new ALUControl(320, 300, 30, 70),
  CON: new Control(50, 0, 50, 120),
};

export const components: CPUComponent[] = [
  mips_cpu.PC,
  mips_cpu.IM,
  mips_cpu.MuxIm,
  mips_cpu.RF,
  mips_cpu.MuxRF,
  mips_cpu.ALU,
  mips_cpu.SEx,
  mips_cpu.DM,
  mips_cpu.MuxDM,
  mips_cpu.LS,
  mips_cpu.ADDPC,
  mips_cpu.ADDBr,
  mips_cpu.ALUCtrl,
  mips_cpu.MuxAdd,
  mips_cpu.CON,
];

export const buses: Bus[] = [
  {
    id: mips_cpu.PC.addressOutPort.name + "-" + mips_cpu.IM.addressInPort.name,
    source: mips_cpu.PC.addressOutPort,
    fromComponentHeight: mips_cpu.PC.height,
    destination: mips_cpu.IM.addressInPort,
  },
  {
    id: mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.RF.readReg1Port.name,
    source: mips_cpu.IM.decodeOutPort,
    fromComponentHeight: mips_cpu.IM.height,
    destination: mips_cpu.RF.readReg1Port,
  },
  {
    id: mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.RF.writeRegPort.name,
    source: mips_cpu.IM.decodeOutPort,
    fromComponentHeight: mips_cpu.IM.height,
    destination: mips_cpu.RF.writeRegPort,
  },
  {
    id: mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.MuxIm.input1Port.name,
    source: mips_cpu.IM.decodeOutPort,
    fromComponentHeight: mips_cpu.IM.height,
    destination: mips_cpu.MuxIm.input1Port,
  },
  {
    id: mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.MuxIm.input2Port.name,
    source: mips_cpu.IM.decodeOutPort,
    fromComponentHeight: mips_cpu.IM.height,
    destination: mips_cpu.MuxIm.input2Port,
  },
  {
    id: mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.SEx.inputPort.name,
    source: mips_cpu.IM.decodeOutPort,
    fromComponentHeight: mips_cpu.IM.height,
    destination: mips_cpu.SEx.inputPort,
  },
  {
    id:
      mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.CON.instructionPort.name,
    source: mips_cpu.IM.decodeOutPort,
    fromComponentHeight: mips_cpu.IM.height,
    destination: mips_cpu.CON.instructionPort,
  },
  {
    id: mips_cpu.MuxIm.outputPort.name + "-" + mips_cpu.RF.readReg2Port.name,
    source: mips_cpu.MuxIm.outputPort,
    fromComponentHeight: mips_cpu.MuxIm.height,
    destination: mips_cpu.RF.readReg2Port,
  },
  {
    id: mips_cpu.RF.readData1Port.name + "-" + mips_cpu.ALU.aluOp1Port.name,
    source: mips_cpu.RF.readData1Port,
    fromComponentHeight: mips_cpu.RF.height,
    destination: mips_cpu.ALU.aluOp1Port,
  },
  {
    id: mips_cpu.RF.readData1Port.name + "-" + mips_cpu.MuxRF.input1Port.name,
    source: mips_cpu.RF.readData1Port,
    fromComponentHeight: mips_cpu.RF.height,
    destination: mips_cpu.MuxRF.input1Port,
  },
  {
    id: mips_cpu.RF.readData1Port.name + "-" + mips_cpu.DM.writeDataPort.name,
    source: mips_cpu.RF.readData1Port,
    fromComponentHeight: mips_cpu.RF.height,
    destination: mips_cpu.DM.writeDataPort,
  },
  {
    id: mips_cpu.MuxRF.outputPort.name + "-" + mips_cpu.ALU.aluOp2Port.name,
    source: mips_cpu.MuxRF.outputPort,
    fromComponentHeight: mips_cpu.MuxRF.height,
    destination: mips_cpu.ALU.aluOp2Port,
  },
  {
    id: mips_cpu.ALU.resultPort.name + "-" + mips_cpu.DM.addressInPort.name,
    source: mips_cpu.ALU.resultPort,
    fromComponentHeight: mips_cpu.ALU.height,
    destination: mips_cpu.DM.addressInPort,
  },
  {
    id: mips_cpu.ALU.resultPort.name + "-" + mips_cpu.MuxDM.input2Port.name,
    source: mips_cpu.ALU.resultPort,
    fromComponentHeight: mips_cpu.ALU.height,
    destination: mips_cpu.MuxDM.input2Port,
  },
  {
    id: mips_cpu.DM.readDataPort.name + "-" + mips_cpu.MuxDM.input1Port.name,
    source: mips_cpu.DM.readDataPort,
    fromComponentHeight: mips_cpu.DM.height,
    destination: mips_cpu.MuxDM.input1Port,
  },
  {
    id: mips_cpu.MuxDM.outputPort.name + "-" + mips_cpu.RF.writeDataPort.name,
    source: mips_cpu.MuxDM.outputPort,
    fromComponentHeight: mips_cpu.MuxDM.height,
    destination: mips_cpu.RF.writeDataPort,
  },
  {
    id: mips_cpu.SEx.outputPort.name + "-" + mips_cpu.LS.inputPort.name,
    source: mips_cpu.SEx.outputPort,
    fromComponentHeight: mips_cpu.SEx.height,
    destination: mips_cpu.LS.inputPort,
  },
  {
    id: mips_cpu.LS.outputPort.name + "-" + mips_cpu.ADDBr.input2Port.name,
    source: mips_cpu.LS.outputPort,
    fromComponentHeight: mips_cpu.LS.height,
    destination: mips_cpu.ADDBr.input2Port,
  },
  {
    id: mips_cpu.ADDBr.resultPort.name + "-" + mips_cpu.MuxAdd.input2Port.name,
    source: mips_cpu.ADDBr.resultPort,
    fromComponentHeight: mips_cpu.ADDBr.height,
    destination: mips_cpu.MuxAdd.input2Port,
  },
  // hello
  {
    id: mips_cpu.MuxAdd.outputPort.name + "-" + mips_cpu.PC.addressInPort.name,
    source: mips_cpu.MuxAdd.outputPort,
    fromComponentHeight: mips_cpu.MuxAdd.height,
    destination: mips_cpu.PC.addressInPort,
  },
  {
    id: mips_cpu.ADDPC.resultPort.name + "-" + mips_cpu.MuxAdd.input1Port.name,
    source: mips_cpu.ADDPC.resultPort,
    fromComponentHeight: mips_cpu.ADDPC.height,
    destination: mips_cpu.MuxAdd.input1Port,
  },
  {
    id: mips_cpu.PC.addressOutPort.name + "-" + mips_cpu.ADDBr.input1Port.name,
    source: mips_cpu.PC.addressOutPort,
    fromComponentHeight: mips_cpu.ADDPC.height,
    destination: mips_cpu.ADDBr.input1Port,
  },
];

export const datapaths: Datapath = {
  add: [
    {
      bus: {
        id: "0",
        source: mips_cpu.PC.addressOutPort,
        destination: mips_cpu.IM.addressInPort,
        fromComponentHeight: mips_cpu.PC.height,
      },
      stages: [0],
    },
    {
      bus: {
        id: "1",
        source: mips_cpu.PC.addressOutPort,
        destination: mips_cpu.ADDBr.input1Port,
        fromComponentHeight: mips_cpu.PC.height,
      },
      stages: [0],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.RF.readReg1Port.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.RF.readReg1Port,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.RF.writeRegPort.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.RF.writeRegPort,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.MuxIm.input1Port.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.MuxIm.input1Port,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.MuxIm.input2Port.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.MuxIm.input2Port,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id: mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.SEx.inputPort.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.SEx.inputPort,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name +
          "-" +
          mips_cpu.CON.instructionPort.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.CON.instructionPort,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.MuxIm.outputPort.name + "-" + mips_cpu.RF.readReg2Port.name,
        source: mips_cpu.MuxIm.outputPort,
        destination: mips_cpu.RF.readReg2Port,
        fromComponentHeight: mips_cpu.MuxIm.height,
      },
      stages: [1],
    },
    {
      bus: {
        id: mips_cpu.RF.readData1Port.name + "-" + mips_cpu.ALU.aluOp1Port.name,
        source: mips_cpu.RF.readData1Port,
        destination: mips_cpu.ALU.aluOp1Port,
        fromComponentHeight: mips_cpu.RF.height,
      },
      stages: [2],
    },
    {
      bus: {
        id:
          mips_cpu.RF.readData1Port.name + "-" + mips_cpu.MuxRF.input1Port.name,
        source: mips_cpu.RF.readData1Port,
        destination: mips_cpu.MuxRF.input1Port,
        fromComponentHeight: mips_cpu.RF.height,
      },
      stages: [2],
    },
    {
      bus: {
        id:
          mips_cpu.RF.readData1Port.name + "-" + mips_cpu.DM.writeDataPort.name,
        source: mips_cpu.RF.readData1Port,
        destination: mips_cpu.DM.writeDataPort,
        fromComponentHeight: mips_cpu.RF.height,
      },
      stages: [2],
    },
    {
      bus: {
        id: mips_cpu.MuxRF.outputPort.name + "-" + mips_cpu.ALU.aluOp2Port.name,
        source: mips_cpu.MuxRF.outputPort,
        destination: mips_cpu.ALU.aluOp2Port,
        fromComponentHeight: mips_cpu.MuxRF.height,
      },
      stages: [2],
    },
    {
      bus: {
        id: mips_cpu.ALU.resultPort.name + "-" + mips_cpu.DM.addressInPort.name,
        source: mips_cpu.ALU.resultPort,
        destination: mips_cpu.DM.addressInPort,
        fromComponentHeight: mips_cpu.ALU.height,
      },
      stages: [3],
    },
    {
      bus: {
        id: mips_cpu.ALU.resultPort.name + "-" + mips_cpu.MuxDM.input2Port.name,
        source: mips_cpu.ALU.resultPort,
        destination: mips_cpu.MuxDM.input2Port,
        fromComponentHeight: mips_cpu.ALU.height,
      },
      stages: [3],
    },
    {
      bus: {
        id:
          mips_cpu.DM.readDataPort.name + "-" + mips_cpu.MuxDM.input1Port.name,
        source: mips_cpu.DM.readDataPort,
        destination: mips_cpu.MuxDM.input1Port,
        fromComponentHeight: mips_cpu.DM.height,
      },
      stages: [3],
    },
    {
      bus: {
        id:
          mips_cpu.MuxDM.outputPort.name + "-" + mips_cpu.RF.writeDataPort.name,
        source: mips_cpu.MuxDM.outputPort,
        destination: mips_cpu.RF.writeDataPort,
        fromComponentHeight: mips_cpu.MuxDM.height,
      },
      stages: [4],
    },
    {
      bus: {
        id: mips_cpu.SEx.outputPort.name + "-" + mips_cpu.LS.inputPort.name,
        source: mips_cpu.SEx.outputPort,
        destination: mips_cpu.LS.inputPort,
        fromComponentHeight: mips_cpu.SEx.height,
      },
      stages: [2],
    },
    {
      bus: {
        id: mips_cpu.LS.outputPort.name + "-" + mips_cpu.ADDBr.input2Port.name,
        source: mips_cpu.LS.outputPort,
        destination: mips_cpu.ADDBr.input2Port,
        fromComponentHeight: mips_cpu.LS.height,
      },
      stages: [2],
    },
    {
      bus: {
        id:
          mips_cpu.ADDBr.resultPort.name +
          "-" +
          mips_cpu.MuxAdd.input2Port.name,
        source: mips_cpu.ADDBr.resultPort,
        destination: mips_cpu.MuxAdd.input2Port,
        fromComponentHeight: mips_cpu.ADDBr.height,
      },
      stages: [3],
    },
    {
      bus: {
        id:
          mips_cpu.MuxAdd.outputPort.name +
          "-" +
          mips_cpu.PC.addressInPort.name,
        source: mips_cpu.MuxAdd.outputPort,
        destination: mips_cpu.PC.addressInPort,
        fromComponentHeight: mips_cpu.MuxAdd.height,
      },
      stages: [4],
    },
    {
      bus: {
        id:
          mips_cpu.ADDPC.resultPort.name +
          "-" +
          mips_cpu.MuxAdd.input1Port.name,
        source: mips_cpu.ADDPC.resultPort,
        destination: mips_cpu.MuxAdd.input1Port,
        fromComponentHeight: mips_cpu.ADDPC.height,
      },
      stages: [3],
    },
  ],
  sw: [
    {
      bus: {
        id: "0",
        source: mips_cpu.PC.addressOutPort,
        destination: mips_cpu.IM.addressInPort,
        fromComponentHeight: mips_cpu.PC.height,
      },
      stages: [0],
    },
    {
      bus: {
        id: "1",
        source: mips_cpu.PC.addressOutPort,
        destination: mips_cpu.ADDBr.input1Port,
        fromComponentHeight: mips_cpu.PC.height,
      },
      stages: [0],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.RF.readReg1Port.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.RF.readReg1Port,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.RF.readReg2Port.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.RF.readReg2Port,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id: mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.SEx.inputPort.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.SEx.inputPort,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id: mips_cpu.RF.readData1Port.name + "-" + mips_cpu.ALU.aluOp1Port.name,
        source: mips_cpu.RF.readData1Port,
        destination: mips_cpu.ALU.aluOp1Port,
        fromComponentHeight: mips_cpu.RF.height,
      },
      stages: [2],
    },
    {
      bus: {
        id: mips_cpu.SEx.outputPort.name + "-" + mips_cpu.ALU.aluOp2Port.name,
        source: mips_cpu.SEx.outputPort,
        destination: mips_cpu.ALU.aluOp2Port,
        fromComponentHeight: mips_cpu.SEx.height,
      },
      stages: [2],
    },
    {
      bus: {
        id: mips_cpu.ALU.resultPort.name + "-" + mips_cpu.DM.addressInPort.name,
        source: mips_cpu.ALU.resultPort,
        destination: mips_cpu.DM.addressInPort,
        fromComponentHeight: mips_cpu.ALU.height,
      },
      stages: [3],
    },
    {
      bus: {
        id:
          mips_cpu.RF.readData2Port.name + "-" + mips_cpu.DM.writeDataPort.name,
        source: mips_cpu.RF.readData2Port,
        destination: mips_cpu.DM.writeDataPort,
        fromComponentHeight: mips_cpu.RF.height,
      },
      stages: [3],
    },
    {
      bus: {
        id:
          mips_cpu.ADDPC.resultPort.name + "-" + mips_cpu.PC.addressInPort.name,
        source: mips_cpu.ADDPC.resultPort,
        destination: mips_cpu.PC.addressInPort,
        fromComponentHeight: mips_cpu.ADDPC.height,
      },
      stages: [4],
    },
  ],
  beq: [
    {
      bus: {
        id: "0",
        source: mips_cpu.PC.addressOutPort,
        destination: mips_cpu.IM.addressInPort,
        fromComponentHeight: mips_cpu.PC.height,
      },
      stages: [0],
    },
    {
      bus: {
        id: "1",
        source: mips_cpu.PC.addressOutPort,
        destination: mips_cpu.ADDBr.input1Port,
        fromComponentHeight: mips_cpu.PC.height,
      },
      stages: [0],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.RF.readReg1Port.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.RF.readReg1Port,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.RF.readReg2Port.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.RF.readReg2Port,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name +
          "-" +
          mips_cpu.CON.instructionPort.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.CON.instructionPort,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id: mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.SEx.inputPort.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.SEx.inputPort,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id: mips_cpu.RF.readData1Port.name + "-" + mips_cpu.ALU.aluOp1Port.name,
        source: mips_cpu.RF.readData1Port,
        destination: mips_cpu.ALU.aluOp1Port,
        fromComponentHeight: mips_cpu.RF.height,
      },
      stages: [2],
    },
    {
      bus: {
        id: mips_cpu.RF.readData2Port.name + "-" + mips_cpu.ALU.aluOp2Port.name,
        source: mips_cpu.RF.readData2Port,
        destination: mips_cpu.ALU.aluOp2Port,
        fromComponentHeight: mips_cpu.RF.height,
      },
      stages: [2],
    },
    {
      bus: {
        id: mips_cpu.SEx.outputPort.name + "-" + mips_cpu.LS.inputPort.name,
        source: mips_cpu.SEx.outputPort,
        destination: mips_cpu.LS.inputPort,
        fromComponentHeight: mips_cpu.SEx.height,
      },
      stages: [2],
    },
    {
      bus: {
        id: mips_cpu.LS.outputPort.name + "-" + mips_cpu.ADDBr.input2Port.name,
        source: mips_cpu.LS.outputPort,
        destination: mips_cpu.ADDBr.input2Port,
        fromComponentHeight: mips_cpu.LS.height,
      },
      stages: [2],
    },
    {
      bus: {
        id:
          mips_cpu.ADDBr.resultPort.name +
          "-" +
          mips_cpu.MuxAdd.input2Port.name,
        source: mips_cpu.ADDBr.resultPort,
        destination: mips_cpu.MuxAdd.input2Port,
        fromComponentHeight: mips_cpu.ADDBr.height,
      },
      stages: [3],
    },
    {
      bus: {
        id:
          mips_cpu.ADDPC.resultPort.name +
          "-" +
          mips_cpu.MuxAdd.input1Port.name,
        source: mips_cpu.ADDPC.resultPort,
        destination: mips_cpu.MuxAdd.input1Port,
        fromComponentHeight: mips_cpu.ADDPC.height,
      },
      stages: [3],
    },
    {
      bus: {
        id:
          mips_cpu.MuxAdd.outputPort.name +
          "-" +
          mips_cpu.PC.addressInPort.name,
        source: mips_cpu.MuxAdd.outputPort,
        destination: mips_cpu.PC.addressInPort,
        fromComponentHeight: mips_cpu.MuxAdd.height,
      },
      stages: [4],
    },
  ],
  j: [
    {
      bus: {
        id: "0",
        source: mips_cpu.PC.addressOutPort,
        destination: mips_cpu.IM.addressInPort,
        fromComponentHeight: mips_cpu.PC.height,
      },
      stages: [0],
    },
    {
      bus: {
        id: "1",
        source: mips_cpu.PC.addressOutPort,
        destination: mips_cpu.ADDPC.input1Port,
        fromComponentHeight: mips_cpu.PC.height,
      },
      stages: [0],
    },
    {
      bus: {
        id:
          mips_cpu.IM.decodeOutPort.name +
          "-" +
          mips_cpu.CON.instructionPort.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.CON.instructionPort,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id: mips_cpu.IM.decodeOutPort.name + "-" + mips_cpu.LS.inputPort.name,
        source: mips_cpu.IM.decodeOutPort,
        destination: mips_cpu.LS.inputPort,
        fromComponentHeight: mips_cpu.IM.height,
      },
      stages: [1],
    },
    {
      bus: {
        id: mips_cpu.LS.outputPort.name + "-" + mips_cpu.MuxAdd.input2Port.name,
        source: mips_cpu.LS.outputPort,
        destination: mips_cpu.MuxAdd.input2Port,
        fromComponentHeight: mips_cpu.LS.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.ADDPC.resultPort.name +
          "-" +
          mips_cpu.MuxAdd.input1Port.name,
        source: mips_cpu.ADDPC.resultPort,
        destination: mips_cpu.MuxAdd.input1Port,
        fromComponentHeight: mips_cpu.ADDPC.height,
      },
      stages: [1],
    },
    {
      bus: {
        id:
          mips_cpu.MuxAdd.outputPort.name +
          "-" +
          mips_cpu.PC.addressInPort.name,
        source: mips_cpu.MuxAdd.outputPort,
        destination: mips_cpu.PC.addressInPort,
        fromComponentHeight: mips_cpu.MuxAdd.height,
      },
      stages: [4],
    },
  ],
};

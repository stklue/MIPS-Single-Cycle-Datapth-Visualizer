export interface Instruction {
  value: string;
  label: string;
  format: string;
}

export type ComponentType =
  | "register"
  | "memory"
  | "adder"
  | "alu"
  | "signex"
  | "pc"
  | "mux"
  | "shiftleft"
  | "control"
  | "bus";

// export interface Component {
//   id: number;
//   type: ComponentType;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   label: string;
//   ports: Port[];
// }

export class Component {
  id: number;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  ports: Port[];
  constructor(
    id: number,
    type: ComponentType,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    ports: Port[]
  ) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.ports = ports;
  }
}

type PortType = "" | "In" | "Out";

export class Port {
  id: PortName;
  name: PortName;
  portType: PortType;
  x: number;
  y: number;
  constructor(name: PortName, portType: PortType, x: number, y: number) {
    this.id = name;
    this.name = name;
    this.x = x;
    this.y = y;
    this.portType = portType;
  }
}

export type PortName =
  | ""
  // Instruction Memory
  | "INSTRADDRESSIN"
  | "INSTRDECODEOUT"
  //  Program Counter
  | "PCADDRESSIN"
  | "PCADDRESSOUT"
  // Mux
  | "MUXIN1"
  | "MUXIN2"
  | "MUXOUT"
  // Register File
  | "REGREADREG1"
  | "REGREADREG2"
  | "REGWRITEREG"
  | "REGREADDATA1"
  | "REGREADDATA2"
  | "REGWRITEDATA"
  // ALU
  | "ALUOP1"
  | "ALUOP2"
  | "ALURESULT"
  // Sign Extend
  | "SIGNEXIN"
  | "SIGNEXOUT"
  // Shift Left
  | "LEFTSHIN"
  | "LEFTSHOUT"
  // Adder
  | "ADDIN1"
  | "ADDIN2"
  | "ADDRESULT"
  // Data Memory
  | "MEMADDRESSIN"
  | "MEMWRITEADDRESS"
  | "MEMWRITEDATA"
  | "MEMREADDATA"
  // Control
  | "CONTROLIN"
  | "REGDST"
  | "BRANCH"
  | "MEMREAD"
  | "MEMTOREG"
  | "ALUOP"
  | "MEMWRITE"
  | "ALUSRC"
  | "REGWRITE"
  // ALU Control
  | "ALUOPIN"
  | "ALUOPOUT";

export interface Point {x: number; y: number}

export interface Bus {
  id: string;
  source: Port;
  destination: Port;
  fromComponentHeight: number;
  color?: string;
  width?: number;
}
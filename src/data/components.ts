import { Port, type ComponentType } from "../types/types.js";
export class CPUComponent {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ComponentType;

  label: string;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    type: ComponentType
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.type = type;
  }

  getPorts(): Port[] {
    return [];
  }
}

export class InstructionMemory extends CPUComponent {
  addressInPort: Port;
  decodeOutPort: Port;
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h, "Instruction Memory", "memory");
    this.addressInPort = new Port("INSTRADDRESSIN", "In", x , y + h * 0.5);
    this.decodeOutPort = new Port("INSTRDECODEOUT", "Out", x + w, y + h * 0.5);
  }
  getPorts(): Port[] {
    return [this.addressInPort, this.decodeOutPort];
  }
}

export class ProgramCounter extends CPUComponent {
  addressInPort: Port;
  addressOutPort: Port;
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h, "PC", "pc");
    this.addressOutPort = new Port("PCADDRESSOUT", "Out", x + w, y + h * 0.5);
    this.addressInPort = new Port("PCADDRESSIN", "In", x, y + h * 0.5);
  }

  getPorts(): Port[] {
    return [this.addressInPort, this.addressOutPort];
  }
}

export class Mux extends CPUComponent {
  id: string;
  input1Port: Port;
  input2Port: Port;
  outputPort: Port;
  constructor(id: string, x: number, y: number, width: number, height: number) {
    super(x, y, width, height, id, "mux");
    this.id = id;
    this.input1Port = new Port("MUXIN1", "In", x, y + this.height * 0.3);
    this.input2Port = new Port("MUXIN2", "In", x, y + this.height * 0.7);
    this.outputPort = new Port(
      "MUXOUT",
      "Out",
      x + this.width,
      y + this.height * 0.5
    );
  }

  getPorts(): Port[] {
    return [this.input1Port, this.input2Port, this.outputPort];
  }
}

/** Register File */
export class RegisterFile extends CPUComponent {
  readReg1Port: Port;
  readReg2Port: Port;
  writeRegPort: Port;
  writeDataPort: Port;
  readData1Port: Port;
  readData2Port: Port;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, "Register File", "register");
    this.readReg1Port = new Port(
      "REGREADREG1",
      "In",
      x,
      y + this.height * 0.25
    );
    this.readReg2Port = new Port("REGREADREG2", "In", x, y + this.height * 0.5);
    this.writeRegPort = new Port("REGWRITEREG", "In", x, y + this.height * 0.7);
    this.writeDataPort = new Port(
      "REGWRITEDATA",
      "In",
      x,
      y + this.height * 0.9
    );
    this.readData1Port = new Port(
      "REGREADDATA1",
      "Out",
      x + this.width,
      y + this.height * 0.35
    );
    this.readData2Port = new Port(
      "REGREADDATA2",
      "Out",
      x + this.width,
      y + this.height * 0.65
    );
  }

  getPorts(): Port[] {
    return [
      this.readReg1Port,
      this.readReg2Port,
      this.writeRegPort,
      this.writeDataPort,
      this.readData1Port,
      this.readData2Port,
    ];
  }
}

/**  ALU */
export class ALU extends CPUComponent {
  aluOp1Port: Port;
  aluOp2Port: Port;
  resultPort: Port;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, "ALU", "alu");
    this.aluOp1Port = new Port(
      "ALUOP1",
      "In",
      x,
      y + ((this.height * 1) / 3) * 0.5
    );
    this.aluOp2Port = new Port("ALUOP2", "In", x, y + this.height * 0.75);
    this.resultPort = new Port(
      "ALURESULT",
      "Out",
      x + this.width,
      y + this.height * 0.5
    );
  }

  getPorts(): Port[] {
    return [this.aluOp1Port, this.aluOp2Port, this.resultPort];
  }
}

/**  SignExtend  */
export class SignExtend extends CPUComponent {
  inputPort: Port;
  outputPort: Port;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, "Sign Extend", "signex");
    this.inputPort = new Port("SIGNEXIN", "In", x, y + this.height / 2);
    this.outputPort = new Port(
      "SIGNEXOUT",
      "Out",
      x + this.width,
      y + this.height / 2
    );
  }

  getPorts(): Port[] {
    return [this.inputPort, this.outputPort];
  }
}

export class LeftShift extends CPUComponent {
  inputPort: Port;
  outputPort: Port;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, "Left Shift", "shiftleft");
    this.inputPort = new Port("LEFTSHIN", "In", x, y + this.height / 2);
    this.outputPort = new Port(
      "LEFTSHOUT",
      "Out",
      x + this.width,
      y + this.height / 2
    );
  }
  getPorts(): Port[] {
    return [this.inputPort, this.outputPort];
  }
}

export class Adder extends CPUComponent {
  input1Port: Port;
  input2Port: Port;
  resultPort: Port;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, "Adder", "adder");
    this.input1Port = new Port(
      "ADDIN1",
      "In",
      x,
      y + ((this.height * 1) / 3) * 0.5
    );
    this.input2Port = new Port("ADDIN2", "In", x, y + this.height * 0.8);
    this.resultPort = new Port(
      "ADDRESULT",
      "Out",
      x + this.width,
      y + this.height * 0.45
    );
  }

  getPorts(): Port[] {
    return [this.input1Port, this.input2Port, this.resultPort];
  }
}

/** Data Memory  */
export class DataMemory extends CPUComponent {
  addressInPort: Port;
  writeAddressPort: Port;
  writeDataPort: Port;
  readDataPort: Port;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, "Data Memory", "memory");
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.addressInPort = new Port("MEMADDRESSIN", "In", x, y + height * 0.2);
    this.writeAddressPort = new Port(
      "MEMWRITEADDRESS",
      "In",
      x,
      y + height * 0.6
    );
    this.writeDataPort = new Port("MEMWRITEDATA", "In", x, y + height * 0.8);
    this.readDataPort = new Port(
      "MEMREADDATA",
      "Out",
      x + width,
      y + height * 0.5
    );
  }

  getPorts(): Port[] {
    return [
      this.addressInPort,
      this.writeAddressPort,
      this.writeDataPort,
      this.readDataPort,
    ];
  }
}
export class Control extends CPUComponent {
  // Initialize all ports with default values
  instructionPort: Port = new Port("", "", 0, 0);
  regDstPort: Port = new Port("", "", 0, 0);
  branchPort: Port = new Port("", "", 0, 0);
  memReadPort: Port = new Port("", "", 0, 0);
  memToRegPort: Port = new Port("", "", 0, 0);
  aluOpPort: Port = new Port("", "", 0, 0);
  memWritePort: Port = new Port("", "", 0, 0);
  aluSrcPort: Port = new Port("", "", 0, 0);
  regWritePort: Port = new Port("", "", 0, 0);

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, "Control", "control");

    const rx = width / 2; // Horizontal radius
    const ry = height / 2; // Vertical radius
    const cx = x + rx; // Center x
    const cy = y + ry; // Center y

    // INPUT PORT (left side)
    this.instructionPort = new Port(
      "CONTROLIN",
      "In",
      cx - rx, // Leftmost point (x - radius)
      cy // Vertical center
    );

    // OUTPUT PORTS (right side)
    const portCount = 8;
    const startAngle = -Math.PI / 4; // Start at -45° (top-right)
    const endAngle = Math.PI / 4; // End at +45° (bottom-right)
    const angleStep = (endAngle - startAngle) / (portCount - 1);

    // Create output ports along right curve
    for (let i = 0; i < portCount; i++) {
      const angle = startAngle + angleStep * i;
      const portX = cx + rx * Math.cos(angle);
      const portY = cy + ry * Math.sin(angle);

      switch (i) {
        case 0:
          this.regDstPort = new Port("REGDST", "Out", portX, portY);
          break;
        case 1:
          this.branchPort = new Port("BRANCH", "Out", portX, portY);
          break;
        case 2:
          this.memReadPort = new Port("MEMREAD", "Out", portX, portY);
          break;
        case 3:
          this.memToRegPort = new Port("MEMTOREG", "Out", portX, portY);
          break;
        case 4:
          this.aluOpPort = new Port("ALUOP", "Out", portX, portY);
          break;
        case 5:
          this.memWritePort = new Port("MEMWRITE", "Out", portX, portY);
          break;
        case 6:
          this.aluSrcPort = new Port("ALUSRC", "Out", portX, portY);
          break;
        case 7:
          this.regWritePort = new Port("REGWRITE", "Out", portX, portY);
          break;
      }
    }
  }

  getPorts(): Port[] {
    return [
      this.instructionPort,
      this.regDstPort,
      this.branchPort,
      this.memReadPort,
      this.memToRegPort,
      this.aluOpPort,
      this.memWritePort,
      this.aluSrcPort,
      this.regWritePort,
    ];
  }
}

export class ALUControl extends CPUComponent {
  aluOpPort: Port;
  operationPort: Port;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, "ALU Control", "control");

    // Input ports (left side)
    this.aluOpPort = new Port("ALUOPIN", "In", x, y + height * 0.5);

    // Output port (right side)
    this.operationPort = new Port(
      "ALUOPOUT",
      "Out",
      x + width,
      y + height * 0.5
    );
  }

  getPorts(): Port[] {
    return [this.aluOpPort, this.operationPort];
  }
}

export class Bus extends CPUComponent {
  fromX: number;
  fromY: number;
  endX: number;
  endY: number;
  id: string;
  constructor(
    id: string,
    x: number,
    ex: number,
    ey: number,
    y: number,
    width: number,
    height: number
  ) {
    super(x, y, width, height, id, "bus");
    this.id = id;
    this.fromX = x;
    this.fromY = y;
    this.endX = ex;
    this.endY = ey;
  }
}

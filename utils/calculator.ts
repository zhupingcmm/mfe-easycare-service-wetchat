export interface MaternityLeaveResult {
  totalDays: number;
  baseDays: number;
  bonusDays: number;
  startDate: string;
  endDate: string;
  details: string[];
}

export interface AllowanceResult {
  totalAmount: number;
  maternityAllowance: number;
  medicalAllowance: number;
  details: string[];
}

export class MaternityCalculator {
  static calculateLeave(
    dueDate: Date,
    isFirstChild: boolean = true,
    isCesarean: boolean = false,
    isMultipleBirth: boolean = false,
    age: number = 25
  ): MaternityLeaveResult {
    let baseDays = 98;
    let bonusDays = 0;
    const details: string[] = [];

    details.push(`基础产假：${baseDays}天`);

    if (isCesarean) {
      bonusDays += 15;
      details.push(`剖宫产增加：15天`);
    }

    if (isMultipleBirth) {
      bonusDays += 15;
      details.push(`多胞胎增加：15天`);
    }

    if (age >= 24 && isFirstChild) {
      bonusDays += 30;
      details.push(`晚育假（24岁以上初育）：30天`);
    }

    const totalDays = baseDays + bonusDays;
    
    const startDate = new Date(dueDate);
    startDate.setDate(startDate.getDate() - 15);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalDays);

    return {
      totalDays,
      baseDays,
      bonusDays,
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
      details
    };
  }

  static calculateAllowance(
    avgSalary: number,
    monthsWorked: number = 12,
    socialSecurityBase: number = 0
  ): AllowanceResult {
    const details: string[] = [];
    
    const actualBase = socialSecurityBase > 0 ? socialSecurityBase : avgSalary;
    
    const maternityAllowance = (actualBase / 30) * 98;
    details.push(`生育津贴 = (缴费基数 ${actualBase.toFixed(2)} / 30) × 98天`);
    details.push(`生育津贴：¥${maternityAllowance.toFixed(2)}`);

    const medicalAllowance = monthsWorked >= 12 ? 3000 : 1500;
    details.push(`生育医疗费用：¥${medicalAllowance.toFixed(2)}`);
    details.push(monthsWorked >= 12 ? '（连续缴费满12个月）' : '（连续缴费不满12个月）');

    const totalAmount = maternityAllowance + medicalAllowance;

    return {
      totalAmount,
      maternityAllowance,
      medicalAllowance,
      details
    };
  }

  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
